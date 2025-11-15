import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../../firebase";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtener todos los parámetros de la URL
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");
  const apiKey = searchParams.get("apiKey");

  // Verificar el código al cargar el componente
  useEffect(() => {
    const verifyCode = async () => {
      
      // Si no hay oobCode, no continuar
      if (!oobCode) {
        console.error("No se encontró oobCode en la URL");
        setVerifying(false);
        return;
      }

      try {
        
        //Verficar el código de restablecimiento de contraseña
        const email = await verifyPasswordResetCode(auth, oobCode);
        setUserEmail(email);
        setVerifying(false);
      } catch (error) {
        console.error("Error al verificar código:", error);
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, mode, apiKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validación básica
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!oobCode) {
      alert("Enlace inválido");
      return;
    }

    setLoading(true);

    try {
      // Cambiar la contraseña usando el código de restablecimiento
      await confirmPasswordReset(auth, oobCode, password);
      
      
      setMessage("✅ Contraseña restablecida exitosamente. Redirigiendo al login...");
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
      
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      alert("Error al cambiar la contraseña. El enlace puede haber expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-700 font-medium">Verificando enlace...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="logo" 
            className="w-40 h-40 rounded-2xl" 
          />
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-black mb-6">
          Cambiar Contraseña
        </h2>

        {userEmail && (
          <div className="alert alert-info mb-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Cambiando contraseña para: <strong>{userEmail}</strong></span>
          </div>
        )}

        {message && (
          <div className="alert alert-success mb-4 rounded-2xl animate-pulse border-2 border-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">{message}</span>
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
                className="grow bg-transparent focus:outline-none"
              />
            </label>
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
                className="grow bg-transparent focus:outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
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