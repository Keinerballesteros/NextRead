import { useState } from 'react';


const SessionsExcelGenerator = ({ sessions, filters }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExcel = async () => {
    setIsGenerating(true);
    
    try {
        
      if (!window.XLSX) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const XLSX = window.XLSX;

      
      const excelData = sessions.map(session => {
        
        const providers = session.providers && session.providers.length > 0 
          ? session.providers.map(p => {
              const providerNames = {
                'google.com': 'Google',
                'github.com': 'GitHub',
                'facebook.com': 'Facebook',
                'password': 'Email'
              };
              return providerNames[p] || p;
            }).join(', ')
          : 'Desconocido';
        
          
        const loginTime = session.loginTime 
          ? (session.loginTime.seconds 
            ? new Date(session.loginTime.seconds * 1000).toLocaleString('es-ES')
            : new Date(session.loginTime).toLocaleString('es-ES'))
          : 'N/A';
        
          
        const logoutTime = session.logoutTime
          ? (session.logoutTime.seconds 
            ? new Date(session.logoutTime.seconds * 1000).toLocaleString('es-ES')
            : new Date(session.logoutTime).toLocaleString('es-ES'))
          : 'En sesión';
        
          
        const duration = session.duration 
          ? (() => {
              const hours = Math.floor(session.duration / 3600);
              const minutes = Math.floor((session.duration % 3600) / 60);
              const secs = session.duration % 60;
              
              if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
              if (minutes > 0) return `${minutes}m ${secs}s`;
              return `${secs}s`;
            })()
          : 'En curso';
        
        const status = session.status === 'active' ? 'Activa' : 'Finalizada';

        return {
          'Usuario': session.userName || 'N/A',
          'Email': session.userEmail || 'N/A',
          'Proveedores': providers,
          'Hora de Entrada': loginTime,
          'Hora de Salida': logoutTime,
          'Duración': duration,
          'Estado': status
        };
      });

      
      const wb = XLSX.utils.book_new();

      
      const ws = XLSX.utils.json_to_sheet(excelData);

      
      const columnWidths = [
        { wch: 25 }, 
        { wch: 35 },
        { wch: 20 }, 
        { wch: 20 },
        { wch: 20 }, 
        { wch: 15 },
        { wch: 12 }  
      ];
      ws['!cols'] = columnWidths;

      
      XLSX.utils.book_append_sheet(wb, ws, 'Sesiones');

      
      const infoData = [
        { 'Campo': 'Reporte de', 'Valor': 'Sesiones de Usuarios' },
        { 'Campo': 'Fecha de generación', 'Valor': new Date().toLocaleString('es-ES') },
        { 'Campo': 'Total de sesiones', 'Valor': sessions.length },
        { 'Campo': '', 'Valor': '' }
      ];

      
      if (filters.userEmail || filters.startDate || filters.endDate) {
        infoData.push({ 'Campo': 'Filtros Aplicados', 'Valor': '' });
        
        if (filters.userEmail) {
          infoData.push({ 'Campo': 'Email', 'Valor': filters.userEmail });
        }
        if (filters.startDate) {
          infoData.push({ 'Campo': 'Fecha desde', 'Valor': filters.startDate });
        }
        if (filters.endDate) {
          infoData.push({ 'Campo': 'Fecha hasta', 'Valor': filters.endDate });
        }
      }

      const wsInfo = XLSX.utils.json_to_sheet(infoData);
      wsInfo['!cols'] = [{ wch: 25 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsInfo, 'Información');


      const fileName = `sesiones_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Error generando Excel:', error);
      alert('Error al generar el archivo Excel. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateExcel}
      disabled={isGenerating}
      className="btn bg-green-600 hover:bg-green-700 border-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      title="Generar reporte en Excel"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>{isGenerating ? 'Generando...' : 'Generar Excel'}</span>
    </button>
  );
};

export default SessionsExcelGenerator;