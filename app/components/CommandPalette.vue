<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close', 'navigate']);

const NAV = window.NAV;
const q = ref('');
const inputRef = ref(null);

watch(() => props.open, (v) => {
  if (v) nextTick(() => setTimeout(() => inputRef.value?.focus(), 50));
  else q.value = '';
});

const items = computed(() => [
  ...NAV.flatMap(g => g.items.map(i => ({ ...i, group: g.group, kind: 'page' }))),
  { id: 'new-order',   label: 'Nova encomenda a fornecedor',  icon: 'ITruck',     group: 'Ações', kind: 'action' },
  { id: 'transfer',    label: 'Transferência inter-farmácia', icon: 'IPackage',   group: 'Ações', kind: 'action' },
  { id: 'campaign',    label: 'Nova campanha',                icon: 'IMegaphone', group: 'Ações', kind: 'action' },
  { id: 'export-saft', label: 'Exportar SAF-T',               icon: 'IDownload',  group: 'Ações', kind: 'action' },
]);

const filtered = computed(() => {
  if (!q.value) return items.value;
  const needle = q.value.toLowerCase();
  return items.value.filter(i => i.label.toLowerCase().includes(needle));
});

const grouped = computed(() => {
  return filtered.value.reduce((acc, it) => {
    (acc[it.group] = acc[it.group] || []).push(it);
    return acc;
  }, {});
});

const kbdStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '10.5px',
  padding: '2px 6px', borderRadius: '5px',
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--foreground-muted)',
};

const onPick = (it) => {
  if (it.kind === 'page') emit('navigate', it.id);
  emit('close');
};
</script>

<template>
  <div v-if="open" class="backdrop" @click="emit('close')" :style="{ alignItems: 'flex-start', paddingTop: '96px' }">
    <div class="scale-in" @click.stop
      :style="{
        width: '600px', maxWidth: 'calc(100vw - 40px)', maxHeight: '480px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', boxShadow: 'var(--shadow-xl)',
        display: 'flex', flexDirection: 'column',
      }">
      <div :style="{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }">
        <ISearch :size="16" :style="{ color: 'var(--foreground-muted)' }"/>
        <input ref="inputRef" v-model="q"
          placeholder="Procurar páginas, ações, produtos…"
          :style="{ flex: 1, border: 0, outline: 0, background: 'transparent', font: 'inherit', fontSize: '16px', color: 'var(--foreground)' }"/>
        <kbd :style="kbdStyle">esc</kbd>
      </div>

      <div :style="{ flex: 1, overflowY: 'auto', padding: '6px' }">
        <Empty v-if="Object.keys(grouped).length === 0"
          title="Sem resultados" desc="Tente outro termo">
          <template #icon><ISearch :size="20"/></template>
        </Empty>
        <div v-for="(items_, group) in grouped" :key="group">
          <div :style="{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground-subtle)', padding: '10px 14px 6px' }">{{ group }}</div>
          <div v-for="it in items_" :key="it.id" class="row-hover"
            @click="onPick(it)"
            :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }">
            <div :style="{ width: '28px', height: '28px', borderRadius: '7px', background: 'var(--surface-sunken)', color: 'var(--foreground-muted)', display: 'grid', placeItems: 'center' }">
              <component :is="it.icon" :size="16"/>
            </div>
            <div :style="{ fontSize: '13px', fontWeight: 500 }">{{ it.label }}</div>
            <IArrowRight :size="14" :style="{ marginLeft: 'auto', color: 'var(--foreground-subtle)' }"/>
          </div>
        </div>
      </div>

      <div :style="{ padding: '8px 14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'var(--foreground-muted)' }">
        <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }"><kbd :style="kbdStyle">↵</kbd> abrir</span>
        <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }"><kbd :style="kbdStyle">↑</kbd><kbd :style="kbdStyle">↓</kbd> navegar</span>
        <span :style="{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }">
          <ISparkle :size="12"/> Pesquisa global
        </span>
      </div>
    </div>
  </div>
</template>
