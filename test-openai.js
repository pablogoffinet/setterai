const axios = require('axios');

const OPENAI_API_KEY = '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';

async function testOpenAI() {
  console.log('🧪 Test direct OpenAI...');
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant commercial expert en prospection LinkedIn.'
        },
        {
          role: 'user',
          content: 'Bonjour, peux-tu me dire quelque chose sur tes services ?'
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ OpenAI fonctionne !');
    console.log('Réponse:', response.data.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ Erreur OpenAI:', error.response?.data || error.message);
  }
}

testOpenAI(); 