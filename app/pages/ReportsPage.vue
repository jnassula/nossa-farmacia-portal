<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { fmt, eur } = window;

const tab = ref('vendas');
const tabs = [
  { id: 'vendas',     label: 'Vendas' },
  { id: 'rentab',     label: 'Rentabilidade' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'cohorts',    label: 'Coortes de clientes' },
];

const hourBars = [
  { m: '08', v: 18 }, { m: '09', v: 42 }, { m: '10', v: 78 }, { m: '11', v: 92 },
  { m: '12', v: 84 }, { m: '13', v: 68 }, { m: '14', v: 72 }, { m: '15', v: 88 },
  { m: '16', v: 96 }, { m: '17', v: 102 }, { m: '18', v: 110 }, { m: '19', v: 76 }, { m: '20', v: 28 },
];
const kFmt = (v) => v + ' K€';
const idFmt = (v) => v;

// Rentabilidade
const rentabRows = computed(() => D.pharmacies.map(p => {
  const cogs = Math.round(p.revenue * 0.62);
  const opex = Math.round(p.revenue * 0.22);
  const ebitda = p.revenue - cogs - opex;
  const margin = (ebitda / p.revenue * 100).toFixed(1);
  return { ...p, cogs, opex, ebitda, margin };
}));
const marginTone = (m) => m > 15 ? 'success' : m > 10 ? 'warn' : 'danger';

// Categorias
const cats = [
  { name: 'Medicamento sujeito a receita',     share: 48, value: 712320, growth: 3.2,  color: 'var(--primary)' },
  { name: 'Medicamento não sujeito a receita', share: 18, value: 267450, growth: 5.8,  color: 'oklch(0.640 0.140 230)' },
  { name: 'Dermocosmética',                     share: 14, value: 208120, growth: 8.4,  color: 'oklch(0.780 0.160 78)' },
  { name: 'Higiene e bem-estar',                share:  8, value: 118910, growth: 4.1,  color: 'oklch(0.560 0.130 300)' },
  { name: 'Suplementos',                         share:  6, value:  89240, growth: 12.6, color: 'oklch(0.620 0.150 27)' },
  { name: 'Puericultura',                        share:  4, value:  59480, growth: 1.2,  color: 'oklch(0.660 0.060 200)' },
  { name: 'Veterinária',                         share:  2, value:  31400, growth: -1.4, color: 'oklch(0.700 0.080 130)' },
];
const catsDonut = cats.map(c => ({ label: c.name, v: c.share, color: c.color }));

