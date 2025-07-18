'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Linkedin,
  Mail,
  MessageCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Messages envoyés', value: '1,234', change: '+12%', icon: MessageSquare },
    { title: 'Prospects contactés', value: '567', change: '+8%', icon: Users },
    { title: 'Taux de réponse', value: '23%', change: '+5%', icon: BarChart3 },
    { title: 'Conversions', value: '89', change: '+15%', icon: TrendingUp },
  ];

  const recentActivities = [
    { type: 'message', content: 'Message envoyé à John Doe', time: '2 min ago', status: 'sent' },
    { type: 'connection', content: 'Demande de connexion acceptée', time: '5 min ago', status: 'success' },
    { type: 'prospect', content: 'Nouveau prospect ajouté', time: '10 min ago', status: 'info' },
    { type: 'campaign', content: 'Campagne "Tech Startups" lancée', time: '1h ago', status: 'success' },
  ];

  const channels = [
    { name: 'LinkedIn Pro', type: 'linkedin', status: 'connected', messages: 234 },
    { name: 'Email Marketing', type: 'email', status: 'connected', messages: 156 },
    { name: 'WhatsApp Business', type: 'whatsapp', status: 'disconnected', messages: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/campaigns" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Nouvelle campagne
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Vue d\'ensemble', icon: Activity },
                { id: 'campaigns', name: 'Campagnes', icon: MessageSquare },
                { id: 'prospects', name: 'Prospects', icon: Users },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activités récentes</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'sent' ? 'bg-blue-500' :
                          activity.status === 'success' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connected Channels */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Canaux connectés</h3>
                  <div className="space-y-4">
                    {channels.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            channel.type === 'linkedin' ? 'bg-blue-100' :
                            channel.type === 'email' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {channel.type === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
                            {channel.type === 'email' && <Mail className="w-5 h-5 text-green-600" />}
                            {channel.type === 'whatsapp' && <MessageCircle className="w-5 h-5 text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{channel.name}</p>
                            <p className="text-sm text-gray-500">{channel.messages} messages</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          channel.status === 'connected' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {channel.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune campagne</h3>
                <p className="mt-1 text-sm text-gray-500">Commencez par créer votre première campagne de prospection.</p>
                <div className="mt-6">
                  <a href="/campaigns" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Créer une campagne
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'prospects' && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun prospect</h3>
                <p className="mt-1 text-sm text-gray-500">Ajoutez vos premiers prospects pour commencer la prospection.</p>
                <div className="mt-6">
                  <a href="/prospects" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Ajouter un prospect
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics en cours</h3>
                <p className="mt-1 text-sm text-gray-500">Les données d'analyse apparaîtront ici une fois que vous aurez commencé à utiliser la plateforme.</p>
                <div className="mt-6">
                  <a href="/analytics" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Voir les analytics
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
