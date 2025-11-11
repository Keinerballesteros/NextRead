import { useState, useEffect } from 'react';
import { auth, GoogleProvider, githubProvider, facebookProvider } from '../../firebase';
import { linkWithPopup, unlink } from 'firebase/auth';
import Swal from 'sweetalert2';
import { FaGoogle, FaGithub, FaFacebook, FaUnlink, FaCheckCircle } from 'react-icons/fa';

function LinkProvidersPage() {
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar proveedores vinculados al montar
  useEffect(() => {
    loadLinkedProviders();
  }, []);

  const loadLinkedProviders = () => {
    const user = auth.currentUser;
    if (user) {
      const providers = user.providerData.map(profile => profile.providerId);
      setLinkedProviders(providers);
      console.log('Proveedores vinculados:', providers);
    }
  };

  // Verificar si un proveedor está vinculado
  const isLinked = (providerId) => {
    return linkedProviders.includes(providerId);
  };

  // Vincular proveedor
  const handleLinkProvider = async (providerType) => {
    let provider;
    let providerName;

    switch (providerType) {
      case 'google':
        provider = GoogleProvider;
        providerName = 'Google';
        break;
      case 'github':
        provider = githubProvider;
        providerName = 'GitHub';
        break;
      case 'facebook':
        provider = facebookProvider;
        providerName = 'Facebook';
        break;
      default:
        return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: `Vinculando ${providerName}...`,
        text: 'Selecciona tu cuenta en la ventana emergente',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const user = auth.currentUser;
      await linkWithPopup(user, provider);

      Swal.close();

      await Swal.fire({
        icon: 'success',
        title: '¡Vinculado!',
        text: `${providerName} ha sido vinculado correctamente`,
        timer: 2000,
        showConfirmButton: false
      });

      // Recargar proveedores
      loadLinkedProviders();

    } catch (error) {
      console.error('Error vinculando proveedor:', error);
      Swal.close();

      if (error.code === 'auth/credential-already-in-use') {
        Swal.fire({
          icon: 'info',
          title: 'Ya vinculado',
          text: `Esta cuenta de ${providerName} ya está vinculada a otra cuenta de usuario.`
        });
      } else if (error.code === 'auth/provider-already-linked') {
        Swal.fire({
          icon: 'info',
          title: 'Ya vinculado',
          text: `${providerName} ya está vinculado a tu cuenta.`
        });
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Usuario cerró el popup, no mostrar error
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo vincular ${providerName}. Intenta de nuevo.`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Desvincular proveedor
  const handleUnlinkProvider = async (providerId, providerName) => {
    // Verificar que no sea el último método
    if (linkedProviders.length === 1) {
      return Swal.fire({
        icon: 'warning',
        title: 'No puedes desvincular',
        text: 'Debes tener al menos un método de inicio de sesión vinculado.'
      });
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Desvincular cuenta?',
      text: `¿Estás seguro de desvincular ${providerName}? Ya no podrás iniciar sesión con este método.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, desvincular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const user = auth.currentUser;
      await unlink(user, providerId);

      await Swal.fire({
        icon: 'success',
        title: 'Desvinculado',
        text: `${providerName} ha sido desvinculado correctamente`,
        timer: 2000,
        showConfirmButton: false
      });

      // Recargar proveedores
      loadLinkedProviders();

    } catch (error) {
      console.error('Error desvinculando:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo desvincular el proveedor'
      });
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    {
      id: 'google.com',
      type: 'google',
      name: 'Google',
      icon: FaGoogle,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-red-500'
    },
    {
      id: 'github.com',
      type: 'github',
      name: 'GitHub',
      icon: FaGithub,
      color: 'bg-gray-800 hover:bg-gray-900',
      textColor: 'text-gray-800'
    },
    {
      id: 'facebook.com',
      type: 'facebook',
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className='bg-blue-500 p-2 rounded hover:bg-blue-800 font-bold text-white cursor-pointer w-[19%] text-center mb-10'>
                <a href="/">Volver a Home</a>
            </div><h1 className="text-3xl font-bold text-gray-800 mb-2">
            Vincular Cuentas
          </h1>
            
          <p className="text-gray-600 mb-8">
            Vincula diferentes métodos de inicio de sesión a tu cuenta para mayor flexibilidad
          </p>

          <div className="space-y-4">
            {providers.map((provider) => {
              const linked = isLinked(provider.id);
              const Icon = provider.icon;

              return (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${provider.color} rounded-lg text-white`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {linked 
                          ? 'Vinculado a tu cuenta' 
                          : 'No vinculado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {linked ? (
                      <>
                        <FaCheckCircle className={`text-2xl ${provider.textColor}`} />
                        <button
                          onClick={() => handleUnlinkProvider(provider.id, provider.name)}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <FaUnlink />
                          <span className="font-medium">Desvincular</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleLinkProvider(provider.type)}
                        disabled={loading}
                        className={`px-6 py-2 ${provider.color} text-white rounded-lg transition-all disabled:opacity-50 font-medium`}
                      >
                        Vincular
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Consejo:</strong> Vincula múltiples métodos para no perder acceso a tu cuenta si olvidas tu contraseña o pierdes acceso a una red social.
            </p>
          </div>

          {/* Mostrar proveedores actuales */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">
              Métodos vinculados actualmente:
            </h4>
            <div className="flex flex-wrap gap-2">
              {linkedProviders.length > 0 ? (
                linkedProviders.map((providerId) => {
                  const provider = providers.find(p => p.id === providerId);
                  return (
                    <span
                      key={providerId}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {provider ? provider.name : providerId.replace('.com', '')}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-500 text-sm">
                  No hay proveedores vinculados
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkProvidersPage;