export const formatCurrency = (amount, compact = false) => {
  const abs = Math.abs(amount);
  if (compact && abs >= 100000) {
    return `₹${(abs / 100000).toFixed(1)}L`;
  }
  if (compact && abs >= 1000) {
    return `₹${(abs / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getCategoryMeta = (categories, label) =>
  categories.find(c => c.label === label) ?? { label: 'Other', color: '#8090a8', icon: '📦' };

export const pct = (part, total) =>
  total === 0 ? 0 : Math.round((part / total) * 100);
