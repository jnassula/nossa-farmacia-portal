// composables/usePortal.js — Estado partilhado do portal (provide/inject).
// Substitui o React Context (PortalCtx) do antigo index.html. Carregado como
// script regular (IIFE) porque vue3-sfc-loader 0.9.5 nao parseia .js com
// import/export como ES module — anexamos providePortal e usePortal a window.
//
// Uso em SFCs:
//   <script setup>
//   const { providePortal, usePortal } = window;
//   const { activePharmacy, setActivePharmacy, pharmacies, ... } = usePortal();
//   </script>

(function () {
  const Vue = window.Vue;
  if (!Vue) { console.error('[usePortal] Vue ainda nao carregado.'); return; }
  const { ref, computed, inject, provide } = Vue;

  const KEY = Symbol('portal');

  function providePortal() {
    const data = window.PORTAL_DATA || { pharmacies: [], notifications: [] };

    const activePharmacy = ref('all');
    const notifications = ref([...(data.notifications || [])]);
    const user = {
      name: 'Inês Carvalho',
      role: 'Gestora · Grupo',
      email: 'ines.carvalho@nossafarmacia.pt',
    };

    const unreadCount = computed(() => notifications.value.filter(n => n.unread).length);
    const setActivePharmacy = (id) => { activePharmacy.value = id; };
    const markAllRead = () => {
      notifications.value = notifications.value.map(n => ({ ...n, unread: false }));
    };

    const ctx = {
      pharmacies: data.pharmacies || [],
      activePharmacy,
      setActivePharmacy,
      notifications,
      unreadCount,
      markAllRead,
      user,
    };

    provide(KEY, ctx);
    return ctx;
  }

  function usePortal() {
    const ctx = inject(KEY, null);
    if (!ctx) {
      // Fallback minimo: permite componentes em isolamento sem rebentar.
      const data = window.PORTAL_DATA || { pharmacies: [], notifications: [] };
      return {
        pharmacies: data.pharmacies || [],
        activePharmacy: ref('all'),
        setActivePharmacy: () => {},
        notifications: ref([...(data.notifications || [])]),
        unreadCount: computed(() => 0),
        markAllRead: () => {},
        user: { name: '—', role: '—', email: '' },
      };
    }
    return ctx;
  }

  Object.assign(window, { providePortal, usePortal });
})();
