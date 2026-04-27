<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { fmt, eur } = window;

const tab = ref('all');
const q = ref('');
const selected = ref(null);
const seg = ref(null);

const totalCustomers = 26970;
const cardHolders = 22870;
const newThisMonth = 142;
const churn = 1.8;

const filtered = computed(() => D.customers.filter(c => {
  if (seg.value && c.segment !== seg.value) return false;
  if (tab.value === 'gold' && c.segment !== 'Cartão Ouro') return false;
  if (tab.value === 'senior' && c.segment !== 'Cartão Sénior') return false;
  if (tab.value === 'risk' && c.conditions.length < 2) return false;
  if (q.value && !(c.name.toLowerCase().includes(q.value.toLowerCase()) || c.nif.includes(q.value))) return false;
  return true;
}));

const tabs = computed(() => [
  { id: 'all',    label: 'Todos',         count: D.customers.length },
  { id: 'gold',   label: 'Cartão Ouro',   count: D.customers.filter(c => c.segment === 'Cartão Ouro').length },
  { id: 'senior', label: 'Sénior',        count: D.customers.filter(c => c.segment === 'Cartão Sénior').length },
  { id: 'risk',   label: 'Polimedicados', count: D.customers.filter(c => c.conditions.length >= 2).length },
]);

const phaName = (id) => (D.pharmacies.find(p => p.id === id)?.name || '—').replace('Farmácia Nossa ', '');

const segmentTone = (segment) => segment === 'Cartão Ouro' ? 'warn' : segment === 'Cartão Sénior' ? 'info' : 'neutral';
const segmentColor = (id) => id === 'gold' ? 'oklch(0.780 0.160 78)'
                            : id === 'senior' ? 'oklch(0.640 0.140 230)'
                            : id === 'card' ? 'var(--primary)'
                            : 'oklch(0.700 0.020 200)';

