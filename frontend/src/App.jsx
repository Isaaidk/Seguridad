import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';
import axios from 'axios';
import SistemaA from './SistemaA';
import SistemaB from './SistemaB';

const App = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [resultado, setResultado] = useState(null);
  
  // Usamos useRef para evitar que Keycloak se inicialice dos veces
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    // 1. Configuramos el puente hacia nuestro servidor Keycloak
    const kc = new Keycloak({
      url: 'https://friendly-capybara-pxg99r4vv4jc7jrv-8080.app.github.dev',
      realm: 'Software-Seguro',
      clientId: 'sistema-a-client'
    });

    // 2. Intentamos iniciar sesión automáticamente
    kc.init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((auth) => {
        setKeycloak(kc);
        setAutenticado(auth);
      })
      .catch(() => console.error("Fallo al autenticar con Keycloak"));
  }, []);

  // 3. Función para enviar el dato a nuestro Sistema A (INTACTA)
  const enviarMensaje = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      };

      const respuesta = await axios.post('https://friendly-capybara-pxg99r4vv4jc7jrv-3001.app.github.dev/api/enviar-a-b', {
        textoSecreto: mensaje
      }, config);

      setResultado(respuesta.data);
    } catch (error) {
      alert("Error: Asegúrate de que el Sistema A y B estén encendidos y el token sea válido.");
    }
  };

  if (!autenticado) {
    return <div style={{ padding: '50px', textAlign: 'center' }}><h2>Redirigiendo a la Bóveda Segura (Keycloak)...</h2></div>;
  }

  // Obtenemos los grupos del token
  const grupos = keycloak.tokenParsed.grupos || keycloak.tokenParsed.groups || [];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#003366' }}>🛡️ Panel de Control DevSecOps</h1>
      <p>Bienvenido, <strong>{keycloak.tokenParsed.preferred_username}</strong>.</p>
      <button onClick={() => keycloak.logout()} style={{ marginBottom: '20px', padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Cerrar Sesión
      </button>

      {/* =========================================================
          PANEL ORIGINAL: SOLO PARA "Administadores"
          (He puesto la palabra tal cual la tienes en Keycloak)
          ========================================================= */}
      {(grupos.includes('Administadores') || grupos.includes('Administradores')) && (
        <>
          <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #005088' }}>
            <h3>Enviar Mensaje Confidencial</h3>
            <input 
              type="text" 
              placeholder="Ej: Código de lanzamiento es 0000" 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button onClick={enviarMensaje} style={{ padding: '10px 20px', background: '#11caa0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cifrar y Enviar (A ➔ B)
            </button>
          </div>

          {resultado && (
            <div style={{ marginTop: '20px', background: '#e2e8f0', padding: '20px', borderRadius: '8px' }}>
              <h4>🧾 Recibo de la Operación:</h4>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(resultado, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}

      {/* =========================================================
          OTRAS FUNCIONALIDADES PARA LOS GRUPOS A Y B
          ========================================================= */}
      
      {grupos.includes('Acceso-Sistema-A') && (
        <SistemaA token={keycloak.token} />
      )}

      {grupos.includes('Acceso-Sistema-B') && (
       
       
        <SistemaB />     
       )}

    </div>
  );
};

export default App;