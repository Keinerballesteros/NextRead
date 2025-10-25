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

// Colección para las sesiones de usuario
const SESSIONS_COLLECTION = 'user_sessions';

// Registrar inicio de sesión
export const registerLogin = async (user) => {
  try {
    const sessionData = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || user.email.split('@')[0],
      loginTime: new Date(),
      logoutTime: null,
      duration: null,
      status: 'active'
    };

    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
    localStorage.setItem('currentSessionId', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error registrando inicio de sesión:', error);
    return null;
  }
};

// Registrar cierre de sesión
export const registerLogout = async () => {
  try {
    const sessionId = localStorage.getItem('currentSessionId');
    if (!sessionId) return;

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
    }
  } catch (error) {
    console.error('Error registrando cierre de sesión:', error);
  }
};

// Obtener todas las sesiones (para admin)
export const getAllSessions = async (filters = {}) => {
  try {
    let q;
    
    // Estrategia de consulta basada en los filtros disponibles
    if (filters.userEmail && !filters.startDate && !filters.endDate) {
      // Solo filtro por email - podemos hacer búsqueda parcial en el cliente
      q = query(
        collection(db, SESSIONS_COLLECTION),
        orderBy('loginTime', 'desc')
      );
    } else if (filters.startDate && !filters.userEmail) {
      // Solo filtro por fecha
      const startDate = new Date(filters.startDate);
      q = query(
        collection(db, SESSIONS_COLLECTION),
        where('loginTime', '>=', startDate),
        orderBy('loginTime', 'desc')
      );
    } else {
      // Filtros múltiples o sin filtros - obtener todo y filtrar en cliente
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
        ...data
      });
    });

    // Aplicar filtros adicionales en el cliente si es necesario
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

    // Si hay ambos filtros (email y fecha), aplicar ambos en cliente
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

    return sessions;
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    return [];
  }
};

// Obtener sesiones por usuario específico
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
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error obteniendo sesiones del usuario:', error);
    return [];
  }
};