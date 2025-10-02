    import { useState } from "react";
    import { db } from "../../firebase"; 
    import { collection, addDoc } from "firebase/firestore";

    import Swal from "sweetalert2";
    import { useNavigate } from "react-router-dom";
    import { FaEye, FaEyeSlash } from "react-icons/fa";
    import { Link } from "react-router-dom";
    import { FaBook, FaStarHalfAlt } from "react-icons/fa";
    import { FaPencil } from "react-icons/fa6";

    function Opinions(){
        const [formData, setFormData] = useState({
            username: "",
            book: "",
            opinion: "",
            score: ""
            });

            const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
         };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const { username, book, opinion, score } = formData;

            if (!username || !book || !opinion || !score) {
                return Swal.fire("Error", "Todos los campos son obligatorios", "error");
            }

            try {
                await addDoc(collection(db, "Opinions"), {
                username,
                book,
                opinion,
                score: parseFloat(score),
                date: new Date()
                });

                Swal.fire("¡Éxito!", "Tu opinión se ha guardado correctamente ✅", "success");

                // limpiar inputs
                setFormData({
                username: "",
                book: "",
                opinion: "",
                score: ""
                });
            } catch (error) {
                console.error("Error al guardar opinión: ", error);
                Swal.fire("Error", "No se pudo guardar la opinión", "error");
            }
         };
        return(
            <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">

                    <div className="flex justify-center mb-6">
                    <img 
                        src="../../public/logo.png" 
                        alt="logo" 
                        className="w-40 h-40 rounded-2xl" 
                    />
                    </div>

                    <h2 className="text-3xl font-extrabold text-center text-black mb-6">
                    ¡Deja tu opinión sobre algún libro que leíste!
                    </h2>

                    <form  onSubmit={handleSubmit} className="space-y-5">
                    
                    <label className=" w-full input input-bordered rounded-2xl border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
                        <svg
                        className="h-5 opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        >
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </g>
                        </svg>
                        <input
                        type="text"
                        name="username"
                        required
                        placeholder="Comparte tu nombre..."
                        minLength="3"
                        maxLength="30"
                        className="grow bg-transparent focus:outline-none"
                        value={formData.username}
                        onChange={handleChange}
                        />
                    </label>

                    <label className=" w-full input input-bordered rounded-2xl border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
                        <svg
                        className="h-5 opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        >
                        
                        <FaBook className="text-2xl" />
                        </svg>
                        <input
                        type="text"
                        name="book"
                        required
                        placeholder="Nombre del Libro..."
                        minLength="3"
                        maxLength="30"
                        title="Only letters, numbers or dash"
                        className="grow bg-transparent focus:outline-none"
                        value={formData.book}
                        onChange={handleChange}
                        />
                    </label>


                    <label className="w-full  border rounded-2xl border-black flex items-start gap-2 bg-white/10 text-black">
                        <FaPencil className="text-3xl pl-[3%] pt-[1.5%] opacity-70" />

                        <textarea
                            name="opinion"
                            required
                            placeholder="Escribe tu opinión aquí..."
                            minLength="3"
                            maxLength="500"
                            className="grow bg-transparent focus:outline-none resize-none h-32 leading-relaxe pr-6"
                            value={formData.opinion}
                            onChange={handleChange}
                        />
                    </label> 

                    <label className=" w-full input input-bordered rounded-2xl border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
                        <svg
                        className="h-5 opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        >
                        <FaStarHalfAlt className="text-2xl" />
                        </svg>
                        <input
                        type="number"
                        name="score"
                        required
                        placeholder="Del 0.5 al 5 cuántas estrellas le das al libro..."
                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                        min="0.5"
                        max="5"
                        step= "0.5"
                        title="Only letters, numbers or dash"
                        className="grow bg-transparent focus:outline-none"
                        value={formData.score}
                         onChange={handleChange}
                        />
                    </label>
                    
                    

                    
                    <button
                        type="submit"
                        className="btn btn-dash btn-info w-full rounded-xl shadow-lg transition-all duration-500 hover:scale-105"

                    >
                        Enviar Opinión
                    </button>
                    </form>

                </div>
            </section>
        )
    }
    export default Opinions;