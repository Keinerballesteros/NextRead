import React, { useState, useInsertionEffect } from "react";
import { Link } from "react-router-dom";
function HookUseInsertionEffect() {
  const [color, setColor] = useState("lightblue");

  
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `.dynamic { background-color: ${color}; padding: 20px; }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style); 
    };
  }, [color]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center p-5 gap-3">
    <h1 className="text-3xl font-extrabold">Hook useInsertionEffect</h1>
      <div className="dynamic text-black font-semibold">Caja con color dinámico</div>
      <div className="flex flex-row gap-2">
      <button className="btn btn-success" onClick={() => setColor("lightgreen")}>Verde</button>
      <button className="btn btn-error" onClick={() => setColor("lightcoral")}>Rojo</button>
      </div>

    <Link to="/" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>

    </div>
  );
}

export default HookUseInsertionEffect;