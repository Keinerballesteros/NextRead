import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, GoogleProvider, githubProvider, facebookProvider } from '../../../firebase';
import { doc, setDoc } from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { handleSocialLogin } from "../../../services/authService";

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

  // Función para guardar datos en Firestore
  const saveUserToFirestore = async (user, username, method = "password") => {
    try {
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,  
        username, 
        email: user.email, 
        state: "pendiente", 
        rol: "visitante", 
        createdAt: new Date(),
        method: method
      });
    } catch (error) {
      console.error("Error guardando en Firestore:", error);
      throw error;
    }
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
      await saveUserToFirestore(user, username, "password");

      Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      navigate("/");

    } catch (error) {
      console.error("Error de registro: ", error);

      if (error.code === "auth/email-already-in-use") {
        // Email ya existe, ofrecer vinculación
        await handleEmailAlreadyInUse(email.toLowerCase(), password, username);
      } else if (error.code === "auth/invalid-email") {
        Swal.fire("Error", "El correo electrónico no es válido", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error durante el registro", "error");
      }
    }
  };

  // Manejar caso cuando el email ya existe
  const handleEmailAlreadyInUse = async (email, password, username) => {
    try {
      // Obtener métodos existentes
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log('Métodos existentes para', email, ':', methods);

      if (methods.length === 0) {
        // Email enumeration protection activado
        Swal.fire({
          icon: 'error',
          title: 'Email en Uso',
          text: 'Este correo ya está registrado. Intenta iniciar sesión.',
          confirmButtonText: 'Ir a Login',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        return;
      }

      // Determinar qué métodos tiene
      const providerNames = methods.map(method => {
        if (method === 'google.com') return 'Google';
        if (method === 'facebook.com') return 'Facebook';
        if (method === 'github.com') return 'GitHub';
        if (method === 'password') return 'Correo y Contraseña';
        return method;
      });

      // Si ya tiene contraseña, no puede vincular otra
      if (methods.includes('password')) {
        Swal.fire({
          icon: 'error',
          title: 'Email en Uso',
          text: 'Ya existe una cuenta con correo y contraseña para este email.',
          confirmButtonText: 'Ir a Login',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        return;
      }

      // Preguntar si quiere vincular
      const result = await Swal.fire({
        icon: 'question',
        title: '🔗 Vincular Cuenta',
        html: `
          <div style="text-align: left;">
            <p>Ya tienes una cuenta con <strong>${email}</strong> usando:</p>
            <ul style="padding-left: 20px; margin: 10px 0;">
              ${providerNames.map(name => `<li><strong>${name}</strong></li>`).join('')}
            </ul>
            <p>¿Deseas agregar <strong>Correo y Contraseña</strong> como método adicional de inicio de sesión?</p>
            <br>
            <p style="font-size: 14px; color: #666;">
              ✅ Podrás iniciar sesión con cualquier método<br>
              ✅ Mantendrás todos tus datos<br>
              ✅ Es completamente seguro
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sí, vincular',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        width: '550px'
      });

      if (!result.isConfirmed) {
        return;
      }

      // Mostrar loading
      Swal.fire({
        title: 'Vinculando cuenta...',
        html: 'Por favor inicia sesión con tu método existente',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Usuario debe iniciar sesión con su método existente primero
      let provider;
      let providerName;

      if (methods.includes('google.com')) {
        provider = GoogleProvider;
        providerName = 'Google';
      } else if (methods.includes('facebook.com')) {
        provider = facebookProvider;
        providerName = 'Facebook';
      } else if (methods.includes('github.com')) {
        provider = githubProvider;
        providerName = 'GitHub';
      }

      // Login con método existente
      const loginResult = await signInWithPopup(auth, provider);
      
      // Crear credencial de email/password
      const credential = EmailAuthProvider.credential(email, password);
      
      // Vincular
      await linkWithCredential(loginResult.user, credential);
      
      // Actualizar Firestore con el username si no existe
      const userDoc = doc(db, "Users", loginResult.user.uid);
      await setDoc(userDoc, {
        username: username
      }, { merge: true }); // merge: true solo actualiza campos nuevos
      
      Swal.close();
      
      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta Vinculada!',
        text: 'Ahora puedes iniciar sesión con correo y contraseña también.',
        confirmButtonText: 'Continuar'
      });

      navigate('/');

    } catch (linkError) {
      console.error('Error en vinculación:', linkError);
      Swal.close();

      if (linkError.code === 'auth/popup-closed-by-user') {
        Swal.fire({
          icon: 'warning',
          title: 'Proceso Cancelado',
          text: 'Cerraste la ventana de autenticación'
        });
      } else if (linkError.code === 'auth/provider-already-linked') {
        Swal.fire({
          icon: 'info',
          title: 'Ya Vinculado',
          text: 'Este método ya está vinculado a tu cuenta.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo vincular la cuenta. ' + linkError.message
        });
      }
    }
  };

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
              className="grow bg-transparent focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
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
              className="grow bg-transparent focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? <FaEyeSlash /> : <FaEye />}
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