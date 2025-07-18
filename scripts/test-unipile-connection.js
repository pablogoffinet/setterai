#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion à l'API Unipile
 * Usage: node scripts/test-unipile-connection.js
 */

// Configuration Unipile
const UNIPILE_CONFIG = {
  apiKey: 'F3ycCpCT.sF+Tp4gkJ6r0qkbXmS8dVTuO6f0my99AWv9UcyNBmMc=',
  apiUrl: 'https://api8.unipile.com:13813/api/v1',
  webhookSecret: '97GMEpPEQzgMEe15gkX0grhxTyZErfk10jEz1-7_b88'
};

// Test de connexion avec curl (compatible sans Node.js)
async function testUnipileConnection() {
  console.log('🔍 Test de connexion Unipile...\n');
  
  console.log('📋 Configuration:');
  console.log(`   API URL: ${UNIPILE_CONFIG.apiUrl}`);
  console.log(`   API Key: ${UNIPILE_CONFIG.apiKey.substring(0, 10)}...`);
  console.log(`   Webhook Secret: ${UNIPILE_CONFIG.webhookSecret.substring(0, 10)}...\n`);
  
  // Test 1: Health Check
  console.log('🏥 Test 1: Health Check');
  const healthCmd = `curl -s -w "HTTP_CODE:%{http_code}" -H "Authorization: Bearer ${UNIPILE_CONFIG.apiKey}" "${UNIPILE_CONFIG.apiUrl}/health" || echo "FAILED"`;
  console.log(`Commande: curl -H "Authorization: Bearer ***" "${UNIPILE_CONFIG.apiUrl}/health"`);
  console.log('Exécutez cette commande pour tester la connexion:\n');
  console.log(healthCmd);
  console.log('\n---\n');
  
  // Test 2: List Accounts
  console.log('📱 Test 2: Liste des comptes');
  const accountsCmd = `curl -s -w "HTTP_CODE:%{http_code}" -H "Authorization: Bearer ${UNIPILE_CONFIG.apiKey}" "${UNIPILE_CONFIG.apiUrl}/accounts" || echo "FAILED"`;
  console.log(`Commande: curl -H "Authorization: Bearer ***" "${UNIPILE_CONFIG.apiUrl}/accounts"`);
  console.log('Exécutez cette commande pour lister vos comptes:\n');
  console.log(accountsCmd);
  console.log('\n---\n');
  
  // Test 3: Webhook endpoint info
  console.log('🔗 Test 3: Configuration Webhook');
  console.log('Configurez votre webhook dans le dashboard Unipile avec:');
  console.log(`   URL: https://votre-domaine.com/api/webhooks/unipile`);
  console.log(`   Secret: ${UNIPILE_CONFIG.webhookSecret}`);
  console.log('\n---\n');
  
  // Instructions de connexion LinkedIn
  console.log('🔵 Instructions de connexion LinkedIn:');
  console.log('\n1. Connexion par username/password:');
  const linkedinConnectCmd = `curl -X POST "${UNIPILE_CONFIG.apiUrl}/accounts" \\
  -H "Authorization: Bearer ${UNIPILE_CONFIG.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_id": "linkedin_$(date +%s)",
    "type": "LINKEDIN",
    "credentials": {
      "username": "votre-email@example.com",
      "password": "votre-mot-de-passe"
    }
  }'`;
  
  console.log(linkedinConnectCmd);
  console.log('\n2. Connexion par cookies (plus stable):');
  const linkedinCookiesCmd = `curl -X POST "${UNIPILE_CONFIG.apiUrl}/accounts" \\
  -H "Authorization: Bearer ${UNIPILE_CONFIG.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_id": "linkedin_cookies_$(date +%s)",
    "type": "LINKEDIN",
    "credentials": {
      "cookies": "vos-cookies-linkedin-exportés"
    }
  }'`;
  
  console.log(linkedinCookiesCmd);
  console.log('\n---\n');
  
  // Instructions next steps
  console.log('✅ Prochaines étapes:');
  console.log('1. Testez la connexion API avec les commandes ci-dessus');
  console.log('2. Connectez votre premier compte LinkedIn');
  console.log('3. Configurez le webhook dans le dashboard Unipile');
  console.log('4. Testez la réception de messages');
  console.log('\n🚀 Votre intégration Unipile est prête !');
  
  // Instructions pour démarrer l'application
  console.log('\n📋 Pour démarrer votre application:');
  console.log('1. Copiez default.env vers .env:');
  console.log('   cp default.env .env');
  console.log('\n2. Installez Node.js 18+ si ce n\'est pas fait');
  console.log('\n3. Installez les dépendances (une fois Node.js installé):');
  console.log('   npm install');
  console.log('\n4. Démarrez l\'application:');
  console.log('   npm run dev');
  console.log('\n5. Accédez à la documentation API:');
  console.log('   http://localhost:3000/api/docs');
}

// Fonction pour tester si c'est un environnement Node.js
function isNodeEnvironment() {
  return typeof process !== 'undefined' && process.versions && process.versions.node;
}

// Exécution du test
if (isNodeEnvironment()) {
  testUnipileConnection().catch(console.error);
} else {
  console.log('Ce script peut être exécuté avec Node.js ou en copiant les commandes curl manuellement.');
  testUnipileConnection();
} 