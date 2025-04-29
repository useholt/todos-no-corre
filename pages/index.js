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
      background: '#fff',
      color: '#000',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Helvetica Neue', sans-serif"
    }}>
      {/* Cabeçalho com Logo Holt */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img 
          src="/logo-holt.png" 
          alt="Holt" 
          style={{ 
            width: '200px',
            margin: '0 auto 20px',
            display: 'block'
          }} 
        />
        
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: '20px 0 10px',
          textTransform: 'uppercase'
        }}>
          TODOS NO CORRE
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Nosso sonho é mostrar que é possível ter orgulho das suas origens e conquistar o mundo.
        </p>
      </div>

      {/* Formulário Simplificado */}
      <div style={{
        background: '#f5f5f5',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '0 auto 40px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Qual é o seu sonho?</h2>
        
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
              border: '2px solid #000',
              background: 'transparent'
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
              border: '2px solid #000',
              background: 'transparent',
              minHeight: '100px'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: '#000',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            PUBLICAR
          </button>
        </form>
      </div>

      {/* Mural de Sonhos Atualizado */}
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
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#000',
            border: '2px solid #000'
          }}>
            {/* Nome em Destaque */}
            <h2 style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '10px 0',
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {item.name.toUpperCase()}
            </h2>

            {/* Sonho com Fundo Branco */}
            <div style={{ 
              background: 'rgba(255,255,255,0.9)',
              padding: '15px',
              borderRadius: '4px'
            }}>
              <p style={{ 
                fontSize: '1.1rem',
                fontStyle: 'italic',
                margin: 0
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
