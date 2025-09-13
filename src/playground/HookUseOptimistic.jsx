import React, { useState } from "react";
import { useOptimistic } from "react";
import { Link } from "react-router-dom";

function HookUseOptimistic() {
  const [todos, setTodos] = useState(["UseOptimistic"]);

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos);

  async function handleAdd() {
    const newTask = "Nueva tarea";

    addOptimisticTodo([...optimisticTodos, newTask]);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      setTodos((prev) => [...prev, newTask]);
    } catch {
      console.log("Error al guardar la tarea");
    }
  }

  return (
    <div className="flex flex-col  min-h-screen gap-2 items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <h2 className="p-2 bg-gray-700">Lista de Tareas</h2>
      <ul>
        {optimisticTodos.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <button onClick={handleAdd} className="bg-gray-500 p-2 rounded cursor-pointer">Agregar tarea</button>
      <div className="bg-white border rounded p-2 text-black">
        <Link to="/">Volver a Home</Link>
      </div>
    </div>
  );
}

export default HookUseOptimistic;
