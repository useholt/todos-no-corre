import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // Verifique se o nome da variável está correto no seu .env
);

export default async function handler(req, res) {
  try {
    // Busca todos os registros com image_url
    const { data, error } = await supabase
      .from('dreams')
      .select(`
        id,
        name,
        dream,
        image_url,  // Campo novo incluído
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro no Supabase:', error);
      return res.status(400).json({ 
        error: 'Erro ao buscar sonhos',
        details: error 
      });
    }

    // Retorna dados formatados (opcional)
    const formattedData = data.map(item => ({
      ...item,
      imageUrl: item.image_url // Padroniza para camelCase no frontend
    }));

    res.status(200).json(formattedData);

  } catch (error) {
    console.error('Erro geral na API:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: error.message 
    });
  }
}
