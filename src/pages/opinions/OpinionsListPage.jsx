import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

function OpinionsList() {
  const [opinions, setOpinions] = useState([]);

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

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-center text-black mb-6">
          Opiniones de lectores 📚
        </h2>
        <p className="text-black p-2 text-center">
          Aquí puedes encontrar todas las opiniones de diferentes lectores, aprovecha y revisa un poco, ¡capáz alguna te interese!
        </p>

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
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default OpinionsList;
