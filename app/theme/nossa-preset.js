// nossa-preset.js
// Preset PrimeVue 4 customizado, derivado do Aura. As cores reais sao
// resolvidas via CSS vars em styles/theme-overrides.css; o preset apenas
// remapeia a escala primary para emerald (caso o tema gere CSS dependente
// dela). O dark mode e tratado pelo `darkModeSelector` em main.js.
//
// Carregado depois de @primeuix/themes/umd/aura.js (Aura) e do PrimeVue
// UMD (definePreset). Expoe window.NossaPreset.

(function () {
  const Aura = window.PrimeUIX && window.PrimeUIX.Themes && window.PrimeUIX.Themes.Aura;
  const definePreset = window.PrimeVue && window.PrimeVue.definePreset;

  if (!Aura) {
    console.error('[nossa-preset] @primeuix/themes/aura nao foi carregado.');
    return;
  }
  if (typeof definePreset !== 'function') {
    console.error('[nossa-preset] window.PrimeVue.definePreset nao disponivel.');
    return;
  }

  const base = Aura.default || Aura;

  // Apenas redirecionamos a escala primary para a paleta emerald (que o Aura
  // ja inclui em primitive). O resto do remapping fino acontece em
  // theme-overrides.css via --p-*.
  window.NossaPreset = definePreset(base, {
    semantic: {
      primary: {
        50:  '{emerald.50}',
        100: '{emerald.100}',
        200: '{emerald.200}',
        300: '{emerald.300}',
        400: '{emerald.400}',
        500: '{emerald.500}',
        600: '{emerald.600}',
        700: '{emerald.700}',
        800: '{emerald.800}',
        900: '{emerald.900}',
        950: '{emerald.950}',
      },
    },
  });
})();
