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
      fontFamily: "'Helvetica Neue', sans-serif"
    }}>
      {/* Cabeçalho com Logo Holt e Textos */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {/* Logo Holt */}
        <img 
          src="/logo-holt.png" 
          alt="Holt" 
          style={{ 
            width: '200px',
            margin: '0 auto',
            display: 'block'
          }} 
        />
        
        {/* "TODOS NO CORRE" */}
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: '20px 0 10px',
          textTransform: 'uppercase'
        }}>
          TODOS NO CORRE
        </h1>
        
        {/* Frase inspiradora */}
        <p style={{ 
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Nosso sonho é mostrar que é possível ter orgulho das suas origens e conquistar o mundo.
        </p>
      </div>

      {/* Formulário */}
      <div style={{
        background: '#111',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '0 auto 40px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>E você, qual é o seu sonho?</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>NOME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#222',
                border: '1px solid #333',
                color: '#fff'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>SONHO</label>
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#222',
                border: '1px solid #333',
                color: '#fff',
                minHeight: '100px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            PUBLICAR
          </button>
        </form>
      </div>

      {/* Mural de Sonhos com Imagem de Fundo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        padding: '20px'
      }}>
        {dreamsList.map((item, index) => (
          <div key={index} style={{
            background: `url('/Hello.png') center/cover no-repeat`,
            padding: '40px 20px',
            borderRadius: '8px',
            position: 'relative',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#000',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {/* Overlay escuro para melhor legibilidade */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px'
            }}></div>
            
            {/* Conteúdo do card (sobreposto) */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ 
                fontSize: '1.2rem',
                marginBottom: '10px',
                color: '#fff'
              }}>
                HELLO,
              </h3>
              <h2 style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '10px 0',
                color: '#000',
                textTransform: 'uppercase'
              }}>
                MY NAME IS {item.name}
              </h2>
              <p style={{ 
                fontSize: '1.1rem',
                color: '#fff',
                fontStyle: 'italic',
                margin: '20px 0'
              }}>
                "{item.dream}"
              </p>
              <div style={{ 
                marginTop: '20px',
                color: '#fff'
              }}>
                🍀 🍀 🍀
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
