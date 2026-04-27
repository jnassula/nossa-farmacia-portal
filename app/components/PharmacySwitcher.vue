<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
const { usePortal } = window;

defineProps({ collapsed: Boolean });
const emit = defineEmits(['navigate']);

const { activePharmacy, setActivePharmacy, pharmacies } = usePortal();
const open = ref(false);
const rootRef = ref(null);

const display = computed(() => {
  if (activePharmacy.value === 'all') {
    return { name: 'Todas as farmácias', sub: pharmacies.length + ' unidades' };
  }
  const p = pharmacies.find(x => x.id === activePharmacy.value);
  return p
    ? { name: p.name, sub: p.city + ' · ' + p.district }
    : { name: '—', sub: '' };
});

const onDoc = (e) => {
  if (rootRef.value && !rootRef.value.contains(e.target)) open.value = false;
};
onMounted(() => document.addEventListener('mousedown', onDoc));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc));

const select = (id) => { setActivePharmacy(id); open.value = false; };

const optStyle = (active) => ({
  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
  padding: '8px 10px', borderRadius: '8px',
  background: active ? 'var(--primary-soft)' : 'transparent',
  border: 0,
  color: active ? 'var(--brand-emerald-800)' : 'var(--foreground)',
  cursor: 'pointer', textAlign: 'left',
  font: 'inherit',
});
</script>

<template>
  <div v-if="collapsed" :style="{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }">
    <div :title="display.name"
      :style="{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', cursor: 'pointer' }"
      @click="emit('navigate', 'units')">
      <IBuilding :size="18"/>
    </div>
  </div>

  <div v-else ref="rootRef" :style="{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }">
    <button @click="open = !open"
      :style="{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'var(--surface-sunken)', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', textAlign: 'left' }">
      <div :style="{ width: '26px', height: '26px', borderRadius: '7px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }">
        <IBuilding :size="14"/>
      </div>
      <div :style="{ flex: 1, minWidth: 0 }">
        <div :style="{ fontSize: '10.5px', color: 'var(--foreground-muted)', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.06em' }">Vista</div>
        <div :style="{ fontSize: '12.5px', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ display.name }}</div>
      </div>
      <IChevronDown :size="14" :style="{ color: 'var(--foreground-muted)', transition: 'transform 160ms', transform: open ? 'rotate(180deg)' : 'none' }"/>
    </button>

    <div v-if="open" class="scale-in"
      :style="{ position: 'absolute', top: 'calc(100% - 4px)', left: '12px', right: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 30, maxHeight: '360px', overflowY: 'auto', padding: '6px' }">
      <button :style="optStyle(activePharmacy === 'all')" @click="select('all')">
        <div :style="{ flex: 1, minWidth: 0 }">
          <div :style="{ fontSize: '12.5px', fontWeight: 500, lineHeight: 1.3 }">Todas as farmácias</div>
          <div :style="{ fontSize: '11px', color: activePharmacy === 'all' ? 'var(--brand-emerald-700)' : 'var(--foreground-muted)' }">
            {{ pharmacies.length }} unidades
          </div>
        </div>
        <ICheck v-if="activePharmacy === 'all'" :size="14"/>
      </button>
      <div :style="{ height: '1px', background: 'var(--border-subtle)', margin: '4px 6px' }"/>
      <button v-for="p in pharmacies" :key="p.id" :style="optStyle(activePharmacy === p.id)" @click="select(p.id)">
        <div :style="{ flex: 1, minWidth: 0 }">
          <div :style="{ fontSize: '12.5px', fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ p.name }}</div>
          <div :style="{ fontSize: '11px', color: activePharmacy === p.id ? 'var(--brand-emerald-700)' : 'var(--foreground-muted)' }">
            {{ p.city }} · {{ p.district }}
          </div>
        </div>
        <ICheck v-if="activePharmacy === p.id" :size="14"/>
      </button>
    </div>
  </div>
</template>
