import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SistemaB() {
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Esta función va al Sistema B y trae los logs REALES
  const cargarLogsReales = async () => {
    setCargando(true);
    try {
      // Hacemos un GET al puerto 3002 (Sistema B)
      const respuesta = await axios.get('https://friendly-capybara-pxg99r4vv4jc7jrv-3002.app.github.dev/api/logs');
      setLogs(respuesta.data); // Guardamos la info real del servidor
    } catch (error) {
      console.error("Error al traer los logs del Sistema B:", error);
    }
    setCargando(false);
  };

  // Cargar los logs automáticamente cuando se abre la página
  useEffect(() => {
    cargarLogsReales();
  }, []);

  return (
    <div style={{ marginTop: '20px', padding: '20px', background: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}>
      <h2 style={{ color: '#4caf50', marginTop: 0, fontFamily: 'sans-serif' }}>🕵️ Sistema B: Terminal de Descifrado</h2>
      <p style={{ color: '#aaa', fontFamily: 'sans-serif', fontSize: '14px' }}>Interceptación de peticiones reales al Sistema B.</p>

      {/* --- PANTALLA DE CONSOLA NEGRA --- */}
      <div style={{ background: '#000', padding: '15px', borderRadius: '5px', height: '300px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}>
        
        {logs.length === 0 && !cargando && (
           <div style={{ color: '#666' }}>{'>'} El servidor B no tiene logs registrados todavía... _</div>
        )}

        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '15px', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
            <div style={{ color: '#ff9800', wordBreak: 'break-all' }}>
              🔒 Recibido dato cifrado: {log.cifrado}
            </div>
            <div style={{ color: '#00ff00', marginTop: '5px' }}>
              🔓 Dato abierto con éxito: {log.abierto} 
            </div>
          </div>
        ))}
        
        {cargando && <div style={{ color: '#00ff00' }}>Cargando datos del servidor...</div>}
      </div>

      <button 
        onClick={cargarLogsReales} 
        disabled={cargando}
        style={{ marginTop: '15px', padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
        {cargando ? '🔄 Obteniendo...' : '🔄 Refrescar Consola Real'}
      </button>
    </div>
  );
}