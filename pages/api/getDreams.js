import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    console.error('Erro na API:', error)
    res.status(500).json({ 
      error: 'Erro ao carregar sonhos',
      details: error.message 
    })
  }
}
