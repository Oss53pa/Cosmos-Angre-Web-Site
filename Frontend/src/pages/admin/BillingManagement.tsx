import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Search,
  Download,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

interface Invoice {
  id: string;
  storeId: string;
  storeName: string;
  owner: string;
  plan: 'Free' | 'Gold' | 'Platinum';
  amount: number;
  period: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: string;
}

const initialInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    storeId: '1',
    storeName: 'Nike Store',
    owner: 'Jean Kouassi',
    plan: 'Platinum',
    amount: 150000,
    period: '2024-11',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    status: 'paid',
    paymentDate: '2024-11-05',
    paymentMethod: 'Orange Money',
  },
  {
    id: 'INV-2024-002',
    storeId: '2',
    storeName: 'Zara Fashion',
    owner: 'Marie Diabate',
    plan: 'Gold',
    amount: 75000,
    period: '2024-11',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    status: 'paid',
    paymentDate: '2024-11-08',
    paymentMethod: 'MTN Mobile Money',
  },
  {
    id: 'INV-2024-003',
    storeId: '4',
    storeName: 'Beauty Corner',
    owner: 'Aya Toure',
    plan: 'Gold',
    amount: 75000,
    period: '2024-11',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    status: 'pending',
  },
  {
    id: 'INV-2024-004',
    storeId: '7',
    storeName: 'Tech Paradise',
    owner: 'Yao Koffi',
    plan: 'Free',
    amount: 0,
    period: '2024-11',
    issueDate: '2024-11-01',
    dueDate: '2024-11-30',
    status: 'paid',
    paymentDate: '2024-11-01',
    paymentMethod: 'Free',
  },
  {
    id: 'INV-2024-005',
    storeId: '8',
    storeName: 'Boutique Elegance',
    owner: 'Amina Soro',
    plan: 'Platinum',
    amount: 150000,
    period: '2024-11',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    status: 'paid',
    paymentDate: '2024-11-10',
    paymentMethod: 'Moov Money',
  },
  {
    id: 'INV-2024-006',
    storeId: '9',
    storeName: 'Sports Arena',
    owner: 'Sekou Traore',
    plan: 'Gold',
    amount: 75000,
    period: '2024-11',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    status: 'paid',
    paymentDate: '2024-11-07',
    paymentMethod: 'Orange Money',
  },
  {
    id: 'INV-2024-007',
    storeId: '1',
    storeName: 'Nike Store',
    owner: 'Jean Kouassi',
    plan: 'Platinum',
    amount: 150000,
    period: '2024-10',
    issueDate: '2024-10-01',
    dueDate: '2024-10-15',
    status: 'paid',
    paymentDate: '2024-10-05',
    paymentMethod: 'Orange Money',
  },
  {
    id: 'INV-2024-008',
    storeId: '2',
    storeName: 'Zara Fashion',
    owner: 'Marie Diabate',
    plan: 'Gold',
    amount: 75000,
    period: '2024-10',
    issueDate: '2024-10-01',
    dueDate: '2024-10-15',
    status: 'paid',
    paymentDate: '2024-10-08',
    paymentMethod: 'MTN Mobile Money',
  },
  {
    id: 'INV-2024-009',
    storeId: '10',
    storeName: 'Librairie Moderne',
    owner: 'Ibrahim Bamba',
    plan: 'Gold',
    amount: 75000,
    period: '2024-10',
    issueDate: '2024-10-01',
    dueDate: '2024-10-15',
    status: 'overdue',
  },
  {
    id: 'INV-2024-010',
    storeId: '4',
    storeName: 'Beauty Corner',
    owner: 'Aya Toure',
    plan: 'Gold',
    amount: 75000,
    period: '2024-10',
    issueDate: '2024-10-01',
    dueDate: '2024-10-15',
    status: 'paid',
    paymentDate: '2024-10-12',
    paymentMethod: 'MTN Mobile Money',
  },
  {
    id: 'INV-2024-011',
    storeId: '1',
    storeName: 'Nike Store',
    owner: 'Jean Kouassi',
    plan: 'Platinum',
    amount: 150000,
    period: '2024-09',
    issueDate: '2024-09-01',
    dueDate: '2024-09-15',
    status: 'paid',
    paymentDate: '2024-09-06',
    paymentMethod: 'Orange Money',
  },
  {
    id: 'INV-2024-012',
    storeId: '2',
    storeName: 'Zara Fashion',
    owner: 'Marie Diabate',
    plan: 'Gold',
    amount: 75000,
    period: '2024-09',
    issueDate: '2024-09-01',
    dueDate: '2024-09-15',
    status: 'paid',
    paymentDate: '2024-09-10',
    paymentMethod: 'MTN Mobile Money',
  },
  {
    id: 'INV-2024-013',
    storeId: '8',
    storeName: 'Boutique Elegance',
    owner: 'Amina Soro',
    plan: 'Platinum',
    amount: 150000,
    period: '2024-09',
    issueDate: '2024-09-01',
    dueDate: '2024-09-15',
    status: 'paid',
    paymentDate: '2024-09-08',
    paymentMethod: 'Orange Money',
  },
  {
    id: 'INV-2024-014',
    storeId: '11',
    storeName: 'Cafe Gourmet',
    owner: 'Fatou Kone',
    plan: 'Free',
    amount: 0,
    period: '2024-09',
    issueDate: '2024-09-01',
    dueDate: '2024-09-30',
    status: 'paid',
    paymentDate: '2024-09-01',
    paymentMethod: 'Free',
  },
  {
    id: 'INV-2024-015',
    storeId: '12',
    storeName: 'Joaillerie Prestige',
    owner: 'Nadege Coulibaly',
    plan: 'Platinum',
    amount: 150000,
    period: '2024-09',
    issueDate: '2024-09-01',
    dueDate: '2024-09-15',
    status: 'paid',
    paymentDate: '2024-09-07',
    paymentMethod: 'Moov Money',
  },
];

