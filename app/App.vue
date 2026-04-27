<script setup>
// App.vue — Shell principal do portal Nossa Farmacia.
//
// Substitui a versao "spike" anterior. Espelha 1:1 o App() React do antigo
// index.html: provide do contexto do portal, gestao de pagina/sidebar/palette/
// notifs, listener Cmd+K, deteccao mobile, theme/density via data-attrs no
// documentElement, e TweaksPanel para integracao com o IDE host.

import { ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
const { providePortal } = window;
import Sidebar from './components/Sidebar.vue';
import Topbar from './components/Topbar.vue';
import CommandPalette from './components/CommandPalette.vue';
import NotificationsPanel from './components/NotificationsPanel.vue';
import PageStub from './components/PageStub.vue';
import LoginScreen from './pages/LoginScreen.vue';

const PAGE_TITLES = window.PAGE_TITLES || {};
const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS || {
  sidebarCollapsed: false, density: 'compact', theme: 'light',
  showAlerts: true, accentHue: 231,
};

// ---- Portal context (provide/inject) ---------------------------------------
providePortal();

// ---- Tweaks ----------------------------------------------------------------
const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

// ---- Estado do shell -------------------------------------------------------
const authed = ref(false);
const page = ref('welcome');
const openPost = ref(null);
const collapsed = ref(!!tweaks.sidebarCollapsed);
const mobileSidebarOpen = ref(false);
const paletteOpen = ref(false);
const notifsOpen = ref(false);
const isMobile = ref(false);

// PrimeVue ToastService — registado em main.js como app plugin.
// Acedido via globalProperties.$toast (PrimeVue UMD nao expoe useToast directo).
const $toast = getCurrentInstance()?.appContext.config.globalProperties.$toast;

// window.__sfc (exposto por main.js) carrega um SFC em runtime via
// vue3-sfc-loader e devolve um async component pronto. Usamos lazy-loading
// para que cada pagina seja fetched so quando o utilizador navegar para ela.
const sfc = window.__sfc || (() => null);
const PAGES = {
  welcome:          sfc('./app/pages/NewsroomPage.vue'),
  'post-detail':    sfc('./app/pages/PostDetail.vue'),
  'newsroom-admin': sfc('./app/pages/PostsAdminPage.vue'),
  dashboard:        sfc('./app/pages/DashboardPage.vue'),
  stock:            sfc('./app/pages/StockPage.vue'),
  finance:          sfc('./app/pages/FinancePage.vue'),
  marketing:        sfc('./app/pages/MarketingPage.vue'),
  digital:          sfc('./app/pages/DigitalPage.vue'),
  crm:              sfc('./app/pages/CRMPage.vue'),
  pharma:           sfc('./app/pages/PharmaPage.vue'),
  hr:               sfc('./app/pages/HRPage.vue'),
  units:            sfc('./app/pages/UnitsPage.vue'),
  compliance:       sfc('./app/pages/CompliancePage.vue'),
  reports:          sfc('./app/pages/ReportsPage.vue'),
  settings:         sfc('./app/pages/SettingsPage.vue'),
};

const currentPage = computed(() => PAGES[page.value] || null);

// ---- Listeners -------------------------------------------------------------
const checkViewport = () => { isMobile.value = window.innerWidth <= 768; };

const onKey = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    paletteOpen.value = !paletteOpen.value;
  }
  if (e.key === 'Escape') {
    paletteOpen.value = false;
    notifsOpen.value = false;
  }
};

onMounted(() => {
  checkViewport();
  window.addEventListener('resize', checkViewport);
  window.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkViewport);
  window.removeEventListener('keydown', onKey);
});

// Theme / density aplicados ao <html>.
watch(() => tweaks.theme,   (v) => { document.documentElement.dataset.theme = v; },   { immediate: true });
watch(() => tweaks.density, (v) => { document.documentElement.dataset.density = v; }, { immediate: true });

