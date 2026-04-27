<script setup>
import { ref, computed } from 'vue';

const D = window.PORTAL_DATA;
const { fmt, eur } = window;

const tab = ref('all');
const filtered = computed(() => D.campaigns.filter(c => tab.value === 'all' || c.status === tab.value));

const tabs = computed(() => [
  { id: 'all',       label: 'Todas' },
  { id: 'active',    label: 'Ativas',     count: D.campaigns.filter(c => c.status === 'active').length },
  { id: 'scheduled', label: 'Agendadas' },
  { id: 'ended',     label: 'Concluídas' },
]);

const reviews = [
  { who: 'Maria F.', stars: 5, txt: 'Atendimento impecável em Belém. Aconselhamento personalizado.', when: 'há 2 h' },
  { who: 'João C.',  stars: 4, txt: 'App online prática. Recomendo.',                                  when: 'há 5 h' },
  { who: 'Sofia R.', stars: 5, txt: 'Serviço de medição na Foz muito bom.',                             when: 'ontem' },
];

const donutData = [
  { v: 18420, color: 'var(--primary)' },
  { v: 12410, color: 'var(--brand-emerald-300)' },
  { v: 7590,  color: 'oklch(0.92 0.05 163)' },
];
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
    <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }">
      <div>
        <h1 :style="{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }">Marketing</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '13.5px', margin: '4px 0 0' }">Campanhas, MKT+ e gestão de presença digital</p>
      </div>
      <div :style="{ display: 'flex', gap: '8px' }">
        <Button severity="secondary" outlined><ICalendar :size="14"/> Calendário</Button>
        <Button><IPlus :size="14"/> Nova campanha</Button>
      </div>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }">
      <Kpi label="Campanhas ativas" value="3" :trend="50" sub="vs. mês anterior" :sparkData="[1,2,2,3,3,3,3]" accent/>
      <Kpi label="Membros MKT+"     value="38.420" :trend="6.8" sub="cartão cliente" :sparkData="[34,35,36,37,38,38,38]"/>
      <Kpi label="ROI médio"        value="3,8×" :trend="4.2" sub="rolling 90 dias" :sparkData="[3.2,3.4,3.5,3.6,3.7,3.8,3.8]"/>
      <Kpi label="NPS · Google"     value="4,7 ★" :trend="2.1" sub="218 reviews · mês" :sparkData="[4.4,4.5,4.5,4.6,4.6,4.7,4.7]"/>
    </div>

    <div :style="{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }">
      <Card>
        <div class="card-header">
          <div>
            <div class="card-title">Campanhas</div>
            <div class="card-subtitle">Visão de portefólio · este trimestre</div>
          </div>
          <SelectButton v-model="tab" :options="tabs" optionLabel="label" optionValue="id" :allowEmpty="false"/>
        </div>
        <div :style="{ padding: '4px 0' }">
          <div v-for="c in filtered" :key="c.id" class="row-hover"
            :style="{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }">
            <div :style="{ display: 'flex', alignItems: 'flex-start', gap: '12px' }">
              <div :style="{
                width: '36px', height: '36px', borderRadius: '9px',
                background: c.status === 'active' ? 'var(--primary-soft)' : 'var(--surface-sunken)',
                color: c.status === 'active' ? 'var(--primary)' : 'var(--foreground-muted)',
                display: 'grid', placeItems: 'center', flex: 'none',
              }">
                <IMegaphone :size="16"/>
              </div>
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }">
                  <span :style="{ fontSize: '14px', fontWeight: 600 }">{{ c.name }}</span>
                  <Tag v-if="c.status === 'active'"    severity="success">Ativa</Tag>
                  <Tag v-if="c.status === 'scheduled'" severity="info">Agendada</Tag>
                  <Tag v-if="c.status === 'ended'"     severity="neutral">Concluída</Tag>
                </div>
                <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }">
                  <span>{{ c.channel }}</span><span>•</span><span>{{ c.starts }} → {{ c.ends }}</span>
                </div>
                <div :style="{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }">
                  <div>
                    <div :style="{ fontSize: '10.5px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }">Orçamento</div>
                    <div :style="{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }">{{ eur(c.budget) }}</div>
                    <div :style="{ fontSize: '10.5px', color: 'var(--foreground-subtle)' }">{{ c.spent ? Math.round(c.spent/c.budget*100) + '% gasto' : 'não iniciado' }}</div>
                  </div>
                  <div>
                    <div :style="{ fontSize: '10.5px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }">Alcance</div>
                    <div :style="{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }">{{ fmt(c.reach) }}</div>
                  </div>
                  <div>
                    <div :style="{ fontSize: '10.5px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }">Conversões</div>
                    <div :style="{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }">{{ fmt(c.conv) }}</div>
                  </div>
                  <div>
                    <div :style="{ fontSize: '10.5px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }">ROI</div>
                    <div :style="{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: c.roi >= 3 ? 'var(--brand-emerald-700)' : 'var(--foreground)' }">{{ c.roi ? c.roi.toFixed(1) + '×' : '—' }}</div>
                  </div>
                </div>
                <div v-if="c.budget > 0 && c.spent > 0" :style="{ marginTop: '10px' }">
                  <ProgressBar :value="c.spent" :max="c.budget" :color="c.spent / c.budget > 0.9 ? 'var(--signal-warning)' : 'var(--primary)'"/>
                </div>
              </div>
              <Button text severity="secondary"><IMore :size="14"/></Button>
            </div>
          </div>
        </div>
      </Card>

      <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
        <Card>
          <div class="card-header">
            <div>
              <div class="card-title">MKT+ · Programa de fidelização</div>
              <div class="card-subtitle">Cartão cliente · este mês</div>
            </div>
          </div>
          <div class="card-body" :style="{ display: 'flex', gap: '16px', alignItems: 'center' }">
            <Donut :data="donutData" :size="140" :thickness="20" centerValue="38k" centerLabel="membros"/>
            <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }">
              <Legend color="var(--primary)" label="Premium" value="18.420"/>
              <Legend color="var(--brand-emerald-300)" label="Plus" value="12.410"/>
              <Legend color="oklch(0.92 0.05 163)" label="Base" value="7.590"/>
              <div :style="{ marginTop: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '11.5px', color: 'var(--foreground-muted)' }">
                Pontos resgatados · mês: <strong :style="{ color: 'var(--foreground)' }">184k</strong>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div class="card-header">
            <div>
              <div class="card-title">Reviews · este mês</div>
              <div class="card-subtitle">Google + Facebook · grupo</div>
            </div>
            <Button text severity="secondary" size="small">Responder</Button>
          </div>
          <div :style="{ padding: '4px 0' }">
            <div v-for="(r, i) in reviews" :key="i"
              :style="{ padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)' }">
              <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }">
                <strong :style="{ fontSize: '12.5px' }">{{ r.who }}</strong>
                <span :style="{ display: 'flex', gap: '1px', color: 'oklch(0.78 0.16 78)' }">
                  <IStar v-for="j in r.stars" :key="j" :size="11"/>
                </span>
                <span :style="{ marginLeft: 'auto', fontSize: '11px', color: 'var(--foreground-subtle)' }">{{ r.when }}</span>
              </div>
              <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">{{ r.txt }}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
