<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { fmt, eur, eurD } = window;

const search = ref('');
const filter = ref('all');
const selected = ref(new Set());
const drawerItem = ref(null);

const items = computed(() => D.stockItems.filter(i => {
  const ms = !search.value
    || i.name.toLowerCase().includes(search.value.toLowerCase())
    || i.sku.toLowerCase().includes(search.value.toLowerCase());
  const mf = filter.value === 'all' || i.status === filter.value;
  return ms && mf;
}));

const tabs = computed(() => [
  { id: 'all',  label: 'Todos',            count: D.stockItems.length },
  { id: 'low',  label: 'Stock baixo',      count: D.stockItems.filter(i => i.status === 'low').length },
  { id: 'soon', label: 'Validade próxima', count: D.stockItems.filter(i => i.status === 'soon').length },
  { id: 'ok',   label: 'Normal',           count: D.stockItems.filter(i => i.status === 'ok').length },
]);

const toggle = (sku) => {
  const ns = new Set(selected.value);
  if (ns.has(sku)) ns.delete(sku); else ns.add(sku);
  selected.value = ns;
};

const allChecked = computed(() => selected.value.size === items.value.length && items.value.length > 0);
const onAllToggle = (e) => {
  selected.value = e.target.checked ? new Set(items.value.map(i => i.sku)) : new Set();
};

const today = new Date('2026-04-26');
const daysToExpiry = (iso) => {
  const expDate = new Date(iso);
  return { date: expDate.toLocaleDateString('pt-PT'), days: Math.round((expDate - today) / 86400000) };
};

// Drawer distribution
const distribution = computed(() => D.pharmacies.slice(0, 6).map((p, i) => {
  const stock = [42, 28, 15, 8, 35, 22][i];
  return {
    ...p,
    stock,
    pct: (stock / 50) * 100,
    color: stock < 15 ? 'var(--signal-danger)' : stock < 30 ? 'var(--signal-warning)' : 'var(--primary)',
  };
}));

const drawerSales = [18,22,16,20,28,24,30,26,32,28,34,30,38,42,36,40,44,38,42,46,48,52,48,54,58,62,58,64,68,72]
  .map((v) => ({ m: '', v }));

const movements = [
  { t: 'Venda · 4 un.',         w: 'Boavista',         when: '17:42', delta: -4 },
  { t: 'Receção · 60 un.',      w: 'Lisboa CD',        when: '14:20', delta: +60 },
  { t: 'Transferência interna', w: 'Belém → Baixa',    when: 'ontem', delta: 0 },
  { t: 'Venda · 2 un.',         w: 'Foz',               when: 'ontem', delta: -2 },
];

