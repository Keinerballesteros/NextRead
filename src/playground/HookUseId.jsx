import React, { useId, useState } from 'react';

export default function ListaDinamica() {
  const baseId = useId(); 
  const [usuarios, setUsuarios] = useState([
    { nombre: '', email: '' },
    { nombre: '', email: '' },
  ]);

 
  const manejarCambio = (index, campo, valor) => {
    setUsuarios((prevUsuarios) => {
      const nuevos = [...prevUsuarios];
      nuevos[index][campo] = valor;
      return nuevos;
    });
  };

  
  const agregarUsuario = () => {
    setUsuarios((prevUsuarios) => [...prevUsuarios, { nombre: '', email: '' }]);
  };

  return (
    <div className="p-5 flex flex-col gap-3">
      <h1 className="text-2xl font-extrabold text-center ">HookUseId</h1>

      {usuarios.map((usuario, index) => {
        const idNombre = `${baseId}-nombre-${index}`;
        const idEmail = `${baseId}-email-${index}`;
        return (
          <div key={index} className="flex flex-col gap-2 border p-3 rounded-md">
            <div>
              <label htmlFor={idNombre}>Nombre {index + 1}: </label>
              <input
                id={idNombre}
                type="text"
                value={usuario.nombre}
                onChange={(e) => manejarCambio(index, 'nombre', e.target.value)}
                className="border p-1 ml-2"
              />
            </div>
            <div>
              <label htmlFor={idEmail}>Email {index + 1}: </label>
              <input
                id={idEmail}
                type="email"
                value={usuario.email}
                onChange={(e) => manejarCambio(index, 'email', e.target.value)}
                className="border p-1 ml-2"
              />
            </div>
          </div>
        );
      })}

      <button
        onClick={agregarUsuario}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Agregar usuario
      </button>

      <Link to="/" className="btn btn-dash w-28 justify-center link-accent mt-2">Ir al Home</Link>
      
      <pre className="mt-4 p-2 rounded">
        {JSON.stringify(usuarios, null, 2)}
      </pre>
    </div>
  );
}

