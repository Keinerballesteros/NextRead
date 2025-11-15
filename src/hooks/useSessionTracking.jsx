import { useEffect } from 'react';
import { auth } from '../firebase';
import { registerLogin, registerLogout } from '../services/sessionService';


// Hook personalizado para rastrear sesiones de usuario
export const useSessionTracking = () => {
  useEffect(() => {
    let hasRegisteredLogin = false;

    // Escuchar cambios en el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged(async (user) => {

      // Si el usuario está autenticado y no se ha registrado el login
      if (user && !hasRegisteredLogin) {


        // Registrar el inicio de sesión
        await registerLogin(user);
        hasRegisteredLogin = true;
      } else if (!user && hasRegisteredLogin) {
        
        // Registrar el cierre de sesión
        await registerLogout();
        hasRegisteredLogin = false;
      }
    });

    // Manejar el cierre de la ventana o recarga de la página
    const handleBeforeUnload = async () => {
      if (auth.currentUser) {
        await registerLogout();
      }
    };


    // Agregar el event listener para antes de descargar la página
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      // Remover el event listener al desmontar el componente
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};