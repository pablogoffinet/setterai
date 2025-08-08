'use client';

import { useState } from 'react';
import { 
  Plus, 
  Users, 
  Search,
  Filter,
  Mail,
  Phone,
  Linkedin,
  Building,
  MapPin,
  Star,
  Edit,
  Trash2,
  MessageSquare,
  UserPlus
} from '@/lib/icons';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  company: string;
  position: string;
  location: string;
  status: 'new' | 'contacted' | 'responded' | 'qualified' | 'converted' | 'lost';
  score: number;
  lastContact?: string;
  notes?: string;
  tags: string[];
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@techstartup.com',
      phone: '+33 6 12 34 56 78',
      linkedinUrl: 'https://linkedin.com/in/jeandupont',
      company: 'TechStartup',
      position: 'CEO & Founder',
      location: 'Paris, France',
      status: 'contacted',
      score: 85,
      lastContact: '2024-01-15',
      notes: 'Intéressé par notre solution SaaS',
      tags: ['CEO', 'Tech', 'Startup']
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@marketingagency.com',
      linkedinUrl: 'https://linkedin.com/in/mariemartin',
      company: 'Marketing Agency Pro',
      position: 'Marketing Director',
      location: 'Lyon, France',
      status: 'responded',
      score: 92,
      lastContact: '2024-01-18',
      notes: 'Demande de démonstration',
      tags: ['Marketing', 'Agency', 'Director']
    },
    {
      id: '3',
      name: 'Pierre Durand',
      email: 'pierre.durand@consulting.com',
      phone: '+33 1 23 45 67 89',
      company: 'Digital Consulting',
      position: 'CTO',
      location: 'Marseille, France',
      status: 'new',
      score: 78,
      tags: ['CTO', 'Consulting', 'Digital']
    },
    {
      id: '4',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@ecommerce.com',
      linkedinUrl: 'https://linkedin.com/in/sophiebernard',
      company: 'E-Commerce Plus',
      position: 'VP Sales',
      location: 'Bordeaux, France',
      status: 'qualified',
      score: 95,
      lastContact: '2024-01-20',
      notes: 'Budget approuvé, en attente de signature',
      tags: ['VP Sales', 'E-commerce', 'Qualified']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'contacted': return 'Contacté';
      case 'responded': return 'A répondu';
      case 'qualified': return 'Qualifié';
      case 'converted': return 'Converti';
      case 'lost': return 'Perdu';
      default: return status;
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProspect = () => {
    setShowCreateModal(true);
  };

  const handleEditProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setShowCreateModal(true);
  };

  const handleDeleteProspect = (prospectId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      setProspects(prospects.filter(prospect => prospect.id !== prospectId));
    }
  };

  const handleContactProspect = (prospectId: string) => {
    // Ici on pourrait ouvrir un modal pour envoyer un message
    alert(`Contacter ${prospects.find(p => p.id === prospectId)?.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Prospects</h1>
            </div>
            <button 
              onClick={handleCreateProspect}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un prospect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total prospects</p>
                <p className="text-2xl font-semibold text-gray-900">{prospects.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Contactés</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {prospects.filter(p => p.status !== 'new').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Qualifiés</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {prospects.filter(p => p.status === 'qualified').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Convertis</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {prospects.filter(p => p.status === 'converted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, entreprise ou email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="new">Nouveau</option>
                <option value="contacted">Contacté</option>
                <option value="responded">A répondu</option>
                <option value="qualified">Qualifié</option>
                <option value="converted">Converti</option>
                <option value="lost">Perdu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prospects List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Mes prospects ({filteredProspects.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prospect
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernier contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{prospect.name}</div>
                        <div className="text-sm text-gray-500">{prospect.position}</div>
                        <div className="flex items-center mt-1 space-x-2">
                          {prospect.email && (
                            <a href={`mailto:${prospect.email}`} className="text-blue-600 hover:text-blue-900">
                              <Mail className="w-3 h-3" />
                            </a>
                          )}
                          {prospect.phone && (
                            <a href={`tel:${prospect.phone}`} className="text-green-600 hover:text-green-900">
                              <Phone className="w-3 h-3" />
                            </a>
                          )}
                          {prospect.linkedinUrl && (
                            <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">
                              <Linkedin className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{prospect.company}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {prospect.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                        {getStatusText(prospect.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className={`w-4 h-4 mr-1 ${prospect.score >= 80 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        <span className="text-sm text-gray-900">{prospect.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prospect.lastContact ? new Date(prospect.lastContact).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleContactProspect(prospect.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Contacter"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProspect(prospect)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProspect(prospect.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedProspect ? 'Modifier le prospect' : 'Nouveau prospect'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={selectedProspect?.name || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={selectedProspect?.email || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={selectedProspect?.company || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Poste</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={selectedProspect?.position || ''}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {selectedProspect ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 