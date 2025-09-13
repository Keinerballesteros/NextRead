import React, { useReducer } from "react";
import { Link } from "react-router-dom";

function reducer(state, action) {
  switch (action.type) {
    case "incrementar":
      return { count: state.count + 1 };
    case "decrementar":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div className="flex flex-col  min-h-screen gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col justify-center items-center bg-gray-600 p-4 rounded gap-4">
            <h1>Contador: {state.count}</h1>
            <div className="flex  justify-center items-center gap-3">
               
                <button onClick={() => dispatch({ type: "incrementar" })} className="bg-green-700 p-2 rounded cursor-pointer">Incrementar</button>
                <button onClick={() => dispatch({ type: "decrementar" })} className="bg-red-700 p-2 rounded cursor-pointer">Disminuir</button>
                <button onClick={() => dispatch({ type: "reset" })} className="bg-black p-2 rounded cursor-pointer">Resetear</button>
            </div>
            
            <div className="bg-white rounded p-2 text-black">
                <Link to="/">Volver a Home</Link>
            </div>
        </div>
    </div>
    
  );
}

export default Counter;
