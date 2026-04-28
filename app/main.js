// main.js
// Bootstrap Vue 3 + PrimeVue 4 (zero-build, via CDN UMD).
// - Carrega .vue em runtime via vue3-sfc-loader.
// - Regista o plugin PrimeVue (com preset Nossa) e todos os componentes
//   PrimeVue mais usados como globais.
// - Tambem regista helpers Nossa (icons, primitives, charts, tweaks). Para
//   nomes que conflitam com PrimeVue (Card, Avatar, Tabs, Drawer, Toast,
//   ProgressBar) a migracao acontece por fases — ate todos os SFCs passarem
//   a usar a API PrimeVue, alguns continuam registados em duplicado e a
//   ultima registo vence (ver bloco PRIMITIVES_REMAINING abaixo).

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

  // -- Plugin PrimeVue + ToastService ---------------------------------------
  const PrimeVuePkg = window.PrimeVue;
  const NossaPreset = window.NossaPreset;
  if (!PrimeVuePkg || !PrimeVuePkg.PrimeVue || typeof PrimeVuePkg.PrimeVue.install !== 'function') {
    return console.error('[main] PrimeVue plugin nao disponivel.');
  }
  const opts = { ripple: false };
  if (NossaPreset) {
    opts.theme = {
      preset: NossaPreset,
      options: { prefix: 'p', darkModeSelector: '[data-theme="dark"]', cssLayer: false },
    };
  }
  app.use(PrimeVuePkg.PrimeVue, opts);
  if (PrimeVuePkg.ToastService) app.use(PrimeVuePkg.ToastService);
  if (PrimeVuePkg.ConfirmationService) app.use(PrimeVuePkg.ConfirmationService);

  // -- Registo global de componentes PrimeVue --------------------------------
  // Nomes correspondem a componentes oficiais PrimeVue 4. Os SFCs usam-nos
  // directamente em templates (ex.: <Button>, <Tag>, <DataTable> + <Column>).
  const PRIMEVUE_COMPS = [
    // Buttons / inputs basicos
    'Button', 'Tag', 'Avatar', 'AvatarGroup', 'Badge', 'Chip',
    'InputText', 'InputNumber', 'Textarea', 'Password',
    'Checkbox', 'RadioButton', 'ToggleSwitch', 'ToggleButton',
    'Select', 'MultiSelect', 'AutoComplete', 'CascadeSelect',
    'DatePicker', 'ColorPicker', 'Slider', 'Rating', 'SelectButton',
    'FileUpload',
    // Containers / overlays
    'Card', 'Panel', 'Fieldset', 'Divider', 'Splitter', 'SplitterPanel',
    'Dialog', 'Drawer', 'Popover', 'Tooltip',
    // Data
    'DataTable', 'Column', 'ColumnGroup', 'Row', 'TreeTable',
    'DataView', 'OrderList', 'PickList', 'VirtualScroller',
    'Paginator',
    // Tabs / steppers / accordions
    'Tabs', 'TabList', 'Tab', 'TabPanels', 'TabPanel',
    'Stepper', 'Step', 'StepList', 'StepItem', 'StepPanels', 'StepPanel',
    'Accordion', 'AccordionPanel', 'AccordionHeader', 'AccordionContent',
    // Menus
    'Menu', 'Menubar', 'TieredMenu', 'ContextMenu', 'PanelMenu',
    'MegaMenu', 'Breadcrumb',
    // Feedback
    'Toast', 'Message', 'InlineMessage', 'ProgressBar', 'ProgressSpinner',
    'Skeleton',
    // Misc
    'Chart', 'Image', 'Galleria', 'IconField', 'InputIcon',
    'IftaLabel', 'FloatLabel',
  ];
  for (const name of PRIMEVUE_COMPS) {
    const comp = PrimeVuePkg[name];
    if (comp) app.component(name, comp.default || comp);
  }

  // -- Registo global de icons (window.I) -----------------------------------
  // Cada chave de window.I e exposta como `I${Name}` (ex.: ISearch, IPlus).
  if (window.I) {
    for (const [name, comp] of Object.entries(window.I)) {
      app.component('I' + name, comp);
    }
  }

  // -- Registo global de primitives Nossa ainda nao migrados ----------------
  // Estes componentes sao especificos do dominio Nossa e nao tem equivalente
  // PrimeVue (ou tem-no com aspecto muito diferente). Sao registados DEPOIS
  // do PrimeVue, por isso para nomes em conflito (Card, Avatar, Drawer,
  // Toast, Tabs, ProgressBar) a versao Nossa vence — sera removida da lista
  // a medida que cada fase de migracao for concluida.
  const PRIMITIVES_REMAINING = [
    // Sem equivalente directo em PrimeVue:
    'SectionTitle', 'Trend', 'Empty',
    'KPI', 'Stat', 'Kpi', 'Legend', 'MiniStat',
    // Em conflito com PrimeVue — vai sendo removido por fase:
    // (migrados: Btn->Button, Pill->Tag, IconBtn->Button text, Tabs->SelectButton,
    //  Drawer->Drawer, Toast->ToastService+<Toast>)
    'Card', 'Avatar', 'ProgressBar',
  ];
  for (const name of PRIMITIVES_REMAINING) {
    if (window[name]) app.component(name, window[name]);
  }

  // -- Registo global de charts ---------------------------------------------
  const CHARTS = [
    'Sparkline', 'LineChart', 'BarChart', 'Donut', 'ProgressBar',
    'GroupedBarChart', 'StackedBarChart',
  ];
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
