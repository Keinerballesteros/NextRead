import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaBook, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus,
  FaSearch,
  FaDollarSign,
  FaHome
} from "react-icons/fa";
import { db } from "../../firebase";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy
} from "firebase/firestore";

function BookList() {
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

  const handleDeleteBook = async (bookId, bookTitle) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${bookTitle}"?`,
      text: "Esta acción no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "books", bookId));
        
        setBooks(books.filter(book => book.id !== bookId));
        
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El libro ha sido eliminado",
          timer: 2000,
        });
      } catch (error) {
        console.error("Error eliminando libro:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el libro",
        });
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "Fecha no disponible";
    const date = timestamp.toDate();
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando libros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-8">
      <div className="container mx-auto px-4">
        
        
        <div className="text-center mb-8 relative">
          <Link
            to="/"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            <FaHome className="h-4 w-4" />
            Volver al Home
          </Link>
          
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="logo"
              className="w-24 h-24 rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mis Libros Publicados
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona tus libros publicados
          </p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, autor o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              />
            </div>

            
            <Link
              to="/create"
              className="bg-blue-500 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus className="h-4 w-4" />
              Agregar Libro
            </Link>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <p className="text-2xl font-bold text-blue-600">{books.length}</p>
            <p className="text-gray-600">Total de libros</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <p className="text-2xl font-bold text-green-600">
              {books.filter(book => book.isAvailable !== false).length}
            </p>
            <p className="text-gray-600">Disponibles</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
            <p className="text-2xl font-bold text-purple-600">
              {books.filter(book => book.hasImages).length}
            </p>
            <p className="text-gray-600">Con imágenes</p>
          </div>
        </div>

    
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <FaBook className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {books.length === 0 ? "No hay libros publicados" : "No se encontraron libros"}
            </h3>
            <p className="text-gray-600 mb-6">
              {books.length === 0 
                ? "Comienza publicando tu primer libro para venderlo."
                : "Intenta con otros términos de búsqueda."
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="bg-gray-500 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
              >
                <FaHome className="h-4 w-4" />
                Volver al Home
              </Link>
              {books.length === 0 && (
                <Link
                  to="/create-book"
                  className="bg-blue-500 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                >
                  <FaPlus className="h-4 w-4" />
                  Publicar Primer Libro
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                
                <div className="h-48 bg-gray-100 relative">
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
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    {book.imagesCount || 0} img
                  </div>
                </div>

                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1">
                      {book.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                      {book.category}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2 flex items-center gap-1">
                    <FaBook className="h-4 w-4" />
                    {book.author}
                  </p>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {book.description || "Sin descripción"}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1 text-green-600 font-bold">
                      <FaDollarSign className="h-4 w-4" />
                      {book.price?.toFixed(0) || "0.00"}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(book.createdAt)}
                    </span>
                  </div>

                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: book.title,
                          html: `
                            <div class="text-left">
                              <p><strong>Autor:</strong> ${book.author}</p>
                              <p><strong>Categoría:</strong> ${book.category}</p>
                              <p><strong>Precio:</strong> $${book.price?.toFixed(0) || "0.00"}</p>
                              <p><strong>Descripción:</strong> ${book.description || "Sin descripción"}</p>
                              <p><strong>Publicado:</strong> ${formatDate(book.createdAt)}</p>
                              ${book.hasImages ? `<p><strong>Imágenes:</strong> ${book.imagesCount} subidas</p>` : ""}
                            </div>
                          `,
                          confirmButtonText: "Cerrar",
                          width: 600
                        });
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaEye className="h-4 w-4" />
                      Ver
                    </button>

                    <Link
                      to={`/edit-book/${book.id}`}
                      className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaEdit className="h-4 w-4" />
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaTrash className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBooks.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Mostrando {filteredBooks.length} de {books.length} libros
            {searchTerm && ` para "${searchTerm}"`}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;