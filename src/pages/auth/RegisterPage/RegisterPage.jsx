import { useState } from "react";
import {Link,useNavigate } from "react-router-dom";
import {auth, db} from '../../../firebase'
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterPage() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [showPassword2, setShowPassword2] = useState(false);

  const [formData, setFormData] = useState({
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,  
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // Validaciones 
    if (!username || !email || !password || !confirmPassword) {
      return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    }
    if (password.length < 6) {
      return Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "error");
    }
    if (password !== confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }

    try {
      const emailLower = email.toLowerCase();

      // Crear usuario para el servicio de Autenticación de Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password);
      const user = userCredential.user;

      // Guardar datos en Firestore
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,  
        username, 
        email: emailLower, 
        state: "pendiente", 
        rol: "visitante", 
        createdAt: new Date(),  // Corregido: era newDate()
        method: "password"
      });

      Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      navigate("/");

    } catch (error) {
      console.error("Error de registro: ", error);

      if (error.code === "auth/email-already-in-use") {
        Swal.fire("Error", "Este correo electrónico ya está en uso", "error");
      } else if (error.code === "auth/invalid-email") {
        Swal.fire("Error", "El correo electrónico no es válido", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error durante el registro", "error");
      }
    }

  }

  return (
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
          REGISTRARSE
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
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
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
              className="grow bg-transparent focus:outline-none"
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          
          <label className="w-full input input-bordered rounded-2xl border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
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
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
            name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              className="grow bg-transparent focus:outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          
          <label className="w-full input input-bordered rounded-2xl border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
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
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              minLength="6"
              // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              // title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="grow bg-transparent focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash/>: <FaEye/>}
            </button>
          </label>

           <label className="w-full input input-bordered rounded-2xl border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
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
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type={showPassword2 ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              minLength="6"
              // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              // title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="grow bg-transparent focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
             <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? <FaEyeSlash/>: <FaEye/>}
            </button>
          </label>

          
          <button
            type="submit"
            className="btn btn-dash btn-info w-full rounded-xl shadow-lg transition-all duration-500 hover:scale-105"

          >
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-black">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>

        
      </div>
    </section>
  );
}

export default RegisterPage;