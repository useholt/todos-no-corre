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
        <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
          <strong>TODOS NO CORRE!</strong> Nosso sonho é mostrar que é possível ter orgulho das suas origens e conquistar o mundo.
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
              cursor: 'pointer',
              transition: 'all 0.3s',
              ':hover': {
                background: '#ddd'
              }
            }}
          >
            PUBLICAR
          </button>
        </form>
      </div>

      {/* Mural de Sonhos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {dreamsList.map((item, index) => (
          <div key={index} style={{
            background: '#111',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '4px solid #fff'
          }}>
            <h3 style={{ color: '#fff', marginBottom: '10px' }}>HELLO,</h3>
            <h2 style={{ 
              color: '#fff', 
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: '10px 0',
              textTransform: 'uppercase'
            }}>
              MY NAME IS {item.name}
            </h2>
            <p style={{ 
              color: '#ccc', 
              fontStyle: 'italic',
              minHeight: '60px'
            }}>
              "{item.dream}"
            </p>
            <div style={{ 
              marginTop: '15px', 
              color: '#fff',
              textAlign: 'right'
            }}>
              🍀 🍀 🍀
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
