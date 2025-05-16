import { useState, useEffect } from 'react';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');
  const [dreamsList, setDreamsList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetch('/api/getDreams')
      .then(res => res.json())
      .then(data => setDreamsList(data.reverse())) // Ordena do mais novo para o mais antigo
      .catch(error => console.error('Erro ao carregar sonhos:', error));
  }, []);

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
    
    ctx.fillStyle = '#333333';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !name.trim() || !dream.trim()) return;
    setIsSubmitting(true);

    try {
      const imageUrl = await generateImageWithText(name, dream);
      
      const response = await fetch('/api/addDream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dream, imageUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao publicar');
      }

      const newDream = await response.json();
      setDreamsList(prev => [newDream, ...prev]); // Atualização otimizada
      setName('');
      setDream('');

    } catch (error) {
      console.error('Erro:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
      {/* ... (cabeçalho e formulário permanecem iguais ao código anterior) ... */}
      
      {/* Mural de imagens */}
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
          {dreamsList.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                position: 'relative',
                cursor: 'pointer',
                aspectRatio: '1/1',
                overflow: 'hidden'
              }}
              onClick={() => openLightbox(item)}
            >
              <img
                src={item.image_url}
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

      {/* Modal simplificado */}
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
            justifyContent: 'center',
            cursor: 'zoom-out'
          }} 
          onClick={closeLightbox}
        >
          <img
            src={selectedImage.image_url}
            alt={`Sonho de ${selectedImage.name}`}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '12px',
              pointerEvents: 'auto'
            }}
          />
        </div>
      )}
    </div>
  );
}
