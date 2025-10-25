import { useEffect } from 'react';
import { auth } from '../firebase';
import { registerLogin } from '../services/sessionService';

export const useSessionTracking = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Usuario acaba de iniciar sesión
        console.log('Usuario autenticado, registrando sesión...');
        await registerLogin(user);
      }
    });

    return () => unsubscribe();
  }, []);
};