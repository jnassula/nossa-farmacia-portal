<script setup>
import { ref, computed, h } from 'vue';
const { usePortal, fmt, eur, eurD } = window;

const D = window.PORTAL_DATA;
const I = window.I;

const { pharmacies, activePharmacy } = usePortal();
const range = ref('month');
const chartView = ref('line');

const isAll = computed(() => activePharmacy.value === 'all');
const totalRev = computed(() => isAll.value
  ? pharmacies.reduce((s, p) => s + p.revenue, 0)
  : pharmacies.find(p => p.id === activePharmacy.value)?.revenue || 0);
const avgGrowth = computed(() => isAll.value
  ? (pharmacies.reduce((s, p) => s + p.growth, 0) / pharmacies.length)
  : (pharmacies.find(p => p.id === activePharmacy.value)?.growth || 0));
const sales = computed(() => isAll.value ? 4218 : 384);
const ticket = computed(() => isAll.value ? 18.40 : 19.10);
const phaName = computed(() => isAll.value ? '' : (pharmacies.find(p => p.id === activePharmacy.value)?.name || ''));

const rangeTabs = [
  { id: 'day',   label: 'Dia' },
  { id: 'week',  label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'year',  label: 'Ano' },
];
const chartTabs = [
  { id: 'line', label: 'Linha' },
  { id: 'bar',  label: 'Barras' },
];
const rankingTabs = [
  { id: 'rev',    label: 'Receita' },
  { id: 'growth', label: 'Crescimento' },
  { id: 'margin', label: 'Margem' },
];

const topRanking = computed(() =>
  [...D.pharmacies].sort((a, b) => b.revenue - a.revenue).slice(0, 6)
);

const barColored = computed(() => D.salesMonthly.map((d, i) => ({
  ...d,
  color: i === D.salesMonthly.length - 1 ? 'var(--primary)' : 'var(--brand-emerald-300)',
})));

const kFormat = (v) => v + 'k';

// Mapa estilizado de Portugal
const W = 640, H = 380;
const project = (lat, lng) => {
  const x = ((lng + 9.6) / 3.2) * W;
  const y = ((42.2 - lat) / 5.3) * H;
  return [x, y];
};
const mapDots = computed(() => D.pharmacies.map(p => {
  const [x, y] = project(p.lat, p.lng);
  return {
    ...p,
    left: (x / W) * 100 + '%',
    top: (y / H) * 100 + '%',
    title: p.name + ' · ' + eur(p.revenue),
  };
}));

const sevMap = {
  danger:  { bg: 'oklch(0.96 0.06 27)',  fg: 'oklch(0.50 0.23 27)', icon: 'IAlert' },
  warning: { bg: 'oklch(0.96 0.06 78)',  fg: 'oklch(0.50 0.16 78)', icon: 'IAlert' },
  info:    { bg: 'oklch(0.95 0.05 230)', fg: 'oklch(0.45 0.16 230)', icon: 'IInfo'  },
};

const statusPill = (s) => s === 'top' ? 'success' : s === 'good' ? 'secondary' : 'warn';
const statusLabel = (s) => s === 'top' ? 'Top' : s === 'good' ? 'Bom' : 'Atenção';

