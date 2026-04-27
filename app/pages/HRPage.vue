<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const view = ref('grid'); // grid | schedule
const filter = ref('all');

const filtered = computed(() => D.team.filter(t => {
  if (filter.value === 'dt' && !t.role.toLowerCase().includes('diretor')) return false;
  if (filter.value === 'pharma' && !t.role.toLowerCase().includes('farmacêutic')) return false;
  return true;
}));

const tabs = computed(() => [
  { id: 'all',    label: 'Todos',              count: D.team.length },
  { id: 'dt',     label: 'Diretores técnicos', count: D.team.filter(t => t.role.toLowerCase().includes('diretor')).length },
  { id: 'pharma', label: 'Farmacêuticos',      count: D.team.filter(t => t.role.toLowerCase().includes('farmacêutic')).length },
]);

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const shifts = ['M', 'T', 'M', 'T', 'M', 'M', '—', 'T', 'M', 'T', 'M', 'M', 'T', '—'];

const phaName = (id) => (D.pharmacies.find(p => p.id === id)?.name || '—').replace('Farmácia Nossa ', '');

const shiftTone = (sh) => {
  if (sh === 'M') return { bg: 'oklch(0.96 0.04 78)', fg: 'oklch(0.45 0.15 78)' };
  if (sh === 'T') return { bg: 'var(--primary-soft)', fg: 'var(--brand-emerald-700)' };
  return { bg: 'var(--ink-50)', fg: 'var(--foreground-subtle)' };
};
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="86 colaboradores · 12 unidades · turnos da semana de 26/04 a 02/05">
      Equipa
      <template #action>
        <div :style="{ display: 'flex', gap: '8px' }">
          <Btn variant="ghost"><ICalendar :size="14"/> Escala</Btn>
          <Btn variant="primary"><IPlus :size="14"/> Convidar</Btn>
        </div>
      </template>
    </SectionTitle>

    <div class="kpi-grid">
      <KPI label="Colaboradores" value="86" sub="12 unidades"><template #icon><IUsers :size="16"/></template></KPI>
      <KPI label="Diretores técnicos" value="12" sub="todas as unidades"><template #icon><IShield :size="16"/></template></KPI>
      <KPI label="Horas extra · mês" value="142h" :delta="-8.4"><template #icon><IClock :size="16"/></template></KPI>
      <KPI label="Massa salarial" value="84.2 K€" :delta="2.1"><template #icon><IWallet :size="16"/></template></KPI>
    </div>

    <div :style="{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }">
      <Tabs :value="filter" :tabs="tabs" @change="(id) => filter = id"/>
      <div class="seg">
        <button :class="{ active: view === 'grid' }" @click="view = 'grid'">Cartões</button>
        <button :class="{ active: view === 'schedule' }" @click="view = 'schedule'">Escala</button>
      </div>
    </div>

    <!-- Grid view -->
    <div v-if="view === 'grid'"
      :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }">
      <Card v-for="t in filtered" :key="t.id" :style="{ padding: '18px' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }">
          <Avatar :name="t.name" :size="44" :bg="t.avatar"/>
          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ t.name }}</div>
            <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">{{ t.role }}</div>
          </div>
          <Pill v-if="t.status === 'leave'" tone="warning" dot>Ausente</Pill>
          <Pill v-else tone="success" dot>Ativo</Pill>
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-muted)' }">
            <IBuilding :size="13"/>{{ phaName(t.pharmacy) }}
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-muted)' }">
            <IClock :size="13"/>{{ t.shift }} · {{ t.hours }}h / mês
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-muted)' }">
            <ICalendar :size="13"/>desde {{ t.join }}
          </div>
        </div>
        <div :style="{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '12px' }">
          <Pill v-for="s in t.skills" :key="s" tone="neutral">{{ s }}</Pill>
        </div>
      </Card>
    </div>

    <!-- Schedule view -->
    <Card v-else :style="{ padding: 0, overflow: 'hidden' }">
      <table class="data-table">
        <thead>
          <tr>
            <th :style="{ minWidth: '200px' }">Colaborador</th>
            <th v-for="(d, i) in days" :key="d" :style="{ textAlign: 'center', minWidth: '64px' }">
              {{ d }}
              <div :style="{ fontSize: '10px', fontWeight: 400, color: 'var(--foreground-subtle)' }">{{ 26 + i }}/04</div>
            </th>
            <th :style="{ textAlign: 'right' }">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, i) in filtered" :key="t.id">
            <td>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                <Avatar :name="t.name" :size="26" :bg="t.avatar"/>
                <div>
                  <div :style="{ fontWeight: 500, fontSize: '13px' }">{{ t.name }}</div>
                  <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)' }">{{ t.role }}</div>
                </div>
              </div>
            </td>
            <td v-for="(d, j) in days" :key="j" :style="{ textAlign: 'center' }">
              <span :style="{
                display: 'inline-flex', minWidth: '32px', padding: '3px 10px', borderRadius: '6px',
                background: shiftTone(shifts[(i + j) % shifts.length]).bg,
                color: shiftTone(shifts[(i + j) % shifts.length]).fg,
                fontSize: '12px', fontWeight: 600,
              }">{{ shifts[(i + j) % shifts.length] }}</span>
            </td>
            <td :style="{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }">
              {{ Math.floor(t.hours / 4) }}h
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>
