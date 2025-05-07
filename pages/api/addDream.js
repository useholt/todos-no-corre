// Conexão com o Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// API para adicionar sonhos
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { name, dream } = req.body;

  try {
    // 1. Upload da imagem para o Storage
    const fileExt = image.split(';')[0].split('/')[1];
    const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dreams')
      .upload(fileName, Buffer.from(image.split(',')[1], 'base64'), {
        contentType: `image/${fileExt}`
      });

    if (uploadError) throw uploadError;

    // 2. Obter URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('dreams')
      .getPublicUrl(uploadData.path);

    // 3. Inserir no banco com a URL da imagem
    const { data, error } = await supabase
      .from('dreams')
      .insert([{ 
        name, 
        dream,
        image_url: urlData.publicUrl 
      }]);

    if (error) throw error;
    
    return res.status(201).json(data[0]);

  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ 
      error: error.message,
      details: error 
    });
  }
}
