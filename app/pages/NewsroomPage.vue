<script setup>
import { ref, computed } from 'vue';
const { usePortal, relativePostDate, isNewPost } = window;
import PostCover from '../components/PostCover.vue';
import CategoryBadge from '../components/CategoryBadge.vue';
import PostCard from '../components/PostCard.vue';

const data = window.PORTAL_DATA;
const { user, activePharmacy, pharmacies } = usePortal();

const filter = ref('all');
const search = ref('');
const emit = defineEmits(['open-post', 'continue']);

const published = computed(() => data.posts.filter(p => p.status === 'published'));
const featured = computed(() =>
  published.value.find(p => p.featured && p.pinned)
  || published.value.find(p => p.featured)
  || published.value[0]
);
const pinned = computed(() => published.value.filter(p => p.pinned && p.id !== featured.value?.id));
const others = computed(() => published.value.filter(p => p.id !== featured.value?.id && !pinned.value.includes(p)));

const visible = computed(() => {
  let v = [...pinned.value, ...others.value];
  if (filter.value !== 'all') v = v.filter(p => p.category === filter.value);
  if (search.value) {
    const q = search.value.toLowerCase();
    v = v.filter(p =>
      p.title.toLowerCase().includes(q)
      || p.excerpt.toLowerCase().includes(q)
      || p.tags.some(t => t.includes(q))
    );
  }
  return v;
});

const pharmacyName = computed(() =>
  activePharmacy.value === 'all'
    ? 'Vista de grupo · 12 farmácias'
    : (pharmacies.find(p => p.id === activePharmacy.value)?.name || '')
);

const greeting = computed(() => {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 19 ? 'Boa tarde' : 'Boa noite';
});
const today = computed(() =>
  new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
);

const top = computed(() =>
  [...data.posts].filter(p => p.status === 'published')
    .sort((a, b) => b.views - a.views).slice(0, 4)
);
const topPharmacy = data.pharmacies.find(p => p.id === 'pt-bv');

const quickIcon = (icon) => {
  const map = { book: 'IBook', users: 'IUsers', file: 'IFile', alert: 'IAlert' };
  return map[icon] || 'IFile';
};

const filterPillStyle = (cat) => ({
  padding: '7px 14px', borderRadius: '999px', font: 'inherit',
  fontSize: '12.5px', fontWeight: 500,
  border: '1px solid ' + (filter.value === cat.id ? cat.color : 'var(--border)'),
  background: filter.value === cat.id ? cat.color : 'transparent',
  color: filter.value === cat.id ? '#fff' : 'var(--foreground-muted)',
  cursor: 'pointer', transition: 'all 160ms',
});
</script>

