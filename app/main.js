// main.js
// Bootstrap Vue 3 (zero-build, via CDN UMD).
// - Carrega .vue em runtime via vue3-sfc-loader.
// - Regista globalmente todos os helpers Nossa (icons, primitives, charts, tweaks)
//   anexados a window por icons.js / primitives.js / charts.js / tweaks.js.
// - Regista o plugin PrimeVue (com preset Nossa) para que continue disponivel a
//   quem precisar em fases futuras; nao regista componentes PrimeVue para evitar
//   colisoes com os primitives Nossa (Card, Avatar, Tabs, Drawer, Toast, ...).

(function () {
  const Vue = window.Vue;
  const SFCLoader = window['vue3-sfc-loader'];

  if (!Vue) return console.error('[main] Vue 3 nao carregado.');
  if (!SFCLoader) return console.error('[main] vue3-sfc-loader nao carregado.');

  const { createApp, defineAsyncComponent } = Vue;
  const { loadModule } = SFCLoader;

  // -- SFC loader options ----------------------------------------------------
  const sfcOptions = {
    moduleCache: { vue: Vue },
    async getFile(url) {
      const res = await fetch(url);
      if (!res.ok) throw Object.assign(new Error(res.statusText + ' ' + url), { res });
      return { getContentData: (asBinary) => asBinary ? res.arrayBuffer() : res.text() };
    },
    addStyle(textContent) {
      const style = Object.assign(document.createElement('style'), { textContent });
      const ref = document.head.getElementsByTagName('style')[0] || null;
      document.head.insertBefore(style, ref);
    },
    log(type, ...args) {
      if (type === 'error') console.error(...args);
      else if (type === 'warn') console.warn(...args);
      else console.log(...args);
    },
  };

  const sfc = (path) => defineAsyncComponent(() => loadModule(path, sfcOptions));
  window.__sfc = sfc;
  window.__sfcOptions = sfcOptions;

  // -- Cria app e monta -----------------------------------------------------
  const app = createApp(sfc('./app/App.vue'));

  // Plugin PrimeVue (opcional). Carregado se disponivel; sem registo de
  // componentes para nao colidir com primitives Nossa (Card, Avatar, ...).
  const PrimeVuePkg = window.PrimeVue;
  const NossaPreset = window.NossaPreset;
  if (PrimeVuePkg && PrimeVuePkg.PrimeVue && typeof PrimeVuePkg.PrimeVue.install === 'function') {
    const opts = { ripple: false };
    if (NossaPreset) {
      opts.theme = {
        preset: NossaPreset,
        options: { prefix: 'p', darkModeSelector: '[data-theme="dark"]', cssLayer: false },
      };
    }
    app.use(PrimeVuePkg.PrimeVue, opts);
    if (PrimeVuePkg.ToastService) app.use(PrimeVuePkg.ToastService);
  }

  // -- Registo global de icons (window.I) -----------------------------------
  // Cada chave de window.I e exposta como `I${Name}` (ex.: ISearch, IPlus).
  if (window.I) {
    for (const [name, comp] of Object.entries(window.I)) {
      app.component('I' + name, comp);
    }
  }

  // -- Registo global de primitives -----------------------------------------
  // Card, Pill, Btn, IconBtn, Avatar, Tabs, Drawer, Modal, Toast,
  // SectionTitle, Trend, Empty.
  const PRIMITIVES = [
    'Card', 'Pill', 'Btn', 'IconBtn', 'Avatar', 'Tabs',
    'Drawer', 'Modal', 'Toast', 'SectionTitle', 'Trend', 'Empty',
    'KPI', 'Stat', 'Kpi', 'Legend', 'MiniStat',
  ];
  for (const name of PRIMITIVES) {
    if (window[name]) app.component(name, window[name]);
  }

  // -- Registo global de charts ---------------------------------------------
  const CHARTS = ['Sparkline', 'LineChart', 'BarChart', 'Donut', 'ProgressBar'];
  for (const name of CHARTS) {
    if (window[name]) app.component(name, window[name]);
  }

  // -- Registo global de tweaks ---------------------------------------------
  const TWEAKS = [
    'TweaksPanel', 'TweakSection', 'TweakRow',
    'TweakSlider', 'TweakToggle', 'TweakRadio', 'TweakSelect',
    'TweakText', 'TweakNumber', 'TweakColor', 'TweakButton',
  ];
  for (const name of TWEAKS) {
    if (window[name]) app.component(name, window[name]);
  }

  app.mount('#root');
  window.__app = app;
})();
