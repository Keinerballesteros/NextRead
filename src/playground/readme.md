# 📘 Hooks en React

Los **Hooks** en React son funciones especiales que permiten **usar estado y otras características de React** en componentes funcionales, sin necesidad de usar clases.  

Fueron introducidos a partir de **React 16.8** para simplificar la manera de manejar el ciclo de vida, estado y lógica reutilizable.

---

## 📌 ¿Para qué se utilizan?
- Manejar **estado** y **ciclo de vida** en componentes funcionales.  
- Reutilizar lógica entre diferentes componentes.  
- Evitar estructuras complejas que se tenían con clases.  
- Mejorar la **legibilidad** y **organización** del código.  

---

## 🛠️ Hooks explicados

### 1. **useState**
Permite **agregar estado** a un componente funcional.
```jsx
const [count, setCount] = useState(0);
```
- `count` es el valor actual.  
- `setCount` es la función para actualizarlo.  

---

### 2. **useCallback**
Evita que una función se **recree** cada vez que el componente se renderiza.  
Se usa para **optimizar rendimiento** en funciones pasadas como props.
```jsx
const memoizedFn = useCallback(() => {
  console.log("Función memorizada");
}, []);
```

---

### 3. **useContext**
Permite acceder a datos de un **Context** sin necesidad de pasar props manualmente.
```jsx
const valor = useContext(MiContexto);
```

---

### 4. **useDebugValue**
Sirve para mostrar información personalizada en las **herramientas de React DevTools**.
```jsx
useDebugValue(isOnline ? "Online" : "Offline");
```

---

### 5. **useDeferredValue**
Retrasa la actualización de un valor para **mejorar rendimiento** en tareas pesadas.
```jsx
const deferredValue = useDeferredValue(valorPesado);
```

---

### 6. **useEffect**
Permite ejecutar código en diferentes momentos del **ciclo de vida** del componente.
```jsx
useEffect(() => {
  console.log("Se ejecuta después del render");
}, []);
```

---

### 7. **useId**
Genera un **ID único** y estable para elementos como inputs.
```jsx
const id = useId();
```

---

### 8. **useImperativeHandle**
Permite que un componente hijo **exponga métodos** al componente padre usando `ref`.
```jsx
useImperativeHandle(ref, () => ({
  metodoExpuesto() {
    console.log("Método accesible desde el padre");
  }
}));
```

---

### 9. **useInsertionEffect**
Se ejecuta **antes** de que el navegador inserte cambios en el DOM, útil para inyectar estilos.
```jsx
useInsertionEffect(() => {
  // Lógica para insertar estilos dinámicos
}, []);
```

---

## 🔄 Resumen gráfico del orden de ejecución de efectos
1. **useInsertionEffect** → Antes de que el DOM se actualice  
2. **useLayoutEffect** → Después de que el DOM se actualiza, pero antes del render visual  
3. **useEffect** → Después de que el navegador pinta la pantalla  

---

## 📚 Recursos
- [Documentación Oficial de React](https://react.dev/reference/react)