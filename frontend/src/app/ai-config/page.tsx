'use client';

import { useState } from 'react';
import { 
  Brain,
  User,
  Building,
  Target,
  MessageSquare,
  Zap,
  Save,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Upload,
  Globe,
  Users,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';

interface AIProfile {
  personalInfo: {
    name: string;
    title: string;
    company: string;
    industry: string;
    experience: string;
    avatar?: string;
  };
  businessInfo: {
    companyName: string;
    companySize: string;
    industry: string;
    valueProposition: string;
    targetMarket: string;
    competitors: string[];
    uniqueSellingPoints: string[];
  };
  communicationStyle: {
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    approach: 'direct' | 'consultative' | 'storytelling' | 'data-driven';
    language: 'french' | 'english' | 'bilingual';
    personalizationLevel: 'basic' | 'advanced' | 'expert';
  };
  targetAudience: {
    primaryTarget: string;
    painPoints: string[];
    goals: string[];
    decisionFactors: string[];
    objections: string[];
  };
  messageTemplates: {
    openingLines: string[];
    valueProps: string[];
    callToActions: string[];
    followUpStrategies: string[];
  };
  aiSettings: {
    creativityLevel: 'conservative' | 'balanced' | 'creative';
    personalizationDepth: 'basic' | 'detailed' | 'comprehensive';
    adaptationSpeed: 'slow' | 'moderate' | 'fast';
    learningFromResponses: boolean;
    sentimentAnalysis: boolean;
    competitorMentioning: boolean;
  };
}

export default function AIConfigPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [aiProfile, setAIProfile] = useState<AIProfile>({
    personalInfo: {
      name: '',
      title: '',
      company: '',
      industry: '',
      experience: '',
    },
    businessInfo: {
      companyName: '',
      companySize: '',
      industry: '',
      valueProposition: '',
      targetMarket: '',
      competitors: [],
      uniqueSellingPoints: [],
    },
    communicationStyle: {
      tone: 'professional',
      approach: 'consultative',
      language: 'french',
      personalizationLevel: 'advanced',
    },
    targetAudience: {
      primaryTarget: '',
      painPoints: [],
      goals: [],
      decisionFactors: [],
      objections: [],
    },
    messageTemplates: {
      openingLines: [''],
      valueProps: [''],
      callToActions: [''],
      followUpStrategies: [''],
    },
    aiSettings: {
      creativityLevel: 'balanced',
      personalizationDepth: 'detailed',
      adaptationSpeed: 'moderate',
      learningFromResponses: true,
      sentimentAnalysis: true,
      competitorMentioning: false,
    },
  });

  const [newCompetitor, setNewCompetitor] = useState('');
  const [newUSP, setNewUSP] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newDecisionFactor, setNewDecisionFactor] = useState('');
  const [newObjection, setNewObjection] = useState('');

  const steps = [
    { id: 1, name: 'Profil personnel', icon: User },
    { id: 2, name: 'Entreprise & Offre', icon: Building },
    { id: 3, name: 'Style de communication', icon: MessageSquare },
    { id: 4, name: 'Audience cible', icon: Target },
    { id: 5, name: 'Templates de messages', icon: Brain },
    { id: 6, name: 'Paramètres IA', icon: Zap },
  ];

  const handleSave = () => {
    // Ici on sauvegarderait la configuration IA
    console.log('Configuration IA sauvegardée:', aiProfile);
    alert('Configuration IA sauvegardée avec succès !');
  };

  const addItem = (field: keyof AIProfile, item: string) => {
    if (item.trim()) {
      setAIProfile({
        ...aiProfile,
        [field]: {
          ...aiProfile[field],
          [field === 'businessInfo' ? 'competitors' : 
           field === 'targetAudience' ? 'painPoints' : '']: 
          [...(aiProfile[field] as any)[field === 'businessInfo' ? 'competitors' : 
           field === 'targetAudience' ? 'painPoints' : ''], item.trim()]
        }
      });
      setNewCompetitor('');
      setNewUSP('');
      setNewPainPoint('');
      setNewGoal('');
      setNewDecisionFactor('');
      setNewObjection('');
    }
  };

  const removeItem = (field: keyof AIProfile, index: number) => {
    const fieldName = field === 'businessInfo' ? 'competitors' : 
                     field === 'targetAudience' ? 'painPoints' : '';
    const items = [...(aiProfile[field] as any)[fieldName]];
    items.splice(index, 1);
    setAIProfile({
      ...aiProfile,
      [field]: {
        ...aiProfile[field],
        [fieldName]: items
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAIProfile({
          ...aiProfile,
          personalInfo: {
            ...aiProfile.personalInfo,
            avatar: e.target?.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Configuration IA</h1>
                <p className="text-sm text-gray-500">Personnalisez votre assistant IA</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      activeStep === step.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Step 1: Personal Info */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Votre profil personnel</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={aiProfile.personalInfo.name}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        personalInfo: { ...aiProfile.personalInfo, name: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre / Poste
                    </label>
                    <input
                      type="text"
                      value={aiProfile.personalInfo.title}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        personalInfo: { ...aiProfile.personalInfo, title: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="CEO, Directeur Commercial, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={aiProfile.personalInfo.company}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        personalInfo: { ...aiProfile.personalInfo, company: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur d'activité
                    </label>
                    <input
                      type="text"
                      value={aiProfile.personalInfo.industry}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        personalInfo: { ...aiProfile.personalInfo, industry: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tech, Finance, Marketing, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience professionnelle
                  </label>
                  <textarea
                    value={aiProfile.personalInfo.experience}
                    onChange={(e) => setAIProfile({
                      ...aiProfile,
                      personalInfo: { ...aiProfile.personalInfo, experience: e.target.value }
                    })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre parcours, expertise, réussites..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                  </label>
                  <div className="flex items-center space-x-4">
                    {aiProfile.personalInfo.avatar && (
                      <img
                        src={aiProfile.personalInfo.avatar}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Votre entreprise et offre</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={aiProfile.businessInfo.companyName}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        businessInfo: { ...aiProfile.businessInfo, companyName: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille de l'entreprise
                    </label>
                    <select
                      value={aiProfile.businessInfo.companySize}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        businessInfo: { ...aiProfile.businessInfo, companySize: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="startup">Startup (1-10 employés)</option>
                      <option value="small">Petite entreprise (11-50 employés)</option>
                      <option value="medium">Moyenne entreprise (51-200 employés)</option>
                      <option value="large">Grande entreprise (200+ employés)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposition de valeur
                  </label>
                  <textarea
                    value={aiProfile.businessInfo.valueProposition}
                    onChange={(e) => setAIProfile({
                      ...aiProfile,
                      businessInfo: { ...aiProfile.businessInfo, valueProposition: e.target.value }
                    })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Que fait votre entreprise ? Quel problème résolvez-vous ? Quel est votre avantage concurrentiel ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marché cible
                  </label>
                  <textarea
                    value={aiProfile.businessInfo.targetMarket}
                    onChange={(e) => setAIProfile({
                      ...aiProfile,
                      businessInfo: { ...aiProfile.businessInfo, targetMarket: e.target.value }
                    })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Quels types d'entreprises/clients ciblez-vous ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Concurrents principaux
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newCompetitor}
                      onChange={(e) => setNewCompetitor(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom du concurrent"
                    />
                    <button
                      onClick={() => addItem('businessInfo', newCompetitor)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiProfile.businessInfo.competitors.map((competitor, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {competitor}
                        <button
                          onClick={() => removeItem('businessInfo', index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points forts uniques
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newUSP}
                      onChange={(e) => setNewUSP(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Votre avantage unique"
                    />
                    <button
                      onClick={() => addItem('businessInfo', newUSP)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiProfile.businessInfo.uniqueSellingPoints.map((usp, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {usp}
                        <button
                          onClick={() => removeItem('businessInfo', index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Communication Style */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Style de communication</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ton de communication
                    </label>
                    <select
                      value={aiProfile.communicationStyle.tone}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        communicationStyle: { ...aiProfile.communicationStyle, tone: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="professional">Professionnel</option>
                      <option value="friendly">Amical</option>
                      <option value="casual">Décontracté</option>
                      <option value="formal">Formel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approche
                    </label>
                    <select
                      value={aiProfile.communicationStyle.approach}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        communicationStyle: { ...aiProfile.communicationStyle, approach: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="direct">Direct</option>
                      <option value="consultative">Consultatif</option>
                      <option value="storytelling">Storytelling</option>
                      <option value="data-driven">Basé sur les données</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={aiProfile.communicationStyle.language}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        communicationStyle: { ...aiProfile.communicationStyle, language: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="french">Français</option>
                      <option value="english">Anglais</option>
                      <option value="bilingual">Bilingue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de personnalisation
                    </label>
                    <select
                      value={aiProfile.communicationStyle.personalizationLevel}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        communicationStyle: { ...aiProfile.communicationStyle, personalizationLevel: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="basic">Basique</option>
                      <option value="advanced">Avancé</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Target Audience */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Audience cible</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cible principale
                  </label>
                  <textarea
                    value={aiProfile.targetAudience.primaryTarget}
                    onChange={(e) => setAIProfile({
                      ...aiProfile,
                      targetAudience: { ...aiProfile.targetAudience, primaryTarget: e.target.value }
                    })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre audience cible idéale (ex: CEOs de startups tech, directeurs marketing...)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points de douleur
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newPainPoint}
                      onChange={(e) => setNewPainPoint(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Problème que rencontrent vos prospects"
                    />
                    <button
                      onClick={() => addItem('targetAudience', newPainPoint)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiProfile.targetAudience.painPoints.map((point, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {point}
                        <button
                          onClick={() => removeItem('targetAudience', index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectifs des prospects
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Objectif que veulent atteindre vos prospects"
                    />
                    <button
                      onClick={() => addItem('targetAudience', newGoal)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiProfile.targetAudience.goals.map((goal, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {goal}
                        <button
                          onClick={() => removeItem('targetAudience', index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Message Templates */}
            {activeStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Templates de messages</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accroches d'ouverture
                  </label>
                  <div className="space-y-2">
                    {aiProfile.messageTemplates.openingLines.map((line, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={line}
                          onChange={(e) => {
                            const newLines = [...aiProfile.messageTemplates.openingLines];
                            newLines[index] = e.target.value;
                            setAIProfile({
                              ...aiProfile,
                              messageTemplates: { ...aiProfile.messageTemplates, openingLines: newLines }
                            });
                          }}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Accroche d'ouverture..."
                        />
                        <button
                          onClick={() => {
                            const newLines = aiProfile.messageTemplates.openingLines.filter((_, i) => i !== index);
                            setAIProfile({
                              ...aiProfile,
                              messageTemplates: { ...aiProfile.messageTemplates, openingLines: newLines }
                            });
                          }}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setAIProfile({
                          ...aiProfile,
                          messageTemplates: {
                            ...aiProfile.messageTemplates,
                            openingLines: [...aiProfile.messageTemplates.openingLines, '']
                          }
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une accroche
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Propositions de valeur
                  </label>
                  <div className="space-y-2">
                    {aiProfile.messageTemplates.valueProps.map((prop, index) => (
                      <div key={index} className="flex space-x-2">
                        <textarea
                          value={prop}
                          onChange={(e) => {
                            const newProps = [...aiProfile.messageTemplates.valueProps];
                            newProps[index] = e.target.value;
                            setAIProfile({
                              ...aiProfile,
                              messageTemplates: { ...aiProfile.messageTemplates, valueProps: newProps }
                            });
                          }}
                          rows={2}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Proposition de valeur..."
                        />
                        <button
                          onClick={() => {
                            const newProps = aiProfile.messageTemplates.valueProps.filter((_, i) => i !== index);
                            setAIProfile({
                              ...aiProfile,
                              messageTemplates: { ...aiProfile.messageTemplates, valueProps: newProps }
                            });
                          }}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setAIProfile({
                          ...aiProfile,
                          messageTemplates: {
                            ...aiProfile.messageTemplates,
                            valueProps: [...aiProfile.messageTemplates.valueProps, '']
                          }
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une proposition de valeur
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: AI Settings */}
            {activeStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres IA</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de créativité
                    </label>
                    <select
                      value={aiProfile.aiSettings.creativityLevel}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        aiSettings: { ...aiProfile.aiSettings, creativityLevel: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="conservative">Conservateur</option>
                      <option value="balanced">Équilibré</option>
                      <option value="creative">Créatif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profondeur de personnalisation
                    </label>
                    <select
                      value={aiProfile.aiSettings.personalizationDepth}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        aiSettings: { ...aiProfile.aiSettings, personalizationDepth: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="basic">Basique</option>
                      <option value="detailed">Détaillé</option>
                      <option value="comprehensive">Complet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vitesse d'adaptation
                    </label>
                    <select
                      value={aiProfile.aiSettings.adaptationSpeed}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        aiSettings: { ...aiProfile.aiSettings, adaptationSpeed: e.target.value as any }
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="slow">Lente</option>
                      <option value="moderate">Modérée</option>
                      <option value="fast">Rapide</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aiProfile.aiSettings.learningFromResponses}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        aiSettings: { ...aiProfile.aiSettings, learningFromResponses: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Apprentissage à partir des réponses
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aiProfile.aiSettings.sentimentAnalysis}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        aiSettings: { ...aiProfile.aiSettings, sentimentAnalysis: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Analyse de sentiment des réponses
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aiProfile.aiSettings.competitorMentioning}
                      onChange={(e) => setAIProfile({
                        ...aiProfile,
                        aiSettings: { ...aiProfile.aiSettings, competitorMentioning: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Mentionner les concurrents dans les messages
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
                disabled={activeStep === 6}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 