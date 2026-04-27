// icons.js — Lucide-style stroke icons (porta direta de icons.jsx p/ Vue 3 funcional).
// Cada icone e um componente funcional Vue que aceita as props { size, stroke } e
// repassa atributos (style, class, title, ...) para o <svg> raiz.
//
// Expõe `window.I` para que main.js possa registar todos como componentes globais
// (ISearch, IPlus, ...). Tambem expoe `window.Icon` (wrapper base) para casos
// onde se queira definir um icon ad-hoc.

(function () {
  const Vue = window.Vue;
  if (!Vue) { console.error('[icons] Vue ainda nao carregado.'); return; }
  const { h } = Vue;

  // ---- Wrapper base ---------------------------------------------------------
  // Aceita size, stroke como props; restantes atributos (style, class, title)
  // sao passados diretamente para o <svg>.
  const Icon = (props, { attrs, slots }) => {
    const size = attrs.size != null ? attrs.size : 18;
    const stroke = attrs.stroke != null ? attrs.stroke : 1.75;
    const { size: _s, stroke: _st, ...rest } = attrs;
    return h('svg', {
      ...rest,
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': stroke,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, slots.default ? slots.default() : []);
  };

  // ---- Helper para fabricar icones com paths fixos -------------------------
  // children: array de [tag, attrs] (ex.: ['circle', { cx:11, cy:11, r:7 }])
  const make = (children) => {
    return (_props, { attrs }) => {
      const size = attrs.size != null ? attrs.size : 18;
      const stroke = attrs.stroke != null ? attrs.stroke : 1.75;
      const { size: _s, stroke: _st, ...rest } = attrs;
      return h('svg', {
        ...rest,
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': stroke,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }, children.map(([tag, a]) => h(tag, a)));
    };
  };

  const I = {
    Search:        make([['circle', { cx: 11, cy: 11, r: 7 }], ['path', { d: 'M21 21l-4.3-4.3' }]]),
    Plus:          make([['path', { d: 'M12 5v14M5 12h14' }]]),
    Minus:         make([['path', { d: 'M5 12h14' }]]),
    Close:         make([['path', { d: 'M18 6L6 18M6 6l12 12' }]]),
    Check:         make([['path', { d: 'M20 6L9 17l-5-5' }]]),
    ChevronDown:   make([['path', { d: 'M6 9l6 6 6-6' }]]),
    ChevronRight:  make([['path', { d: 'M9 6l6 6-6 6' }]]),
    ChevronLeft:   make([['path', { d: 'M15 18l-6-6 6-6' }]]),
    ChevronUp:     make([['path', { d: 'M18 15l-6-6-6 6' }]]),
    ArrowUp:       make([['path', { d: 'M12 19V5M5 12l7-7 7 7' }]]),
    ArrowDown:     make([['path', { d: 'M12 5v14M19 12l-7 7-7-7' }]]),
    ArrowRight:    make([['path', { d: 'M5 12h14M12 5l7 7-7 7' }]]),
    Bell:          make([['path', { d: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9' }], ['path', { d: 'M13.73 21a2 2 0 01-3.46 0' }]]),
    Bell2:         make([['path', { d: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9' }], ['path', { d: 'M13.73 21a2 2 0 01-3.46 0' }]]),
    User:          make([['circle', { cx: 12, cy: 7, r: 4 }], ['path', { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' }]]),
    Users:         make([['path', { d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' }], ['circle', { cx: 9, cy: 7, r: 4 }], ['path', { d: 'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' }]]),
    Settings:      make([['circle', { cx: 12, cy: 12, r: 3 }], ['path', { d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' }]]),
    LogOut:        make([['path', { d: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4' }], ['path', { d: 'M16 17l5-5-5-5M21 12H9' }]]),
    Mail:          make([['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2 }], ['path', { d: 'M3 7l9 6 9-6' }]]),
    Lock:          make([['rect', { x: 5, y: 11, width: 14, height: 9, rx: 2 }], ['path', { d: 'M8 11V7a4 4 0 118 0v4' }]]),
    Eye:           make([['path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z' }], ['circle', { cx: 12, cy: 12, r: 3 }]]),
    EyeOff:        make([['path', { d: 'M17.94 17.94A10.06 10.06 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24' }], ['path', { d: 'M1 1l22 22' }]]),
    Home:          make([['path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2z' }]]),
    Dashboard:     make([['rect', { x: 3,  y: 3,  width: 7, height: 9, rx: 1.5 }], ['rect', { x: 14, y: 3,  width: 7, height: 5, rx: 1.5 }], ['rect', { x: 14, y: 12, width: 7, height: 9, rx: 1.5 }], ['rect', { x: 3,  y: 16, width: 7, height: 5, rx: 1.5 }]]),
    Wallet:        make([['path', { d: 'M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4' }], ['path', { d: 'M4 6v12a2 2 0 002 2h14v-4' }], ['path', { d: 'M18 12a2 2 0 000 4h4v-4z' }]]),
    Megaphone:     make([['path', { d: 'M3 11l18-7v16l-18-7z' }], ['path', { d: 'M11 11v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6' }]]),
    Globe:         make([['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' }]]),
    Box:           make([['path', { d: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' }], ['path', { d: 'M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12' }]]),
    Briefcase:     make([['rect', { x: 2, y: 7, width: 20, height: 14, rx: 2 }], ['path', { d: 'M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16' }]]),
    Heart:         make([['path', { d: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' }]]),
    Pill:          make([['path', { d: 'M10.5 20.5a7 7 0 01-9.9-9.9l8.49-8.49a7 7 0 119.9 9.9z' }], ['path', { d: 'M8.5 8.5l7 7' }]]),
    Shield:        make([['path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }]]),
    Building:      make([['rect', { x: 4, y: 2, width: 16, height: 20, rx: 1.5 }], ['path', { d: 'M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01' }]]),
    Chart:         make([['path', { d: 'M3 3v18h18' }], ['path', { d: 'M7 14l4-4 4 4 5-5' }]]),
    Filter:        make([['path', { d: 'M22 3H2l8 9.46V19l4 2v-8.54z' }]]),
    Download:      make([['path', { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' }], ['path', { d: 'M7 10l5 5 5-5M12 15V3' }]]),
    Upload:        make([['path', { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' }], ['path', { d: 'M17 8l-5-5-5 5M12 3v12' }]]),
    Calendar:      make([['rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }], ['path', { d: 'M16 2v4M8 2v4M3 10h18' }]]),
    Clock:         make([['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 6v6l4 2' }]]),
    Alert:         make([['path', { d: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' }], ['path', { d: 'M12 9v4M12 17h.01' }]]),
    Info:          make([['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M12 16v-4M12 8h.01' }]]),
    Trending:      make([['path', { d: 'M23 6l-9.5 9.5-5-5L1 18' }], ['path', { d: 'M17 6h6v6' }]]),
    TrendingDown:  make([['path', { d: 'M23 18l-9.5-9.5-5 5L1 6' }], ['path', { d: 'M17 18h6v-6' }]]),
    More:          make([['circle', { cx: 12, cy: 12, r: 1.5, fill: 'currentColor' }], ['circle', { cx: 19, cy: 12, r: 1.5, fill: 'currentColor' }], ['circle', { cx: 5,  cy: 12, r: 1.5, fill: 'currentColor' }]]),
    Edit:          make([['path', { d: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7' }], ['path', { d: 'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' }]]),
    Trash:         make([['path', { d: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' }]]),
    Star:          make([['path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z' }]]),
    Map:           make([['path', { d: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z' }], ['path', { d: 'M8 2v16M16 6v16' }]]),
    Pin:           make([['path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' }], ['circle', { cx: 12, cy: 10, r: 3 }]]),
    Package:       make([['line', { x1: 16.5, y1: 9.4, x2: 7.5, y2: 4.21 }], ['path', { d: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' }], ['polyline', { points: '3.27 6.96 12 12.01 20.73 6.96' }], ['line', { x1: 12, y1: 22.08, x2: 12, y2: 12 }]]),
    RefreshCw:     make([['path', { d: 'M23 4v6h-6M1 20v-6h6' }], ['path', { d: 'M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15' }]]),
    Tag:           make([['path', { d: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z' }], ['path', { d: 'M7 7h.01' }]]),
    Truck:         make([['rect', { x: 1, y: 3, width: 15, height: 13 }], ['path', { d: 'M16 8h4l3 3v5h-7' }], ['circle', { cx: 5.5,  cy: 18.5, r: 2.5 }], ['circle', { cx: 18.5, cy: 18.5, r: 2.5 }]]),
    Receipt:       make([['path', { d: 'M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z' }], ['path', { d: 'M8 7h8M8 11h8M8 15h5' }]]),
    Bank:          make([['path', { d: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3' }]]),
    Sparkle:       make([['path', { d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z' }]]),
    Command:       make([['path', { d: 'M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z' }]]),
    Menu:          make([['path', { d: 'M3 12h18M3 6h18M3 18h18' }]]),
    Sidebar:       make([['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }], ['path', { d: 'M9 3v18' }]]),
    Help:          make([['circle', { cx: 12, cy: 12, r: 10 }], ['path', { d: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01' }]]),
    Sun:           make([['circle', { cx: 12, cy: 12, r: 4 }], ['path', { d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' }]]),
    Moon:          make([['path', { d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' }]]),
    Phone:         make([['path', { d: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z' }]]),
    Bolt:          make([['path', { d: 'M13 2L3 14h9l-1 8 10-12h-9z' }]]),
    Link:          make([['path', { d: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' }], ['path', { d: 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' }]]),
    GraphUp:       make([['path', { d: 'M3 3v18h18' }], ['path', { d: 'M19 9l-5 5-4-4-3 3' }]]),
    Activity:      make([['path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2' }]]),
    Inbox:         make([['path', { d: 'M22 12h-6l-2 3h-4l-2-3H2' }], ['path', { d: 'M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z' }]]),
    Wind:          make([['path', { d: 'M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2' }]]),
    Graduation:    make([['path', { d: 'M22 10L12 5 2 10l10 5 10-5z' }], ['path', { d: 'M6 12v5c3 3 9 3 12 0v-5' }]]),
    Book:          make([['path', { d: 'M4 19.5A2.5 2.5 0 016.5 17H20' }], ['path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' }]]),
    File:          make([['path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }], ['path', { d: 'M14 2v6h6' }]]),
    Bookmark:      make([['path', { d: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' }]]),
    MessageCircle: make([['path', { d: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8z' }]]),
    ThumbsUp:      make([['path', { d: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3z' }], ['path', { d: 'M7 22V11' }]]),
    Image:         make([['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }], ['circle', { cx: 8.5, cy: 8.5, r: 1.5 }], ['path', { d: 'M21 15l-5-5L5 21' }]]),
    Bold:          make([['path', { d: 'M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z' }], ['path', { d: 'M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z' }]]),
    Italic:        make([['path', { d: 'M19 4h-9M14 20H5M15 4L9 20' }]]),
    List:          make([['path', { d: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' }]]),
    Quote:         make([['path', { d: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z' }], ['path', { d: 'M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z' }]]),
    Save:          make([['path', { d: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z' }], ['path', { d: 'M17 21v-8H7v8M7 3v5h8' }]]),
    Eur:           make([['path', { d: 'M4 10h12M4 14h9' }], ['path', { d: 'M19 5a7 7 0 100 14' }]]),
    Cart:          make([['circle', { cx: 9,  cy: 21, r: 1 }], ['circle', { cx: 20, cy: 21, r: 1 }], ['path', { d: 'M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6' }]]),
    Stethoscope:   make([['path', { d: 'M11 2v2M5 2v2M5 3h6v6a3 3 0 01-6 0V3z' }], ['path', { d: 'M8 14a6 6 0 0012 0v-3' }], ['circle', { cx: 20, cy: 10, r: 2 }]]),
  };

  window.I = I;
  window.Icon = Icon;
})();
