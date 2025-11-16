# 📘 Autenticación con Facebook


## Descripción

La autenticación con Facebook permite que los usuarios inicien sesión utilizando sus cuentas de Facebook existentes, proporcionando una experiencia familiar y rápida. Utiliza Facebook Login y OAuth 2.0.


## Requisitos previos

### Software necesario:
- Node.js v14 o superior
- npm o yarn
- Proyecto Firebase activo
- Cuenta de Facebook (preferiblemente Developer Account)

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

## Configuración en Meta for Developers

### Paso 1: Crear App en Meta for Developers

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Click en **"My Apps"** → **"Create App"**
3. Selecciona tipo de app: **"Consumer"**
4. Click **"Next"**

### Paso 2: Configurar información básica

Completa el formulario:

**Display name:**
```
NextRead
```

**App contact email:**
```
tu-email@gmail.com
```

**Business Portfolio:** (opcional)
```
None
```

Click **"Create App"**

### Paso 3: Agregar Facebook Login

1. En el dashboard de tu app
2. Busca **"Facebook Login"**
3. Click en **"Set Up"**
4. Selecciona **"Web"**

### Paso 4: Configurar Site URL

**Site URL:**
```
http://localhost:5173
```

Para producción:
```
https://tu-dominio.com
```

Click **"Save"** y **"Continue"**

### Paso 5: Configurar OAuth Redirect URIs

1. En el menú lateral: **"Facebook Login"** → **"Settings"**
2. **Valid OAuth Redirect URIs:**
   ```
   https://nextreadproject.firebaseapp.com/__/auth/handler
   ```
3. **Deauthorize Callback URL:** (opcional)
   ```
   https://nextreadproject.firebaseapp.com/__/auth/deauthorize
   ```
4. Click **"Save Changes"**

### Paso 6: Obtener credenciales

1. En el menú lateral: **"Settings"** → **"Basic"**
2. **Guardar:**
   - **App ID:** (visible directamente)
   - **App Secret:** Click en **"Show"** para ver

⚠️ **IMPORTANTE:** Guarda el App Secret de forma segura.

### Paso 7: Configurar Privacy Policy y Terms (Requerido para producción)

1. **Settings** → **"Basic"**
2. **Privacy Policy URL:**
   ```
   https://tu-dominio.com/privacy
   ```
3. **Terms of Service URL:** (opcional)
   ```
   https://tu-dominio.com/terms
   ```
4. **App Domain:**
   ```
   tu-dominio.com
   ```

⚠️ **NOTA:** En desarrollo, solo tú y usuarios agregados como testers pueden usar Facebook Login.


## Configuración en Firebase Console

### Paso 1: Habilitar Facebook Sign-In

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **nextreadproject**
3. **Authentication** → **Sign-in method**
4. Click en **"Facebook"**
5. Activa el toggle **"Enable"**

### Paso 2: Configurar credenciales

**App ID:**
```
Pegar el App ID de Meta for Developers
```

**App Secret:**
```
Pegar el App Secret de Meta for Developers
```

**OAuth redirect URI:**
```
Copiar esta URL y agregarla en Meta for Developers
```

6. Click en **"Save"**

### Paso 3: Configurar vinculación de cuentas

1. **Authentication** → **Settings**
2. **User account linking:**
   - ☑️ **"Prevent creation of multiple accounts with the same email address"**
3. Click **"Save"**

---

## Integración en el proyecto

### Paso 1: Configurar Firebase (`firebase.js`)

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider } from 'firebase/auth';

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

// Configurar provider de Facebook
const facebookProvider = new FacebookAuthProvider();

// Opcional: Solicitar permisos adicionales
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Opcional: Parámetros personalizados
facebookProvider.setCustomParameters({
  'display': 'popup'
});

export { auth, facebookProvider };
```

### Paso 2: Crear servicio de autenticación (`authService.js`)

```javascript
import { 
  signInWithPopup,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  OAuthProvider
} from 'firebase/auth';
import { auth, facebookProvider } from '../firebase';
import Swal from 'sweetalert2';

/**
 * Login con Facebook
 * Facebook maneja automáticamente la detección de cuentas duplicadas
 */
export const handleSocialLogin = async (providerType) => {
  if (providerType !== 'facebook') {
    throw new Error('Este método solo maneja Facebook');
  }

  try {
    // Intentar login con Facebook
    const result = await signInWithPopup(auth, facebookProvider);
    
    console.log('Login exitoso con Facebook:', result.user);
    
    // Verificar si Facebook proporcionó email
    if (!result.user.email) {
      console.warn('Facebook no proporcionó email');
      // Manejar caso sin email
    }
    
    return {
      success: true,
      user: result.user,
      linked: false
    };
    
  } catch (error) {
    console.error('Error en login con Facebook:', error.code);
    
    // Si la cuenta existe con diferente credencial
    if (error.code === 'auth/account-exists-with-different-credential') {
      return await handleAccountLinking(error, 'facebook');
    }
    
    // Otros errores
    throw error;
  }
};

/**
 * Vincular Facebook a cuenta existente
 */