const moveColor = (d) => d < 0 ? 'oklch(0.50 0.23 27)' : d > 0 ? 'var(--brand-emerald-700)' : 'var(--foreground-muted)';
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
    <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }">
      <div>
        <h1 :style="{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }">Stock</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '13.5px', margin: '4px 0 0' }">Gestão de inventário · todas as farmácias do grupo</p>
      </div>
      <div :style="{ display: 'flex', gap: '8px' }">
        <Btn variant="secondary"><IUpload :size="14"/> Importar</Btn>
        <Btn variant="secondary"><ITruck :size="14"/> Encomenda</Btn>
        <Btn><IPlus :size="14"/> Adicionar produto</Btn>
      </div>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }">
      <Kpi label="SKUs ativos" value="14.820" :trend="1.2" sub="no grupo" :sparkData="[140,142,148,151,148,152,148]"/>
      <Kpi label="Valor de stock" :value="eur(842310)" :trend="-2.1" sub="vs. mês anterior" :sparkData="[860,855,848,842]"/>
      <Kpi label="Roturas" value="38" :trend="4.5" sub="produtos · 12 farmácias" :sparkData="[24,28,32,30,36,38,38]"/>
      <Kpi label="Valid. < 60 dias" value="124" :trend="-8.4" sub="produtos · 8.420 €" :sparkData="[140,138,132,130,128,126,124]"/>
    </div>

    <Card>
      <div :style="{ padding: '14px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }">
        <div :style="{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }">
          <ISearch :size="15" :style="{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }"/>
          <input v-model="search" placeholder="Procurar por nome, SKU, marca…" class="input" :style="{ paddingLeft: '36px' }"/>
        </div>
        <Tabs :value="filter" :tabs="tabs" @change="(id) => filter = id"/>
        <div :style="{ marginLeft: 'auto', display: 'flex', gap: '8px' }">
          <Btn variant="secondary" size="sm"><IFilter :size="13"/> Filtros · 2</Btn>
          <Btn variant="secondary" size="sm"><IDownload :size="13"/> Exportar</Btn>
        </div>
      </div>

      <div v-if="selected.size > 0"
        :style="{ padding: '10px 14px', background: 'var(--primary-soft)', borderBottom: '1px solid var(--brand-emerald-200)', display: 'flex', alignItems: 'center', gap: '12px' }">
        <span :style="{ fontSize: '13px', color: 'var(--brand-emerald-800)', fontWeight: 500 }">{{ selected.size }} produtos selecionados</span>
        <div :style="{ marginLeft: 'auto', display: 'flex', gap: '6px' }">
          <Btn variant="secondary" size="sm"><IPackage :size="13"/> Transferir</Btn>
          <Btn variant="secondary" size="sm"><ITruck :size="13"/> Encomendar</Btn>
          <Btn variant="secondary" size="sm"><ITag :size="13"/> Atualizar preço</Btn>
        </div>
      </div>

      <div :style="{ overflowX: 'auto' }">
        <table class="tbl">
          <thead>
            <tr>
              <th :style="{ width: '36px' }">
                <input type="checkbox" :style="{ accentColor: 'var(--primary)' }" :checked="allChecked" @change="onAllToggle"/>
              </th>
              <th>Produto</th><th>SKU</th><th>Categoria</th>
              <th :style="{ textAlign: 'right' }">Stock</th>
              <th>Validade</th>
              <th :style="{ textAlign: 'right' }">PVP</th>
              <th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="it in items" :key="it.sku" @click="drawerItem = it" :style="{ cursor: 'pointer' }">
              <td @click.stop>
                <input type="checkbox" :style="{ accentColor: 'var(--primary)' }" :checked="selected.has(it.sku)" @change="toggle(it.sku)"/>
              </td>
              <td>
                <div :style="{ fontWeight: 500 }">{{ it.name }}</div>
                <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ it.brand }}</div>
              </td>
              <td :style="{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--foreground-muted)' }">{{ it.sku }}</td>
              <td><Pill tone="neutral">{{ it.category }}</Pill></td>
              <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }">
                <div :style="{ fontWeight: 600 }">{{ it.stock }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--foreground-subtle)' }">min {{ it.min }}</div>
              </td>
              <td :style="{ fontSize: '12px', color: daysToExpiry(it.expiry).days < 60 ? 'oklch(0.50 0.16 78)' : 'var(--foreground-muted)' }">
                {{ daysToExpiry(it.expiry).date }}<br/>
                <span :style="{ fontSize: '10.5px' }">{{ daysToExpiry(it.expiry).days > 0 ? daysToExpiry(it.expiry).days + ' dias' : 'expirado' }}</span>
              </td>
              <td :style="{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }">{{ eurD(it.price) }}</td>
              <td>
                <Pill v-if="it.status === 'low'"  tone="danger"  dot>Stock baixo</Pill>
                <Pill v-if="it.status === 'soon'" tone="warning" dot>Val. próxima</Pill>
                <Pill v-if="it.status === 'ok'"   tone="success" dot>Normal</Pill>
              </td>
              <td><IconBtn><IMore :size="14"/></IconBtn></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div :style="{ padding: '12px 16px', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--foreground-muted)' }">
        <span>A mostrar {{ items.length }} de 14.820 produtos</span>
        <div :style="{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }">
          <IconBtn><IChevronLeft :size="14"/></IconBtn>
          <span :style="{ padding: '4px 10px', borderRadius: '6px', background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 600 }">1</span>
          <span :style="{ padding: '4px 10px', cursor: 'pointer' }">2</span>
          <span :style="{ padding: '4px 10px', cursor: 'pointer' }">3</span>
          <span>…</span>
          <span :style="{ padding: '4px 10px', cursor: 'pointer' }">247</span>
          <IconBtn><IChevronRight :size="14"/></IconBtn>
        </div>
      </div>
    </Card>

    <Drawer :open="!!drawerItem"
      :title="drawerItem?.name"
      :subtitle="drawerItem ? `${drawerItem.brand} · SKU ${drawerItem.sku}` : ''"
      @close="drawerItem = null">
      <template #footer>
        <Btn variant="secondary"><IPackage :size="14"/> Transferir</Btn>
        <Btn><ITruck :size="14"/> Encomendar</Btn>
      </template>

      <div v-if="drawerItem" :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
        <div :style="{ display: 'flex', gap: '10px', flexWrap: 'wrap' }">
          <Pill v-if="drawerItem.status === 'low'"  tone="danger"  dot>Stock baixo</Pill>
          <Pill v-if="drawerItem.status === 'soon'" tone="warning" dot>Validade próxima</Pill>
          <Pill tone="neutral">{{ drawerItem.category }}</Pill>
          <Pill tone="outline">PVP {{ eurD(drawerItem.price) }}</Pill>
        </div>

        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }">
          <MiniStat label="Stock total" :value="fmt(drawerItem.stock)" sub="unidades · grupo"/>
          <MiniStat label="Stock mínimo" :value="fmt(drawerItem.min)" sub="por farmácia"/>
          <MiniStat label="Validade" :value="new Date(drawerItem.expiry).toLocaleDateString('pt-PT')" sub="lote mais antigo"/>
          <MiniStat label="Margem" value="34%" sub="bruta"/>
        </div>

        <div>
          <div :style="{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }">Distribuição por farmácia</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
            <div v-for="d in distribution" :key="d.id"
              :style="{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }">
              <div :style="{ width: '130px', color: 'var(--foreground-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ d.name }}</div>
              <div :style="{ flex: 1 }">
                <ProgressBar :value="d.pct" :color="d.color"/>
              </div>
              <div :style="{ width: '36px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }">{{ d.stock }}</div>
            </div>
          </div>
        </div>

        <div>
          <div :style="{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }">Vendas · últimos 30 dias</div>
          <Card :style="{ padding: '14px' }">
            <LineChart :data="drawerSales" :height="140" :formatY="(v) => v"/>
          </Card>
        </div>

        <div>
          <div :style="{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }">Últimos movimentos</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px' }">
            <div v-for="(m, i) in movements" :key="i"
              :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'var(--surface-sunken)' }">
              <div :style="{
                width: '24px', height: '24px', borderRadius: '6px', background: 'var(--surface)',
                color: moveColor(m.delta),
                display: 'grid', placeItems: 'center',
              }">
                <IArrowDown v-if="m.delta < 0" :size="12"/>
                <IArrowUp   v-else-if="m.delta > 0" :size="12"/>
                <IPackage   v-else :size="12"/>
              </div>
              <div :style="{ flex: 1 }">
                <div :style="{ fontWeight: 500 }">{{ m.t }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)' }">{{ m.w }} · {{ m.when }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
