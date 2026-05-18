
interface HeadingProps {
    label : string
}

export default function Heading ({label} : HeadingProps){
  
    return <div>
        <h1>{label}</h1>
    </div>
}