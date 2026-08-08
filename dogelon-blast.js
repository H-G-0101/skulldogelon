/**
 * dogelon-blast.js — Dogelon VibeCon 2026
 *
 * Converte o ataque corpo a corpo original (HeroAttackHitbox colado no heroi)
 * em tiro a distancia, fiel ao sprite do Dogelon (que carrega um blaster).
 *
 * Nao altera o code1.js gerado pelo GDevelop: substitui duas funcoes de evento
 * e faz o resto num callback pos-eventos do gdjs.
 *
 *  - eventsList124  era o "pin" do hitbox no ponto AttackOrigin  -> neutralizada
 *  - eventsList145  era o dano melee (exigia anim "Attack")      -> neutralizada
 *
 * O dano, o voo e a colisao do projetil passam a ser tratados aqui, reusando
 * exatamente as mesmas variaveis de inimigo do jogo original (enemyHP, HitStun,
 * timer "Hit", flash vermelho), pra nao quebrar nenhuma logica existente.
 */
(function () {
  'use strict';

  // ------------------------------------------- encadeamento das duas fases
  // As duas fases rodam o MESMO codigo de eventos (o layout "Stage 2" usa
  // mangledName "Stage"). Clonar o code1.js trocando o namespace por string
  // nao funcionou: o clone acabava sendo executado tambem pela fase 1, e
  // morrer na fase 1 mandava o jogador para a fase 2.
  //
  // Com o codigo compartilhado, o destino e' decidido aqui, pela cena que
  // esta rodando no momento:
  //   fase 1  morrer -> fase 1     vencer -> fase 2
  //   fase 2  morrer -> fase 2     vencer -> tela de vitoria
  (function routeScenes() {
    var rt = gdjs.evtTools.runtimeScene;
    var original = rt.replaceScene;
    rt.replaceScene = function (scene, target, clear) {
      var from = scene.getName();
      if (from === 'Stage' && target === 'WinScreen') target = 'Stage 2';
      else if (from === 'Stage 2' && target === 'Stage') target = 'Stage 2';
      return original.call(this, scene, target, clear);
    };
  })();

  var SPEED = 1400;   // unidades/seg
  var RANGE = 1600;   // alcance maximo antes de sumir
  var ENEMIES = ['Skeleton', 'Ghost', 'Wolf', 'BossSkull'];

  // Morte e respawn: o codigo de eventos original nao toca na animacao do
  // heroi nesses momentos (ele so escurece a tela e recarrega a cena), entao
  // aqui os frames sao controlados na mao. Usar setAnimationFrame em vez de
  // deixar o animator rodar sozinho evita que os eventos, que rodam ANTES
  // deste callback, reiniciem a animacao do zero a cada frame.
  // Contagem por QUADRO, nao por tempo decorrido: se o jogo escalar o tempo
  // para zero (fade de morte, pausa), getElapsedTime devolve 0, o contador
  // nunca avanca e o respawn ficaria preso para sempre.
  var DEAD_FRAMES = 18, DEAD_EVERY = 5;     // ~18 x 5 = 90 quadros
  var RESP_FRAMES = 21, RESP_EVERY = 4;     // ~21 x 4 = 84 quadros
  var RESP_CAP = 90;                        // trava de seguranca, em quadros

  // ------------------------------------------- inimigo preso contra parede
  // Os marcadores Left/Right so cobrem as pontas das plataformas. Quando um
  // degrau sobe no meio do caminho, o inimigo anda contra a face vertical e
  // fica patinando ali para sempre.
  //
  // Em vez de tentar adivinhar a geometria, aqui a deteccao e' por resultado:
  // se ele deveria estar andando e o X praticamente nao muda por meio segundo,
  // esta preso — e a direcao se inverte. Funciona com parede, com quina e com
  // qualquer formato de terreno, sem depender de marcador nenhum.
  // Medir quadro a quadro nao serve: o esqueleto anda a 2,48 unidades por
  // quadro e o limiar anterior era 2 — qualquer titubeada contava como
  // "preso", ele virava, andava de volta, virava de novo. Era o passo pra
  // frente e pra tras.
  //
  // Agora a medicao e' por JANELA: guarda-se a posicao no inicio e, ao fim da
  // janela, ve-se o quanto ele realmente avancou. Quem anda percorre dezenas
  // de unidades; quem esta contra a parede fica na casa de zero.
  // Janelas longas de proposito. A virada nos marcadores Left/Right dura uma
  // fracao de segundo; se a janela for curta, meu giro cai junto com o do
  // marcador, os dois se somam e o inimigo sai andando pela borda — foi assim
  // que a caveira caiu no precipicio da fase 1.
  var JANELA = { Skeleton: 120, Wolf: 240 };  // quadros (~2 s e ~4 s)
  var AVANCO_MIN = 48;                        // unidades no periodo

  // O inimigo esta em contato com um marcador de virada do proprio jogo?
  function noMarcador(scene, e) {
    var listas = ['Left', 'Right'];
    for (var l = 0; l < listas.length; l++) {
      var ms = scene.getObjects(listas[l]);
      for (var i = 0; i < ms.length; i++) {
        if (gdjs.RuntimeObject.collisionTest(e, ms[i], false)) return true;
      }
    }
    return false;
  }

  function destravar(scene) {
    for (var nome in JANELA) {
      var objs = scene.getObjects(nome);
      for (var i = 0; i < objs.length; i++) {
        var e = objs[i];
        var x = e.getX();

        var pb = e.getBehavior('PlatformerObject');
        if (pb && !pb.isOnFloor()) {          // no ar ele esta caindo, nao preso
          e.__ancora = x; e.__janela = 0;
          continue;
        }

        // Encostado num marcador, normalmente quem manda e' o jogo: interferir
        // soma dois giros e joga o inimigo fora da plataforma. MAS se ele fica
        // parado ali por muito tempo, o marcador claramente nao esta
        // resolvendo — ele esta prensado entre o marcador e uma parede. Nesse
        // caso o desempate vem daqui, depois do dobro da janela.
        if (noMarcador(scene, e)) {
          e.__noMarc = (e.__noMarc || 0) + 1;
          if (e.__noMarc < JANELA[nome] * 2) {
            e.__ancora = x; e.__janela = 0;
            continue;
          }
        } else {
          e.__noMarc = 0;
        }
        if (e.__ancora === undefined) { e.__ancora = x; e.__janela = 0; continue; }

        e.__janela++;
        if (e.__janela < JANELA[nome]) continue;

        var avancou = Math.abs(x - e.__ancora);
        e.__ancora = x;
        e.__janela = 0;
        if (avancou >= AVANCO_MIN) { e.__noMarc = 0; continue; }   // andando: nao mexer
        e.__noMarc = 0;

        var v = e.getVariables();
        if (v.has('Direction')) {
          // O esqueleto anda por esta variavel. O espelhamento precisa ser
          // AJUSTADO ao novo rumo, nao alternado: alternar dessincroniza, e nao
          // mexer deixa ele andando de costas depois de virar.
          var dir = v.get('Direction').getAsString();
          var novo = (dir === 'Left') ? 'Right' : 'Left';
          v.get('Direction').setString(novo);
          var fe = e.getBehavior('Flippable');
          // Convencao do projeto, medida em jogo: Direction "Right" anda junto
          // com flipX LIGADO (a arte nasce virada para a esquerda).
          if (fe) fe.flipX(novo === 'Right');
          e.setX(x + (novo === 'Right' ? recuo : -recuo));
        } else {
          var fb = e.getBehavior('Flippable');
          if (fb) {
            fb.flipX(!fb.isFlippedX());
            e.setX(x + (fb.isFlippedX() ? recuo : -recuo));
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------- helpers
  // Fase 1 e fase 2 rodam o mesmo codigo de eventos (code1/code4), entao tudo
  // aqui vale para as duas.
  function isStage(scene) {
    var n = scene.getName();
    return n === 'Stage' || n === 'Stage 2';
  }

  function heroOf(scene) {
    var h = scene.getObjects('Hero');
    return h && h.length ? h[0] : null;
  }

  function damage(scene, enemy, dmg) {
    enemy.returnVariable(enemy.getVariables().get('enemyHP')).sub(dmg);
    enemy.resetTimer('Hit');
    enemy.returnVariable(enemy.getVariables().get('HitStun')).setNumber(1);
    enemy.setColor('255;0;0');
  }

  function spawnBlast(scene, hero) {
    var b = scene.createObject('HeroAttackHitbox');
    if (!b) return;
    // createObject nasce com zOrder 0, e o LevelMap fica em z=1: sem isso o
    // tiro passa POR TRAS das paredes e so reaparece depois do cenario.
    // (o codigo original faz o mesmo com o EnemyDeathFire, copiando o z do
    // inimigo — aqui o valor e' calculado uma vez ao carregar a cena.)
    b.setZOrder(scene.__blastZ || 10100);
    var flipped = hero.getBehavior('Flippable').isFlippedX();
    b.setPosition(hero.getPointX('AttackOrigin'), hero.getPointY('AttackOrigin'));
    b.setAnimationName('BlastFly');
    b.flipX(flipped);
    b.hide(false);
    b.setOpacity(255);
    b.__blast = {
      vx: flipped ? -SPEED : SPEED,
      travelled: 0,
      dead: false
    };
  }

  function killBlast(b) {
    b.__blast.dead = true;
    b.__blast.vx = 0;
    b.setAnimationName('BlastHit');
  }

  // -------------------------------------------------------- desliga o melee
  function neutralise() {
    if (!window.gdjs || !gdjs.StageCode) return false;
    gdjs.StageCode.eventsList124 = function () { /* pin removido */ };
    gdjs.StageCode.eventsList145 = function () { /* dano melee removido */ };
    return true;
  }

  gdjs.registerRuntimeSceneLoadedCallback(function (scene) {
    if (!isStage(scene)) return;
    neutralise();
    // Toda entrada na fase (inicio ou apos morrer) comeca com o Dogelon
    // se materializando no feixe de luz.
    scene.__respawnT = 0;
    scene.__respawning = true;
    scene.__deadT = 0;
    // z do projetil: acima de tudo que existe na camada base (mapa, heroi,
    // inimigos, chefe), pra a bala nunca sumir atras do cenario.
    var maxZ = 0;
    ['LevelMap', 'Hero', 'HeroHitbox', 'HeroAttackHitbox', 'Skeleton',
     'Ghost', 'Wolf', 'BossSkull', 'EnemyDeathFire'].forEach(function (n) {
      scene.getObjects(n).forEach(function (o) {
        if (o.getLayer() === '' && o.getZOrder() > maxZ) maxZ = o.getZOrder();
      });
    });
    scene.__blastZ = maxZ + 10;
    // A instancia colocada no editor vira apenas molde: fica escondida e fora
    // do caminho, senao ela encostaria nos inimigos parada no ar.
    var pool = scene.getObjects('HeroAttackHitbox');
    for (var i = 0; i < pool.length; i++) {
      pool[i].hide();
      pool[i].setPosition(-99999, -99999);
      pool[i].__blast = { vx: 0, travelled: 0, dead: true, template: true };
    }
  });

  // Toca uma animacao quadro a quadro, sem depender do animator interno.
  function drive(hero, name, ticks, every, count) {
    if (hero.getBehavior('Animation').getAnimationName() !== name) {
      hero.setAnimationName(name);
    }
    var idx = Math.floor(ticks / every);
    if (idx > count - 1) idx = count - 1;
    hero.setAnimationFrame(idx);
    return idx >= count - 1;
  }

  // ------------------------------------------------------------- loop/frame
  gdjs.registerRuntimeScenePostEventsCallback(function (scene) {
    if (!isStage(scene)) return;

    destravar(scene);

    var hero = heroOf(scene);
    var dt = scene.getElapsedTime() / 1000;

    // 0. morte e respawn (tem prioridade sobre a animacao normal)
    if (hero) {
      var fsm = hero.getVariables().getFromIndex(0).getAsString();

      if (fsm === 'Death') {
        scene.__respawning = false;
        scene.__deadT = (scene.__deadT || 0) + 1;
        drive(hero, 'Dead', scene.__deadT, DEAD_EVERY, DEAD_FRAMES);
        return;                       // o heroi esta morto; nada a fazer
      }
      scene.__deadT = 0;

      if (scene.__respawning) {
        // O feixe de respawn e' PURAMENTE visual e dura so a queda ate o chao.
        // Versoes anteriores prendiam a animacao por tempo e travavam o
        // jogador: sem controle, sem tiro, so as pernas paradas. Agora ele sai
        // de cena por tres caminhos independentes — o que vier primeiro.
        var hb = scene.getObjects('HeroHitbox')[0];
        var noChao = hb && hb.getBehavior('PlatformerObject').isOnFloor();
        var agiu = (fsm !== 'Idle' && fsm !== 'IDLE' && fsm !== 'Init' &&
                    fsm !== 'InitState' && fsm !== 'Fall' && fsm !== 'Air');
        scene.__respawnT = (scene.__respawnT || 0) + 1;

        if (agiu || noChao || scene.__respawnT > RESP_CAP) {
          scene.__respawning = false;   // 1) jogador agiu  2) pousou  3) trava
        } else {
          drive(hero, 'Respawn', scene.__respawnT, RESP_EVERY, RESP_FRAMES);
        }
        // Sem "return": prender o fluxo aqui bloqueava o tiro, e qualquer
        // travamento do contador congelava o jogador de vez.
      }
    }

    // 1. dispara ao entrar na animacao "Attack"
    if (hero) {
      var anim = hero.getBehavior('Animation').getAnimationName();
      if (anim === 'Attack' && hero.__prevAnim !== 'Attack') spawnBlast(scene, hero);
      hero.__prevAnim = anim;

      // TIRO NO AR: a maquina de estados do heroi nao entra em "Attack" com ele
      // fora do chao, entao a animacao nunca troca e o disparo acima nao
      // acontece. No ar o tiro e' criado direto daqui, com um intervalo minimo
      // para nao virar metralhadora.
      var fsmAr = hero.getVariables().getFromIndex(0).getAsString();
      var noAr = (fsmAr === 'Jump' || fsmAr === 'Fall' || fsmAr === 'Air');
      var tecla = scene.getGame().getVariables().getFromIndex(12).getAsString();
      var apertado = gdjs.evtTools.input.isKeyPressed(scene, tecla);
      scene.__arCd = Math.max(0, (scene.__arCd || 0) - 1);
      if (noAr && apertado && !scene.__arApertado && scene.__arCd === 0) {
        spawnBlast(scene, hero);
        scene.__arCd = 18;                  // ~0,3 s entre tiros aereos
      }
      scene.__arApertado = apertado;
    }

    // 2. move os projeteis, testa colisao e limpa
    var dmg = hero
      ? gdjs.RuntimeObject.getVariableNumber(hero.getVariables().getFromIndex(2))
      : 20;
    var shots = scene.getObjects('HeroAttackHitbox');
    var platforms = scene.getObjects('Platform');

    for (var i = 0; i < shots.length; i++) {
      var b = shots[i];
      if (!b.__blast || b.__blast.template) continue;
      var st = b.__blast;

      if (st.dead) {
        if (b.hasAnimationEnded()) b.deleteFromScene(scene);
        continue;
      }

      var step = st.vx * dt;
      b.setX(b.getX() + step);
      st.travelled += Math.abs(step);

      // acertou inimigo?
      var hit = false;
      for (var e = 0; e < ENEMIES.length && !hit; e++) {
        var list = scene.getObjects(ENEMIES[e]);
        for (var k = 0; k < list.length; k++) {
          if (gdjs.RuntimeObject.collisionTest(b, list[k], false)) {
            damage(scene, list[k], dmg);
            hit = true;
            break;
          }
        }
      }

      // bateu na parede?
      if (!hit) {
        for (var p = 0; p < platforms.length; p++) {
          if (gdjs.RuntimeObject.collisionTest(b, platforms[p], false)) { hit = true; break; }
        }
      }

      if (hit) killBlast(b);
      else if (st.travelled > RANGE) b.deleteFromScene(scene);
    }
  });
})();
