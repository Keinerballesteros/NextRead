import React from "react";
import { Link } from "react-router-dom";

function HomeHooks() {
  return (
    <div className="w-full items-center justify-center p-5">
      <div className="text-center">
        <h2 className="font-bold text-3xl">Hooks de React</h2>

        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Explicacion</th>
              <th>Categorias</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>UseState</th>
              <td>El hook useState en React es una función que permite a los componentes funcionales manejar estado local. Recibe un valor inicial y devuelve un arreglo con dos elementos: el estado actual y una función para actualizarlo. Cada vez que se llama a esta función, React actualiza el valor del estado y vuelve a renderizar el componente con la información más reciente. Su uso debe seguir ciertas reglas, como llamarlo siempre en el nivel superior del componente y nunca dentro de condicionales o bucles, para que React pueda mantener el estado de forma correcta entre renders.</td>
              <td className="text-success">Estado</td>
              <td><Link to="/usestate" className="link-accent">Ir al Hook</Link></td>
            </tr>
            {/* row 2 */}
             <tr>
              <th>UseCallback</th>
              <td>Tiene como memorizar funciones para evitar que se vuelvan a crear en cada render innecesariamente, lo que ayuda a optimizar el rendimiento cuando esas funciones se pasan como props a componentes hijos o se usan en otros hooks</td>
              <td className="text-success">Rendimiento</td>
              <td><Link to="/usecallback" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 3 */}
             <tr>
              <th>UseContext</th>
              <td>El hook useContext en React es una función que permite acceder al valor de un contexto creado con createContext, sin tener que pasar props manualmente a través de todos los niveles del árbol de componentes. Esto facilita compartir datos globales, como temas, idioma o información del usuario, de manera sencilla y eficiente dentro de la aplicación.</td>
              <td className="text-success">Contexto</td>
              <td><Link to="/usecontext" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 4 */}
             <tr>
              <th>UseDebug</th>
              <td>Se usa principalmente para mostrar etiquetas personalizadas en React DevTools cuando inspeccionas un hook personalizado.</td>
              <td className="text-success">Depuración</td>
              <td><Link to="/usedebug" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 5 */}
             <tr>
              <th>useDeferredValue</th>
              <td>El hook useDeferredValue permite diferir la actualización de un valor para que React priorice actualizaciones más urgentes (como la entrada del usuario), y deje otras partes de la interfaz para más adelante, evitando bloqueos o lentitud</td>
              <td className="text-success">Rendimiento</td>
              <td><Link to="/usedeffer" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 6 */}
             <tr>
              <th>UseEffect</th>
              <td>Estos hooks sirven para ejecutar código que ocurre fuera del flujo de renderizado del componente, es decir, para manejar efectos secundarios.</td>
              <td className="text-success">Efectos</td>
              <td><Link to="/useeffect" className="link-accent">Ir al Hook</Link></td>
            </tr>


            {/* row 7 */}
             <tr>
              <th>UseId</th>
              <td>Se usa para generar IDs únicos y estables para elementos que necesitan un identificador en el DOM, especialmente para accesibilidad o cuando hay formularios dinámicos.</td>
              <td className="text-success">Utilidades</td>
              <td><Link to="/useid" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 8 */}
             <tr>
              <th>UseImperativeHandle</th>
              <td>Por defecto, cuando pasas una referencia (ref) a un componente con forwardRef, esa ref apunta al nodo DOM interno o al componente hijo.</td>
              <td className="text-success">Referencia</td>
              <td><Link to="/useimperativehandle" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 9 */}
             <tr>
              <th>UseInsertionEffect</th>
              <td>l hook useInsertionEffect en React es un hook especial que se ejecuta justo antes de que el navegador inserte cambios en el DOM, pero después de que React haya calculado todas las actualizaciones. Se utiliza principalmente para bibliotecas de estilos o situaciones donde necesitas inyectar CSS dinámicamente de forma sincronizada con el renderizado, evitando parpadeos o estilos incorrectos.</td>
              <td className="text-success">Efecto</td>
              <td><Link to="/useinsertioneffect" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 10 */}
            <tr>
              <th>UseLayoutEffect</th>
              <td>Es un hook similar a useEffect, pero se ejecuta justo después de que React actualiza el DOM y antes de que el navegador pinte en pantalla; se usa cuando necesitas leer o modificar el DOM de forma inmediata (como medir el tamaño de un elemento) para evitar que el usuario vea un “parpadeo” en la interfaz.</td>
              <td className="text-success">Efecto</td>
              <td><Link to="/uselayouteffect" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 11 */}
             <tr>
              <th>UseMemo</th>
              <td>Memoriza el resultado de una función o cálculo y solo lo vuelve a ejecutar si cambian las dependencias que le indiques; se utiliza para optimizar el rendimiento y evitar cálculos innecesarios en cada render, especialmente en operaciones costosas como filtros, listas grandes o cálculos matemáticos complejos.</td>
              <td className="text-success">Performance</td>
              <td><Link to="/usememo" className="link-accent">Ir al Hook</Link></td>
            </tr>


            {/* row 12 */}
            <tr>
              <th>UseOptimistic</th>
              <td>Es un hook experimental pensado para manejar actualizaciones optimistas en la UI, es decir, mostrar de inmediato un cambio (como un “like” o una nueva tarea en una lista) sin esperar la respuesta del servidor, lo que hace que la aplicación se sienta más rápida; luego, si el servidor confirma, se mantiene el cambio, y si falla, se puede revertir.</td>
              <td className="text-success">Nuevo en React</td>
              <td><Link to="/useoptimistic" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 13 */}
            <tr>
              <th>UseReducer</th>
              <td>Sirve para manejar estados más complejos que con useState, porque en vez de cambiar el valor directamente, usas una función reductora (reducer) que recibe el estado actual y una acción, y devuelve el nuevo estado; esto es útil cuando hay varias formas distintas de modificar el mismo estado, como en un contador con botones para sumar, restar y resetear, o en una lista de tareas con acciones para agregar, eliminar o marcar como completada</td>
              <td className="text-success">Estado</td>
              <td><Link to="/usereducer" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 14 */}
            <tr>
              <th>UseRef</th>
              <td>Sirve para guardar un valor que no se pierde entre renders, sin que al cambiar ese valor se vuelva a renderizar el componente. También se usa mucho para referenciar elementos del DOM (como inputs o divs) y poder manipularlos directamente (por ejemplo, hacer focus en un input).</td>
              <td className="text-success">Referencias</td>
              <td><Link to="/useref" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 15 */}
            <tr>
              <th>UseActionsState</th>
              <td>Sirve para manejar el estado de un formulario o acción asíncrona de forma más simple. Cuando usas useActionState, React te da un estado (state) y una función (action) que se encarga de procesar algo (por ejemplo, enviar un formulario) y actualizar automáticamente ese estado con el resultado. Así no tienes que manejar useState manualmente para el “cargando”, “éxito” o “error”.</td>
              <td className="text-success">Nuevo en React</td>
              <td><Link to="/useactionstate" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 16 */}
            <tr>
              <th>UseSyncExternalStore</th>
              <td>Sirve para conectarte a un estado externo (algo que no está dentro de React, como el localStorage, un store global, o incluso el window con un event listener).</td>
              <td className="text-success">Contexto</td>
              <td><Link to="/usesyncexternalstore" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 17 */}
            <tr>
              <th>UseTransition</th>
              <td>Sirve para manejar actualizaciones que no son urgentes (como filtros, búsquedas, o cargar datos).</td>
              <td className="text-success">Performance</td>
              <td><Link to="/usetransition" className="link-accent">Ir al Hook</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeHooks;
