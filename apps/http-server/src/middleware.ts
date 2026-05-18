import express ,{NextFunction, Request  , Response} from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";

interface AuthRequest extends Request {
  id?: string;
}

function authMiddleware (req : AuthRequest, res : Response , next  : NextFunction){

       const token = req.headers.authorization; 

       if(!token) {
        return res.json({
            message: "No Token Provided"
        })
       }
       try {
        
        const decodedtoken = jwt.verify(token , JWT_SECRET) as { id: string }
        if(decodedtoken){
            req.id = decodedtoken.id
            next()
        }else{
            return res.json({message: 'UnAuthorized'})
        }
      
       } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
       }
       
}

export default authMiddleware;