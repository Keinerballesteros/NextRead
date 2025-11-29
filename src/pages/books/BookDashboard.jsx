import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaBook, 
  FaShoppingCart,
  FaDollarSign,
  FaHome,
  FaSearch,
  FaHeart
} from "react-icons/fa";
import { db } from "../../firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy
} from "firebase/firestore";

function BookDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      const booksData = [];
      
      querySnapshot.forEach((doc) => {
        booksData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setBooks(booksData);
    } catch (error) {
      console.error("Error cargando libros:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los libros",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyBook = (book) => {
    Swal.fire({
      title: `Comprar "${book.title}"`,
      html: `
        <div class="text-left">
          <p><strong>Autor:</strong> ${book.author}</p>
          <p><strong>Categoría:</strong> ${book.category}</p>
          <p><strong>Precio:</strong> $${book.price?.toFixed(0) || "0.00"}</p>
          <p><strong>Descripción:</strong> ${book.description || "Sin descripción"}</p>
          ${book.condition ? `<p><strong>Condición:</strong> ${book.condition}</p>` : ""}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Comprar ahora",
      cancelButtonText: "Seguir viendo",
      confirmButtonColor: "#10B981",
      width: 600
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "¡Compra iniciada!",
          text: `Has iniciado la compra de "${book.title}"`,
          timer: 3000,
        });
        // Aquí puedes agregar la lógica de compra
      }
    });
  };

  const handleAddToWishlist = (book) => {
    Swal.fire({
      icon: "success",
      title: "Agregado a favoritos",
      text: `"${book.title}" se agregó a tu lista de deseos`,
      timer: 2000,
    });
    // Aquí puedes agregar la lógica para agregar a favoritos
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="logo"
              className="w-24 h-24 rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Catálogo de Libros
          </h1>
          <p className="text-gray-600 text-lg">
            Descubre y adquiere libros increíbles
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar libros por título, autor o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <FaBook className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {books.length === 0 ? "No hay libros disponibles" : "No se encontraron libros"}
            </h3>
            <p className="text-gray-600 mb-6">
              {books.length === 0 
                ? "Próximamente tendremos nuevos libros disponibles."
                : "Intenta con otros términos de búsqueda."
              }
            </p>
            <Link
              to="/"
              className="bg-blue-500 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto w-fit"
            >
              <FaHome className="h-4 w-4" />
              Volver al Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                
                {/* Book Image - Altura fija */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative flex-shrink-0">
                  {book.imagePreviews && book.imagePreviews.length > 0 ? (
                    <img
                      src={book.imagePreviews[0]}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBook className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${book.price?.toFixed(0) || "0"}
                  </div>
                </div>

                {/* Book Info - Contenido flexible */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Header con título y categoría */}
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-2 flex-grow">
                      {book.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      {book.category}
                    </span>
                  </div>

                  {/* Autor */}
                  <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                    por <span className="font-semibold">{book.author}</span>
                  </p>

                  {/* Descripción */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2 flex-grow">
                    {book.description || "Descripción no disponible"}
                  </p>

                  {/* Precio y disponibilidad */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-green-600 font-bold text-base">
                      <FaDollarSign className="h-3 w-3" />
                      {book.price?.toFixed(0) || "0.00"}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      book.isAvailable !== false 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {book.isAvailable !== false ? "Disponible" : "Agotado"}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleAddToWishlist(book)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-1 border border-gray-300 text-sm"
                    >
                      <FaHeart className="h-3 w-3" />
                      <span className="hidden xs:inline">Favorito</span>
                    </button>

                    <button
                      onClick={() => handleBuyBook(book)}
                      disabled={book.isAvailable === false}
                      className={`flex-1 py-2 px-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-1 font-semibold text-sm ${
                        book.isAvailable !== false
                          ? "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FaShoppingCart className="h-3 w-3" />
                      <span className="hidden xs:inline">Comprar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Counter */}
        {filteredBooks.length > 0 && (
          <div className="mt-8 text-center text-gray-600 bg-white rounded-2xl p-4 shadow-lg">
            <p className="text-lg">
              Mostrando <span className="font-bold text-blue-600">{filteredBooks.length}</span> de{" "}
              <span className="font-bold text-blue-600">{books.length}</span> libros
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDashboard;