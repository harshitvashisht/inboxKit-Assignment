import express ,{json, Request , Response} from 'express'
import { prismaClient } from '@repo/db/client'
import bcrypt from 'bcrypt'
import { JWT_SECRET } from '@repo/backend-common/config'
import jwt from "jsonwebtoken"
import { COLOURS } from './colour'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())


app.post('/signup' , async function(req ,res){
    try {
        const {username , password } = req.body

        const existinguser = await prismaClient.user.findUnique({where : {username : username}})
        if(existinguser) {
          return res.json({
            message : "user Already Exists !"
          })
        }
          
           const hashedpassword = await bcrypt.hash(password ,10)

           const colour: string = COLOURS[Math.floor(Math.random() * COLOURS.length)] || '#7DD3FC'

           const newuser = await prismaClient.user.create({data : {
             username,
             password : hashedpassword,
             colour
           }})

           return res.json({
             message : "user-created",
             newuser
           })
           } catch (error) {
             return res.status(500).json({
            message: "Server Error"
          });
    }
})

app.post('/signin' , async function(req ,res){
     const {username , password} = req.body

     const user = await prismaClient.user.findUnique({where:{username}})

      if(!user){
      res.json({
        message : "No User Found"
      })
      return;
     } 
        const passwordmatch = await bcrypt.compare(password, user.password)

     if(!passwordmatch){
      return res.json({
        message: "Password Not Matched"
      })
     }const token = jwt.sign({
         id: user.id.toString(),
         colour : user.colour 
      },JWT_SECRET,{expiresIn: '1h'})

      res.json({
        message :"user Signed In" ,
        token,
        username : user.username,
        colour : user.colour,
        userId : user.id
      })


})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})


app.get('/claimed-blocks', async (req, res) => {
    try {
        const blocks = await prismaClient.block.findMany({
            where: { ownerId: { not: null } },
            include: {
                owner: { select: { username: true, colour: true } }
            }
        })

        res.json({
            blocks: blocks.map(b => ({
                blockId: b.id,
                x: b.x,
                y: b.y,
                ownerId: b.ownerId as string,
                username: b.owner?.username ?? 'Unknown',
                colour: b.owner?.colour ?? '#000000',
                claimedAt: b.claimedAt
            }))
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})