// primitives.js — UI primitives (port direta de primitives.jsx para Vue 3
// usando componentes funcionais via h()). Anexa cada um a window.* para que
// main.js os registe globalmente. Mantem os mesmos nomes do React: Card, Pill,
// Btn, IconBtn, Avatar, Tabs, Drawer, Modal, Toast, SectionTitle, Trend, Empty.
//
// Convencoes:
// - props sao lidas via context.attrs (componentes funcionais sem declaracao).
// - eventos sao emitidos via context.emit (ex.: @close, @change).
// - children entram via slots.default; named slots: footer (Drawer/Modal).

(function () {
  const Vue = window.Vue;
  if (!Vue) { console.error('[primitives] Vue ainda nao carregado.'); return; }
  const { h, Fragment } = Vue;
  const I = window.I || {};

  // ---- Card -----------------------------------------------------------------
  const Card = (_p, { attrs, slots }) => h('div', { ...attrs, class: 'card' }, slots.default && slots.default());

  // ---- Pill -----------------------------------------------------------------
  const Pill = (_p, { attrs, slots }) => {
    const tone = attrs.tone || 'neutral';
    const dot = !!attrs.dot;
    const { tone: _t, dot: _d, ...rest } = attrs;
    return h('span', { ...rest, class: `pill ${tone}` }, [
      dot ? h('span', { style: { width: '6px', height: '6px', background: 'currentColor', borderRadius: '999px' } }) : null,
      slots.default && slots.default(),
    ]);
  };

  // ---- Btn ------------------------------------------------------------------
  const Btn = (_p, { attrs, slots }) => {
    const variant = attrs.variant || 'primary';
    const size = attrs.size || 'md';
    const sizeCls = size === 'sm' ? ' sm' : size === 'lg' ? ' lg' : '';
    const { variant: _v, size: _s, ...rest } = attrs;
    return h('button', {
      type: rest.type || 'button',
      ...rest,
      class: `btn ${variant}${sizeCls}`,
    }, slots.default && slots.default());
  };

  // ---- IconBtn --------------------------------------------------------------
  const IconBtn = (_p, { attrs, slots }) => {
    const bordered = !!attrs.bordered;
    const { bordered: _b, ...rest } = attrs;
    return h('button', {
      type: 'button',
      'aria-label': rest.title,
      ...rest,
      class: `icon-btn${bordered ? ' bordered' : ''}`,
    }, slots.default && slots.default());
  };

  // ---- Avatar ---------------------------------------------------------------
  const Avatar = (_p, { attrs }) => {
    const name = attrs.name || '?';
    const size = attrs.size != null ? Number(attrs.size) : 32;
    const palette = [
      'oklch(0.660 0.155 163)', 'oklch(0.640 0.140 230)', 'oklch(0.780 0.160 78)',
      'oklch(0.620 0.150 27)',  'oklch(0.560 0.130 300)',
    ];
    const color = attrs.bg || palette[(name.charCodeAt(0) || 0) % palette.length];
    const initials = String(name).split(' ').filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join('');
    return h('div', {
      style: {
        width: size + 'px', height: size + 'px', borderRadius: '999px',
        background: color, color: '#fff',
        display: 'grid', placeItems: 'center',
        fontSize: Math.round(size * 0.38) + 'px', fontWeight: 600, flex: 'none',
      },
    }, initials);
  };

  // ---- Tabs -----------------------------------------------------------------
  const Tabs = (_p, { attrs, emit }) => {
    const tabs = attrs.tabs || [];
    const value = attrs.value;
    return h('div', { class: 'tabs' }, tabs.map(t =>
      h('div', {
        key: t.id,
        class: `tab${value === t.id ? ' active' : ''}`,
        onClick: () => emit('change', t.id),
      }, [
        t.label,
        t.count != null
          ? h('span', { style: { marginLeft: '6px', color: 'var(--foreground-subtle)', fontSize: '11.5px' } }, String(t.count))
          : null,
      ])
    ));
  };

  // ---- Drawer ---------------------------------------------------------------
  const Drawer = (_p, { attrs, slots, emit }) => {
    if (!attrs.open) return null;
    const onClose = () => emit('close');
    return h(Fragment, null, [
      h('div', { class: 'backdrop', onClick: onClose }),
      h('div', { class: 'drawer' }, [
        h('div', { style: { padding: '20px 24px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '12px' } }, [
          h('div', { style: { flex: 1 } }, [
            h('div', { style: { fontSize: '16px', fontWeight: 600 } }, attrs.title),
            attrs.subtitle ? h('div', { style: { fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '4px' } }, attrs.subtitle) : null,
          ]),
          h(IconBtn, { onClick: onClose, title: 'Fechar' }, { default: () => h(I.Close, { size: 16 }) }),
        ]),
        h('div', { style: { flex: 1, overflowY: 'auto', padding: '24px' } }, slots.default && slots.default()),
        slots.footer
          ? h('div', { style: { padding: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', justifyContent: 'flex-end' } }, slots.footer())
          : null,
      ]),
    ]);
  };

  // ---- Modal ----------------------------------------------------------------
  const Modal = (_p, { attrs, slots, emit }) => {
    if (!attrs.open) return null;
    const width = attrs.width || 520;
    const onClose = () => emit('close');
    return h('div', { class: 'backdrop', onClick: onClose }, [
      h('div', {
        onClick: (e) => e.stopPropagation(),
        class: 'scale-in',
        style: {
          width: width + 'px', maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 80px)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', boxShadow: 'var(--shadow-xl)',
          display: 'flex', flexDirection: 'column',
        },
      }, [
        attrs.title
          ? h('div', { style: { padding: '20px 24px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
              h('div', { style: { fontSize: '16px', fontWeight: 600 } }, attrs.title),
              h(IconBtn, { onClick: onClose }, { default: () => h(I.Close, { size: 16 }) }),
            ])
          : null,
        h('div', { style: { padding: '24px', overflowY: 'auto' } }, slots.default && slots.default()),
        slots.footer
          ? h('div', { style: { padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', justifyContent: 'flex-end' } }, slots.footer())
          : null,
      ]),
    ]);
  };

  // ---- Toast ----------------------------------------------------------------
  const Toast = (_p, { attrs, emit }) => {
    const tone = attrs.tone || 'success';
    const tones = {
      success: { bg: 'oklch(0.95 0.05 163)', fg: 'var(--brand-emerald-700)', icon: I.Check },
      info:    { bg: 'var(--surface)',       fg: 'var(--foreground)',         icon: I.Info  },
      danger:  { bg: 'oklch(0.96 0.06 27)',  fg: 'oklch(0.50 0.23 27)',       icon: I.Alert },
    };
    const t = tones[tone] || tones.success;
    return h('div', {
      class: 'slide-in-right',
      style: {
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 70,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '12px 14px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        minWidth: '280px', maxWidth: '380px',
      },
    }, [
      h('div', {
        style: {
          width: '28px', height: '28px', borderRadius: '8px',
          background: t.bg, color: t.fg,
          display: 'grid', placeItems: 'center', flex: 'none',
        },
      }, h(t.icon, { size: 14 })),
      h('div', { style: { flex: 1 } }, [
        h('div', { style: { fontSize: '13px', fontWeight: 600 } }, attrs.title),
        attrs.desc ? h('div', { style: { fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '2px' } }, attrs.desc) : null,
      ]),
      h(IconBtn, {
        onClick: () => emit('close'),
        style: { width: '24px', height: '24px' },
      }, { default: () => h(I.Close, { size: 14 }) }),
    ]);
  };

  // ---- SectionTitle ---------------------------------------------------------
  const SectionTitle = (_p, { attrs, slots }) => {
    return h('div', {
      style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '14px', gap: '12px' },
    }, [
      h('div', null, [
        h('h2', { style: { margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.01em' } }, slots.default && slots.default()),
        attrs.sub ? h('div', { style: { fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '4px' } }, attrs.sub) : null,
      ]),
      slots.action && slots.action(),
    ]);
  };

  // ---- Trend ----------------------------------------------------------------
  const Trend = (_p, { attrs }) => {
    const value = Number(attrs.value || 0);
    const up = value >= 0;
    const Arrow = up ? I.ArrowUp : I.ArrowDown;
    return h('span', {
      class: 'kpi-trend',
      style: { color: up ? 'var(--brand-emerald-700)' : 'oklch(0.50 0.23 27)' },
    }, [
      h(Arrow, { size: 12, stroke: 2.5 }),
      Math.abs(value).toFixed(1) + '%',
    ]);
  };

  // ---- Empty ----------------------------------------------------------------
  const Empty = (_p, { attrs, slots }) => {
    return h('div', {
      style: {
        padding: '48px 20px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', color: 'var(--foreground-muted)',
      },
    }, [
      h('div', {
        style: {
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'var(--surface-sunken)',
          display: 'grid', placeItems: 'center',
          marginBottom: '12px', color: 'var(--foreground-subtle)',
        },
      }, slots.icon ? slots.icon() : h(I.Inbox, { size: 24 })),
      h('div', { style: { fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' } }, attrs.title),
      attrs.desc
        ? h('div', { style: { fontSize: '13px', marginTop: '4px', maxWidth: '320px' } }, attrs.desc)
        : null,
    ]);
  };

  // ---- Kpi (variante com sparkline + accent — definida em dashboard.jsx,
  //         partilhada por stock/finance/marketing/digital/...) -------------
  // Nota: distinta do KPI (uppercase) acima. Em Vue ambos os nomes coexistem
  // como componentes globais case-sensitive (Kpi vs KPI).
  const Kpi = (_p, { attrs }) => {
    const accent = !!attrs.accent;
    const Sparkline = window.Sparkline;
    const Trend = window.Trend;
    return h('div', {
      class: 'kpi',
      style: accent
        ? { background: 'linear-gradient(180deg, var(--brand-emerald-50), var(--surface))', borderColor: 'var(--brand-emerald-200)' }
        : {},
    }, [
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } }, [
        h('span', { class: 'kpi-label' }, attrs.label),
        attrs.sparkData && Sparkline ? h(Sparkline, { data: attrs.sparkData, width: 70, height: 22 }) : null,
      ]),
      h('div', { class: 'kpi-value' }, attrs.value),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
        attrs.trend != null && Trend ? h(Trend, { value: attrs.trend }) : null,
        h('span', { style: { fontSize: '12px', color: 'var(--foreground-muted)' } }, attrs.sub),
      ]),
    ]);
  };

  // ---- Legend (definida em dashboard.jsx, partilhada) ----------------------
  const Legend = (_p, { attrs }) => {
    return h('div', {
      style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' },
    }, [
      h('span', {
        style: {
          width: attrs.small ? '6px' : '8px',
          height: attrs.small ? '6px' : '8px',
          borderRadius: '999px',
          background: attrs.color,
        },
      }),
      h('span', { style: { color: 'var(--foreground-muted)' } }, attrs.label),
      attrs.value ? h('span', { style: { fontWeight: 600 } }, attrs.value) : null,
    ]);
  };

  // ---- MiniStat (definida em stock.jsx) -----------------------------------
  const MiniStat = (_p, { attrs }) => {
    return h('div', {
      style: { padding: '12px', background: 'var(--surface-sunken)', borderRadius: '10px' },
    }, [
      h('div', { style: { fontSize: '11px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 } }, attrs.label),
      h('div', { style: { fontSize: '18px', fontWeight: 700, marginTop: '4px', letterSpacing: '-0.01em' } }, attrs.value),
      attrs.sub ? h('div', { style: { fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '2px' } }, attrs.sub) : null,
    ]);
  };

  // ---- KPI (definido em crm.jsx, partilhado por compliance/hr/pharma/...) ---
  // Tile compacto com label/value/delta/sub e um icone via slot #icon (ou
  // attrs.icon como vnode).
  const KPI = (_p, { attrs, slots }) => {
    return h('div', { class: 'card', style: { padding: '18px' } }, [
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }, [
        h('span', { style: { fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' } }, attrs.label),
        h('span', {
          style: { width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-sunken)', color: 'var(--foreground-muted)', display: 'grid', placeItems: 'center' },
        }, slots.icon ? slots.icon() : (attrs.icon || null)),
      ]),
      h('div', { style: { fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' } }, attrs.value),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px' } }, [
        attrs.delta != null ? h(Trend, { value: attrs.delta }) : null,
        h('span', { style: { color: 'var(--foreground-muted)' } }, attrs.sub || 'vs. mês anterior'),
      ]),
    ]);
  };

  // ---- Stat (definido em crm.jsx, partilhado por pharma e similares) -------
  // Caixa de estatistica com label e value sobre surface-sunken.
  const Stat = (_p, { attrs }) => {
    return h('div', {
      style: { padding: '12px', borderRadius: '10px', background: 'var(--surface-sunken)' },
    }, [
      h('div', { style: { fontSize: '11px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' } }, attrs.label),
      h('div', { style: { fontSize: '18px', fontWeight: 600, marginTop: '4px', fontVariantNumeric: 'tabular-nums' } }, attrs.value),
    ]);
  };

  Object.assign(window, {
    Card, Pill, Btn, IconBtn, Avatar, Tabs, Drawer, Modal, Toast,
    SectionTitle, Trend, Empty,
    KPI, Stat, Kpi, Legend, MiniStat,
  });
})();
