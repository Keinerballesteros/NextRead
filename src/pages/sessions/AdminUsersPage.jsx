import { useState, useEffect } from 'react';
import { getAllSessions } from '../../services/sessionService';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaUsers, FaCalendar, FaSync } from 'react-icons/fa';

const AdminUsersPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    userEmail: '',
    startDate: '',
    endDate: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'loginTime',
    direction: 'desc'
  });

  
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async (searchFilters = {}) => {
    try {
      setLoading(true);
      console.log('Cargando sesiones con filtros:', searchFilters);
      
      const allSessions = await getAllSessions(searchFilters);
      console.log('Sesiones obtenidas:', allSessions);
      
      setSessions(allSessions);
    } catch (error) {
      console.error('Error cargando sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    try {
      
      const dateObj = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
      return dateObj.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', date, error);
      return 'Fecha inválida';
    }
  };

  
  const formatDuration = (seconds) => {
    if (!seconds) return 'En curso';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchFilters = {
      ...filters,
      userEmail: searchTerm
    };
    console.log('Buscando con:', searchFilters);
    loadSessions(searchFilters);
  };

  
  const handleDateFilter = () => {
    const dateFilters = {
      userEmail: searchTerm,
      startDate: filters.startDate ? new Date(filters.startDate) : null,
      endDate: filters.endDate ? new Date(filters.endDate) : null
    };
    
    console.log('Filtrando por fecha:', dateFilters);
    loadSessions(dateFilters);
  };

  
  const handleRefresh = () => {
    setSearchTerm('');
    setFilters({
      userEmail: '',
      startDate: '',
      endDate: ''
    });
    loadSessions();
  };

  
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      userEmail: '',
      startDate: '',
      endDate: ''
    });
    loadSessions();
  };

  
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  
  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortConfig.key === 'loginTime' || sortConfig.key === 'logoutTime') {
      try {
        const dateA = a[sortConfig.key]?.seconds ? 
          a[sortConfig.key].seconds * 1000 : 
          new Date(a[sortConfig.key]).getTime();
        const dateB = b[sortConfig.key]?.seconds ? 
          b[sortConfig.key].seconds * 1000 : 
          new Date(b[sortConfig.key]).getTime();
        
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        }
        return dateB - dateA;
      } catch (error) {
        return 0;
      }
    }
    
    if (sortConfig.key === 'duration') {
      const durationA = a.duration || 0;
      const durationB = b.duration || 0;
      
      if (sortConfig.direction === 'asc') {
        return durationA - durationB;
      }
      return durationB - durationA;
    }
    
    
    const valueA = (a[sortConfig.key] || '').toString().toLowerCase();
    const valueB = (b[sortConfig.key] || '').toString().toLowerCase();
    
    if (sortConfig.direction === 'asc') {
      return valueA.localeCompare(valueB);
    }
    return valueB.localeCompare(valueA);
  });

  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-blue-500" /> : 
      <FaSortDown className="text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando sesiones de usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sesiones de Usuarios</h1>
                <p className="text-gray-600">Administra y revisa los inicios de sesión de los usuarios</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
                <div className="text-gray-600">sesiones totales</div>
              </div>
              <button 
                onClick={handleRefresh}
                className="btn btn-outline btn-sm"
                title="Recargar todas las sesiones"
              >
                <FaSync />
              </button>
              <div className='bg-blue-500 p-2 rounded hover:bg-blue-800 font-bold text-white cursor-pointer'>
                <a href="/">Volver a Home</a>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda por email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por email
              </label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="flex-1 input input-bordered border-gray-300 rounded-lg"
                />
                <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 border-blue-500">
                  <FaSearch />
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-1">
                Busca por dirección de email completa o parcial
              </p>
            </div>

            {/* Filtro por fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha desde
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full input input-bordered border-gray-300 rounded-lg"
              />
            </div>

            {/* Filtro por fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha hasta
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="flex-1 input input-bordered border-gray-300 rounded-lg"
                />
                <button 
                  onClick={handleDateFilter}
                  className="btn bg-blue-500 hover:bg-blue-600 border-blue-500"
                  title="Aplicar filtro de fecha"
                >
                  <FaCalendar />
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Mostrando {sessions.length} sesiones
            </div>
            <div className="flex gap-2">
              <button 
                onClick={clearFilters}
                className="btn btn-ghost text-gray-600"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de sesiones */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('userName')}
                  >
                    <div className="flex items-center gap-2">
                      Usuario
                      {getSortIcon('userName')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('userEmail')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {getSortIcon('userEmail')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('loginTime')}
                  >
                    <div className="flex items-center gap-2">
                      Hora de Entrada
                      {getSortIcon('loginTime')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('logoutTime')}
                  >
                    <div className="flex items-center gap-2">
                      Hora de Salida
                      {getSortIcon('logoutTime')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('duration')}
                  >
                    <div className="flex items-center gap-2">
                      Duración
                      {getSortIcon('duration')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {session.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{session.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(session.loginTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {session.logoutTime ? formatDate(session.logoutTime) : 'En sesión'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDuration(session.duration)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status === 'active' ? 'Activa' : 'Finalizada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron sesiones</h3>
              <p className="text-gray-600">
                {searchTerm || filters.startDate || filters.endDate 
                  ? 'No hay sesiones que coincidan con los filtros aplicados.' 
                  : 'Aún no hay sesiones registradas en el sistema.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;