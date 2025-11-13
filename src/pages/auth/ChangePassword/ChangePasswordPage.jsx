import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../firebase";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtener el código OOB de la URL
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    console.log("oobCode recibido:", oobCode);
    if (!oobCode) {
      console.error("No se recibió oobCode en la URL");
      setError("Enlace inválido o expirado.");
    }
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    console.log("Iniciando cambio de contraseña...");

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluyendo un número, una minúscula y una mayúscula.");
      return;
    }

    if (!oobCode) {
      setError("Enlace inválido.");
      return;
    }

    setLoading(true);
    console.log("Enviando solicitud a Firebase...");

    try {
      await confirmPasswordReset(auth, oobCode, password);
      console.log("Contraseña cambiada exitosamente");
      
      setMessage("✅ Contraseña restablecida exitosamente. Redirigiendo al login en 3 segundos...");
      
      // Aumentar el tiempo para que el usuario vea el mensaje
      setTimeout(() => {
        console.log("Redirigiendo a /login");
        navigate("/login", { replace: true });
      }, 3000); // Aumentado a 3 segundos
      
    } catch (error) {
      console.error("Error completo al cambiar contraseña:", error);
      console.error("Código de error:", error.code);
      console.error("Mensaje de error:", error.message);
      
      switch (error.code) {
        case "auth/expired-action-code":
          setError("❌ El enlace ha expirado. Solicita un nuevo restablecimiento.");
          break;
        case "auth/invalid-action-code":
          setError("❌ El enlace es inválido o ya fue usado. Solicita un nuevo restablecimiento.");
          break;
        case "auth/weak-password":
          setError("❌ La contraseña es demasiado débil. Usa una combinación más segura.");
          break;
        case "auth/user-disabled":
          setError("❌ Esta cuenta ha sido deshabilitada.");
          break;
        case "auth/user-not-found":
          setError("❌ No se encontró la cuenta asociada a este enlace.");
          break;
        default:
          setError(`❌ Error al restablecer la contraseña: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Agregar un console.log cuando el mensaje cambie
  useEffect(() => {
    if (message) {
      console.log("Mensaje mostrado:", message);
    }
    if (error) {
      console.log("Error mostrado:", error);
    }
  }, [message, error]);

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
          Cambiar Contraseña
        </h2>

        {/* Mensaje de éxito con mejor estilo */}
        {message && (
          <div className="alert alert-success mb-4 rounded-2xl animate-pulse border-2 border-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">{message}</span>
          </div>
        )}

        {/* Mensaje de error con mejor estilo */}
        {error && (
          <div className="alert alert-error mb-4 rounded-2xl border-2 border-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">{error}</span>
          </div>
        )}

        {/* Mostrar información del oobCode para debugging */}
        {!oobCode && (
          <div className="alert alert-warning mb-4 rounded-2xl">
            <span>⚠️ No se encontró código de verificación en la URL</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="w-full input input-bordered border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
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
                type="password"
                required
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
                className="grow bg-transparent focus:outline-none"
              />
            </label>
            <div className="label">
              <span className="label-text-alt text-gray-600">Mínimo 8 caracteres, con número, mayúscula y minúscula</span>
            </div>
          </div>

          <div className="form-control">
            <label className="w-full input input-bordered border-black flex items-center gap-2 bg-white/10 text-black placeholder-black">
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
                type="password"
                required
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="8"
                className="grow bg-transparent focus:outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !oobCode}
            className="btn btn-info w-full rounded-xl shadow-lg transition-all duration-500 hover:scale-105 disabled:opacity-50 text-white font-bold py-3"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Cambiando contraseña...
              </>
            ) : (
              "🔒 Cambiar Contraseña"
            )}
          </button>
        </form>

        {/* Botón para volver al login manualmente */}
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Volver al Login
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChangePassword;