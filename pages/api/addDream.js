import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // Confira se é SUPABASE_ANON_KEY ou SUPABASE_KEY no seu .env
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Extrai imageUrl do corpo da requisição
    const { name, dream, imageUrl } = req.body;

    if (!name || !dream || !imageUrl) {
      return res.status(400).json({ 
        error: 'Dados incompletos. Name, dream e imageUrl são obrigatórios.' 
      });
    }

    // Insere com image_url
    const { data, error } = await supabase
      .from('dreams')
      .insert([{ 
        name, 
        dream,
        image_url: imageUrl // Campo novo
      }])
      .select('*');

    if (error) {
      console.error('Erro no Supabase:', error);
      return res.status(400).json({ 
        error: 'Erro ao salvar sonho',
        details: error 
      });
    }

    // Retorna dados completos com image_url
    res.status(201).json(data[0]);

  } catch (error) {
    console.error('Erro geral na API:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: error.message 
    });
  }
}
