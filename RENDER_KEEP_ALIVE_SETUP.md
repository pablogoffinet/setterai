# 🔄 Keep-Alive Setup pour Render API

## 🎯 PROBLÈME RÉSOLU

Votre instance Render gratuite se met en veille après **inactivité**, causant des **délais de 50+ secondes** lors du réveil.

## ✅ SOLUTION : Webhook n8n Keep-Alive

J'ai créé un workflow n8n qui **ping votre API toutes les 10 minutes** pour la maintenir active !

---

## 📋 ÉTAPES D'INSTALLATION

### 1. 🔗 Importer le Workflow n8n

1. **Ouvrez n8n** (cloud ou self-hosted)
2. **Cliquez sur "Import"** 
3. **Uploadez le fichier** : `n8n-keep-alive-webhook.json`
4. **Activez le workflow**

### 2. 🎛️ Configuration du Workflow

Le workflow inclut :

#### ⏰ **Schedule Trigger**
- **Fréquence** : Toutes les 10 minutes
- **24/7** : Fonctionne en continu
- **Timezone** : UTC (ajustable)

#### 🏥 **Health Check**
- **URL** : `https://setterai-729q.onrender.com/health`
- **Timeout** : 30 secondes
- **Méthode** : GET

#### 🧪 **Test Endpoint**
- **URL** : `https://setterai-729q.onrender.com/test`
- **Vérification** : API complètement fonctionnelle

#### 🚨 **Alertes** (Optionnel)
- **Slack notification** si API down
- **Logs de succès** pour monitoring

---

## 🔧 PERSONNALISATION

### Modifier la Fréquence
```json
{
  "interval": [
    {
      "field": "minutes",
      "minutesInterval": 5  // Changez à 5 min si nécessaire
    }
  ]
}
```

### Ajouter Slack Notifications
1. **Créez un Slack webhook** : https://api.slack.com/messaging/webhooks
2. **Remplacez** `YOUR/SLACK/WEBHOOK` dans le node "Alert if API Down"

### URLs Supplémentaires à Pinger
Ajoutez ces endpoints pour un keep-alive complet :
```
https://setterai-729q.onrender.com/health
https://setterai-729q.onrender.com/test
https://setterai-729q.onrender.com/api/auth
```

---

## 📊 RÉSULTATS ATTENDUS

### ✅ **Avant Keep-Alive**
- ❌ API se met en veille après 15 min
- ❌ Premier appel = 50+ secondes de délai
- ❌ Mauvaise expérience utilisateur

### ✅ **Après Keep-Alive**
- ✅ API toujours active
- ✅ Réponse instantanée < 1 seconde
- ✅ Service professionnel 24/7

---

## 🎯 MONITORING

### Logs n8n
- ✅ **Succès** : "API Keep-Alive Success!"
- 🚨 **Échec** : "API is DOWN!" + notification

### Métriques Render
- **Uptime** : 100% au lieu de intermittent
- **Response Time** : Constant < 1s
- **Cold Starts** : Éliminés

---

## 💡 ALTERNATIVES

### Option 1: Cron Job Simple
```bash
# Toutes les 10 minutes
*/10 * * * * curl -s https://setterai-729q.onrender.com/health > /dev/null
```

### Option 2: UptimeRobot (Gratuit)
- **URL** : https://uptimerobot.com
- **Monitor** : `https://setterai-729q.onrender.com/health`
- **Intervalle** : 5 minutes

### Option 3: GitHub Actions
```yaml
name: Keep-Alive
on:
  schedule:
    - cron: '*/10 * * * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://setterai-729q.onrender.com/health
```

---

## 🚀 RÉSULTAT FINAL

**Votre LinkedIn Prospector API sera maintenant :**
- ✅ **Toujours active** (pas de mise en veille)
- ✅ **Réponse instantanée** (pas de cold start)
- ✅ **Service professionnel** 24/7
- ✅ **Monitoring automatique** avec alertes

**🎉 Fini les délais de 50 secondes !** Votre API sera aussi réactive qu'un service payant !

---

*Keep-Alive configuré par n8n - Surveillance automatique 24/7* 