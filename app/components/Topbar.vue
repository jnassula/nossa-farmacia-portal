<script setup>
const { usePortal } = window;

defineProps({
  title: String,
  breadcrumbs: { type: Array, default: () => [] },
});
const emit = defineEmits(['open-search', 'open-notifs', 'toggle-sidebar']);

const { unreadCount, user } = usePortal();

const kbdStyle = {
  fontFamily: 'var(--font-mono)', fontSize: '10.5px',
  padding: '2px 6px', borderRadius: '5px',
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--foreground-muted)',
};
</script>

<template>
  <header class="app-topbar"
    :style="{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      height: '64px', display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '16px',
    }">
    <IconBtn :title="'Alternar menu'" @click="emit('toggle-sidebar')">
      <ISidebar :size="17"/>
    </IconBtn>

    <div :style="{ flex: '0 0 auto', minWidth: 0 }">
      <div v-if="breadcrumbs && breadcrumbs.length" class="tb-breadcrumbs"
        :style="{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--foreground-muted)' }">
        <template v-for="(b, i) in breadcrumbs" :key="i">
          <IChevronRight v-if="i > 0" :size="12"/>
          <span :style="{
            color: i === breadcrumbs.length - 1 ? 'var(--foreground)' : 'var(--foreground-muted)',
            fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
          }">{{ b }}</span>
        </template>
      </div>
      <div class="tb-title-text"
        :style="{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.01em', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">
        {{ title }}
      </div>
    </div>

    <button class="tb-search-full" @click="emit('open-search')"
      :style="{ flex: 1, maxWidth: '480px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', height: '40px', padding: '0 14px', borderRadius: '10px', background: 'var(--ink-50)', border: '1px solid var(--border)', color: 'var(--foreground-muted)', cursor: 'pointer', font: 'inherit' }">
      <ISearch :size="15"/>
      <span :style="{ fontSize: '13px' }">Procurar produtos, clientes, farmácias…</span>
      <span :style="{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }">
        <kbd :style="kbdStyle">⌘</kbd><kbd :style="kbdStyle">K</kbd>
      </span>
    </button>

    <IconBtn class="tb-search-icon" bordered :title="'Procurar'"
      :style="{ display: 'none', marginLeft: 'auto' }"
      @click="emit('open-search')">
      <ISearch :size="16"/>
    </IconBtn>

    <IconBtn bordered :title="'Notificações'"
      :style="{ position: 'relative' }"
      @click="emit('open-notifs')">
      <IBell :size="16"/>
      <span v-if="unreadCount > 0"
        :style="{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '999px', background: 'var(--danger)', border: '2px solid var(--surface)' }"/>
    </IconBtn>

    <div class="tb-user-pill"
      :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px 4px 4px', borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--surface)' }">
      <Avatar :name="user.name" :size="28"/>
      <div class="tb-user-text" :style="{ paddingRight: '6px', lineHeight: 1.1 }">
        <div :style="{ fontSize: '12.5px', fontWeight: 600 }">{{ user.name }}</div>
        <div :style="{ fontSize: '10.5px', color: 'var(--foreground-muted)' }">{{ user.role }}</div>
      </div>
    </div>
  </header>
</template>
