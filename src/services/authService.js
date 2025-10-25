import { 
  signInWithPopup, 
  linkWithCredential,
  fetchSignInMethodsForEmail,
  OAuthProvider
} from 'firebase/auth';
import { 
  auth, 
  GoogleProvider, 
  githubProvider, 
  facebookProvider 
} from '../firebase';
import Swal from 'sweetalert2';

// Función principal para manejar login social con vinculación automática
export const handleSocialLogin = async (providerType) => {
  let provider;
  
  // Seleccionar el proveedor
  switch (providerType) {
    case 'google':
      provider = GoogleProvider;
      break;
    case 'facebook':
      provider = facebookProvider;
      break;
    case 'github':
      provider = githubProvider;
      break;
    default:
      throw new Error('Proveedor no soportado');
  }

  try {
    // Intentar login normal
    const result = await signInWithPopup(auth, provider);
    console.log('Login exitoso:', result.user);
    return {
      success: true,
      user: result.user,
      linked: false
    };
    
  } catch (error) {
    console.error('Error en login:', error.code);
    
    // Si la cuenta existe con diferente credencial
    if (error.code === 'auth/account-exists-with-different-credential') {
      return await handleAccountLinking(error, providerType);
    }
    
    // Otros errores
    throw error;
  }
};

// Función para manejar la vinculación de cuentas
const handleAccountLinking = async (error, attemptedProviderType) => {
  try {
    const email = error.customData.email;
    const pendingCred = OAuthProvider.credentialFromError(error);
    
    console.log('Detectada cuenta existente con:', email);
    
    // Obtener métodos de inicio de sesión existentes para este email
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('Métodos existentes:', methods);
    
    // Determinar el proveedor a usar para el login inicial
    let existingProvider;
    let existingProviderName;
    
    if (methods.includes('google.com')) {
      existingProvider = GoogleProvider;
      existingProviderName = 'Google';
    } else if (methods.includes('facebook.com')) {
      existingProvider = facebookProvider;
      existingProviderName = 'Facebook';
    } else if (methods.includes('github.com')) {
      existingProvider = githubProvider;
      existingProviderName = 'GitHub';
    } else if (methods.includes('password')) {
      // Si es con contraseña, no podemos vincular automáticamente
      await Swal.fire({
        icon: 'info',
        title: 'Cuenta Existente',
        text: `Ya tienes una cuenta con ${email} usando correo y contraseña. Por favor inicia sesión con tu contraseña primero.`,
        confirmButtonText: 'Entendido'
      });
      return {
        success: false,
        requiresPassword: true,
        email: email
      };
    }
    
    // Mostrar mensaje al usuario sobre lo que va a pasar
    const result = await Swal.fire({
      icon: 'info',
      title: '🔗 Vincular Cuentas',
      html: `
        <p>Ya tienes una cuenta con <strong>${email}</strong> usando <strong>${existingProviderName}</strong>.</p>
        <p>¿Deseas vincular tu cuenta de <strong>${getProviderName(attemptedProviderType)}</strong> para poder iniciar sesión con ambos métodos?</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, vincular',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });
    
    if (!result.isConfirmed) {
      return {
        success: false,
        cancelled: true
      };
    }
    
    // Mostrar loading
    Swal.fire({
      title: 'Vinculando cuentas...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    console.log('Iniciando sesión con método existente...');
    
    // Iniciar sesión con el método existente
    const loginResult = await signInWithPopup(auth, existingProvider);
    console.log('Login con método existente exitoso');
    
    // Ahora vincular la nueva credencial
    const linkedUser = await linkWithCredential(loginResult.user, pendingCred);
    console.log('Cuentas vinculadas exitosamente');
    
    Swal.close();
    
    return {
      success: true,
      user: linkedUser,
      linked: true,
      providerLinked: getProviderName(attemptedProviderType)
    };
    
  } catch (linkError) {
    console.error('Error vinculando cuentas:', linkError);
    Swal.close();
    throw linkError;
  }
};

// Función auxiliar para obtener nombre del proveedor
const getProviderName = (providerType) => {
  const names = {
    'google': 'Google',
    'facebook': 'Facebook',
    'github': 'GitHub'
  };
  return names[providerType] || providerType;
};

// Función para obtener todos los proveedores vinculados de un usuario
export const getUserProviders = () => {
  const user = auth.currentUser;
  if (!user) return [];
  
  return user.providerData.map(profile => ({
    providerId: profile.providerId,
    email: profile.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL
  }));
};