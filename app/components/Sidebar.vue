<script setup>
import { computed } from 'vue';
import PharmacySwitcher from './PharmacySwitcher.vue';

const props = defineProps({
  active:     { type: String, default: '' },
  collapsed:  { type: Boolean, default: false },
  mobileOpen: { type: Boolean, default: false },
});
const emit = defineEmits(['navigate', 'mobile-close']);

const NAV = window.NAV;
const w = computed(() => props.collapsed ? 72 : 248);

const handleNav = (id) => { emit('navigate', id); emit('mobile-close'); };
</script>

<template>
  <div :class="['sidebar-backdrop', { open: mobileOpen }]" @click="emit('mobile-close')"/>
  <aside
    :class="['app-sidebar', { open: mobileOpen }]"
    :style="{
      width: w + 'px', flex: 'none',
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      height: '100vh', position: 'sticky', top: 0,
      transition: 'width 220ms var(--ease-out)',
    }">

    <!-- Brand -->
    <div :style="{
      padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: '10px',
      height: '64px', borderBottom: '1px solid var(--border-subtle)',
    }">
      <img src="assets/nf_icon.svg" width="28" height="28" alt="Nossa Farmácia" :style="{ flex: 'none' }"/>
      <div v-if="!collapsed" :style="{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, flex: 1 }">
        <div :style="{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.01em' }">
          nossa <span :style="{ color: 'var(--foreground-muted)', fontWeight: 500 }">portal</span>
        </div>
        <div :style="{ fontSize: '10.5px', color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }">
          Grupo · gestão
        </div>
      </div>
      <button v-if="!collapsed" class="sidebar-close-mobile"
        @click="emit('mobile-close')"
        :style="{ display: 'none', background: 'transparent', border: 0, color: 'var(--foreground-muted)', cursor: 'pointer', padding: '4px' }">
        <IClose :size="18"/>
      </button>
    </div>

    <PharmacySwitcher :collapsed="collapsed" @navigate="(id) => emit('navigate', id)"/>

    <nav :style="{ flex: 1, overflowY: 'auto', padding: '6px 12px 12px' }">
      <div v-for="group in NAV" :key="group.group">
        <div v-if="!collapsed" class="nav-section-label">{{ group.group }}</div>
        <div v-else :style="{ height: '12px' }"/>
        <div v-for="item in group.items" :key="item.id"
          :class="['nav-item', { active: active === item.id }]"
          :title="collapsed ? item.label : undefined"
          :style="collapsed ? { justifyContent: 'center', padding: '10px' } : {}"
          @click="handleNav(item.id)">
          <component :is="item.icon" :size="17"/>
          <span v-if="!collapsed" :style="{ flex: 1 }">{{ item.label }}</span>
          <span v-if="!collapsed && item.badge"
            :style="{ fontSize: '10.5px', fontWeight: 600, padding: '1px 6px', background: 'var(--danger)', color: '#fff', borderRadius: '999px' }">
            {{ item.badge }}
          </span>
        </div>
      </div>
    </nav>

    <div v-if="!collapsed" :style="{ padding: '14px', borderTop: '1px solid var(--border-subtle)' }">
      <div :style="{
        background: 'var(--primary-soft)', border: '1px solid var(--brand-emerald-200)',
        borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px',
      }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--brand-emerald-800)' }">
          <ISparkle :size="14"/> Nossa AI
        </div>
        <div :style="{ fontSize: '11.5px', color: 'var(--brand-emerald-800)', lineHeight: 1.4 }">
          Pergunte ao assistente sobre qualquer farmácia.
        </div>
        <button class="btn soft sm" :style="{ marginTop: '4px', height: '28px', fontSize: '12px' }">
          Abrir Nossa AI
        </button>
      </div>
    </div>
  </aside>
</template>
