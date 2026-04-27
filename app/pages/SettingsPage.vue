<script setup>
import { ref } from 'vue';

const tab = ref('profile');

const navTabs = [
  { id: 'profile',      label: 'Perfil',          icon: 'IUser' },
  { id: 'org',          label: 'Organização',     icon: 'IBuilding' },
  { id: 'team',         label: 'Equipa & papéis', icon: 'IUsers' },
  { id: 'integrations', label: 'Integrações',     icon: 'IGlobe' },
  { id: 'security',     label: 'Segurança',        icon: 'IShield' },
  { id: 'billing',      label: 'Faturação',       icon: 'IWallet' },
];

const navBtnStyle = (active) => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '9px 12px', border: 0,
  background: active ? 'var(--primary-soft)' : 'transparent',
  color: active ? 'var(--brand-emerald-800)' : 'var(--foreground)',
  borderRadius: '8px', fontSize: '13px',
  fontWeight: active ? 600 : 500,
  cursor: 'pointer', textAlign: 'left', font: 'inherit',
});

// inpStyle removido — InputText herda estilos do tema PrimeVue
// selectStyle removido — <Select> PrimeVue herda estilos do tema

const fieldRowStyle = {
  display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px',
  alignItems: 'flex-start', padding: '14px 0',
  borderTop: '1px solid var(--border-subtle)',
};

const roles = [
  { id: 'admin',   name: 'Administrador',     members: 3,  perms: 'Acesso total · faturação · APIs' },
  { id: 'manager', name: 'Gestor de unidade', members: 12, perms: 'Operação · finanças leitura · equipa' },
  { id: 'pharma',  name: 'Farmacêutico',       members: 32, perms: 'Receituário · stock · clientes' },
  { id: 'tech',    name: 'Técnico',            members: 28, perms: 'Atendimento · stock leitura' },
  { id: 'auditor', name: 'Auditor (externo)',  members: 2,  perms: 'Apenas leitura · compliance' },
];

const integrations = [
  { id: 'sifarma',  name: 'Sifarma 2000',         desc: 'Sincronização POS e stocks',         status: 'connected', icon: '🟢' },
  { id: 'glovo',    name: 'Glovo',                 desc: 'Pedidos, catálogo e horários',      status: 'connected', icon: '🟡' },
  { id: 'bolt',     name: 'Bolt Food',             desc: 'Pedidos e promoções',                status: 'connected', icon: '🔵' },
  { id: 'uber',     name: 'Uber Eats',             desc: 'Pedidos e disponibilidade',          status: 'pending',   icon: '⚫' },
  { id: 'mktp',     name: 'MKT+',                  desc: 'Cartão Cliente e CRM marketing',    status: 'connected', icon: '🟠' },
  { id: 'phc',      name: 'PHC Pharmacy',          desc: 'ERP financeiro e contabilidade',    status: 'connected', icon: '🔷' },
  { id: 'infarmed', name: 'INFARMED · ePharm',     desc: 'Reporte regulatório',                status: 'connected', icon: '🟢' },
  { id: 'mb',       name: 'Multibanco · Easypay',  desc: 'Pagamentos e referências',           status: 'connected', icon: '🔴' },
];
</script>