// ---- Local: Kpi com sparkline (variante do dashboard) ---------------------
const Kpi = (_p, { attrs }) => {
  const accent = !!attrs.accent;
  return h('div', {
    class: 'kpi',
    style: accent
      ? { background: 'linear-gradient(180deg, var(--brand-emerald-50), var(--surface))', borderColor: 'var(--brand-emerald-200)' }
      : {},
  }, [
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } }, [
      h('span', { class: 'kpi-label' }, attrs.label),
      attrs.sparkData ? h(window.Sparkline, { data: attrs.sparkData, width: 70, height: 22 }) : null,
    ]),
    h('div', { class: 'kpi-value' }, attrs.value),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
      attrs.trend != null ? h(window.Trend, { value: attrs.trend }) : null,
      h('span', { style: { fontSize: '12px', color: 'var(--foreground-muted)' } }, attrs.sub),
    ]),
  ]);
};
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
    <!-- Header -->
    <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }">
      <div>
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }">
          Visão geral · 26 abr 2026
        </div>
        <h1 :style="{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0 0' }">Bom dia, Inês.</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '14px', margin: '4px 0 0' }">
          {{ isAll ? 'Consolidado de ' + pharmacies.length + ' farmácias do grupo' : phaName }}
        </p>
      </div>
      <div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
        <SelectButton v-model="range" :options="rangeTabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
        <Button severity="secondary" outlined><ICalendar :size="14"/> 26 mar — 26 abr</Button>
        <Button severity="secondary" outlined><IDownload :size="14"/> Exportar</Button>
      </div>
    </div>

    <!-- KPIs -->
    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }">
      <Kpi label="Faturação · mês" :value="eur(totalRev)" :trend="avgGrowth"
           sub="vs. mês anterior" :sparkData="D.salesMonthly.map(d => d.v)" accent/>
      <Kpi label="Vendas · hoje" :value="fmt(sales)" :trend="4.8"
           :sub="isAll ? 'em todas as unidades' : 'na unidade'"
           :sparkData="D.salesDaily.slice(-14)"/>
      <Kpi label="Ticket médio" :value="eurD(ticket)" :trend="-1.2" sub="rolling 30 dias"
           :sparkData="[18, 18.4, 18.1, 18.6, 19.2, 18.8, 18.4]"/>
      <Kpi label="Margem bruta" value="32,4%" :trend="0.7" sub="estável"
           :sparkData="[31, 31.5, 32, 32.4, 32.1, 32.4, 32.4]"/>
    </div>

    <!-- Sales chart + Top products -->
    <div :style="{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }">
      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Faturação · evolução</div>
            <div class="card-subtitle">Últimos 12 meses · todas as unidades · valores em mil €</div>
          </div>
          <div :style="{ display: 'flex', gap: '6px' }">
            <SelectButton v-model="chartView" :options="chartTabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
          </div>
        </div>
        <div class="card-body">
          <LineChart v-if="chartView === 'line'" :data="D.salesMonthly" :formatY="kFormat"/>
          <BarChart v-else :data="barColored" :formatY="kFormat"/>
          <div :style="{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--primary)' }"/>
              <span :style="{ color: 'var(--foreground-muted)' }">Receita 2026</span>
              <span :style="{ fontWeight: 600 }">{{ eur(591000) }}</span>
            </div>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-emerald-300)' }"/>
              <span :style="{ color: 'var(--foreground-muted)' }">Receita 2025</span>
              <span :style="{ fontWeight: 600 }">{{ eur(498000) }}</span>
            </div>
            <div :style="{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }">
              <Trend :value="18.7"/>
              <span :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">YoY</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Top 5 produtos</div>
            <div class="card-subtitle">Por unidades vendidas · este mês</div>
          </div>
          <Button text severity="secondary" size="small">Ver tudo</Button>
        </div>
        <div :style="{ padding: '4px 0' }">
          <div v-for="(p, i) in D.topProducts" :key="p.id" class="row-hover"
            :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', cursor: 'pointer' }">
            <div :style="{ width: '28px', height: '28px', borderRadius: '7px', background: 'var(--surface-sunken)', color: 'var(--foreground-muted)', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700 }">
              {{ i + 1 }}
            </div>
            <div :style="{ flex: 1, minWidth: 0 }">
              <div :style="{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ p.name }}</div>
              <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ p.category }} · {{ fmt(p.units) }} un.</div>
            </div>
            <div :style="{ textAlign: 'right' }">
              <div :style="{ fontSize: '13px', fontWeight: 600 }">{{ eur(p.revenue) }}</div>
              <Trend :value="p.growth"/>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Map + Alerts -->
    <div :style="{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }">
      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Mapa de farmácias</div>
            <div class="card-subtitle">Performance · cor por desempenho do mês</div>
          </div>
          <div :style="{ display: 'flex', gap: '12px', fontSize: '11.5px', color: 'var(--foreground-muted)' }">
            <span :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-emerald-500)' }"/>Top
            </span>
            <span :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--brand-emerald-300)' }"/>Bom
            </span>
            <span :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--signal-warning)' }"/>Atenção
            </span>
          </div>
        </div>
        <div :style="{ position: 'relative', padding: '16px' }">
          <div :style="{ position: 'relative', width: '100%' }">
            <svg :viewBox="`0 0 ${W} ${H}`" width="100%" :style="{ display: 'block' }">
              <defs>
                <linearGradient id="ptg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="oklch(0.96 0.04 163)"/>
                  <stop offset="100%" stop-color="oklch(0.92 0.05 163)"/>
                </linearGradient>
              </defs>
              <path d="M 380 30 Q 360 50 350 80 L 340 110 Q 350 140 340 170 L 360 200 Q 350 230 360 260 L 350 290 Q 340 320 360 350 L 350 360 L 280 360 Q 250 350 230 340 Q 220 320 210 290 Q 220 260 220 230 Q 200 200 200 170 Q 220 140 220 110 Q 240 80 260 60 Q 290 40 320 30 Q 350 20 380 30 Z"
                    fill="url(#ptg)" stroke="oklch(0.85 0.06 163)" stroke-width="1"/>
              <text x="100" y="200" font-size="11" fill="var(--foreground-subtle)" font-style="italic" opacity="0.6">Oceano Atlântico</text>
              <rect x="380" y="0" width="260" height="380" fill="var(--ink-100)" opacity="0.6"/>
              <text x="500" y="200" font-size="11" fill="var(--foreground-subtle)" opacity="0.5">Espanha</text>
            </svg>
            <div v-for="d in mapDots" :key="d.id" :class="`map-dot ${d.status}`"
              :style="{ left: d.left, top: d.top }" :title="d.title"/>
            <div :style="{ position: 'absolute', left: '52%', top: '23%', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 500 }">Porto · 3</div>
            <div :style="{ position: 'absolute', left: '50%', top: '60%', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 500 }">Lisboa · 4</div>
            <div :style="{ position: 'absolute', left: '50%', top: '92%', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 500 }">Faro · 1</div>
          </div>
        </div>
      </Card>

      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Alertas críticos</div>
            <div class="card-subtitle">{{ D.alerts.length }} alertas · {{ D.alerts.filter(a => a.sev === 'danger').length }} prioritários</div>
          </div>
          <Button text severity="secondary" size="small">Ver tudo</Button>
        </div>
        <div :style="{ padding: '4px 0' }">
          <div v-for="a in D.alerts" :key="a.id" class="row-hover"
            :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 20px', cursor: 'pointer' }">
            <div :style="{ width: '28px', height: '28px', borderRadius: '8px', background: (sevMap[a.sev] || sevMap.info).bg, color: (sevMap[a.sev] || sevMap.info).fg, display: 'grid', placeItems: 'center', flex: 'none' }">
              <component :is="(sevMap[a.sev] || sevMap.info).icon" :size="14"/>
            </div>
            <div :style="{ flex: 1, minWidth: 0 }">
              <div :style="{ fontSize: '13px', fontWeight: 600 }">{{ a.title }}</div>
              <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '2px' }">{{ a.desc }}</div>
            </div>
            <div :style="{ fontSize: '11px', color: 'var(--foreground-subtle)' }">{{ a.time }}</div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Pharmacy ranking + Activity -->
    <div :style="{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }">
      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Ranking de farmácias</div>
            <div class="card-subtitle">Top performers · este mês</div>
          </div>
          <SelectButton :model-value="'rev'" :options="rankingTabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
        </div>
        <DataTable :value="topRanking" :rowHover="true" stripedRows>
          <Column header="Farmácia">
            <template #body="{ data: p, index: i }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <div :style="{
                  width: '22px', height: '22px', borderRadius: '6px',
                  background: i < 3 ? 'var(--primary-soft)' : 'var(--surface-sunken)',
                  color:      i < 3 ? 'var(--primary)'      : 'var(--foreground-muted)',
                  display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 700,
                }">{{ i + 1 }}</div>
                <span :style="{ fontWeight: 500 }">{{ p.name }}</span>
              </div>
            </template>
          </Column>
          <Column header="Cidade" field="city" :pt="{ bodyCell: { style: { color: 'var(--foreground-muted)' } } }"/>
          <Column header="Receita"
            :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' } } }">
            <template #body="{ data: p }">{{ eur(p.revenue) }}</template>
          </Column>
          <Column header="Trend">
            <template #body="{ index: i }">
              <Sparkline :data="[80, 92, 88, 102, 110, 118, 124, 130 + i * 4]" :width="70" :height="20"/>
            </template>
          </Column>
          <Column header="vs. anterior"
            :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right' } } }">
            <template #body="{ data: p }"><Trend :value="p.growth"/></template>
          </Column>
          <Column>
            <template #body="{ data: p }"><Tag :severity="statusPill(p.status)">{{ statusLabel(p.status) }}</Tag></template>
          </Column>
        </DataTable>
      </Card>

      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Atividade recente</div>
            <div class="card-subtitle">Últimas ações · todas as unidades</div>
          </div>
          <Button text severity="secondary" :title="'Atualizar'"><IRefreshCw :size="14"/></Button>
        </div>
        <div :style="{ padding: '4px 0', maxHeight: '360px', overflowY: 'auto' }">
          <div v-for="a in D.recentActivity" :key="a.id"
            :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)' }">
            <Avatar :name="a.who" :size="28"/>
            <div :style="{ flex: 1, minWidth: 0 }">
              <div :style="{ fontSize: '12.5px' }"><strong :style="{ fontWeight: 600 }">{{ a.who }}</strong> {{ a.what }}</div>
              <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }">
                <IPin :size="11"/> {{ a.where }} · {{ a.time }}
              </div>
            </div>
            <div :style="{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)' }">{{ a.amount }}</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
