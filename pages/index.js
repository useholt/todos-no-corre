import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://htogqublltjvxldjydig.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [dreamsList, setDreamsList] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar sonhos:', error);
    } else {
      setDreamsList(data);
    }
  };

  const saveCardAsImage = async (index) => {
    const element = cardRefs.current[index];
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `todos-no-corre-${index + 1}.png`;
      link.click();
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
    }
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '40px',
        color: '#222'
      }}>
        Mural "Todos no Corre"
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '30px',
        padding: '0 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {dreamsList.map((item, index) => (
          <div 
            key={index}
            ref={el => cardRefs.current[index] = el}
            style={{
              background: `url('/Hello.png') center/cover no-repeat`,
              width: '100%',
              height: '1417px',
              position: 'relative',
              margin: '0 auto',
              maxWidth: '1772px',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              position: 'absolute',
              top: '63.7%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.9)',
              padding: '30px',
              borderRadius: '10px'
            }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000' }}>
                {item.name.toUpperCase()}
              </h2>
              <p style={{ fontSize: '1.5rem', color: '#333', marginTop: '20px' }}>
                "{item.dream}"
              </p>
            </div>

            <button
              onClick={() => saveCardAsImage(index)}
              style={{
                position: 'absolute',
                bottom: '50px',
                right: '50px',
                background: '#000',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                fontSize: '1.1rem'
              }}
            >
              Baixar Imagem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


