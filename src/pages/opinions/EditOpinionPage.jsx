import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function EditOpinion() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    book: "",
    opinion: "",
    username: "",
    score: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpinion = async () => {
      const docRef = doc(db, "Opinions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    };
    fetchOpinion();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "Opinions", id);
    await updateDoc(docRef, formData);
    alert("Opinión actualizada ✅");
    navigate("/opinions");
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0] text-black">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Editar Opinión
        </h2>

        <label className="block mb-2 text-black">Libro</label>
        <input
          type="text"
          name="book"
          value={formData.book}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 text-black">Opinión</label>
        <textarea
          name="opinion"
          value={formData.opinion}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 text-black">Usuario</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 text-black">Puntuación</label>
        <input
          type="number"
          name="score"
          value={formData.score}
          onChange={handleChange}
          min="1"
          max="5"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Guardar Cambios
        </button>
      </form>
    </section>
  );
}

export default EditOpinion;
