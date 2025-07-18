#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');

const BACKEND_URL = 'http://localhost:3000';
const AI_ENGINE_URL = 'http://localhost:3001';

console.log(chalk.blue.bold('\n🤖 Test d\'intégration AI Engine - LinkedInProspector\n'));

async function runTests() {
  let allPassed = true;

  // Test 1: Vérifier que le backend est accessible
  console.log(chalk.yellow('1. Test de connectivité backend...'));
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    if (response.status === 200) {
      console.log(chalk.green('✅ Backend accessible'));
    } else {
      console.log(chalk.red('❌ Backend non accessible'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ Backend non accessible:', error.message));
    allPassed = false;
  }

  // Test 2: Vérifier que l'AI Engine est accessible
  console.log(chalk.yellow('\n2. Test de connectivité AI Engine...'));
  try {
    const response = await axios.get(`${AI_ENGINE_URL}/health`);
    if (response.status === 200) {
      console.log(chalk.green('✅ AI Engine accessible'));
    } else {
      console.log(chalk.red('❌ AI Engine non accessible'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ AI Engine non accessible:', error.message));
    allPassed = false;
  }

  // Test 3: Tester la génération de réponse IA
  console.log(chalk.yellow('\n3. Test de génération de réponse IA...'));
  try {
    const testMessage = {
      message: "Bonjour, pouvez-vous me parler de vos services ?",
      agentConfig: {
        type: "SALES",
        model: "gpt-4o",
        temperature: 0.7,
        maxTokens: 200
      },
      context: {
        channelType: "LINKEDIN",
        conversationHistory: [],
        metadata: {
          platform: "linkedin",
          objective: "prospection"
        }
      }
    };

    const response = await axios.post(`${AI_ENGINE_URL}/process`, testMessage);
    
    if (response.data.success && response.data.data.response) {
      console.log(chalk.green('✅ Génération de réponse IA fonctionnelle'));
      console.log(chalk.gray('   Réponse générée:', response.data.data.response.substring(0, 100) + '...'));
      console.log(chalk.gray('   Modèle utilisé:', response.data.data.model));
      console.log(chalk.gray('   Tokens utilisés:', response.data.data.tokensUsed));
    } else {
      console.log(chalk.red('❌ Génération de réponse IA échouée'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ Génération de réponse IA échouée:', error.message));
    allPassed = false;
  }

  // Test 4: Tester l'analyse de sentiment
  console.log(chalk.yellow('\n4. Test d\'analyse de sentiment...'));
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/analyze/sentiment`, {
      text: "Je suis très content de votre service, c'est fantastique !"
    });
    
    if (response.data.success && response.data.data.sentiment) {
      console.log(chalk.green('✅ Analyse de sentiment fonctionnelle'));
      console.log(chalk.gray('   Sentiment:', response.data.data.sentiment));
      console.log(chalk.gray('   Confiance:', response.data.data.confidence));
    } else {
      console.log(chalk.red('❌ Analyse de sentiment échouée'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ Analyse de sentiment échouée:', error.message));
    allPassed = false;
  }

  // Test 5: Vérifier les comptes Unipile
  console.log(chalk.yellow('\n5. Test de connectivité Unipile...'));
  try {
    const response = await axios.get(`${BACKEND_URL}/api/channels/unipile/accounts`);
    
    if (response.data.success && response.data.data) {
      console.log(chalk.green('✅ Connexion Unipile fonctionnelle'));
      console.log(chalk.gray('   Comptes connectés:', response.data.count));
      
      // Lister les comptes actifs
      const activeAccounts = response.data.data.filter(account => 
        account.sources && account.sources[0] && account.sources[0].status === 'ACTIVE'
      );
      console.log(chalk.gray('   Comptes actifs:', activeAccounts.length));
      
      activeAccounts.forEach(account => {
        console.log(chalk.gray(`   - ${account.name} (${account.type})`));
      });
    } else {
      console.log(chalk.red('❌ Connexion Unipile échouée'));
      allPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ Connexion Unipile échouée:', error.message));
    allPassed = false;
  }

  // Résumé final
  console.log(chalk.blue('\n' + '='.repeat(60)));
  if (allPassed) {
    console.log(chalk.green.bold('🎉 Tous les tests sont passés !'));
    console.log(chalk.green('✅ Votre intégration AI est opérationnelle'));
    console.log(chalk.yellow('\n📋 Prochaines étapes:'));
    console.log(chalk.white('1. Configurez vos clés API OpenAI/Claude/Mistral'));
    console.log(chalk.white('2. Testez avec un vrai message LinkedIn'));
    console.log(chalk.white('3. Personnalisez les prompts selon vos besoins'));
  } else {
    console.log(chalk.red.bold('❌ Certains tests ont échoué'));
    console.log(chalk.yellow('📋 Actions à effectuer:'));
    console.log(chalk.white('1. Vérifiez que tous les services sont démarrés'));
    console.log(chalk.white('2. Configurez vos clés API'));
    console.log(chalk.white('3. Vérifiez les logs pour plus de détails'));
  }
  console.log(chalk.blue('='.repeat(60)));
}

// Fonction pour vérifier les variables d'environnement
function checkEnvironmentVariables() {
  console.log(chalk.yellow('\n🔍 Vérification des variables d\'environnement...'));
  
  const requiredVars = [
    'UNIPILE_API_KEY',
    'UNIPILE_API_URL',
    'OPENAI_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log(chalk.red('❌ Variables manquantes:', missingVars.join(', ')));
    console.log(chalk.yellow('💡 Copiez default.env vers .env et configurez les clés'));
    return false;
  }
  
  console.log(chalk.green('✅ Variables d\'environnement configurées'));
  return true;
}

// Exécution du script
(async () => {
  try {
    const envOk = checkEnvironmentVariables();
    if (!envOk) {
      process.exit(1);
    }
    
    await runTests();
  } catch (error) {
    console.error(chalk.red('❌ Erreur lors des tests:', error.message));
    process.exit(1);
  }
})(); 