<template>
  <div class="newsroom-page" :style="{ maxWidth: '1280px', margin: '0 auto' }">
    <!-- Greeting -->
    <div :style="{
      display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '36px',
      paddingBottom: '28px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap',
    }">
      <div :style="{ flex: 1, minWidth: '280px' }">
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }">{{ today }}</div>
        <h1 :style="{
          fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)',
          fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400, letterSpacing: '-0.02em',
          margin: '8px 0 6px', lineHeight: 1.05,
        }">
          {{ greeting }}, <em :style="{ color: 'var(--primary)', fontStyle: 'italic' }">{{ user.name.split(' ')[0] }}</em>
        </h1>
        <p :style="{ fontSize: '15px', color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.5, maxWidth: '580px' }">
          As novidades do grupo · {{ pharmacyName }}. Hoje destacamos a campanha
          <strong :style="{ color: 'var(--foreground)' }">Primavera Saudável</strong>
          e a nova regulamentação INFARMED para psicotrópicos.
        </p>
      </div>
      <button class="btn primary lg" @click="emit('continue')" :style="{ flex: 'none' }">
        Ir para o Painel <IArrowRight :size="15"/>
      </button>
    </div>

    <!-- Hero -->
    <article v-if="featured" @click="emit('open-post', featured)" :style="{
      display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0,
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
      transition: 'all 240ms var(--ease-out)',
    }" class="hero-post">
      <PostCover :post="featured" :height="360" large/>
      <div :style="{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', gap: '14px' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
          <span v-if="featured.pinned" :style="{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '10.5px', fontWeight: 600,
            color: 'var(--brand-emerald-700)', background: 'var(--primary-soft)',
            padding: '3px 8px', borderRadius: '999px',
          }"><IBookmark :size="11"/> FIXADO</span>
          <CategoryBadge :id="featured.category"/>
        </div>
        <h2 :style="{
          fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)',
          fontSize: '34px', fontWeight: 400, lineHeight: 1.15,
          letterSpacing: '-0.02em', margin: 0, color: 'var(--foreground)',
        }">{{ featured.title }}</h2>
        <p :style="{ fontSize: '14.5px', lineHeight: 1.55, color: 'var(--foreground-muted)', margin: 0 }">{{ featured.excerpt }}</p>
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '12px' }">
          <Avatar :name="featured.author.name" :size="32"/>
          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ fontSize: '12.5px', fontWeight: 600 }">{{ featured.author.name }}</div>
            <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)' }">{{ relativePostDate(featured.published) }} · {{ featured.readMin }} min de leitura</div>
          </div>
          <button class="btn primary sm" @click.stop="emit('open-post', featured)">
            Ler artigo <IArrowRight :size="13"/>
          </button>
        </div>
      </div>
    </article>

    <!-- Filters -->
    <div class="newsroom-filters">
      <div class="newsroom-filters-pills">
        <button v-for="c in data.postCategories" :key="c.id" @click="filter = c.id" :style="filterPillStyle(c)">{{ c.label }}</button>
      </div>
      <div class="ui-field newsroom-filters-search">
        <ISearch :size="14" :style="{ color: 'var(--foreground-muted)' }"/>
        <input v-model="search" placeholder="Procurar artigos…"
          :style="{ flex: 1, border: 0, outline: 0, background: 'transparent', font: 'inherit', fontSize: '16px' }"/>
      </div>
    </div>

    <!-- Feed + sidebar -->
    <div class="newsroom-layout" :style="{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'flex-start' }">
      <div>
        <Empty v-if="visible.length === 0" title="Sem artigos" desc="Tente outra categoria ou termo de pesquisa.">
          <template #icon><ISearch :size="20"/></template>
        </Empty>
        <div v-else class="post-feed"
          :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }">
          <PostCard v-for="p in visible" :key="p.id" :post="p" :is-new="isNewPost(p.published)"
            @open="(post) => emit('open-post', post)"/>
        </div>
      </div>

      <aside class="newsroom-side" :style="{ display: 'flex', flexDirection: 'column', gap: '18px' }">
        <Card :style="{ padding: '20px', background: 'linear-gradient(135deg, var(--primary-soft), var(--brand-emerald-50))', border: '1px solid var(--brand-emerald-200)' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--brand-emerald-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }">
            <ISparkle :size="13"/> Destaque do mês
          </div>
          <div :style="{
            fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)',
            fontSize: '22px', fontWeight: 400, marginTop: '8px',
            color: 'var(--brand-emerald-800)', letterSpacing: '-0.01em',
          }">{{ topPharmacy?.name }}</div>
          <div :style="{ fontSize: '12.5px', color: 'var(--brand-emerald-700)', marginTop: '4px' }">
            +{{ topPharmacy?.growth }}% · NPS 78 · {{ topPharmacy?.city }}
          </div>
          <div :style="{ display: 'flex', gap: '6px', marginTop: '12px' }">
            <Tag severity="success">▲ Crescimento</Tag>
            <Tag severity="info">★ NPS top</Tag>
          </div>
        </Card>

        <Card :style="{ padding: '20px' }">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }">
            <div :style="{ fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)' }">Mais lidos</div>
            <ITrending :size="14" :style="{ color: 'var(--foreground-subtle)' }"/>
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
            <div v-for="(p, i) in top" :key="p.id" @click="emit('open-post', p)" class="row-hover"
              :style="{ display: 'flex', gap: '12px', padding: '6px', borderRadius: '8px', cursor: 'pointer', margin: '-6px' }">
              <div :style="{
                fontSize: '22px', fontWeight: 700, color: 'var(--foreground-subtle)',
                fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)',
                minWidth: '24px', lineHeight: 1,
              }">{{ i + 1 }}</div>
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '12.5px', fontWeight: 600, lineHeight: 1.35, marginBottom: '4px' }">{{ p.title }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: '6px' }">
                  <IEye :size="11"/> {{ p.views.toLocaleString('pt-PT') }} · {{ relativePostDate(p.published) }}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card :style="{ padding: '20px' }">
          <div :style="{ fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)', marginBottom: '14px' }">Próximos eventos</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div v-for="ev in data.events" :key="ev.id"
              :style="{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }">
              <div :style="{ width: '44px', padding: '6px', background: 'var(--surface-sunken)', borderRadius: '8px', textAlign: 'center', flex: 'none' }">
                <div :style="{ fontSize: '9px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase' }">{{ ev.date.split(' ')[1] }}</div>
                <div :style="{ fontSize: '16px', fontWeight: 700, lineHeight: 1, marginTop: '2px' }">{{ ev.date.split(' ')[0] }}</div>
              </div>
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '12.5px', fontWeight: 500, lineHeight: 1.3 }">{{ ev.title }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '2px' }">{{ ev.time }}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card :style="{ padding: '20px' }">
          <div :style="{ fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)', marginBottom: '14px' }">Acessos rápidos</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '4px' }">
            <button v-for="ql in data.quickLinks" :key="ql.id" class="row-hover"
              :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }">
              <component :is="quickIcon(ql.icon)" :size="14" :style="{ color: 'var(--foreground-muted)' }"/>
              <span :style="{ fontSize: '13px' }">{{ ql.label }}</span>
              <IArrowRight :size="12" :style="{ marginLeft: 'auto', color: 'var(--foreground-subtle)' }"/>
            </button>
          </div>
        </Card>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.newsroom-filters {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 0 20px;
  flex-wrap: wrap;
}
.newsroom-filters-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}
.newsroom-filters-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  min-width: 240px;
}

@media (max-width: 768px) {
  .newsroom-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  /* search renders ABOVE the pills on mobile */
  .newsroom-filters-search {
    order: -1;
    min-width: 0;
    width: 100%;
  }
  /* pills inline com scroll horizontal em vez de wrap */
  .newsroom-filters-pills {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 2px;
    /* margem negativa para o scroll ir ate a borda do conteudo */
    margin: 0 -4px;
    padding-left: 4px;
    padding-right: 4px;
  }
  .newsroom-filters-pills::-webkit-scrollbar { display: none; }
  .newsroom-filters-pills > button { flex: 0 0 auto; }
}
</style>
