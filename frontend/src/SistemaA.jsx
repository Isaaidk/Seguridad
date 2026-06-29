import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SistemaA() {
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Esta función hace la petición GET al backend del Sistema A para traer los logs
  const cargarLogsReales = async () => {
    setCargando(true);
    try {
      // Nos conectamos al endpoint del Sistema A (puerto 3001)
      const respuesta = await axios.get('https://friendly-capybara-pxg99r4vv4jc7jrv-3001.app.github.dev/api/logs');
      setPeticiones(respuesta.data); // Guardamos la info real del servidor en el estado
    } catch (error) {
      console.error("Error al traer los logs del Sistema A:", error);
    }
    setCargando(false);
  };

  // Carga las peticiones automáticamente al abrir el panel
  useEffect(() => {
    cargarLogsReales();
  }, []);

  return (
    <div style={{ marginTop: '20px', padding: '20px', background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px' }}>
      <h2 style={{ color: '#0d47a1', marginTop: 0 }}>🛡️ Sistema A: Cuadro de Auditoría</h2>
      <p style={{ color: '#555' }}>Registro real de operaciones de cifrado y envío del nodo emisor.</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#1976d2', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID Petición</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Hora</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Acción Ejecutada</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estado</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Detalle Técnico</th>
            </tr>
          </thead>
          <tbody>
            {peticiones.length === 0 && !cargando && (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No hay peticiones registradas aún en el servidor A.
                </td>
              </tr>
            )}
            
            {peticiones.map((pet, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', color: '#666' }}>#{pet.id}</td>
                <td style={{ padding: '12px' }}>{pet.fecha}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#333' }}>{pet.accion}</td>
                <td style={{ padding: '12px', color: pet.estado === 'Exitoso' ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
                  {pet.estado}
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#555', wordBreak: 'break-all' }}>{pet.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={cargarLogsReales} 
        disabled={cargando}
        style={{ marginTop: '15px', padding: '10px 20px', background: '#0d47a1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
        {cargando ? '🔄 Obteniendo datos...' : '🔄 Refrescar Peticiones'}
      </button>
    </div>
  );
}