<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
    <SectionTitle sub="Perfil, organização, integrações e segurança">Definições</SectionTitle>

    <div :style="{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }">
      <nav :style="{ display: 'flex', flexDirection: 'column', gap: '2px' }">
        <button v-for="t in navTabs" :key="t.id" @click="tab = t.id" :style="navBtnStyle(tab === t.id)">
          <component :is="t.icon" :size="15"/>{{ t.label }}
        </button>
      </nav>

      <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
        <!-- Profile -->
        <Card v-if="tab === 'profile'" :style="{ padding: 0, overflow: 'hidden' }">
          <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
            <div :style="{ fontSize: '15px', fontWeight: 600 }">Perfil</div>
            <div :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">A forma como aparece no portal e nas notificações.</div>
          </div>
          <div :style="{ padding: '22px' }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }">
              <Avatar name="Inês Carvalho" :size="64"/>
              <div>
                <Button text severity="secondary" size="small">Carregar foto</Button>
                <div :style="{ fontSize: '11px', color: 'var(--foreground-muted)', marginTop: '4px' }">JPG ou PNG · até 2 MB</div>
              </div>
            </div>
            <div :style="fieldRowStyle">
              <div>
                <div :style="{ fontSize: '13px', fontWeight: 500 }">Nome</div>
                <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Nome completo profissional</div>
              </div>
              <div><InputText :model-value="'Inês Carvalho'" :style="{ maxWidth: '380px', width: '100%' }"/></div>
            </div>
            <div :style="fieldRowStyle">
              <div><div :style="{ fontSize: '13px', fontWeight: 500 }">Cargo</div></div>
              <div><InputText :model-value="'Gestora · Grupo'" :style="{ maxWidth: '380px', width: '100%' }"/></div>
            </div>
            <div :style="fieldRowStyle">
              <div>
                <div :style="{ fontSize: '13px', fontWeight: 500 }">Email</div>
                <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Para notificações e recuperação</div>
              </div>
              <div><InputText :model-value="'ines.carvalho@nossafarmacia.pt'" :style="{ maxWidth: '380px', width: '100%' }"/></div>
            </div>
            <div :style="fieldRowStyle">
              <div><div :style="{ fontSize: '13px', fontWeight: 500 }">Telemóvel</div></div>
              <div><InputText :model-value="'+351 91 423 11 02'" :style="{ maxWidth: '380px', width: '100%' }"/></div>
            </div>
            <div :style="fieldRowStyle">
              <div><div :style="{ fontSize: '13px', fontWeight: 500 }">Idioma</div></div>
              <div>
                <Select :model-value="'Português (PT)'" :options="['Português (PT)', 'English']" :style="{ maxWidth: '200px', width: '100%' }"/>
              </div>
            </div>
          </div>
          <div :style="{ padding: '12px 22px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }">
            <Button text severity="secondary">Cancelar</Button>
            <Button severity="primary">Guardar</Button>
          </div>
        </Card>

        <!-- Organização -->
        <Card v-else-if="tab === 'org'" :style="{ padding: 0, overflow: 'hidden' }">
          <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
            <div :style="{ fontSize: '15px', fontWeight: 600 }">Organização</div>
            <div :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Dados fiscais e de identificação do grupo.</div>
          </div>
          <div :style="{ padding: '22px' }">
            <div :style="fieldRowStyle"><div><div :style="{ fontSize: '13px', fontWeight: 500 }">Razão social</div></div><div><InputText :model-value="'Nossa Farmácia · Grupo, SA'" :style="{ maxWidth: '380px', width: '100%' }"/></div></div>
            <div :style="fieldRowStyle"><div><div :style="{ fontSize: '13px', fontWeight: 500 }">NIPC</div></div><div><InputText :model-value="'509 821 410'" :style="{ maxWidth: '380px', width: '100%' }"/></div></div>
            <div :style="fieldRowStyle"><div><div :style="{ fontSize: '13px', fontWeight: 500 }">Sede</div></div><div><InputText :model-value="'Rua Augusta 142, 1100-053 Lisboa'" :style="{ maxWidth: '380px', width: '100%' }"/></div></div>
            <div :style="fieldRowStyle"><div><div :style="{ fontSize: '13px', fontWeight: 500 }">INFARMED · alvará</div></div><div><InputText :model-value="'ALV-2018-0421'" :style="{ maxWidth: '380px', width: '100%' }"/></div></div>
            <div :style="fieldRowStyle"><div><div :style="{ fontSize: '13px', fontWeight: 500 }">Encarregado de proteção de dados</div></div><div><InputText :model-value="'dpo@nossafarmacia.pt'" :style="{ maxWidth: '380px', width: '100%' }"/></div></div>
          </div>
          <div :style="{ padding: '12px 22px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }">
            <Button severity="primary">Guardar</Button>
          </div>
        </Card>

        <!-- Equipa & papéis -->
        <Card v-else-if="tab === 'team'" :style="{ padding: 0, overflow: 'hidden' }">
          <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
            <div :style="{ fontSize: '15px', fontWeight: 600 }">Equipa &amp; papéis</div>
            <div :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Configure os papéis e permissões para os colaboradores do grupo.</div>
          </div>
          <div :style="{ padding: '22px' }">
            <div :style="{ display: 'flex', flexDirection: 'column' }">
              <div v-for="(r, i) in roles" :key="r.id"
                :style="{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderTop: '1px solid var(--border-subtle)' }">
                <div :style="{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }">
                  <IShield :size="16"/>
                </div>
                <div :style="{ flex: 1 }">
                  <div :style="{ fontSize: '13.5px', fontWeight: 600 }">{{ r.name }}</div>
                  <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">{{ r.perms }}</div>
                </div>
                <div :style="{ fontSize: '12px', color: 'var(--foreground-muted)' }">{{ r.members }} membros</div>
                <Button text severity="secondary" size="small">Editar</Button>
              </div>
            </div>
          </div>
        </Card>

        <!-- Integrações -->
        <Card v-else-if="tab === 'integrations'" :style="{ padding: 0, overflow: 'hidden' }">
          <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
            <div :style="{ fontSize: '15px', fontWeight: 600 }">Integrações</div>
            <div :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Sistemas e parceiros conectados ao portal.</div>
          </div>
          <div :style="{ padding: '22px' }">
            <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }">
              <div v-for="it in integrations" :key="it.id"
                :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)' }">
                <div :style="{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--surface-sunken)', display: 'grid', placeItems: 'center', fontSize: '18px' }">{{ it.icon }}</div>
                <div :style="{ flex: 1, minWidth: 0 }">
                  <div :style="{ fontSize: '13.5px', fontWeight: 600 }">{{ it.name }}</div>
                  <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)' }">{{ it.desc }}</div>
                </div>
                <Tag v-if="it.status === 'connected'" severity="success">Ativa</Tag>
                <Tag v-else severity="warn">Pendente</Tag>
              </div>
            </div>
          </div>
        </Card>

        <!-- Security -->
        <template v-else-if="tab === 'security'">
          <Card :style="{ padding: 0, overflow: 'hidden' }">
            <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
              <div :style="{ fontSize: '15px', fontWeight: 600 }">Autenticação</div>
              <div :style="{ fontSize: '12.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Como os utilizadores acedem ao portal.</div>
            </div>
            <div :style="{ padding: '22px' }">
              <div :style="fieldRowStyle">
                <div>
                  <div :style="{ fontSize: '13px', fontWeight: 500 }">Verificação em 2 passos</div>
                  <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Obrigatório para todos os papéis administrativos.</div>
                </div>
                <div><Tag severity="success">Ativo</Tag></div>
              </div>
              <div :style="fieldRowStyle">
                <div>
                  <div :style="{ fontSize: '13px', fontWeight: 500 }">SSO · Microsoft 365</div>
                  <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Início de sessão único com a conta corporativa.</div>
                </div>
                <div><Button text severity="secondary" size="small">Configurar</Button></div>
              </div>
              <div :style="fieldRowStyle">
                <div>
                  <div :style="{ fontSize: '13px', fontWeight: 500 }">Sessão expira após</div>
                  <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Inactividade.</div>
                </div>
                <div>
                  <Select :model-value="'30 minutos'" :options="['30 minutos', '1 hora', '4 horas', '8 horas']" :style="{ width: '200px' }"/>
                </div>
              </div>
            </div>
          </Card>

          <Card :style="{ padding: 0, overflow: 'hidden' }">
            <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
              <div :style="{ fontSize: '15px', fontWeight: 600 }">Auditoria</div>
            </div>
            <div :style="{ padding: '22px' }">
              <div :style="fieldRowStyle">
                <div>
                  <div :style="{ fontSize: '13px', fontWeight: 500 }">Registos preservados</div>
                  <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Acesso, alterações e exportações.</div>
                </div>
                <div><Tag severity="info">365 dias</Tag></div>
              </div>
              <div :style="fieldRowStyle">
                <div><div :style="{ fontSize: '13px', fontWeight: 500 }">Exportar registo de auditoria</div></div>
                <div><Button text severity="secondary" size="small"><IDownload :size="14"/> Exportar (.csv)</Button></div>
              </div>
            </div>
          </Card>
        </template>

        <!-- Billing -->
        <Card v-else-if="tab === 'billing'" :style="{ padding: 0, overflow: 'hidden' }">
          <div :style="{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }">
            <div :style="{ fontSize: '15px', fontWeight: 600 }">Faturação · plano</div>
          </div>
          <div :style="{ padding: '22px' }">
            <div :style="{ padding: '18px', borderRadius: '12px', background: 'var(--primary-soft)', border: '1px solid var(--brand-emerald-200)', marginBottom: '16px' }">
              <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
                <div>
                  <div :style="{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-emerald-800)' }">Plano Grupo · Enterprise</div>
                  <div :style="{ fontSize: '12.5px', color: 'var(--brand-emerald-700)', marginTop: '4px' }">12 unidades · 86 utilizadores · faturação anual</div>
                </div>
                <div :style="{ textAlign: 'right' }">
                  <div :style="{ fontSize: '22px', fontWeight: 700, color: 'var(--brand-emerald-800)', fontVariantNumeric: 'tabular-nums' }">
                    1 480 €<span :style="{ fontSize: '12px', fontWeight: 500 }">/mês</span>
                  </div>
                  <div :style="{ fontSize: '11px', color: 'var(--brand-emerald-700)' }">Próximo débito · 15/05/2026</div>
                </div>
              </div>
            </div>
            <div :style="fieldRowStyle">
              <div>
                <div :style="{ fontSize: '13px', fontWeight: 500 }">Método de pagamento</div>
                <div :style="{ fontSize: '11.5px', color: 'var(--foreground-muted)', marginTop: '4px' }">Visa terminado em 4218.</div>
              </div>
              <div><Button text severity="secondary" size="small">Alterar</Button></div>
            </div>
            <div :style="fieldRowStyle">
              <div><div :style="{ fontSize: '13px', fontWeight: 500 }">Faturas</div></div>
              <div><Button text severity="secondary" size="small"><IDownload :size="14"/> Histórico (12)</Button></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
