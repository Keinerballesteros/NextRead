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
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/uselayouteffect" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 11 */}
             <tr>
              <th>UseMemo</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/usememo" className="link-accent">Ir al Hook</Link></td>
            </tr>


            {/* row 12 */}
            <tr>
              <th>UseOptimistic</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/useoptimistic" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 13 */}
            <tr>
              <th>UseReducer</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/usereducer" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 14 */}
            <tr>
              <th>UseRef</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/useref" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 15 */}
            <tr>
              <th>UseActionsState</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/useactionstate" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 16 */}
            <tr>
              <th>UseSyncExternalStore</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/usesyncexternalstore" className="link-accent">Ir al Hook</Link></td>
            </tr>

            {/* row 17 */}
            <tr>
              <th>UseTransition</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td><Link to="/usetransition" className="link-accent">Ir al Hook</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeHooks;
