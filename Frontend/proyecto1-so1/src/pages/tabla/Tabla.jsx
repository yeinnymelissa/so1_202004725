import { useParams } from "react-router-dom"

export const Tabla = () =>{
    const {huevo} = useParams()
    return <h1>TABLA {huevo}</h1>
}