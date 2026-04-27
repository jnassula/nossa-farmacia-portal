<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const filter = ref('all');

const statusMap = {
  overdue:     { label: 'Atrasado',   tone: 'danger'  },
  pending:     { label: 'Pendente',   tone: 'warning' },
  in_progress: { label: 'Em curso',    tone: 'info'   },
  scheduled:   { label: 'Agendado',    tone: 'neutral' },
  done:        { label: 'Concluído',  tone: 'success' },
};

const filtered = computed(() => D.compliance.filter(c => filter.value === 'all' ? true : c.status === filter.value));
const overdue = computed(() => D.compliance.filter(c => c.status === 'overdue').length);
const next30  = computed(() => D.compliance.filter(c => c.status === 'pending').length);

const tabs = computed(() => [
  { id: 'all',         label: 'Todas',     count: D.compliance.length },
  { id: 'overdue',     label: 'Atrasadas', count: D.compliance.filter(c => c.status === 'overdue').length },
  { id: 'pending',     label: 'Pendentes', count: D.compliance.filter(c => c.status === 'pending').length },
  { id: 'in_progress', label: 'Em curso',  count: D.compliance.filter(c => c.status === 'in_progress').length },
]);
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="INFARMED · RGPD · Manipulados · Estupefacientes · Formação · Ordem dos Farmacêuticos">
      Compliance
      <template #action>
        <Btn variant="primary"><IPlus :size="14"/> Nova obrigação</Btn>
      </template>
    </SectionTitle>

    <div class="kpi-grid">
      <KPI label="Em atraso" :value="overdue" sub="Ação imediata">
        <template #icon><IAlert :size="16"/></template>
      </KPI>
      <KPI label="Próximos 30 dias" :value="next30" sub="Pendentes">
        <template #icon><ICalendar :size="16"/></template>
      </KPI>
      <KPI label="Conformidade · grupo" value="94%" :delta="1.4">
        <template #icon><IShield :size="16"/></template>
      </KPI>
      <KPI label="Auditorias · ano" value="6" sub="2 INFARMED · 4 internas">
        <template #icon><ICheck :size="16"/></template>
      </KPI>
    </div>

    <Tabs :value="filter" :tabs="tabs" @change="(id) => filter = id"/>

    <Card :style="{ padding: 0, overflow: 'hidden' }">
      <table class="data-table">
        <thead>
          <tr><th>Tipo</th><th>Obrigação</th><th>Unidade</th><th>Documento</th><th>Vencimento</th><th>Prioridade</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td><Pill tone="neutral">{{ c.kind }}</Pill></td>
            <td :style="{ fontWeight: 500, maxWidth: '280px' }">{{ c.title }}</td>
            <td :style="{ fontSize: '12.5px' }">
              <em v-if="c.pharmacy === 'all'" :style="{ color: 'var(--foreground-muted)' }">Grupo</em>
              <template v-else>{{ (D.pharmacies.find(p => p.id === c.pharmacy)?.name || '').replace('Farmácia Nossa ', '') }}</template>
            </td>
            <td :style="{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ c.doc }}</td>
            <td :style="{ fontSize: '12.5px', fontVariantNumeric: 'tabular-nums' }">{{ c.due }}</td>
            <td>
              <Pill v-if="c.priority === 'high'" tone="danger" dot>Alta</Pill>
              <Pill v-else-if="c.priority === 'medium'" tone="warning" dot>Média</Pill>
              <Pill v-else tone="neutral">Baixa</Pill>
            </td>
            <td><Pill :tone="statusMap[c.status].tone" dot>{{ statusMap[c.status].label }}</Pill></td>
            <td :style="{ textAlign: 'right' }"><Btn variant="ghost" size="sm">Abrir</Btn></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>
