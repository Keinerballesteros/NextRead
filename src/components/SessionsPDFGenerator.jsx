import { useState } from 'react';

const SessionsPDFGenerator = ({ sessions, filters }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      if (!window.jspdf.jsPDF.API.autoTable) {
        const autoTableScript = document.createElement('script');
        autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
        document.head.appendChild(autoTableScript);
        
        await new Promise((resolve, reject) => {
          autoTableScript.onload = resolve;
          autoTableScript.onerror = reject;
        });
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('l', 'mm', 'a4');
      
      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text('Reporte de Sesiones de Usuarios', 15, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 15, 28);
      
      let yPos = 35;
      if (filters.userEmail || filters.startDate || filters.endDate) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('Filtros aplicados:', 15, yPos);
        yPos += 6;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        
        if (filters.userEmail) {
          doc.text(`• Email: ${filters.userEmail}`, 20, yPos);
          yPos += 5;
        }
        if (filters.startDate) {
          doc.text(`• Fecha desde: ${filters.startDate}`, 20, yPos);
          yPos += 5;
        }
        if (filters.endDate) {
          doc.text(`• Fecha hasta: ${filters.endDate}`, 20, yPos);
          yPos += 5;
        }
        yPos += 3;
      }
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total de sesiones: ${sessions.length}`, 15, yPos);
      yPos += 8;
      
      const tableData = sessions.map(session => {
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
        
        return [
          session.userName || 'N/A',
          session.userEmail || 'N/A',
          providers,
          loginTime,
          logoutTime,
          duration,
          status
        ];
      });
      
      doc.autoTable({
        startY: yPos,
        head: [['Usuario', 'Email', 'Proveedores', 'Entrada', 'Salida', 'Duración', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [50, 50, 50]
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 45 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Página ${data.pageNumber} de ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });
      
      const fileName = `sesiones_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="btn bg-red-500 hover:bg-red-600 border-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      title="Generar reporte en PDF"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span>{isGenerating ? 'Generando...' : 'Generar PDF'}</span>
    </button>
  );
};

export default SessionsPDFGenerator;