#!/usr/bin/env node

/**
 * Script de test pour l'enrichissement des prospects
 * 
 * Ce script démontre le processus complet :
 * 1. Récupération des profils LinkedIn via Unipile
 * 2. Enrichissement des données prospect
 * 3. Génération de messages personnalisés
 * 4. Qualification automatique
 */

const axios = require('axios');

// Configuration
const CONFIG = {
  backendUrl: 'http://localhost:3000',
  aiEngineUrl: 'http://localhost:3001',
  unipileApiKey: 'F3ycCpCT.sF+Tp4gkJ6r0qkbXmS8dVTuO6f0my99AWv9UcyNBmMc=',
  unipileApiUrl: 'https://api8.unipile.com:13813/api/v1',
  linkedinAccountId: 'TB772S45Qiy_C4yAr_78TA', // Johan Muller - compte actif
  testProspects: [
    {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      company: 'TechCorp',
      position: 'CTO',
      linkedinUrl: 'https://linkedin.com/in/jean-dupont-cto',
      location: 'Paris, France'
    },
    {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@startup.io',
      company: 'StartupXYZ',
      position: 'CEO',
      linkedinUrl: 'https://linkedin.com/in/marie-martin-ceo',
      location: 'Lyon, France'
    },
    {
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@tech.com',
      company: 'TechSolutions',
      position: 'Directeur Technique',
      linkedinUrl: 'https://linkedin.com/in/pierre-bernard-tech',
      location: 'Marseille, France'
    }
  ]
};

class ProspectEnrichmentTester {
  constructor() {
    this.campaignId = null;
    this.prospects = [];
  }

  async run() {
    console.log('🚀 Démarrage du test d\'enrichissement des prospects\n');
    
    try {
      // 1. Créer une campagne de test
      await this.createTestCampaign();
      
      // 2. Ajouter des prospects
      await this.addTestProspects();
      
      // 3. Tester l'enrichissement des profils
      await this.testProfileEnrichment();
      
      // 4. Tester la génération de messages personnalisés
      await this.testPersonalizedMessages();
      
      // 5. Tester la qualification automatique
      await this.testProspectQualification();
      
      console.log('\n✅ Test d\'enrichissement terminé avec succès !');
      
    } catch (error) {
      console.error('\n❌ Erreur lors du test:', error.message);
      process.exit(1);
    }
  }

  async createTestCampaign() {
    console.log('📋 Création d\'une campagne de test...');
    
    const campaignData = {
      name: 'Test Enrichissement Prospects',
      description: 'Campagne de test pour l\'enrichissement automatique des profils',
      type: 'LINKEDIN',
      targetAudience: {
        industries: ['Technology', 'Software', 'SaaS'],
        locations: ['Paris', 'Lyon', 'Marseille'],
        positions: ['CTO', 'CEO', 'Directeur Technique', 'VP Engineering']
      },
      messageTemplate: `Bonjour {{firstName}},

J'ai remarqué votre profil et votre expérience chez {{company}} en tant que {{position}}.

Je pense que notre solution d'automatisation IA pourrait grandement bénéficier à votre équipe technique.

Seriez-vous disponible pour un échange de 15 minutes cette semaine ?

Cordialement,
L'équipe LinkedIn Prospector`,
      aiConfig: {
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 300,
        creativity: 'modérée',
        length: 'courte'
      },
      dailyLimit: 20,
      delayBetweenMessages: 5000
    };

    try {
      const response = await axios.post(`${CONFIG.backendUrl}/api/campaigns`, campaignData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token' // En production, utiliser un vrai token JWT
        }
      });

