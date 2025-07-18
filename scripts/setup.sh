#!/bin/bash

# SaaS Messaging Platform Setup Script
# Ce script aide à configurer l'environnement de développement

set -e

echo "🚀 Configuration de la plateforme SaaS Messaging..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_step "Vérification de Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js installé: $NODE_VERSION"
        
        # Check if version is >= 18
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            print_success "Version Node.js compatible (>=18)"
            return 0
        else
            print_warning "Version Node.js trop ancienne. Minimum requis: v18"
            return 1
        fi
    else
        print_error "Node.js non installé"
        return 1
    fi
}

# Install Node.js using different methods
install_node() {
    print_step "Installation de Node.js..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            print_step "Installation via Homebrew..."
            brew install node@18
        else
            print_warning "Homebrew non installé. Téléchargez Node.js depuis https://nodejs.org/"
            print_warning "Ou installez Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt &> /dev/null; then
            # Ubuntu/Debian
            print_step "Installation via apt..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            print_step "Installation via yum..."
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
        else
            print_warning "Gestionnaire de paquets non supporté. Téléchargez Node.js depuis https://nodejs.org/"
            exit 1
        fi
    else
        print_warning "OS non supporté automatiquement. Téléchargez Node.js depuis https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is available
check_npm() {
    print_step "Vérification de npm..."
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm installé: v$NPM_VERSION"
        return 0
    else
        print_error "npm non disponible"
        return 1
    fi
}

# Setup environment file
setup_env() {
    print_step "Configuration des variables d'environnement..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Fichier .env créé depuis .env.example"
            print_warning "⚠️  Éditez le fichier .env avec vos clés API avant de continuer"
            print_warning "   - OPENAI_API_KEY"
            print_warning "   - UNIPILE_API_KEY"
            print_warning "   - JWT_SECRET (générez une clé aléatoire de 32+ caractères)"
        else
            print_error "Fichier .env.example non trouvé"
            return 1
        fi
    else
        print_success "Fichier .env déjà existant"
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installation des dépendances..."
    
    # Root dependencies
    npm install
    
    # Backend dependencies
    print_step "Installation des dépendances backend..."
    cd backend && npm install && cd ..
    
    # AI Engine dependencies
    print_step "Installation des dépendances AI engine..."
    cd ai-engine && npm install && cd ..
    
    # Queue Service dependencies
    print_step "Installation des dépendances queue service..."
    cd queue-service && npm install && cd ..
    
    # Frontend dependencies
    print_step "Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
    
    print_success "Toutes les dépendances installées!"
}

# Setup database
setup_database() {
    print_step "Configuration de la base de données..."
    
    print_warning "Assurez-vous que PostgreSQL est installé et en cours d'exécution"
    print_warning "Ou utilisez Docker: docker-compose up -d postgres redis"
    
    # Generate Prisma client
    cd backend
    if [ -f "package.json" ]; then
        print_step "Génération du client Prisma..."
        npx prisma generate
        print_success "Client Prisma généré"
    fi
    cd ..
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║     SaaS Messaging Platform Setup   ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Check and install Node.js if needed
    if ! check_node; then
        read -p "Installer Node.js automatiquement? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_node
            if ! check_node; then
                print_error "Échec de l'installation de Node.js"
                exit 1
            fi
        else
            print_error "Node.js est requis. Installez-le depuis https://nodejs.org/"
            exit 1
        fi
    fi
    
    # Check npm
    if ! check_npm; then
        print_error "npm est requis mais non disponible"
        exit 1
    fi
    
    # Setup environment
    setup_env
    
    # Install dependencies
    install_dependencies
    
    # Setup database
    setup_database
    
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                    🎉 Setup terminé!                     ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo "║  Prochaines étapes:                                       ║"
    echo "║  1. Éditez le fichier .env avec vos clés API             ║"
    echo "║  2. Démarrez les services: npm run docker:up             ║"
    echo "║  3. Lancez l'application: npm run dev                    ║"
    echo "║                                                           ║"
    echo "║  URLs de développement:                                   ║"
    echo "║  • Backend:  http://localhost:3000                       ║"
    echo "║  • Frontend: http://localhost:3003                       ║"
    echo "║  • API Docs: http://localhost:3000/api/docs              ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check if script is run from correct directory
if [ ! -f "package.json" ]; then
    print_error "Ce script doit être exécuté depuis le répertoire racine du projet"
    exit 1
fi

# Run main function
main "$@" 