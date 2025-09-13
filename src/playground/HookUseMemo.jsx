
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

function HookUseMemo() {
  const [count, setCount] = useState(0);

  const double = useMemo(() => {
    console.log("🔄 Calculando el doble...");
    return count * 2;
  }, [count]);

  return (
    <div className="flex flex-col   gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <h1 className="text-xl font-bold">Probando useMemo</h1>

      <p>Contador: {count}</p>
      <p>Doble del contador: {double}</p>

      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-600 rounded-lg cursor-pointer"
      >
        Incrementar
      </button>
      <div className="bg-white border rounded p-2 text-black">
        <Link to="/">Volver a Home</Link>
      </div>
    </div>
  );
}

export default HookUseMemo;
