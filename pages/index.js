import { useState, useEffect } from 'react';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');
  const [dreamsList, setDreamsList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Função para gerar imagem com texto
  const generateImageWithText = async (name, dream) => {
    const baseImage = new Image();
    baseImage.crossOrigin = "anonymous";
    baseImage.src = '/Hello.png';
    
    await new Promise((resolve) => (baseImage.onload = resolve));

    const canvas = document.createElement('canvas');
    canvas.width = baseImage.naturalWidth;
    canvas.height = baseImage.naturalHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(baseImage, 0, 0);
    
    // Configurações do texto
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    
    // Escreve o nome
    ctx.fillText(name.toUpperCase(), canvas.width/2, 100);
    
    // Escreve o sonho
    ctx.font = '28px Arial';
    const maxWidth = canvas.width - 40;
    const lineHeight = 35;
    const words = dream.split(' ');
    let line = '';
    let y = 200;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(`"${line}"`, canvas.width/2, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(`"${line}"`, canvas.width/2, y);

    return canvas.toDataURL('image/png');
  };

  // Função de download atualizada
  const downloadImage = async (item) => {
    const imageUrl = await generateImageWithText(item.name, item.dream);
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `sonho-${item.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openLightbox = (item) => {
    setSelectedImage(item);
    setIsModalOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
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
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '20px'
      }}>
        TODOS NO CORRE
      </h1>

      <p style={{ 
        fontSize: '1.2rem',
        maxWidth: '600px',
        margin: '0 auto 40px',
        lineHeight: '1.5'
      }}>
        Nosso sonho é mostrar que é possível ter orgulho das suas origens e conquistar o mundo.
      </p>

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
        padding: '4px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        '@media (min-width: 640px)': {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          padding: '8px'
        },
        '@media (min-width: 1024px)': {
          gridTemplateColumns: 'repeat(5, 1fr)'
        }
      }}>
        {dreamsList.map((item, index) => (
          <div 
            key={index} 
            style={{
              position: 'relative',
              cursor: 'pointer',
              aspectRatio: '1/1',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'scale(1.03)'
              }
            }}
            onClick={() => openLightbox(item)}
          >
            <img
              src="/Hello.png"
              alt={`Sonho de ${item.name}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9)'
              }}
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.97)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }} 
        >
          <div style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90vh',
            textAlign: 'center'
          }}>
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '2.5rem',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              ×
            </button>

            <button
              onClick={() => downloadImage(selectedImage)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '60px',
                background: '#ffffff',
                border: 'none',
                color: '#000',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 1001,
                fontWeight: 'bold'
              }}
            >
              SALVAR
            </button>
            
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
            }}>
              <img
                src="/Hello.png"
                alt={`Sonho de ${selectedImage?.name}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  margin: 0,
                  color: '#000',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  {selectedImage?.name.toUpperCase()}
                </h3>
                <p style={{ 
                  margin: '15px 0 0',
                  color: '#333',
                  fontSize: '1.4rem',
                  lineHeight: '1.4'
                }}>
                  "{selectedImage?.dream}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
