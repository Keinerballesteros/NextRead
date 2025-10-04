import {
  FaBook,
  FaUser,
  FaUserPlus,
  FaDollarSign,
  FaComments,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="navbar bg-[#f0f0f0] shadow-sm px-4">
      <div className="navbar-start">
        <a className="text-xl font-bold text-black flex items-center gap-2">
          <FaBook className="text-blue-500" />
          NextRead
        </a>
      </div>

      <div className="navbar-end gap-2">
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
        
      </div>
    </div>
  );
}
export default Header;
