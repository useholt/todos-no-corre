import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');
  const [dreamsList, setDreamsList] = useState([]);
  const cardRefs = useRef([]);

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

  const saveCardAsImage = (index) => {
    html2canvas(cardRefs.current[index]).then(canvas => {
      const link = document.createElement('a');
      link.download = `sonho-${dreamsList[index].name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
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
        <img 
          src="/logo-holt.png" 
          alt="Holt" 
          style={{ 
            width: '200px',
            margin: '0 auto',
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

      {/* Mural de Sonhos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        padding: '20px'
      }}>
        {dreamsList.map((item, index) => (
          <div 
            key={index} 
            ref={el => cardRefs.current[index] = el}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => saveCardAsImage(index)}
          >
            {/* Card do sonho */}
            <div style={{
              backgroundImage: `url('/Hello.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '300px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              boxSizing: 'border-box',
              position: 'relative'
            }}>
              {/* Conteúdo do card */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '20px',
                borderRadius: '10px',
                width: '90%'
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  margin: '0 0 10px 0',
                  textTransform: 'uppercase'
                }}>
                  {item.name.toUpperCase()}
                </h2>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontStyle: 'italic',
                  margin: '0'
                }}>
                  "{item.dream}"
                </p>
                <div style={{
                  marginTop: '15px',
                  color: '#fff',
                  fontSize: '1.2rem'
                }}>
                  🍀 🍀 🍀
                </div>
              </div>
            </div>
            
            {/* Botão de download (opcional) */}
            <button 
              style={{
                marginTop: '10px',
                padding: '8px 15px',
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                saveCardAsImage(index);
              }}
            >
              Salvar Imagem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
