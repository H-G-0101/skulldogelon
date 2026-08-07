/**
 * dogelon-touch.js — controle na tela para celular
 *
 * O jogo inteiro le as teclas das variaveis globais keyboard*. Entao o
 * controle de toque nao precisa de logica propria: cada botao INJETA a tecla
 * configurada no InputManager, e os eventos do jogo respondem como se fosse
 * um teclado. Trocar de preset em CONTROLES muda o toque junto, de graca.
 *
 * A injecao acontece no callback de quadro, nao no evento de toque. Aprendido
 * na ponte das setas: fazer no evento do DOM depende da ordem dos listeners e
 * do momento em que o navegador dispara, e falha de forma intermitente.
 *
 * Deteccao: 'auto' liga sozinho em aparelho com toque e desliga no PC. Da para
 * forcar pelos ajustes, util para testar no desktop.
 */
(function () {
  'use strict';

  var STORE = 'dogelonmars.touch';       // 'auto' | 'on' | 'off'
  var G = { left: 7, right: 8, up: 9, down: 10, jump: 11, attack: 12, dash: 13 };

  var game = null, root = null;
  var pressed = {};                      // papel -> true enquanto o dedo esta no botao
  var injetado = {};                     // papel -> codigo gdjs em uso

  function modo() {
    try { return localStorage.getItem(STORE) || 'auto'; } catch (e) { return 'auto'; }
  }

  function temToque() {
    return (navigator.maxTouchPoints || 0) > 0 ||
           ('ontouchstart' in window) ||
           (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  }

  function deveMostrar(scene) {
    var m = modo();
    if (m === 'off') return false;
    var jogando = scene.getName() === 'Stage' || scene.getName() === 'Stage 2';
    if (!jogando) return false;
    return m === 'on' || temToque();
  }

  // ------------------------------------------------------------- interface
  function css() {
    if (document.getElementById('dg-touch-css')) return;
    var st = document.createElement('style');
    st.id = 'dg-touch-css';
    st.textContent = [
      '#dg-touch{position:fixed;z-index:9998;pointer-events:none;',
      'font-family:monospace;-webkit-user-select:none;user-select:none;',
      '-webkit-tap-highlight-color:transparent;touch-action:none;}',
      '#dg-touch .b{position:absolute;pointer-events:auto;display:flex;',
      'align-items:center;justify-content:center;border:3px solid rgba(190,208,232,.55);',
      'background:rgba(23,29,42,.42);color:rgba(223,230,242,.85);',
      'font-size:13px;letter-spacing:1px;border-radius:10px;touch-action:none;}',
      '#dg-touch .b.on{background:rgba(240,200,120,.75);color:#171d2a;',
      'border-color:#f0c878;}',
      '#dg-touch .acts .b{width:78px;height:78px;border-radius:50%;}',
      // manche: um circulo so, arrastado para os lados
      '#dg-touch .stick{position:absolute;left:22px;bottom:22px;width:132px;',
      'height:132px;border-radius:50%;pointer-events:auto;touch-action:none;',
      'border:3px solid rgba(190,208,232,.45);background:rgba(23,29,42,.38);}',
      '#dg-touch .knob{position:absolute;left:50%;top:50%;width:58px;height:58px;',
      'margin:-29px 0 0 -29px;border-radius:50%;background:rgba(190,208,232,.35);',
      'border:3px solid rgba(190,208,232,.6);pointer-events:none;}',
      '#dg-touch .knob.on{background:rgba(240,200,120,.8);border-color:#f0c878;}'
    ].join('');
    document.head.appendChild(st);
  }

  function botao(papel, rotulo, css_, classe) {
    var el = document.createElement('div');
    el.className = 'b';
    el.textContent = rotulo;
    el.setAttribute('style', css_);
    el.dataset.papel = papel;

    function on(ev) {
      ev.preventDefault();
      pressed[papel] = true;
      el.classList.add('on');
    }
    function off(ev) {
      ev.preventDefault();
      pressed[papel] = false;
      el.classList.remove('on');
    }
    el.addEventListener('touchstart', on, { passive: false });
    el.addEventListener('touchend', off, { passive: false });
    el.addEventListener('touchcancel', off, { passive: false });
    el.addEventListener('mousedown', on);
    addEventListener('mouseup', off);
    // o dedo saindo do botao tem de soltar a tecla, senao ela fica presa
    el.addEventListener('touchmove', function (ev) {
      var t = ev.touches[0];
      if (!t) return;
      var r = el.getBoundingClientRect();
      var dentro = t.clientX >= r.left && t.clientX <= r.right &&
                   t.clientY >= r.top && t.clientY <= r.bottom;
      if (!dentro && pressed[papel]) off(ev);
    }, { passive: false });
    classe.appendChild(el);
    return el;
  }

  // Um circulo unico no lugar dos dois botoes de seta: o dedo arrasta para o
  // lado e a direcao sai do deslocamento. Zona morta no centro evita que um
  // toque parado ja comece a andar.
  var ZONA_MORTA = 16;      // px a partir do centro

  function manche(pai) {
    var base = document.createElement('div');
    base.className = 'stick';
    var knob = document.createElement('div');
    knob.className = 'knob';
    base.appendChild(knob);
    pai.appendChild(base);

    var ativo = false;

    function centro() {
      var r = base.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
    }

    function mover(cx) {
      var c = centro();
      var dx = cx - c.x;
      var lim = c.r - 26;
      var vis = Math.max(-lim, Math.min(lim, dx));
      knob.style.transform = 'translateX(' + vis + 'px)';
      pressed.left = dx < -ZONA_MORTA;
      pressed.right = dx > ZONA_MORTA;
      knob.classList.toggle('on', pressed.left || pressed.right);
    }

    function solta() {
      ativo = false;
      pressed.left = pressed.right = false;
      knob.style.transform = '';
      knob.classList.remove('on');
    }

    base.addEventListener('touchstart', function (e) {
      e.preventDefault(); ativo = true; mover(e.touches[0].clientX);
    }, { passive: false });
    base.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (!ativo) return;
      // o dedo pode sair do circulo enquanto arrasta; isso e' esperado
      mover(e.touches[0].clientX);
    }, { passive: false });
    base.addEventListener('touchend', function (e) { e.preventDefault(); solta(); },
                          { passive: false });
    base.addEventListener('touchcancel', function (e) { e.preventDefault(); solta(); },
                          { passive: false });
    base.addEventListener('mousedown', function (e) { ativo = true; mover(e.clientX); });
    addEventListener('mousemove', function (e) { if (ativo) mover(e.clientX); });
    addEventListener('mouseup', function () { if (ativo) solta(); });
    return base;
  }

  function montar() {
    if (root) return;
    css();
    root = document.createElement('div');
    root.id = 'dg-touch';
    var dpad = document.createElement('div'); dpad.className = 'dpad';
    var acts = document.createElement('div'); acts.className = 'acts';
    root.appendChild(dpad); root.appendChild(acts);
    document.body.appendChild(root);

    manche(dpad);
    botao('jump', 'PULO', 'right:20px;bottom:96px;', acts);
    botao('attack', 'TIRO', 'right:112px;bottom:34px;', acts);
    botao('dash', 'DESL', 'right:20px;bottom:4px;width:64px;height:44px;'
          + 'border-radius:10px;font-size:11px;', acts);
    posicionar();
    addEventListener('resize', posicionar);
  }

  // acompanha o canvas: os botoes ficam sobre a area do jogo
  function posicionar() {
    if (!root) return;
    var c = document.querySelector('canvas');
    var r = c ? c.getBoundingClientRect()
              : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    root.style.left = r.left + 'px';
    root.style.top = r.top + 'px';
    root.style.width = r.width + 'px';
    root.style.height = r.height + 'px';
  }

  function desmontar() {
    if (!root) return;
    removeEventListener('resize', posicionar);
    root.remove();
    root = null;
    pressed = {};
  }

  // ------------------------------------------------------------- injecao
  function bombear(scene) {
    var im = scene.getGame().getInputManager();
    for (var papel in G) {
      var quer = !!(root && pressed[papel]);
      var nome = game.getVariables().getFromIndex(G[papel]).getAsString();
      var cod = gdjs.evtTools.input.keysNameToCode[nome];
      if (quer && cod !== undefined) {
        im.onKeyPressed(cod, 0);         // reafirma todo quadro
        injetado[papel] = cod;
      } else if (injetado[papel] !== undefined) {
        im.onKeyReleased(injetado[papel], 0);
        delete injetado[papel];
      }
    }
  }

  gdjs.registerRuntimeSceneLoadedCallback(function (scene) {
    game = scene.getGame();
  });

  gdjs.registerRuntimeScenePostEventsCallback(function (scene) {
    if (!game) game = scene.getGame();
    if (deveMostrar(scene)) montar(); else desmontar();
    bombear(scene);
  });

  window.__dgTouch = { modo: modo, temToque: temToque,
                       estado: function () { return { pressed: pressed, injetado: injetado }; } };
})();
