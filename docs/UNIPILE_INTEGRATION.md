# Guide d'Intégration Unipile

Ce guide détaille l'intégration complète de Unipile dans votre plateforme SaaS de messagerie.

## 📋 Vue d'ensemble

L'intégration Unipile permet de connecter et gérer plusieurs canaux de communication via une API unifiée :

- **LinkedIn** (Classic, Recruiter, Sales Navigator)
- **Email** (Gmail, Outlook, IMAP)
- **WhatsApp Business**
- **Telegram**
- **Slack**
- **Discord**
- **SMS**

## 🔧 Configuration Initiale

### 1. Variables d'Environnement

Ajoutez les variables suivantes à votre fichier `.env` :

```env
# Unipile API Configuration
UNIPILE_API_KEY=your-unipile-api-key
UNIPILE_API_URL=https://api.unipile.com/v1
UNIPILE_WEBHOOK_SECRET=your-webhook-secret
```

### 2. Configuration Webhook

Configurez votre endpoint webhook dans le dashboard Unipile :

**URL :** `https://votre-domaine.com/api/webhooks/unipile`

**Événements supportés :**
- `MESSAGE_RECEIVED` - Nouveau message reçu
- `MESSAGE_SENT` - Message envoyé avec succès
- `MESSAGE_STATUS_UPDATED` - Statut de message mis à jour
- `CHAT_UPDATED` - Conversation mise à jour
- `ACCOUNT_DISCONNECTED` - Compte déconnecté

## 🚀 Utilisation des APIs

### Connecter un Canal LinkedIn

```bash
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Mon LinkedIn Pro",
    "type": "LINKEDIN",
    "provider": "unipile",
    "credentials": {
      "account_id": "linkedin_account_123",
      "username": "votre-email@example.com",
      "password": "votre-mot-de-passe"
    },
    "settings": {
      "sync_interval": 300000,
      "auto_reply": false
    }
  }'
```

### Connecter un Canal Email

```bash
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Email Pro",
    "type": "EMAIL",
    "provider": "unipile",
    "credentials": {
      "account_id": "email_account_456",
      "host": "smtp.gmail.com",
      "port": 587,
      "auth": {
        "user": "votre-email@gmail.com",
        "pass": "votre-app-password"
      }
    }
  }'
```

### Lister les Canaux

```bash
curl -X GET http://localhost:3000/api/channels \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Synchroniser un Canal

```bash
curl -X POST http://localhost:3000/api/channels/CHANNEL_ID/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "linkedin_product": "classic",
    "after": 1640995200000
  }'
```

## 🎯 Fonctionnalités LinkedIn Spécifiques

### Obtenir un Profil LinkedIn

```typescript
import { LinkedInUnipileService } from '../services/linkedin-unipile.service';

