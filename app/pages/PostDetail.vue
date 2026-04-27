<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import PostCover from '../components/PostCover.vue';
import PostCard from '../components/PostCard.vue';
import CategoryBadge from '../components/CategoryBadge.vue';
const { formatPostDate } = window;

const props = defineProps({ post: { type: Object, required: true } });
const emit = defineEmits(['back', 'open-post']);

const data = window.PORTAL_DATA;

const reactions = ref(props.post.reactions);
const reacted = ref(false);
const progress = ref(0);

const onScroll = () => {
  const el = document.querySelector('.post-detail-body');
  if (!el) return;
  const total = el.scrollHeight - window.innerHeight;
  progress.value = Math.min(100, Math.max(0, (window.scrollY / Math.max(1, total)) * 100));
};
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));

const related = computed(() =>
  data.posts.filter(p => p.id !== props.post.id && p.status === 'published' && p.category === props.post.category).slice(0, 3)
);

const toggleReaction = () => {
  if (reacted.value) { reacted.value = false; reactions.value -= 1; }
  else               { reacted.value = true;  reactions.value += 1; }
};

const renderInline = (text) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
</script>

<template>
  <div class="post-detail" :style="{ maxWidth: '760px', margin: '0 auto', position: 'relative' }">
    <!-- Reading progress -->
    <div :style="{ position: 'fixed', top: '64px', left: 0, right: 0, height: '3px', background: 'transparent', zIndex: 15 }">
      <div :style="{ height: '100%', width: progress + '%', background: 'var(--primary)', transition: 'width 120ms linear' }"/>
    </div>

    <button @click="emit('back')" class="btn ghost sm" :style="{ marginBottom: '20px' }">
      <IChevronLeft :size="14"/> Voltar ao newsroom
    </button>

    <div :style="{ marginBottom: '20px' }">
      <CategoryBadge :id="post.category" size="md"/>
    </div>

    <h1 :style="{
      fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)',
      fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 400,
      letterSpacing: '-0.025em', lineHeight: 1.08, margin: '0 0 16px',
    }">{{ post.title }}</h1>

    <p :style="{ fontSize: '19px', lineHeight: 1.5, color: 'var(--foreground-muted)', margin: '0 0 28px', fontWeight: 300 }">{{ post.excerpt }}</p>

    <div :style="{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '18px 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '32px',
    }">
      <Avatar :name="post.author.name" :size="42"/>
      <div :style="{ flex: 1, minWidth: 0 }">
        <div :style="{ fontSize: '14px', fontWeight: 600 }">{{ post.author.name }}</div>
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">{{ post.author.role }}</div>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }">
        <div :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)' }">{{ formatPostDate(post.published) }}</div>
        <div :style="{ fontSize: '11.5px', color: 'var(--foreground-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }">
          <IClock :size="11"/> {{ post.readMin }} min de leitura · <IEye :size="11"/> {{ post.views.toLocaleString('pt-PT') }}
        </div>
      </div>
    </div>

    <PostCover :post="post" :height="360" large/>

    <div class="post-detail-body" :style="{ padding: '40px 0' }">
      <template v-for="(block, i) in post.body" :key="i">
        <p v-if="block.type === 'p'"
          :style="{ fontSize: '17px', lineHeight: 1.7, color: 'var(--foreground)', margin: '0 0 22px' }"
          v-html="renderInline(block.text)"/>
        <h2 v-else-if="block.type === 'h2'"
          :style="{ fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', margin: '36px 0 16px', lineHeight: 1.2 }">
          {{ block.text }}
        </h2>
        <ul v-else-if="block.type === 'ul'"
          :style="{ fontSize: '16px', lineHeight: 1.7, color: 'var(--foreground)', margin: '0 0 22px', paddingLeft: '22px' }">
          <li v-for="(it, j) in block.items" :key="j" :style="{ marginBottom: '8px' }">{{ it }}</li>
        </ul>
        <blockquote v-else-if="block.type === 'quote'"
          :style="{
            margin: '32px 0', padding: '20px 24px',
            borderLeft: '3px solid var(--primary)',
            background: 'var(--primary-soft)',
            borderRadius: '0 12px 12px 0',
          }">
          <p :style="{ fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)', fontSize: '22px', fontStyle: 'italic', lineHeight: 1.4, color: 'var(--brand-emerald-800)', margin: 0 }">
            "{{ block.text }}"
          </p>
          <div v-if="block.author" :style="{ fontSize: '13px', color: 'var(--brand-emerald-700)', marginTop: '12px', fontWeight: 500 }">— {{ block.author }}</div>
        </blockquote>
      </template>

      <!-- Tags -->
      <div :style="{ display: 'flex', gap: '8px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }">
        <span v-for="t in post.tags" :key="t"
          :style="{ padding: '4px 10px', borderRadius: '999px', background: 'var(--surface-sunken)', fontSize: '11.5px', color: 'var(--foreground-muted)', fontWeight: 500 }">
          #{{ t }}
        </span>
      </div>

      <!-- Reactions -->
      <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '28px', padding: '20px 24px', background: 'var(--surface-sunken)', borderRadius: '14px' }">
        <button @click="toggleReaction"
          :style="{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', borderRadius: '10px',
            border: '1px solid ' + (reacted ? 'var(--brand-emerald-300)' : 'var(--border)'),
            background: reacted ? 'var(--primary-soft)' : 'var(--surface)',
            color: reacted ? 'var(--brand-emerald-700)' : 'var(--foreground)',
            cursor: 'pointer', font: 'inherit', fontSize: '13px', fontWeight: 500,
          }">
          <IThumbsUp :size="14"/> {{ reactions }} reações
        </button>
        <button :style="{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: '10px',
          border: '1px solid var(--border)', background: 'var(--surface)',
          cursor: 'pointer', font: 'inherit', fontSize: '13px', fontWeight: 500,
          color: 'var(--foreground)',
        }">
          <IMessageCircle :size="14"/> {{ post.comments }} comentários
        </button>
        <button :style="{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: '10px',
          border: '1px solid var(--border)', background: 'var(--surface)',
          cursor: 'pointer', font: 'inherit', fontSize: '13px', fontWeight: 500,
          color: 'var(--foreground)', marginLeft: 'auto',
        }">
          <IBookmark :size="14"/> Guardar
        </button>
      </div>

      <!-- Comments preview -->
      <div :style="{ marginTop: '36px' }">
        <div :style="{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }">Comentários ({{ post.comments }})</div>
        <div :style="{ display: 'flex', gap: '12px', padding: '16px', background: 'var(--surface-sunken)', borderRadius: '12px' }">
          <Avatar name="Tiago Almeida" :size="32"/>
          <div :style="{ flex: 1 }">
            <div :style="{ fontSize: '12.5px', fontWeight: 600 }">
              Tiago Almeida <span :style="{ color: 'var(--foreground-muted)', fontWeight: 400 }">· DT Belém · há 2h</span>
            </div>
            <div :style="{ fontSize: '13.5px', lineHeight: 1.5, color: 'var(--foreground)', marginTop: '6px' }">
              Excelente iniciativa! Já preparámos a montra e estamos prontos para arrancar. Os flyers chegaram esta manhã.
            </div>
          </div>
        </div>
        <div :style="{ display: 'flex', gap: '12px', marginTop: '16px' }">
          <Avatar name="Inês Carvalho" :size="32"/>
          <input class="input" placeholder="Adicionar comentário…" :style="{ flex: 1 }"/>
          <button class="btn primary sm">Publicar</button>
        </div>
      </div>
    </div>

    <!-- Related -->
    <div v-if="related.length > 0" :style="{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid var(--border)' }">
      <div :style="{ fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground-muted)', marginBottom: '18px' }">
        Continue a ler
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }">
        <PostCard v-for="p in related" :key="p.id" :post="p" @open="(post) => emit('open-post', post)"/>
      </div>
    </div>
  </div>
</template>
