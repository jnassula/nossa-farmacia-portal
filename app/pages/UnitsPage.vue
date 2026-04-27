<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { eurD } = window;

const selected = ref(null);
const selectedPharmacy = computed(() => D.pharmacies.find(p => p.id === selected.value));

const ranking = computed(() => [...D.pharmacies].sort((a, b) => b.revenue - a.revenue));

// NetworkMap projection (760×480, lat ~36.9–42.2, lng ~-9.5 to -7.0)
const mapW = 760, mapH = 480;
const project = (lat, lng) => ({
  x: ((lng + 9.6) / 2.6) * mapW,
  y: ((42.2 - lat) / 5.3) * mapH,
});
const mapDots = computed(() => D.pharmacies.map(p => {
  const { x, y } = project(p.lat, p.lng);
  const seed = p.id.charCodeAt(0) + p.id.charCodeAt(2);
  const jx = ((seed * 7) % 14) - 7;
  const jy = ((seed * 13) % 14) - 7;
  const r = 6 + Math.min(14, p.revenue / 14000);
  const color = p.growth > 4 ? 'oklch(0.660 0.155 163)' : p.growth > 0 ? 'oklch(0.780 0.160 78)' : 'oklch(0.620 0.150 27)';
  return { ...p, cx: x + jx, cy: y + jy, r, color };
}));

// Sparkline data per pharmacy (deterministic seed)
const detailSpark = computed(() => {
  if (!selectedPharmacy.value) return [];
  const p = selectedPharmacy.value;
  return Array.from({ length: 30 }, (_, i) =>
    p.revenue / 30 + Math.sin(i / 3) * 800 + ((i % 7) - 3) * 200
  );
});
const detailHeadcount = computed(() => {
  if (!selectedPharmacy.value) return 0;
  const counts = [6, 8, 7, 5, 9, 7, 6, 4, 5, 4, 4, 5];
  return counts[D.pharmacies.findIndex(p => p.id === selectedPharmacy.value.id) % counts.length];
});

