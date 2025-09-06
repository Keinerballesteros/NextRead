import { useState } from "react";

function HookUseState(){
const [count, setCount] = useState(0);

    return(
        <div className="w-full h-full flex flex-col items-center justify-center  ">
            <h1 className="text-3xl font-extrabold">Hook UseState</h1>
            <div className="w-full items-center justify-center p-5">
            <h1 className="text-warning font-bold text-2xl">Contador: {count}</h1>
            <div className="flex gap-3 flex-row mt-2">
                 
                <button onClick={() => setCount(count+1)} className="btn btn-success">Aumentar</button>
                <button onClick={() => setCount(count-1)} className="btn btn-primary">Disminuir</button>
            </div>
                <Link to="/" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
            </div>
        </div>
    )
}
export default HookUseState;