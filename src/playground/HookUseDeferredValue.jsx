import React, { useState, useDeferredValue } from 'react'
import { Link } from "react-router-dom";
function HookUseDeferredValue() {
    const [text, setText] = useState('');
    const deferredValue = useDeferredValue(text);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-5 gap-3'>
        <h1 className="text-3xl font-extrabold">Hook useDeferredValue</h1>
        <input type="text" className='input input-info' value={text} onChange={(e) => setText(e.target.value)}/>
        <SlowList query={deferredValue} />

         <Link to="/home" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
        </div>
    )
} 
export default HookUseDeferredValue;
function SlowList({ query }) {
    const items = [];
    for (let i = 0; i < 10; i++) {
        items.push(`Item ${i} - ${query}`);
    }
    return <div>{items}</div>
}
