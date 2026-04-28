<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { eur } = window;

const tab = ref('receivables');
const data = computed(() => tab.value === 'receivables' ? D.receivables : D.payables);

const totalRec = D.receivables.reduce((s, r) => s + r.amount, 0);
const totalPay = D.payables.reduce((s, r) => s + r.amount, 0);
const overdueRec = D.receivables.filter(r => r.status === 'overdue').reduce((s, r) => s + r.amount, 0);
const overduePay = D.payables.filter(r => r.status === 'overdue').reduce((s, r) => s + r.amount, 0);

const overdueDocs = D.receivables.filter(r => r.status === 'overdue').length
                  + D.payables.filter(r => r.status === 'overdue').length;

const tabs = computed(() => [
  { id: 'receivables', label: 'A receber', count: D.receivables.length },
  { id: 'payables',    label: 'A pagar',   count: D.payables.length },
]);

const cfTabs = [{ id: 'grouped', label: 'Comparativo' }, { id: 'net', label: 'Líquido' }];

const margins = computed(() => D.pharmacies.slice(0, 6).map((p, i) => {
  const margin = [34, 31, 33, 28, 36, 30][i];
  return {
    ...p, margin,
    color: margin >= 32 ? 'var(--primary)' : margin >= 28 ? 'var(--signal-warning)' : 'var(--signal-danger)',
  };
}));

// Cash flow chart
const months = ['Mai','Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr'];
const inn  = [180,210,224,198,240,258,272,310,260,278,294,312];
const out  = [142,168,180,162,188,202,212,238,208,218,230,246];
const cfW = 720, cfH = 220;
const cfP = { l: 48, r: 16, t: 14, b: 30 };
const cfw = cfW - cfP.l - cfP.r, cfh = cfH - cfP.t - cfP.b;
const cfMax = 350;
const cfBw = cfw / months.length * 0.36;
const cfGap = cfw / months.length * 0.28;
const cfTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => ({
  p, y: cfP.t + p * cfh, value: Math.round(cfMax - p * cfMax),
}));
const cfBars = months.map((m, i) => {
  const x0 = cfP.l + i * (cfBw * 2 + cfGap) + cfGap / 2;
  const inH = (inn[i] / cfMax) * cfh;
  const outH = (out[i] / cfMax) * cfh;
  return { m, x0, inH, outH, inY: cfP.t + cfh - inH, outY: cfP.t + cfh - outH };
});

const counterpartyIcon = (type) =>
  type === 'Fornecedor' ? 'ITruck'
  : type === 'Seguradora' ? 'IShield'
  : type === 'Reembolso'  ? 'IStethoscope'
  : 'IReceipt';

