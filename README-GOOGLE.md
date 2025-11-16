# 🔴 Autenticación con Google

## Descripción

La autenticación con Google permite que los usuarios inicien sesión en la aplicación utilizando sus cuentas de Google existentes, proporcionando una experiencia fluida y segura mediante OAuth 2.0.

---

## Requisitos previos

### Software necesario:
- Node.js v14 o superior
- npm o yarn
- Proyecto Firebase activo
- Cuenta de Google Cloud Platform

### Dependencias:
```json
{
  "firebase": "^10.x.x",
  "react": "^18.x.x",
  "react-router-dom": "^6.x.x",
  "sweetalert2": "^11.x.x"
}
```

Instalación:
```bash
npm install firebase react-router-dom sweetalert2
```

---

## Configuración en Firebase Console

### Paso 1: Habilitar Google Sign-In
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. **Authentication** → **Sign-in method**
4. Click en **"Google"**
5. Activa el toggle **"Enable"**
6. **Web SDK configuration:**
   - Client ID: (pegar el Client ID de Google Cloud)
   - Client Secret: (pegar el Client Secret)
7. **Support email:** tu-email@gmail.com
8. Click **"Save"**

### Paso 2: Configurar vinculación de cuentas
1. **Authentication** → **Settings**
2. En **"User account linking"**:
   - Selecciona: ☑️ **"Prevent creation of multiple accounts with the same email address"**
3. Click **"Save"**

---

## Integración en el proyecto

### Paso 1: Configurar Firebase (`firebase.js`)

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA20qOFuyhChuTklwBdkSnpF5yqclwsFzo",
  authDomain: "nextreadproject.firebaseapp.com",
  projectId: "nextreadproject",
  storageBucket: "nextreadproject.firebasestorage.app",
  messagingSenderId: "991913423699",
  appId: "1:991913423699:web:4cba2c58fcc3729d6c67a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configurar provider de Google
const GoogleProvider = new GoogleAuthProvider();

// Opcional: Forzar selección de cuenta cada vez
GoogleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, GoogleProvider };
```

### Paso 2: Crear servicio de autenticación (`authService.js`)

```javascript
import { 
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithPopup
} from 'firebase/auth';
import { auth, GoogleProvider } from '../firebase';
import Swal from 'sweetalert2';

/**
 * Verificar email antes de login con Google
 * Esto previene que Google sobrescriba cuentas existentes
 */
export const checkEmailBeforeGoogleLogin = async () => {
  try {
    // 1. Solicitar email al usuario
    const { value: email } = await Swal.fire({
      title: 'Ingresa tu correo de Google',
      input: 'email',
      inputLabel: 'Correo electrónico',
      inputPlaceholder: 'ejemplo@gmail.com',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return '¡Debes ingresar un correo!';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Ingresa un correo válido';
        }
      }
    });

    if (!email) return { cancelled: true };

    // 2. Verificar si el email ya existe
    const methods = await fetchSignInMethodsForEmail(auth, email);
    
    // 3. Si Google ya está vinculado, login normal
    if (methods.includes('google.com')) {
      return await signInWithPopup(auth, GoogleProvider)
        .then(result => ({
          success: true,
          user: result.user,
          linked: false
        }));
    }

    // 4. Si existe con otro proveedor, vincular
    const otherMethods = methods.filter(m => m !== 'google.com');
    if (otherMethods.length > 0) {
      return await handleGoogleLinking(otherMethods);
    }

    // 5. Si no existe, crear cuenta nueva
    return await signInWithPopup(auth, GoogleProvider)
      .then(result => ({
        success: true,
        user: result.user,
        linked: false
      }));

  } catch (error) {
    console.error('Error en Google login:', error);
    throw error;
  }
};

/**
 * Vincular Google a cuenta existente
 */