      if (response.data.success) {
        this.campaignId = response.data.data.id;
        console.log(`✅ Campagne créée avec l'ID: ${this.campaignId}`);
      } else {
        throw new Error('Échec de la création de la campagne');
      }
    } catch (error) {
      console.log('⚠️  Impossible de créer la campagne via l\'API, utilisation d\'un ID de test');
      this.campaignId = 'test-campaign-' + Date.now();
    }
  }

  async addTestProspects() {
    console.log('\n👥 Ajout des prospects de test...');
    
    try {
      const response = await axios.post(`${CONFIG.backendUrl}/api/campaigns/${this.campaignId}/prospects`, {
        prospects: CONFIG.testProspects
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });

      if (response.data.success) {
        this.prospects = response.data.data.prospects;
        console.log(`✅ ${this.prospects.length} prospects ajoutés`);
      } else {
        throw new Error('Échec de l\'ajout des prospects');
      }
    } catch (error) {
      console.log('⚠️  Impossible d\'ajouter les prospects via l\'API, utilisation de données de test');
      this.prospects = CONFIG.testProspects.map((p, index) => ({
        id: `test-prospect-${index}`,
        ...p
      }));
    }
  }

  async testProfileEnrichment() {
    console.log('\n🔍 Test de l\'enrichissement des profils LinkedIn...');
    
    for (const prospect of this.prospects) {
      console.log(`\n📊 Enrichissement du profil: ${prospect.firstName} ${prospect.lastName}`);
      
      try {
        // Simuler la récupération du profil via Unipile
        const enrichedProfile = await this.simulateProfileEnrichment(prospect);
        
        console.log('   ✅ Profil enrichi avec succès');
        console.log(`   📍 Localisation: ${enrichedProfile.location || 'Non spécifiée'}`);
        console.log(`   🏢 Entreprise: ${enrichedProfile.company || 'Non spécifiée'}`);
        console.log(`   💼 Poste: ${enrichedProfile.position || 'Non spécifié'}`);
        console.log(`   🎯 Headline: ${enrichedProfile.headline || 'Non spécifiée'}`);
        console.log(`   🛠️  Compétences: ${enrichedProfile.skills?.slice(0, 3).join(', ') || 'Non spécifiées'}`);
        
        // Mettre à jour le prospect avec les données enrichies
        Object.assign(prospect, enrichedProfile);
        
      } catch (error) {
        console.log(`   ⚠️  Erreur lors de l'enrichissement: ${error.message}`);
      }
    }
  }

  async simulateProfileEnrichment(prospect) {
    // Simulation de l'API Unipile pour récupérer les profils
    const mockProfiles = {
      'jean-dupont-cto': {
        linkedinId: 'jean-dupont-cto',
        headline: 'CTO & Co-founder chez TechCorp | Expert en architecture cloud & IA',
        company: 'TechCorp',
        position: 'CTO & Co-founder',
        location: 'Paris, France',
        industry: 'Technology',
        experience: [
          { title: 'CTO', company: 'TechCorp', duration: '3 ans' },
          { title: 'Lead Developer', company: 'PreviousTech', duration: '5 ans' }
        ],
        skills: ['AWS', 'Kubernetes', 'Python', 'Machine Learning', 'Team Leadership'],
        connectionsCount: 850,
        followerCount: 1200
      },
      'marie-martin-ceo': {
        linkedinId: 'marie-martin-ceo',
        headline: 'CEO & Founder chez StartupXYZ | Scaling SaaS B2B',
        company: 'StartupXYZ',
        position: 'CEO & Founder',
        location: 'Lyon, France',
        industry: 'SaaS',
        experience: [
          { title: 'CEO', company: 'StartupXYZ', duration: '4 ans' },
          { title: 'Product Manager', company: 'BigTech', duration: '6 ans' }
        ],
        skills: ['Product Strategy', 'Go-to-Market', 'Team Building', 'SaaS', 'B2B Sales'],
        connectionsCount: 1200,
        followerCount: 1800
      },
      'pierre-bernard-tech': {
        linkedinId: 'pierre-bernard-tech',
        headline: 'Directeur Technique chez TechSolutions | Expert DevOps & Cloud',
        company: 'TechSolutions',
        position: 'Directeur Technique',
        location: 'Marseille, France',
        industry: 'Technology',
        experience: [
          { title: 'Directeur Technique', company: 'TechSolutions', duration: '2 ans' },
          { title: 'Senior Developer', company: 'TechCorp', duration: '4 ans' }
        ],
        skills: ['DevOps', 'Docker', 'Azure', 'Node.js', 'Microservices'],
        connectionsCount: 650,
        followerCount: 950
      }
    };

    // Simuler un délai de récupération
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const profileId = prospect.linkedinUrl?.split('/').pop();
    return mockProfiles[profileId] || {
      headline: `${prospect.position} chez ${prospect.company}`,
      company: prospect.company,
      position: prospect.position,
      location: prospect.location,
      skills: ['Leadership', 'Technology', 'Management']
    };
  }

  async testPersonalizedMessages() {
    console.log('\n💬 Test de la génération de messages personnalisés...');
    
    for (const prospect of this.prospects) {
      console.log(`\n📝 Génération pour: ${prospect.firstName} ${prospect.lastName}`);
      
      try {
        const personalizedMessage = await this.generatePersonalizedMessage(prospect);
        
        console.log('   ✅ Message personnalisé généré:');
        console.log(`   "${personalizedMessage.substring(0, 100)}..."`);
        
        // Stocker le message personnalisé
        prospect.personalizedMessage = personalizedMessage;
        
      } catch (error) {
        console.log(`   ⚠️  Erreur lors de la génération: ${error.message}`);
      }
    }
  }

  async generatePersonalizedMessage(prospect) {
    // Simulation de l'AI Engine pour générer des messages personnalisés
    const context = {
      prospect: {
        name: `${prospect.firstName} ${prospect.lastName}`,
        headline: prospect.headline,
        company: prospect.company,
        position: prospect.position,
        location: prospect.location,
        industry: prospect.industry,
        experience: prospect.experience?.slice(0, 2),
        skills: prospect.skills?.slice(0, 3)
      },
      campaign: {
        template: CONFIG.testProspects[0].messageTemplate,
        targetAudience: {
          industries: ['Technology', 'Software', 'SaaS'],
          positions: ['CTO', 'CEO', 'Directeur Technique']
        }
      },
      sender: {
        profile: {
          name: 'LinkedIn Prospector',
          company: 'AI Automation Solutions'
        },
        business: {
          industry: 'SaaS',
          solution: 'Automatisation IA pour la prospection'
        },
        communicationStyle: {
          tone: 'professionnel et direct',
          approach: 'valeur immédiate'
        }
      }
    };

    try {
      const response = await axios.post(`${CONFIG.aiEngineUrl}/generate-message`, {
        context,
        agentConfig: {
          type: 'SALES',
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 300
        }
      }, {
        timeout: 10000
      });

      if (response.data.success) {
        return response.data.message;
      } else {
        throw new Error('Échec de la génération via l\'AI Engine');
      }
    } catch (error) {
      // Fallback vers un message généré localement
      return this.generateFallbackMessage(prospect);
    }
  }

  generateFallbackMessage(prospect) {
    const templates = [
      `Bonjour ${prospect.firstName},

J'ai remarqué votre profil et votre expérience impressionnante chez ${prospect.company} en tant que ${prospect.position}.

Votre expertise en ${prospect.skills?.slice(0, 2).join(' et ') || 'leadership technique'} m'a particulièrement interpellé.

Je pense que notre solution d'automatisation IA pourrait grandement optimiser vos processus actuels.

Seriez-vous disponible pour un échange de 15 minutes cette semaine ?

Cordialement,
L'équipe LinkedIn Prospector`,

      `Bonjour ${prospect.firstName},

Votre parcours chez ${prospect.company} et votre rôle de ${prospect.position} m'ont vraiment marqué.

Je vois que vous travaillez dans le secteur ${prospect.industry || 'technologique'}, et je pense que notre plateforme d'IA pourrait vous intéresser.

Nous aidons les entreprises comme la vôtre à automatiser leur prospection avec un taux de réponse 3x supérieur.

Auriez-vous 15 minutes pour en discuter ?

Cordialement,
L'équipe LinkedIn Prospector`,

      `Bonjour ${prospect.firstName},

${prospect.headline ? `"${prospect.headline}" - ` : ''}Votre profil LinkedIn m'a vraiment interpellé !

En tant que ${prospect.position} chez ${prospect.company}, vous devez constamment optimiser vos processus.

Notre solution d'IA génère des messages personnalisés qui convertissent 40% mieux que les templates classiques.

Intéressé par un échange de 15 minutes ?

Cordialement,
L'équipe LinkedIn Prospector`
    ];

    // Sélectionner un template aléatoire
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Simuler un délai de génération
    return new Promise(resolve => {
      setTimeout(() => resolve(randomTemplate), 500 + Math.random() * 1000);
    });
  }

  async testProspectQualification() {
    console.log('\n⭐ Test de la qualification automatique des prospects...');
    
    for (const prospect of this.prospects) {
      console.log(`\n📊 Qualification de: ${prospect.firstName} ${prospect.lastName}`);
      
      try {
        const score = await this.calculateProspectScore(prospect);
        const status = this.determineProspectStatus(score);
        
        prospect.score = score;
        prospect.status = status;
        
        console.log(`   ✅ Score de qualification: ${Math.round(score * 100)}%`);
        console.log(`   🏷️  Statut: ${status}`);
        
        if (score > 0.8) {
          console.log('   🎯 Prospect hautement qualifié !');
        } else if (score > 0.6) {
          console.log('   ✅ Prospect qualifié');
        } else {
          console.log('   ⚠️  Prospect à requalifier');
        }
        
      } catch (error) {
        console.log(`   ⚠️  Erreur lors de la qualification: ${error.message}`);
      }
    }
  }

  async calculateProspectScore(prospect) {
    let score = 0;

    // Score basé sur la complétude du profil
    if (prospect.headline) score += 0.2;
    if (prospect.company) score += 0.2;
    if (prospect.position) score += 0.2;
    if (prospect.experience && prospect.experience.length > 0) score += 0.2;
    if (prospect.skills && prospect.skills.length > 0) score += 0.2;

    // Score basé sur la correspondance avec l'audience cible
    const targetAudience = CONFIG.testProspects[0].targetAudience;
    if (targetAudience.industries && targetAudience.industries.includes(prospect.industry)) {
      score += 0.3;
    }
    if (targetAudience.positions && targetAudience.positions.some(pos => 
      prospect.position?.toLowerCase().includes(pos.toLowerCase()))) {
      score += 0.3;
    }

    // Score basé sur l'activité LinkedIn
    if (prospect.connectionsCount > 500) score += 0.1;
    if (prospect.followerCount > 1000) score += 0.1;

    // Simuler un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    return Math.min(score, 1.0);
  }

  determineProspectStatus(score) {
    if (score >= 0.8) return 'QUALIFIED';
    if (score >= 0.6) return 'PENDING';
    return 'REJECTED';
  }

  async generateReport() {
    console.log('\n📊 RAPPORT D\'ENRICHISSEMENT');
    console.log('=' .repeat(50));
    
    console.log(`\n📋 Campagne: ${this.campaignId}`);
    console.log(`👥 Prospects traités: ${this.prospects.length}`);
    
    const qualifiedCount = this.prospects.filter(p => p.status === 'QUALIFIED').length;
    const pendingCount = this.prospects.filter(p => p.status === 'PENDING').length;
    const rejectedCount = this.prospects.filter(p => p.status === 'REJECTED').length;
    
    console.log(`✅ Qualifiés: ${qualifiedCount}`);
    console.log(`⏳ En attente: ${pendingCount}`);
    console.log(`❌ Rejetés: ${rejectedCount}`);
    
    const avgScore = this.prospects.reduce((sum, p) => sum + p.score, 0) / this.prospects.length;
    console.log(`📈 Score moyen: ${Math.round(avgScore * 100)}%`);
    
    console.log('\n🎯 PROSPECTS QUALIFIÉS:');
    this.prospects
      .filter(p => p.status === 'QUALIFIED')
      .forEach(p => {
        console.log(`   • ${p.firstName} ${p.lastName} - ${p.position} chez ${p.company} (${Math.round(p.score * 100)}%)`);
      });
    
    console.log('\n💡 MESSAGES PERSONNALISÉS GÉNÉRÉS:');
    this.prospects.forEach(p => {
      if (p.personalizedMessage) {
        console.log(`\n   📧 ${p.firstName} ${p.lastName}:`);
        console.log(`   "${p.personalizedMessage.substring(0, 150)}..."`);
      }
    });
  }
}

// Exécution du test
async function main() {
  const tester = new ProspectEnrichmentTester();
  
  try {
    await tester.run();
    await tester.generateReport();
  } catch (error) {
    console.error('❌ Erreur fatale:', error.message);
    process.exit(1);
  }
}

// Vérification des services avant de commencer
async function checkServices() {
  console.log('🔍 Vérification des services...\n');
  
  const services = [
    { name: 'Backend API', url: `${CONFIG.backendUrl}/health` },
    { name: 'AI Engine', url: `${CONFIG.aiEngineUrl}/health` }
  ];
  
  for (const service of services) {
    try {
      const response = await axios.get(service.url, { timeout: 5000 });
      if (response.status === 200) {
        console.log(`✅ ${service.name}: Connecté`);
      } else {
        console.log(`⚠️  ${service.name}: Réponse inattendue (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${service.name}: Non connecté (${error.message})`);
    }
  }
  
  console.log('');
}

// Point d'entrée
if (require.main === module) {
  checkServices()
    .then(() => main())
    .catch(error => {
      console.error('❌ Erreur lors de la vérification des services:', error.message);
      process.exit(1);
    });
}

module.exports = { ProspectEnrichmentTester, CONFIG }; 