# 🐙 Autenticación con GitHub

---

## Descripción

La autenticación con GitHub permite que los usuarios inicien sesión utilizando sus cuentas de GitHub existentes, ideal para aplicaciones orientadas a desarrolladores. Utiliza OAuth 2.0 para una autenticación segura.
---

## Requisitos previos

### Software necesario:
- Node.js v14 o superior
- npm o yarn
- Proyecto Firebase activo
- Cuenta de GitHub

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

## Configuración en GitHub

### Paso 1: Crear OAuth App en GitHub

1. Ve a [GitHub Settings](https://github.com/settings/developers)
2. Click en **"OAuth Apps"** en el menú lateral
3. Click en **"New OAuth App"**

### Paso 2: Configurar la aplicación

Completa el formulario:

**Application name:**
```
NextRead
```

**Homepage URL:**
```
http://localhost:5173
```
Para producción:
```
https://tu-dominio.com
```

**Application description:**
```
Sistema de gestión de libros y lectura
```

**Authorization callback URL:**
```
https://nextreadproject.firebaseapp.com/__/auth/handler
```

> ⚠️ **Importante:** Reemplaza `nextreadproject` con tu ID de proyecto Firebase

### Paso 3: Obtener credenciales

1. Click en **"Register application"**
2. Serás redirigido a la página de la app
3. **Guardar:**
   - **Client ID:** (visible directamente)
   - **Client Secret:** Click en **"Generate a new client secret"**
   
⚠️ **CRÍTICO:** Guarda el Client Secret inmediatamente, solo se muestra una vez.

### Paso 4: Configurar scopes (opcional)

Para acceder a más información del usuario:

1. En la configuración de tu OAuth App
2. Sección **"Permissions"**
3. Scopes recomendados:
   - `user:email` - Acceso a emails del usuario
   - `read:user` - Leer información básica del perfil

---

## Configuración en Firebase Console

### Paso 1: Habilitar GitHub Sign-In

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **nextreadproject**
3. **Authentication** → **Sign-in method**
4. Click en **"GitHub"**
5. Activa el toggle **"Enable"**

### Paso 2: Configurar credenciales

En la ventana de configuración de GitHub:

**Client ID:**
```
Pegar el Client ID de GitHub OAuth App
```

**Client Secret:**
```
Pegar el Client Secret de GitHub OAuth App
```

**Authorization callback URL:**
```
Copiar esta URL y agregarla en GitHub OAuth App
```

6. Click en **"Save"**

### Paso 3: Configurar vinculación de cuentas

1. **Authentication** → **Settings**
2. **User account linking:**
   - ☑️ **"Prevent creation of multiple accounts with the same email address"**
3. Click **"Save"**

Esta configuración permite que si un usuario ya tiene cuenta con otro proveedor (Google, Facebook), GitHub se vincule automáticamente en lugar de crear una cuenta duplicada.

---

## Integración en el proyecto

### Paso 1: Configurar Firebase (`firebase.js`)

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from 'firebase/auth';

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

// Configurar provider de GitHub
const githubProvider = new GithubAuthProvider();

// Opcional: Solicitar scopes adicionales
githubProvider.addScope('user:email');
githubProvider.addScope('read:user');

export { auth, githubProvider };
```

### Paso 2: Crear servicio de autenticación (`authService.js`)

```javascript
import { 
  signInWithPopup,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  OAuthProvider
} from 'firebase/auth';
import { auth, githubProvider } from '../firebase';
import Swal from 'sweetalert2';

/**
 * Login con GitHub
 * GitHub maneja automáticamente la vinculación de cuentas
 */
export const handleSocialLogin = async (providerType) => {
  if (providerType !== 'github') {
    throw new Error('Este método solo maneja GitHub');
  }

  try {
    // Intentar login con GitHub
    const result = await signInWithPopup(auth, githubProvider);
    
    console.log('Login exitoso con GitHub:', result.user);
    
    return {
      success: true,
      user: result.user,
      linked: false
    };
    
  } catch (error) {
    console.error('Error en login con GitHub:', error.code);
    
    // Si la cuenta existe con diferente credencial
    if (error.code === 'auth/account-exists-with-different-credential') {
      return await handleAccountLinking(error, 'github');
    }
    
    // Otros errores
    throw error;
  }
};

/**
 * Vincular GitHub a cuenta existente
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
    } else if (methods.includes('facebook.com')) {
      const { facebookProvider } = await import('../firebase');
      existingProvider = facebookProvider;
      existingProviderName = 'Facebook';
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
        <p>¿Deseas vincular tu cuenta de <strong>GitHub</strong> para poder iniciar sesión con ambos métodos?</p>
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
    console.log('Login exitoso, vinculando GitHub...');
    
    // Vincular la credencial de GitHub
    const linkedUser = await linkWithCredential(loginResult.user, pendingCred);
    console.log('✅ GitHub vinculado exitosamente');
    
    Swal.close();
    
    return {
      success: true,
      user: linkedUser,
      linked: true,
      providerLinked: 'GitHub'
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

  const loginWithGithub = async () => {
    try {
      const result = await handleSocialLogin('github');
      
      if (result.success) {
        if (result.linked) {
          await Swal.fire({
            icon: 'success',
            title: '¡Cuentas Vinculadas!',
            text: `Tu cuenta de GitHub ha sido vinculada exitosamente.`,
            confirmButtonText: 'Continuar'
          });
        } else {
          await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Sesión iniciada con GitHub correctamente',
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
      console.error('Error con GitHub:', error);
      
      if (error.code === "auth/popup-closed-by-user" || 
          error.code === "auth/cancelled-popup-request") {
        return; // Usuario cerró popup
      } else if (error.code === "auth/popup-blocked") {
        Swal.fire(
          "Error",
          "El navegador bloqueó la ventana emergente. Por favor habilita las ventanas emergentes.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          "Ocurrió un error al iniciar sesión con GitHub",
          "error"
        );
      }
    }
  };

  return (
    <button 
      onClick={loginWithGithub}
      className="btn-github"
    >
      <GithubIcon />
      Ingresar con GitHub
    </button>
  );
}
```

---

## Flujo de autenticación

### Diagrama de flujo:

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario click "Ingresar con GitHub"                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ signInWithPopup(auth, githubProvider)                       │
│ └─> Abre popup de autorización de GitHub                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Usuario autoriza en GitHub                                  │
│ └─> Selecciona cuenta y otorga permisos                     │
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

### Ventaja de GitHub sobre Google:

A diferencia de Google, GitHub **SÍ lanza el error** `auth/account-exists-with-different-credential` automáticamente cuando detecta un email duplicado, lo que facilita la vinculación.

### Proceso automático de vinculación:

```javascript
try {
  // Intenta login
  await signInWithPopup(auth, githubProvider);
} catch (error) {
  if (error.code === 'auth/account-exists-with-different-credential') {
    // Firebase detectó automáticamente el conflicto
    // Procedemos a vincular
    await handleAccountLinking(error, 'github');
  }
}
```

## Verificación

### En Firebase Console:

1. **Authentication → Users**
   ```
   usuario@email.com
   ├── Providers: github.com
   ├── Created: [fecha]
   └── Last sign-in: [fecha]
   ```

2. **Verificar vinculación múltiple:**
   ```
   usuario@email.com
   ├── Providers: github.com, google.com
   ├── Created: [fecha con primer proveedor]
   └── Last sign-in: [fecha último login]
   ```

3. **Authentication → Sign-in method**
   - GitHub debe mostrar: **"Enabled"**
   - Número de usuarios con GitHub debe incrementar

### En tu aplicación:

```javascript
// Verificar proveedores del usuario
const user = auth.currentUser;
if (user) {
  console.log('Información de GitHub:');
  const githubData = user.providerData.find(
    profile => profile.providerId === 'github.com'
  );
  
  if (githubData) {
    console.log('Username GitHub:', githubData.displayName);
    console.log('Email GitHub:', githubData.email);
    console.log('Avatar GitHub:', githubData.photoURL);
    console.log('UID GitHub:', githubData.uid);
  }
}
```

### Estructura de datos del usuario:

```javascript
{
  uid: "firebase-uid-123",
  email: "usuario@email.com",
  displayName: "username-github",
  photoURL: "https://avatars.githubusercontent.com/...",
  providerData: [
    {
      providerId: "github.com",
      uid: "github-user-id",
      displayName: "username-github",
      email: "usuario@email.com",
      photoURL: "https://avatars.githubusercontent.com/..."
    }
  ]
}
```


## Notas importantes

**Última actualización:15 Noviembre 2025