import express ,{json, Request , Response} from 'express'
import { prismaClient } from '@repo/db/client'


const app = express()

app.use(express.json())


app.post('/test' , async function(req ,res){

  const {username , password} = req.body


   
    const user = await prismaClient.user.create({data : {
      username,
      password
    }})
    return res.json({
      message : "user-created",
      user
    })
})


app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})