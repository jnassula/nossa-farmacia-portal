// charts.js — graficos via Chart.js 4 (UMD).
//
// Cada componente expoe a mesma API do tempo dos SVG hand-drawn:
// Sparkline, LineChart, BarChart, Donut, ProgressBar. Internamente os 4
// primeiros instanciam `new window.Chart(canvas, config)` directamente,
// gerindo lifecycle (criacao em onMounted, destroy em onBeforeUnmount,
// update quando os atributos mudam).
//
// Nota sobre PrimeVue: o componente <Chart> oficial do PrimeVue 4 e um
// wrapper Chart.js, mas usa `import('chart.js/auto')` em runtime que falha
// quando o bundle PrimeVue e cross-origin (unpkg). Para evitar essa
// fragilidade os nossos wrappers usam Chart.js directamente — o resultado
// e identico (mesmo canvas, mesma engine).
//
// ProgressBar mantem-se aqui (compat) e renderiza <ProgressBar> PrimeVue
// com cor custom via :pt.

(function () {
  const Vue = window.Vue;
  if (!Vue) { console.error('[charts] Vue ainda nao carregado.'); return; }
  const { h, defineComponent, ref, onMounted, onBeforeUnmount, watch, toRaw, isRef } = Vue;

  // ---- Formatadores ---------------------------------------------------------
  const fmt  = (n) => Number(n).toLocaleString('pt-PT');
  const eur  = (n) => '€ ' + Number(n).toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const eurD = (n) => '€ ' + Number(n).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  Object.assign(window, { fmt, eur, eurD });

  // ---- Helpers para resolver cores (var(--x), oklch, hex) -> rgb -----------
  // Estrategia em 2 passos:
  // 1. <div> off-screen com `style.color = cssColor` para resolver var(--x)
  //    via cascade — getComputedStyle devolve o valor concreto (`oklch(...)`,
  //    `rgb(...)`, etc.).
  // 2. Canvas ctx.fillStyle aceita esses formatos concretos e devolve a
  //    versao normalizada em hex (`#rrggbb`) — facil de partir em RGBA.
  let _probeEl = null;
  let _probe2d = null;
  const probe = () => {
    if (!_probeEl) {
      _probeEl = document.createElement('div');
      _probeEl.style.cssText = 'position:absolute;left:-9999px;top:-9999px';
      document.body.appendChild(_probeEl);
    }
    return _probeEl;
  };
  const probe2d = () => {
    if (!_probe2d) {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      _probe2d = c.getContext('2d');
    }
    return _probe2d;
  };
  const resolveColor = (cssColor) => {
    const el = probe();
    el.style.color = '';
    el.style.color = cssColor;
    const computed = getComputedStyle(el).color; // ex.: "oklch(0.66 0.155 163)" ou "rgb(15, 93, 58)"
    // Normalizar para hex via canvas — Chart.js aceita o resultado em qualquer fillStyle.
    const ctx = probe2d();
    try {
      ctx.fillStyle = '#000';
      ctx.fillStyle = computed;
      return ctx.fillStyle; // "#rrggbb" ou "rgba(r, g, b, a)"
    } catch {
      return computed;
    }
  };
  const withAlpha = (cssColor, alpha) => {
    const c = resolveColor(cssColor);
    if (c[0] === '#' && c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const m = c.match(/(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)/);
    if (m) return `rgba(${Math.round(+m[1])}, ${Math.round(+m[2])}, ${Math.round(+m[3])}, ${alpha})`;
    return `rgba(15, 93, 58, ${alpha})`; // fallback emerald
  };

  const ChartLib = () => window.Chart;

  // ============================================================================
  //  Factory: cria um componente Chart.js wrapper baseado num builder de config
  // ============================================================================
  const makeChartComp = (name, buildConfig, sizing) => defineComponent({
    name,
    setup(_, { attrs, expose }) {
      const canvasRef = ref(null);
      let chart = null;

      const buildAndCreate = () => {
        const Chart = ChartLib();
        if (!Chart) { console.warn('[charts]', name, 'Chart.js nao disponivel'); return; }
        if (!canvasRef.value) return;
        const cfg = buildConfig(attrs);
        if (!cfg) return;
        try {
          chart = new Chart(canvasRef.value, cfg);
        } catch (err) {
          console.error('[charts]', name, 'create failed', err && err.message);
        }
      };

      onMounted(buildAndCreate);
      onBeforeUnmount(() => { if (chart) { try { chart.destroy(); } catch {} chart = null; } });

      return () => {
        const dim = sizing(attrs);
        return h('div', { style: dim.wrapper || { display: 'block' } },
          h('canvas', { ref: canvasRef, ...(dim.canvas || {}) })
        );
      };
    },
  });

  // ============================================================================
  //  Sparkline — line minimal, sem eixos
  // ============================================================================
  const Sparkline = makeChartComp('Sparkline',
    (attrs) => {
      const data = attrs.data;
      if (!data || !data.length) return null;
      const color = attrs.color || 'var(--primary)';
      const fill = attrs.fill !== false;
      const stroke = resolveColor(color);
      return {
        type: 'line',
        data: {
          labels: data.map(() => ''),
          datasets: [{
            data: [...data],
            borderColor: stroke,
            backgroundColor: fill
              ? (ctx) => {
                  const ca = ctx.chart.chartArea;
                  if (!ca) return withAlpha(color, 0);
                  const g = ctx.chart.ctx.createLinearGradient(0, ca.top, 0, ca.bottom);
                  g.addColorStop(0, withAlpha(color, 0.22));
                  g.addColorStop(1, withAlpha(color, 0));
                  return g;
                }
              : 'transparent',
            fill,
            tension: 0,
            pointRadius: 0,
            borderWidth: 1.5,
          }],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          elements: { point: { radius: 0 } },
        },
      };
    },
    (attrs) => {
      const w = attrs.width != null ? Number(attrs.width) : 90;
      const hh = attrs.height != null ? Number(attrs.height) : 28;
      return {
        wrapper: { width: w + 'px', height: hh + 'px', display: 'block' },
        canvas: { width: w, height: hh, style: { display: 'block' } },
      };
    },
  );

  // ============================================================================
  //  LineChart — com eixos, gradient fill, ultimo ponto destacado
  // ============================================================================
  const LineChart = makeChartComp('LineChart',
    (attrs) => {
      const data = attrs.data || [];
      const color = attrs.color || 'var(--primary)';
      const formatY = attrs.formatY || ((v) => v);
      const stroke = resolveColor(color);
      return {
        type: 'line',
        data: {
          labels: data.map((d) => d.m || ''),
          datasets: [{
            data: data.map((d) => d.v),
            borderColor: stroke,
            backgroundColor: (ctx) => {
              const ca = ctx.chart.chartArea;
              if (!ca) return withAlpha(color, 0);
              const g = ctx.chart.ctx.createLinearGradient(0, ca.top, 0, ca.bottom);
              g.addColorStop(0, withAlpha(color, 0.22));
              g.addColorStop(1, withAlpha(color, 0));
              return g;
            },
            fill: true,
            tension: 0,
            borderWidth: 2,
            pointRadius: (ctx) => ctx.dataIndex === data.length - 1 ? 4 : 0,
            pointBackgroundColor: stroke,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 320 },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: withAlpha('var(--foreground-muted)', 1), font: { size: 10.5 } },
            },
            y: {
              grid: { color: withAlpha('var(--border-subtle)', 1), drawTicks: false },
              border: { display: false },
              ticks: {
                color: withAlpha('var(--foreground-subtle)', 1),
                font: { size: 10.5 },
                callback: (v) => formatY(v),
                maxTicksLimit: 5,
              },
              beginAtZero: true,
            },
          },
        },
      };
    },
    (attrs) => {
      const hh = attrs.height != null ? Number(attrs.height) : 240;
      return {
        wrapper: { width: '100%', height: hh + 'px', position: 'relative' },
        canvas: {},
      };
    },
  );

  // ============================================================================
  //  BarChart — bars com cor por item, eixos
  // ============================================================================
  const BarChart = makeChartComp('BarChart',
    (attrs) => {
      const data = attrs.data || [];
      const color = attrs.color || 'var(--primary)';
      const formatY = attrs.formatY || ((v) => v);
      return {
        type: 'bar',
        data: {
          labels: data.map((d) => d.m || ''),
          datasets: [{
            data: data.map((d) => d.v),
            backgroundColor: data.map((d) => d.dim
              ? withAlpha(d.color || color, 0.5)
              : resolveColor(d.color || color)),
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 320 },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: withAlpha('var(--foreground-muted)', 1), font: { size: 10.5 } },
            },
            y: {
              grid: { color: withAlpha('var(--border-subtle)', 1), drawTicks: false },
              border: { display: false },
              ticks: {
                color: withAlpha('var(--foreground-subtle)', 1),
                font: { size: 10.5 },
                callback: (v) => formatY(v),
                maxTicksLimit: 5,
              },
              beginAtZero: true,
            },
          },
        },
      };
    },
    (attrs) => {
      const hh = attrs.height != null ? Number(attrs.height) : 220;
      return {
        wrapper: { width: '100%', height: hh + 'px', position: 'relative' },
        canvas: {},
      };
    },
  );

  // ============================================================================
  //  Donut — doughnut com center label/value via overlay <div>
  // ============================================================================
  const DonutChart = makeChartComp('DonutChart',
    (attrs) => {
      const data = attrs.data || [];
      const size = attrs.size != null ? Number(attrs.size) : 160;
      const thickness = attrs.thickness != null ? Number(attrs.thickness) : 22;
      const cutoutPct = Math.round(((size / 2 - thickness) / (size / 2)) * 100);
      return {
        type: 'doughnut',
        data: {
          labels: data.map((d) => d.label || ''),
          datasets: [{
            data: data.map((d) => d.v),
            backgroundColor: data.map((d) => resolveColor(d.color || 'var(--primary)')),
            borderWidth: 0,
          }],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          animation: { duration: 320 },
          cutout: cutoutPct + '%',
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        },
      };
    },
    (attrs) => {
      const size = attrs.size != null ? Number(attrs.size) : 160;
      return {
        wrapper: { width: size + 'px', height: size + 'px', display: 'block' },
        canvas: { width: size, height: size, style: { display: 'block' } },
      };
    },
  );

  // Donut wrapper que adiciona center text overlay
  const Donut = (_p, { attrs }) => {
    const size = attrs.size != null ? Number(attrs.size) : 160;
    return h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px', flex: 'none' } }, [
      h(DonutChart, attrs),
      attrs.centerValue ? h('div', {
        style: {
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          textAlign: 'center', pointerEvents: 'none',
        },
      }, h('div', null, [
        h('div', { style: { fontSize: '22px', fontWeight: 700, color: 'var(--foreground)' } }, String(attrs.centerValue)),
        attrs.centerLabel
          ? h('div', { style: { fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '2px' } }, String(attrs.centerLabel))
          : null,
      ])) : null,
    ]);
  };

  // ============================================================================
  //  ProgressBar — wrapper de <ProgressBar> PrimeVue (color via :pt)
  // ============================================================================
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

  // ============================================================================
  //  GroupedBarChart — multiplas series side-by-side (ex.: entradas vs saidas)
  //  attrs: { labels: [...], datasets: [{ data, color, label }], height }
  // ============================================================================
  const GroupedBarChart = makeChartComp('GroupedBarChart',
    (attrs) => {
      const labels = attrs.labels || [];
      const datasets = attrs.datasets || [];
      return {
        type: 'bar',
        data: {
          labels,
          datasets: datasets.map((ds) => ({
            label: ds.label || '',
            data: ds.data,
            backgroundColor: resolveColor(ds.color || 'var(--primary)'),
            borderWidth: 0,
            borderRadius: 3,
            borderSkipped: false,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 320 },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: withAlpha('var(--foreground-muted)', 1), font: { size: 10.5 } },
            },
            y: {
              grid: { color: withAlpha('var(--border-subtle)', 1), drawTicks: false },
              border: { display: false },
              ticks: {
                color: withAlpha('var(--foreground-subtle)', 1),
                font: { size: 10.5 },
                callback: (v) => (attrs.formatY ? attrs.formatY(v) : v),
                maxTicksLimit: 5,
              },
              beginAtZero: true,
            },
          },
        },
      };
    },
    (attrs) => {
      const hh = attrs.height != null ? Number(attrs.height) : 220;
      return { wrapper: { width: '100%', height: hh + 'px', position: 'relative' }, canvas: {} };
    },
  );

  // ============================================================================
  //  StackedBarChart — multiplas series empilhadas (ex.: canais por dia)
  // ============================================================================
  const StackedBarChart = makeChartComp('StackedBarChart',
    (attrs) => {
      const labels = attrs.labels || [];
      const datasets = attrs.datasets || [];
      return {
        type: 'bar',
        data: {
          labels,
          datasets: datasets.map((ds) => ({
            label: ds.label || '',
            data: ds.data,
            backgroundColor: resolveColor(ds.color || 'var(--primary)'),
            borderWidth: 0,
            borderRadius: 0,
            borderSkipped: false,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 320 },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              border: { display: false },
              ticks: { color: withAlpha('var(--foreground-subtle)', 1), font: { size: 9.5 } },
            },
            y: {
              stacked: true,
              grid: { color: withAlpha('var(--border-subtle)', 1), drawTicks: false },
              border: { display: false },
              display: attrs.showY !== false,
              ticks: {
                color: withAlpha('var(--foreground-subtle)', 1),
                font: { size: 10 },
                maxTicksLimit: 3,
              },
              beginAtZero: true,
            },
          },
        },
      };
    },
    (attrs) => {
      const hh = attrs.height != null ? Number(attrs.height) : 220;
      return { wrapper: { width: '100%', height: hh + 'px', position: 'relative' }, canvas: {} };
    },
  );

  Object.assign(window, {
    Sparkline, LineChart, BarChart, Donut, ProgressBar,
    GroupedBarChart, StackedBarChart,
  });
})();
