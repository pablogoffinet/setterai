'use client';

import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Données simulées pour les graphiques
  const conversionData = [
    { month: 'Jan', prospects: 150, responses: 23, conversions: 8 },
    { month: 'Fév', prospects: 180, responses: 31, conversions: 12 },
    { month: 'Mar', prospects: 220, responses: 45, conversions: 18 },
    { month: 'Avr', prospects: 190, responses: 38, conversions: 15 },
    { month: 'Mai', prospects: 250, responses: 52, conversions: 22 },
    { month: 'Juin', prospects: 280, responses: 61, conversions: 25 },
  ];

  const channelPerformance = [
    { channel: 'LinkedIn', prospects: 450, responses: 89, rate: 19.8 },
    { channel: 'Email', prospects: 320, responses: 45, rate: 14.1 },
    { channel: 'WhatsApp', prospects: 180, responses: 28, rate: 15.6 },
  ];

  const topCampaigns = [
    { name: 'Tech Startups 2024', prospects: 150, responses: 23, rate: 15.3 },
    { name: 'SaaS Founders Q1', prospects: 120, responses: 18, rate: 15.0 },
    { name: 'Marketing Agencies', prospects: 200, responses: 25, rate: 12.5 },
    { name: 'E-commerce Leaders', prospects: 180, responses: 22, rate: 12.2 },
  ];

  const recentActivity = [
    { type: 'conversion', message: 'Jean Dupont converti en client', time: '2h ago', value: '+2500€' },
    { type: 'response', message: 'Marie Martin a répondu', time: '4h ago', value: 'Qualifiée' },
    { type: 'prospect', message: 'Nouveau prospect ajouté', time: '6h ago', value: 'Pierre Durand' },
    { type: 'campaign', message: 'Campagne lancée', time: '1j ago', value: 'Tech Startups' },
  ];

  const getActivityIcon = (type: string) => {
    const base = 'inline-block rounded-full mr-2';
    const cls = (c: string) => `${base} ${c}`;
    switch (type) {
      case 'conversion': return <span className={cls('w-3 h-3 bg-green-600')} />;
      case 'response': return <span className={cls('w-3 h-3 bg-blue-600')} />;
      case 'prospect': return <span className={cls('w-3 h-3 bg-purple-600')} />;
      case 'campaign': return <span className={cls('w-3 h-3 bg-orange-600')} />;
      default: return <span className={cls('w-3 h-3 bg-gray-400')} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'conversion': return 'bg-green-100 text-green-800';
      case 'response': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-purple-100 text-purple-800';
      case 'campaign': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <span className="w-4 h-4 mr-2 rounded bg-white/40 inline-block" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="h-8 w-8 rounded bg-blue-100" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total prospects</p>
                <p className="text-2xl font-semibold text-gray-900">1,280</p>
                <p className="text-sm text-green-600">+12% vs mois dernier</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="h-8 w-8 rounded bg-green-100" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de réponse</p>
                <p className="text-2xl font-semibold text-gray-900">16.2%</p>
                <p className="text-sm text-green-600">+2.1% vs mois dernier</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="h-8 w-8 rounded bg-purple-100" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de conversion</p>
                <p className="text-2xl font-semibold text-gray-900">8.9%</p>
                <p className="text-sm text-green-600">+1.5% vs mois dernier</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="h-8 w-8 rounded bg-orange-100" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenus générés</p>
                <p className="text-2xl font-semibold text-gray-900">€45,200</p>
                <p className="text-sm text-green-600">+18% vs mois dernier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Entonnoir de conversion</h3>
            <div className="space-y-4">
              {conversionData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Prospects</div>
                      <div className="font-medium">{data.prospects}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Réponses</div>
                      <div className="font-medium text-blue-600">{data.responses}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Conversions</div>
                      <div className="font-medium text-green-600">{data.conversions}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance par canal</h3>
            <div className="space-y-4">
              {channelPerformance.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-medium">{channel.channel}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Prospects</div>
                      <div className="font-medium">{channel.prospects}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Taux</div>
                      <div className="font-medium text-green-600">{channel.rate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Campaigns */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Meilleures campagnes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.prospects} prospects</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{campaign.rate}%</div>
                      <div className="text-sm text-gray-500">{campaign.responses} réponses</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                      {activity.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Métriques détaillées</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2.3j</div>
                <div className="text-sm text-gray-500">Temps de réponse moyen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3.2</div>
                <div className="text-sm text-gray-500">Messages par prospect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">€1,250</div>
                <div className="text-sm text-gray-500">Valeur moyenne par conversion</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 