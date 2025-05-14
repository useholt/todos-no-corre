import { useState, useEffect } from 'react';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');
  const [dreamsList, setDreamsList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetch('/api/getDreams')
      .then(res => res.json())
      .then(data => setDreamsList(data));
  }, []);

  // FUNÇÃO PRINCIPAL: GERA IMAGEM COM TEXTO
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
    
    // Configurações do texto (alterei para cinza escuro para melhor contraste)
    ctx.fillStyle = '#333333'; // Mudança importante!
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(name.toUpperCase(), canvas.width/2, 50);

    ctx.font = '28px Arial';
    const maxWidth = canvas.width - 80;
    const lineHeight = 32;
    const words = dream.split(' ');
    let line = '';
    let y = 150;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth) {
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

  // FORMULÁRIO ATUALIZADO: GERA E ARMAZENA IMAGEM COM TEXTO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gera a imagem com texto antes de enviar
    const imageUrl = await generateImageWithText(name, dream); 

    const response = await fetch('/api/addDream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dream, imageUrl }) // Adiciona a URL da imagem
    });
    
    if (response.ok) {
      const updated = await fetch('/api/getDreams').then(res => res.json());
      setDreamsList(updated);
      setName('');
      setDream('');
    }
  };

  // MODAL ATUALIZADO (SEM BOTÃO "SALVAR")
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
      {/* ... (cabeçalho permanece igual) ... */}

      {/* MURAL ATUALIZADO: USA IMAGENS COM TEXTO */}
      {hasMounted && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '4px',
          padding: '4px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {dreamsList.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                position: 'relative',
                cursor: 'pointer',
                aspectRatio: '1/1',
                overflow: 'hidden'
              }}
              onClick={() => openLightbox(item)}
            >
              <img
                src={item.imageUrl} // Agora usa a imagem gerada com texto!
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
      )}

      {/* MODAL SIMPLIFICADO (PERMITE SALVAR VIA BOTÃO DIREITO) */}
      {isModalOpen && selectedImage && (
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
            justifyContent: 'center'
          }} 
          onClick={closeLightbox}
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
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            
            {/* IMAGEM PRONTA PARA SALVAR VIA BOTÃO DIREITO */}
            <img
              src={selectedImage.imageUrl}
              alt={`Sonho de ${selectedImage?.name}`}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
