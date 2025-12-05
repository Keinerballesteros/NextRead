import { 
  signInWithPopup, 
  linkWithCredential,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  OAuthProvider,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  auth, 
  GoogleProvider, 
  githubProvider, 
  facebookProvider 
} from '../firebase';
import Swal from 'sweetalert2';

// ============================================
// FUNCIÓN ESPECIAL PARA GOOGLE (con verificación previa)
// ============================================
export const checkEmailBeforeGoogleLogin = async () => {
  try {
    // Pedir el email al usuario ANTES de hacer login se hace esto porque Firebase crea la cuenta automáticamente al hacer login con Google
    const { value: email } = await Swal.fire({
      title: 'Ingresa tu correo de Google',
      input: 'email',
      inputLabel: 'Correo electrónico',
      inputPlaceholder: 'ejemplo@gmail.com',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return '¡Debes ingresar un correo!';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Ingresa un correo válido';
        }
      }
    });

    if (!email) {
      return { cancelled: true };
    }

    // Verificar si este email ya existe
    const methods = await fetchSignInMethodsForEmail(auth, email);
  

    // Verificar si Google ya está vinculado
    if (methods.includes('google.com')) {
      // Si Google ya existe, hacer login normal
      return await handleSocialLogin('google');
    }

    // Filtrar métodos que no sean Google
    const otherMethods = methods.filter(m => m !== 'google.com');
    
    if (otherMethods.length > 0) {
      // Ya existe con otro proveedor (GitHub/Facebook/Password), manejar vinculación
      return await handleExistingAccountForGoogle(email, otherMethods);
    }

    // Si no existe ningún método, proceder con registro/login normal
    return await handleSocialLogin('google');

  } catch (error) {
    console.error('Error verificando email:', error);
    throw error;
  }
};

// Manejar cuando el email ya existe con otros proveedores
const handleExistingAccountForGoogle = async (email, existingMethods) => {
  let providerName = '';
  let provider = null;

  // Determinar qué proveedor usar
  if (existingMethods.includes('github.com')) {
    providerName = 'GitHub';
    provider = githubProvider;
  } else if (existingMethods.includes('facebook.com')) {
    providerName = 'Facebook';
    provider = facebookProvider;
  } else if (existingMethods.includes('password')) {
    // Si usa contraseña, no podemos vincular automáticamente
    await Swal.fire({
      icon: 'warning',
      title: 'Cuenta Existente',
      html: `
        <p>Ya tienes una cuenta con <strong>${email}</strong> usando correo y contraseña.</p>
        <p>Para vincular Google, primero inicia sesión con tu contraseña y luego ve a tu perfil para vincular cuentas.</p>
      `,
      confirmButtonText: 'Entendido'
    });
    return { success: false, requiresPassword: true };
  }

  // Preguntar si desea vincular
  const result = await Swal.fire({
    icon: 'info',
    title: '🔗 Cuenta Existente',
    html: `
      <p>Ya tienes una cuenta con <strong>${email}</strong> usando <strong>${providerName}</strong>.</p>
      <p>¿Deseas vincular Google para poder iniciar sesión con ambos métodos?</p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sí, vincular',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  });

  if (!result.isConfirmed) {
    return { success: false, cancelled: true };
  }

  // Vincular las cuentas
  return await linkGoogleToExistingAccount(provider, providerName);
};

// Vincular Google a cuenta existente
const linkGoogleToExistingAccount = async (existingProvider, providerName) => {
  try {
    // Mostrar loading
    Swal.fire({
      title: 'Vinculando cuentas...',
      html: `Iniciando sesión con ${providerName}...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // 1. Login con el proveedor existente (GitHub/Facebook)
    const loginResult = await signInWithPopup(auth, existingProvider);
  

    // 2. USAR linkWithPopup en lugar de signInWithPopup + linkWithCredential
    Swal.update({
      html: 'Ahora selecciona tu cuenta de Google para vincularla...'
    });

    
    await linkWithPopup(loginResult.user, GoogleProvider);
   
    
    Swal.close();

    
    return {
      success: true,
      user: loginResult.user,
      linked: true,
      providerLinked: 'Google'
    };

  } catch (error) {
    console.error('Error vinculando:', error);
    Swal.close();

    // Manejar errores específicos
    if (error.code === 'auth/credential-already-in-use') {
      await Swal.fire({
        icon: 'info',
        title: 'Cuenta Ya Vinculada',
        text: 'Esta cuenta de Google ya está vinculada.',
      });
      return { success: true, user: auth.currentUser };
    }

    if (error.code === 'auth/provider-already-linked') {
      await Swal.fire({
        icon: 'info',
        title: 'Ya Vinculado',
        text: 'Google ya está vinculado a tu cuenta.',
      });
      return { success: true, user: auth.currentUser };
    }

    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, cancelled: true };
    }

    // Error genérico
    await Swal.fire({
      icon: 'error',
      title: 'Error al Vincular',
      text: 'No se pudo vincular la cuenta de Google. Intenta de nuevo.',
    });

    throw error;
  }
};

// ============================================
// FUNCIÓN PRINCIPAL PARA LOGIN SOCIAL (GitHub, Facebook)
// ============================================
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
    
    // Si la cuenta existe con diferente credencial (Facebook y GitHub funcionan así)
    if (error.code === 'auth/account-exists-with-different-credential') {
      return await handleAccountLinking(error, providerType);
    }
    
    // Otros errores
    throw error;
  }
};

// ============================================
// VINCULACIÓN DE CUENTAS (Facebook y GitHub)
// ============================================
const handleAccountLinking = async (error, attemptedProviderType) => {
  try {
    const email = error.customData.email;
    const pendingCred = OAuthProvider.credentialFromError(error);
    
    console.log('Detectada cuenta existente con:', email);
    
    // Obtener métodos de inicio de sesión existentes
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('Métodos existentes:', methods);
    
    // Determinar el proveedor existente
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
      await Swal.fire({
        icon: 'info',
        title: 'Cuenta Existente',
        text: `Ya tienes una cuenta con ${email} usando correo y contraseña. Por favor inicia sesión con tu contraseña primero y luego vincula desde tu perfil.`,
        confirmButtonText: 'Entendido'
      });
      return {
        success: false,
        requiresPassword: true,
        email: email
      };
    }
    
    // Preguntar al usuario
    const result = await Swal.fire({
      icon: 'info',
      title: '🔗 Vincular Cuentas',
      html: `
        <p>Ya tienes una cuenta con <strong>${email}</strong> usando <strong>${existingProviderName}</strong>.</p>
        <p>¿Deseas vincular tu cuenta de <strong>${getProviderName(attemptedProviderType)}</strong>?</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, vincular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });
    
    if (!result.isConfirmed) {
      return { success: false, cancelled: true };
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
    
    console.log('Iniciando sesión con', existingProviderName);
    
    // Iniciar sesión con el método existente
    const loginResult = await signInWithPopup(auth, existingProvider);
    console.log('Login exitoso, vinculando credencial...');
    
    // Vincular la nueva credencial
    const linkedUser = await linkWithCredential(loginResult.user, pendingCred);
    console.log('✅ Cuentas vinculadas exitosamente');
    
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


const getProviderName = (providerType) => {
  const names = {
    'google': 'Google',
    'facebook': 'Facebook',
    'github': 'GitHub'
  };
  return names[providerType] || providerType;
};

// Función para obtener proveedores vinculados
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