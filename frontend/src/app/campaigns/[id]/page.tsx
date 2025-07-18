'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  Mail, 
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Star,
  Plus,
  Upload,
  Download,
  RefreshCw,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  type: 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'MULTI_CHANNEL';
  targetAudience: any;
  messageTemplate: string;
  aiConfig: any;
  dailyLimit: number;
  delayBetweenMessages: number;
  sendTimeStart?: string;
  sendTimeEnd?: string;
  totalProspects: number;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  prospects: Prospect[];
}

interface Prospect {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  linkedinId?: string;
  headline?: string;
  company?: string;
  position?: string;
  location?: string;
  industry?: string;
  experience: any[];
  education: any[];
  skills: string[];
  score: number;
  status: 'PENDING' | 'QUALIFIED' | 'CONTACTED' | 'RESPONDED' | 'CONVERTED' | 'REJECTED';
  personalizedMessage?: string;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  profileFetchedAt?: string;
  createdAt: string;
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

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProspectsModal, setShowAddProspectsModal] = useState(false);
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
      fetchCampaignStats();
    }
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.data);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignStats = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
  };

  const handleStartCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/start`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error('Error starting campaign:', error);
    }
  };

  const handleStopCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/stop`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error('Error stopping campaign:', error);
    }
  };

  const handleEnrichProspects = async () => {
    try {
      setShowEnrichmentModal(true);
      setEnrichmentProgress(0);

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
        // Simuler la progression
        const interval = setInterval(() => {
          setEnrichmentProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setShowEnrichmentModal(false);
                fetchCampaign();
                fetchCampaignStats();
              }, 1000);
              return 100;
            }
            return prev + 10;
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error enriching prospects:', error);
      setShowEnrichmentModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProspectStatusColor = (status: string) => {
    switch (status) {
      case 'QUALIFIED': return 'bg-green-100 text-green-800';
      case 'CONTACTED': return 'bg-blue-100 text-blue-800';
      case 'RESPONDED': return 'bg-purple-100 text-purple-800';
      case 'CONVERTED': return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = () => {
    if (!campaign || campaign.totalProspects === 0) return 0;
    return (campaign.sentCount / campaign.totalProspects) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campagne non trouvée</h1>
          <Button onClick={() => router.push('/campaigns')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux campagnes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/campaigns')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-gray-600 mt-1">{campaign.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
          
          {campaign.status === 'DRAFT' && (
            <Button
              onClick={handleStartCampaign}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Démarrer
            </Button>
          )}
          
          {campaign.status === 'ACTIVE' && (
            <Button
              onClick={handleStopCampaign}
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={() => setShowAddProspectsModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter des Prospects
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Qualifiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux d'Ouverture</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.openRate * 100)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de Réponse</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.replyRate * 100)}%</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Progress */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progression de la campagne</h3>
          <span className="text-sm text-gray-600">
            {campaign.sentCount} / {campaign.totalProspects} messages envoyés
          </span>
        </div>
        <Progress value={calculateProgress()} className="h-3" />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="scheduling">Planification</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="ai">IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de la campagne</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{campaign.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Limite quotidienne:</span>
                  <span className="font-medium">{campaign.dailyLimit} messages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Délai entre messages:</span>
                  <span className="font-medium">{campaign.delayBetweenMessages / 1000}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée le:</span>
                  <span className="font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                {campaign.startedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Démarrée le:</span>
                    <span className="font-medium">{new Date(campaign.startedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleEnrichProspects}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Enrichir les prospects
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les données
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir les analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres avancés
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prospects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Prospects ({campaign.prospects.length})</h3>
            <div className="flex space-x-2">
              <Button
                onClick={handleEnrichProspects}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Enrichir
              </Button>
              <Button
                onClick={() => setShowAddProspectsModal(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {campaign.prospects.map((prospect) => (
              <Card key={prospect.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      className="w-10 h-10"
                      fallback={`${prospect.firstName || ''} ${prospect.lastName || ''}`}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {prospect.firstName} {prospect.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{prospect.position}</p>
                    </div>
                  </div>
                  <Badge className={getProspectStatusColor(prospect.status)}>
                    {prospect.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {prospect.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      {prospect.company}
                    </div>
                  )}
                  {prospect.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {prospect.location}
                    </div>
                  )}
                  {prospect.headline && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {prospect.headline}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{Math.round(prospect.score * 100)}%</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {prospect.personalizedMessage && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {prospect.personalizedMessage}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template de message</h3>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Votre template de message avec variables personnalisées..."
              defaultValue={campaign.messageTemplate}
            />
            <p className="text-sm text-gray-600 mt-2">
              Variables disponibles: {'{firstName}'}, {'{lastName}'}, {'{company}'}, {'{position}'}, {'{location}'}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Planification d'envoi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début
                </label>
                <Input
                  type="time"
                  defaultValue={campaign.sendTimeStart}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin
                </label>
                <Input
                  type="time"
                  defaultValue={campaign.sendTimeEnd}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience cible</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(campaign.targetAudience, null, 2)}
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration IA</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(campaign.aiConfig, null, 2)}
            </pre>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Prospects Modal */}
      <Modal
        isOpen={showAddProspectsModal}
        onClose={() => setShowAddProspectsModal(false)}
        title="Ajouter des Prospects"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import CSV
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Glissez-déposez un fichier CSV ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Colonnes: firstName, lastName, email, company, position, linkedinUrl
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou ajouter manuellement
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Nom, Prénom, Email, Entreprise, Poste, URL LinkedIn (une ligne par prospect)"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddProspectsModal(false)}
            >
              Annuler
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Ajouter les Prospects
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enrichment Progress Modal */}
      <Modal
        isOpen={showEnrichmentModal}
        onClose={() => setShowEnrichmentModal(false)}
        title="Enrichissement des Prospects"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Récupération des profils LinkedIn
            </h3>
            <p className="text-gray-600">
              Nous récupérons et analysons les profils de vos prospects pour générer des messages personnalisés.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{enrichmentProgress}%</span>
            </div>
            <Progress value={enrichmentProgress} className="h-2" />
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>✓ Récupération des profils LinkedIn</p>
            <p>✓ Analyse des expériences et compétences</p>
            <p>✓ Génération de messages personnalisés</p>
            <p>✓ Qualification automatique des prospects</p>
          </div>
        </div>
      </Modal>
    </div>
  );
} 