const detailMinis = [
  { label: 'Atendimentos / dia', value: '142',     pct: 78 },
  { label: 'Ticket médio',        value: '14.20 €', pct: 64 },
  { label: 'Stock saudável',      value: '92%',     pct: 92 },
  { label: 'Avaliação Google',    value: '4.8 ★',   pct: 96 },
];
const statusLabel = (s) => s === 'top' ? 'Top' : s === 'good' ? 'Saudável' : 'A monitorizar';
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="12 farmácias · Lisboa, Porto, Braga, Coimbra, Aveiro, Faro, Évora">
      Unidades
      <template #action>
        <div :style="{ display: 'flex', gap: '8px' }">
          <Btn variant="ghost"><IDownload :size="14"/> Relatório</Btn>
          <Btn variant="primary"><IPlus :size="14"/> Adicionar unidade</Btn>
        </div>
      </template>
    </SectionTitle>

    <div class="kpi-grid">
      <KPI label="Faturação · grupo MTD" :value="eurD(1486920)" :delta="4.8"><template #icon><IWallet :size="16"/></template></KPI>
      <KPI label="Top performer" value="Baixa" sub="184.3 K€ MTD"><template #icon><ISparkle :size="16"/></template></KPI>
      <KPI label="A monitorizar" value="3" sub="< média do grupo"><template #icon><IAlert :size="16"/></template></KPI>
      <KPI label="Total colaboradores" value="86" :delta="1.2"><template #icon><IUsers :size="16"/></template></KPI>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '20px' }">
      <Card :style="{ padding: 0, overflow: 'hidden' }">
        <div :style="{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <div :style="{ fontSize: '14px', fontWeight: 600 }">Mapa do grupo</div>
          <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">Tamanho · faturação MTD · cor · variação</div>
        </div>
        <div :style="{ position: 'relative', background: 'linear-gradient(180deg, oklch(0.99 0.005 200), var(--surface-sunken))', height: '480px' }">
          <svg width="100%" height="100%" :viewBox="`0 0 ${mapW} ${mapH}`" preserveAspectRatio="xMidYMid meet">
            <path d="M 280 60 Q 290 80 285 120 L 290 160 Q 285 200 295 240 L 290 290 Q 300 330 305 380 L 320 420 Q 380 440 420 420 L 460 420 L 480 400 L 470 360 L 480 320 L 470 280 L 460 240 L 440 200 L 430 160 L 410 130 L 380 100 L 350 70 L 310 55 Z"
                  fill="oklch(0.95 0.01 200)" stroke="var(--border)" stroke-width="1"/>
            <text x="320" y="120" fill="var(--foreground-subtle)" font-size="11" font-weight="500">Porto</text>
            <text x="320" y="280" fill="var(--foreground-subtle)" font-size="11" font-weight="500">Coimbra</text>
            <text x="320" y="370" fill="var(--foreground-subtle)" font-size="11" font-weight="500">Lisboa</text>
            <text x="380" y="430" fill="var(--foreground-subtle)" font-size="11" font-weight="500">Algarve</text>

            <g v-for="d in mapDots" :key="d.id" @click="selected = d.id" :style="{ cursor: 'pointer' }">
              <circle :cx="d.cx" :cy="d.cy" :r="d.r + 4" :fill="d.color" opacity="0.18"/>
              <circle :cx="d.cx" :cy="d.cy" :r="d.r" :fill="d.color"
                :opacity="selected === d.id ? 1 : 0.85"
                stroke="#fff" :stroke-width="selected === d.id ? 3 : 2"/>
              <text v-if="selected === d.id"
                :x="d.cx" :y="d.cy - d.r - 8" text-anchor="middle"
                fill="var(--foreground)" font-size="11" font-weight="600">
                {{ d.name.replace('Farmácia Nossa ', '') }}
              </text>
            </g>
          </svg>
          <div :style="{ position: 'absolute', bottom: '12px', left: '12px', padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', gap: '14px', fontSize: '11.5px' }">
            <span :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'oklch(0.660 0.155 163)' }"/>Crescimento &gt; 4%
            </span>
            <span :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'oklch(0.780 0.160 78)' }"/>Estável
            </span>
            <span :style="{ display: 'flex', alignItems: 'center', gap: '6px' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '999px', background: 'oklch(0.620 0.150 27)' }"/>A monitorizar
            </span>
          </div>
        </div>
      </Card>

      <Card :style="{ padding: 0, overflow: 'hidden', maxHeight: '560px', display: 'flex', flexDirection: 'column' }">
        <div :style="{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '14px', fontWeight: 600 }">
          Ranking de unidades
        </div>
        <div :style="{ overflowY: 'auto', flex: 1 }">
          <div v-for="(p, i) in ranking" :key="p.id" class="row-hover"
            @click="selected = p.id"
            :style="{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background: selected === p.id ? 'var(--primary-soft)' : 'transparent',
            }">
            <div :style="{ width: '24px', fontSize: '11px', fontWeight: 600, color: 'var(--foreground-muted)', fontVariantNumeric: 'tabular-nums' }">#{{ i + 1 }}</div>
            <div :style="{ flex: 1, minWidth: 0 }">
              <div :style="{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ p.name.replace('Farmácia Nossa ', '') }}</div>
              <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)' }">{{ p.city }} · {{ p.manager }}</div>
            </div>
            <div :style="{ textAlign: 'right' }">
              <div :style="{ fontSize: '13px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }">{{ eurD(p.revenue) }}</div>
              <Trend :value="p.growth"/>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Card v-if="selectedPharmacy" :style="{ padding: '24px' }">
      <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }">
        <div>
          <h3 :style="{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }">{{ selectedPharmacy.name }}</h3>
          <div :style="{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '4px' }">
            {{ selectedPharmacy.city }} · {{ selectedPharmacy.district }} · Gestora {{ selectedPharmacy.manager }} · {{ selectedPharmacy.phone }}
          </div>
        </div>
        <IconBtn @click="selected = null"><IClose :size="16"/></IconBtn>
      </div>

      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }">
        <Stat label="Faturação MTD" :value="eurD(selectedPharmacy.revenue)"/>
        <Stat label="Crescimento" :value="(selectedPharmacy.growth >= 0 ? '+' : '') + selectedPharmacy.growth.toFixed(1) + '%'"/>
        <Stat label="Estado" :value="statusLabel(selectedPharmacy.status)"/>
        <Stat label="Colaboradores" :value="detailHeadcount"/>
      </div>

      <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }">
        <div>
          <div :style="{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }">Faturação · 30 dias</div>
          <Sparkline :data="detailSpark" :width="400" :height="80"/>
        </div>
        <div>
          <div :style="{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }">Indicadores operacionais</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div v-for="m in detailMinis" :key="m.label">
              <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }">
                <span :style="{ color: 'var(--foreground-muted)' }">{{ m.label }}</span>
                <span :style="{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }">{{ m.value }}</span>
              </div>
              <ProgressBar :value="m.pct" :max="100"/>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
