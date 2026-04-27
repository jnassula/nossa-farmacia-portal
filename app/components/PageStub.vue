<script setup>
defineProps({ id: String });

const PAGE_TITLES = window.PAGE_TITLES || {};
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
    <div>
      <h1 :style="{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }">
        {{ PAGE_TITLES[id] || id }}
      </h1>
      <p :style="{ color: 'var(--foreground-muted)', fontSize: '13.5px', margin: '4px 0 0' }">
        Esta secção está em desenvolvimento.
      </p>
    </div>
    <Empty title="Em construção" desc="Esta página será disponibilizada na próxima fase do portal. Use ⌘K para navegar para outra secção.">
      <template #icon><ISparkle :size="22"/></template>
    </Empty>
  </div>
</template>
