import React, { useContext, createContext, useState } from 'react';
import { Link } from 'react-router-dom';
const TemaContext = createContext();

function Boton() {
  const { tema, toggleTema } = useContext(TemaContext);

  return (
    <button
      onClick={toggleTema}
      className={`btn ${tema === 'dark' ? 'btn-primary' : 'btn-light'}`}
    >
      Botón con tema {tema}
    </button>
  );
}

export default function HookUseContext() {
  const [tema, setTema] = useState('light');

  const toggleTema = () => {
    setTema(prevTema => (prevTema === 'light' ? 'dark' : 'light'));
  };

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      <div className="w-full h-full flex flex-col items-center justify-center p-5 gap-3">
        <h1 className="items-center font-bold text-3xl">Hook UseContext</h1>
        <Boton />
        <Link to="/home" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
      </div>
    </TemaContext.Provider>
  );
}
