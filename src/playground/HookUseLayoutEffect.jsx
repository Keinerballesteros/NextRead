import React, { useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";

function HookUseLayoutEffect() {
  const [width, setWidth] = useState(0);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    if (boxRef.current) {
      const boxWidth = boxRef.current.getBoundingClientRect().width;
      setWidth(boxWidth);
      console.log("useLayoutEffect -> ancho medido:", boxWidth);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div
        ref={boxRef}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20  justify-center grid"
      >
        <h1 className="text-xl font-bold mb-4">Probando useLayoutEffect</h1>
        <p>El ancho de la caja es: {width}px</p>
        <div className="bg-white text-black p-2 border rounded w-[100%] text-center mt-4">
          <Link to="/home">Volver al Home</Link>
        </div>
      </div>
    </div>
  );
}

export default HookUseLayoutEffect;
