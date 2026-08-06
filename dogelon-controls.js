/**
 * dogelon-controls.js — tela de CONTROLES
 *
 * O menu do titulo e' orientado a dados (variaveis ID/Up/Down/Action por
 * instancia). O item novo tem Action="Controls", que nao bate com nenhum ramo
 * do code0.js gerado — o jogo ignora, e quem responde e' este arquivo.
 *
 * Trocar de preset e' so reescrever as variaveis globais keyboard*: todo o
 * codigo de eventos ja le as teclas de la, entao nada mais precisa mudar.
 * A escolha fica no localStorage e e' reaplicada ao carregar.
 *
 * Nomes de tecla validos vem de gdjs.evtTools.input.keysNameToCode
 * (atencao: e' "Return", nao "Enter", e "LShift"/"RShift", nunca "Shift").
 */
(function () {
  'use strict';

  var STORE = 'dogelonmars.controls';

  // indices das variaveis globais, na ordem em que o projeto as declara
  var G = { left: 7, right: 8, up: 9, down: 10, jump: 11, attack: 12, dash: 13 };

  var PRESETS = [
    {
      name: 'MODERNO',
      note: 'WASD pra andar, espaco pra pular',
      keys: { left: 'a', right: 'd', up: 'w', down: 's',
              jump: 'Space', attack: 'j', dash: 'LShift' },
      show: [['Andar', 'A  D'], ['Pular', 'ESPACO'],
             ['Tiro', 'J'], ['Deslize', 'SHIFT ESQ'], ['Menu', 'W  S  +  J']]
    },
    {
      name: 'SETAS',
      note: 'Setas e a mao direita no ZXC',
      keys: { left: 'Left', right: 'Right', up: 'Up', down: 'Down',
              jump: 'z', attack: 'x', dash: 'c' },
      show: [['Andar', 'SETAS'], ['Pular', 'Z'],
             ['Tiro', 'X'], ['Deslize', 'C'], ['Menu', 'SETAS  +  X']]
    },
    {
      name: 'METROID',
      note: 'Setas com espaco e control, estilo Celeste',
      keys: { left: 'Left', right: 'Right', up: 'Up', down: 'Down',
              jump: 'Space', attack: 'LControl', dash: 'LShift' },
      show: [['Andar', 'SETAS'], ['Pular', 'ESPACO'],
             ['Tiro', 'CTRL ESQ'], ['Deslize', 'SHIFT ESQ'],
             ['Menu', 'SETAS  +  CTRL']]
    },
    {
      name: 'CANHOTO',
      note: 'Setas pra acao, mao esquerda anda',
      keys: { left: 'a', right: 'd', up: 'w', down: 's',
              jump: 'Up', attack: 'Right', dash: 'Down' },
      show: [['Andar', 'A  D'], ['Pular', 'SETA CIMA'],
             ['Tiro', 'SETA DIR'], ['Deslize', 'SETA BAIXO'],
             ['Menu', 'W  S  +  SETA DIR']]
    },
    {
      name: 'CLASSICO',
      note: 'O esquema original do projeto',
      keys: { left: 'a', right: 'd', up: 'w', down: 's',
              jump: 'j', attack: 'k', dash: 'o' },
      show: [['Andar', 'A  D'], ['Pular', 'J'],
             ['Tiro', 'K'], ['Deslize', 'O'], ['Menu', 'W  S  +  K']]
    }
  ];

  var current = 0;
  var overlay = null;
  var game = null;

  // -------------------------------------------------------------- aplicar
  function apply(idx) {
    if (!game) return;
    var p = PRESETS[idx];
    var vars = game.getVariables();
    for (var role in G) {
      if (p.keys[role]) vars.getFromIndex(G[role]).setString(p.keys[role]);
    }
    current = idx;
    try { localStorage.setItem(STORE, String(idx)); } catch (e) { /* ok */ }
  }

  function restore() {
    var v = 0;
    try { v = parseInt(localStorage.getItem(STORE) || '0', 10); } catch (e) { v = 0; }
    if (!(v >= 0 && v < PRESETS.length)) v = 0;
    apply(v);
  }

  // --------------------------------------------------------------- tela
  function css() {
    if (document.getElementById('dg-controls-css')) return;
    var st = document.createElement('style');
    st.id = 'dg-controls-css';
    st.textContent = [
      '#dg-controls{position:fixed;inset:0;z-index:9999;display:flex;',
      'align-items:center;justify-content:center;background:rgba(10,13,20,.92);',
      'font-family:monospace;color:#dfe6f2;-webkit-font-smoothing:none;}',
      '#dg-controls .box{width:min(760px,92vw);border:3px solid #55627d;',
      'background:#171d2a;padding:22px 26px 18px;box-shadow:0 0 0 3px #0b0f18;}',
      '#dg-controls h2{margin:0 0 4px;font-size:26px;letter-spacing:3px;color:#f0c878;}',
      '#dg-controls .sub{font-size:12px;color:#8b97ad;margin-bottom:16px;}',
      '#dg-controls .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}',
      '#dg-controls .tab{padding:6px 12px;border:2px solid #3c465c;font-size:13px;',
      'letter-spacing:1px;cursor:pointer;color:#8b97ad;background:#111725;}',
      '#dg-controls .tab.on{border-color:#f0c878;color:#171d2a;background:#f0c878;}',
      '#dg-controls .tab.cur{border-color:#6fd08c;}',
      '#dg-controls .note{font-size:12px;color:#8b97ad;margin-bottom:12px;min-height:16px;}',
      '#dg-controls table{width:100%;border-collapse:collapse;font-size:15px;}',
      '#dg-controls td{padding:7px 4px;border-bottom:1px solid #28324a;}',
      '#dg-controls td.k{text-align:right;color:#f0c878;letter-spacing:1px;}',
      '#dg-controls .foot{margin-top:16px;font-size:12px;color:#8b97ad;',
      'display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;}',
      '#dg-controls .ok{color:#6fd08c;}'
    ].join('');
    document.head.appendChild(st);
  }

  var viewing = 0;

  function render() {
    var p = PRESETS[viewing];
    var tabs = PRESETS.map(function (q, i) {
      var cls = 'tab' + (i === viewing ? ' on' : '') +
                (i === current && i !== viewing ? ' cur' : '');
      return '<div class="' + cls + '" data-i="' + i + '">' + q.name + '</div>';
    }).join('');
    var rows = p.show.map(function (r) {
      return '<tr><td>' + r[0] + '</td><td class="k">' + r[1] + '</td></tr>';
    }).join('');
    overlay.innerHTML =
      '<div class="box"><h2>CONTROLES</h2>' +
      '<div class="sub">Teclado — PC</div>' +
      '<div class="tabs">' + tabs + '</div>' +
      '<div class="note">' + p.note +
      (viewing === current ? ' <span class="ok">— em uso</span>' : '') +
      '</div><table>' + rows + '</table>' +
      '<div class="foot"><span>&#8592; &#8594; ou clique: ver preset</span>' +
      '<span>ENTER: usar este</span><span>ESC: voltar</span></div></div>';
    Array.prototype.forEach.call(overlay.querySelectorAll('.tab'), function (el) {
      el.onclick = function () { viewing = +el.dataset.i; apply(viewing); render(); };
    });
  }

  function open() {
    if (overlay) return;
    css();
    viewing = current;
    overlay = document.createElement('div');
    overlay.id = 'dg-controls';
    document.body.appendChild(overlay);
    render();
    document.addEventListener('keydown', onKey, true);
  }

  function close() {
    if (!overlay) return;
    document.removeEventListener('keydown', onKey, true);
    overlay.remove();
    overlay = null;
  }

  function onKey(e) {
    // enquanto a tela esta aberta o jogo nao deve receber nada
    e.stopPropagation();
    e.preventDefault();
    if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
      viewing = (viewing + 1) % PRESETS.length; render();
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
      viewing = (viewing - 1 + PRESETS.length) % PRESETS.length; render();
    } else if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') {
      apply(viewing); render();
    } else if (e.code === 'Escape' || e.code === 'Backspace') {
      close();
    }
  }

  // ----------------------------------------------------------- ligacao
  gdjs.registerRuntimeSceneLoadedCallback(function (scene) {
    game = scene.getGame();
    if (!game.__dgControlsRestored) {
      game.__dgControlsRestored = true;
      restore();
    }
    if (scene.getName() !== 'Title') close();
  });

  var wasDown = false;

  gdjs.registerRuntimeScenePostEventsCallback(function (scene) {
    if (scene.getName() !== 'Title') return;
    if (overlay) return;

    // Qual item esta selecionado agora. O item de CONTROLS e' o antigo
    // BitmapMenuExit reaproveitado, entao ele e' localizado pela Action e
    // nao pelo nome do objeto.
    var id = scene.getScene().getVariables().getFromIndex(1)
             .getChild('ID').getAsString();
    var mine = null;
    var names = ['BitmapMenuExit', 'BitmapMenuCredits', 'BitmapMenuStart'];
    for (var n = 0; n < names.length && mine === null; n++) {
      var list = scene.getObjects(names[n]);
      for (var o = 0; o < list.length; o++) {
        if (list[o].getVariables().get('Action').getAsString() === 'Controls') {
          mine = list[o].getVariables().get('ID').getAsString();
          break;
        }
      }
    }
    if (mine === null) return;

    var key = game.getVariables().getFromIndex(G.attack).getAsString();
    var down = gdjs.evtTools.input.isKeyPressed(scene, key);
    var justPressed = down && !wasDown;      // debounce proprio
    wasDown = down;

    if (justPressed && id === mine) open();
  });
})();
