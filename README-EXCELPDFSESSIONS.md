# Sistema de Historial de Sesiones de Usuarios


📋 Descripción General
Este sistema permite a los administradores gestionar y exportar el historial de sesiones de usuarios. Proporciona funcionalidades para ver, filtrar, ordenar y exportar datos de sesiones en formatos PDF y Excel.

🔐 Acceso a la Funcionalidad de Administrador
Importante: Para acceder a la página de administración y visualizar el historial de sesiones, debes iniciar sesión con las siguientes credenciales:

Email: admin@gmail.com

Contraseña: admin123

Solo este usuario administrador tiene acceso a la vista completa del historial de sesiones.

🗂️ Estructura del Proyecto
text
src/
├── services/
│   └── sessionService.js          # Servicio para manejar operaciones de sesiones
├── components/
│   ├── SessionsPDFGenerator.jsx   # Componente para generar PDF
│   └── SessionsExcelGenerator.jsx # Componente para generar Excel
└── views/
    ├── AdminUsersPage.jsx         # Vista principal de administración
    └── LinkProvidersPage.jsx      # Vista para vincular proveedores
🔧 Servicio de Sesiones (sessionService.js)


# Funciones Principales
1. registerLogin(user)

Propósito: Registrar inicio de sesión de un usuario

Proceso:

Extrae proveedores de autenticación del usuario

Crea objeto de sesión con timestamp de inicio

Almacena en Firestore

Guarda ID de sesión en localStorage

Retorna: ID del documento creado

2. registerLogout()
Propósito: Registrar cierre de sesión

Proceso:

Recupera ID de sesión de localStorage

Calcula duración de sesión

Actualiza documento en Firestore con hora de cierre

Limpia localStorage

3. getAllSessions(filters)
Propósito: Obtener todas las sesiones con filtros aplicables

Parámetros de filtro:

userEmail: Filtra por email (búsqueda parcial)

startDate: Filtra desde fecha específica

endDate: Filtra hasta fecha específica

Retorna: Array de sesiones filtradas y ordenadas

4. getUserSessions(userId)
Propósito: Obtener sesiones específicas de un usuario

Retorna: Array de sesiones del usuario

📊 Componente de Exportación a Excel (SessionsExcelGenerator.jsx)
Características:
Genera archivos Excel (.xlsx) con formato profesional

Incluye nombre del archivo con timestamp

Aplica estilos y formato a celdas

Crea múltiples hojas (datos + información)

Agrupa datos por categorías

Proceso de Generación:
1. Configuración de CDN:

```javascript
if (!window.XLSX) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  document.head.appendChild(script);
}
```
2. Transformación de Datos:
```javascript

const excelData = sessions.map(session => {
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

```

3. Formateo Especial:
Proveedores: Convierte IDs a nombres legibles

Fechas: Formato local español

Duración: Convierte segundos a formato legible (h/m/s)

Estado: Traduce "active" → "Activa", "inactive" → "Finalizada"

4. Creación del Workbook:
```javascript
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(excelData);
const columnWidths = [{ wch: 25 }, { wch: 35 }, { wch: 20 }, ...];
ws['!cols'] = columnWidths;
XLSX.utils.book_append_sheet(wb, ws, 'Sesiones');
```
5. Hoja de Información Adicional:
Crea una segunda hoja con:

Fecha de generación

Total de sesiones

Filtros aplicados

Metadatos del reporte

6. Descarga del Archivo:
```javascript
const fileName = `sesiones_${new Date().toISOString().split('T')[0]}.xlsx`;
XLSX.writeFile(wb, fileName);
Uso en Componente:
jsx
<SessionsExcelGenerator 
  sessions={sortedSessions} 
  filters={filters} 
/>
```

📄 Componente de Exportación a PDF (SessionsPDFGenerator.jsx)
Características:
Genera PDFs con diseño profesional

Orientación horizontal para mejor visualización

Incluye logo y cabecera

Aplica colores y estilos corporativos

Muestra filtros aplicados

Numeración de páginas

Proceso de Generación:
1. Configuración de CDN:

```javascript
// Cargar jsPDF
if (!window.jspdf) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  document.head.appendChild(script);
}

// Cargar autoTable plugin
if (!window.jspdf.jsPDF.API.autoTable) {
  const autoTableScript = document.createElement('script');
  autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
  document.head.appendChild(autoTableScript);
}
2. Creación del Documento:
javascript
const { jsPDF } = window.jspdf;
const doc = new jsPDF('l', 'mm', 'a4'); // Orientación horizontal
3. Cabecera y Metadatos:
javascript
doc.setFontSize(18);
doc.setTextColor(37, 99, 235); // Color azul corporativo
doc.text('Reporte de Sesiones de Usuarios', 15, 20);
doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 15, 28);
4. Sección de Filtros Aplicados:
javascript
if (filters.userEmail || filters.startDate || filters.endDate) {
  doc.text('Filtros aplicados:', 15, yPos);
  // Lista de filtros con viñetas
}
```
5. Creación de la Tabla:
```javascript
doc.autoTable({
  startY: yPos,
  head: [['Usuario', 'Email', 'Proveedores', 'Entrada', 'Salida', 'Duración', 'Estado']],
  body: tableData,
  theme: 'striped',
  headStyles: {
    fillColor: [37, 99, 235], // Azul corporativo
    textColor: 255,
    fontStyle: 'bold'
  },
  columnStyles: {
    0: { cellWidth: 30 }, // Usuario
    1: { cellWidth: 45 }, // Email
    // ... otros anchos
  }
});
```
6. Pie de Página:
```javascript
didDrawPage: (data) => {
  doc.text(
    `Página ${data.pageNumber} de ${pageCount}`,
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
}
```
7. Descarga del Archivo:
```javascript
const fileName = `sesiones_${new Date().toISOString().split('T')[0]}.pdf`;
doc.save(fileName);
Uso en Componente:
jsx
<SessionsPDFGenerator 
  sessions={sortedSessions} 
  filters={filters} 
/>
```

