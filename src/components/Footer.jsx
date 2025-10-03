import { FaTwitter, FaYoutube, FaFacebook, FaBook } from 'react-icons/fa';

function Footer(){
    return(
        <footer className="footer bg-[#f0f0f0] p-8 text-black">
            <div className="w-full text-center flex flex-col items-center justify-center">
                
             
                
               
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-center">
                    Tu plataforma favorita para comprar y vender libros de segunda mano.
                </p>
                
                
                <div className="flex justify-center gap-6 mb-6 items-center">
                    <a className="text-gray-600 hover:text-blue-500 transition-colors">
                        <FaTwitter className="text-xl" />
                    </a>
                    <a className="text-gray-600 hover:text-blue-500 transition-colors">
                        <FaYoutube className="text-xl" />
                    </a>
                    <a className="text-gray-600 hover:text-blue-500 transition-colors">
                        <FaFacebook className="text-xl" />
                    </a>
                </div>
                
                
                <div className="text-gray-500 text-sm text-center">
                    <p>&copy; {new Date().getFullYear()} NextRead. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
export default Footer;

