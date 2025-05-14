import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  console.log('Dados recebidos:', req.body);

  try {
    const { name, dream, imageUrl } = req.body;

    // Validação básica
    if (!name || !dream || !imageUrl) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Inserção no Supabase
    const { data, error } = await supabase
      .from('dreams')
      .insert([{ 
        name, 
        dream, 
        image_url: imageUrl 
      }])
      .select('*');

    if (error) {
      console.error('Erro do Supabase:', error);
      return res.status(500).json({ 
        error: 'Erro no banco de dados',
        details: error 
      });
    }

    console.log('Dados salvos com sucesso:', data);
    res.status(201).json(data[0]);

  } catch (error) {
    console.error('Erro geral:', error);
    res.status(500).json({ 
      error: 'Erro interno',
      details: error.message 
    });
  }
}
