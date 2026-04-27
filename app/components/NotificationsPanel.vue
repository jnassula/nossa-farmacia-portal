<script setup>
const { usePortal } = window;

defineProps({ open: Boolean });
const emit = defineEmits(['close']);

const { notifications, markAllRead } = usePortal();

const sevMap = {
  danger:  { bg: 'oklch(0.96 0.06 27)',  fg: 'oklch(0.50 0.23 27)',       icon: 'IAlert' },
  warning: { bg: 'oklch(0.96 0.06 78)',  fg: 'oklch(0.50 0.16 78)',       icon: 'IAlert' },
  info:    { bg: 'oklch(0.95 0.05 230)', fg: 'oklch(0.45 0.16 230)',      icon: 'IInfo'  },
  success: { bg: 'oklch(0.95 0.05 163)', fg: 'var(--brand-emerald-700)',  icon: 'ICheck' },
};
</script>

<template>
  <template v-if="open">
    <div @click="emit('close')" :style="{ position: 'fixed', inset: 0, zIndex: 40 }"/>
    <div class="slide-in-right notif-panel"
      :style="{
        position: 'fixed', top: '70px', right: '24px', width: '380px', maxHeight: '520px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', boxShadow: 'var(--shadow-xl)', zIndex: 50,
        display: 'flex', flexDirection: 'column',
      }">
      <div :style="{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }">
        <div :style="{ flex: 1 }">
          <div :style="{ fontSize: '14px', fontWeight: 600 }">Notificações</div>
          <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">
            {{ notifications.filter(n => n.unread).length }} novas
          </div>
        </div>
        <Button text severity="secondary" size="small" @click="markAllRead">Marcar como lidas</Button>
      </div>

      <div :style="{ flex: 1, overflowY: 'auto', padding: '6px' }">
        <div v-for="n in notifications" :key="n.id" class="row-hover"
          :style="{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '8px', alignItems: 'flex-start', cursor: 'pointer', position: 'relative' }">
          <div :style="{
            width: '28px', height: '28px', borderRadius: '8px',
            background: (sevMap[n.sev] || sevMap.info).bg,
            color: (sevMap[n.sev] || sevMap.info).fg,
            display: 'grid', placeItems: 'center', flex: 'none',
          }">
            <component :is="(sevMap[n.sev] || sevMap.info).icon" :size="14"/>
          </div>
          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ fontSize: '13px', fontWeight: 600 }">{{ n.title }}</div>
            <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '2px' }">{{ n.desc }}</div>
            <div :style="{ fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '4px' }">{{ n.time }}</div>
          </div>
          <span v-if="n.unread"
            :style="{ width: '7px', height: '7px', borderRadius: '999px', background: 'var(--primary)', marginTop: '12px' }"/>
        </div>
      </div>

      <div :style="{ padding: '10px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }">
        <a href="#" @click.prevent
          :style="{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }">
          Ver todas as notificações →
        </a>
      </div>
    </div>
  </template>
</template>
