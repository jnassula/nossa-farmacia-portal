<script setup>
import { ref } from 'vue';
import LoginLeft from '../components/LoginLeft.vue';
import Field from '../components/Field.vue';
import GoogleG from '../components/GoogleG.vue';
import MsLogo from '../components/MsLogo.vue';

const emit = defineEmits(['login']);

const email = ref('ines.carvalho@nossafarmacia.pt');
const pwd = ref('••••••••••');
const showPwd = ref(false);
const remember = ref(true);
const loading = ref(false);
const stage = ref('credentials'); // credentials | pharmacy

const data = window.PORTAL_DATA;

const submit = (e) => {
  e?.preventDefault();
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    stage.value = 'pharmacy';
  }, 600);
};

const inputBare = {
  flex: 1, border: 0, outline: 0, background: 'transparent', font: 'inherit',
  fontSize: '14px', color: 'var(--foreground)',
};
const loginRoot = {
  display: 'grid', gridTemplateColumns: '1.05fr 1fr',
  minHeight: '100vh', background: 'var(--surface)',
};
const loginRight = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '32px', position: 'relative', background: 'var(--surface)',
};
const pharmacyCard = {
  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
  padding: '12px 14px', borderRadius: '12px',
  background: 'var(--surface)', border: '1px solid var(--border)',
  cursor: 'pointer', transition: 'all 160ms', font: 'inherit',
};
</script>

<template>
  <!-- Stage: pharmacy selector -->
  <div v-if="stage === 'pharmacy'" class="login-split" :style="loginRoot">
    <LoginLeft/>
    <div class="login-form-wrap" :style="loginRight">
      <div :style="{ width: '100%', maxWidth: '420px' }">
        <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }">
          Selecionar farmácia
        </div>
        <h1 :style="{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', margin: '8px 0 6px' }">Bem-vinda, Inês.</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '14px', margin: '0 0 24px' }">
          Tem acesso a {{ data.pharmacies.length }} farmácias do grupo. Escolha por onde começar.
        </p>

        <button @click="emit('login', 'all')"
          :style="{ ...pharmacyCard, marginBottom: '8px', background: 'var(--primary-soft)', borderColor: 'var(--brand-emerald-200)' }">
          <div :style="{ width: '36px', height: '36px', borderRadius: '9px', background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center' }">
            <IDashboard :size="17"/>
          </div>
          <div :style="{ flex: 1, textAlign: 'left' }">
            <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-emerald-800)' }">Vista de grupo</div>
            <div :style="{ fontSize: '12px', color: 'var(--brand-emerald-700)' }">
              Consolidado · todas as {{ data.pharmacies.length }} farmácias
            </div>
          </div>
          <IArrowRight :size="16" :style="{ color: 'var(--brand-emerald-700)' }"/>
        </button>

        <div :style="{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }">
          <button v-for="p in data.pharmacies.slice(0, 8)" :key="p.id"
            @click="emit('login', p.id)" :style="pharmacyCard">
            <div :style="{ width: '36px', height: '36px', borderRadius: '9px', background: 'var(--surface-sunken)', color: 'var(--foreground-muted)', display: 'grid', placeItems: 'center' }">
              <IBuilding :size="17"/>
            </div>
            <div :style="{ flex: 1, textAlign: 'left' }">
              <div :style="{ fontSize: '13.5px', fontWeight: 500 }">{{ p.name }}</div>
              <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ p.city }} · {{ p.district }}</div>
            </div>
            <IArrowRight :size="14" :style="{ color: 'var(--foreground-subtle)' }"/>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Stage: credentials -->
  <div v-else class="login-split" :style="loginRoot">
    <LoginLeft/>
    <div class="login-form-wrap" :style="loginRight">
      <form @submit="submit" :style="{ width: '100%', maxWidth: '380px' }">
        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }">
          <div class="brand-cross" :style="{ width: '36px', height: '36px', borderRadius: '9px' }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6v7h7v6h-7v7h-6v-7H2V9h7z"/></svg>
          </div>
          <div :style="{ lineHeight: 1.1 }">
            <div :style="{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em' }">
              nossa <span :style="{ color: 'var(--foreground-muted)', fontWeight: 500 }">portal</span>
            </div>
            <div :style="{ fontSize: '10.5px', color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }">
              Grupo · gestão
            </div>
          </div>
        </div>

        <h1 :style="{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }">Entrar na conta</h1>
        <p :style="{ color: 'var(--foreground-muted)', fontSize: '14px', margin: '0 0 28px' }">
          Use as credenciais Nossa Farmácia para aceder ao portal de gestão do grupo.
        </p>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
          <Field label="Email">
            <IMail :size="15" :style="{ color: 'var(--foreground-subtle)' }"/>
            <input v-model="email" placeholder="nome@nossafarmacia.pt" :style="inputBare"/>
          </Field>
          <Field label="Palavra-passe">
            <template #hint>
              <a href="#" @click.prevent
                :style="{ color: 'var(--primary)', fontSize: '11.5px', textDecoration: 'none', fontWeight: 500 }">
                Recuperar
              </a>
            </template>
            <ILock :size="15" :style="{ color: 'var(--foreground-subtle)' }"/>
            <input :type="showPwd ? 'text' : 'password'" v-model="pwd" placeholder="••••••••" :style="inputBare"/>
            <button type="button" @click="showPwd = !showPwd"
              :style="{ background: 'transparent', border: 0, color: 'var(--foreground-subtle)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: '4px' }">
              <IEyeOff v-if="showPwd" :size="15"/>
              <IEye v-else :size="15"/>
            </button>
          </Field>
          <label :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--foreground-muted)', cursor: 'pointer', marginTop: '2px' }">
            <input type="checkbox" v-model="remember" :style="{ accentColor: 'var(--primary)' }"/>
            Manter sessão iniciada neste dispositivo
          </label>
        </div>

        <Btn type="submit" size="lg" :style="{ width: '100%', marginTop: '22px' }" :disabled="loading">
          {{ loading ? 'A entrar…' : 'Entrar' }}
          <IArrowRight v-if="!loading" :size="15"/>
        </Btn>

        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0', color: 'var(--foreground-subtle)', fontSize: '11.5px' }">
          <div :style="{ flex: 1, height: '1px', background: 'var(--border)' }"/>
          ou continuar com
          <div :style="{ flex: 1, height: '1px', background: 'var(--border)' }"/>
        </div>

        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }">
          <button type="button" class="btn secondary"><GoogleG/> Google</button>
          <button type="button" class="btn secondary"><MsLogo/> Microsoft</button>
        </div>

        <div :style="{ marginTop: '28px', fontSize: '12px', color: 'var(--foreground-subtle)', textAlign: 'center' }">
          Problemas a entrar?
          <a href="#" @click.prevent :style="{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }">Contactar TI</a>
        </div>
      </form>

      <div :style="{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center', fontSize: '11.5px', color: 'var(--foreground-subtle)' }">
        © 2026 Grupo Nossa Farmácia · v3.4.0 ·
        <a href="#" @click.prevent :style="{ color: 'inherit', textDecoration: 'none' }">Privacidade</a> ·
        <a href="#" @click.prevent :style="{ color: 'inherit', textDecoration: 'none' }">Termos</a>
      </div>
    </div>
  </div>
</template>
