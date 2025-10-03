import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function OpinionsList() {
  const [opinions, setOpinions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "Opinions"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOpinions(data);
    });

    return () => unsubscribe();
  }, []);

  
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta opinión?")) {
      await deleteDoc(doc(db, "Opinions", id));
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-center text-black mb-6">
          Opiniones de lectores 📚
        </h2>
        
        
        <p className="text-black p-2 text-center">
          Aquí puedes encontrar todas las opiniones de diferentes lectores, aprovecha y revisa un poco, ¡capáz alguna te interese!
        </p>
        <div className="flex justify-between">
            <Link to="/" className="text-center text-black border-blue-600 border-2 p-2 bg-gray-100 hover:bg-gray-200 mb-2 rounded">
              Volver a Home
            </Link>
            <Link to="/createopinion" className="text-center text-white p-2 bg-blue-600 hover:bg-blue-500 mb-2 rounded">
              + Crear Opinión
            </Link>
        </div>
        

        {opinions.length === 0 ? (
          <p className="text-center text-gray-600">Aún no hay opiniones 😢</p>
        ) : (
          <ul className="space-y-4">
            {opinions.map((opinion) => (
              <li
                key={opinion.id}
                className="p-4 bg-white rounded-xl shadow-md border border-gray-900"
              >
                <h3 className="font-bold text-lg text-black">
                  {opinion.book}{" "}
                  <span className="text-yellow-500">⭐ {opinion.score}</span>
                </h3>
                <p className="text-gray-700 italic">"{opinion.opinion}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  Por <b>{opinion.username}</b> –{" "}
                  {opinion.date?.toDate().toLocaleDateString()}
                </p>


                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/opinions/${opinion.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => navigate(`/opinions/edit/${opinion.id}`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(opinion.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default OpinionsList;
