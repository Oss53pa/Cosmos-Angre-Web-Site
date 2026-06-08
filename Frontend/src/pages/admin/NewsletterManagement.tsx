import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNewsletter } from '../../hooks/useNewsletter';
import { supabase } from '../../lib/supabase';
import {
  Mail,
  Search,
  Send,
  Users,
  TrendingUp,
  Download,
  Eye,
  Trash2,
  XCircle,
  CheckCircle,
  Calendar,
  BarChart3,
  Edit,
  Plus,
  FileText,
  Target,
  Copy,
  Clock,
  Grid,
  List,
  Image,
  Type,
  AlignLeft,
  Upload,
  Loader2,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedDate: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

interface Campaign {
  id: string;
  subject: string;
  content: string;
  sentDate: string;
  recipients: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledDate?: string;
}

interface Template {
  id: string;
  name: string;
  category: 'promotional' | 'newsletter' | 'event' | 'transactional';
  subject: string;
  content: string;
  lastUsed?: string;
  timesUsed: number;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  criteria: string;
  createdDate: string;
}

const NewsletterManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    'subscribers' | 'campaigns' | 'templates' | 'segments' | 'analytics'
  >('subscribers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [templateViewMode, setTemplateViewMode] = useState<'list' | 'grid'>('list');

  // Campaign creation form state
  const [newCampaignSubject, setNewCampaignSubject] = useState('');
  const [newCampaignContent, setNewCampaignContent] = useState('');
  const [newCampaignRecipients, setNewCampaignRecipients] = useState('all');
  const [campaignSuccessMsg, setCampaignSuccessMsg] = useState('');

  // Template edit form state
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateCategory, setEditTemplateCategory] =
    useState<Template['category']>('promotional');
  const [editTemplateSubject, setEditTemplateSubject] = useState('');
  const [editTemplateContent, setEditTemplateContent] = useState('');
  const [editTemplateHeaderImage, setEditTemplateHeaderImage] = useState('');
  const [templateSuccessMsg, setTemplateSuccessMsg] = useState('');

  // Premium preview + image insertion
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingContentImg, setUploadingContentImg] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const headerFileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);

  // Upload an image to Supabase Storage and return its public URL.
  const uploadNewsletterImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const safe = `newsletter/${Date.now()}-${Math.round(performance.now())}.${ext}`;
      const { error: upErr } = await supabase.storage.from('site').upload(safe, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('site').getPublicUrl(safe);
      return data.publicUrl;
    } catch (err) {
      window.alert(
        t('admin.newsletter.templates.uploadError', "Échec du téléversement de l'image.") +
          ' ' +
          (err instanceof Error ? err.message : '')
      );
      return null;
    }
  }, [t]);

  // Insert text/HTML at the cursor position in the main content textarea.
  const insertInContent = useCallback((snippet: string) => {
    const ta = contentTextareaRef.current;
    if (!ta) {
      setEditTemplateContent((prev) => prev + snippet);
      return;
    }
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    setEditTemplateContent((prev) => prev.slice(0, start) + snippet + prev.slice(end));
    // Restore focus after React re-render.
    setTimeout(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  }, []);

  const handleHeaderUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingHeader(true);
      const url = await uploadNewsletterImage(file);
      setUploadingHeader(false);
      if (url) setEditTemplateHeaderImage(url);
      if (headerFileRef.current) headerFileRef.current.value = '';
    },
    [uploadNewsletterImage]
  );

  const handleContentImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingContentImg(true);
      const url = await uploadNewsletterImage(file);
      setUploadingContentImg(false);
      if (url) {
        insertInContent(
          `\n<img src="${url}" alt="" style="max-width:100%;border-radius:12px;margin:16px 0;display:block;" />\n`
        );
      }
      if (contentFileRef.current) contentFileRef.current.value = '';
    },
    [uploadNewsletterImage, insertInContent]
  );

  // Build a premium branded HTML email for the live preview (iframe srcDoc).
  const buildEmailPreview = useCallback(() => {
    const subject = editTemplateSubject || t('admin.newsletter.templates.noSubject', '(Sans sujet)');
    const headerImg = editTemplateHeaderImage;
    // If content already contains HTML tags, keep it; otherwise convert line breaks.
    const rawContent = editTemplateContent || '';
    const looksHtml = /<[a-z][\s\S]*>/i.test(rawContent);
    const bodyHtml = looksHtml
      ? rawContent
      : rawContent
          .split(/\n{2,}/)
          .map((p) => `<p style="margin:0 0 16px;">${p.replace(/\n/g, '<br/>')}</p>`)
          .join('');

    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body { margin:0; padding:0; background:#EDE4D3; font-family: 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased; }
  .wrap { max-width:600px; margin:0 auto; background:#ffffff; }
  .topbar { height:4px; background:linear-gradient(90deg,#C9A961,#E4CE94,#C9A961); }
  .brand { text-align:center; padding:28px 24px 8px; }
  .brand .name { font-family: Georgia, 'Times New Roman', serif; font-size:26px; letter-spacing:2px; color:#2F5439; font-weight:400; }
  .brand .tag { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#C9A961; margin-top:6px; }
  .hero img { width:100%; display:block; }
  .content { padding:32px 40px; color:#3a3a3a; font-size:16px; line-height:1.8; font-weight:300; }
  .content h1,.content h2,.content h3 { font-family: Georgia, serif; color:#2F5439; font-weight:400; line-height:1.3; }
  .content img { max-width:100%; height:auto; border-radius:12px; margin:16px 0; }
  .content a { color:#C9A961; }
  .divider { width:48px; height:2px; background:#C9A961; margin:8px auto 28px; }
  .footer { background:#2F5439; color:#EDE4D3; padding:28px 40px; text-align:center; font-size:12px; line-height:1.7; font-weight:300; }
  .footer .gold { color:#C9A961; letter-spacing:2px; text-transform:uppercase; font-size:11px; }
  .footer a { color:#C9A961; text-decoration:none; }
  .legal { font-size:10px; color:rgba(237,228,211,0.5); margin-top:14px; }
</style></head>
<body>
  <div class="wrap">
    <div class="topbar"></div>
    <div class="brand">
      <div class="name">COSMOS&nbsp;ANGRÉ</div>
      <div class="tag">Le centre de vie · Cocody-Angré</div>
    </div>
    <div class="divider"></div>
    ${headerImg ? `<div class="hero"><img src="${headerImg}" alt=""/></div>` : ''}
    <div class="content">
      ${bodyHtml || `<p style="color:#bbb;">${t('admin.newsletter.templates.emptyPreview', 'Le contenu de votre email apparaîtra ici…')}</p>`}
    </div>
    <div class="footer">
      <div class="gold">Cosmos Angré</div>
      <div style="margin-top:8px;">Boulevard Latrille, Angré · Cocody, Abidjan</div>
      <div>contact@cosmos-angre.ci</div>
      <div class="legal">Vous recevez cet email car vous êtes abonné(e) à la newsletter Cosmos Angré.<br/>Se désabonner · © 2026 Cosmos Angré</div>
    </div>
  </div>
</body></html>`;
  }, [editTemplateSubject, editTemplateHeaderImage, editTemplateContent, t]);

  // Use Supabase hook for subscribers
  const { subscribers: supabaseSubscribers, isLoading, error, deleteSubscriber } = useNewsletter();

  // Map Supabase subscribers to local format (snake_case to camelCase)
  const subscribers: Subscriber[] = supabaseSubscribers.map((sub) => ({
    id: sub.id,
    email: sub.email,
    name: sub.name || undefined,
    subscribedDate: sub.subscribed_date,
    status: sub.status,
    source: sub.source,
  }));

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      subject: t(
        'admin.newsletter.mockCampaigns.springSale',
        "Soldes de Printemps 2025 - Jusqu'a -70%"
      ),
      content: t(
        'admin.newsletter.mockCampaigns.springSaleContent',
        "Decouvrez nos offres exceptionnelles pour les soldes de printemps ! Plus de 200 boutiques participent avec des reductions allant jusqu'a -70% sur une large selection d'articles. Mode, electronique, decoration... tout y est ! Rendez-vous du 15 au 31 mars 2025."
      ),
      sentDate: '2024-11-10',
      recipients: 1250,
      opened: 875,
      clicked: 342,
      status: 'sent',
    },
    {
      id: '2',
      subject: t(
        'admin.newsletter.mockCampaigns.autumnCollection',
        'Nouvelle Collection Automne/Hiver 2024'
      ),
      content: t(
        'admin.newsletter.mockCampaigns.autumnCollectionContent',
        'Les plus grandes marques devoilent leurs collections automne/hiver ! Decouvrez les dernieres tendances mode, les nouveaux styles et les pieces incontournables de la saison. Visitez nos boutiques partenaires : Zara, H&M, Nike, Adidas et bien plus encore.'
      ),
      sentDate: '2024-10-28',
      recipients: 1180,
      opened: 720,
      clicked: 210,
      status: 'sent',
    },
    {
      id: '3',
      subject: t(
        'admin.newsletter.mockCampaigns.fashionWeek',
        'Fashion Week Abidjan - Defile Exceptionnel'
      ),
      content: t(
        'admin.newsletter.mockCampaigns.fashionWeekContent',
        'Cosmos Angre accueille la Fashion Week Abidjan ! Assistez a un defile de mode exceptionnel le 10 novembre de 18h a 22h. Decouvrez les creations des designers locaux et internationaux. Entree gratuite sur inscription.'
      ),
      sentDate: '2024-10-15',
      recipients: 1100,
      opened: 650,
      clicked: 280,
      status: 'sent',
    },
    {
      id: '4',
      subject: t(
        'admin.newsletter.mockCampaigns.newRestaurants',
        'Ouverture de 5 Nouveaux Restaurants'
      ),
      content: t(
        'admin.newsletter.mockCampaigns.newRestaurantsContent',
        "Nous sommes ravis de vous annoncer l'ouverture de 5 nouveaux restaurants au Food Court ! Cuisine ivoirienne, italienne, asiatique, libanaise et americaine. Venez decouvrir ces nouvelles saveurs et profitez de -20% pour l'ouverture."
      ),
      sentDate: '2024-09-20',
      recipients: 980,
      opened: 590,
      clicked: 195,
      status: 'sent',
    },
    {
      id: '5',
      subject: t(
        'admin.newsletter.mockCampaigns.kidsDay',
        'Journee des Enfants - Activites Gratuites'
      ),
      content: t(
        'admin.newsletter.mockCampaigns.kidsDayContent',
        'Le samedi 5 octobre, Cosmos Angre organise une journee speciale pour les enfants ! Ateliers creatifs, spectacles, jeux, maquillage et bien plus encore. Toutes les activites sont gratuites. De 10h a 18h.'
      ),
      sentDate: '2024-09-28',
      recipients: 1050,
      opened: 780,
      clicked: 420,
      status: 'sent',
    },
    {
      id: '6',
      subject: t(
        'admin.newsletter.mockCampaigns.electronicsPromo',
        "Promotion Electronique - Jusqu'a -40%"
      ),
      content: t(
        'admin.newsletter.mockCampaigns.electronicsPromoContent',
        "Vos boutiques d'electronique preferees vous proposent des reductions exceptionnelles ! Smartphones, ordinateurs, accessoires... Profitez de remises allant jusqu'a -40% pendant tout le mois d'octobre."
      ),
      sentDate: '2024-10-01',
      recipients: 920,
      opened: 480,
      clicked: 165,
      status: 'sent',
    },
    {
      id: '7',
      subject: t(
        'admin.newsletter.mockCampaigns.blackFriday',
        'Black Friday 2024 - Offres Flash Toutes les Heures'
      ),
      content: t(
        'admin.newsletter.mockCampaigns.blackFridayContent',
        "Ne manquez pas notre evenement Black Friday exceptionnel ! Le 29 novembre de 6h a 23h, profitez d'offres flash toutes les heures dans toutes nos boutiques. Preparez votre liste et soyez prets !"
      ),
      sentDate: '2024-11-20',
      recipients: 0,
      opened: 0,
      clicked: 0,
      status: 'scheduled',
      scheduledDate: '2024-11-29',
    },
    {
      id: '8',
      subject: t(
        'admin.newsletter.mockCampaigns.decemberNewsletter',
        "Newsletter Decembre - Fetes de Fin d'Annee"
      ),
      content: t(
        'admin.newsletter.mockCampaigns.decemberNewsletterContent',
        "Preparez les fetes de fin d'annee avec nos boutiques partenaires ! Idees cadeaux, decorations, tenues de soiree... Retrouvez tous nos conseils et bons plans pour des fetes reussies. Plus des offres exclusives pour nos abonnes."
      ),
      sentDate: '',
      recipients: 0,
      opened: 0,
      clicked: 0,
      status: 'draft',
    },
    {
      id: '9',
      subject: t('admin.newsletter.mockCampaigns.winterSale', "Soldes d'Hiver - Derniere Demarque"),
      content: t(
        'admin.newsletter.mockCampaigns.winterSaleContent',
        "C'est le moment ou jamais ! Derniere demarque sur les soldes d'hiver avec des reductions pouvant aller jusqu'a -80%. Stocks limites, ne tardez pas !"
      ),
      sentDate: '',
      recipients: 0,
      opened: 0,
      clicked: 0,
      status: 'draft',
    },
    {
      id: '10',
      subject: t(
        'admin.newsletter.mockCampaigns.loyaltyProgram',
        'Programme de Fidelite - Gagnez des Points'
      ),
      content: t(
        'admin.newsletter.mockCampaigns.loyaltyProgramContent',
        "Decouvrez notre nouveau programme de fidelite ! Gagnez des points a chaque achat et beneficiez d'avantages exclusifs : reductions, acces prioritaire aux ventes privees, cadeaux d'anniversaire et bien plus."
      ),
      sentDate: '',
      recipients: 0,
      opened: 0,
      clicked: 0,
      status: 'draft',
    },
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: t('admin.newsletter.mockTemplates.storePromotion', 'Promotion Boutique'),
      category: 'promotional',
      subject: t(
        'admin.newsletter.mockTemplates.storePromotionSubject',
        '[Nom Boutique] - Offres Exclusives a ne pas manquer !'
      ),
      content: t(
        'admin.newsletter.mockTemplates.storePromotionContent',
        "Bonjour [Prenom],\n\nNous sommes ravis de vous presenter nos offres exceptionnelles du moment ! Profitez de reductions allant jusqu'a [Pourcentage]% sur [Categorie de produits].\n\nValable jusqu'au [Date].\n\nA bientot au centre commercial Cosmos Angre !"
      ),
      lastUsed: '2024-11-10',
      timesUsed: 15,
    },
    {
      id: '2',
      name: t('admin.newsletter.mockTemplates.eventAnnouncement', 'Annonce Evenement'),
      category: 'event',
      subject: t(
        'admin.newsletter.mockTemplates.eventAnnouncementSubject',
        "Evenement Special - [Nom de l'evenement]"
      ),
      content: t(
        'admin.newsletter.mockTemplates.eventAnnouncementContent',
        "Chers abonnes,\n\nNous avons le plaisir de vous inviter a notre prochain evenement : [Nom de l'evenement].\n\nDate : [Date]\nHeure : [Heure]\nLieu : [Lieu]\n\nVenez nombreux ! Entree [gratuite/payante].\n\nCordialement,\nL'equipe Cosmos Angre"
      ),
      lastUsed: '2024-10-28',
      timesUsed: 8,
    },
    {
      id: '3',
      name: t('admin.newsletter.mockTemplates.monthlyNewsletter', 'Newsletter Mensuelle'),
      category: 'newsletter',
      subject: t(
        'admin.newsletter.mockTemplates.monthlyNewsletterSubject',
        'Cosmos Angre - Newsletter [Mois]'
      ),
      content: t(
        'admin.newsletter.mockTemplates.monthlyNewsletterContent',
        "Bonjour,\n\nDecouvrez toute l'actualite du centre commercial ce mois-ci :\n\n- Nouvelles boutiques\n- Evenements a venir\n- Promotions du mois\n- Conseils shopping\n\nBonne lecture !"
      ),
      lastUsed: '2024-11-01',
      timesUsed: 12,
    },
    {
      id: '4',
      name: t('admin.newsletter.mockTemplates.welcomeNewSubscriber', 'Bienvenue Nouvel Abonne'),
      category: 'transactional',
      subject: t(
        'admin.newsletter.mockTemplates.welcomeNewSubscriberSubject',
        'Bienvenue chez Cosmos Angre !'
      ),
      content: t(
        'admin.newsletter.mockTemplates.welcomeNewSubscriberContent',
        'Bonjour [Prenom],\n\nMerci de vous etre inscrit a notre newsletter ! Vous recevrez desormais toutes nos actualites, nos offres exclusives et nos invitations aux evenements.\n\nEn cadeau de bienvenue, profitez de -10% dans nos boutiques partenaires avec le code : BIENVENUE10\n\nA tres bientot !'
      ),
      lastUsed: '2024-11-05',
      timesUsed: 24,
    },
    {
      id: '5',
      name: t('admin.newsletter.mockTemplates.salesMarkdowns', 'Soldes & Demarques'),
      category: 'promotional',
      subject: t(
        'admin.newsletter.mockTemplates.salesMarkdownsSubject',
        "Soldes [Saison] - Jusqu'a -[%]% !"
      ),
      content: t(
        'admin.newsletter.mockTemplates.salesMarkdownsContent',
        "C'est le moment que vous attendiez !\n\nLes soldes de [Saison] ont demarre avec des reductions exceptionnelles :\n\nJusqu'a -[Pourcentage]% dans toutes nos boutiques\nVentes flash quotidiennes\nCadeaux pour tout achat superieur a [Montant] FCFA\n\nNe tardez pas, les stocks sont limites !"
      ),
      timesUsed: 6,
    },
    {
      id: '6',
      name: t('admin.newsletter.mockTemplates.eventReminder', 'Rappel Evenement'),
      category: 'event',
      subject: t(
        'admin.newsletter.mockTemplates.eventReminderSubject',
        "C'est demain ! [Nom de l'evenement]"
      ),
      content: t(
        'admin.newsletter.mockTemplates.eventReminderContent',
        "Bonjour,\n\nPetit rappel : notre evenement [Nom] a lieu DEMAIN !\n\nRendez-vous a [Heure] au [Lieu].\n\nN'oubliez pas de confirmer votre presence.\n\nA demain !"
      ),
      lastUsed: '2024-10-14',
      timesUsed: 5,
    },
  ]);

  const [segments] = useState<Segment[]>([
    {
      id: '1',
      name: t('admin.newsletter.mockSegments.activeSubscribers', 'Abonnes Actifs'),
      description: t(
        'admin.newsletter.mockSegments.activeSubscribersDesc',
        'Tous les abonnes actifs qui ont ouvert au moins un email dans les 3 derniers mois'
      ),
      subscribers: 10,
      criteria: t(
        'admin.newsletter.mockSegments.activeSubscribersCriteria',
        'Statut: Actif, Derniere ouverture: -90 jours'
      ),
      createdDate: '2024-01-15',
    },
    {
      id: '2',
      name: t('admin.newsletter.mockSegments.newSubscribers', 'Nouveaux Abonnes'),
      description: t(
        'admin.newsletter.mockSegments.newSubscribersDesc',
        'Abonnes inscrits au cours des 30 derniers jours'
      ),
      subscribers: 3,
      criteria: t(
        'admin.newsletter.mockSegments.newSubscribersCriteria',
        "Date d'inscription: -30 jours"
      ),
      createdDate: '2024-10-01',
    },
    {
      id: '3',
      name: t('admin.newsletter.mockSegments.inactiveSubscribers', 'Abonnes Inactifs'),
      description: t(
        'admin.newsletter.mockSegments.inactiveSubscribersDesc',
        "Abonnes qui n'ont pas ouvert d'email depuis 6 mois"
      ),
      subscribers: 8,
      criteria: t(
        'admin.newsletter.mockSegments.inactiveSubscribersCriteria',
        'Derniere ouverture: > 180 jours'
      ),
      createdDate: '2024-09-10',
    },
    {
      id: '4',
      name: t('admin.newsletter.mockSegments.eventFans', "Fans d'Evenements"),
      description: t(
        'admin.newsletter.mockSegments.eventFansDesc',
        "Abonnes provenant d'evenements avec taux d'ouverture > 70%"
      ),
      subscribers: 5,
      criteria: t(
        'admin.newsletter.mockSegments.eventFansCriteria',
        "Source: Evenement, Taux d'ouverture: > 70%"
      ),
      createdDate: '2024-08-20',
    },
    {
      id: '5',
      name: t('admin.newsletter.mockSegments.vipShopping', 'VIP Shopping'),
      description: t(
        'admin.newsletter.mockSegments.vipShoppingDesc',
        'Abonnes avec forte interaction (clics sur promotions)'
      ),
      subscribers: 12,
      criteria: t(
        'admin.newsletter.mockSegments.vipShoppingCriteria',
        'Clics totaux: > 10, Sujet: Promotion'
      ),
      createdDate: '2024-07-05',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'unsubscribed':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      case 'sent':
        return 'text-cosmos-night bg-cosmos-gold/10 border-blue-200';
      case 'scheduled':
        return 'text-amber-600 bg-amber-50 border-orange-200';
      case 'draft':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return t('admin.newsletter.status.active', 'Actif');
      case 'unsubscribed':
        return t('admin.newsletter.status.unsubscribed', 'Desabonne');
      case 'sent':
        return t('admin.newsletter.status.sent', 'Envoye');
      case 'scheduled':
        return t('admin.newsletter.status.scheduled', 'Programme');
      case 'draft':
        return t('admin.newsletter.status.draft', 'Brouillon');
      default:
        return status;
    }
  };

  // Handler to delete a subscriber
  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (
      window.confirm(
        t('admin.newsletter.confirmDelete', 'Etes-vous sur de vouloir supprimer cet abonne ?')
      )
    ) {
      await deleteSubscriber(subscriberId);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSubscribers = subscribers.filter((s) => s.status === 'active').length;
  const totalSent = campaigns
    .filter((c) => c.status === 'sent')
    .reduce((sum, c) => sum + c.recipients, 0);
  const avgOpenRate =
    campaigns.filter((c) => c.status === 'sent').length > 0
      ? campaigns
          .filter((c) => c.status === 'sent')
          .reduce((sum, c) => sum + (c.opened / c.recipients) * 100, 0) /
        campaigns.filter((c) => c.status === 'sent').length
      : 0;

  // Handler: create a new campaign (draft or send now)
  const handleCreateCampaign = useCallback(
    (sendNow: boolean) => {
      if (!newCampaignSubject.trim() || !newCampaignContent.trim()) return;

      const newId = String(Date.now());
      const newCampaign: Campaign = {
        id: newId,
        subject: newCampaignSubject,
        content: newCampaignContent,
        sentDate: sendNow ? new Date().toISOString().split('T')[0] : '',
        recipients: sendNow ? activeSubscribers : 0,
        opened: 0,
        clicked: 0,
        status: sendNow ? 'sent' : 'draft',
      };

      setCampaigns((prev) => [newCampaign, ...prev]);
      setNewCampaignSubject('');
      setNewCampaignContent('');
      setNewCampaignRecipients('all');

      const msg = sendNow
        ? t('admin.newsletter.campaigns.sentSuccess', 'Campagne envoyee avec succes !')
        : t('admin.newsletter.campaigns.draftSaved', 'Brouillon enregistre avec succes !');
      setCampaignSuccessMsg(msg);
      setTimeout(() => {
        setCampaignSuccessMsg('');
        setIsCreatingCampaign(false);
      }, 2000);
    },
    [newCampaignSubject, newCampaignContent, activeSubscribers, t]
  );

  // Handler: send a draft campaign now
  const handleSendCampaign = useCallback(
    (campaignId: string) => {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === campaignId && (c.status === 'draft' || c.status === 'scheduled')) {
            return {
              ...c,
              status: 'sent' as const,
              sentDate: new Date().toISOString().split('T')[0],
              recipients: activeSubscribers,
            };
          }
          return c;
        })
      );
    },
    [activeSubscribers]
  );

  // Handler: open edit template modal and populate form state
  const handleOpenEditTemplate = useCallback((template: Template) => {
    setEditTemplateName(template.name);
    setEditTemplateCategory(template.category);
    setEditTemplateSubject(template.subject);
    setEditTemplateContent(template.content);
    setEditTemplateHeaderImage('');
    setTemplateSuccessMsg('');
    setEditTemplate(template);
  }, []);

  // Handler: save template edits
  const handleSaveTemplate = useCallback(() => {
    if (!editTemplate) return;

    setTemplates((prev) =>
      prev.map((tpl) => {
        if (tpl.id === editTemplate.id) {
          return {
            ...tpl,
            name: editTemplateName,
            category: editTemplateCategory,
            subject: editTemplateSubject,
            content: editTemplateContent,
          };
        }
        return tpl;
      })
    );

    setTemplateSuccessMsg(
      t('admin.newsletter.templates.saveSuccess', 'Template enregistre avec succes !')
    );
    setTimeout(() => {
      setTemplateSuccessMsg('');
      setEditTemplate(null);
    }, 2000);
  }, [
    editTemplate,
    editTemplateName,
    editTemplateCategory,
    editTemplateSubject,
    editTemplateContent,
    t,
  ]);

  // Handler: create new template
  const handleCreateTemplate = useCallback(() => {
    const newId = String(Date.now());
    const newTemplate: Template = {
      id: newId,
      name: t('admin.newsletter.templates.newTemplateName', 'Nouveau Template'),
      category: 'newsletter',
      subject: '',
      content: '',
      timesUsed: 0,
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    handleOpenEditTemplate(newTemplate);
  }, [t, handleOpenEditTemplate]);

  // Handler: delete template
  const handleDeleteTemplate = useCallback(
    (templateId: string) => {
      if (
        window.confirm(
          t(
            'admin.newsletter.templates.confirmDelete',
            'Etes-vous sur de vouloir supprimer ce template ?'
          )
        )
      ) {
        setTemplates((prev) => prev.filter((tpl) => tpl.id !== templateId));
      }
    },
    [t]
  );

  // Handler: segment send campaign -> switch to campaigns tab and open create modal
  const handleSegmentSendCampaign = useCallback(() => {
    setActiveTab('campaigns');
    setIsCreatingCampaign(true);
  }, []);

  const stats = [
    {
      label: t('admin.newsletter.stats.activeSubscribers', 'Abonnes Actifs'),
      value: activeSubscribers,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.newsletter.stats.sentCampaigns', 'Campagnes Envoyees'),
      value: campaigns.filter((c) => c.status === 'sent').length,
      icon: Send,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.newsletter.stats.emailsSent', 'Emails Envoyes'),
      value: totalSent,
      icon: Mail,
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
    {
      label: t('admin.newsletter.stats.avgOpenRate', "Taux d'Ouverture Moyen"),
      value: `${avgOpenRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('admin.newsletter.title', 'Gestion de la Newsletter')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('admin.newsletter.subtitle', "Gerez vos abonnes et creez des campagnes d'emailing")}
          </p>
        </div>
        <button
          onClick={() => {
            setNewCampaignSubject('');
            setNewCampaignContent('');
            setNewCampaignRecipients('all');
            setCampaignSuccessMsg('');
            setIsCreatingCampaign(true);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('admin.newsletter.newCampaign', 'Nouvelle Campagne')}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-cosmos-cream p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-3xl font-light text-cosmos-night mb-1 tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary uppercase tracking-wider font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-cosmos-cream">
        <div className="flex border-b border-cosmos-cream overflow-x-auto">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-4 font-light text-sm transition-colors whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'border-b-2 border-gray-900 text-cosmos-night'
                : 'text-text-secondary hover:text-cosmos-night'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
            {t('admin.newsletter.tabs.subscribers', 'Abonnes')} ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-4 font-light text-sm transition-colors whitespace-nowrap ${
              activeTab === 'campaigns'
                ? 'border-b-2 border-gray-900 text-cosmos-night'
                : 'text-text-secondary hover:text-cosmos-night'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
            {t('admin.newsletter.tabs.campaigns', 'Campagnes')} ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-4 font-light text-sm transition-colors whitespace-nowrap ${
              activeTab === 'templates'
                ? 'border-b-2 border-gray-900 text-cosmos-night'
                : 'text-text-secondary hover:text-cosmos-night'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
            {t('admin.newsletter.tabs.templates', 'Templates')} ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-6 py-4 font-light text-sm transition-colors whitespace-nowrap ${
              activeTab === 'segments'
                ? 'border-b-2 border-gray-900 text-cosmos-night'
                : 'text-text-secondary hover:text-cosmos-night'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
            {t('admin.newsletter.tabs.segments', 'Segments')} ({segments.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-4 font-light text-sm transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-b-2 border-gray-900 text-cosmos-night'
                : 'text-text-secondary hover:text-cosmos-night'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
            {t('admin.newsletter.tabs.analytics', 'Analytics')}
          </button>
        </div>

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="p-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmos-night mx-auto mb-4"></div>
                  <p className="text-text-secondary font-light">
                    {t('common.loading', 'Chargement...')}
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6 font-light">
                {t('admin.newsletter.error', 'Erreur lors du chargement des abonnes')}
              </div>
            )}

            {/* Filters */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('admin.newsletter.searchSubscriber', 'Rechercher un abonne...')}
                    className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="all">
                      {t('admin.newsletter.filter.allStatuses', 'Tous les statuts')}
                    </option>
                    <option value="active">{t('admin.newsletter.filter.active', 'Actifs')}</option>
                    <option value="unsubscribed">
                      {t('admin.newsletter.filter.unsubscribed', 'Desabonnes')}
                    </option>
                  </select>
                  <button className="px-6 py-3 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors">
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Subscribers Table */}
            {!isLoading && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-cosmos-cream">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.table.email', 'Email')}
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.table.name', 'Nom')}
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.table.source', 'Source')}
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.table.subscribedDate', "Date d'inscription")}
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.table.status', 'Statut')}
                      </th>
                      <th className="text-right px-4 py-3 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('common.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="hover:bg-cosmos-cream/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-light text-cosmos-night">{subscriber.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-light text-cosmos-night">
                            {subscriber.name || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-light text-cosmos-night">
                            {subscriber.source}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-light text-cosmos-night">
                            {new Date(subscriber.subscribedDate).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-3 py-1 ${getStatusColor(subscriber.status)} border font-light`}
                          >
                            {getStatusLabel(subscriber.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                              title={t('common.delete', 'Supprimer')}
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="p-6 space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border border-cosmos-cream p-6 hover:border-cosmos-cream transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">
                      {campaign.subject}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 ${getStatusColor(campaign.status)} border font-light`}
                    >
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary font-light mb-4 line-clamp-2">
                  {campaign.content}
                </p>

                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-cosmos-cream/50 border border-cosmos-cream">
                    <div className="text-center">
                      <div className="text-2xl font-light text-cosmos-night">
                        {campaign.recipients}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.campaigns.sent', 'Envoyes')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-cosmos-night">
                        {((campaign.opened / campaign.recipients) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.campaigns.openRate', "Taux d'ouverture")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-cosmos-night">
                        {((campaign.clicked / campaign.recipients) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.campaigns.clickRate', 'Taux de clic')}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-text-secondary font-light">
                  <div className="flex items-center gap-4">
                    {campaign.status === 'sent' && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        {t('admin.newsletter.campaigns.sentOn', 'Envoye le')}{' '}
                        {new Date(campaign.sentDate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    {campaign.status === 'scheduled' && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        {t('admin.newsletter.campaigns.scheduledFor', 'Programme pour le')}{' '}
                        {new Date(campaign.scheduledDate!).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewCampaign(campaign)}
                      className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      {t('common.view', 'Voir')}
                    </button>
                    {campaign.status === 'draft' && (
                      <>
                        <button className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors">
                          <Edit className="w-4 h-4" strokeWidth={1.5} />
                          {t('common.edit', 'Modifier')}
                        </button>
                        <button
                          onClick={() => handleSendCampaign(campaign.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
                        >
                          <Send className="w-4 h-4" strokeWidth={1.5} />
                          {t('admin.newsletter.campaigns.send', 'Envoyer')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                {t('admin.newsletter.templates.library', 'Bibliotheque de Templates')}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex border border-cosmos-cream">
                  <button
                    onClick={() => setTemplateViewMode('list')}
                    className={`p-2 transition-colors ${
                      templateViewMode === 'list'
                        ? 'bg-gray-900 text-white'
                        : 'text-text-secondary hover:bg-cosmos-cream/50'
                    }`}
                    title={t('admin.newsletter.templates.listView', 'Vue liste')}
                  >
                    <List className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setTemplateViewMode('grid')}
                    className={`p-2 transition-colors ${
                      templateViewMode === 'grid'
                        ? 'bg-gray-900 text-white'
                        : 'text-text-secondary hover:bg-cosmos-cream/50'
                    }`}
                    title={t('admin.newsletter.templates.gridView', 'Vue grille')}
                  >
                    <Grid className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
                <button
                  onClick={handleCreateTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  {t('admin.newsletter.templates.newTemplate', 'Nouveau Template')}
                </button>
              </div>
            </div>

            {/* List View */}
            {templateViewMode === 'list' && (
              <div className="overflow-x-auto border border-cosmos-cream">
                <table className="w-full">
                  <thead className="border-b border-cosmos-cream">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.templates.name', 'Nom')}
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.templates.category', 'Categorie')}
                      </th>
                      <th className="text-center px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.templates.usages', 'Utilisations')}
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.templates.lastUsed', 'Derniere utilisation')}
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                        {t('common.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {templates.map((template) => (
                      <tr key={template.id} className="hover:bg-cosmos-cream/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-light text-cosmos-night">{template.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-3 py-1 border font-light ${
                              template.category === 'promotional'
                                ? 'text-cosmos-gold bg-cosmos-gold/5 border-purple-200'
                                : template.category === 'newsletter'
                                  ? 'text-cosmos-night bg-cosmos-gold/10 border-blue-200'
                                  : template.category === 'event'
                                    ? 'text-amber-600 bg-amber-50 border-orange-200'
                                    : 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream'
                            }`}
                          >
                            {template.category === 'promotional'
                              ? t('admin.newsletter.templates.promotional', 'Promotionnel')
                              : template.category === 'newsletter'
                                ? t('admin.newsletter.templates.newsletterCat', 'Newsletter')
                                : template.category === 'event'
                                  ? t('admin.newsletter.templates.event', 'Evenement')
                                  : t('admin.newsletter.templates.transactional', 'Transactionnel')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm font-light text-cosmos-night">
                            {template.timesUsed}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-light text-cosmos-night">
                            {template.lastUsed
                              ? new Date(template.lastUsed).toLocaleDateString('fr-FR')
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewTemplate(template)}
                              className="p-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night transition-colors"
                              title={t('common.view', 'Voir')}
                            >
                              <Eye className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              className="p-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night transition-colors"
                              title={t('admin.newsletter.templates.use', 'Utiliser')}
                            >
                              <Copy className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleOpenEditTemplate(template)}
                              className="p-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night transition-colors"
                              title={t('common.edit', 'Modifier')}
                            >
                              <Edit className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                              title={t('common.delete', 'Supprimer')}
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {templateViewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-cosmos-cream p-6 hover:border-cosmos-cream transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-light text-cosmos-night mb-2 tracking-tight">
                          {template.name}
                        </h4>
                        <span
                          className={`text-xs px-3 py-1 border font-light ${
                            template.category === 'promotional'
                              ? 'text-cosmos-gold bg-cosmos-gold/5 border-purple-200'
                              : template.category === 'newsletter'
                                ? 'text-cosmos-night bg-cosmos-gold/10 border-blue-200'
                                : template.category === 'event'
                                  ? 'text-amber-600 bg-amber-50 border-orange-200'
                                  : 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream'
                          }`}
                        >
                          {template.category === 'promotional'
                            ? t('admin.newsletter.templates.promotional', 'Promotionnel')
                            : template.category === 'newsletter'
                              ? t('admin.newsletter.templates.newsletterCat', 'Newsletter')
                              : template.category === 'event'
                                ? t('admin.newsletter.templates.event', 'Evenement')
                                : t('admin.newsletter.templates.transactional', 'Transactionnel')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-secondary font-light mb-4 pt-4 border-t border-cosmos-cream">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        {template.timesUsed}{' '}
                        {t('admin.newsletter.templates.usages', 'utilisations')}
                      </div>
                      {template.lastUsed && (
                        <div>{new Date(template.lastUsed).toLocaleDateString('fr-FR')}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewTemplate(template)}
                        className="flex items-center gap-2 px-3 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors flex-1 justify-center"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                        {t('common.view', 'Voir')}
                      </button>
                      <button
                        onClick={() => handleOpenEditTemplate(template)}
                        className="p-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night transition-colors"
                      >
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === 'segments' && (
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                {t('admin.newsletter.segments.title', 'Segmentation des Abonnes')}
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors">
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                {t('admin.newsletter.segments.newSegment', 'Nouveau Segment')}
              </button>
            </div>

            <div className="space-y-4">
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className="border border-cosmos-cream p-6 hover:border-cosmos-cream transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-light text-cosmos-night mb-1 tracking-tight">
                        {segment.name}
                      </h4>
                      <p className="text-sm text-text-secondary font-light mb-2">
                        {segment.description}
                      </p>
                    </div>
                    <div className="text-center ml-4">
                      <div className="text-2xl font-light text-cosmos-night">
                        {segment.subscribers}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.segments.subscribers', 'abonnes')}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-cosmos-cream/50 border border-cosmos-cream mb-4">
                    <div className="text-xs text-text-secondary font-light mb-1">
                      {t('admin.newsletter.segments.criteria', 'Criteres')} :
                    </div>
                    <div className="text-sm font-light text-cosmos-night">{segment.criteria}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-text-secondary font-light">
                      {t('admin.newsletter.segments.createdOn', 'Cree le')}{' '}
                      {new Date(segment.createdDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSegmentSendCampaign}
                        className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                      >
                        <Send className="w-4 h-4" strokeWidth={1.5} />
                        {t('admin.newsletter.segments.sendCampaign', 'Envoyer Campagne')}
                      </button>
                      <button className="p-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night transition-colors">
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-light text-cosmos-night tracking-tight">
              {t('admin.newsletter.analytics.title', 'Performances des Campagnes')}
            </h3>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-cosmos-cream p-6">
                <div className="text-sm text-text-secondary font-light mb-2">
                  {t('admin.newsletter.analytics.avgOpenRate', "Taux d'ouverture moyen")}
                </div>
                <div className="text-3xl font-light text-cosmos-night mb-1">
                  {avgOpenRate.toFixed(1)}%
                </div>
                <div className="text-xs text-emerald-600 font-light">
                  {t('admin.newsletter.analytics.vsLastMonth', '+2.3% vs mois dernier')}
                </div>
              </div>
              <div className="border border-cosmos-cream p-6">
                <div className="text-sm text-text-secondary font-light mb-2">
                  {t('admin.newsletter.analytics.avgClickRate', 'Taux de clic moyen')}
                </div>
                <div className="text-3xl font-light text-cosmos-night mb-1">
                  {campaigns.filter((c) => c.status === 'sent').length > 0
                    ? (
                        campaigns
                          .filter((c) => c.status === 'sent')
                          .reduce((sum, c) => sum + (c.clicked / c.recipients) * 100, 0) /
                        campaigns.filter((c) => c.status === 'sent').length
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-xs text-emerald-600 font-light">
                  {t('admin.newsletter.analytics.clickVsLastMonth', '+1.8% vs mois dernier')}
                </div>
              </div>
              <div className="border border-cosmos-cream p-6">
                <div className="text-sm text-text-secondary font-light mb-2">
                  {t('admin.newsletter.analytics.unsubscribeRate', 'Taux de desabonnement')}
                </div>
                <div className="text-3xl font-light text-cosmos-night mb-1">
                  {subscribers.length > 0
                    ? (
                        (subscribers.filter((s) => s.status === 'unsubscribed').length /
                          subscribers.length) *
                        100
                      ).toFixed(1)
                    : '0.0'}
                  %
                </div>
                <div className="text-xs text-red-600 font-light">
                  {t('admin.newsletter.analytics.unsubVsLastMonth', '+0.5% vs mois dernier')}
                </div>
              </div>
            </div>

            {/* Campaign Performance Table */}
            <div>
              <h4 className="text-base font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.newsletter.analytics.performanceByCampaign', 'Performances par Campagne')}
              </h4>
              <div className="overflow-x-auto border border-cosmos-cream">
                <table className="w-full">
                  <thead className="bg-cosmos-cream/50 border-b border-cosmos-cream">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.analytics.campaign', 'Campagne')}
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.campaigns.sent', 'Envoyes')}
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.campaigns.openRate', "Taux d'ouverture")}
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.campaigns.clickRate', 'Taux de clic')}
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-light text-text-secondary uppercase tracking-wider">
                        {t('admin.newsletter.analytics.date', 'Date')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {campaigns
                      .filter((c) => c.status === 'sent')
                      .map((campaign) => {
                        const openRate = ((campaign.opened / campaign.recipients) * 100).toFixed(1);
                        const clickRate = ((campaign.clicked / campaign.recipients) * 100).toFixed(
                          1
                        );
                        return (
                          <tr
                            key={campaign.id}
                            className="hover:bg-cosmos-cream/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-light text-cosmos-night">
                              {campaign.subject}
                            </td>
                            <td className="px-4 py-3 text-sm font-light text-cosmos-night text-center">
                              {campaign.recipients}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`text-sm font-light ${
                                  parseFloat(openRate) >= 70
                                    ? 'text-emerald-600'
                                    : parseFloat(openRate) >= 50
                                      ? 'text-amber-600'
                                      : 'text-red-600'
                                }`}
                              >
                                {openRate}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`text-sm font-light ${
                                  parseFloat(clickRate) >= 30
                                    ? 'text-emerald-600'
                                    : parseFloat(clickRate) >= 15
                                      ? 'text-amber-600'
                                      : 'text-red-600'
                                }`}
                              >
                                {clickRate}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-light text-text-secondary text-center">
                              {new Date(campaign.sentDate).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Performing Campaigns */}
            <div>
              <h4 className="text-base font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.newsletter.analytics.bestCampaigns', 'Meilleures Campagnes')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns
                  .filter((c) => c.status === 'sent')
                  .sort((a, b) => b.opened / b.recipients - a.opened / a.recipients)
                  .slice(0, 3)
                  .map((campaign, index) => (
                    <div key={campaign.id} className="border border-cosmos-cream p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 flex items-center justify-center text-white font-light ${
                            index === 0
                              ? 'bg-yellow-500'
                              : index === 1
                                ? 'bg-gray-400'
                                : 'bg-orange-400'
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-light text-cosmos-night">
                            {campaign.subject}
                          </div>
                          <div className="text-xs text-text-secondary font-light">
                            {new Date(campaign.sentDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-cosmos-cream">
                        <div>
                          <div className="text-xs text-text-secondary font-light">
                            {t('admin.newsletter.campaigns.openRate', "Taux d'ouverture")}
                          </div>
                          <div className="text-lg font-light text-cosmos-night">
                            {((campaign.opened / campaign.recipients) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-secondary font-light">
                            {t('admin.newsletter.campaigns.clickRate', 'Taux de clic')}
                          </div>
                          <div className="text-lg font-light text-cosmos-night">
                            {((campaign.clicked / campaign.recipients) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Campaign Modal */}
      {viewCampaign && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewCampaign(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.newsletter.campaigns.detail', 'Details de la Campagne')}
                </h2>
                <button
                  onClick={() => setViewCampaign(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-light text-cosmos-night tracking-tight">
                      {viewCampaign.subject}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 ${getStatusColor(viewCampaign.status)} border font-light`}
                    >
                      {getStatusLabel(viewCampaign.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.newsletter.campaigns.content', 'Contenu')}
                  </h4>
                  <div className="p-4 bg-cosmos-cream/50 border border-cosmos-cream">
                    <p className="font-light text-cosmos-night leading-relaxed">
                      {viewCampaign.content}
                    </p>
                  </div>
                </div>

                {viewCampaign.status === 'sent' && (
                  <div className="grid grid-cols-3 gap-4 p-4 border border-cosmos-cream">
                    <div className="text-center">
                      <div className="text-2xl font-light text-cosmos-night mb-1">
                        {viewCampaign.recipients}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.campaigns.recipients', 'Destinataires')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-cosmos-night mb-1">
                        {viewCampaign.opened}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.campaigns.opens', 'Ouvertures')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-cosmos-night mb-1">
                        {viewCampaign.clicked}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.newsletter.campaigns.clicks', 'Clics')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Campaign Modal */}
      {isCreatingCampaign && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCreatingCampaign(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.newsletter.newCampaign', 'Nouvelle Campagne')}
                </h2>
                <button
                  onClick={() => setIsCreatingCampaign(false)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Success Message */}
                {campaignSuccessMsg && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-green-200 text-emerald-600 px-4 py-3 font-light">
                    <CheckCircle className="w-5 h-5" strokeWidth={1.5} />
                    {campaignSuccessMsg}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.newsletter.campaigns.emailSubject', "Sujet de l'email")}
                  </label>
                  <input
                    type="text"
                    value={newCampaignSubject}
                    onChange={(e) => setNewCampaignSubject(e.target.value)}
                    placeholder={t('admin.newsletter.campaigns.enterSubject', 'Entrez le sujet...')}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.newsletter.campaigns.content', 'Contenu')}
                  </label>
                  <textarea
                    rows={8}
                    value={newCampaignContent}
                    onChange={(e) => setNewCampaignContent(e.target.value)}
                    placeholder={t(
                      'admin.newsletter.campaigns.writeMessage',
                      'Redigez votre message...'
                    )}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.newsletter.campaigns.recipients', 'Destinataires')}
                  </label>
                  <select
                    value={newCampaignRecipients}
                    onChange={(e) => setNewCampaignRecipients(e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="all">
                      {t('admin.newsletter.campaigns.allActive', 'Tous les abonnes actifs')} (
                      {activeSubscribers})
                    </option>
                    <option value="recent">
                      {t(
                        'admin.newsletter.campaigns.newSubscribers',
                        'Nouveaux abonnes (30 jours)'
                      )}
                    </option>
                    <option value="custom">
                      {t('admin.newsletter.campaigns.customList', 'Liste personnalisee')}
                    </option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                  <button
                    onClick={() => setIsCreatingCampaign(false)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={() => handleCreateCampaign(false)}
                    disabled={!newCampaignSubject.trim() || !newCampaignContent.trim()}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('admin.newsletter.campaigns.saveAsDraft', 'Enregistrer comme brouillon')}
                  </button>
                  <button
                    onClick={() => handleCreateCampaign(true)}
                    disabled={!newCampaignSubject.trim() || !newCampaignContent.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                    {t('admin.newsletter.campaigns.sendNow', 'Envoyer Maintenant')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Template Modal */}
      {viewTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewTemplate(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.newsletter.templates.detail', 'Details du Template')}
                </h2>
                <button
                  onClick={() => setViewTemplate(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-light text-cosmos-night tracking-tight">
                      {viewTemplate.name}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 border font-light ${
                        viewTemplate.category === 'promotional'
                          ? 'text-cosmos-gold bg-cosmos-gold/5 border-purple-200'
                          : viewTemplate.category === 'newsletter'
                            ? 'text-cosmos-night bg-cosmos-gold/10 border-blue-200'
                            : viewTemplate.category === 'event'
                              ? 'text-amber-600 bg-amber-50 border-orange-200'
                              : 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream'
                      }`}
                    >
                      {viewTemplate.category === 'promotional'
                        ? t('admin.newsletter.templates.promotional', 'Promotionnel')
                        : viewTemplate.category === 'newsletter'
                          ? t('admin.newsletter.templates.newsletterCat', 'Newsletter')
                          : viewTemplate.category === 'event'
                            ? t('admin.newsletter.templates.event', 'Evenement')
                            : t('admin.newsletter.templates.transactional', 'Transactionnel')}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.newsletter.templates.subject', 'Sujet')}
                  </h4>
                  <div className="p-4 bg-cosmos-cream/50 border border-cosmos-cream">
                    <p className="font-light text-cosmos-night">{viewTemplate.subject}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.newsletter.campaigns.content', 'Contenu')}
                  </h4>
                  <div className="p-4 bg-cosmos-cream/50 border border-cosmos-cream">
                    <p className="font-light text-cosmos-night whitespace-pre-line leading-relaxed">
                      {viewTemplate.content}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 border border-cosmos-cream">
                  <div className="text-center">
                    <div className="text-2xl font-light text-cosmos-night mb-1">
                      {viewTemplate.timesUsed}
                    </div>
                    <div className="text-xs text-text-secondary font-light">
                      {t('admin.newsletter.templates.usages', 'Utilisations')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-light text-cosmos-night mb-1">
                      {viewTemplate.lastUsed
                        ? new Date(viewTemplate.lastUsed).toLocaleDateString('fr-FR')
                        : t('admin.newsletter.templates.never', 'Jamais')}
                    </div>
                    <div className="text-xs text-text-secondary font-light">
                      {t('admin.newsletter.templates.lastUsed', 'Derniere utilisation')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                  <button
                    onClick={() => setViewTemplate(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.close', 'Fermer')}
                  </button>
                  <button
                    onClick={() => {
                      handleOpenEditTemplate(viewTemplate);
                      setViewTemplate(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
                  >
                    <Edit className="w-4 h-4" strokeWidth={1.5} />
                    {t('common.edit', 'Modifier')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Template Modal */}
      {editTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setEditTemplate(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.newsletter.templates.editTemplate', 'Modifier le Template')}
                </h2>
                <button
                  onClick={() => setEditTemplate(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6">
                {/* Success Message */}
                {templateSuccessMsg && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-green-200 text-emerald-600 px-4 py-3 mb-6 font-light">
                    <CheckCircle className="w-5 h-5" strokeWidth={1.5} />
                    {templateSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-6">
                  {/* Left Column - Form */}
                  <div className="col-span-2 space-y-6">
                    {/* Informations generales */}
                    <div className="border border-cosmos-cream p-6">
                      <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                        {t('admin.newsletter.templates.generalInfo', 'Informations generales')}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.templateName', 'Nom du template')}
                          </label>
                          <input
                            type="text"
                            value={editTemplateName}
                            onChange={(e) => setEditTemplateName(e.target.value)}
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-cosmos-night font-light mb-2">
                              {t('admin.newsletter.templates.category', 'Categorie')}
                            </label>
                            <select
                              value={editTemplateCategory}
                              onChange={(e) =>
                                setEditTemplateCategory(e.target.value as Template['category'])
                              }
                              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                            >
                              <option value="promotional">
                                {t('admin.newsletter.templates.promotional', 'Promotionnel')}
                              </option>
                              <option value="newsletter">
                                {t('admin.newsletter.templates.newsletterCat', 'Newsletter')}
                              </option>
                              <option value="event">
                                {t('admin.newsletter.templates.event', 'Evenement')}
                              </option>
                              <option value="transactional">
                                {t('admin.newsletter.templates.transactional', 'Transactionnel')}
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-cosmos-night font-light mb-2">
                              {t('admin.newsletter.templates.language', 'Langue')}
                            </label>
                            <select className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light">
                              <option value="fr">
                                {t('admin.newsletter.templates.french', 'Francais')}
                              </option>
                              <option value="en">
                                {t('admin.newsletter.templates.english', 'Anglais')}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.campaigns.emailSubject', "Sujet de l'email")}
                          </label>
                          <input
                            type="text"
                            value={editTemplateSubject}
                            onChange={(e) => setEditTemplateSubject(e.target.value)}
                            placeholder="Ex: Cosmos Angre - Newsletter [Mois]"
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t(
                              'admin.newsletter.templates.previewText',
                              'Previsualisation (Texte court)'
                            )}
                          </label>
                          <input
                            type="text"
                            placeholder={t(
                              'admin.newsletter.templates.previewTextPlaceholder',
                              "Texte affiche avant l'ouverture de l'email..."
                            )}
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                          />
                        </div>
                      </div>
                    </div>

                    {/* En-tete */}
                    <div className="border border-cosmos-cream p-6">
                      <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                        {t('admin.newsletter.templates.header', 'En-tete')}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.headerImage', "Logo / Image d'en-tete")}
                          </label>
                          <input
                            ref={headerFileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleHeaderUpload}
                            className="hidden"
                          />
                          {editTemplateHeaderImage ? (
                            <div className="relative group">
                              <img
                                src={editTemplateHeaderImage}
                                alt=""
                                className="w-full h-40 object-cover border border-cosmos-cream"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                  onClick={() => headerFileRef.current?.click()}
                                  className="px-3 py-2 bg-white text-cosmos-night text-sm font-light flex items-center gap-2"
                                >
                                  <Upload className="w-4 h-4" strokeWidth={1.5} />
                                  {t('admin.newsletter.templates.replace', 'Remplacer')}
                                </button>
                                <button
                                  onClick={() => setEditTemplateHeaderImage('')}
                                  className="px-3 py-2 bg-red-600 text-white text-sm font-light flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                  {t('common.delete', 'Supprimer')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => headerFileRef.current?.click()}
                              disabled={uploadingHeader}
                              className="w-full border-2 border-dashed border-cosmos-cream p-8 text-center hover:border-cosmos-gold transition-colors cursor-pointer disabled:opacity-60"
                            >
                              {uploadingHeader ? (
                                <Loader2
                                  className="w-8 h-8 text-cosmos-gold mx-auto mb-2 animate-spin"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                <Image
                                  className="w-8 h-8 text-text-secondary mx-auto mb-2"
                                  strokeWidth={1.5}
                                />
                              )}
                              <p className="text-sm text-text-secondary font-light mb-1">
                                {uploadingHeader
                                  ? t('admin.newsletter.templates.uploading', 'Téléversement…')
                                  : t(
                                      'admin.newsletter.templates.clickToAddImage',
                                      'Cliquez pour ajouter une image'
                                    )}
                              </p>
                              <p className="text-xs text-text-secondary font-light">
                                {t('admin.newsletter.templates.imageFormats', "PNG, JPG jusqu'a 2MB")}
                              </p>
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.mainTitle', 'Titre principal')}
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Cosmos Angre - Votre centre commercial"
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Corps du message */}
                    <div className="border border-cosmos-cream p-6">
                      <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                        {t('admin.newsletter.templates.messageBody', 'Corps du message')}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.introMessage', "Message d'introduction")}
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Bonjour [Prenom], Nous sommes ravis de..."
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm text-cosmos-night font-light">
                              {t('admin.newsletter.templates.mainContent', 'Contenu principal')}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                ref={contentFileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleContentImageUpload}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => contentFileRef.current?.click()}
                                disabled={uploadingContentImg}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-cosmos-cream hover:border-cosmos-gold text-cosmos-night text-xs font-light transition-colors disabled:opacity-60"
                              >
                                {uploadingContentImg ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                                ) : (
                                  <Image className="w-3.5 h-3.5" strokeWidth={1.5} />
                                )}
                                {uploadingContentImg
                                  ? t('admin.newsletter.templates.uploading', 'Téléversement…')
                                  : t('admin.newsletter.templates.insertImage', 'Insérer une image')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowTemplatePreview(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-cosmos-cream hover:border-cosmos-gold text-cosmos-night text-xs font-light transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {t('admin.newsletter.templates.preview', 'Aperçu')}
                              </button>
                            </div>
                          </div>
                          <textarea
                            ref={contentTextareaRef}
                            rows={10}
                            value={editTemplateContent}
                            onChange={(e) => setEditTemplateContent(e.target.value)}
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-mono text-sm resize-y"
                          />
                          <p className="text-xs text-text-secondary font-light mt-1.5">
                            {t(
                              'admin.newsletter.templates.htmlHint',
                              'Vous pouvez utiliser du HTML simple (titres, gras, listes) et insérer des images.'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bouton d'action (CTA) */}
                    <div className="border border-cosmos-cream p-6">
                      <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                        {t('admin.newsletter.templates.ctaButton', "Bouton d'action (CTA)")}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-cosmos-night font-light mb-2">
                              {t('admin.newsletter.templates.buttonText', 'Texte du bouton')}
                            </label>
                            <input
                              type="text"
                              placeholder={t(
                                'admin.newsletter.templates.buttonTextPlaceholder',
                                'Ex: Decouvrir les offres'
                              )}
                              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-cosmos-night font-light mb-2">
                              {t('admin.newsletter.templates.linkUrl', 'Lien URL')}
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-cosmos-night font-light mb-2">
                              {t('admin.newsletter.templates.buttonColor', 'Couleur du bouton')}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                defaultValue="#000000"
                                className="w-12 h-10 border border-cosmos-cream cursor-pointer"
                              />
                              <input
                                type="text"
                                defaultValue="#000000"
                                className="flex-1 px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-cosmos-night font-light mb-2">
                              {t('admin.newsletter.templates.style', 'Style')}
                            </label>
                            <select className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light">
                              <option value="solid">
                                {t('admin.newsletter.templates.solid', 'Plein')}
                              </option>
                              <option value="outline">
                                {t('admin.newsletter.templates.outline', 'Contour')}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sections supplementaires */}
                    <div className="border border-cosmos-cream p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                          {t(
                            'admin.newsletter.templates.additionalSections',
                            'Sections supplementaires'
                          )}
                        </h3>
                        <button className="flex items-center gap-2 px-3 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors text-sm">
                          <Plus className="w-4 h-4" strokeWidth={1.5} />
                          {t('admin.newsletter.templates.addSection', 'Ajouter une section')}
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="p-4 border border-cosmos-cream bg-cosmos-cream/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <AlignLeft
                                className="w-4 h-4 text-text-secondary"
                                strokeWidth={1.5}
                              />
                              <span className="text-sm font-light text-cosmos-night">
                                {t(
                                  'admin.newsletter.templates.section1News',
                                  'Section 1: Actualites'
                                )}
                              </span>
                            </div>
                            <button className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            placeholder={t(
                              'admin.newsletter.templates.sectionContentPlaceholder',
                              'Contenu de la section...'
                            )}
                            className="w-full px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pied de page */}
                    <div className="border border-cosmos-cream p-6">
                      <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                        {t('admin.newsletter.templates.footer', 'Pied de page')}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.contactInfo', 'Informations de contact')}
                          </label>
                          <textarea
                            rows={3}
                            placeholder={t(
                              'admin.newsletter.templates.contactInfoPlaceholder',
                              'Adresse, telephone, email...'
                            )}
                            defaultValue="Cosmos Angre, Abidjan, Cote d'Ivoire&#10;Tel: +225 XX XX XX XX XX&#10;Email: contact@cosmos-angre.ci"
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.socialLinks', 'Liens reseaux sociaux')}
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="url"
                              placeholder="Facebook URL"
                              className="px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                            />
                            <input
                              type="url"
                              placeholder="Instagram URL"
                              className="px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                            />
                            <input
                              type="url"
                              placeholder="Twitter URL"
                              className="px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                            />
                            <input
                              type="url"
                              placeholder="LinkedIn URL"
                              className="px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-cosmos-night font-light mb-2">
                            {t('admin.newsletter.templates.legalNotice', 'Mentions legales')}
                          </label>
                          <textarea
                            rows={2}
                            placeholder={t(
                              'admin.newsletter.templates.legalNoticePlaceholder',
                              'Vous recevez cet email car...'
                            )}
                            className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Preview & Help */}
                  <div className="col-span-1 space-y-6">
                    {/* Variables disponibles */}
                    <div className="border border-cosmos-cream p-4 bg-cosmos-gold/10 sticky top-0">
                      <h4 className="text-sm font-light text-cosmos-night mb-3 flex items-center gap-2">
                        <Type className="w-4 h-4" strokeWidth={1.5} />
                        {t(
                          'admin.newsletter.templates.availableVariables',
                          'Variables disponibles'
                        )}
                      </h4>
                      <div className="space-y-2 text-xs font-light text-cosmos-night">
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Prenom]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varFirstName', 'Prenom')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Nom]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varLastName', 'Nom')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Email]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varEmail', 'Email')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Date]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varDate', 'Date')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Heure]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varTime', 'Heure')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Lieu]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varLocation', 'Lieu')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Pourcentage]</code>
                          <span className="text-text-secondary">%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white border border-cosmos-cream">
                          <code>[Montant]</code>
                          <span className="text-text-secondary">
                            {t('admin.newsletter.templates.varPrice', 'Prix')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conseils */}
                    <div className="border border-cosmos-cream p-4 bg-amber-50">
                      <h4 className="text-sm font-light text-cosmos-night mb-3">
                        {t('admin.newsletter.templates.tips', 'Conseils')}
                      </h4>
                      <ul className="space-y-2 text-xs font-light text-cosmos-night">
                        <li>
                          {t('admin.newsletter.templates.tip1', '- Sujet court et accrocheur')}
                        </li>
                        <li>
                          {t(
                            'admin.newsletter.templates.tip2',
                            '- Personnalisez avec des variables'
                          )}
                        </li>
                        <li>
                          {t('admin.newsletter.templates.tip3', '- Un seul CTA clair par email')}
                        </li>
                        <li>
                          {t('admin.newsletter.templates.tip4', '- Images optimisees (max 500Ko)')}
                        </li>
                        <li>{t('admin.newsletter.templates.tip5', '- Testez sur mobile')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-cosmos-cream">
                  <button
                    onClick={() => setShowTemplatePreview(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-cosmos-gold text-cosmos-night font-light transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                    {t('admin.newsletter.templates.previewBtn', 'Prévisualiser')}
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditTemplate(null)}
                      className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                    >
                      {t('common.cancel', 'Annuler')}
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                    >
                      {t('admin.newsletter.campaigns.saveAsDraft', 'Enregistrer comme brouillon')}
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                      {t('common.save', 'Enregistrer')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Premium Email Preview Modal */}
      {showTemplatePreview && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setShowTemplatePreview(false)}
          ></div>
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-cosmos-cream/30 backdrop-blur border border-cosmos-cream max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl">
              <div className="p-5 border-b border-cosmos-cream flex items-center justify-between bg-white">
                <div>
                  <h2 className="text-xl font-light text-cosmos-night tracking-tight">
                    {t('admin.newsletter.templates.previewTitle', 'Aperçu de l’email')}
                  </h2>
                  <p className="text-xs text-text-secondary font-light mt-0.5">
                    {t('admin.newsletter.templates.subject', 'Sujet')} :{' '}
                    <span className="text-cosmos-night">
                      {editTemplateSubject ||
                        t('admin.newsletter.templates.noSubject', '(Sans sujet)')}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex border border-cosmos-cream">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-2 transition-colors ${
                        previewDevice === 'desktop'
                          ? 'bg-cosmos-night text-white'
                          : 'text-text-secondary hover:bg-cosmos-cream/50'
                      }`}
                      title={t('admin.newsletter.templates.desktop', 'Ordinateur')}
                    >
                      <Monitor className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-2 transition-colors ${
                        previewDevice === 'mobile'
                          ? 'bg-cosmos-night text-white'
                          : 'text-text-secondary hover:bg-cosmos-cream/50'
                      }`}
                      title={t('admin.newsletter.templates.mobile', 'Mobile')}
                    >
                      <Smartphone className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowTemplatePreview(false)}
                    className="text-text-secondary hover:text-cosmos-night"
                  >
                    <XCircle className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-[#EDE4D3]">
                <iframe
                  title="email-preview"
                  srcDoc={buildEmailPreview()}
                  className="bg-white border border-cosmos-cream shadow-lg transition-all duration-300"
                  style={{
                    width: previewDevice === 'mobile' ? 375 : 600,
                    height: '100%',
                    minHeight: 600,
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsletterManagement;
