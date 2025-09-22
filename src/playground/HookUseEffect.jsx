import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
export default function HookUseEffect() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    console.log("El contador cambió a:", contador);
  }, [contador]); // Se ejecuta cada vez que cambia 'contador'

  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-5 gap-3'>
        <h1 className='text-5xl font-extrabold'>Hook UseEffect</h1>
      <h1 className='text-4xl font-bold'>Contador: {contador}</h1>
      <button className='btn btn-accent font-bold' onClick={() => setContador(contador + 1)}>Incrementar</button>
       <Link to="/home" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
    </div>
  );
}
