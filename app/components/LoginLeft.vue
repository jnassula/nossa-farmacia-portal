<script setup>
import Stat from './Stat.vue';
</script>

<template>
  <div class="login-art"
    :style="{ position: 'relative', overflow: 'hidden', background: 'var(--brand-emerald-50)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px' }">
    <svg :style="{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 800">
      <defs>
        <pattern id="crossPat" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M52 30h16v22h22v16h-22v22h-16v-22h-22v-16h22z" fill="oklch(0.660 0.155 163)" opacity="0.10"/>
        </pattern>
        <radialGradient id="rg" cx="20%" cy="20%" r="80%">
          <stop offset="0%" stop-color="oklch(0.95 0.05 163)"/>
          <stop offset="100%" stop-color="oklch(0.92 0.07 163)" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="600" height="800" fill="url(#crossPat)"/>
      <rect width="600" height="800" fill="url(#rg)"/>
    </svg>

    <div :style="{ position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)', width: '460px', height: '460px', opacity: 0.85 }">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <linearGradient id="crossGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="oklch(0.740 0.160 163)"/>
            <stop offset="100%" stop-color="oklch(0.520 0.130 163)"/>
          </linearGradient>
        </defs>
        <path d="M75 20h50v55h55v50h-55v55h-50v-55h-55v-50h55z" fill="url(#crossGrad)" filter="drop-shadow(0 12px 32px oklch(0.520 0.130 163 / 0.25))"/>
        <ellipse cx="155" cy="50" rx="14" ry="6" fill="oklch(0.820 0.150 150)" opacity="0.8" transform="rotate(-30 155 50)"/>
        <ellipse cx="50" cy="160" rx="12" ry="5" fill="oklch(0.820 0.150 150)" opacity="0.6" transform="rotate(20 50 160)"/>
      </svg>
    </div>

    <div :style="{ position: 'relative', zIndex: 2 }">
      <img src="assets/nf_icon.svg" width="40" height="40" alt="Nossa Farmácia"/>
    </div>

    <div :style="{ position: 'relative', zIndex: 2, maxWidth: '420px' }">
      <div :style="{ fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-emerald-700)', marginBottom: '12px' }">
        Grupo Nossa Farmácia
      </div>
      <h2 class="type-display"
        :style="{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.0, letterSpacing: '-0.01em', color: 'var(--brand-emerald-900)', margin: 0 }">
        Uma vista, todas as <em :style="{ fontStyle: 'italic' }">farmácias.</em>
      </h2>
      <p :style="{ marginTop: '16px', fontSize: '14px', color: 'var(--brand-emerald-800)', maxWidth: '380px', lineHeight: 1.55 }">
        Stock, finanças, equipa e canais digitais num só portal. Sincronizado com o seu sistema de gestão e com o Nossa AI.
      </p>
      <div :style="{ marginTop: '28px', display: 'flex', gap: '24px', flexWrap: 'wrap' }">
        <Stat n="12"  label="Farmácias"/>
        <Stat n="184" label="Colaboradores"/>
        <Stat n="38k" label="Clientes ativos"/>
      </div>
    </div>
  </div>
</template>
