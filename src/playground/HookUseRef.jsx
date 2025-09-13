import React, { useRef } from "react";
import { Link } from "react-router-dom";

function HookUseRef() {
  const inputRef = useRef(null); // referencia al input

  const handleFocus = () => {
    inputRef.current.focus(); // accedemos al DOM y damos focus
  };

  return (
    <div className="flex flex-col  gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col justify-center items-center bg-gray-600 p-4 rounded gap-4"> 
            <h2 className="text-2xl font-bold mb-4">Probando UseRef</h2>
      
            <input
                ref={inputRef}
                type="text"
                placeholder="Escribe algo..."
                className="px-4 py-2 rounded-lg border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
                onClick={handleFocus}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition"
            >
                Dar Focus al Input
            </button>
            <div className="bg-white text-black p-2 rounded cursor-pointer">
                <Link to="/">Volver a Home</Link>
            </div>
        </div>
      
    </div>
  );
}

export default HookUseRef;
