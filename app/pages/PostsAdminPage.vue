<script setup>
import { ref, computed, watch } from 'vue';
const { usePortal, getCategoryMeta, formatPostDate } = window;
import PostCover from '../components/PostCover.vue';
import PostCard from '../components/PostCard.vue';
import CategoryBadge from '../components/CategoryBadge.vue';

const data = window.PORTAL_DATA;
const { activePharmacy, pharmacies } = usePortal();

const COVER_ICONS = {
  megaphone: 'IMegaphone', shield: 'IShield', graduation: 'IGraduation',
  sparkle: 'ISparkle', calendar: 'ICalendar', globe: 'IGlobe', heart: 'IHeart',
  box: 'IBox', chart: 'IChart', alert: 'IAlert', edit: 'IEdit',
  sun: 'ISun', pill: 'IPill', book: 'IBook',
};

const STATUS_META = {
  published: { label: 'Publicado', color: 'success' },
  draft:     { label: 'Rascunho',  color: 'neutral' },
  scheduled: { label: 'Agendado',  color: 'info'    },
  archived:  { label: 'Arquivado', color: 'neutral' },
};

const posts = ref([...data.posts]);
const editing = ref(null); // null | 'new' | post-object
const tab = ref('all');
const search = ref('');

const isGroupView = computed(() => activePharmacy.value === 'all');
const activePharmacyName = computed(() => isGroupView.value
  ? 'Todas as farmácias'
  : pharmacies.find(p => p.id === activePharmacy.value)?.name || '—'
);

const counts = computed(() => ({
  all:       posts.value.length,
  published: posts.value.filter(p => p.status === 'published').length,
  draft:     posts.value.filter(p => p.status === 'draft').length,
  scheduled: posts.value.filter(p => p.status === 'scheduled').length,
  archived:  posts.value.filter(p => p.status === 'archived').length,
}));

const filtered = computed(() => {
  let f = posts.value;
  if (tab.value !== 'all') f = f.filter(p => p.status === tab.value);
  if (search.value) {
    const q = search.value.toLowerCase();
    f = f.filter(p => p.title.toLowerCase().includes(q));
  }
  return f;
});

const tabList = [
  { id: 'all',       label: 'Todos' },
  { id: 'published', label: 'Publicados' },
  { id: 'scheduled', label: 'Agendados' },
  { id: 'draft',     label: 'Rascunhos' },
  { id: 'archived',  label: 'Arquivados' },
];

const totalViews = computed(() =>
  posts.value.filter(p => p.status === 'published').reduce((s, p) => s + p.views, 0).toLocaleString('pt-PT')
);
const totalEngagement = computed(() =>
  posts.value.reduce((s, p) => s + p.reactions + p.comments, 0)
);

const onAction = (action, post) => {
  if (action === 'edit') editing.value = post;
  if (action === 'duplicate') {
    posts.value = [{
      ...post,
      id: 'p-' + Math.random().toString(36).slice(2, 7),
      title: post.title + ' (cópia)',
      status: 'draft', published: null,
      views: 0, reactions: 0, comments: 0,
    }, ...posts.value];
  }
  if (action === 'archive') {
    posts.value = posts.value.map(p => p.id === post.id ? { ...p, status: 'archived' } : p);
  }
  if (action === 'delete') {
    posts.value = posts.value.filter(p => p.id !== post.id);
  }
};

const onSave = (saved) => {
  const exists = posts.value.find(p => p.id === saved.id);
  posts.value = exists
    ? posts.value.map(p => p.id === saved.id ? saved : p)
    : [saved, ...posts.value];
  editing.value = null;
};

const tabBtnStyle = (id) => ({
  padding: '7px 12px', borderRadius: '8px', border: 0, font: 'inherit', fontSize: '13px',
  fontWeight: tab.value === id ? 600 : 500, cursor: 'pointer',
  background: tab.value === id ? 'var(--surface-sunken)' : 'transparent',
  color: tab.value === id ? 'var(--foreground)' : 'var(--foreground-muted)',
});

