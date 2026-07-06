import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';
import axios from 'axios';
import SistemaA from './SistemaA';

const App = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [resultado, setResultado] = useState(null);
  
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const kc = new Keycloak({
      url: 'https://friendly-capybara-pxg99r4vv4jc7jrv-8080.app.github.dev',
      realm: 'Software-Seguro',
      clientId: 'sistema-a-client'
    });

    // 1. CAMBIO AQUÍ: checkLoginIframe en true para detectar cierres de otras pestañas
    kc.init({ onLoad: 'login-required', checkLoginIframe: true })
      .then((auth) => { 
        setKeycloak(kc); 
        setAutenticado(auth); 
      })
      .catch(() => console.error("Fallo al autenticar"));

    // 2. MAGIA SLO: Si Keycloak detecta que la sesión murió en otra pestaña, recarga la página
    kc.onAuthLogout = () => {
      console.log("Sesión cerrada desde otra aplicación.");
      window.location.reload(); 
    };

  }, []);

  const enviarMensaje = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${keycloak.token}` } };
      const respuesta = await axios.post('https://friendly-capybara-pxg99r4vv4jc7jrv-3001.app.github.dev/api/enviar-a-b', { textoSecreto: mensaje }, config);
      setResultado(respuesta.data);
    } catch (error) {
      alert("Error: Revisa que los backends estén encendidos.");
    }
  };

  if (!autenticado) return <div style={{ padding: '50px', textAlign: 'center' }}><h2>Redirigiendo a Keycloak...</h2></div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* CABECERA CON BOTÓN DE LOGOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0d47a1', margin: 0 }}>🏢 APLICACIÓN 1: NODO EMISOR</h1>
        <button 
          onClick={() => keycloak.logout()} 
          style={{ padding: '10px 15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          🚪 Cerrar Sesión Global
        </button>
      </div>

      <p>Usuario: <strong>{keycloak.tokenParsed.preferred_username}</strong></p>
      
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <h3>Enviar Mensaje Confidencial a B</h3>
        <input type="text" value={mensaje} onChange={(e) => setMensaje(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <button onClick={enviarMensaje} style={{ padding: '10px 20px', background: '#11caa0', color: 'white', border: 'none', borderRadius: '5px' }}>Cifrar y Enviar</button>
      </div>

      {resultado && <pre style={{ background: '#e2e8f0', padding: '10px', marginTop: '10px' }}>{JSON.stringify(resultado, null, 2)}</pre>}

      <SistemaA />
    </div>
  );
};

export default App;