// Helper to format period string for display
function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
}

const BillingManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [actionFeedback, setActionFeedback] = useState<{
    id: string;
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [reminderFeedback, setReminderFeedback] = useState<{ id: string; message: string } | null>(
    null
  );

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  useEffect(() => {
    if (reminderFeedback) {
      const timer = setTimeout(() => setReminderFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [reminderFeedback]);

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const updated: Invoice = { ...inv, status: newStatus };
          if (newStatus === 'paid') {
            updated.paymentDate = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return inv;
      })
    );
    setActionFeedback({
      id: invoiceId,
      type: 'success',
      message: t('admin.billing.statusUpdated', 'Status updated successfully'),
    });
    // Also update the modal view if open
    if (viewInvoice && viewInvoice.id === invoiceId) {
      const updated = { ...viewInvoice, status: newStatus } as Invoice;
      if (newStatus === 'paid') {
        updated.paymentDate = new Date().toISOString().split('T')[0];
      }
      setViewInvoice(updated);
    }
  };

  const handleSendReminder = (invoiceId: string) => {
    setReminderFeedback({
      id: invoiceId,
      message: t('admin.billing.reminderSent', 'Reminder sent'),
    });
  };

  const handleExportCSV = () => {
    const headers = [
      t('admin.billing.table.invoiceNumber', 'Invoice #'),
      t('admin.billing.table.store', 'Store'),
      t('admin.billing.detail.owner', 'Owner'),
      t('admin.billing.table.plan', 'Plan'),
      t('admin.billing.table.period', 'Period'),
      t('admin.billing.table.amount', 'Amount'),
      t('admin.billing.table.dueDate', 'Due Date'),
      t('admin.billing.table.status', 'Status'),
      t('admin.billing.detail.paymentDate', 'Payment Date'),
      t('admin.billing.detail.paymentMethod', 'Payment Method'),
    ];

    const rows = invoices.map((inv) => [
      inv.id,
      inv.storeName,
      inv.owner,
      inv.plan,
      formatPeriod(inv.period),
      inv.amount.toString(),
      inv.dueDate,
      inv.status,
      inv.paymentDate || '',
      inv.paymentMethod || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-orange-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return t('admin.billing.status.paid', 'Paid');
      case 'pending':
        return t('admin.billing.status.pending', 'Pending');
      case 'overdue':
        return t('admin.billing.status.overdue', 'Overdue');
      case 'cancelled':
        return t('admin.billing.status.cancelled', 'Cancelled');
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Platinum':
        return 'from-purple-600 to-pink-600';
      case 'Gold':
        return 'from-yellow-500 to-orange-500';
      case 'Free':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        searchTerm === '' ||
        invoice.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesPlan = planFilter === 'all' || invoice.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [invoices, searchTerm, statusFilter, planFilter]);

  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueRevenue = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const stats = [
    {
      label: t('admin.billing.stats.totalRevenue', 'Total Revenue'),
      value: `${(totalRevenue / 1000).toFixed(0)}K FCFA`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.billing.stats.pending', 'Pending'),
      value: `${(pendingRevenue / 1000).toFixed(0)}K FCFA`,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: t('admin.billing.stats.overdue', 'Overdue'),
      value: `${(overdueRevenue / 1000).toFixed(0)}K FCFA`,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: t('admin.billing.stats.totalInvoices', 'Total Invoices'),
      value: invoices.length,
      icon: CreditCard,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('admin.billing.title', 'Billing Management')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('admin.billing.subtitle', 'Manage store subscriptions and invoices')}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Download className="w-4 h-4" strokeWidth={1.5} />
          {t('admin.billing.export', 'Export')}
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

      {/* Plan Pricing Reference */}
      <div className="bg-white border border-cosmos-cream p-6">
        <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
          {t('admin.billing.planPricing', 'Plan Pricing')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-cosmos-cream p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 text-xs text-white bg-gradient-to-r from-gray-500 to-gray-600 font-light">
                Free
              </span>
            </div>
            <div className="text-2xl font-light text-cosmos-night mb-1">0 FCFA</div>
            <div className="text-sm text-text-secondary font-light">
              / {t('admin.billing.perMonth', 'month')}
            </div>
          </div>
          <div className="border border-cosmos-cream p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 text-xs text-white bg-gradient-to-r from-yellow-500 to-orange-500 font-light">
                Gold
              </span>
            </div>
            <div className="text-2xl font-light text-cosmos-night mb-1">75,000 FCFA</div>
            <div className="text-sm text-text-secondary font-light">
              / {t('admin.billing.perMonth', 'month')}
            </div>
          </div>
          <div className="border border-cosmos-cream p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 font-light">
                Platinum
              </span>
            </div>
            <div className="text-2xl font-light text-cosmos-night mb-1">150,000 FCFA</div>
            <div className="text-sm text-text-secondary font-light">
              / {t('admin.billing.perMonth', 'month')}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('admin.billing.searchPlaceholder', 'Search an invoice...')}
              className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
          >
            <option value="all">{t('admin.billing.filter.allStatuses', 'All statuses')}</option>
            <option value="paid">{t('admin.billing.status.paid', 'Paid')}</option>
            <option value="pending">{t('admin.billing.status.pending', 'Pending')}</option>
            <option value="overdue">{t('admin.billing.status.overdue', 'Overdue')}</option>
            <option value="cancelled">{t('admin.billing.status.cancelled', 'Cancelled')}</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
          >
            <option value="all">{t('admin.billing.filter.allPlans', 'All plans')}</option>
            <option value="Free">Free</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-cosmos-cream">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cosmos-cream">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.invoiceNumber', 'Invoice #')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.store', 'Store')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.plan', 'Plan')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.period', 'Period')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.amount', 'Amount')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.dueDate', 'Due Date')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.billing.table.status', 'Status')}
                </th>
                <th className="text-right px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('common.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-cosmos-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-light text-cosmos-night">{invoice.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-light text-cosmos-night">{invoice.storeName}</div>
                      <div className="text-sm text-text-secondary font-light">{invoice.owner}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs text-white bg-gradient-to-r ${getPlanColor(invoice.plan)} font-light`}
                    >
                      {invoice.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-light text-cosmos-night">
                      {formatPeriod(invoice.period)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-light text-cosmos-night">
                      {invoice.amount === 0
                        ? t('admin.billing.free', 'Free')
                        : `${invoice.amount.toLocaleString()} FCFA`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-light text-cosmos-night">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs px-3 py-1 ${getStatusColor(invoice.status)} border font-light inline-block w-fit`}
                      >
                        {getStatusLabel(invoice.status)}
                      </span>
                      {/* Inline feedback */}
                      {actionFeedback && actionFeedback.id === invoice.id && (
                        <span className="text-xs text-emerald-600 font-light flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                          {actionFeedback.message}
                        </span>
                      )}
                      {reminderFeedback && reminderFeedback.id === invoice.id && (
                        <span className="text-xs text-emerald-600 font-light flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                          {reminderFeedback.message}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewInvoice(invoice)}
                        className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                        title={t('admin.billing.viewDetails', 'View details')}
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                        title={t('admin.billing.downloadPdf', 'Download PDF')}
                      >
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                        <button
                          onClick={() => handleSendReminder(invoice.id)}
                          className="p-2 border border-blue-200 bg-cosmos-gold/10 hover:border-blue-600 text-cosmos-night transition-colors"
                          title={t('admin.billing.sendReminder', 'Send reminder')}
                        >
                          <Send className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-text-secondary font-light">
                    {t('admin.billing.noInvoices', 'No invoices found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewInvoice(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.billing.invoiceDetails', 'Invoice Details')}
                </h2>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-light text-cosmos-night mb-1 tracking-tight">
                      {viewInvoice.id}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t('admin.billing.invoiceFor', 'Invoice for {{period}}', {
                        period: formatPeriod(viewInvoice.period),
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 ${getStatusColor(viewInvoice.status)} border font-light`}
                  >
                    {getStatusLabel(viewInvoice.status)}
                  </span>
                </div>

                <div className="border-t border-b border-cosmos-cream py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.billing.detail.store', 'Store')}
                      </div>
                      <div className="font-light text-cosmos-night">{viewInvoice.storeName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.billing.detail.owner', 'Owner')}
                      </div>
                      <div className="font-light text-cosmos-night">{viewInvoice.owner}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.billing.table.plan', 'Plan')}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 text-xs text-white bg-gradient-to-r ${getPlanColor(viewInvoice.plan)} font-light`}
                      >
                        {viewInvoice.plan}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.billing.table.period', 'Period')}
                      </div>
                      <div className="font-light text-cosmos-night">
                        {formatPeriod(viewInvoice.period)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary font-light">
                      {t('admin.billing.detail.issueDate', 'Issue date')}
                    </span>
                    <span className="font-light text-cosmos-night">
                      {new Date(viewInvoice.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary font-light">
                      {t('admin.billing.detail.paymentDueDate', 'Payment due date')}
                    </span>
                    <span className="font-light text-cosmos-night">
                      {new Date(viewInvoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {viewInvoice.paymentDate && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary font-light">
                          {t('admin.billing.detail.paymentDate', 'Payment date')}
                        </span>
                        <span className="font-light text-cosmos-night">
                          {new Date(viewInvoice.paymentDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary font-light">
                          {t('admin.billing.detail.paymentMethod', 'Payment method')}
                        </span>
                        <span className="font-light text-cosmos-night">
                          {viewInvoice.paymentMethod}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-cosmos-cream pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-light text-cosmos-night">
                      {t('admin.billing.detail.totalAmount', 'Total Amount')}
                    </span>
                    <span className="text-2xl font-light text-cosmos-night tracking-tight">
                      {viewInvoice.amount === 0
                        ? t('admin.billing.free', 'Free')
                        : `${viewInvoice.amount.toLocaleString()} FCFA`}
                    </span>
                  </div>
                </div>

                {/* Status change actions */}
                {viewInvoice.status !== 'paid' && (
                  <div className="border-t border-cosmos-cream pt-4">
                    <div className="text-sm text-text-secondary font-light mb-3">
                      {t('admin.billing.changeStatus', 'Change Status')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {viewInvoice.status !== 'paid' && (
                        <button
                          onClick={() => handleStatusChange(viewInvoice.id, 'paid')}
                          className="flex items-center gap-2 px-4 py-2 border border-green-200 hover:border-green-600 bg-emerald-50 text-emerald-600 font-light transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                          {t('admin.billing.markAsPaid', 'Mark as paid')}
                        </button>
                      )}
                      {viewInvoice.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(viewInvoice.id, 'pending')}
                          className="flex items-center gap-2 px-4 py-2 border border-orange-200 hover:border-orange-600 bg-amber-50 text-amber-600 font-light transition-colors text-sm"
                        >
                          <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
                          {t('admin.billing.markAsPending', 'Mark as pending')}
                        </button>
                      )}
                      {viewInvoice.status !== 'overdue' && (
                        <button
                          onClick={() => handleStatusChange(viewInvoice.id, 'overdue')}
                          className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" strokeWidth={1.5} />
                          {t('admin.billing.markAsOverdue', 'Mark as overdue')}
                        </button>
                      )}
                      {viewInvoice.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(viewInvoice.id, 'cancelled')}
                          className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 bg-cosmos-cream/50 text-text-secondary font-light transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" strokeWidth={1.5} />
                          {t('admin.billing.markAsCancelled', 'Mark as cancelled')}
                        </button>
                      )}
                    </div>
                    {/* Modal inline feedback */}
                    {actionFeedback && actionFeedback.id === viewInvoice.id && (
                      <div className="mt-2 text-sm text-emerald-600 font-light flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                        {actionFeedback.message}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={handleExportCSV}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
                    {t('admin.billing.downloadPdf', 'Download PDF')}
                  </button>
                  {(viewInvoice.status === 'pending' || viewInvoice.status === 'overdue') && (
                    <button
                      onClick={() => handleSendReminder(viewInvoice.id)}
                      className="px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
                    >
                      <Send className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
                      {t('admin.billing.sendReminder', 'Send Reminder')}
                    </button>
                  )}
                </div>
                {/* Modal reminder feedback */}
                {reminderFeedback && reminderFeedback.id === viewInvoice.id && (
                  <div className="text-sm text-emerald-600 font-light flex items-center justify-end gap-1">
                    <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                    {reminderFeedback.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingManagement;
