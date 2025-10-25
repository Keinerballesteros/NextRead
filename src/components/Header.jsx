import { useState, useEffect } from "react";
import {
  FaBook,
  FaUser,
  FaUserPlus,
  FaDollarSign,
  FaComments,
  FaSignOutAlt,
  FaCog,
  FaUsers, // Nuevo icono
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Ajusta la ruta según tu estructura
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { registerLogout } from "../services/sessionService"; // Importar el servicio

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Detectar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Verificar si es admin
      if (currentUser && currentUser.email === 'admin@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      console.log("Usuario actual:", currentUser);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        // Registrar logout antes de cerrar sesión
        await registerLogout();
        await signOut(auth);
        setShowDropdown(false);
        Swal.fire({
          icon: 'success',
          title: 'Sesión Cerrada',
          text: 'Has cerrado sesión exitosamente',
          timer: 1500,
          showConfirmButton: false
        });
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire("Error", "No se pudo cerrar sesión", "error");
      }
    }
  };

  // Obtener nombre para mostrar
  const getDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuario';
  };

  // Obtener foto de perfil
  const getPhotoURL = () => {
    return user?.photoURL || `https://ui-avatars.com/api/?name=${getDisplayName()}&background=3b82f6&color=fff`;
  };

  if (loading) {
    return (
      <div className="navbar bg-[#f0f0f0] shadow-sm px-4">
        <div className="navbar-start">
          <a className="text-xl font-bold text-black flex items-center gap-2">
            <FaBook className="text-blue-500" />
            NextRead
          </a>
        </div>
        <div className="navbar-end">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-[#f0f0f0] shadow-sm px-4">
      <div className="navbar-start">
        <Link to="/" className="text-xl font-bold text-black flex items-center gap-2 hover:opacity-80 transition-opacity">
          <FaBook className="text-blue-500" />
          NextRead
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {/* Botones siempre visibles */}
        <Link to="/books">
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white border-none">
            <FaDollarSign className="mr-2" />
            Vender Libro
          </button>
        </Link>

        <Link to="/opinions">
          <button className="btn bg-blue-500 hover:bg-blue-600 text-white border-none">
            <FaComments className="mr-2" />
            Opinar Libro
          </button>
        </Link>

        {/* Botón de administrador - solo visible para admin */}
        {isAdmin && (
          <Link to="/admin/users">
            <button className="btn bg-green-500 hover:bg-green-600 text-white border-none">
              <FaUsers className="mr-2" />
              Mirar Usuarios
            </button>
          </Link>
        )}

        {/* Mostrar botones de login/register O perfil de usuario */}
        {user ? (
          // Usuario autenticado
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 btn btn-ghost hover:bg-blue-100 px-3"
            >
              <img
                src={getPhotoURL()}
                alt={getDisplayName()}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
              />
              <span className="font-medium text-black hidden md:inline">
                {getDisplayName()}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Overlay para cerrar el dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={getPhotoURL()}
                        alt={getDisplayName()}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-black hover:bg-blue-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="text-blue-500" />
                      <span>Mi Perfil</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-black hover:bg-blue-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaCog className="text-blue-500" />
                      <span>Configuración</span>
                    </Link>

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          // Usuario NO autenticado
          <>
            <Link to="/login">
              <button className="btn btn-ghost text-black hover:bg-blue-100">
                <FaUser className="mr-2" />
                Iniciar Sesión
              </button>
            </Link>

            <Link to="/register">
              <button className="btn bg-white text-black border-blue-500 hover:bg-blue-50">
                <FaUserPlus className="mr-2" />
                Registrarse
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;