// ---- Editor state -------------------------------------------------------
const editingPost = computed(() => editing.value === 'new' ? null : editing.value);
const isNewEdit = computed(() => editing.value === 'new');

const title = ref('');
const excerpt = ref('');
const category = ref('news');
const tags = ref('');
const body = ref('');
const pinned = ref(false);
const allowComments = ref(true);
const allowReactions = ref(true);
const visibility = ref('all');
const schedule = ref('now');
const scheduleDate = ref('');
const previewMode = ref('card');
const coverIcon = ref('megaphone');
const coverGradient = ref('linear-gradient(135deg, oklch(0.65 0.15 163) 0%, oklch(0.78 0.15 145) 100%)');

const initEditor = () => {
  const p = editingPost.value;
  title.value = p?.title || '';
  excerpt.value = p?.excerpt || '';
  category.value = p?.category || 'news';
  tags.value = (p?.tags || []).join(', ');
  body.value = p?.body?.find(b => b.type === 'p')?.text || 'Comece a escrever aqui o conteúdo principal do post…';
  pinned.value = p?.pinned || false;
  visibility.value = p?.visibility || 'all';
  coverIcon.value = p?.coverIcon || 'megaphone';
  coverGradient.value = p?.coverGradient || 'linear-gradient(135deg, oklch(0.65 0.15 163) 0%, oklch(0.78 0.15 145) 100%)';
  schedule.value = 'now';
  scheduleDate.value = '';
};

// Inicia o editor sempre que o modo muda (de listagem para edicao).
watch(editing, (v) => { if (v) initEditor(); });

const wordCount = computed(() => body.value.split(' ').filter(Boolean).length);
const readMin = computed(() => Math.max(1, Math.round(body.value.split(' ').length / 200)));

const save = (status) => {
  const saved = {
    id: editingPost.value?.id || 'p-' + Math.random().toString(36).slice(2, 7),
    title: title.value || 'Sem título',
    excerpt: excerpt.value || 'Sem descrição',
    category: category.value,
    coverIcon: coverIcon.value,
    coverGradient: coverGradient.value,
    tags: tags.value.split(',').map(t => t.trim()).filter(Boolean),
    author: editingPost.value?.author || { name: 'Inês Carvalho', initials: 'IC', role: 'Direção do Grupo' },
    published: status === 'published'
      ? new Date().toISOString()
      : status === 'scheduled' ? scheduleDate.value : null,
    readMin: readMin.value,
    pinned: pinned.value,
    featured: false,
    views: editingPost.value?.views || 0,
    reactions: editingPost.value?.reactions || 0,
    comments: editingPost.value?.comments || 0,
    visibility: visibility.value,
    status,
    body: [{ type: 'p', text: body.value }],
  };
  onSave(saved);
};

const previewPost = computed(() => ({
  title: title.value || 'Título do post',
  excerpt: excerpt.value || 'Excerpt do post — uma frase curta a descrever o conteúdo.',
  category: category.value,
  coverIcon: coverIcon.value,
  coverGradient: coverGradient.value,
  tags: tags.value.split(',').map(t => t.trim()).filter(Boolean),
  author: { name: 'Inês Carvalho', initials: 'IC', role: 'Direção do Grupo' },
  published: new Date().toISOString(),
  readMin: readMin.value,
  pinned: pinned.value, views: 0, reactions: 0, comments: 0, status: 'published',
  body: [{ type: 'p', text: body.value }],
}));

const renderInline = (text) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const coverIconKeys = Object.keys(COVER_ICONS);
const coverIconNameForKey = (k) => COVER_ICONS[k];

const statusToneFor = (s) => s.color === 'success' ? 'success' : s.color === 'info' ? 'info' : 'neutral';
</script>

