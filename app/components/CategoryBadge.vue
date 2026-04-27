<script setup>
import { computed } from 'vue';
const { getCategoryMeta } = window;

const props = defineProps({
  id:   String,
  size: { type: String, default: 'sm' },
});
const meta = computed(() => getCategoryMeta(props.id));
</script>

<template>
  <span :style="{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: size === 'sm' ? '10.5px' : '11.5px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: meta.color,
  }">
    <span :style="{ width: '6px', height: '6px', borderRadius: '999px', background: meta.color }"/>
    {{ meta.label }}
  </span>
</template>