const customerActivity = [
  { d: '24/04', what: 'Compra · Ben-u-ron + Vit. D3', amount: 18.40, where: 'Baixa' },
  { d: '12/04', what: 'Renovação receita crónica',    amount: 0,     where: 'Baixa' },
  { d: '02/04', what: 'Compra · Solar SPF50',         amount: 24.80, where: 'Belém' },
  { d: '18/03', what: 'Tensão arterial',               amount: 5.00,  where: 'Baixa' },
  { d: '02/03', what: 'Compra · Imodium + Sabonete',   amount: 14.20, where: 'Baixa' },
];
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="Visão consolidada da base de clientes do grupo · cartão fidelidade, segmentação e histórico">
      CRM · Clientes
      <template #action>
        <div :style="{ display: 'flex', gap: '8px' }">
          <Button text severity="secondary"><IDownload :size="14"/> Exportar</Button>
          <Button severity="primary"><IPlus :size="14"/> Novo cliente</Button>
        </div>
      </template>
    </SectionTitle>

    <div class="kpi-grid">
      <KPI label="Total de clientes" :value="fmt(totalCustomers)" :delta="3.2"><template #icon><IUsers :size="16"/></template></KPI>
      <KPI label="Aderentes ao cartão" :value="fmt(cardHolders)"
           :sub="`${Math.round(cardHolders/totalCustomers*100)}% da base`" :delta="1.4">
        <template #icon><IHeart :size="16"/></template>
      </KPI>
      <KPI label="Novos este mês" :value="fmt(newThisMonth)" :delta="8.6"><template #icon><IPlus :size="16"/></template></KPI>
      <KPI label="Taxa de abandono" :value="`${churn}%`" :delta="-0.3"><template #icon><IAlert :size="16"/></template></KPI>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px' }">
      <Card :style="{ padding: '18px' }">
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }">
          <div :style="{ fontSize: '14px', fontWeight: 600 }">Clientes</div>
          <div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
            <div :style="{ position: 'relative' }">
              <ISearch :size="13" :style="{ position: 'absolute', left: '10px', top: '9px', color: 'var(--foreground-muted)' }"/>
              <input v-model="q" placeholder="Procurar nome, NIF…"
                :style="{ width: '220px', height: '32px', padding: '0 12px 0 32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '12.5px', outline: 0, font: 'inherit' }"/>
            </div>
          </div>
        </div>

        <Tabs :value="tab" :tabs="tabs" @change="(id) => tab = id"/>

        <table class="data-table" :style="{ marginTop: '12px' }">
          <thead>
            <tr>
              <th>Cliente</th><th>Segmento</th><th>Farmácia</th>
              <th :style="{ textAlign: 'right' }">Visitas</th>
              <th :style="{ textAlign: 'right' }">Gasto 12M</th>
              <th>Última visita</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id" @click="selected = c" :style="{ cursor: 'pointer' }">
              <td>
                <div :style="{ display: 'flex', gap: '10px', alignItems: 'center' }">
                  <Avatar :name="c.name" :size="28" :bg="c.avatar"/>
                  <div>
                    <div :style="{ fontWeight: 500 }">{{ c.name }}</div>
                    <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">NIF {{ c.nif }} · {{ c.age }} anos</div>
                  </div>
                </div>
              </td>
              <td><Tag :severity="segmentTone(c.segment)">{{ c.segment }}</Tag></td>
              <td :style="{ fontSize: '12.5px' }">{{ phaName(c.pharmacy) }}</td>
              <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }">{{ c.visits }}</td>
              <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }">{{ eur(c.spend) }}</td>
              <td :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)' }">{{ c.lastVisit }}</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
        <Card :style="{ padding: '18px' }">
          <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }">Segmentação</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
            <div v-for="s in D.customerSegments" :key="s.id" @click="seg = (seg === s.name ? null : s.name)"
              :style="{
                cursor: 'pointer', padding: '10px', borderRadius: '10px',
                background: seg === s.name ? 'var(--primary-soft)' : 'var(--surface-sunken)',
                border: '1px solid',
                borderColor: seg === s.name ? 'var(--brand-emerald-300)' : 'transparent',
                transition: 'all 160ms',
              }">
              <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }">
                <div :style="{ fontSize: '13px', fontWeight: 500 }">{{ s.name }}</div>
                <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', fontVariantNumeric: 'tabular-nums' }">{{ fmt(s.count) }} · {{ s.share }}%</div>
              </div>
              <ProgressBar :value="s.share" :max="50" :color="segmentColor(s.id)"/>
              <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '6px' }">
                Ticket médio · <strong :style="{ color: 'var(--foreground)' }">{{ eur(s.value) }}</strong>
              </div>
            </div>
          </div>
        </Card>

        <Card :style="{ padding: '18px' }">
          <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }">Programa de fidelidade</div>
          <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)', marginBottom: '14px' }">Cartão Nossa · indicadores de Abril</div>
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }">
            <Stat label="Pontos atribuídos" value="284 K"/>
            <Stat label="Pontos resgatados" value="142 K"/>
            <Stat label="Resgates" value="4 218"/>
            <Stat label="Adesões novas" value="142"/>
          </div>
        </Card>
      </div>
    </div>

    <Drawer :open="!!selected"
      :title="selected?.name"
      :subtitle="selected ? `${selected.segment} · NIF ${selected.nif}` : ''"
      @close="selected = null">
      <template #footer>
        <Button text severity="secondary">Histórico completo</Button>
        <Button severity="primary">Iniciar atendimento</Button>
      </template>

      <div v-if="selected" :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '14px' }">
          <Avatar :name="selected.name" :size="56" :bg="selected.avatar"/>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '13px', color: 'var(--foreground-muted)' }">Cliente desde {{ selected.joined }}</div>
            <div :style="{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }">
              <Tag severity="success">Ativo</Tag>
              <Tag :severity="selected.segment === 'Cartão Ouro' ? 'warn' : 'info'">{{ selected.segment }}</Tag>
            </div>
          </div>
        </div>

        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }">
          <Stat label="Visitas 12M" :value="selected.visits"/>
          <Stat label="Gasto 12M"   :value="eur(selected.spend)"/>
          <Stat label="Idade"       :value="selected.age + ' anos'"/>
          <Stat label="Cidade"      :value="selected.city"/>
        </div>

        <div v-if="selected.conditions.length > 0">
          <div :style="{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }">Condições</div>
          <div :style="{ display: 'flex', gap: '6px', flexWrap: 'wrap' }">
            <Tag v-for="x in selected.conditions" :key="x" severity="neutral">{{ x }}</Tag>
          </div>
        </div>

        <div>
          <div :style="{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }">Atividade recente</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: 0 }">
            <div v-for="(a, i) in customerActivity" :key="i"
              :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }">
              <div :style="{ fontSize: '11px', fontVariantNumeric: 'tabular-nums', color: 'var(--foreground-muted)', width: '40px' }">{{ a.d }}</div>
              <div :style="{ flex: 1 }">
                <div :style="{ fontSize: '13px' }">{{ a.what }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)' }">{{ a.where }}</div>
              </div>
              <div :style="{ fontSize: '13px', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }">{{ a.amount > 0 ? eur(a.amount) : '—' }}</div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
