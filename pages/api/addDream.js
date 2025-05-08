import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { name, dream } = req.body;

    // Insere no banco de dados
    const { data, error } = await supabase
      .from('dreams')
      .insert([{ 
        name, 
        dream 
      }])
      .select('*'); // Adiciona isso para retornar os dados inseridos

    if (error) {
      console.error('Erro no Supabase:', error);
      throw error;
    }

    // Retorna apenas o primeiro item do array (dados do novo registro)
    res.status(201).json(data[0]); 

  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ 
      error: error.message,
      details: error 
    });
  }
}