<template>
  <!-- ============================================================
       Listagem
       ============================================================ -->
  <div v-if="!editing" :style="{ display: 'flex', flexDirection: 'column', gap: '22px' }">
    <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }">
      <div>
        <div :style="{ fontSize: '11.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground-muted)' }">Marketing · Newsroom</div>
        <h1 :style="{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0 4px' }">Posts internos</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '13.5px', margin: 0 }">
          Gerir comunicados, campanhas e conteúdos editoriais para a rede de farmácias.
        </p>
      </div>
      <div :style="{ display: 'flex', gap: '10px', alignItems: 'center' }">
        <div v-if="!isGroupView"
          :title="'Mude para Todas as farmácias para criar posts'"
          :style="{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', background: 'var(--surface-sunken)',
            border: '1px dashed var(--border-strong)', borderRadius: '10px',
            color: 'var(--foreground-muted)', fontSize: '12px',
          }">
          <IInfo :size="14"/> Vista de farmácia individual ·&nbsp;<strong :style="{ color: 'var(--foreground)' }">{{ activePharmacyName }}</strong>
        </div>
        <button v-if="isGroupView" class="btn primary" @click="editing = 'new'">
          <IPlus :size="14"/> Novo Post
        </button>
        <button v-else class="btn primary" disabled :style="{ opacity: 0.5, cursor: 'not-allowed' }">
          <ILock :size="14"/> Novo Post
        </button>
      </div>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }">
      <Card :style="{ padding: '16px' }">
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)' }">Posts publicados</div>
          <div :style="{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-sunken)', display: 'grid', placeItems: 'center', color: 'var(--foreground-muted)' }"><IMegaphone :size="16"/></div>
        </div>
        <div :style="{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }">{{ counts.published }}</div>
        <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">ativos no portal</div>
      </Card>
      <Card :style="{ padding: '16px' }">
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)' }">Visualizações totais</div>
          <div :style="{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-sunken)', display: 'grid', placeItems: 'center', color: 'var(--foreground-muted)' }"><IEye :size="16"/></div>
        </div>
        <div :style="{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }">{{ totalViews }}</div>
        <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">últimos 30 dias</div>
      </Card>
      <Card :style="{ padding: '16px' }">
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)' }">Reações + comentários</div>
          <div :style="{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-sunken)', display: 'grid', placeItems: 'center', color: 'var(--foreground-muted)' }"><IHeart :size="16"/></div>
        </div>
        <div :style="{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }">{{ totalEngagement }}</div>
        <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">engagement total</div>
      </Card>
      <Card :style="{ padding: '16px' }">
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)' }">Em rascunho</div>
          <div :style="{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-sunken)', display: 'grid', placeItems: 'center', color: 'var(--foreground-muted)' }"><IEdit :size="16"/></div>
        </div>
        <div :style="{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }">{{ counts.draft }}</div>
        <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">por publicar</div>
      </Card>
    </div>

    <Card :style="{ padding: 0, overflow: 'hidden' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }">
        <div :style="{ display: 'flex', gap: '4px' }">
          <button v-for="t in tabList" :key="t.id" @click="tab = t.id" :style="tabBtnStyle(t.id)">
            {{ t.label }} <span :style="{ fontSize: '11px', color: 'var(--foreground-subtle)', marginLeft: '4px' }">{{ counts[t.id] }}</span>
          </button>
        </div>
        <div class="ui-field" :style="{
          display: 'flex', alignItems: 'center', gap: '8px', height: '36px',
          padding: '0 12px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '8px', marginLeft: 'auto', minWidth: '240px',
        }">
          <ISearch :size="14" :style="{ color: 'var(--foreground-muted)' }"/>
          <input v-model="search" placeholder="Procurar posts…"
            :style="{ flex: 1, border: 0, outline: 0, background: 'transparent', font: 'inherit', fontSize: '13px' }"/>
        </div>
      </div>

      <div class="table-scroll" :style="{ overflowX: 'auto' }">
        <table class="data-table" :style="{ width: '100%', minWidth: '880px', borderCollapse: 'collapse' }">
          <thead>
            <tr>
              <th :style="{ textAlign: 'left', padding: '12px 18px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Post</th>
              <th :style="{ textAlign: 'left', padding: '12px 12px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Categoria</th>
              <th :style="{ textAlign: 'left', padding: '12px 12px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Estado</th>
              <th :style="{ textAlign: 'left', padding: '12px 12px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Autor</th>
              <th :style="{ textAlign: 'right', padding: '12px 12px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Vistas</th>
              <th :style="{ textAlign: 'right', padding: '12px 12px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Engagement</th>
              <th :style="{ textAlign: 'left', padding: '12px 12px', fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }">Data</th>
              <th :style="{ width: '50px' }"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id" class="row-hover"
              @click="isGroupView && (editing = p)"
              :style="{ borderTop: '1px solid var(--border-subtle)', cursor: isGroupView ? 'pointer' : 'default' }">
              <td :style="{ padding: '14px 18px' }">
                <div :style="{ display: 'flex', gap: '10px', alignItems: 'center' }">
                  <div :style="{ width: '40px', height: '40px', borderRadius: '8px', background: p.coverGradient, flex: 'none', display: 'grid', placeItems: 'center' }">
                    <component :is="COVER_ICONS[p.coverIcon] || 'IMegaphone'" :size="18" :style="{ color: '#fff' }"/>
                  </div>
                  <div :style="{ minWidth: 0 }">
                    <div :style="{ fontSize: '13.5px', fontWeight: 600, lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: '6px' }">
                      <IBookmark v-if="p.pinned" :size="12" :style="{ color: 'var(--primary)' }"/>
                      {{ p.title }}
                    </div>
                    <div :style="{
                      fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '2px',
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }">{{ p.excerpt }}</div>
                  </div>
                </div>
              </td>
              <td :style="{ padding: '14px 12px' }"><CategoryBadge :id="p.category"/></td>
              <td :style="{ padding: '14px 12px' }">
                <Tag :severity="statusToneFor(STATUS_META[p.status])">{{ STATUS_META[p.status].label }}</Tag>
              </td>
              <td :style="{ padding: '14px 12px', fontSize: '12.5px' }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
                  <Avatar :name="p.author.name" :size="22"/>
                  <span :style="{ color: 'var(--foreground-muted)' }">{{ p.author.name }}</span>
                </div>
              </td>
              <td :style="{ padding: '14px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '13px' }">{{ p.views.toLocaleString('pt-PT') }}</td>
              <td :style="{ padding: '14px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '13px' }">
                <span :style="{ color: 'var(--foreground-muted)' }">
                  <IHeart :size="11"/> {{ p.reactions }} · <IMessageCircle :size="11"/> {{ p.comments }}
                </span>
              </td>
              <td :style="{ padding: '14px 12px', fontSize: '12.5px', color: 'var(--foreground-muted)' }">{{ p.published ? formatPostDate(p.published) : '—' }}</td>
              <td :style="{ padding: '14px 8px', textAlign: 'right' }">
                <button class="icon-btn" @click.stop="onAction('edit', p)" :disabled="!isGroupView" :title="'Editar'">
                  <IEdit :size="14"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>

  <!-- ============================================================
       Editor
       ============================================================ -->
  <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: '18px' }">
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
        <button class="btn ghost sm" @click="editing = null"><IChevronLeft :size="14"/> Voltar</button>
        <div>
          <div :style="{ fontSize: '11.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground-muted)' }">{{ isNewEdit ? 'Novo post' : 'A editar post' }}</div>
          <div :style="{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }">{{ title || 'Sem título' }}</div>
        </div>
      </div>
      <div :style="{ display: 'flex', gap: '8px' }">
        <button class="btn ghost sm" @click="save('draft')"><ISave :size="13"/> Guardar rascunho</button>
        <button v-if="schedule === 'later'" class="btn primary sm" @click="save('scheduled')"><IClock :size="13"/> Agendar</button>
        <button v-else class="btn primary sm" @click="save('published')"><IMegaphone :size="13"/> Publicar</button>
      </div>
    </div>

    <div class="post-editor-grid"
      :style="{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: '20px', alignItems: 'flex-start' }">
      <!-- LEFT: Form -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
        <Card :style="{ padding: '24px' }">
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }">
            <label :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)' }">Título</label>
            <input v-model="title" class="input" placeholder="Título do post…" :style="{ fontSize: '18px', fontWeight: 600 }"/>
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }">
            <label :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)' }">Subtítulo / Excerpt</label>
            <textarea v-model="excerpt" class="input" placeholder="Uma frase curta a descrever o conteúdo…" rows="2" :style="{ resize: 'vertical' }"/>
          </div>
        </Card>

        <Card :style="{ padding: '24px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)', marginBottom: '10px' }">Conteúdo</div>
          <div :style="{ display: 'flex', gap: '4px', padding: '6px', background: 'var(--surface-sunken)', borderRadius: '8px', marginBottom: '10px', flexWrap: 'wrap' }">
            <button class="icon-btn" :title="'Negrito'"><IBold :size="14"/></button>
            <button class="icon-btn" :title="'Itálico'"><IItalic :size="14"/></button>
            <span :style="{ width: '1px', background: 'var(--border)' }"/>
            <button class="icon-btn" :title="'Lista'"><IList :size="14"/></button>
            <button class="icon-btn" :title="'Citação'"><IQuote :size="14"/></button>
            <span :style="{ width: '1px', background: 'var(--border)' }"/>
            <button class="icon-btn" :title="'Link'"><ILink :size="14"/></button>
            <button class="icon-btn" :title="'Imagem'"><IImage :size="14"/></button>
          </div>
          <textarea v-model="body" class="input" rows="12"
            :style="{ fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)', fontSize: '15px', lineHeight: 1.6, resize: 'vertical' }"/>
          <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '6px' }">
            <span>{{ wordCount }} palavras · ~{{ readMin }} min</span>
            <span>Suporte para Markdown leve · **negrito**, listas, citações</span>
          </div>
        </Card>

        <Card :style="{ padding: '24px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)', marginBottom: '14px' }">Imagem de capa</div>
          <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }">
            <button v-for="key in coverIconKeys" :key="key" @click="coverIcon = key"
              :style="{
                aspectRatio: '1', display: 'grid', placeItems: 'center',
                background: coverGradient, borderRadius: '10px',
                border: '2px solid ' + (coverIcon === key ? 'var(--primary)' : 'transparent'),
                cursor: 'pointer',
              }">
              <component :is="coverIconNameForKey(key)" :size="20" :style="{ color: '#fff' }"/>
            </button>
          </div>
          <button class="btn ghost sm" :style="{ marginTop: '14px' }"><IUpload :size="13"/> Carregar imagem personalizada</button>
        </Card>
      </div>

      <!-- RIGHT: Settings + Preview -->
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '84px' }">
        <Card :style="{ padding: '20px' }">
          <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)', marginBottom: '14px' }">Configuração</div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }">
            <label :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)' }">Categoria</label>
            <select v-model="category" class="input">
              <option v-for="c in data.postCategories.filter(x => x.id !== 'all')" :key="c.id" :value="c.id">{{ c.label }}</option>
            </select>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }">
            <label :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)' }">Tags (separadas por vírgula)</label>
            <input v-model="tags" class="input" placeholder="campanha, primavera, marketing"/>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }">
            <label :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)' }">Visibilidade</label>
            <select v-model="visibility" class="input">
              <option value="all">Todas as farmácias</option>
              <option value="lisboa">Apenas região · Lisboa</option>
              <option value="porto">Apenas região · Porto</option>
              <option value="custom">Selecionar farmácias…</option>
            </select>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }">
            <label :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', cursor: 'pointer' }">
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '13px', fontWeight: 500 }">Fixar no topo</div>
                <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '1px' }">Aparece sempre no início do feed</div>
              </div>
              <button type="button" @click="pinned = !pinned"
                :style="{
                  width: '36px', height: '20px', borderRadius: '999px', border: 0, cursor: 'pointer',
                  background: pinned ? 'var(--primary)' : 'var(--border-strong)',
                  position: 'relative', transition: 'background 160ms', flex: 'none',
                }">
                <span :style="{ position: 'absolute', top: '2px', left: pinned ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '999px', background: '#fff', transition: 'left 160ms' }"/>
              </button>
            </label>
            <label :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', cursor: 'pointer' }">
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '13px', fontWeight: 500 }">Permitir comentários</div>
              </div>
              <button type="button" @click="allowComments = !allowComments"
                :style="{
                  width: '36px', height: '20px', borderRadius: '999px', border: 0, cursor: 'pointer',
                  background: allowComments ? 'var(--primary)' : 'var(--border-strong)',
                  position: 'relative', transition: 'background 160ms', flex: 'none',
                }">
                <span :style="{ position: 'absolute', top: '2px', left: allowComments ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '999px', background: '#fff', transition: 'left 160ms' }"/>
              </button>
            </label>
            <label :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', cursor: 'pointer' }">
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '13px', fontWeight: 500 }">Permitir reações</div>
              </div>
              <button type="button" @click="allowReactions = !allowReactions"
                :style="{
                  width: '36px', height: '20px', borderRadius: '999px', border: 0, cursor: 'pointer',
                  background: allowReactions ? 'var(--primary)' : 'var(--border-strong)',
                  position: 'relative', transition: 'background 160ms', flex: 'none',
                }">
                <span :style="{ position: 'absolute', top: '2px', left: allowReactions ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '999px', background: '#fff', transition: 'left 160ms' }"/>
              </button>
            </label>
          </div>

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }">
            <label :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)' }">Publicação</label>
            <div :style="{ display: 'flex', gap: '6px' }">
              <button @click="schedule = 'now'" :class="schedule === 'now' ? 'btn primary sm' : 'btn ghost sm'" :style="{ flex: 1 }">Agora</button>
              <button @click="schedule = 'later'" :class="schedule === 'later' ? 'btn primary sm' : 'btn ghost sm'" :style="{ flex: 1 }">Agendar</button>
            </div>
            <input v-if="schedule === 'later'" v-model="scheduleDate" type="datetime-local" class="input" :style="{ marginTop: '8px' }"/>
          </div>
        </Card>

        <Card :style="{ padding: 0, overflow: 'hidden' }">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }">
            <div :style="{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground-muted)' }">Pré-visualização</div>
            <div :style="{ display: 'flex', gap: '4px' }">
              <button @click="previewMode = 'card'"   :class="previewMode === 'card'   ? 'btn primary sm' : 'btn ghost sm'" :style="{ padding: '4px 10px', fontSize: '11px' }">Cartão</button>
              <button @click="previewMode = 'detail'" :class="previewMode === 'detail' ? 'btn primary sm' : 'btn ghost sm'" :style="{ padding: '4px 10px', fontSize: '11px' }">Artigo</button>
            </div>
          </div>
          <div :style="{ padding: '16px', background: 'var(--background)' }">
            <div v-if="previewMode === 'card'" :style="{ pointerEvents: 'none' }">
              <PostCard :post="previewPost" @open="() => {}"/>
            </div>
            <div v-else
              :style="{ background: 'var(--surface)', borderRadius: '10px', padding: '18px', border: '1px solid var(--border)', maxHeight: '480px', overflow: 'auto' }">
              <CategoryBadge :id="previewPost.category"/>
              <h2 :style="{ fontFamily: 'var(--font-serif, \'Instrument Serif\', Georgia, serif)', fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', margin: '8px 0', lineHeight: 1.15 }">{{ previewPost.title }}</h2>
              <p :style="{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 12px', lineHeight: 1.5 }">{{ previewPost.excerpt }}</p>
              <PostCover :post="previewPost" :height="140"/>
              <p :style="{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--foreground)', marginTop: '14px', whiteSpace: 'pre-wrap' }" v-html="renderInline(body)"/>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
