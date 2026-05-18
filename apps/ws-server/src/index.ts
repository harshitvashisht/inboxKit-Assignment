import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { decode } from 'jsonwebtoken'
import { prismaClient } from '@repo/db/client'



const wss = new WebSocketServer ({port: 8080})

const clients = new Map<WebSocket, { id: string; username: string; colour: string }>()

wss.on('connection' ,(ws ,req)=>{

    const token = req.url?.split('token=')[1]
    if(!token){
        ws.close(1008, "token Required")
        return ;
    }
    jwt.verify(token , JWT_SECRET , (err ,decodedToken)=>{
         if (err || !decodedToken || typeof decodedToken === 'string') {
        ws.close(1008, "Invalid Token")
        return;
    }
        const { id, username, colour } = decodedToken as jwt.JwtPayload & {
            id: string
            username: string
            colour: string
        }
         clients.set(ws,{username , colour  , id})
         ws.send(JSON.stringify({type : 'system' , message : "Welcome to WebsocketServer"}))

         ws.on('message', async(data)=>{
              try {

                const message = JSON.parse(data.toString())
                const client = clients.get(ws)

                if (!client) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }))
                    return
                }
                
                switch (message.type){
                    case 'get-board' : {
                        const blocks = await prismaClient.block.findMany({where :{
                             ownerId: { not: null }},
                            include: { owner: { select: { username: true, colour: true  } } }
                            }
                        )
                        ws.send(JSON.stringify({
                            type : 'board-state',
                            blocks: blocks.map(b=>({
                                blockId: b.id,
                                x: b.x,
                                y: b.y,
                                ownerId: b.ownerId,
                                username: b.owner?.username as string,
                                colour: b.owner?.colour ?? '#000000',
                                claimedAt: b.claimedAt
                            }))
                        }))
                        break
                    }
                         case 'claim_block': {
                        const { x, y } = message


                        const existing = await prismaClient.block.findUnique({
                            where: { x_y: { x, y } },
                            include: { owner: { select: { username: true, colour: true } } }
                        })

                        if (existing?.ownerId) {
                            ws.send(JSON.stringify({
                                type: 'claim_rejected',
                                x,
                                y,
                                reason: 'Block already owned',
                                ownedBy: {
                                    username: existing.owner?.username,
                                    colour: existing.owner?.colour
                                }
                            }))
                            return
                        }
                         const block = await prismaClient.block.upsert({
                            where: { x_y: { x, y } },
                            update: {
                                ownerId: client.id,
                                claimedAt: new Date()
                            },
                            create: {
                                x,
                                y,
                                ownerId: client.id,
                                claimedAt: new Date()
                            }
                        })
                            const payload = JSON.stringify({
                            type: 'block_claimed',
                            blockId: block.id,
                            x: block.x,
                            y: block.y,
                            ownerId: client.id,
                            username: client.username,
                            colour: client.colour,
                            claimedAt: block.claimedAt
                        })

                       let sentCount = 0
                        wss.clients.forEach((clientWs) => {
                            if (clientWs.readyState === WebSocket.OPEN) {
                                clientWs.send(payload)
                                sentCount++
                            }
                        })
                        break
                    }
                     case 'release_block': {
                        const { x, y } = message

                        const block = await prismaClient.block.findUnique({
                            where: { x_y: { x, y } }
                        })

                        // Only owner can release
                        if (!block || block.ownerId !== client.id) {
                            ws.send(JSON.stringify({
                                type: 'error',
                                message: 'You do not own this block'
                            }))
                            return
                        }

                        await prismaClient.block.update({
                            where: { x_y: { x, y } },
                            data: {
                                ownerId: null,
                                claimedAt: null
                            }
                        })

                        wss.clients.forEach((clientWs) => {
                            if (clientWs.readyState === WebSocket.OPEN) {
                                clientWs.send(JSON.stringify({
                                    type: 'block_released',
                                    x,
                                    y
                                }))
                            }
                        })

                        break
                    }
                }

              } catch (error) {
                console.error(err)
                ws.send(JSON.stringify({ type: 'error', message: 'Something went wrong' }))
              }
         })


           ws.on('close', () => {
            clients.delete(ws)
            console.log(`Client ${id} disconnected`)
        })
          
    })

})