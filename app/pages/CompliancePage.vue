<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const filter = ref('all');

const statusMap = {
  overdue:     { label: 'Atrasado',   tone: 'danger'  },
  pending:     { label: 'Pendente',   tone: 'warn' },
  in_progress: { label: 'Em curso',    tone: 'info'   },
  scheduled:   { label: 'Agendado',    tone: 'secondary' },
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
        <Button severity="primary"><IPlus :size="14"/> Nova obrigação</Button>
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

    <SelectButton v-model="filter" :options="tabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>

    <Card :style="{ padding: 0, overflow: 'hidden' }">
      <DataTable :value="filtered" :rowHover="true" stripedRows>
        <Column header="Tipo">
          <template #body="{ data }"><Tag severity="secondary">{{ data.kind }}</Tag></template>
        </Column>
        <Column header="Obrigação" field="title" :pt="{ bodyCell: { style: { fontWeight: 500, maxWidth: '280px' } } }"/>
        <Column header="Unidade">
          <template #body="{ data }">
            <em v-if="data.pharmacy === 'all'" :style="{ color: 'var(--foreground-muted)' }">Grupo</em>
            <template v-else>{{ (D.pharmacies.find(p => p.id === data.pharmacy)?.name || '').replace('Farmácia Nossa ', '') }}</template>
          </template>
        </Column>
        <Column header="Documento">
          <template #body="{ data }">
            <span :style="{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ data.doc }}</span>
          </template>
        </Column>
        <Column header="Vencimento" field="due" :pt="{ bodyCell: { style: { fontVariantNumeric: 'tabular-nums' } } }"/>
        <Column header="Prioridade">
          <template #body="{ data }">
            <Tag v-if="data.priority === 'high'" severity="danger">Alta</Tag>
            <Tag v-else-if="data.priority === 'medium'" severity="warn">Média</Tag>
            <Tag v-else severity="secondary">Baixa</Tag>
          </template>
        </Column>
        <Column header="Estado">
          <template #body="{ data }">
            <Tag :severity="statusMap[data.status].tone">{{ statusMap[data.status].label }}</Tag>
          </template>
        </Column>
        <Column :pt="{ bodyCell: { style: { textAlign: 'right' } } }">
          <template #body><Button text severity="secondary" size="small">Abrir</Button></template>
        </Column>
      </DataTable>
    </Card>
  </div>
</template>
