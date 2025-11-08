import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaBook, 
  FaUser, 
  FaTag, 
  FaDollarSign, 
  FaUpload, 
  FaTimes,
  FaArrowLeft
} from "react-icons/fa";
import { db } from "../../firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Ficción", "No Ficción", "Ciencia Ficción", "Fantasía", "Misterio",
    "Romance", "Terror", "Biografía", "Historia", "Ciencia",
    "Tecnología", "Arte", "Autoayuda", "Negocios", "Cocina",
    "Viajes", "Infantil", "Juvenil", "Poesía", "Drama",
  ];

  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const bookData = docSnap.data();
          setFormData({
            title: bookData.title || "",
            author: bookData.author || "",
            category: bookData.category || "",
            price: bookData.price?.toString() || "",
            description: bookData.description || "",
          });

          
          if (bookData.imagePreviews && bookData.imagePreviews.length > 0) {
            setImages(bookData.imagePreviews.map((preview, index) => ({
              preview,
            })));
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Libro no encontrado",
            text: "El libro que intentas editar no existe",
          });
          navigate("/books");
        }
      } catch (error) {
        console.error("Error cargando libro:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el libro",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Límite de imágenes",
        text: "Solo puedes subir hasta 5 imágenes",
        timer: 3000,
      });
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: "error",
        title: "Archivo no válido",
        text: "Solo se permiten archivos de imagen",
        timer: 3000,
      });
      return;
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            file,
            preview: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    if (!formData.title || !formData.author || !formData.category || !formData.price) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos",
        text: "Por favor completa todos los campos obligatorios",
        timer: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      
      const imagePreviews = images.map(img => img.preview);
      
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim() || "",
        hasImages: images.length > 0,
        imagesCount: images.length,
        imagePreviews: imagePreviews, 
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, "books", id), bookData);

      Swal.fire({
        icon: "success",
        title: "¡Libro actualizado!",
        text: "La información del libro ha sido actualizada exitosamente",
        timer: 3000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/books");
      }, 2000);

    } catch (error) {
      console.error("Error actualizando libro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar el libro. Intenta nuevamente.",
        timer: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando libro...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f0f0f0] py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 mx-4">
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            <FaArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <div className="flex justify-center flex-1">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 h-20 rounded-2xl"
            />
          </div>
          <div className="w-20"></div> 
        </div>

        <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Editar Libro
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Actualiza la información de tu libro
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nombre del Libro *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBook className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ej: Cien años de soledad"
                minLength="3"
                maxLength="100"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Autor *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Ej: Gabriel García Márquez"
                minLength="3"
                maxLength="100"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white appearance-none"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Precio *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Descripción del Libro
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe el libro, su condición, y cualquier detalle relevante..."
              rows="4"
              maxLength="500"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white resize-none"
            />
            <div className="text-right text-sm text-gray-500">
              {formData.description.length}/500 caracteres
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Imágenes del Libro (Máximo 5) 
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-300 bg-white">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-600">Haz clic para subir imágenes</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG (Máx. 5 imágenes) - Se guardarán localmente
                </p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Actualizando...
              </div>
            ) : (
              "Actualizar Libro"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditBook;