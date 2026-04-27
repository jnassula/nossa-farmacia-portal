<script setup>
defineProps({ n: [String, Number], label: String });
</script>

<template>
  <div>
    <div :style="{ fontSize: '22px', fontWeight: 700, color: 'var(--brand-emerald-900)', letterSpacing: '-0.01em' }">{{ n }}</div>
    <div :style="{ fontSize: '11px', color: 'var(--brand-emerald-700)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }">{{ label }}</div>
  </div>
</template>
