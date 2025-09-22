import React, { useState, useTransition } from "react";
import { Link } from "react-router-dom";

const nombres = Array.from({ length: 2000 }, (_, i) => `Persona ${i + 1}`);

function HookUseTransition() {
  const [filtro, setFiltro] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setFiltro(value); // actualización rápida (urgente)
    startTransition(() => {
      setFiltro(value); // actualización lenta (no urgente)
    });
  };

  const listaFiltrada = nombres.filter((n) =>
    n.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="flex flex-col  gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <h1 className="text-2xl font-bold text-white mb-4">
        Probando useTransition
      </h1>

      <input
        type="text"
        value={filtro}
        onChange={handleChange}
        placeholder="Escribe un número..."
        className="p-2 border rounded-lg shadow-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {isPending && (
        <p className="mt-2 text-sm text-gray-500 animate-pulse">
          Filtrando resultados...
        </p>
      )}

      <ul className="mt-4 w-80 max-h-80 overflow-y-auto bg-white rounded-lg shadow p-2 border-5 border-black">
        {listaFiltrada.map((nombre, i) => (
          <li key={i} className="border-b last:border-none p-1 text-gray-700">
            {nombre}
          </li>
        ))}
      </ul>
      <div className="bg-white rounded p-2 text-black">
            <Link to="/home">Volver a Home</Link>
      </div>
    </div>
  );
}

export default HookUseTransition;
