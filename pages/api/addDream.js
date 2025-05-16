import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { name, dream, imageUrl } = req.body

  if (!name?.trim() || !dream?.trim() || !imageUrl?.startsWith('data:image/png')) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: 'Verifique nome, sonho e imagem'
    })
  }

  try {
    const { data, error } = await supabase
      .from('dreams')
      .insert([{ 
        name: name.trim(), 
        dream: dream.trim(),
        image_url: imageUrl 
      }])
      .select('*')

    if (error) throw error

    res.status(201).json(data[0])
  } catch (error) {
    console.error('Erro na API:', error)
    res.status(500).json({ 
      error: 'Erro interno',
      details: error.message 
    })
  }
}
