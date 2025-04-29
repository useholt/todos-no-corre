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
      color: '#000', // Cor padrão do texto definida como preto
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      filter: 'brightness(1.1)' // Ajusta o brilho da imagem de fundo
    }}>
      {/* REMOVIDO: overlay escuro */}
      
      {/* Conteúdo do card */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '10px 0',
          color: '#000', // Texto preto
          textTransform: 'uppercase'
        }}>
          {item.name.toUpperCase()} {/* Nome em caixa alta sem prefixo */}
        </h2>
        <p style={{ 
          fontSize: '1.1rem',
          color: '#000', // Texto preto
          fontStyle: 'italic',
          margin: '20px 0',
          fontWeight: '500'
        }}>
          "{item.dream}"
        </p>
        <div style={{ 
          marginTop: '20px',
          color: '#000' // Ícones pretos
        }}>
          🍀 🍀 🍀
        </div>
      </div>
    </div>
  ))}
</div>
