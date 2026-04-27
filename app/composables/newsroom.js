// composables/newsroom.js — utilitarios partilhados pelo NewsroomPage,
// PostDetail e PostsAdminPage. Carregado como script regular (IIFE) — anexa
// helpers a window para evitar import/export que vue3-sfc-loader 0.9.5 nao
// suporta em ficheiros .js.

(function () {
  const COVER_ICONS = {
    megaphone:  'IMegaphone',
    shield:     'IShield',
    graduation: 'IGraduation',
    sparkle:    'ISparkle',
    calendar:   'ICalendar',
    globe:      'IGlobe',
    heart:      'IHeart',
    box:        'IBox',
    chart:      'IChart',
    alert:      'IAlert',
    edit:       'IEdit',
    sun:        'ISun',
    pill:       'IPill',
    book:       'IBook',
  };

  function coverIconFor(key) {
    return COVER_ICONS[key] || 'IMegaphone';
  }

  function getCategoryMeta(id) {
    const data = window.PORTAL_DATA;
    return data.postCategories.find(c => c.id === id) || { label: 'Geral', color: 'var(--foreground-muted)' };
  }

  function formatPostDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${d.getDate()} ${months[d.getMonth()]} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function relativePostDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'ontem';
    if (days < 7) return `há ${days} dias`;
    if (days < 30) return `há ${Math.floor(days / 7)} sem`;
    return formatPostDate(iso);
  }

  function isNewPost(iso) {
    if (!iso) return false;
    return (Date.now() - new Date(iso).getTime()) < 7 * 24 * 60 * 60 * 1000;
  }

  Object.assign(window, {
    NEWSROOM_COVER_ICONS: COVER_ICONS,
    coverIconFor,
    getCategoryMeta,
    formatPostDate,
    relativePostDate,
    isNewPost,
  });
})();
