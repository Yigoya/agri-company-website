export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price: number | null, unit?: string | null): string {
  if (price === null) return 'Contact for pricing';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80';
  if (path.startsWith('http')) return path;
  return path;
}
