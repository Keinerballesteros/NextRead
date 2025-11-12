import { useEffect } from 'react';
import { auth } from '../firebase';
import { registerLogin, registerLogout } from '../services/sessionService';

export const useSessionTracking = () => {
  useEffect(() => {
    let hasRegisteredLogin = false;
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && !hasRegisteredLogin) {
        console.log('Usuario autenticado, registrando sesión...');
        console.log('Proveedores vinculados:', user.providerData.map(p => p.providerId));
        
        await registerLogin(user);
        hasRegisteredLogin = true;
      } else if (!user && hasRegisteredLogin) {
        
        console.log('Usuario cerró sesión, registrando logout...');
        await registerLogout();
        hasRegisteredLogin = false;
      }
    });

    const handleBeforeUnload = async () => {
      if (auth.currentUser) {
        await registerLogout();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};