import React from "react";

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
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
             <tr>
              <th>UseCallback</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 3 */}
             <tr>
              <th>UseContext</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 4 */}
             <tr>
              <th>UseDebug</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 5 */}
             <tr>
              <th>UseDeferred</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 5 */}
             <tr>
              <th>UseEffect</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>


            {/* row 6 */}
             <tr>
              <th>UseId</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 7 */}
             <tr>
              <th>UseImperativeHandle</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 8 */}
             <tr>
              <th>UseInsertionEffect</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 9 */}
            <tr>
              <th>UseLayoutEffect</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 10 */}
             <tr>
              <th>UseMemo</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>


            {/* row 11 */}
            <tr>
              <th>UseOptimistic</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 12 */}
            <tr>
              <th>UseReducer</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 13 */}
            <tr>
              <th>UseRef</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 14 */}
            <tr>
              <th>UseActionsState</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 15 */}
            <tr>
              <th>UseSyncExternalStore</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>

            {/* row 16 */}
            <tr>
              <th>UseTransition</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
          </tbody>
        </table>

        <div className="list-group">
          <a href="/state" className="list-group-item">
            Ir a UseState
          </a>
          <a href="/useNavigate" className="list-group-item">
            Ir a useNavigate
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomeHooks;
