"use client"
import axios from "axios";
import Button from "./button";
import Heading from "./heading";
import Input from "./input";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FloatingOrb from "./floatingord";


interface AuthPageProps {
    type : "signin" | "signup"
}

export default function AuthPage({type}: AuthPageProps){

    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [loader , setLoader] = useState(false)
    

      async function handleSignUp(){

           const password = passwordRef.current?.value || "";
           const username = usernameRef.current?.value || ""
           setLoader(true)
           const response = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/signin` ,{
                     password,
                     username
           }
        )
         alert("User Signed up") 
         router.push('/signin')
          setLoader(false) 
       }
       
       async function handleSignIn(){
                setLoader(true)
           const username = usernameRef.current?.value || "";
           const password = passwordRef.current?.value  || "";

           const response = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/signup`,{
                 username,
                 password,
           })
          if (!response.data.token) {
          alert("Invalid username or password");
          setLoader(false);
          return;
    }   
          const { colour , userId } = response.data 

           const jwt = response.data.token 
           localStorage.setItem('token',jwt)
           localStorage.setItem('username', username)
           localStorage.setItem('colour', colour)
           localStorage.setItem('userId',userId)

           alert('User Siged In !')
           router.push('/BoardPage')
           setLoader(false)
        
       }

    if(type == "signin"){

       return  <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-white
       -900/20 to-cyan-900/20">
                 <div className="absolute inset-0 overflow-hidden">
                <FloatingOrb index={0} size={300} position={{top: '10%', left: '10%'}} delay={0} color="rgba(147, 51, 234, 0.4)" />
                <FloatingOrb index={1} size={200} position={{top: '60%', right: '10%'}} delay={2} color="rgba(6, 182, 212, 0.4)" />
                <FloatingOrb index={2} size={250} position={{bottom: '20%', left: '20%'}} delay={4} color="rgba(168, 85, 247, 0.3)" />
                <FloatingOrb index={3} size={150} position={{top: '30%', right: '30%'}} delay={1} color="rgba(14, 165, 233, 0.3)" />
              </div>
           <div className="group p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 bg-gray-800/50 backdrop-blur-md">
           <div>
            <h1 className="text-2xl flex justify-center text-white test-bold">
                <Heading label="SignIn"/>
            </h1> <div className="mt-2">
            <Input referannce={usernameRef} label="Username" Placeholder="your username"/></div>
            <div className="mt-2">
            <Input referannce={passwordRef} label="Password " Placeholder="**********" />
            </div>
           </div>
         {loader ? (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <Button onclick={handleSignIn} label="SignIn" />
          </div>
        )}
          </div>
       </div>
    }
       return <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-white
       -900/20 to-cyan-900/20">
          <div className="absolute inset-0 overflow-hidden">
                <FloatingOrb index={0} size={300} position={{top: '10%', left: '10%'}} delay={0} color="rgba(140, 151, 139, 0.4)" />
                <FloatingOrb index={1} size={200} position={{top: '60%', right: '10%'}} delay={2} color="rgba(6, 182, 212, 0.4)" />
                <FloatingOrb index={2} size={250} position={{bottom: '20%', left: '20%'}} delay={4} color="rgba(168, 85, 247, 0.3)" />
                <FloatingOrb index={3} size={150} position={{top: '30%', right: '30%'}} delay={1} color="rgba(14, 165, 233, 0.3)" />
              </div>
           <div  className="group p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 bg-gray-800/50 backdrop-blur-md">
            <div>
            <h1 className="text-2xl flex justify-center text-white test-bold">
                <Heading label="SignUp"/>
            </h1> <div className="">
            <div className="mt-2 flex flex-row ">
            <Input referannce={usernameRef} label="Username" Placeholder="Username"/>
            <Input referannce={passwordRef} label="Password " Placeholder="**********" />
            </div>
            </div>
           </div>
           {loader ? (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="mt-4 flex justify-center">
            <Button onclick={handleSignUp} label="SignUp" />
          </div>
        )}
          </div>
       </div>
    
}