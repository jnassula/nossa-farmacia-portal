// nav.js — definicao da estrutura de navegacao do portal. Lida pelo Sidebar
// e CommandPalette. icon e o nome global do componente Vue (ex.: 'IHome'),
// resolvido em runtime via <component :is="item.icon">.

(function () {
  window.NAV = [
    { group: 'Geral', items: [
      { id: 'welcome',        label: 'Boas-vindas',        icon: 'IHome' },
      { id: 'dashboard',      label: 'Painel',             icon: 'IDashboard' },
    ]},
    { group: 'Operação', items: [
      { id: 'stock',          label: 'Stock',              icon: 'IBox',       badge: 3 },
      { id: 'finance',        label: 'Finanças',           icon: 'IWallet' },
      { id: 'marketing',      label: 'Marketing',          icon: 'IMegaphone' },
      { id: 'newsroom-admin', label: 'Newsroom · Posts',   icon: 'IEdit' },
      { id: 'digital',        label: 'Canais digitais',    icon: 'IGlobe' },
    ]},
    { group: 'Gestão', items: [
      { id: 'crm',            label: 'CRM · Clientes',     icon: 'IHeart' },
      { id: 'pharma',         label: 'Farmacêutico',       icon: 'IPill' },
      { id: 'hr',             label: 'Equipa',             icon: 'IUsers' },
      { id: 'units',          label: 'Unidades',           icon: 'IBuilding' },
      { id: 'compliance',     label: 'Compliance',         icon: 'IShield' },
      { id: 'reports',        label: 'Relatórios · BI',    icon: 'IChart' },
    ]},
    { group: 'Sistema', items: [
      { id: 'settings',       label: 'Definições',         icon: 'ISettings' },
    ]},
  ];

  window.PAGE_TITLES = {
    welcome:          'Boas-vindas',
    'post-detail':    'Artigo',
    dashboard:        'Painel',
    stock:            'Stock',
    finance:          'Finanças',
    marketing:        'Marketing',
    'newsroom-admin': 'Newsroom · Gestão',
    digital:          'Canais digitais',
    crm:              'CRM · Clientes',
    pharma:           'Farmacêutico',
    hr:               'Equipa',
    units:            'Unidades',
    compliance:       'Compliance',
    reports:          'Relatórios · BI',
    settings:         'Definições',
  };
})();