const linkedInService = new LinkedInUnipileService();
const profile = await linkedInService.getProfile('account_id');
```

### Mettre à Jour un Profil

```typescript
await linkedInService.updateProfile('account_id', {
  headline: "Expert en IA et Automatisation",
  summary: "Spécialisé dans le développement d'agents IA...",
  location: { id: "105015875", name: "Paris, France" }
});
```

### Envoyer un InMail

```typescript
await linkedInService.sendInMail(
  'account_id',
  'recipient_profile_id',
  'Collaboration Opportunité',
  'Bonjour, j\'aimerais discuter d\'une collaboration...'
);
```

### Rechercher des Profils

```typescript
const results = await linkedInService.searchProfiles('account_id', {
  keywords: 'développeur IA',
  location: 'Paris',
  industry: 'Technology',
  page: 1,
  limit: 20
});
```

## 📨 Gestion des Webhooks

Les webhooks Unipile sont automatiquement traités par le système :

### Message Reçu
```json
{
  "type": "MESSAGE_RECEIVED",
  "account_id": "linkedin_account_123",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "id": "message_456",
    "chat_id": "chat_789",
    "content": "Bonjour, merci pour votre message",
    "sender": {
      "id": "profile_123",
      "name": "John Doe"
    },
    "direction": "INBOUND",
    "type": "TEXT"
  }
}
```

### Traitement Automatique
1. **Vérification** de la signature webhook
2. **Création/Mise à jour** de la conversation
3. **Stockage** du message en base
4. **Déclenchement** de la réponse IA (si configurée)

## 🔒 Sécurité

### Chiffrement des Credentials
Les credentials sont automatiquement chiffrés avant stockage en base de données.

### Validation des Webhooks
Toutes les requêtes webhook sont vérifiées avec la signature HMAC SHA-256.

### Gestion des Erreurs
```typescript
// Exemple de gestion d'erreur
const result = await unipileService.connectAccount(credentials);
if (!result.success) {
  switch (result.error?.type) {
    case 'invalid_credentials':
      // Gérer les credentials invalides
      break;
    case 'account_restricted':
      // Gérer la restriction de compte
      break;
    case 'checkpoint_error':
      // Gérer les défis de sécurité
      break;
  }
}
```

## 📊 Monitoring et Logs

### Métriques Disponibles
- Nombre de canaux connectés
- Messages traités par minute
- Taux de succès des synchronisations
- Erreurs par type

### Logs Structurés
```json
{
  "level": "info",
  "message": "Channel connected successfully",
  "channelId": "ch_123",
  "userId": "user_456",
  "channelType": "LINKEDIN",
  "provider": "unipile",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🔄 Synchronisation des Données

### Synchronisation Initiale
Lors de la connexion d'un canal, les données des 30 derniers jours sont automatiquement synchronisées.

### Synchronisation Continue
Les webhooks maintiennent la synchronisation en temps réel.

### Synchronisation Manuelle
```bash
# Synchroniser les dernières 24h
curl -X POST http://localhost:3000/api/channels/CHANNEL_ID/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "after": '$(date -d "1 day ago" +%s)'000'
  }'
```

## 🛠️ Dépannage

### Erreurs Communes

#### 1. Compte LinkedIn Déconnecté
```json
{
  "type": "errors/disconnected_account",
  "title": "Account Disconnected",
  "detail": "The account appears to be disconnected from the provider service"
}
```
**Solution :** Reconnecter le compte avec des credentials valides.

#### 2. Limite de Taux Atteinte
```json
{
  "type": "errors/rate_limit_exceeded",
  "title": "Rate Limit Exceeded",
  "detail": "Too many requests"
}
```
**Solution :** Attendre avant de refaire la requête.

#### 3. Checkpoint LinkedIn
```json
{
  "type": "errors/checkpoint_error",
  "title": "Security Challenge",
  "detail": "LinkedIn security verification required"
}
```
**Solution :** Se connecter manuellement sur LinkedIn pour résoudre le défi.

### Diagnostic

#### Vérifier la Santé d'Unipile
```bash
curl -X GET http://localhost:3000/api/channels/health
```

#### Logs de Débogage
```bash
# Activer les logs debug
LOG_LEVEL=debug npm run dev
```

## 📝 Exemples d'Intégration

### Bot de Réponse Automatique LinkedIn
```typescript
import { LinkedInUnipileService } from '../services/linkedin-unipile.service';
import { AIOrchestrator } from '../ai-engine/aiOrchestrator';

class LinkedInBot {
  private linkedInService = new LinkedInUnipileService();
  private aiOrchestrator = new AIOrchestrator();

  async handleMessage(accountId: string, message: any) {
    // Analyser le message avec l'IA
    const analysis = await this.aiOrchestrator.processMessage({
      message: message.content,
      agentConfig: { type: 'SALES', model: 'gpt-4' },
      context: { channel: 'linkedin' }
    });

    // Générer et envoyer une réponse
    if (analysis.response) {
      await this.linkedInService.sendMessage(
        message.chat_id,
        analysis.response
      );
    }
  }
}
```

### Pipeline de Prospection
```typescript
class ProspectionPipeline {
  async runDailyProspection(accountId: string) {
    const linkedInService = new LinkedInUnipileService();
    
    // 1. Rechercher des prospects
    const prospects = await linkedInService.searchProfiles(accountId, {
      keywords: 'CTO startup',
      location: 'Paris',
      limit: 50
    });

    // 2. Analyser chaque profil
    for (const prospect of prospects.data) {
      const score = await this.scoreProspect(prospect);
      
      if (score > 0.8) {
        // 3. Envoyer un message personnalisé
        await linkedInService.sendConnectionRequest(
          accountId,
          prospect.id,
          await this.generatePersonalizedMessage(prospect)
        );
      }
    }
  }
}
```

## 🎯 Bonnes Pratiques

### 1. Gestion des Quotas
- Respecter les limites LinkedIn (100 messages/jour par défaut)
- Implémenter un système de rotation des comptes
- Surveiller le solde InMail

### 2. Personnalisation des Messages
- Utiliser l'IA pour personnaliser chaque message
- Analyser le profil du destinataire
- Adapter le ton selon le contexte

### 3. Monitoring Continu
- Surveiller les taux de réponse
- Détecter les comptes à risque
- Optimiser les temps d'envoi

### 4. Conformité
- Respecter les conditions d'utilisation LinkedIn
- Implémenter des mécanismes d'opt-out
- Documenter les consentements

## 📞 Support

Pour toute question ou problème :

1. **Documentation Unipile :** https://developer.unipile.com
2. **Logs de l'application :** Vérifiez les logs pour les erreurs détaillées
3. **Tests d'intégration :** Utilisez l'endpoint `/health` pour diagnostiquer
4. **Contact Support :** Via le dashboard Unipile pour les problèmes API

---

**Note :** Cette intégration nécessite Node.js 18+ et les dépendances installées. Assurez-vous d'avoir configuré correctement votre environnement avant de commencer. 