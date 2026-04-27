<script setup>
const { coverIconFor } = window;

const props = defineProps({
  post:   { type: Object, required: true },
  height: { type: Number, default: 200 },
  large:  Boolean,
});
</script>

<template>
  <div :style="{
    height: height + 'px', background: post.coverGradient,
    display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden',
  }">
    <component :is="coverIconFor(post.coverIcon)" :size="large ? 64 : 40" :style="{ color: 'rgba(255,255,255,0.95)' }"/>
    <svg width="100%" height="100%" :style="{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }">
      <circle cx="20%" cy="80%" :r="large ? 140 : 80" fill="white"/>
      <circle cx="85%" cy="15%" :r="large ? 90 : 50" fill="white"/>
    </svg>
  </div>
</template>
