#!/bin/bash

echo "🚀 Déploiement LinkedIn Prospector sur Render - Version Finale"
echo "=================================================="

# Vérifications préliminaires
echo "🔍 Vérification de la configuration..."

# Vérifier que render.yaml existe
if [ ! -f "render.yaml" ]; then
    echo "❌ Erreur: render.yaml non trouvé"
    exit 1
fi

# Vérifier que le backend existe
if [ ! -d "backend" ]; then
    echo "❌ Erreur: Dossier backend non trouvé"
    exit 1
fi

# Vérifier package.json du backend
if [ ! -f "backend/package.json" ]; then
    echo "❌ Erreur: backend/package.json non trouvé"
    exit 1
fi

echo "✅ Configuration vérifiée"

# Afficher le contenu de render.yaml
echo ""
echo "📄 Configuration Render (render.yaml):"
echo "======================================"
cat render.yaml

# Afficher les instructions finales
echo ""
echo ""
echo "🎯 INSTRUCTIONS POUR LE DÉPLOIEMENT RENDER:"
echo "=============================================="
echo ""
echo "1. 🌐 Connectez-vous sur https://render.com"
echo ""
echo "2. 📁 Cliquez sur 'New' > 'Blueprint'"
echo ""
echo "3. 🔗 Connectez votre repository GitHub contenant ce projet"
echo ""
echo "4. 🎛️ Le fichier render.yaml sera automatiquement détecté"
echo ""
echo "5. 🔑 Configurez les variables d'environnement suivantes dans Render:"
echo ""
echo "   🔴 Variables OBLIGATOIRES à définir:"
echo "   ├── DATABASE_URL (sera généré automatiquement par PostgreSQL)"
echo "   ├── OPENAI_API_KEY (votre clé OpenAI)"
echo "   ├── CLAUDE_API_KEY (votre clé Claude - optionnel)"
echo "   ├── MISTRAL_API_KEY (votre clé Mistral - optionnel)"
echo "   └── UNIPILE_API_KEY (votre clé Unipile)"
echo ""
echo "   🟢 Variables AUTO-GÉNÉRÉES par Render:"
echo "   ├── JWT_SECRET (généré automatiquement)"
echo "   └── ENCRYPTION_KEY (généré automatiquement)"
echo ""
echo "6. ✅ Cliquez sur 'Apply' pour démarrer le déploiement"
echo ""
echo "7. ⏱️ Attendez 5-10 minutes pour le déploiement complet"
echo ""
echo "🔗 URLS DE VOTRE API DÉPLOYÉE:"
echo "==============================="
echo "🌍 API principale: https://linkedin-prospector-api.onrender.com"
echo "🏥 Health check: https://linkedin-prospector-api.onrender.com/health"
echo "🧪 Test endpoint: https://linkedin-prospector-api.onrender.com/test"
echo ""
echo "✅ CONFIGURATION OPTIMISÉE RENDER:"
echo "=================================="
echo "✓ Node.js 18.19.0"
echo "✓ Build automatique avec Prisma"
echo "✓ Health check configuré"
echo "✓ Base de données PostgreSQL intégrée"
echo "✓ Gestion des erreurs robuste"
echo "✓ CORS activé"
echo "✓ Serveur minimal optimisé"
echo ""
echo "🎉 VOTRE PROJET EST PRÊT POUR LE DÉPLOIEMENT !"
echo "==============================================="
echo ""
echo "💡 Conseil: Gardez l'onglet Render ouvert pour suivre les logs de déploiement"
echo "" 