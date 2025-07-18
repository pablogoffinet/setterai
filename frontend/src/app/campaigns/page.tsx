'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Play, Pause, Users, MessageSquare, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { useRouter } from 'next/navigation';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  type: 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'MULTI_CHANNEL';
  totalProspects: number;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  _count: {
    prospects: number;
  };
}

interface CampaignStats {
  total: number;
  pending: number;
  qualified: number;
  contacted: number;
  responded: number;
  converted: number;
  averageScore: number;
  openRate: number;
  replyRate: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'LINKEDIN',
    dailyLimit: 50,
    messageTemplate: ''
  });
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      const mockData = [
        {
          id: '1',
          name: 'Prospection CTOs Paris',
          description: 'Campagne de prospection des CTOs dans la région parisienne',
          status: 'DRAFT' as const,
          type: 'LINKEDIN' as const,
          totalProspects: 0,
          sentCount: 0,
          openedCount: 0,
          repliedCount: 0,
          createdAt: new Date().toISOString(),
          _count: { prospects: 0 }
        }
      ];
      
      setCampaigns(mockData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignStats = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/stats`);
      const data = await response.json();
      
      if (data.success) {
        setCampaignStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
  };

  const handleStartCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/start`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error starting campaign:', error);
    }
  };

  const handleStopCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/stop`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error stopping campaign:', error);
    }
  };

  const handleEnrichProspects = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/enrich`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: 'TB772S45Qiy_C4yAr_78TA', // ID du compte LinkedIn actif
          limit: 20
        }),
      });
      
      if (response.ok) {
        alert('Enrichissement des prospects démarré !');
      }
    } catch (error) {
      console.error('Error enriching prospects:', error);
    }
  };

  const handleCreateCampaign = async () => {
    if (!formData.name.trim()) {
      alert('Le nom de la campagne est requis');
      return;
    }

    try {
      setCreatingCampaign(true);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock campaign
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: 'DRAFT',
        type: formData.type as 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'MULTI_CHANNEL',
        totalProspects: 0,
        sentCount: 0,
        openedCount: 0,
        repliedCount: 0,
        createdAt: new Date().toISOString(),
        _count: { prospects: 0 }
      };
      
      // Add to campaigns list
      setCampaigns(prev => [newCampaign, ...prev]);
      
      // Close modal and reset form
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        type: 'LINKEDIN',
        dailyLimit: 50,
        messageTemplate: ''
      });
      
      alert('Campagne créée avec succès !');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Erreur lors de la création de la campagne');
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Play className="w-4 h-4" />;
      case 'PAUSED': return <Pause className="w-4 h-4" />;
      default: return null;
    }
  };

  const calculateProgress = (campaign: Campaign) => {
    if (campaign.totalProspects === 0) return 0;
    return (campaign.sentCount / campaign.totalProspects) * 100;
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (campaign.sentCount === 0) return 0;
    return (campaign.openedCount / campaign.sentCount) * 100;
  };

  const calculateReplyRate = (campaign: Campaign) => {
    if (campaign.sentCount === 0) return 0;
    return (campaign.repliedCount / campaign.sentCount) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campagnes</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos campagnes de prospection avec enrichissement automatique des profils
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Campagne
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Total Campagnes</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Messages Envoyés</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.sentCount, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Taux de Réponse</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.length > 0 
                  ? Math.round(campaigns.reduce((sum, c) => sum + calculateReplyRate(c), 0) / campaigns.length)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher des campagnes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les statuts</option>
          <option value="DRAFT">Brouillon</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">En pause</option>
          <option value="COMPLETED">Terminée</option>
          <option value="CANCELLED">Annulée</option>
        </select>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-black mt-1">{campaign.description}</p>
              </div>
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusIcon(campaign.status)}
                <span className="ml-1">{campaign.status}</span>
              </Badge>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-black mb-1">
                <span>Progression</span>
                <span>{Math.round(calculateProgress(campaign))}%</span>
              </div>
              <Progress value={calculateProgress(campaign)} className="h-2" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">{campaign.totalProspects}</p>
                <p className="text-xs text-black">Prospects</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-blue-600">{Math.round(calculateOpenRate(campaign))}%</p>
                <p className="text-xs text-black">Ouverture</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-600">{Math.round(calculateReplyRate(campaign))}%</p>
                <p className="text-xs text-black">Réponse</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir
              </Button>
              
              {campaign.status === 'DRAFT' && (
                <Button
                  onClick={() => handleStartCampaign(campaign.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              
              {campaign.status === 'ACTIVE' && (
                <Button
                  onClick={() => handleStopCampaign(campaign.id)}
                  size="sm"
                  variant="outline"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Enrichment Button */}
            {campaign.totalProspects > 0 && (
              <Button
                onClick={() => handleEnrichProspects(campaign.id)}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Enrichir les Prospects
              </Button>
            )}
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune campagne trouvée</h3>
          <p className="text-black mb-4">
            {searchTerm || statusFilter 
              ? 'Aucune campagne ne correspond à vos critères de recherche.'
              : 'Commencez par créer votre première campagne de prospection.'
            }
          </p>
          {!searchTerm && !statusFilter && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une Campagne
            </Button>
          )}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouvelle Campagne"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nom de la campagne
            </label>
            <Input 
              placeholder="Ex: Prospection CTOs Paris" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Description de votre campagne..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="LINKEDIN">LinkedIn</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="MULTI_CHANNEL">Multi-canal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limite quotidienne
              </label>
              <Input 
                type="number" 
                placeholder="50" 
                value={formData.dailyLimit}
                onChange={(e) => handleInputChange('dailyLimit', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template de message
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Bonjour {{firstName}}, je vois que vous travaillez chez {{company}} en tant que {{position}}. J'aimerais discuter d'une opportunité qui pourrait vous intéresser..."
              value={formData.messageTemplate}
              onChange={(e) => handleInputChange('messageTemplate', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateCampaign}
              loading={creatingCampaign}
              disabled={creatingCampaign}
            >
              Créer la Campagne
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 