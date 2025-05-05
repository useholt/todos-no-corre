import { useState, useEffect } from 'react';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');
  const [dreamsList, setDreamsList] = useState([]);

  // Busca os sonhos do Supabase
  useEffect(() => {
    fetch('/api/getDreams')
      .then(res => res.json())
      .then(data => setDreamsList(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/addDream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dream })
    });
    if (response.ok) {
      const updated = await fetch('/api/getDreams').then(res => res.json());
      setDreamsList(updated);
      setName('');
      setDream('');
    }
  };

  return (
    <div style={{
      background: '#000',
      color: '#fff',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Helvetica Neue', sans-serif",
      textAlign: 'center'
    }}>
      {/* Logo Holt */}
      <img 
        src="/logo-holt.png" 
        alt="Holt" 
        style={{ 
          width: '200px',
          margin: '0 auto 20px',
          display: 'block'
        }} 
      />

      {/* Título principal */}
      <h1 style={{ 
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '20px'
      }}>
        TODOS NO CORRE
      </h1>

      {/* Frase descritiva */}
      <p style={{ 
        fontSize: '1.2rem',
        maxWidth: '600px',
        margin: '0 auto 40px',
        lineHeight: '1.5'
      }}>
        Nosso sonho é mostrar que é possível ter orgulho das suas origens e conquistar o mundo.
      </p>

      {/* Formulário */}
      <div style={{
        background: '#111',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px',
        margin: '0 auto 50px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          marginBottom: '25px',
          textTransform: 'uppercase'
        }}>
          Qual é o seu sonho?
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0',
              background: '#222',
              border: '1px solid #333',
              color: '#fff',
              fontSize: '1.1rem'
            }}
          />
          
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Seu sonho"
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0',
              background: '#222',
              border: '1px solid #333',
              color: '#fff',
              minHeight: '120px',
              fontSize: '1.1rem'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '15px'
            }}
          >
            Publicar no mural
          </button>
        </form>
      </div>

      {/* Mural de Cards Ajustado */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {dreamsList.map((item, index) => (
          <div key={index} style={{
            background: `url('/Hello.png') center/cover no-repeat`,
            padding: '30px 20px',
            borderRadius: '8px',
            minHeight: '400px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Container do texto na área branca */}
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '1.8rem',
                fontWeight: '900',
                margin: '0 0 10px',
                textTransform: 'uppercase',
                color: '#000',
                lineHeight: '1.1'
              }}>
                {item.name.toUpperCase()}
              </h2>
              
              <p style={{ 
                fontSize: '1.1rem',
                margin: '15px 0',
                color: '#333',
                lineHeight: '1.4'
              }}>
                "{item.dream}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

