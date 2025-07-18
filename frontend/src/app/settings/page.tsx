'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Key, 
  Globe,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    company: 'TechStartup',
    phone: '+33 6 12 34 56 78',
    timezone: 'Europe/Paris',
    language: 'fr'
  });

  const [apiSettings, setApiSettings] = useState({
    openaiKey: 'sk-...',
    azureEndpoint: 'https://scaile.openai.azure.com',
    azureKey: 'En9b6ldiwOhVuO0OCLm6CJGhMCPZl1dkdfGDLtrk7dEWc5tWCaOKJQQJ99BEAC5T7U2XJ3w3AAABACOGnjdC',
    unipileKey: 'up_...',
    webhookUrl: 'https://your-domain.com/webhooks'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    slackNotifications: false,
    newProspects: true,
    responses: true,
    conversions: true,
    weeklyReports: true
  });

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiSettings.azureKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = () => {
    // Ici on sauvegarderait les données
    alert('Profil mis à jour avec succès !');
  };

  const handleSaveApi = () => {
    // Ici on sauvegarderait les paramètres API
    alert('Paramètres API mis à jour avec succès !');
  };

  const handleSaveNotifications = () => {
    // Ici on sauvegarderait les notifications
    alert('Paramètres de notifications mis à jour avec succès !');
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'api', name: 'API & Intégrations', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Informations du profil</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={profileData.timezone}
                        onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Tab */}
            {activeTab === 'api' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Configuration API</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Azure OpenAI */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Azure OpenAI</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={apiSettings.azureEndpoint}
                          onChange={(e) => setApiSettings({...apiSettings, azureEndpoint: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Clé API</label>
                        <div className="relative">
                          <input
                            type={showApiKey ? "text" : "password"}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-20 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={apiSettings.azureKey}
                            onChange={(e) => setApiSettings({...apiSettings, azureKey: e.target.value})}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={handleCopyApiKey}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unipile */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Unipile</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Clé API Unipile</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={apiSettings.unipileKey}
                        onChange={(e) => setApiSettings({...apiSettings, unipileKey: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Webhook */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Webhook</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL Webhook</label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={apiSettings.webhookUrl}
                        onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveApi}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Paramètres de notifications</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Canal de notification</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={notifications.emailNotifications}
                          onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                          Notifications par email
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="slackNotifications"
                          checked={notifications.slackNotifications}
                          onChange={(e) => setNotifications({...notifications, slackNotifications: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="slackNotifications" className="ml-2 block text-sm text-gray-900">
                          Notifications Slack
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Types de notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newProspects"
                          checked={notifications.newProspects}
                          onChange={(e) => setNotifications({...notifications, newProspects: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="newProspects" className="ml-2 block text-sm text-gray-900">
                          Nouveaux prospects
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="responses"
                          checked={notifications.responses}
                          onChange={(e) => setNotifications({...notifications, responses: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="responses" className="ml-2 block text-sm text-gray-900">
                          Réponses des prospects
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="conversions"
                          checked={notifications.conversions}
                          onChange={(e) => setNotifications({...notifications, conversions: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="conversions" className="ml-2 block text-sm text-gray-900">
                          Conversions
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="weeklyReports"
                          checked={notifications.weeklyReports}
                          onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="weeklyReports" className="ml-2 block text-sm text-gray-900">
                          Rapports hebdomadaires
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotifications}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Sécurité</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                        <input
                          type="password"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <input
                          type="password"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Authentification à deux facteurs</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">2FA activé</p>
                        <p className="text-sm text-gray-500">Protection supplémentaire pour votre compte</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Configurer
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 