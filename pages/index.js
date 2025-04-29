import { useState } from 'react';

export default function Mural() {
  const [name, setName] = useState('');
  const [dream, setDream] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addDream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dream }),
      });
      if (response.ok) alert('Sonho salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {/* Imagem do mural */}
      <img 
        src="/Hello.png" 
        alt="Mural de sonhos" 
        style={{ width: '300px', marginBottom: '20px' }} 
      />
      
      {/* Título e formulário */}
      <h1>MEU MURAL DE SONHOS</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          style={{ display: 'block', margin: '10px auto', padding: '8px' }}
        />
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Seu sonho"
          required
          style={{ display: 'block', margin: '10px auto', padding: '8px', width: '300px' }}
        />
        <button 
          type="submit"
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none' }}
        >
          Publicar no Mural
        </button>
      </form>
    </div>
  );
}
