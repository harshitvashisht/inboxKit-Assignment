import { EventHandler } from "react"

interface ButtonProps {
    label : string,
    onclick?: () => void
}

export default function Button({label ,onclick}: ButtonProps){
   return <div>    
    <button type="button" onClick={onclick} className="text-white cursor-hover bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-10 py-2.5 text-center me-2 mb-2">{label}</button>

</div> 
}