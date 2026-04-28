<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { fmt, eur, eurD } = window;

const filter = ref('all');
const orders = computed(() => D.onlineOrders.filter(o =>
  filter.value === 'all' || o.channel.toLowerCase().includes(filter.value)
));

const totalOrders = computed(() => D.channels.reduce((s, c) => s + c.orders, 0));
const totalRev = computed(() => D.channels.reduce((s, c) => s + c.revenue, 0));

const cardSparks = D.channels.map((_, i) => [20 + i, 25, 22, 28, 30, 32, 35].map((v, j) => v + (j % 2 ? 1 : 0)));

const channelKey = (name) => name === 'Loja online' ? 'eshop' : name === 'Glovo' ? 'glovo' : name === 'Bolt Food' ? 'bolt' : 'uber';
const channelColor = (name) => D.channels.find(c => c.name === name)?.color || 'var(--foreground-muted)';
const channelIcon = (id) => id === 'eshop' ? 'ICart' : id === 'glovo' ? 'IBolt' : id === 'bolt' ? 'IBolt' : 'ITruck';

const orderTabs = [
  { id: 'all',   label: 'Todas' },
  { id: 'loja',  label: 'Loja online' },
  { id: 'glovo', label: 'Glovo' },
  { id: 'bolt',  label: 'Bolt' },
  { id: 'uber',  label: 'Uber' },
];

const orderStatusMap = {
  preparing:  { tone: 'warn', label: 'Em preparação' },
  in_transit: { tone: 'info',    label: 'Em trânsito' },
  shipped:    { tone: 'info',    label: 'Expedida' },
  delivered:  { tone: 'success', label: 'Entregue' },
  cancelled:  { tone: 'danger',  label: 'Cancelada' },
};

// Stacked chart — datasets para <StackedBarChart>
const stackDays = 14;
const stackLabels = Array.from({ length: stackDays }, (_, d) => String(13 + d));
// Para cada canal, gera uma serie deterministica de N dias
const stackDatasets = D.channels.map((c, i) => ({
  label: c.name,
  color: c.color,
  data: Array.from({ length: stackDays }, (_, d) =>
    8 + Math.round(Math.sin((d + i * 2) * 0.5) * 4) + i * 4 + ((d + i) % 5)
  ),
}));

// Donut
const donutData = computed(() => D.channels.map(c => ({ v: c.revenue, color: c.color })));
const donutCenter = computed(() => eur(totalRev.value / 1000) + 'k');

