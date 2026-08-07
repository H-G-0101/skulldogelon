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
             ['Tiro', 'J'], ['Deslize', 'SHIFT ESQ']]
    },
    {
      name: 'SETAS',
      note: 'Setas e a mao direita no ZXC',
      keys: { left: 'Left', right: 'Right', up: 'Up', down: 'Down',
              jump: 'z', attack: 'x', dash: 'c' },
      show: [['Andar', 'SETAS'], ['Pular', 'Z'],
             ['Tiro', 'X'], ['Deslize', 'C']]
    },
    {
      name: 'METROID',
      note: 'Setas com espaco e control, estilo Celeste',
      keys: { left: 'Left', right: 'Right', up: 'Up', down: 'Down',
              jump: 'Space', attack: 'LControl', dash: 'LShift' },
      show: [['Andar', 'SETAS'], ['Pular', 'ESPACO'],
             ['Tiro', 'CTRL ESQ'], ['Deslize', 'SHIFT ESQ']]
    },
    {
      name: 'CANHOTO',
      note: 'Setas pra acao, mao esquerda anda',
      keys: { left: 'a', right: 'd', up: 'w', down: 's',
              jump: 'Up', attack: 'Right', dash: 'Down' },
      show: [['Andar', 'A  D'], ['Pular', 'SETA CIMA'],
             ['Tiro', 'SETA DIR'], ['Deslize', 'SETA BAIXO']]
    },
    {
      name: 'CLASSICO',
      note: 'O esquema original do projeto',
      keys: { left: 'a', right: 'd', up: 'w', down: 's',
              jump: 'j', attack: 'k', dash: 'o' },
      show: [['Andar', 'A  D'], ['Pular', 'J'],
             ['Tiro', 'K'], ['Deslize', 'O']]
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
      // fica sobre a AREA DO JOGO, nao sobre a pagina inteira
      '#dg-controls{position:fixed;z-index:9999;display:flex;align-items:center;',
      'justify-content:center;background:rgba(8,11,18,.55);font-family:monospace;',
      'color:#dfe6f2;-webkit-font-smoothing:none;}',
      '#dg-controls .box{position:relative;width:86%;max-width:560px;',
      'border:3px solid #55627d;background:#171d2a;padding:16px 20px 14px;',
      'box-shadow:0 6px 0 rgba(0,0,0,.45),0 0 0 3px #0b0f18;}',
      '#dg-controls .x{position:absolute;top:-3px;right:-3px;width:34px;height:34px;',
      'border:3px solid #55627d;background:#222b3d;color:#dfe6f2;font-family:monospace;',
      'font-size:17px;line-height:1;cursor:pointer;display:flex;align-items:center;',
      'justify-content:center;padding:0;}',
      '#dg-controls .x:hover{background:#f0c878;color:#171d2a;border-color:#f0c878;}',
      '#dg-controls h2{margin:0 0 2px;font-size:20px;letter-spacing:3px;color:#f0c878;}',
      '#dg-controls .sub{font-size:11px;color:#8b97ad;margin-bottom:12px;}',
      '#dg-controls .tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;}',
      '#dg-controls .tab{padding:5px 9px;border:2px solid #3c465c;font-size:11px;',
      'letter-spacing:1px;cursor:pointer;color:#8b97ad;background:#111725;}',
      '#dg-controls .tab.on{border-color:#f0c878;color:#171d2a;background:#f0c878;}',
      '#dg-controls .tab.cur{border-color:#6fd08c;}',
      '#dg-controls .note{font-size:11px;color:#8b97ad;margin-bottom:8px;min-height:14px;}',
      '#dg-controls table{width:100%;border-collapse:collapse;font-size:13px;}',
      '#dg-controls td{padding:5px 4px;border-bottom:1px solid #28324a;}',
      '#dg-controls td.k{text-align:right;color:#f0c878;letter-spacing:1px;}',
      '#dg-controls .foot{margin-top:12px;font-size:11px;color:#8b97ad;}',
      '#dg-controls .ok{color:#6fd08c;}'
    ].join('');
    document.head.appendChild(st);
  }

  var viewing = 0;

  // acompanha o canvas: o modal mora dentro da area do jogo
  function place() {
    if (!overlay) return;
    var c = document.querySelector('canvas');
    var r = c ? c.getBoundingClientRect()
              : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    overlay.style.left = r.left + 'px';
    overlay.style.top = r.top + 'px';
    overlay.style.width = r.width + 'px';
    overlay.style.height = r.height + 'px';
  }

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
    var menuKey = (p.keys.up + '  ' + p.keys.down).toUpperCase();
    overlay.innerHTML =
      '<div class="box"><button class="x" title="Fechar">&#10005;</button>' +
      '<h2>CONTROLES</h2><div class="sub">Teclado — PC</div>' +
      '<div class="tabs">' + tabs + '</div>' +
      '<div class="note">' + p.note +
      (viewing === current ? ' <span class="ok">— em uso</span>' : '') +
      '</div><table>' + rows +
      '<tr><td>Menu</td><td class="k">SETAS ou ' + menuKey + '</td></tr>' +
      '</table><div class="foot">Clique num preset pra usar. ' +
      'Fechar no X do canto.</div></div>';

    overlay.querySelector('.x').onclick = close;
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
    overlay.onclick = function (e) { if (e.target === overlay) close(); };
    document.body.appendChild(overlay);
    place();
    render();
    addEventListener('resize', place);
    addEventListener('keydown', onKey, true);
  }

  function close() {
    if (!overlay) return;
    removeEventListener('keydown', onKey, true);
    removeEventListener('resize', place);
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

  // ------------------------------------------- setas sempre navegam o menu
  // Em presets como MODERNO o menu anda com W/S, e quem chega no jogo tenta
  // seta primeiro. A seta vira a tecla configurada e e' injetada no
  // InputManager, entao os eventos do proprio jogo respondem normalmente.
  //
  // A injecao acontece no callback de quadro, nao direto no evento do DOM:
  // assim nao depende da ordem de listeners nem do momento em que o navegador
  // dispara a tecla, e se algo limpar o teclado no meio ela se recupera
  // sozinha no quadro seguinte.
  var BRIDGE = { ArrowUp: 'up', ArrowDown: 'down', Enter: 'attack' };
  var rawDown = {};        // estado cru das setas, direto do DOM
  var injected = {};       // codigo gdjs que cada seta esta segurando

  addEventListener('keydown', function (e) {
    if (BRIDGE[e.code]) rawDown[e.code] = true;
  }, true);
  addEventListener('keyup', function (e) {
    if (BRIDGE[e.code]) rawDown[e.code] = false;
  }, true);

  function pumpBridge(scene) {
    var im = scene.getGame().getInputManager();
    var onTitle = scene.getName() === 'Title' && !overlay;
    for (var key in BRIDGE) {
      var want = onTitle && rawDown[key];
      var code = gdjs.evtTools.input.keysNameToCode[
        game.getVariables().getFromIndex(G[BRIDGE[key]]).getAsString()];
      if (want && code !== undefined) {
        im.onKeyPressed(code, 0);          // reafirma todo quadro
        injected[key] = code;
      } else if (injected[key] !== undefined) {
        im.onKeyReleased(injected[key], 0);
        delete injected[key];
      }
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
    if (game) pumpBridge(scene);
    if (overlay) {
      // Com o modal aberto o jogo nao pode reagir a nada: sem isso uma tecla
      // fica presa ao voltar, e o ESC chegaria ate os eventos do titulo.
      // releaseAllPressedKeys, e nao clearAllPressedKeys: o segundo apaga as
      // chaves da tabela e o menu do titulo para de responder depois que o
      // modal fecha. O primeiro so marca tudo como solto, que e' o correto.
      scene.getGame().getInputManager().releaseAllPressedKeys();
      return;
    }
    if (scene.getName() !== 'Title') return;

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
