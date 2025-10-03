import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

function DetailOpinion() {
  const { id } = useParams();
  const [opinion, setOpinion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpinion = async () => {
      const docRef = doc(db, "Opinions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOpinion({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No existe la opinión");
      }
    };
    fetchOpinion();
  }, [id]);

  if (!opinion) return <p className="text-center mt-10">Cargando opinión...</p>;

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-black mb-4">{opinion.book}</h2>
        <p className="text-gray-700 italic mb-3">"{opinion.opinion}"</p>
        <p className="text-sm text-gray-600 mb-2">
          <b>Usuario:</b> {opinion.username}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <b>Puntuación:</b> ⭐ {opinion.score}
        </p>
        <p className="text-sm text-gray-500">
          {opinion.date?.toDate().toLocaleDateString()}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Volver
        </button>
      </div>
    </section>
  );
}

export default DetailOpinion;
