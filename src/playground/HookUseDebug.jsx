import React, { useState, useEffect, useDebugValue } from 'react';
import { Link } from 'react-router-dom';
function useOnlineStatus(){
    const [isOnline,setIsOnline] = useState(true);

    useDebugValue(isOnline ? "En linea" : "Desconectado");

    useEffect(() => {
        const interval = setInterval(() => {
            setIsOnline(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    },[]);
    return isOnline;
}
    

    function HookUseDebug(){
        const isOnline = useOnlineStatus();
        return(
        <div className='flex flex-col'>
        <h1 className='mt-2 flex items-center justify-center font-bold text-3xl text-secondary'>Hook UseDebug</h1>
        <h1 className='mt-2 flex items-center justify-center font-bold text-3xl'>
            {isOnline ? "En linea" : "Desconectado"}
        </h1>

        <button className='flex items-center justify-center'>
            <Link to="/home" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
        </button>
        </div>
        )
    }
    

export default HookUseDebug;