const dueLabel = (days) => days < 0 ? Math.abs(days) + ' dias atrasado' : days === 0 ? 'hoje' : 'em ' + days + ' dias';
const dueColor = (days) => days < 0 ? 'oklch(0.50 0.23 27)' : 'var(--foreground-subtle)';
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
    <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }">
      <div>
        <h1 :style="{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }">Finanças</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '13.5px', margin: '4px 0 0' }">Contas correntes, fluxo de caixa e relatórios fiscais</p>
      </div>
      <div :style="{ display: 'flex', gap: '8px' }">
        <Button severity="secondary" outlined><IBank :size="14"/> Reconciliação</Button>
        <Button severity="secondary" outlined><IDownload :size="14"/> SAF-T</Button>
        <Button><IPlus :size="14"/> Lançamento</Button>
      </div>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }">
      <Kpi label="A receber" :value="eur(totalRec)" :trend="3.4" sub="próximos 30 dias" :sparkData="[42,46,48,52,58,60,62]" accent/>
      <Kpi label="A pagar"   :value="eur(totalPay)" :trend="-1.8" sub="próximos 30 dias" :sparkData="[180,178,172,168,170,168,165]"/>
      <Kpi label="Cash flow · mês" :value="eur(124800)" :trend="12.6" sub="positivo" :sparkData="[80,92,98,105,118,124,124]"/>
      <Kpi label="Em atraso" :value="eur(overdueRec + overduePay)" :trend="-22.4" :sub="overdueDocs + ' documentos'" :sparkData="[40,38,32,28,22,18,12]"/>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }">
      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Fluxo de caixa · 12 meses</div>
            <div class="card-subtitle">Entradas vs. saídas · valores em mil €</div>
          </div>
          <SelectButton :model-value="'grouped'" :options="cfTabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
        </div>
        <div class="card-body">
          <svg :viewBox="`0 0 ${cfW} ${cfH}`" width="100%" :style="{ display: 'block' }">
            <g v-for="(t, i) in cfTicks" :key="i">
              <line :x1="cfP.l" :x2="cfW - cfP.r" :y1="t.y" :y2="t.y"
                stroke="var(--border-subtle)" :stroke-dasharray="i ? '2 4' : undefined"/>
              <text :x="cfP.l - 8" :y="t.y + 4" text-anchor="end" font-size="10.5" fill="var(--foreground-subtle)">{{ t.value }}k</text>
            </g>
            <g v-for="(b, i) in cfBars" :key="i">
              <rect :x="b.x0" :y="b.inY" :width="cfBw" :height="b.inH" rx="3" fill="var(--primary)"/>
              <rect :x="b.x0 + cfBw + 2" :y="b.outY" :width="cfBw" :height="b.outH" rx="3" fill="oklch(0.78 0.16 78)"/>
              <text :x="b.x0 + cfBw + 1" :y="cfH - 10" text-anchor="middle" font-size="10.5" fill="var(--foreground-muted)">{{ b.m }}</text>
            </g>
          </svg>
          <div :style="{ display: 'flex', gap: '24px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }">
            <Legend color="var(--primary)" label="Entradas" :value="eur(2840000)"/>
            <Legend color="oklch(0.78 0.16 78)" label="Saídas" :value="eur(2120000)"/>
            <div :style="{ marginLeft: 'auto' }"><Trend :value="8.4"/></div>
          </div>
        </div>
      </Card>

      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">P&amp;L por farmácia</div>
            <div class="card-subtitle">Margem operacional · este mês</div>
          </div>
        </div>
        <div :style="{ padding: '4px 0' }">
          <div v-for="m in margins" :key="m.id"
            :style="{ padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }">
              <span :style="{ fontWeight: 500 }">{{ m.name }}</span>
              <span :style="{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }">{{ m.margin }}%</span>
            </div>
            <ProgressBar :value="m.margin" :max="50" :color="m.color"/>
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <div class="card-header" :style="{ flexWrap: 'wrap' }">
        <SelectButton v-model="tab" :options="tabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
        <div :style="{ display: 'flex', gap: '8px', marginLeft: 'auto' }">
          <IconField iconPosition="left">
            <InputIcon><ISearch :size="14"/></InputIcon>
            <InputText :placeholder="tab === 'receivables' ? 'Procurar entidade…' : 'Procurar fornecedor…'" :style="{ width: '240px' }"/>
          </IconField>
          <Button severity="secondary" outlined size="small"><IFilter :size="13"/> Estado</Button>
          <Button severity="secondary" outlined size="small"><ICalendar :size="13"/> Período</Button>
          <Button severity="secondary" outlined size="small"><IDownload :size="13"/> Exportar</Button>
        </div>
      </div>

      <DataTable :value="data" :rowHover="true" stripedRows>
        <Column header="Documento"
          :pt="{ bodyCell: { style: { fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500 } } }"
          field="id"/>
        <Column :header="tab === 'receivables' ? 'Devedor' : 'Credor'">
          <template #body="{ data: r }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
              <div :style="{ width: '28px', height: '28px', borderRadius: '7px', background: 'var(--surface-sunken)', color: 'var(--foreground-muted)', display: 'grid', placeItems: 'center' }">
                <component :is="counterpartyIcon(r.type)" :size="13"/>
              </div>
              <span :style="{ fontWeight: 500 }">{{ r.counterparty }}</span>
            </div>
          </template>
        </Column>
        <Column header="Tipo">
          <template #body="{ data: r }"><Tag severity="secondary">{{ r.type }}</Tag></template>
        </Column>
        <Column header="Vencimento">
          <template #body="{ data: r }">
            <div :style="{ fontSize: '12.5px' }">{{ new Date(r.due).toLocaleDateString('pt-PT') }}</div>
            <div :style="{ fontSize: '11px', color: dueColor(r.days) }">{{ dueLabel(r.days) }}</div>
          </template>
        </Column>
        <Column header="Valor"
          :pt="{ headerCell: { style: { textAlign: 'right' } }, bodyCell: { style: { textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' } } }">
          <template #body="{ data: r }">{{ eur(r.amount) }}</template>
        </Column>
        <Column header="Estado">
          <template #body="{ data: r }">
            <Tag v-if="r.status === 'pending'"   severity="warn">Pendente</Tag>
            <Tag v-if="r.status === 'overdue'"   severity="danger">Em atraso</Tag>
            <Tag v-if="r.status === 'paid'"      severity="success">Liquidado</Tag>
            <Tag v-if="r.status === 'scheduled'" severity="info">Agendado</Tag>
          </template>
        </Column>
        <Column>
          <template #body>
            <div :style="{ display: 'flex', gap: '4px' }">
              <Button text severity="secondary" :title="'Ver'"><IEye :size="14"/></Button>
              <Button text severity="secondary" :title="'Mais'"><IMore :size="14"/></Button>
            </div>
          </template>
        </Column>
      </DataTable>

      <div :style="{ padding: '14px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }">
        <span :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)' }">
          Total {{ tab === 'receivables' ? 'a receber' : 'a pagar' }}:
        </span>
        <span :style="{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }">
          {{ eur(tab === 'receivables' ? totalRec : totalPay) }}
        </span>
        <div :style="{ marginLeft: 'auto', display: 'flex', gap: '8px' }">
          <Button severity="secondary" outlined size="small">Marcar selecionados como pagos</Button>
          <Button size="small"><IBank :size="13"/> Reconciliar</Button>
        </div>
      </div>
    </Card>
  </div>
</template>
