import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

const SESSIONS_COLLECTION = 'user_sessions';


export const registerLogin = async (user) => {
  try {
    
    const providers = user.providerData.map(profile => profile.providerId);
    
    console.log('Registrando login con proveedores:', providers);
    
    const sessionData = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || user.email.split('@')[0],
      providers: providers, 
      loginTime: new Date(),
      logoutTime: null,
      duration: null,
      status: 'active'
    };

    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
    localStorage.setItem('currentSessionId', docRef.id);
    
    console.log('Sesión registrada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error registrando inicio de sesión:', error);
    return null;
  }
};


export const registerLogout = async () => {
  try {
    const sessionId = localStorage.getItem('currentSessionId');
    if (!sessionId) {
      console.log('No hay sesión activa para cerrar');
      return;
    }

    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const logoutTime = new Date();
    
    const sessionDoc = await getDoc(sessionRef);
    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data();
      const loginTime = sessionData.loginTime.toDate();
      const duration = Math.round((logoutTime - loginTime) / 1000);

      await updateDoc(sessionRef, {
        logoutTime: logoutTime,
        duration: duration,
        status: 'inactive'
      });

      localStorage.removeItem('currentSessionId');
      console.log('Sesión cerrada correctamente');
    }
  } catch (error) {
    console.error('Error registrando cierre de sesión:', error);
  }
};


export const getAllSessions = async (filters = {}) => {
  try {
    let q;
    
    
    if (filters.userEmail && !filters.startDate && !filters.endDate) {
      q = query(
        collection(db, SESSIONS_COLLECTION),
        orderBy('loginTime', 'desc')
      );
    } else if (filters.startDate && !filters.userEmail) {
      const startDate = new Date(filters.startDate);
      q = query(
        collection(db, SESSIONS_COLLECTION),
        where('loginTime', '>=', startDate),
        orderBy('loginTime', 'desc')
      );
    } else {
      q = query(
        collection(db, SESSIONS_COLLECTION),
        orderBy('loginTime', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    let sessions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        
        providers: data.providers || []
      });
    });

    
    if (filters.userEmail && filters.userEmail.trim() !== '') {
      const searchTerm = filters.userEmail.toLowerCase();
      sessions = sessions.filter(session => 
        session.userEmail && session.userEmail.toLowerCase().includes(searchTerm)
      );
    }

    
    if (filters.endDate && !filters.userEmail) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      sessions = sessions.filter(session => {
        const sessionDate = session.loginTime?.seconds ? 
          new Date(session.loginTime.seconds * 1000) : 
          new Date(session.loginTime);
        return sessionDate <= endDate;
      });
    }

    
    if (filters.userEmail && (filters.startDate || filters.endDate)) {
      let filteredSessions = sessions;
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredSessions = filteredSessions.filter(session => {
          const sessionDate = session.loginTime?.seconds ? 
            new Date(session.loginTime.seconds * 1000) : 
            new Date(session.loginTime);
          return sessionDate >= startDate;
        });
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        filteredSessions = filteredSessions.filter(session => {
          const sessionDate = session.loginTime?.seconds ? 
            new Date(session.loginTime.seconds * 1000) : 
            new Date(session.loginTime);
          return sessionDate <= endDate;
        });
      }
      
      sessions = filteredSessions;
    }

    console.log(`Se encontraron ${sessions.length} sesiones`);
    return sessions;
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    return [];
  }
};


export const getUserSessions = async (userId) => {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('loginTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        providers: data.providers || []
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error obteniendo sesiones del usuario:', error);
    return [];
  }
};