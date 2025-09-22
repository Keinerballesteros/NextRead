import React, { useActionState } from "react";
import { Link } from "react-router-dom";

function HookUseActionState() {
  const [mensaje, formAction, isPending] = useActionState(
    async (prev, formData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `Hola ${formData.get("nombre")}`; 
    },
    "" 
  );

  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col justify-center items-center bg-gray-600 p-4 rounded gap-4">
        <h2 className="text-2xl font-bold mb-4">Probando useActionState</h2>
        
        <form action={formAction} className="flex flex-col gap-4 w-64">
            <input name="nombre" placeholder="Escribe tu nombre" className="px-4 py-2 rounded-lg border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button type="submit" disabled={isPending} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition disabled:opacity-50">
                {isPending ? "Enviando..." : "Enviar"}
            </button>
        </form>

        {mensaje && <p className="mt-4 text-lg">{mensaje}</p>}
            <div className="bg-white rounded p-2 text-black">
                <Link to="/home">Volver a Home</Link>
            </div>
        </div>
      
    </div>
  );
}

export default HookUseActionState;