const handleAccountLinking = async (error, attemptedProviderType) => {
  try {
    const email = error.customData.email;
    const pendingCred = OAuthProvider.credentialFromError(error);
    
    console.log('Cuenta existente detectada con:', email);
    
    // Obtener métodos de inicio de sesión existentes
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('Métodos existentes:', methods);
    
    // Determinar el proveedor existente
    let existingProvider;
    let existingProviderName;
    
    if (methods.includes('google.com')) {
      const { GoogleProvider } = await import('../firebase');
      existingProvider = GoogleProvider;
      existingProviderName = 'Google';
    } else if (methods.includes('github.com')) {
      const { githubProvider } = await import('../firebase');
      existingProvider = githubProvider;
      existingProviderName = 'GitHub';
    } else if (methods.includes('password')) {
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
    
    // Preguntar al usuario si desea vincular
    const result = await Swal.fire({
      icon: 'info',
      title: '🔗 Vincular Cuentas',
      html: `
        <p>Ya tienes una cuenta con <strong>${email}</strong> usando <strong>${existingProviderName}</strong>.</p>
        <p>¿Deseas vincular tu cuenta de <strong>Facebook</strong> para poder iniciar sesión con ambos métodos?</p>
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
    console.log('Login exitoso, vinculando Facebook...');
    
    // Vincular la credencial de Facebook
    const linkedUser = await linkWithCredential(loginResult.user, pendingCred);
    console.log('✅ Facebook vinculado exitosamente');
    
    Swal.close();
    
    return {
      success: true,
      user: linkedUser,
      linked: true,
      providerLinked: 'Facebook'
    };
    
  } catch (linkError) {
    console.error('Error vinculando cuentas:', linkError);
    Swal.close();
    throw linkError;
  }
};
```

### Paso 3: Implementar en LoginPage (`LoginPage.jsx`)

```javascript
import { handleSocialLogin } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function LoginPage() {
  const navigate = useNavigate();

  const loginWithFacebook = async () => {
    try {
      const result = await handleSocialLogin('facebook');
      
      if (result.success) {
        if (result.linked) {
          await Swal.fire({
            icon: 'success',
            title: '¡Cuentas Vinculadas!',
            text: `Tu cuenta de Facebook ha sido vinculada exitosamente.`,
            confirmButtonText: 'Continuar'
          });
        } else {
          await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Sesión iniciada con Facebook correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        }
        navigate("/");
      } else if (result.requiresPassword) {
        // Usuario debe iniciar con contraseña primero
      } else if (result.cancelled) {
        // Usuario canceló vinculación
      }
    } catch (error) {
      console.error('Error con Facebook:', error);
      
      if (error.code === "auth/popup-closed-by-user" || 
          error.code === "auth/cancelled-popup-request") {
        return; // Usuario cerró popup
      } else if (error.code === "auth/popup-blocked") {
        Swal.fire(
          "Error",
          "El navegador bloqueó la ventana emergente. Por favor habilita las ventanas emergentes.",
          "error"
        );
      } else if (error.code === "auth/account-exists-with-different-credential") {
        // Ya manejado en handleSocialLogin
      } else {
        Swal.fire(
          "Error",
          "Ocurrió un error al iniciar sesión con Facebook",
          "error"
        );
      }
    }
  };

  return (
    <button 
      onClick={loginWithFacebook}
      className="btn-facebook"
    >
      <FacebookIcon />
      Ingresar con Facebook
    </button>
  );
}
```

---

## Flujo de autenticación

### Diagrama de flujo:

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario click "Ingresar con Facebook"                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ signInWithPopup(auth, facebookProvider)                     │
│ └─> Abre popup de Facebook Login                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Usuario inicia sesión en Facebook                           │
│ └─> Autoriza permisos (email, public_profile)               │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌────────────────┐  ┌────────────────────────────────────────┐
│ Login exitoso  │  │ Error: account-exists-with-different-  │
│                │  │ credential                              │
└────────┬───────┘  └────────┬───────────────────────────────┘
         │                   │
         ▼                   ▼
┌────────────────┐  ┌────────────────────────────────────────┐
│ Crear sesión   │  │ handleAccountLinking()                 │
│ Redireccionar  │  │ └─> Vincular con cuenta existente      │
└────────────────┘  └────────────────────────────────────────┘
```
---

## Manejo de vinculación de cuentas

### Comportamiento de Facebook:

Similar a GitHub, Facebook **SÍ lanza el error** `auth/account-exists-with-different-credential` cuando detecta un email duplicado.

### Ventajas del manejo automático:

```javascript
try {
  await signInWithPopup(auth, facebookProvider);
} catch (error) {
  if (error.code === 'auth/account-exists-with-different-credential') {
    // Firebase detectó el conflicto automáticamente
    // Proceder a vincular
    await handleAccountLinking(error, 'facebook');
  }
}
```

## Verificación

### En Firebase Console:

1. **Authentication → Users**
   ```
   usuario@email.com
   ├── Providers: facebook.com
   ├── Created: [fecha]
   └── Last sign-in: [fecha]
   ```

2. **Verificar vinculación múltiple:**
   ```
   usuario@email.com
   ├── Providers: facebook.com, google.com, github.com
   ├── Created: [fecha]
   └── Last sign-in: [fecha]
   ```

3. **Authentication → Sign-in method**
   - Facebook debe mostrar: **"Enabled"**
   - Contador de usuarios debe incrementar

### En tu aplicación:

```javascript
// Verificar datos de Facebook
const user = auth.currentUser;
if (user) {
  const facebookData = user.providerData.find(
    profile => profile.providerId === 'facebook.com'
  );
  
  if (facebookData) {
    console.log('Facebook ID:', facebookData.uid);
    console.log('Nombre:', facebookData.displayName);
    console.log('Email:', facebookData.email);
    console.log('Foto:', facebookData.photoURL);
  }
}
```

### Estructura de datos:

```javascript
{
  uid: "firebase-uid-123",
  email: "usuario@email.com",
  displayName: "Usuario Facebook",
  photoURL: "https://graph.facebook.com/.../picture",
  providerData: [
    {
      providerId: "facebook.com",
      uid: "facebook-user-id",
      displayName: "Usuario Facebook",
      email: "usuario@email.com",
      photoURL: "https://graph.facebook.com/.../picture"
    }
  ]
}
```


## Notas importantes

**Última actualización: 15 Noviembre 2025