const handleGoogleLinking = async (existingMethods) => {
  // Determinar proveedor existente
  let providerName = '';
  if (existingMethods.includes('github.com')) providerName = 'GitHub';
  else if (existingMethods.includes('facebook.com')) providerName = 'Facebook';
  else if (existingMethods.includes('password')) {
    await Swal.fire({
      icon: 'warning',
      title: 'Cuenta Existente',
      text: 'Por favor inicia sesión con tu contraseña primero.',
    });
    return { success: false, requiresPassword: true };
  }

  // Preguntar al usuario
  const result = await Swal.fire({
    icon: 'info',
    title: '🔗 Vincular Cuentas',
    html: `¿Deseas vincular Google con tu cuenta de <strong>${providerName}</strong>?`,
    showCancelButton: true,
    confirmButtonText: 'Sí, vincular',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return { success: false, cancelled: true };

  // Vincular
  const user = auth.currentUser;
  await linkWithPopup(user, GoogleProvider);

  return {
    success: true,
    user: user,
    linked: true,
    providerLinked: 'Google'
  };
};
```

### Paso 3: Implementar en LoginPage (`LoginPage.jsx`)

```javascript
import { checkEmailBeforeGoogleLogin } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function LoginPage() {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const result = await checkEmailBeforeGoogleLogin();
      
      if (result.success) {
        if (result.linked) {
          await Swal.fire({
            icon: 'success',
            title: '¡Cuentas Vinculadas!',
            text: 'Google ha sido vinculado exitosamente.',
            timer: 2000
          });
        }
        navigate("/");
      }
    } catch (error) {
      console.error('Error con Google:', error);
      if (error.code !== "auth/popup-closed-by-user") {
        Swal.fire("Error", "No se pudo iniciar sesión con Google", "error");
      }
    }
  };

  return (
    <button 
      onClick={loginWithGoogle}
      className="btn-google"
    >
      <GoogleIcon />
      Ingresar con Google
    </button>
  );
}
```

---

## Flujo de autenticación

### Diagrama de flujo:

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario click "Ingresar con Google"                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ checkEmailBeforeGoogleLogin()                               │
│ └─> Solicita email al usuario                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ fetchSignInMethodsForEmail(email)                           │
│ └─> Verifica si el email existe en Firebase                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬─────────────────┐
        │                   │                 │
        ▼                   ▼                 ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Google ya      │  │ Existe con     │  │ Email nuevo    │
│ vinculado      │  │ otro proveedor │  │                │
└────────┬───────┘  └────────┬───────┘  └────────┬───────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Login directo  │  │ Vincular       │  │ Crear cuenta   │
│ con Google     │  │ cuentas        │  │ nueva          │
└────────────────┘  └────────────────┘  └────────────────┘
```

## Manejo de vinculación de cuentas

### ¿Por qué es necesario?

Google tiene un comportamiento especial en Firebase: si un email ya existe con otro proveedor, Google puede **sobrescribir** la cuenta en lugar de vincularla automáticamente.

### Solución implementada:

1. **Verificación previa:** Se solicita el email ANTES de abrir el popup de Google
2. **Detección de conflictos:** Se verifica si el email existe con `fetchSignInMethodsForEmail()`
3. **Vinculación controlada:** Si existe, se usa `linkWithPopup()` en lugar de `signInWithPopup()`

---

## Verificación

### En Firebase Console:

1. **Authentication → Users**
   - Busca el email del usuario
   - Verifica que aparezca `google.com` en **Providers**
   - Si vinculaste, deberías ver múltiples providers:
     ```
     Providers: google.com, github.com
     ```

2. **Authentication → Sign-in method**
   - Google debe mostrar: **"Enabled"**
   - Click en Google para ver configuración

### En tu aplicación:

```javascript
// Verificar proveedores del usuario actual
const user = auth.currentUser;
if (user) {
  console.log('Proveedores vinculados:');
  user.providerData.forEach(profile => {
    console.log(`- ${profile.providerId}: ${profile.email}`);
  });
}

// Output esperado:
// Proveedores vinculados:
// - google.com: usuario@gmail.com
// - github.com: usuario@gmail.com
```

### Pruebas recomendadas:

1. **Login con Google (usuario nuevo):**
   ```
   ✅ Crear cuenta
   ✅ Redireccionar a home
   ✅ Aparecer en Firebase con google.com
   ```

2. **Login con Google (usuario existente):**
   ```
   ✅ Login exitoso
   ✅ No crear cuenta duplicada
   ✅ Mantener datos existentes
   ```

3. **Vincular Google a cuenta GitHub:**
   ```
   ✅ Detectar cuenta existente
   ✅ Mostrar popup de confirmación
   ✅ Vincular correctamente
   ✅ Aparecer ambos en Firebase
   ```

---

## Notas importantes
**Última actualización:15 Noviembre 2025