import { useState, useEffect } from 'react';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');
  const [dreamsList, setDreamsList] = useState([]);

  // Busca os sonhos do Supabase ao carregar a página
  useEffect(() => {
    const fetchDreams = async () => {
      const response = await fetch('/api/getDreams');
      const data = await response.json();
      setDreamsList(data);
    };
    fetchDreams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addDream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dream }),
      });
      if (response.ok) {
        alert('Sonho salvo!');
        // Atualiza a lista após salvar
        const updatedResponse = await fetch('/api/getDreams');
        const updatedData = await updatedResponse.json();
        setDreamsList(updatedData);
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Imagem do mural */}
      <img 
        src="/Hello.png" 
        alt="Mural de sonhos" 
        style={{ width: '300px', marginBottom: '20px' }} 
      />
      
      {/* Formulário */}
      <h1>MEU MURAL DE SONHOS</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          style={{ display: 'block', margin: '10px auto', padding: '8px', width: '300px' }}
        />
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Seu sonho"
          required
          style={{ display: 'block', margin: '10px auto', padding: '8px', width: '300px', minHeight: '100px' }}
        />
        <button 
          type="submit"
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Publicar no Mural
        </button>
      </form>

      {/* Lista de sonhos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {dreamsList.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}
          >
            <h3>HELLO, MY NAME IS</h3>
            <h2 style={{ margin: '10px 0', color: '#0070f3' }}>{item.name.toUpperCase()}</h2>
            <p style={{ color: '#666' }}>{item.dream}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
