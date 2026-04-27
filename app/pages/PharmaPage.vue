<script setup>
import { ref } from 'vue';

const D = window.PORTAL_DATA;
const fmt = window.fmt;
const eur = window.eur;
const tab = ref('queue');

const queueStatus = {
  awaiting:    { label: 'A aguardar',  tone: 'warn' },
  in_progress: { label: 'Em curso',     tone: 'info' },
  verified:    { label: 'Verificada',   tone: 'success' },
};

const sevMap = {
  danger:  { tone: 'danger',  label: 'Crítico'   },
  warning: { tone: 'warn', label: 'Moderado' },
  info:    { tone: 'info',    label: 'Leve'      },
};

const iconMap = {
  heart:   'IHeart',
  pill:    'IPill',
  shield:  'IShield',
  leaf:    'ISparkle',
  wind:    'IWind',
  package: 'IPackage',
};

const tabs = [
  { id: 'queue',        label: 'Fila de dispensa',          count: D.dispensingQueue.length },
  { id: 'services',     label: 'Serviços',                  count: D.services.length },
  { id: 'interactions', label: 'Interações medicamentosas', count: D.interactions.length },
];
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="Receituário, serviços ao balcão e gestão clínica do dia">Farmacêutico</SectionTitle>

    <div class="kpi-grid">
      <KPI label="Receitas hoje" value="84" :delta="6.2"><template #icon><IPill :size="16"/></template></KPI>
      <KPI label="Em fila" value="6" sub="média 8 min"><template #icon><IClock :size="16"/></template></KPI>
      <KPI label="Serviços agendados" value="22" :delta="12.4"><template #icon><ICalendar :size="16"/></template></KPI>
      <KPI label="Interações detetadas" value="3" sub="2 por resolver"><template #icon><IAlert :size="16"/></template></KPI>
    </div>

    <SelectButton v-model="tab" :options="tabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>

    <!-- Queue tab -->
    <Card v-if="tab === 'queue'" :style="{ padding: 0, overflow: 'hidden' }">
      <DataTable :value="D.dispensingQueue" :rowHover="true" stripedRows>
        <Column header="Receita">
          <template #body="{ data }">
            <span :style="{ fontFamily: 'var(--font-mono)', fontSize: '12px' }">{{ data.id }}</span>
          </template>
        </Column>
        <Column header="Doente" field="patient" :pt="{ bodyCell: { style: { fontWeight: 500 } } }"/>
        <Column header="Médico" field="doctor" :pt="{ bodyCell: { style: { color: 'var(--foreground-muted)' } } }"/>
        <Column header="Tipo" field="type"/>
        <Column header="Itens" field="items"
          :pt="{ headerCell: { style: { textAlign: 'center' } }, bodyCell: { style: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' } } }"/>
        <Column header="Estado">
          <template #body="{ data }">
            <Tag :severity="queueStatus[data.status].tone">{{ queueStatus[data.status].label }}</Tag>
          </template>
        </Column>
        <Column header="Prioridade">
          <template #body="{ data }">
            <Tag v-if="data.priority === 'high'" severity="danger">Urgente</Tag>
            <span v-else :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">Normal</span>
          </template>
        </Column>
        <Column :pt="{ bodyCell: { style: { textAlign: 'right' } } }">
          <template #body><Button text severity="secondary" size="small">Abrir</Button></template>
        </Column>
      </DataTable>
    </Card>

    <!-- Services tab -->
    <div v-else-if="tab === 'services'"
      :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }">
      <Card v-for="s in D.services" :key="s.id" :style="{ padding: '18px' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }">
          <div :style="{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }">
            <component :is="iconMap[s.icon] || 'IPill'" :size="18"/>
          </div>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '14.5px', fontWeight: 600 }">{{ s.name }}</div>
            <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">★ {{ s.rating }} · {{ s.avg }}</div>
          </div>
        </div>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
          <Stat label="Reservas" :value="fmt(s.bookings)"/>
          <Stat label="Receita"  :value="eur(s.revenue)"/>
        </div>
      </Card>
    </div>

    <!-- Interactions tab -->
    <Card v-else :style="{ padding: 0, overflow: 'hidden' }">
      <DataTable :value="D.interactions" :rowHover="true" stripedRows>
        <Column header="Severidade">
          <template #body="{ data }">
            <Tag :severity="sevMap[data.sev].tone">{{ sevMap[data.sev].label }}</Tag>
          </template>
        </Column>
        <Column header="Combinação" :pt="{ bodyCell: { style: { fontWeight: 500 } } }">
          <template #body="{ data }">
            {{ data.drug1 }} <span :style="{ color: 'var(--foreground-muted)', fontWeight: 400 }">+</span> {{ data.drug2 }}
          </template>
        </Column>
        <Column header="Doente" field="patient"/>
        <Column header="Nota" :pt="{ bodyCell: { style: { color: 'var(--foreground-muted)', maxWidth: '320px', fontSize: '12.5px' } } }" field="note"/>
        <Column header="Quando" field="when" :pt="{ bodyCell: { style: { color: 'var(--foreground-muted)' } } }"/>
        <Column header="Estado">
          <template #body="{ data }">
            <Tag v-if="data.resolved" severity="success">Resolvida</Tag>
            <Button v-else outlined size="small">Resolver</Button>
          </template>
        </Column>
      </DataTable>
    </Card>
  </div>
</template>