// Sistemas
const systems = [
  { name: 'Loja online · API',         up: 99.98, status: 'ok',   last: 'sincronizado há 24s' },
  { name: 'Glovo · webhook',           up: 99.92, status: 'ok',   last: 'sincronizado há 38s' },
  { name: 'Bolt Food · webhook',       up: 99.85, status: 'ok',   last: 'sincronizado há 1m' },
  { name: 'Uber Eats · webhook',       up: 98.42, status: 'warn', last: 'atraso de 2m · a recuperar' },
  { name: 'SAFE/PEM · INFARMED',       up: 100.00, status: 'ok',  last: 'sincronizado há 14m' },
  { name: 'SNS · receita eletrónica',  up: 99.99, status: 'ok',   last: 'sincronizado há 1m' },
];
const upBars = Array.from({ length: 40 }, (_, i) => ({
  dim: i === 28,
  opacity: i === 28 ? 1 : 0.6 + (i / 40) * 0.4,
  color: i === 28 ? 'var(--signal-warning)' : 'var(--brand-emerald-400)',
}));
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
    <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }">
      <div>
        <h1 :style="{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }">Canais digitais</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '13.5px', margin: '4px 0 0' }">Loja online · Glovo · Bolt Food · Uber Eats · vista consolidada</p>
      </div>
      <div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
        <Tag severity="success">Sistemas operacionais</Tag>
        <Button severity="secondary" outlined><ILink :size="14"/> Integrações</Button>
        <Button severity="secondary" outlined><IDownload :size="14"/> Exportar</Button>
      </div>
    </div>

    <!-- Channel cards -->
    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }">
      <div v-for="(c, i) in D.channels" :key="c.id" class="kpi" :style="{ borderLeft: `3px solid ${c.color}` }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
            <div :style="{ width: '24px', height: '24px', borderRadius: '6px', background: c.color, color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }">
              <component :is="channelIcon(c.id)" :size="13"/>
            </div>
            <span :style="{ fontSize: '13px', fontWeight: 600 }">{{ c.name }}</span>
          </div>
          <Trend :value="c.growth"/>
        </div>
        <div :style="{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '2px' }">{{ eur(c.revenue) }}</div>
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">{{ c.orders }} encomendas · ticket {{ eurD(c.aov) }}</div>
        <Sparkline :data="cardSparks[i]" :color="c.color" :width="240" :height="28"/>
      </div>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }">
      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Encomendas por canal · 30 dias</div>
            <div class="card-subtitle">{{ fmt(totalOrders) }} encomendas · {{ eur(totalRev) }} consolidado</div>
          </div>
          <SelectButton :model-value="'day'"
            :options="[{ id: 'day', label: 'Dia' }, { id: 'week', label: 'Semana' }, { id: 'month', label: 'Mês' }]"
            optionLabel="label" optionValue="id" :allowEmpty="false"/>
        </div>
        <div class="card-body">
          <StackedBarChart :labels="stackLabels" :datasets="stackDatasets" :height="220" :showY="false"/>
          <div :style="{ display: 'flex', gap: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }">
            <Legend v-for="c in D.channels" :key="c.id" :color="c.color" :label="c.name" :value="fmt(c.orders)"/>
          </div>
        </div>
      </Card>

      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Mix de receita</div>
            <div class="card-subtitle">% por canal · este mês</div>
          </div>
        </div>
        <div class="card-body" :style="{ display: 'flex', alignItems: 'center', gap: '20px' }">
          <Donut :data="donutData" :size="150" :thickness="22" :centerValue="donutCenter" centerLabel="receita"/>
          <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div v-for="c in D.channels" :key="c.id" :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: c.color }"/>
              <span :style="{ fontSize: '12.5px', flex: 1 }">{{ c.name }}</span>
              <span :style="{ fontSize: '12.5px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }">
                {{ Math.round(c.revenue / totalRev * 100) }}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <div class="card-header" :style="{ flexWrap: 'wrap' }">
        <div>
          <div class="card-title">Encomendas em tempo real</div>
          <div class="card-subtitle">Última atualização há 12 segundos</div>
        </div>
        <div :style="{ marginLeft: 'auto', display: 'flex', gap: '8px' }">
          <SelectButton v-model="filter" :options="orderTabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
        </div>
      </div>
      <DataTable :value="orders" :rowHover="true" stripedRows>
        <Column header="ID" field="id"
          :pt="{ bodyCell: { style: { fontFamily: 'var(--font-mono)', fontSize: '12px' } } }"/>
        <Column header="Canal">
          <template #body="{ data: o }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
              <div :style="{ width: '20px', height: '20px', borderRadius: '6px', background: channelColor(o.channel), color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }">
                <component :is="channelIcon(channelKey(o.channel))" :size="11"/>
              </div>
              <span>{{ o.channel }}</span>
            </div>
          </template>
        </Column>
        <Column header="Cliente" field="client"/>
        <Column header="Itens" field="items"
          :pt="{ headerCell: { style: { textAlign: 'center' } }, bodyCell: { style: { textAlign: 'center' } } }"/>
        <Column header="Valor"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' } } }">
          <template #body="{ data: o }">{{ eurD(o.value) }}</template>
        </Column>
        <Column header="ETA" field="eta"
          :pt="{ bodyCell: { style: { fontSize: '12.5px', color: 'var(--foreground-muted)' } } }"/>
        <Column header="Estado">
          <template #body="{ data: o }">
            <Tag :severity="orderStatusMap[o.status].tone">{{ orderStatusMap[o.status].label }}</Tag>
          </template>
        </Column>
        <Column>
          <template #body><Button text severity="secondary"><IMore :size="14"/></Button></template>
        </Column>
      </DataTable>
    </Card>

    <Card>
      <div class="card-header">
        <div>
          <div class="card-title">Estado dos sistemas</div>
          <div class="card-subtitle">Integrações e APIs · uptime 30 dias</div>
        </div>
      </div>
      <div :style="{ padding: '8px 0' }">
        <div v-for="(s, i) in systems" :key="i"
          :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }">
          <span :style="{
            width: '8px', height: '8px', borderRadius: '999px',
            background: s.status === 'ok' ? 'var(--brand-emerald-500)' : 'var(--signal-warning)',
          }"/>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '13px', fontWeight: 500 }">{{ s.name }}</div>
            <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ s.last }}</div>
          </div>
          <div :style="{ display: 'flex', gap: '1.5px' }">
            <div v-for="(b, k) in upBars" :key="k"
              :style="{ width: '3px', height: '18px', borderRadius: '1px', background: b.color, opacity: b.opacity }"/>
          </div>
          <div :style="{ width: '64px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '13px', fontWeight: 600 }">{{ s.up.toFixed(2) }}%</div>
        </div>
      </div>
    </Card>
  </div>
</template>