// Coortes
const cohortMonths = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'];
const cohorts = cohortMonths.map((m, i) => ({
  cohort: m,
  size: 320 + ((i * 37) % 180),
  retention: Array.from({ length: 12 - i }, (_, j) =>
    Math.max(8, Math.round(100 - j * 8 - (i % 5) * 2 + Math.sin(i + j) * 4))
  ),
}));
const cellColor = (v) => `oklch(${0.98 - v * 0.005} ${v * 0.0014} 163)`;
const cellTextColor = (v) => v > 60 ? 'var(--brand-emerald-800)' : 'var(--foreground)';
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="Análises consolidadas · exportação para Excel/PDF · agendamento por email">
      Relatórios · BI
      <template #action>
        <div :style="{ display: 'flex', gap: '8px' }">
          <Button text severity="secondary"><ICalendar :size="14"/> Período · Abr 2026</Button>
          <Button text severity="secondary"><IDownload :size="14"/> Exportar</Button>
        </div>
      </template>
    </SectionTitle>

    <SelectButton v-model="tab" :options="tabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>

    <!-- Vendas -->
    <div v-if="tab === 'vendas'" :style="{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }">
      <Card :style="{ padding: '20px' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }">
          <div>
            <div :style="{ fontSize: '14px', fontWeight: 600 }">Faturação consolidada</div>
            <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">12 meses · grupo</div>
          </div>
          <div :style="{ display: 'flex', gap: '14px', fontSize: '12px' }">
            <span><span :style="{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '999px', background: 'var(--primary)', marginRight: '6px' }"/>Vendas</span>
            <span><span :style="{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '999px', background: 'oklch(0.640 0.140 230)', marginRight: '6px' }"/>Comparticipações</span>
          </div>
        </div>
        <LineChart :data="D.salesMonthly" :formatY="kFmt" :height="260"/>
      </Card>

      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }">
        <Card :style="{ padding: '20px' }">
          <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }">Top 5 produtos</div>
          <table class="data-table">
            <thead><tr><th>Produto</th><th :style="{ textAlign: 'right' }">Unidades</th><th :style="{ textAlign: 'right' }">Receita</th></tr></thead>
            <tbody>
              <tr v-for="p in D.topProducts" :key="p.id">
                <td>
                  <div :style="{ fontWeight: 500 }">{{ p.name }}</div>
                  <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)' }">{{ p.category }}</div>
                </td>
                <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }">{{ fmt(p.units) }}</td>
                <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }">{{ eur(p.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card :style="{ padding: '20px' }">
          <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }">Vendas por hora</div>
          <BarChart :data="hourBars" :formatY="idFmt"/>
        </Card>
      </div>
    </div>

    <!-- Rentabilidade -->
    <Card v-else-if="tab === 'rentab'" :style="{ padding: 0, overflow: 'hidden' }">
      <div :style="{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }">
        <div :style="{ fontSize: '14px', fontWeight: 600 }">Margem operacional por unidade</div>
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">Abril 2026</div>
      </div>
      <DataTable :value="rentabRows" :rowHover="true" stripedRows>
        <Column header="Unidade" :pt="{ bodyCell: { style: { fontWeight: 500 } } }">
          <template #body="{ data }">{{ data.name.replace('Farmácia Nossa ', '') }}</template>
        </Column>
        <Column header="Receita"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' } } }">
          <template #body="{ data }">{{ eur(data.revenue) }}</template>
        </Column>
        <Column header="Custo bens"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--foreground-muted)' } } }">
          <template #body="{ data }">{{ eur(data.cogs) }}</template>
        </Column>
        <Column header="OPEX"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--foreground-muted)' } } }">
          <template #body="{ data }">{{ eur(data.opex) }}</template>
        </Column>
        <Column header="EBITDA"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 } } }">
          <template #body="{ data }">{{ eur(data.ebitda) }}</template>
        </Column>
        <Column header="Margem"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right' } } }">
          <template #body="{ data }">
            <Tag :severity="marginTone(parseFloat(data.margin))">{{ data.margin }}%</Tag>
          </template>
        </Column>
      </DataTable>
    </Card>

    <!-- Categorias -->
    <div v-else-if="tab === 'categorias'" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }">
      <Card :style="{ padding: '20px' }">
        <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }">Distribuição por categoria</div>
        <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }">
          <Donut :size="200" :data="catsDonut" centerLabel="Faturação" centerValue="1.49 M€"/>
        </div>
      </Card>
      <Card :style="{ padding: '20px' }">
        <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }">Detalhe</div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
          <div v-for="c in cats" :key="c.name">
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
                <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: c.color }"/>
                <span :style="{ fontSize: '13px', fontWeight: 500 }">{{ c.name }}</span>
              </div>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <span :style="{ fontSize: '12.5px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }">{{ eur(c.value) }}</span>
                <Trend :value="c.growth"/>
              </div>
            </div>
            <ProgressBar :value="c.share" :max="50" :color="c.color"/>
          </div>
        </div>
      </Card>
    </div>

    <!-- Coortes -->
    <Card v-else :style="{ padding: 0, overflow: 'auto' }">
      <div :style="{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }">
        <div :style="{ fontSize: '14px', fontWeight: 600 }">Retenção · coortes mensais</div>
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">% de clientes ativos por mês desde a primeira compra</div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Coorte</th>
            <th :style="{ textAlign: 'right' }">Tamanho</th>
            <th v-for="(_, i) in cohortMonths" :key="i" :style="{ textAlign: 'center', minWidth: '52px' }">M{{ i }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in cohorts" :key="i">
            <td :style="{ fontWeight: 500 }">{{ c.cohort }} ’25</td>
            <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--foreground-muted)' }">{{ c.size }}</td>
            <td v-for="(v, j) in c.retention" :key="j"
              :style="{ textAlign: 'center', background: cellColor(v), fontSize: '12px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: cellTextColor(v) }">
              {{ v }}%
            </td>
            <td v-for="k in (12 - c.retention.length)" :key="'e' + k"/>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>
