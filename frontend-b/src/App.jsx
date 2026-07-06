import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';
import SistemaB from './SistemaB'; 

const App = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const kc = new Keycloak({
      url: 'https://friendly-capybara-pxg99r4vv4jc7jrv-8080.app.github.dev',
      realm: 'Software-Seguro',
      clientId: 'sistema-a-client' 
    });

    // 1. checkLoginIframe en true
    kc.init({ onLoad: 'login-required', checkLoginIframe: true })
      .then((auth) => { 
        setKeycloak(kc); 
        setAutenticado(auth); 
      })
      .catch(() => console.error("Fallo al autenticar"));

    // 2. Escuchador de Logout
    kc.onAuthLogout = () => {
      console.log("Sesión cerrada desde otra aplicación.");
      window.location.reload(); 
    };

  }, []);

  if (!autenticado) return <div style={{ padding: '50px', textAlign: 'center', background: '#000', color: '#0f0', height: '100vh' }}><h2>Verificando identidad...</h2></div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto', background: '#121212', minHeight: '100vh', color: 'white' }}>
      
      {/* CABECERA CON BOTÓN DE LOGOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#4caf50', margin: 0 }}>🖥️ APLICACIÓN 2: NODO RECEPTOR</h1>
        <button 
          onClick={() => keycloak.logout()} 
          style={{ padding: '10px 15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          🚪 Cerrar Sesión Global
        </button>
      </div>

      <p style={{ color: '#aaa' }}>Auditor en sesión: <strong>{keycloak.tokenParsed.preferred_username}</strong></p>
      
      <SistemaB />
    </div>
  );
};

export default App;