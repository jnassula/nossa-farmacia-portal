// charts.js — graficos SVG ligeiros (porta de charts.jsx para Vue 3 funcional).
// Componentes: Sparkline, LineChart, BarChart, Donut, ProgressBar.
// Tambem expoe formatadores fmt / eur / eurD em window.

(function () {
  const Vue = window.Vue;
  if (!Vue) { console.error('[charts] Vue ainda nao carregado.'); return; }
  const { h, Fragment } = Vue;

  const fmt  = (n) => Number(n).toLocaleString('pt-PT');
  const eur  = (n) => '€ ' + Number(n).toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const eurD = (n) => '€ ' + Number(n).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  Object.assign(window, { fmt, eur, eurD });

  // ---- Sparkline ------------------------------------------------------------
  const Sparkline = (_p, { attrs }) => {
    const data = attrs.data;
    if (!data || !data.length) return null;
    const color = attrs.color || 'var(--primary)';
    const width = attrs.width != null ? Number(attrs.width) : 90;
    const height = attrs.height != null ? Number(attrs.height) : 28;
    const fill = attrs.fill !== false;
    const min = Math.min(...data), max = Math.max(...data);
    const r = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / r) * (height - 4) - 2;
      return [x, y];
    });
    const path = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
    const area = path + ` L ${width} ${height} L 0 ${height} Z`;
    return h('svg', { width, height, style: { display: 'block' } }, [
      fill ? h('path', { d: area, fill: color, opacity: '0.12' }) : null,
      h('path', { d: path, fill: 'none', stroke: color, 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ]);
  };

  // ---- LineChart ------------------------------------------------------------
  const LineChart = (_p, { attrs }) => {
    const data = attrs.data || [];
    const height = attrs.height != null ? Number(attrs.height) : 240;
    const color = attrs.color || 'var(--primary)';
    const formatY = attrs.formatY || ((v) => v);
    const W = 720, H = height, P = { l: 48, r: 16, t: 16, b: 32 };
    const w = W - P.l - P.r, hh = H - P.t - P.b;
    const max = Math.max(...data.map(d => d.v));
    const min = 0;
    const r = max - min || 1;
    const xs = data.map((_, i) => P.l + (i / (data.length - 1)) * w);
    const ys = data.map(d => P.t + hh - ((d.v - min) / r) * hh);
    const pts = xs.map((x, i) => [x, ys[i]]);
    const linePath = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
    const areaPath = linePath + ` L ${xs[xs.length - 1]} ${P.t + hh} L ${xs[0]} ${P.t + hh} Z`;
    const yTicks = 4;
    return h('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', style: { display: 'block' } }, [
      ...Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = P.t + (i / yTicks) * hh;
        const value = max - (i / yTicks) * r;
        return h('g', { key: 'tick' + i }, [
          h('line', { x1: P.l, x2: W - P.r, y1: y, y2: y, stroke: 'var(--border-subtle)', 'stroke-dasharray': i ? '2 4' : undefined }),
          h('text', { x: P.l - 8, y: y + 4, 'text-anchor': 'end', 'font-size': '10.5', fill: 'var(--foreground-subtle)' }, String(formatY(Math.round(value)))),
        ]);
      }),
      h('defs', null, [
        h('linearGradient', { id: 'lcg', x1: '0', x2: '0', y1: '0', y2: '1' }, [
          h('stop', { offset: '0%',   'stop-color': color, 'stop-opacity': '0.22' }),
          h('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '0.00' }),
        ]),
      ]),
      h('path', { d: areaPath, fill: 'url(#lcg)' }),
      h('path', { d: linePath, fill: 'none', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      ...pts.map(([x, y], i) => h('g', { key: 'pt' + i }, [
        i === pts.length - 1 ? h('circle', { cx: x, cy: y, r: '4', fill: color, stroke: '#fff', 'stroke-width': '2' }) : null,
        h('text', { x, y: H - 10, 'text-anchor': 'middle', 'font-size': '10.5', fill: 'var(--foreground-muted)' }, String(data[i].m)),
      ])),
    ]);
  };

  // ---- BarChart -------------------------------------------------------------
  const BarChart = (_p, { attrs }) => {
    const data = attrs.data || [];
    const height = attrs.height != null ? Number(attrs.height) : 220;
    const color = attrs.color || 'var(--primary)';
    const formatY = attrs.formatY || ((v) => v);
    const W = 720, H = height, P = { l: 48, r: 16, t: 16, b: 32 };
    const w = W - P.l - P.r, hh = H - P.t - P.b;
    const max = Math.max(...data.map(d => d.v));
    const bw = w / data.length * 0.6;
    const gap = w / data.length * 0.4;
    return h('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', style: { display: 'block' } }, [
      ...[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = P.t + p * hh;
        return h('g', { key: 'tick' + i }, [
          h('line', { x1: P.l, x2: W - P.r, y1: y, y2: y, stroke: 'var(--border-subtle)', 'stroke-dasharray': i ? '2 4' : undefined }),
          h('text', { x: P.l - 8, y: y + 4, 'text-anchor': 'end', 'font-size': '10.5', fill: 'var(--foreground-subtle)' }, String(formatY(Math.round(max - p * max)))),
        ]);
      }),
      ...data.map((d, i) => {
        const x = P.l + i * (bw + gap) + gap / 2;
        const bh = (d.v / max) * hh;
        const y = P.t + hh - bh;
        return h('g', { key: 'b' + i }, [
          h('rect', { x, y, width: bw, height: bh, rx: '4', fill: d.color || color, opacity: d.dim ? 0.5 : 1 }),
          h('text', { x: x + bw / 2, y: H - 10, 'text-anchor': 'middle', 'font-size': '10.5', fill: 'var(--foreground-muted)' }, String(d.m)),
        ]);
      }),
    ]);
  };

  // ---- Donut ----------------------------------------------------------------
  const Donut = (_p, { attrs }) => {
    const data = attrs.data || [];
    const size = attrs.size != null ? Number(attrs.size) : 160;
    const thickness = attrs.thickness != null ? Number(attrs.thickness) : 22;
    const total = data.reduce((s, d) => s + d.v, 0) || 1;
    const c = size / 2, r = c - thickness / 2;
    let acc = 0;
    const segs = data.map(d => {
      const start = acc / total * Math.PI * 2;
      acc += d.v;
      const end = acc / total * Math.PI * 2;
      return { ...d, start, end };
    });
    const arc = (a0, a1) => {
      const x0 = c + r * Math.sin(a0), y0 = c - r * Math.cos(a0);
      const x1 = c + r * Math.sin(a1), y1 = c - r * Math.cos(a1);
      const large = a1 - a0 > Math.PI ? 1 : 0;
      return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
    };
    return h('svg', { width: size, height: size }, [
      ...segs.map((s, i) =>
        h('path', { key: 's' + i, d: arc(s.start, s.end - 0.01), fill: 'none', stroke: s.color, 'stroke-width': thickness, 'stroke-linecap': 'butt' })
      ),
      attrs.centerValue
        ? h(Fragment, null, [
            h('text', { x: c, y: c - 2,  'text-anchor': 'middle', 'font-size': '22', 'font-weight': '700', fill: 'var(--foreground)' }, String(attrs.centerValue)),
            h('text', { x: c, y: c + 16, 'text-anchor': 'middle', 'font-size': '11', fill: 'var(--foreground-muted)' }, String(attrs.centerLabel || '')),
          ])
        : null,
    ]);
  };

  // ---- ProgressBar (wrapper que renderiza PrimeVue ProgressBar internamente)
  // API Nossa (value, max, color, height) traduzida para PrimeVue ProgressBar:
  // - value normalizado para 0-100 (PrimeVue assume max=100)
  // - color injectada na <div> da fill via :pt (PassThrough) sobre `value`.
  // Fallback: div standalone se PrimeVue nao estiver presente.
  const ProgressBar = (_p, { attrs }) => {
    const value = Number(attrs.value || 0);
    const max = Number(attrs.max != null ? attrs.max : 100);
    const color = attrs.color || 'var(--primary)';
    const height = attrs.height != null ? Number(attrs.height) : 6;
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const PrimePB = window.PrimeVue && (window.PrimeVue.ProgressBar?.default || window.PrimeVue.ProgressBar);
    if (PrimePB) {
      return h(PrimePB, {
        value: pct,
        showValue: false,
        style: { height: height + 'px' },
        pt: {
          root: { style: { background: 'var(--ink-100)', borderRadius: '999px', overflow: 'hidden' } },
          value: { style: { background: color, borderRadius: '999px' } },
        },
      });
    }
    return h('div', {
      style: { height: height + 'px', background: 'var(--ink-100)', borderRadius: '999px', overflow: 'hidden' },
    }, h('div', {
      style: { height: '100%', width: pct + '%', background: color, borderRadius: '999px', transition: 'width 320ms var(--ease-out)' },
    }));
  };

  Object.assign(window, { Sparkline, LineChart, BarChart, Donut, ProgressBar });
})();
