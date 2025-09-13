import React, { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";

function useWindowWidth() {
  const subscribe = (callback) => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth 
  );
}

function HookUseSyncExternalStore() {
  const width = useWindowWidth();

  return (
    <div className="flex flex-col  min-h-screen gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex flex-col justify-center items-center bg-gray-600 p-4 rounded gap-4">
        <h1 className="text-2xl font-bold text-white">Probando useSyncExternalStore</h1>
        <p className="mt-4 text-gray-900">
          El ancho actual de la ventana es:
        </p>
        <span className="mt-2 block text-3xl font-bold text-white ">
          {width}px
        </span>
        <div className="bg-white rounded p-2 text-black">
           <Link to="/">Volver a Home</Link>
        </div>
      </div>
      
    </div>
  );
}
export default HookUseSyncExternalStore;