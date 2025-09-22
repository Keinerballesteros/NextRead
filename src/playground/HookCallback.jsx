import React from "react";  
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
function HookCallback() {

    const [filtro, setFiltro] = useState("");

    const usuarios = ["Ana", "Luis", "Pedro", "Maria", "Juan"];


    const getFilteredUsers = useCallback(() => {
        return usuarios.filter((user) => user.toLowerCase().includes(filtro.toLowerCase()));
    }, [filtro])

    return(
        <div className="w-full h-full flex flex-col items-center justify-center p-5 gap-3">
        <h1 className="items-center font-bold text-3xl">Hook CallBack</h1>
        <input className="input input-accent" type="text" placeholder="Filtrar usuarios" value={filtro} onChange={(e) => setFiltro(e.target.value)}></input>
        <ul>
            {getFilteredUsers().map((user, index) => (
                <li key={index}>{user}</li>
            ))}
        </ul>

         <Link to="/home" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
        </div>
    )
}

export default HookCallback;