// tweaks.js — Tweaks shell + form controls (porta de tweaks-panel.jsx p/ Vue 3).
//
// useTweaks(defaults): composable que devolve [values reativo, setTweak()].
// TweaksPanel: painel flutuante (top-right), arrastavel, com protocolo
// postMessage para o IDE host (__activate/__deactivate_edit_mode).
// TweakSection/Row: layout. TweakSlider/Toggle/Radio/Select/Text/Number/Color/Button: controlos.

(function () {
  const Vue = window.Vue;
  if (!Vue) { console.error('[tweaks] Vue ainda nao carregado.'); return; }
  const { h, reactive, ref, computed, onMounted, onBeforeUnmount, defineComponent, watch, nextTick } = Vue;

  // ---- CSS scopado ----------------------------------------------------------
  const TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}
  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}
  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}
  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}
  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}
  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
  `;

  let styleInjected = false;
  const injectStyle = () => {
    if (styleInjected) return;
    const el = document.createElement('style');
    el.textContent = TWEAKS_STYLE;
    document.head.appendChild(el);
    styleInjected = true;
  };

  // ---- useTweaks ------------------------------------------------------------
  // Composable. values e um reactive proxy; setTweak persiste via postMessage
  // para o IDE host (mantendo o protocolo do React original).
  function useTweaks(defaults) {
    const values = reactive({ ...defaults });
    const setTweak = (keyOrEdits, val) => {
      const edits = (typeof keyOrEdits === 'object' && keyOrEdits !== null)
        ? keyOrEdits
        : { [keyOrEdits]: val };
      Object.assign(values, edits);
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
        }
      } catch { /* sandboxed */ }
    };
    return [values, setTweak];
  }

  // ---- TweaksPanel ----------------------------------------------------------
  const TweaksPanel = defineComponent({
    name: 'TweaksPanel',
    props: { title: { type: String, default: 'Tweaks' } },
    setup(props, { slots }) {
      const open = ref(false);
      const dragRef = ref(null);
      const offset = reactive({ x: 16, y: 16 });
      const PAD = 16;

      const clampToViewport = () => {
        const panel = dragRef.value;
        if (!panel) return;
        const w = panel.offsetWidth, hh = panel.offsetHeight;
        const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
        const maxBottom = Math.max(PAD, window.innerHeight - hh - PAD);
        offset.x = Math.min(maxRight,  Math.max(PAD, offset.x));
        offset.y = Math.min(maxBottom, Math.max(PAD, offset.y));
        panel.style.right  = offset.x + 'px';
        panel.style.bottom = offset.y + 'px';
      };

      let ro = null;
      const startWatchers = () => {
        nextTick(() => clampToViewport());
        if (typeof ResizeObserver === 'undefined') {
          window.addEventListener('resize', clampToViewport);
        } else {
          ro = new ResizeObserver(clampToViewport);
          ro.observe(document.documentElement);
        }
      };
      const stopWatchers = () => {
        if (ro) { ro.disconnect(); ro = null; }
        window.removeEventListener('resize', clampToViewport);
      };

      watch(open, (v) => {
        if (v) { injectStyle(); startWatchers(); }
        else stopWatchers();
      });

      const onMsg = (e) => {
        const t = e?.data?.type;
        if (t === '__activate_edit_mode') open.value = true;
        else if (t === '__deactivate_edit_mode') open.value = false;
      };

      onMounted(() => {
        window.addEventListener('message', onMsg);
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: '__edit_mode_available' }, '*');
          }
        } catch { /* sandboxed */ }
      });
      onBeforeUnmount(() => {
        window.removeEventListener('message', onMsg);
        stopWatchers();
      });

      const dismiss = () => {
        open.value = false;
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
          }
        } catch { /* sandboxed */ }
      };

      const onDragStart = (e) => {
        const panel = dragRef.value;
        if (!panel) return;
        const r = panel.getBoundingClientRect();
        const sx = e.clientX, sy = e.clientY;
        const startRight = window.innerWidth - r.right;
        const startBottom = window.innerHeight - r.bottom;
        const move = (ev) => {
          offset.x = startRight  - (ev.clientX - sx);
          offset.y = startBottom - (ev.clientY - sy);
          clampToViewport();
        };
        const up = () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      };

      return () => {
        if (!open.value) return null;
        return h('div', {
          ref: (el) => { dragRef.value = el; },
          class: 'twk-panel',
          style: { right: offset.x + 'px', bottom: offset.y + 'px' },
        }, [
          h('div', { class: 'twk-hd', onMousedown: onDragStart }, [
            h('b', null, props.title),
            h('button', {
              class: 'twk-x',
              'aria-label': 'Close tweaks',
              onMousedown: (e) => e.stopPropagation(),
              onClick: dismiss,
            }, '✕'),
          ]),
          h('div', { class: 'twk-body' }, slots.default ? slots.default() : []),
        ]);
      };
    },
  });

  // ---- TweakSection ---------------------------------------------------------
  const TweakSection = (_p, { attrs, slots }) => {
    return h(Vue.Fragment, null, [
      h('div', { class: 'twk-sect' }, attrs.label || attrs.title),
      slots.default ? slots.default() : null,
    ]);
  };

  // ---- TweakRow -------------------------------------------------------------
  const TweakRow = (_p, { attrs, slots }) => {
    const inline = !!attrs.inline;
    return h('div', { class: inline ? 'twk-row twk-row-h' : 'twk-row' }, [
      h('div', { class: 'twk-lbl' }, [
        h('span', null, attrs.label),
        attrs.value != null ? h('span', { class: 'twk-val' }, String(attrs.value)) : null,
      ]),
      slots.default ? slots.default() : null,
    ]);
  };

  // ---- TweakSlider ----------------------------------------------------------
  const TweakSlider = (_p, { attrs, emit }) => {
    const min = attrs.min != null ? Number(attrs.min) : 0;
    const max = attrs.max != null ? Number(attrs.max) : 100;
    const step = attrs.step != null ? Number(attrs.step) : 1;
    const unit = attrs.unit || '';
    return h(TweakRow, { label: attrs.label, value: `${attrs.value}${unit}` }, {
      default: () => h('input', {
        type: 'range', class: 'twk-slider', min, max, step,
        value: attrs.value,
        onInput: (e) => emit('change', Number(e.target.value)),
      }),
    });
  };

  // ---- TweakToggle ----------------------------------------------------------
  const TweakToggle = (_p, { attrs, emit }) => {
    return h('div', { class: 'twk-row twk-row-h' }, [
      h('div', { class: 'twk-lbl' }, h('span', null, attrs.label)),
      h('button', {
        type: 'button',
        class: 'twk-toggle',
        'data-on': attrs.value ? '1' : '0',
        role: 'switch',
        'aria-checked': !!attrs.value,
        onClick: () => emit('change', !attrs.value),
      }, h('i')),
    ]);
  };

  // ---- TweakRadio (segmented) ----------------------------------------------
  const TweakRadio = defineComponent({
    name: 'TweakRadio',
    props: ['label', 'value', 'options'],
    emits: ['change'],
    setup(props, { emit }) {
      const trackRef = ref(null);
      const dragging = ref(false);
      const opts = computed(() => (props.options || []).map(o => typeof o === 'object' ? o : { value: o, label: o }));
      const idx = computed(() => Math.max(0, opts.value.findIndex(o => o.value === props.value)));
      const n = computed(() => opts.value.length);

      const segAt = (clientX) => {
        const r = trackRef.value.getBoundingClientRect();
        const inner = r.width - 4;
        const i = Math.floor(((clientX - r.left - 2) / inner) * n.value);
        return opts.value[Math.max(0, Math.min(n.value - 1, i))].value;
      };

      const onPointerDown = (e) => {
        dragging.value = true;
        const v0 = segAt(e.clientX);
        if (v0 !== props.value) emit('change', v0);
        const move = (ev) => {
          if (!trackRef.value) return;
          const v = segAt(ev.clientX);
          if (v !== props.value) emit('change', v);
        };
        const up = () => {
          dragging.value = false;
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      };

      return () => h(TweakRow, { label: props.label }, {
        default: () => h('div', {
          ref: (el) => { trackRef.value = el; },
          role: 'radiogroup',
          onPointerdown: onPointerDown,
          class: dragging.value ? 'twk-seg dragging' : 'twk-seg',
        }, [
          h('div', {
            class: 'twk-seg-thumb',
            style: {
              left: `calc(2px + ${idx.value} * (100% - 4px) / ${n.value})`,
              width: `calc((100% - 4px) / ${n.value})`,
            },
          }),
          ...opts.value.map(o => h('button', {
            key: o.value,
            type: 'button',
            role: 'radio',
            'aria-checked': o.value === props.value,
          }, o.label)),
        ]),
      });
    },
  });

  // ---- TweakSelect ----------------------------------------------------------
  const TweakSelect = (_p, { attrs, emit }) => {
    return h(TweakRow, { label: attrs.label }, {
      default: () => h('select', {
        class: 'twk-field',
        value: attrs.value,
        onChange: (e) => emit('change', e.target.value),
      }, (attrs.options || []).map(o => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o;
        return h('option', { key: v, value: v }, l);
      })),
    });
  };

  // ---- TweakText ------------------------------------------------------------
  const TweakText = (_p, { attrs, emit }) => {
    return h(TweakRow, { label: attrs.label }, {
      default: () => h('input', {
        class: 'twk-field',
        type: 'text',
        value: attrs.value,
        placeholder: attrs.placeholder,
        onInput: (e) => emit('change', e.target.value),
      }),
    });
  };

  // ---- TweakNumber ----------------------------------------------------------
  const TweakNumber = defineComponent({
    name: 'TweakNumber',
    props: ['label', 'value', 'min', 'max', 'step', 'unit'],
    emits: ['change'],
    setup(props, { emit }) {
      const clamp = (n) => {
        if (props.min != null && n < props.min) return Number(props.min);
        if (props.max != null && n > props.max) return Number(props.max);
        return n;
      };
      const startRef = { x: 0, val: 0 };
      const onScrubStart = (e) => {
        e.preventDefault();
        const step = Number(props.step != null ? props.step : 1);
        startRef.x = e.clientX; startRef.val = Number(props.value);
        const decimals = (String(step).split('.')[1] || '').length;
        const move = (ev) => {
          const dx = ev.clientX - startRef.x;
          const raw = startRef.val + dx * step;
          const snapped = Math.round(raw / step) * step;
          emit('change', clamp(Number(snapped.toFixed(decimals))));
        };
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      };
      return () => h('div', { class: 'twk-num' }, [
        h('span', { class: 'twk-num-lbl', onPointerdown: onScrubStart }, props.label),
        h('input', {
          type: 'number',
          value: props.value,
          min: props.min, max: props.max,
          step: props.step != null ? props.step : 1,
          onInput: (e) => emit('change', clamp(Number(e.target.value))),
        }),
        props.unit ? h('span', { class: 'twk-num-unit' }, props.unit) : null,
      ]);
    },
  });

  // ---- TweakColor -----------------------------------------------------------
  const TweakColor = (_p, { attrs, emit }) => {
    return h('div', { class: 'twk-row twk-row-h' }, [
      h('div', { class: 'twk-lbl' }, h('span', null, attrs.label)),
      h('input', {
        type: 'color', class: 'twk-swatch',
        value: attrs.value,
        onInput: (e) => emit('change', e.target.value),
      }),
    ]);
  };

  // ---- TweakButton ----------------------------------------------------------
  const TweakButton = (_p, { attrs, emit }) => {
    return h('button', {
      type: 'button',
      class: attrs.secondary ? 'twk-btn secondary' : 'twk-btn',
      onClick: () => emit('click'),
    }, attrs.label);
  };

  Object.assign(window, {
    useTweaks, TweaksPanel, TweakSection, TweakRow,
    TweakSlider, TweakToggle, TweakRadio, TweakSelect,
    TweakText, TweakNumber, TweakColor, TweakButton,
  });
})();
