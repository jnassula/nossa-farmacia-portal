<script setup>
defineProps({ label: String });
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <label :style="{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground-muted)' }">{{ label }}</label>
      <slot name="hint"/>
    </div>
    <div class="ui-field"
      :style="{ display: 'flex', alignItems: 'center', gap: '8px', height: '44px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 14px', transition: 'all 160ms' }">
      <slot/>
    </div>
  </div>
</template>
