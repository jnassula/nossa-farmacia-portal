<script setup>
import PostCover from './PostCover.vue';
import CategoryBadge from './CategoryBadge.vue';
const { relativePostDate } = window;

defineProps({ post: Object, isNew: Boolean });
const emit = defineEmits(['open']);
</script>

<template>
  <article @click="emit('open', post)" :style="{
    display: 'flex', flexDirection: 'column',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
    transition: 'all 200ms var(--ease-out)', position: 'relative',
  }">
    <span v-if="isNew" :style="{
      position: 'absolute', top: '12px', right: '12px', zIndex: 2,
      fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px',
      background: 'var(--primary)', color: '#fff', letterSpacing: '0.06em',
    }">NOVO</span>
    <PostCover :post="post" :height="160"/>
    <div :style="{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }">
      <CategoryBadge :id="post.category"/>
      <h3 :style="{ fontSize: '16.5px', fontWeight: 600, lineHeight: 1.3, margin: 0, letterSpacing: '-0.01em' }">{{ post.title }}</h3>
      <p :style="{
        fontSize: '13px', lineHeight: 1.5, color: 'var(--foreground-muted)', margin: 0,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }">{{ post.excerpt }}</p>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '6px', fontSize: '11.5px', color: 'var(--foreground-muted)' }">
        <Avatar :name="post.author.name" :size="20"/>
        <span :style="{ fontWeight: 500, color: 'var(--foreground)' }">{{ post.author.name.split(' ')[0] }} {{ post.author.name.split(' ').slice(-1)[0] }}</span>
        <span>·</span>
        <span>{{ relativePostDate(post.published) }}</span>
        <span :style="{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '3px' }">
          <IClock :size="11"/> {{ post.readMin }}m
        </span>
      </div>
    </div>
  </article>
</template>