// ---- Handlers --------------------------------------------------------------
const onLogin = (_pharmacyId) => {
  authed.value = true;
  page.value = 'welcome';
  $toast?.add({
    severity: 'success',
    summary: 'Bem-vinda, Inês',
    detail: 'Sessão iniciada · vista consolidada do grupo',
    life: 3500,
  });
};

const handleOpenPost = (p) => { openPost.value = p; page.value = 'post-detail'; window.scrollTo(0, 0); };
const handleBackToNewsroom = () => { page.value = 'welcome'; openPost.value = null; window.scrollTo(0, 0); };

const onToggleSidebar = () => {
  if (isMobile.value) mobileSidebarOpen.value = !mobileSidebarOpen.value;
  else collapsed.value = !collapsed.value;
};

const sidebarCollapsedBound = computed(() => isMobile.value ? false : collapsed.value);

const accentHue = computed(() => tweaks.accentHue);
watch(accentHue, (v) => { document.documentElement.style.setProperty('--brand-hue', String(v)); }, { immediate: true });

const logout = () => { authed.value = false; page.value = 'dashboard'; };
</script>

<template>
  <LoginScreen v-if="!authed" @login="onLogin"/>

  <div v-else :style="{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }">
    <Sidebar
      :active="page"
      :collapsed="sidebarCollapsedBound"
      :mobile-open="mobileSidebarOpen"
      @navigate="(id) => { page = id; }"
      @mobile-close="mobileSidebarOpen = false"/>

    <main :style="{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }">
      <Topbar
        :title="PAGE_TITLES[page]"
        :breadcrumbs="['Portal', PAGE_TITLES[page]]"
        @open-search="paletteOpen = true"
        @open-notifs="notifsOpen = !notifsOpen"
        @toggle-sidebar="onToggleSidebar"/>
      <div class="page-pad" :style="{ padding: '28px', maxWidth: '1480px', width: '100%', margin: '0 auto' }">
        <component
          v-if="page === 'welcome' && currentPage"
          :is="currentPage"
          @open-post="handleOpenPost"
          @continue="page = 'dashboard'"/>
        <component
          v-else-if="page === 'post-detail' && currentPage && openPost"
          :is="currentPage"
          :post="openPost"
          @back="handleBackToNewsroom"
          @open-post="handleOpenPost"/>
        <component v-else-if="currentPage" :is="currentPage"/>
        <PageStub v-else :id="page"/>
      </div>
    </main>

    <CommandPalette
      :open="paletteOpen"
      @close="paletteOpen = false"
      @navigate="(id) => { page = id; }"/>

    <NotificationsPanel :open="notifsOpen" @close="notifsOpen = false"/>

    <Toast position="bottom-right"/>

    <TweaksPanel title="Tweaks · Portal">
      <TweakSection label="Aparência">
        <TweakRadio label="Tema" :value="tweaks.theme"
          :options="[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]"
          @change="(v) => setTweak('theme', v)"/>
        <TweakRadio label="Densidade" :value="tweaks.density"
          :options="[
            { value: 'compact',     label: 'Compacta' },
            { value: 'comfortable', label: 'Confortável' },
            { value: 'spacious',    label: 'Ampla' },
          ]"
          @change="(v) => setTweak('density', v)"/>
        <TweakSlider label="Matiz da marca" :value="tweaks.accentHue"
          :min="120" :max="260" :step="1"
          @change="(v) => setTweak('accentHue', v)"/>
      </TweakSection>
      <TweakSection label="Layout">
        <TweakToggle label="Menu lateral colapsado" :value="collapsed"
          @change="(v) => { collapsed = v; setTweak('sidebarCollapsed', v); }"/>
        <TweakToggle label="Mostrar alertas no painel" :value="tweaks.showAlerts"
          @change="(v) => setTweak('showAlerts', v)"/>
      </TweakSection>
      <TweakSection label="Sessão">
        <TweakButton label="Terminar sessão" @click="logout"/>
      </TweakSection>
    </TweaksPanel>
  </div>
</template>
