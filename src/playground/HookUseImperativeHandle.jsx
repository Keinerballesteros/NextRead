import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { Link } from "react-router-dom";
const Caja = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(true);

  
  useImperativeHandle(ref, () => ({
    mostrar() {
      setVisible(true);
    },
    ocultar() {
      setVisible(false);
    }
  }));

  return (
    <div >
      {visible && <div className="w-full h-20 flex items-center justify-center bg-accent">Soy la caja</div>}
    </div>
  );
});

// Componente Padre
function HookUseImperativeHandle() {
  const cajaRef = useRef();

  return (
    <div className="w-full h-full flex flex-col  p-5 gap-3">
        <h1 className="font-extrabold text-4xl flex justify-center">Hook UseImperativeHandle</h1>
      <Caja ref={cajaRef} />
      <div className="gap-3 flex justify-center">
      <button className="btn btn-primary font-semibold" onClick={() => cajaRef.current.mostrar()}>Mostrar</button>
      <button className="btn btn-error font-semibold" onClick={() => cajaRef.current.ocultar()}>Ocultar</button>
      </div>

      <Link to="/" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
    </div>
  );
}

export default HookUseImperativeHandle;
