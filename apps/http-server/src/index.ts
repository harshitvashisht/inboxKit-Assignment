import express ,{json, Request , Response} from 'express'
import { prismaClient } from '@repo/db/client'
import bcrypt from 'bcrypt'
import { JWT_SECRET } from '@repo/backend-common/config'
import jwt from "jsonwebtoken"
import { COLOURS } from './colour'

const app = express()

app.use(express.json())


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
        colour : user.colour
      })


})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})