🎨 Vista de Administración (AdminUsersPage.jsx)
Funcionalidades Principales
1. Filtrado y Búsqueda
Búsqueda por email: Búsqueda parcial o completa

Filtro por fechas: Rango específico de fechas

Combinación de filtros: Email + fechas simultáneamente

2. Ordenamiento
Orden por: Email, Usuario, Fecha entrada, Fecha salida, Duración

Dirección ascendente/descendente

Indicadores visuales de ordenamiento

3. Visualización de Datos
Formateo de fechas legibles

Visualización de proveedores con íconos

Estados visuales de sesiones (activa/finalizada)

Formato de duración (horas/minutos/segundos)

4. Botones de Exportación:
Excel: Botón verde con ícono de documento

PDF: Botón rojo con ícono de PDF

Estado de carga visual durante generación

Flujo de Trabajo
Carga inicial: Obtiene todas las sesiones al montar el componente

Aplicación de filtros: Usuario define criterios de búsqueda

Procesamiento:

Filtra datos según criterios

Ordena según configuración

Formatea para visualización

Exportación:

Usuario selecciona formato (PDF/Excel)

Componente genera archivo con datos actuales

Descarga automática al navegador

🔗 Vista de Vinculación de Proveedores (LinkProvidersPage.jsx)
Funcionalidades:
Vinculación: Permite agregar múltiples métodos de autenticación

Desvinculación: Remover proveedores (excepto el último)

Visualización: Muestra proveedores actualmente vinculados

Validación: Previene pérdida de acceso

Proveedores Soportados:
Google (google.com)

GitHub (github.com)

Facebook (facebook.com)

📦 Dependencias y CDNs
Los componentes de exportación utilizan CDN para evitar dependencias pesadas:

Para Excel:
html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
Para PDF:
html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
🚀 Instalación y Configuración
No se requieren instalaciones adicionales ya que los componentes usan CDN

Configurar Firebase:

Asegurar que Firestore esté habilitado

Configurar reglas de seguridad apropiadas

Verificar colección user_sessions

Importar componentes:

jsx
import SessionsPDFGenerator from '../../components/SessionsPDFGenerator';
import SessionsExcelGenerator from '../../components/SessionsExcelGenerator';
🔒 Consideraciones de Seguridad
Acceso restringido: Solo usuario administrador puede ver el historial

Datos sensibles: Los emails se muestran solo a administradores

Persistencia local: El ID de sesión se almacena temporalmente

Validación de permisos: Firebase Security Rules deben estar configuradas

🐛 Solución de Problemas Comunes
Problema: No se generan archivos de exportación
Solución:

Verificar conexión a internet (CDN requiere conexión)

Comprobar permisos de escritura del navegador

Revisar consola para errores de CORS

Verificar que el bloqueador de anuncios no bloquee las descargas

Problema: Archivos Excel sin formato
Solución:

Verificar que el CDN de SheetJS esté cargado correctamente

Revisar que los datos no contengan valores undefined

Verificar formato de fechas antes de la conversión

Problema: PDF con tablas desbordadas
Solución:

Reducir el tamaño de fuente en bodyStyles

Ajustar anchos de columna en columnStyles

Considerar orientación vertical si hay muchas columnas

Problema: Filtros no funcionan correctamente
Solución:

Verificar formato de fechas (YYYY-MM-DD)

Confirmar que Firestore tenga índices compuestos necesarios

Revisar logs de Firestore

📈 Mejoras Futuras
Exportación programada: Envío automático de reportes por email

Métricas avanzadas: Gráficos de uso y estadísticas

Búsqueda avanzada: Filtros por proveedor, duración, etc.

Exportación CSV: Opción adicional para hojas de cálculo

Plantillas personalizables: Diferentes estilos de reportes

Caché de librerías: Almacenar librerías localmente para trabajo offline

📝 Notas de Implementación
Los timestamps se almacenan en formato nativo de Firestore (seconds + nanoseconds)

La duración se calcula en segundos y se formatea para visualización

Los filtros aplican tanto en Firestore como en memoria para mayor flexibilidad

La exportación incluye solo los datos visibles en pantalla (filtrados y ordenados)

El diseño es responsive para diferentes dispositivos

Los componentes usan CDN para mantener ligero el bundle de la aplicación

🔗 Recursos Adicionales
SheetJS (xlsx) Documentación

jsPDF Documentación

jsPDF-autoTable Documentación

Firebase Firestore Documentación