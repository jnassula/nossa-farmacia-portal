// data.js — mock data for Nossa Farmácia Portal
window.PORTAL_DATA = (() => {
  const pharmacies = [
    { id: 'lx-baixa', name: 'Farmácia Nossa Baixa',     city: 'Lisboa',  district: 'Baixa-Chiado',   lat: 38.710, lng: -9.139, manager: 'Inês Carvalho',  phone: '+351 213 421 980', revenue: 184320, growth:  6.8, status: 'top'  },
    { id: 'lx-belem', name: 'Farmácia Nossa Belém',     city: 'Lisboa',  district: 'Belém',          lat: 38.696, lng: -9.207, manager: 'Tiago Almeida',  phone: '+351 213 654 110', revenue: 142890, growth:  3.4, status: 'good' },
    { id: 'lx-parq',  name: 'Farmácia Nossa Parque',    city: 'Lisboa',  district: 'Parque das Nações', lat: 38.768, lng: -9.094, manager: 'Sofia Mendes',  phone: '+351 218 950 410', revenue: 156410, growth:  4.9, status: 'good' },
    { id: 'lx-alva',  name: 'Farmácia Nossa Alvalade',  city: 'Lisboa',  district: 'Alvalade',       lat: 38.755, lng: -9.144, manager: 'Rui Tavares',    phone: '+351 217 950 220', revenue:  98740, growth: -1.2, status: 'watch'},
    { id: 'pt-bv',    name: 'Farmácia Nossa Boavista',  city: 'Porto',   district: 'Boavista',       lat: 41.157, lng: -8.640, manager: 'Marta Pinto',    phone: '+351 226 091 880', revenue: 173220, growth:  5.6, status: 'top'  },
    { id: 'pt-rb',    name: 'Farmácia Nossa Ribeira',   city: 'Porto',   district: 'Ribeira',        lat: 41.140, lng: -8.612, manager: 'Diogo Faria',    phone: '+351 222 088 990', revenue: 121450, growth:  2.1, status: 'good' },
    { id: 'pt-fz',    name: 'Farmácia Nossa Foz',       city: 'Porto',   district: 'Foz do Douro',   lat: 41.146, lng: -8.671, manager: 'Helena Costa',   phone: '+351 226 180 540', revenue: 134870, growth:  3.8, status: 'good' },
    { id: 'br-cv',    name: 'Farmácia Nossa Cávado',    city: 'Braga',   district: 'Centro',         lat: 41.550, lng: -8.420, manager: 'Pedro Antunes',  phone: '+351 253 215 700', revenue:  87650, growth:  0.4, status: 'watch'},
    { id: 'cb-ses',   name: 'Farmácia Nossa Sé',        city: 'Coimbra', district: 'Sé Nova',        lat: 40.208, lng: -8.429, manager: 'Cláudia Reis',   phone: '+351 239 410 220', revenue:  92410, growth:  2.6, status: 'good' },
    { id: 'av-glr',   name: 'Farmácia Nossa Glicínias', city: 'Aveiro',  district: 'Glicínias',      lat: 40.633, lng: -8.659, manager: 'João Rocha',     phone: '+351 234 380 110', revenue:  78920, growth:  1.1, status: 'good' },
    { id: 'fr-mar',   name: 'Farmácia Nossa Marina',    city: 'Faro',    district: 'Marina',         lat: 37.018, lng: -7.930, manager: 'Bruno Lopes',    phone: '+351 289 803 670', revenue:  68310, growth: -2.8, status: 'watch'},
    { id: 'st-gr',    name: 'Farmácia Nossa Giraldo',   city: 'Évora',   district: 'Praça do Giraldo', lat: 38.571, lng: -7.913, manager: 'Ana Brito',     phone: '+351 266 700 440', revenue:  72540, growth:  3.0, status: 'good' },
  ];

  const topProducts = [
    { id: 1, name: 'Ben-u-ron 1000mg 20cp',     category: 'Analgésico',    units: 1842, revenue: 9210,  growth:  8.4 },
    { id: 2, name: 'Voltaren Emulgel 100g',      category: 'Anti-inflamatório', units: 1210, revenue: 12450, growth:  4.2 },
    { id: 3, name: 'Cêgripe 20cp',                category: 'Constipação',   units:  998, revenue: 5980,  growth: 12.1 },
    { id: 4, name: 'Brufen 600mg 20cp',           category: 'Analgésico',    units:  954, revenue: 4620,  growth: -1.7 },
    { id: 5, name: 'Aerius 5mg 20cp',             category: 'Antialérgico',  units:  812, revenue: 7280,  growth:  6.5 },
  ];

  const alerts = [
    { id: 'a1', kind: 'stock',   sev: 'danger',  title: 'Stock crítico',         desc: 'Ben-u-ron 1000mg 20cp · 4 unidades em Belém', time: 'há 12 min' },
    { id: 'a2', kind: 'expiry',  sev: 'warning', title: 'Validade < 60 dias',     desc: '32 produtos a expirar até 25/06 · grupo',     time: 'há 1 h' },
    { id: 'a3', kind: 'finance', sev: 'warning', title: 'Pagamento pendente',     desc: 'Cooprofar · 12.840 € · vence em 3 dias',      time: 'há 2 h' },
    { id: 'a4', kind: 'reg',     sev: 'info',    title: 'Renovação certificado',  desc: 'INFARMED · Foz do Douro · até 30/05',          time: 'hoje' },
    { id: 'a5', kind: 'stock',   sev: 'danger',  title: 'Rotura iminente',        desc: 'Voltaren Emulgel 100g · 2 unidades em Sé Nova', time: 'há 3 h' },
  ];

  const recentActivity = [
    { id: 1, who: 'Inês Carvalho', what: 'fechou caixa do dia',                    where: 'Baixa',     amount: '4.218 €',  time: '17:42' },
    { id: 2, who: 'Tiago Almeida', what: 'criou encomenda a OCP',                  where: 'Belém',     amount: '8.940 €',  time: '17:18' },
    { id: 3, who: 'Sistema',        what: 'sincronizou pedidos Glovo',              where: 'Boavista',  amount: '12 itens', time: '16:55' },
    { id: 4, who: 'Marta Pinto',   what: 'aprovou transferência inter-farmácia',  where: 'Boavista → Foz', amount: '38 itens', time: '16:30' },
    { id: 5, who: 'Rui Tavares',   what: 'lançou campanha "Primavera Saudável"',  where: 'Grupo',     amount: '—',         time: '15:12' },
    { id: 6, who: 'Sofia Mendes',  what: 'registou serviço de tensão arterial',   where: 'Parque',    amount: '12 €',     time: '14:48' },
  ];

  // Sales timeseries — 12 months
  const salesMonthly = [
    { m: 'Mai',  v: 412 }, { m: 'Jun',  v: 438 }, { m: 'Jul',  v: 461 },
    { m: 'Ago',  v: 425 }, { m: 'Set',  v: 472 }, { m: 'Out',  v: 488 },
    { m: 'Nov',  v: 510 }, { m: 'Dez',  v: 562 }, { m: 'Jan',  v: 498 },
    { m: 'Fev',  v: 524 }, { m: 'Mar',  v: 558 }, { m: 'Abr',  v: 591 },
  ];
  const salesDaily = [228, 251, 264, 271, 245, 198, 142, 232, 268, 281, 295, 274, 242, 178, 256, 289, 310, 302, 278, 224, 168, 270, 295, 312, 308, 286, 244, 178, 280, 302];

  // Stock items
  const stockItems = [
    { sku: 'PT-0921', name: 'Ben-u-ron 1000mg 20cp',         brand: 'Bene-Farmacêutica', category: 'Analgésico',     stock: 184, min:  60, expiry: '2027-03-15', price:  4.95, status: 'ok'  },
    { sku: 'PT-0481', name: 'Voltaren Emulgel 100g',          brand: 'GSK',                category: 'Anti-inflamatório', stock:  12, min:  20, expiry: '2026-09-22', price: 11.50, status: 'low' },
    { sku: 'PT-1142', name: 'Cêgripe 20cp',                   brand: 'Tecnimede',          category: 'Constipação',    stock:  78, min:  40, expiry: '2026-12-08', price:  6.20, status: 'ok'  },
    { sku: 'PT-2233', name: 'Brufen 600mg 20cp',              brand: 'Mylan',              category: 'Analgésico',     stock:  45, min:  30, expiry: '2026-07-30', price:  4.80, status: 'soon'},
    { sku: 'PT-0188', name: 'Aerius 5mg 20cp',                brand: 'Bayer',              category: 'Antialérgico',   stock: 132, min:  50, expiry: '2027-08-14', price:  9.10, status: 'ok'  },
    { sku: 'PT-0760', name: 'Vitamina D3 1000UI 60cp',        brand: 'Mylan',              category: 'Suplemento',     stock:   8, min:  25, expiry: '2027-02-01', price: 13.40, status: 'low' },
    { sku: 'PT-3380', name: 'Bepanthene Pomada 30g',          brand: 'Bayer',              category: 'Dermocosmética', stock:  92, min:  40, expiry: '2027-11-30', price:  5.85, status: 'ok'  },
    { sku: 'PT-4501', name: 'Daflon 500mg 60cp',              brand: 'Servier',            category: 'Vascular',       stock:  17, min:  20, expiry: '2026-06-18', price: 19.20, status: 'soon'},
    { sku: 'PT-0033', name: 'Couché Ortodôntico Premium',     brand: 'Oral-B',             category: 'Higiene Oral',   stock:  64, min:  20, expiry: '2028-01-01', price:  7.50, status: 'ok'  },
    { sku: 'PT-2120', name: 'Imodium 2mg 20cp',               brand: 'Johnson & Johnson',  category: 'Digestivo',      stock:  41, min:  20, expiry: '2026-10-12', price:  5.10, status: 'ok'  },
    { sku: 'PT-7702', name: 'Locatop 0,1% creme 30g',         brand: 'Pierre Fabre',       category: 'Dermatológico',  stock:   5, min:  15, expiry: '2026-08-20', price:  8.40, status: 'low' },
    { sku: 'PT-9911', name: 'Lasilix 40mg 60cp',              brand: 'Sanofi',             category: 'Cardiovascular', stock:  28, min:  18, expiry: '2027-04-05', price:  4.30, status: 'ok'  },
  ];

  // Receivables
  const receivables = [
    { id: 'SNS-04261', counterparty: 'SNS · Comparticipação', type: 'Reembolso',    amount: 18420, due: '2026-05-08', status: 'pending', days: 12 },
    { id: 'MED-00821', counterparty: 'Médis',                  type: 'Seguradora',   amount:  4280, due: '2026-05-12', status: 'pending', days: 16 },
    { id: 'ADS-00118', counterparty: 'ADSE',                   type: 'Sub-sistema',  amount:  9810, due: '2026-04-28', status: 'overdue', days:  -2},
    { id: 'MMS-00091', counterparty: 'Multicare',              type: 'Seguradora',   amount:  3120, due: '2026-05-20', status: 'pending', days: 24 },
    { id: 'SNS-04190', counterparty: 'SNS · Comparticipação', type: 'Reembolso',    amount: 22390, due: '2026-04-22', status: 'paid',    days:-8 },
    { id: 'PRT-00540', counterparty: 'PT/CTT · Protocolo',     type: 'Protocolo',    amount:  1840, due: '2026-05-02', status: 'pending', days:  6 },
    { id: 'AVS-00220', counterparty: 'Advance Care',           type: 'Seguradora',   amount:  2560, due: '2026-05-15', status: 'pending', days: 19 },
  ];

  // Payables
  const payables = [
    { id: 'OCP-1881',   counterparty: 'OCP Portugal',        type: 'Fornecedor',  amount: 38420, due: '2026-04-30', status: 'pending', days:   0 },
    { id: 'COOP-0921',  counterparty: 'Cooprofar',            type: 'Fornecedor',  amount: 12840, due: '2026-04-29', status: 'pending', days:  -1 },
    { id: 'ALL-2204',   counterparty: 'Alliance Healthcare',   type: 'Fornecedor',  amount: 21640, due: '2026-05-06', status: 'pending', days:  10 },
    { id: 'IRT-0001',   counterparty: 'IRC · Pagamento conta', type: 'Fiscal',      amount:  8420, due: '2026-05-20', status: 'pending', days:  24 },
    { id: 'EDP-0512',   counterparty: 'EDP Comercial',         type: 'Utilities',   amount:  2180, due: '2026-04-26', status: 'overdue', days:  -4 },
    { id: 'RND-0021',   counterparty: 'Imobiliária Baixa',     type: 'Renda',       amount:  4500, due: '2026-05-01', status: 'pending', days:   5 },
    { id: 'SAL-0426',   counterparty: 'Folha de salários',     type: 'Pessoal',     amount: 84210, due: '2026-04-30', status: 'scheduled', days: 0 },
  ];

  const campaigns = [
    { id: 'c1', name: 'Primavera Saudável',     channel: 'MKT+ · SMS · IG', status: 'active',    starts: '15/04', ends: '15/05', budget: 4800, spent: 2120, roi: 3.6, reach: 18420, conv: 642 },
    { id: 'c2', name: 'Cartão Cliente · 2x pontos', channel: 'MKT+',         status: 'active',    starts: '01/04', ends: '30/04', budget: 1200, spent:  920, roi: 5.2, reach: 12410, conv: 980 },
    { id: 'c3', name: 'Saúde do Bebé',           channel: 'Email · IG',     status: 'scheduled', starts: '02/05', ends: '20/05', budget: 3200, spent:    0, roi:   0, reach:     0, conv:   0 },
    { id: 'c4', name: 'Solar SPF50 -25%',        channel: 'IG · TikTok · Loja', status: 'active',  starts: '20/04', ends: '10/05', budget: 6400, spent: 3280, roi: 2.8, reach: 24180, conv: 412 },
    { id: 'c5', name: 'Vacinação Gripe',         channel: 'Email · SMS',   status: 'ended',     starts: '01/10', ends: '15/12', budget: 2800, spent: 2740, roi: 4.1, reach: 31240, conv: 1840 },
  ];

  const channels = [
    { id: 'eshop', name: 'Loja online',  color: 'oklch(0.660 0.155 163)', orders: 482, revenue: 18420, aov: 38.2, growth:  9.4 },
    { id: 'glovo', name: 'Glovo',         color: 'oklch(0.780 0.160 78)',  orders: 312, revenue:  9810, aov: 31.4, growth: 12.8 },
    { id: 'bolt',  name: 'Bolt Food',     color: 'oklch(0.640 0.140 230)', orders: 198, revenue:  6210, aov: 31.4, growth:  6.1 },
    { id: 'uber',  name: 'Uber Eats',     color: 'oklch(0.560 0.008 180)', orders: 142, revenue:  4520, aov: 31.8, growth:  3.4 },
  ];

  const onlineOrders = [
    { id: '#A-19821', channel: 'Loja online', items: 4, value:  42.10, status: 'preparing', eta: '14:20', client: 'Maria Lopes' },
    { id: '#GL-2840', channel: 'Glovo',        items: 2, value:  18.40, status: 'in_transit', eta: '13:55', client: 'José Mota'  },
    { id: '#BL-0921', channel: 'Bolt Food',    items: 3, value:  29.80, status: 'preparing', eta: '14:08', client: 'Ana Sousa'   },
    { id: '#A-19820', channel: 'Loja online', items: 1, value:  11.20, status: 'shipped',    eta: 'amanhã', client: 'Pedro Vaz'   },
    { id: '#UE-3340', channel: 'Uber Eats',    items: 5, value:  46.50, status: 'delivered',  eta: '13:32', client: 'Rita Freitas' },
    { id: '#GL-2841', channel: 'Glovo',        items: 1, value:   9.80, status: 'cancelled',  eta: '—',     client: 'João Caldas'  },
    { id: '#A-19818', channel: 'Loja online', items: 6, value:  78.40, status: 'delivered',  eta: '12:50', client: 'Sara Neves'   },
  ];

  const notifications = [
    { id: 1, sev: 'danger',  title: 'Stock crítico em Belém',  desc: 'Ben-u-ron 1000mg · 4 unidades',  time: 'há 12 min', unread: true  },
    { id: 2, sev: 'warning', title: 'Validade < 60 dias',       desc: '32 produtos · grupo',           time: 'há 1 h',    unread: true  },
    { id: 3, sev: 'info',    title: 'Renovação INFARMED',       desc: 'Foz do Douro · 30/05',         time: 'hoje',      unread: true  },
    { id: 4, sev: 'success', title: 'Encomenda recebida',       desc: 'Alliance · 124 produtos',      time: 'há 4 h',    unread: false },
    { id: 5, sev: 'info',    title: 'Nova avaliação Google',    desc: 'Boavista · ★ 5/5',             time: 'ontem',     unread: false },
  ];

  // ── CRM · Clientes ────────────────────────────────────────────────
  const customers = [
    { id: 'c-0001', name: 'Maria Lopes Ferreira',     nif: '231 540 119', age: 42, segment: 'Cartão Ouro',  city: 'Lisboa',  joined: '2019-03',   visits: 84, spend: 2180, lastVisit: 'há 2 dias',  pharmacy: 'lx-baixa', conditions: ['Hipertensão', 'Colesterol'], avatar: 'oklch(0.660 0.155 163)' },
    { id: 'c-0002', name: 'João Caldas Pinto',         nif: '198 332 410', age: 67, segment: 'Cartão Sénior', city: 'Porto',   joined: '2014-11',   visits: 162, spend: 4810, lastVisit: 'ontem',     pharmacy: 'pt-bv',    conditions: ['Diabetes II', 'Hipertensão'], avatar: 'oklch(0.640 0.140 230)' },
    { id: 'c-0003', name: 'Sara Neves Almeida',        nif: '274 891 002', age: 31, segment: 'Cartão',        city: 'Lisboa',  joined: '2022-06',   visits:  28, spend:  640, lastVisit: 'há 5 dias',  pharmacy: 'lx-parq',  conditions: [], avatar: 'oklch(0.780 0.160 78)' },
    { id: 'c-0004', name: 'Pedro Vaz Sousa',           nif: '352 110 998', age: 54, segment: 'Cartão Ouro',   city: 'Porto',   joined: '2017-09',   visits: 110, spend: 3120, lastVisit: 'há 1 semana', pharmacy: 'pt-fz',    conditions: ['Asma'], avatar: 'oklch(0.620 0.150 27)' },
    { id: 'c-0005', name: 'Rita Freitas Mota',         nif: '410 882 331', age: 28, segment: 'Cartão',        city: 'Coimbra', joined: '2023-01',   visits:  18, spend:  410, lastVisit: 'há 3 semanas', pharmacy: 'cb-ses',  conditions: [], avatar: 'oklch(0.560 0.130 300)' },
    { id: 'c-0006', name: 'José Mota Henriques',       nif: '120 998 471', age: 71, segment: 'Cartão Sénior', city: 'Lisboa',  joined: '2011-02',   visits: 240, spend: 7820, lastVisit: 'hoje',       pharmacy: 'lx-alva',  conditions: ['DPOC', 'Hipertensão', 'Colesterol'], avatar: 'oklch(0.660 0.155 163)' },
    { id: 'c-0007', name: 'Ana Sousa Brito',           nif: '298 410 552', age: 36, segment: 'Cartão Ouro',   city: 'Lisboa',  joined: '2018-12',   visits:  72, spend: 1940, lastVisit: 'há 4 dias',  pharmacy: 'lx-baixa', conditions: ['Tiroide'], avatar: 'oklch(0.640 0.140 230)' },
    { id: 'c-0008', name: 'Hugo Marques Lima',         nif: '441 220 870', age: 49, segment: 'Cartão',        city: 'Aveiro',  joined: '2020-08',   visits:  46, spend: 1180, lastVisit: 'há 10 dias', pharmacy: 'av-glr',   conditions: ['Refluxo'], avatar: 'oklch(0.780 0.160 78)' },
    { id: 'c-0009', name: 'Cláudia Reis Antunes',      nif: '187 099 322', age: 58, segment: 'Cartão Ouro',   city: 'Évora',   joined: '2016-04',   visits: 132, spend: 3940, lastVisit: 'há 6 dias',  pharmacy: 'st-gr',    conditions: ['Hipertensão'], avatar: 'oklch(0.620 0.150 27)' },
    { id: 'c-0010', name: 'Bruno Lopes Faria',         nif: '503 218 116', age: 39, segment: 'Cartão',        city: 'Faro',    joined: '2021-07',   visits:  38, spend:  920, lastVisit: 'há 2 semanas', pharmacy: 'fr-mar',  conditions: [], avatar: 'oklch(0.560 0.130 300)' },
    { id: 'c-0011', name: 'Helena Costa Vieira',       nif: '339 481 207', age: 62, segment: 'Cartão Sénior', city: 'Porto',   joined: '2013-10',   visits: 184, spend: 5210, lastVisit: 'há 1 dia',   pharmacy: 'pt-fz',    conditions: ['Hipertensão', 'Diabetes II'], avatar: 'oklch(0.660 0.155 163)' },
    { id: 'c-0012', name: 'Tiago Almeida Mendes',      nif: '420 990 113', age: 45, segment: 'Cartão Ouro',   city: 'Braga',   joined: '2018-03',   visits:  98, spend: 2640, lastVisit: 'há 4 dias',  pharmacy: 'br-cv',    conditions: ['Colesterol'], avatar: 'oklch(0.640 0.140 230)' },
  ];

  const customerSegments = [
    { id: 'gold',   name: 'Cartão Ouro',    count: 4820, share: 18, value: 142 },
    { id: 'card',   name: 'Cartão',          count: 11240, share: 42, value: 68 },
    { id: 'senior', name: 'Cartão Sénior',  count: 6810, share: 25, value: 104 },
    { id: 'guest',  name: 'Sem cartão',      count: 4100, share: 15, value: 32 },
  ];

  // ── Farmacêutico (clínico) ────────────────────────────────────────
  const dispensingQueue = [
    { id: 'rx-19421', patient: 'Maria Lopes',      doctor: 'Dr. Coelho',    issued: '24/04', items: 3, status: 'awaiting',     priority: 'normal',  type: 'Receita eletrónica' },
    { id: 'rx-19422', patient: 'José Mota',         doctor: 'Dra. Pereira',  issued: '25/04', items: 5, status: 'in_progress',  priority: 'high',    type: 'Receita crónica'    },
    { id: 'rx-19423', patient: 'Pedro Vaz',         doctor: 'Dr. Coelho',    issued: '26/04', items: 1, status: 'awaiting',     priority: 'normal',  type: 'Receita eletrónica' },
    { id: 'rx-19424', patient: 'Sara Neves',        doctor: 'Dra. Sá',       issued: '26/04', items: 2, status: 'verified',     priority: 'normal',  type: 'Manipulado'         },
    { id: 'rx-19425', patient: 'Helena Costa',      doctor: 'Dr. Branco',    issued: '23/04', items: 4, status: 'awaiting',     priority: 'high',    type: 'Receita crónica'    },
    { id: 'rx-19426', patient: 'Cláudia Reis',      doctor: 'Dra. Pereira',  issued: '26/04', items: 2, status: 'in_progress',  priority: 'normal',  type: 'Receita eletrónica' },
  ];

  const services = [
    { id: 'sv1', name: 'Tensão arterial',         icon: 'heart',    bookings: 184, revenue:  920,  avg: '8 min',  rating: 4.8 },
    { id: 'sv2', name: 'Glicemia capilar',        icon: 'pill',     bookings: 142, revenue: 1280,  avg: '6 min',  rating: 4.7 },
    { id: 'sv3', name: 'Vacinação',                icon: 'shield',   bookings:  98, revenue: 4810,  avg: '15 min', rating: 4.9 },
    { id: 'sv4', name: 'Nutrição · consulta',     icon: 'leaf',      bookings:  42, revenue: 2520,  avg: '40 min', rating: 4.9 },
    { id: 'sv5', name: 'Cessação tabágica',        icon: 'wind',     bookings:  18, revenue: 1080,  avg: '30 min', rating: 4.6 },
    { id: 'sv6', name: 'Preparação medicação',     icon: 'package',  bookings:  64, revenue: 1920,  avg: '20 min', rating: 4.8 },
  ];

  const interactions = [
    { id: 'i1', sev: 'danger',  drug1: 'Varfarina',        drug2: 'AAS 100mg',           note: 'Risco hemorrágico aumentado',           when: 'há 8 min',  patient: 'José Mota',     resolved: false },
    { id: 'i2', sev: 'warning', drug1: 'Sinvastatina',     drug2: 'Claritromicina',      note: 'Aumenta exposição da estatina',         when: 'há 1 h',    patient: 'Pedro Vaz',     resolved: false },
    { id: 'i3', sev: 'info',    drug1: 'Omeprazol',        drug2: 'Clopidogrel',         note: 'Reduz eficácia antiagregante',          when: 'há 3 h',    patient: 'Helena Costa',  resolved: true  },
  ];

  // ── Equipa (HR) ──────────────────────────────────────────────────
  const team = [
    { id: 't-001', name: 'Inês Carvalho',  role: 'Gestora · Grupo',          pharmacy: 'lx-baixa', email: 'ines.carvalho@nossafarmacia.pt', phone: '+351 91 423 1102', join: '2018-02', shift: 'Manhã',  hours: 168, status: 'active',  avatar: 'oklch(0.660 0.155 163)', skills: ['Gestão', 'Análise', 'INFARMED'] },
    { id: 't-002', name: 'Tiago Almeida',  role: 'Diretor Técnico',           pharmacy: 'lx-belem', email: 'tiago.almeida@nossafarmacia.pt', phone: '+351 91 882 0042', join: '2017-08', shift: 'Manhã',  hours: 172, status: 'active',  avatar: 'oklch(0.640 0.140 230)', skills: ['DT', 'Manipulado'] },
    { id: 't-003', name: 'Sofia Mendes',    role: 'Farmacêutica',              pharmacy: 'lx-parq',  email: 'sofia.mendes@nossafarmacia.pt',  phone: '+351 92 110 8821', join: '2020-03', shift: 'Tarde',  hours: 168, status: 'active',  avatar: 'oklch(0.780 0.160 78)',  skills: ['Aconselhamento', 'Vacinação'] },
    { id: 't-004', name: 'Rui Tavares',     role: 'Marketing',                  pharmacy: 'lx-alva',  email: 'rui.tavares@nossafarmacia.pt',   phone: '+351 91 304 5512', join: '2021-09', shift: 'Manhã',  hours: 172, status: 'active',  avatar: 'oklch(0.620 0.150 27)',  skills: ['Campanhas', 'Cartão Cliente'] },
    { id: 't-005', name: 'Marta Pinto',     role: 'Diretora Técnica',           pharmacy: 'pt-bv',    email: 'marta.pinto@nossafarmacia.pt',    phone: '+351 93 882 1041', join: '2015-05', shift: 'Manhã',  hours: 172, status: 'active',  avatar: 'oklch(0.560 0.130 300)', skills: ['DT', 'Compras'] },
    { id: 't-006', name: 'Diogo Faria',     role: 'Farmacêutico',              pharmacy: 'pt-rb',    email: 'diogo.faria@nossafarmacia.pt',    phone: '+351 91 540 8810', join: '2019-04', shift: 'Tarde',  hours: 168, status: 'active',  avatar: 'oklch(0.660 0.155 163)', skills: ['Aconselhamento'] },
    { id: 't-007', name: 'Helena Costa',    role: 'Diretora Técnica',           pharmacy: 'pt-fz',    email: 'helena.costa@nossafarmacia.pt',   phone: '+351 91 220 4498', join: '2014-11', shift: 'Manhã',  hours: 172, status: 'leave',   avatar: 'oklch(0.640 0.140 230)', skills: ['DT', 'Pediatria'] },
    { id: 't-008', name: 'Pedro Antunes',   role: 'Farmacêutico',              pharmacy: 'br-cv',    email: 'pedro.antunes@nossafarmacia.pt', phone: '+351 91 410 8820', join: '2022-01', shift: 'Tarde',  hours: 160, status: 'active',  avatar: 'oklch(0.780 0.160 78)',  skills: ['Aconselhamento', 'Nutrição'] },
    { id: 't-009', name: 'Cláudia Reis',    role: 'Diretora Técnica',           pharmacy: 'cb-ses',   email: 'claudia.reis@nossafarmacia.pt',   phone: '+351 91 220 1182', join: '2013-06', shift: 'Manhã',  hours: 172, status: 'active',  avatar: 'oklch(0.620 0.150 27)',  skills: ['DT', 'Vacinação'] },
    { id: 't-010', name: 'João Rocha',      role: 'Farmacêutico',              pharmacy: 'av-glr',   email: 'joao.rocha@nossafarmacia.pt',     phone: '+351 91 332 4980', join: '2023-02', shift: 'Tarde',  hours: 152, status: 'active',  avatar: 'oklch(0.560 0.130 300)', skills: ['Aconselhamento'] },
    { id: 't-011', name: 'Bruno Lopes',     role: 'Diretor Técnico',           pharmacy: 'fr-mar',   email: 'bruno.lopes@nossafarmacia.pt',    phone: '+351 91 220 4811', join: '2019-10', shift: 'Manhã',  hours: 168, status: 'active',  avatar: 'oklch(0.660 0.155 163)', skills: ['DT', 'Verão'] },
    { id: 't-012', name: 'Ana Brito',       role: 'Farmacêutica',              pharmacy: 'st-gr',    email: 'ana.brito@nossafarmacia.pt',      phone: '+351 91 660 8210', join: '2020-11', shift: 'Manhã',  hours: 172, status: 'active',  avatar: 'oklch(0.640 0.140 230)', skills: ['Aconselhamento', 'Geriatria'] },
  ];

  // ── Compliance ───────────────────────────────────────────────────
  const compliance = [
    { id: 'cp1', kind: 'INFARMED',        title: 'Renovação certificado de funcionamento', pharmacy: 'pt-fz',   due: '2026-05-30', status: 'pending',  priority: 'high',   doc: 'INF-2024-0992' },
    { id: 'cp2', kind: 'RGPD',            title: 'Auditoria interna · tratamento de dados',  pharmacy: 'all',     due: '2026-06-15', status: 'in_progress', priority: 'medium', doc: 'RGPD-2026-Q2' },
    { id: 'cp3', kind: 'Manipulados',      title: 'Calibração balança analítica',             pharmacy: 'lx-belem', due: '2026-05-12', status: 'pending',  priority: 'medium', doc: 'MAN-CAL-0184' },
    { id: 'cp4', kind: 'INFARMED',        title: 'Inspeção ordinária bienal',                 pharmacy: 'pt-bv',   due: '2026-07-08', status: 'scheduled', priority: 'high',   doc: 'INF-INSP-0421' },
    { id: 'cp5', kind: 'Estupefacientes', title: 'Reconciliação trimestral',                  pharmacy: 'all',     due: '2026-04-30', status: 'pending',  priority: 'high',   doc: 'EST-2026-Q1'  },
    { id: 'cp6', kind: 'HACCP',            title: 'Verificação cadeia de frio',                pharmacy: 'lx-alva', due: '2026-05-04', status: 'in_progress', priority: 'medium', doc: 'HACCP-CF-0098' },
    { id: 'cp7', kind: 'Formação',         title: 'Reciclagem · vacinação',                    pharmacy: 'cb-ses',  due: '2026-06-20', status: 'pending',  priority: 'low',    doc: 'FORM-VAC-0440' },
    { id: 'cp8', kind: 'Ordem',            title: 'Quotas Ordem dos Farmacêuticos',            pharmacy: 'all',     due: '2026-04-30', status: 'overdue',   priority: 'high',   doc: 'OF-Q-2026'    },
  ];

  // ── Newsroom · Posts ─────────────────────────────────────────────
  const postCategories = [
    { id: 'all',          label: 'Todos',           color: 'var(--foreground)' },
    { id: 'news',         label: 'Notícias',        color: 'oklch(0.55 0.16 230)' },
    { id: 'campaign',     label: 'Campanhas',       color: 'var(--brand-emerald-600)' },
    { id: 'training',     label: 'Formação',        color: 'oklch(0.55 0.16 285)' },
    { id: 'announcement', label: 'Comunicado',      color: 'oklch(0.50 0.20 27)' },
    { id: 'memo',         label: 'Nota interna',    color: 'oklch(0.55 0.10 200)' },
    { id: 'regulation',   label: 'Regulamentação',  color: 'oklch(0.50 0.16 78)' },
    { id: 'highlight',    label: 'Destaque',        color: 'oklch(0.55 0.18 320)' },
  ];

  const posts = [
    {
      id: 'p-001',
      title: 'Lançamento da campanha "Primavera Saudável" em todas as farmácias',
      excerpt: 'Reforçamos a aposta em prevenção e bem-estar com uma campanha multicanal que arranca a 15 de abril. Inclui descontos em vitamínicos, rastreios gratuitos e materiais POS.',
      category: 'campaign',
      author: { name: 'Direção de Marketing', initials: 'DM', role: 'Equipa Marketing · Grupo' },
      published: '2026-04-22T09:00:00',
      readMin: 4,
      pinned: true,
      featured: true,
      views: 1842,
      reactions: 184,
      comments: 23,
      coverGradient: 'linear-gradient(135deg, oklch(0.65 0.15 163) 0%, oklch(0.78 0.15 145) 60%, oklch(0.92 0.10 110) 100%)',
      coverIcon: 'megaphone',
      tags: ['marketing', 'primavera', 'rastreios'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A campanha **Primavera Saudável** arranca oficialmente a 15 de abril e prolonga-se até 15 de maio em todas as 12 farmácias do grupo. Esta é uma das nossas iniciativas mais ambiciosas do ano, com foco na prevenção, na nutrição e no bem-estar das nossas comunidades.' },
        { type: 'h2', text: 'O que esperar' },
        { type: 'ul', items: [
          'Descontos de 15-25% em mais de 240 produtos vitamínicos e suplementação',
          'Rastreios gratuitos de tensão arterial, glicemia e IMC todas as quartas-feiras',
          'Webinar com nutricionista convidada · 28 de abril às 18h',
          'Materiais POS atualizados (montras, displays, flyers) a chegar até 12/04',
        ]},
        { type: 'quote', text: 'Esta campanha posiciona-nos como o parceiro de saúde de proximidade. Cada interação é uma oportunidade.', author: 'Inês Carvalho · Direção do Grupo' },
        { type: 'h2', text: 'O que precisa de fazer' },
        { type: 'p', text: 'Cada farmácia receberá o kit de campanha até 12/04. Por favor confirmem a receção via Nossa AI ou contactem o Marketing pelo canal habitual. As formações breves (15 min) decorrem online a 14/04 às 9h e 17h — apareçam.' },
        { type: 'p', text: 'Os indicadores de campanha serão acompanhados em tempo real no painel **Marketing → Campanhas**. Vamos partilhar os destaques semanalmente.' },
      ],
    },
    {
      id: 'p-002',
      title: 'Atualização INFARMED: novas regras para receção de psicotrópicos',
      excerpt: 'Entram em vigor a 2 de maio as novas guidelines de receção, conferência e armazenamento de medicamentos psicotrópicos e estupefacientes. Resumo prático e checklist em anexo.',
      category: 'regulation',
      author: { name: 'Dra. Helena Costa', initials: 'HC', role: 'Diretora Técnica · Foz do Douro' },
      published: '2026-04-21T14:30:00',
      readMin: 6,
      pinned: true,
      featured: false,
      views: 1124,
      reactions: 87,
      comments: 14,
      coverGradient: 'linear-gradient(135deg, oklch(0.50 0.16 78) 0%, oklch(0.72 0.14 65) 100%)',
      coverIcon: 'shield',
      tags: ['INFARMED', 'compliance', 'psicotrópicos'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A 2 de maio entram em vigor alterações ao circuito de receção e armazenamento de psicotrópicos publicadas no Despacho 4321/2026. Este post resume os pontos práticos e o que muda no dia-a-dia.' },
        { type: 'h2', text: 'Principais alterações' },
        { type: 'ul', items: [
          'Conferência obrigatória por dois farmacêuticos em todas as receções',
          'Registo no SIFARMA do lote, validade e cofre de destino no momento da receção',
          'Reconciliação semanal (em vez de quinzenal) das existências físicas vs. registo',
          'Acesso ao cofre passa a exigir dupla autenticação até 1/06',
        ]},
        { type: 'h2', text: 'Checklist diário' },
        { type: 'p', text: 'Disponibilizámos uma checklist nova no módulo **Compliance → Estupefacientes**. Imprimam e fixem junto do cofre. As DTs devem assinar diariamente.' },
      ],
    },
    {
      id: 'p-003',
      title: 'Formação obrigatória: Vacinação contra a gripe sazonal 2026/27',
      excerpt: 'Inscrições abertas para a formação anual de vacinação. Sessões presenciais em Lisboa e Porto, ou online em direto. Acreditação Ordem dos Farmacêuticos · 8 horas.',
      category: 'training',
      author: { name: 'Pedro Antunes', initials: 'PA', role: 'Coordenador de Formação' },
      published: '2026-04-20T10:15:00',
      readMin: 3,
      pinned: false,
      featured: true,
      views: 892,
      reactions: 64,
      comments: 9,
      coverGradient: 'linear-gradient(135deg, oklch(0.55 0.16 285) 0%, oklch(0.72 0.13 270) 100%)',
      coverIcon: 'graduation',
      tags: ['formação', 'vacinação', 'OF'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A formação anual de **administração de vacinas** está acreditada pela Ordem dos Farmacêuticos com 8 horas e é obrigatória para todos os farmacêuticos que pretendem administrar vacinas na época 2026/27.' },
        { type: 'h2', text: 'Datas e formatos' },
        { type: 'ul', items: [
          'Lisboa · 13 de maio · presencial · Hotel Marriott · 30 vagas',
          'Porto · 20 de maio · presencial · Holiday Inn Boavista · 25 vagas',
          'Online em direto · 27 de maio · ilimitado',
        ]},
        { type: 'p', text: 'As inscrições fazem-se em **Equipa → Formação** até 5 de maio. Cada DT deve garantir cobertura para a sua farmácia.' },
      ],
    },
    {
      id: 'p-004',
      title: 'Boavista é a farmácia do mês · março 2026',
      excerpt: 'Crescimento de 5,6%, NPS de 78 e a maior taxa de adesão ao Cartão Cliente do grupo. Parabéns a toda a equipa liderada por Marta Pinto.',
      category: 'highlight',
      author: { name: 'Inês Carvalho', initials: 'IC', role: 'Direção do Grupo' },
      published: '2026-04-18T16:00:00',
      readMin: 2,
      pinned: false,
      featured: false,
      views: 1486,
      reactions: 312,
      comments: 41,
      coverGradient: 'linear-gradient(135deg, oklch(0.55 0.18 320) 0%, oklch(0.78 0.16 350) 100%)',
      coverIcon: 'sparkle',
      tags: ['destaque', 'NPS', 'cartão'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'É com enorme satisfação que destacamos a **Farmácia Nossa Boavista** como a unidade do mês de março. Os resultados falam por si: receita 173.220 €, crescimento de 5,6% face ao mês anterior, NPS de 78 e 412 novas inscrições no Cartão Cliente.' },
        { type: 'quote', text: 'A equipa abraçou o desafio do novo programa de fidelização e os resultados refletem isso. Estamos felizes e continuamos a trabalhar.', author: 'Marta Pinto · DT Boavista' },
        { type: 'p', text: 'Parabéns a toda a equipa: Marta Pinto, Diogo Faria, Helena Costa e auxiliares. Um exemplo para o grupo.' },
      ],
    },
    {
      id: 'p-005',
      title: 'Encerramento prolongado · feriados de 25 de abril e 1 de maio',
      excerpt: 'Mapa de escalas e farmácias de serviço durante o fim-de-semana prolongado. Verifique a sua zona e confirme escalas com o seu DT.',
      category: 'announcement',
      author: { name: 'RH · Grupo', initials: 'RH', role: 'Recursos Humanos' },
      published: '2026-04-17T11:00:00',
      readMin: 2,
      pinned: false,
      featured: false,
      views: 740,
      reactions: 28,
      comments: 4,
      coverGradient: 'linear-gradient(135deg, oklch(0.50 0.20 27) 0%, oklch(0.70 0.18 30) 100%)',
      coverIcon: 'calendar',
      tags: ['feriado', 'escala'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'O calendário de escalas para os feriados de 25 de abril e 1 de maio já está publicado em **Equipa → Escala**. Por favor verifiquem e confirmem com o vosso DT até 22/04.' },
      ],
    },
    {
      id: 'p-006',
      title: 'Nova integração com Glovo: pedidos online em tempo real',
      excerpt: 'A partir de 1 de maio, todos os pedidos Glovo aparecem automaticamente no Nossa Portal. Sem mais sincronizações manuais.',
      category: 'news',
      author: { name: 'Equipa Tech', initials: 'TC', role: 'Plataforma · Grupo' },
      published: '2026-04-15T09:00:00',
      readMin: 3,
      pinned: false,
      featured: false,
      views: 612,
      reactions: 58,
      comments: 11,
      coverGradient: 'linear-gradient(135deg, oklch(0.55 0.16 230) 0%, oklch(0.72 0.14 200) 100%)',
      coverIcon: 'globe',
      tags: ['integração', 'glovo', 'digital'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A integração com a Glovo foi atualizada e os pedidos passam a aparecer em tempo real no separador **Canais Digitais → Pedidos**. Sem polling, sem refresh manual.' },
        { type: 'p', text: 'Esta mudança liberta cerca de 25 minutos por dia em cada farmácia ativa no canal. Reflicte na produtividade e reduz tempos de preparação.' },
      ],
    },
    {
      id: 'p-007',
      title: 'Atualização do programa Cartão Cliente: 2x pontos em abril',
      excerpt: 'Durante todo o mês de abril, os clientes Cartão acumulam o dobro dos pontos em qualquer compra acima de 15€.',
      category: 'campaign',
      author: { name: 'Direção de Marketing', initials: 'DM', role: 'Equipa Marketing · Grupo' },
      published: '2026-04-12T08:00:00',
      readMin: 2,
      pinned: false,
      featured: false,
      views: 1124,
      reactions: 142,
      comments: 18,
      coverGradient: 'linear-gradient(135deg, oklch(0.65 0.15 163) 0%, oklch(0.85 0.12 180) 100%)',
      coverIcon: 'heart',
      tags: ['cartão', 'fidelização'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A campanha 2x pontos arrancou a 1/04 e prolonga-se até 30/04. Aproveitem para promover o cartão a clientes não-aderentes.' },
      ],
    },
    {
      id: 'p-008',
      title: 'Nota interna: alteração de fornecedor de luvas de exame',
      excerpt: 'Mudámos de fornecedor por questões de qualidade e prazos. As novas referências chegam a 28/04. Stock antigo deve esgotar-se primeiro.',
      category: 'memo',
      author: { name: 'Compras · Grupo', initials: 'CP', role: 'Departamento de Compras' },
      published: '2026-04-10T15:30:00',
      readMin: 2,
      pinned: false,
      featured: false,
      views: 412,
      reactions: 18,
      comments: 6,
      coverGradient: 'linear-gradient(135deg, oklch(0.55 0.10 200) 0%, oklch(0.75 0.08 210) 100%)',
      coverIcon: 'box',
      tags: ['compras', 'consumíveis'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A partir de 28/04, as luvas de exame passam a ser da marca **MediSafe Pro** (em vez de Bluemed). Qualidade superior, mesmo preço.' },
      ],
    },
    {
      id: 'p-009',
      title: 'Resultados Q1 2026: crescimento de 4,8% face a Q1 2025',
      excerpt: 'Receita consolidada de 1,42 M€, EBITDA de 14,2% e 8 das 12 unidades acima do orçado. Análise detalhada por farmácia em anexo.',
      category: 'highlight',
      author: { name: 'Inês Carvalho', initials: 'IC', role: 'Direção do Grupo' },
      published: '2026-04-08T10:00:00',
      readMin: 5,
      pinned: false,
      featured: false,
      views: 1684,
      reactions: 224,
      comments: 32,
      coverGradient: 'linear-gradient(135deg, oklch(0.55 0.18 320) 0%, oklch(0.65 0.15 345) 100%)',
      coverIcon: 'chart',
      tags: ['resultados', 'Q1', 'finanças'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'Os resultados consolidados do primeiro trimestre são positivos e refletem o trabalho de toda a equipa.' },
      ],
    },
    {
      id: 'p-010',
      title: 'Conferência Nossa Farmácia 2026 · save the date',
      excerpt: 'A nossa conferência anual realiza-se a 18 e 19 de junho no Estoril. Programa, oradores e logística serão divulgados em maio.',
      category: 'announcement',
      author: { name: 'Eventos · Grupo', initials: 'EV', role: 'Comunicação' },
      published: '2026-04-05T12:00:00',
      readMin: 1,
      pinned: false,
      featured: false,
      views: 982,
      reactions: 142,
      comments: 18,
      coverGradient: 'linear-gradient(135deg, oklch(0.50 0.20 27) 0%, oklch(0.65 0.18 50) 100%)',
      coverIcon: 'calendar',
      tags: ['conferência', 'evento'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'A nossa conferência anual está marcada. Reservem já as datas: **18 e 19 de junho**, no Estoril. Mais informações em breve.' },
      ],
    },
    {
      id: 'p-011',
      title: 'Recolha voluntária do lote XK-2840 · Brufen 600mg',
      excerpt: 'INFARMED comunicou recolha voluntária do lote XK-2840 (validade 06/2027) por desvio na potência. Stock a ser devolvido até 30/04.',
      category: 'regulation',
      author: { name: 'Compliance · Grupo', initials: 'CO', role: 'Departamento Regulamentar' },
      published: '2026-04-02T17:45:00',
      readMin: 2,
      pinned: false,
      featured: false,
      views: 1242,
      reactions: 12,
      comments: 8,
      coverGradient: 'linear-gradient(135deg, oklch(0.50 0.16 78) 0%, oklch(0.65 0.14 50) 100%)',
      coverIcon: 'alert',
      tags: ['recolha', 'INFARMED'],
      visibility: 'all',
      status: 'published',
      body: [
        { type: 'p', text: 'O lote XK-2840 do Brufen 600mg (validade 06/2027) foi alvo de recolha voluntária por desvio na potência detetado em controlo. Por favor retirem todas as unidades das prateleiras e do reposicionamento, e separem em caixa identificada para devolução até 30/04.' },
      ],
    },
    {
      id: 'p-012',
      title: 'Rascunho · Plano de comunicação para Junho',
      excerpt: 'Calendário editorial e ideias de campanha para junho. Aberto a sugestões da equipa.',
      category: 'campaign',
      author: { name: 'Direção de Marketing', initials: 'DM', role: 'Equipa Marketing · Grupo' },
      published: null,
      readMin: 3,
      pinned: false,
      featured: false,
      views: 0,
      reactions: 0,
      comments: 0,
      coverGradient: 'linear-gradient(135deg, oklch(0.65 0.15 163) 0%, oklch(0.78 0.15 145) 100%)',
      coverIcon: 'edit',
      tags: ['planeamento'],
      visibility: 'all',
      status: 'draft',
      body: [
        { type: 'p', text: 'Rascunho em construção...' },
      ],
    },
    {
      id: 'p-013',
      title: 'Agendado · Lançamento campanha "Verão sem sol"',
      excerpt: 'Campanha de proteção solar e cuidados com a pele para arrancar a 1 de junho.',
      category: 'campaign',
      author: { name: 'Direção de Marketing', initials: 'DM', role: 'Equipa Marketing · Grupo' },
      published: '2026-06-01T08:00:00',
      readMin: 4,
      pinned: false,
      featured: false,
      views: 0,
      reactions: 0,
      comments: 0,
      coverGradient: 'linear-gradient(135deg, oklch(0.78 0.15 78) 0%, oklch(0.85 0.13 50) 100%)',
      coverIcon: 'sun',
      tags: ['verão', 'pele', 'sol'],
      visibility: 'all',
      status: 'scheduled',
      body: [
        { type: 'p', text: 'Em agendamento para 1 de junho.' },
      ],
    },
  ];

  const events = [
    { id: 'e1', title: 'Webinar nutricionista', date: '28 abr', time: '18:00', type: 'training' },
    { id: 'e2', title: 'Formação vacinação · Lisboa', date: '13 mai', time: '09:00', type: 'training' },
    { id: 'e3', title: 'Reunião mensal de DTs', date: '06 mai', time: '14:30', type: 'meeting' },
    { id: 'e4', title: 'Conferência Nossa Farmácia', date: '18 jun', time: 'todo o dia', type: 'event' },
  ];

  const quickLinks = [
    { id: 'ql1', label: 'Manual de procedimentos', icon: 'book' },
    { id: 'ql2', label: 'Contactos do grupo', icon: 'users' },
    { id: 'ql3', label: 'Modelos de documentos', icon: 'file' },
    { id: 'ql4', label: 'Reportar incidente', icon: 'alert' },
  ];

  return { pharmacies, topProducts, alerts, recentActivity, salesMonthly, salesDaily, stockItems, receivables, payables, campaigns, channels, onlineOrders, notifications, customers, customerSegments, dispensingQueue, services, interactions, team, compliance, posts, postCategories, events, quickLinks };
})();
