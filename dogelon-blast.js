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

  var SPEED = 1400;   // unidades/seg do projetil
  var RANGE = 1600;   // alcance maximo antes de sumir
  var ENEMIES = ['Skeleton', 'Ghost', 'Wolf', 'BossSkull'];

  // Morte e respawn contados por QUADRO, nao por tempo decorrido: o jogo escala
  // o tempo durante o fade de morte, e com escala zero um contador por tempo
  // trava para sempre — foi assim que o jogador ficava congelado ao renascer.
  var DEAD_FRAMES = 18, DEAD_EVERY = 5;
  var RESP_FRAMES = 21, RESP_EVERY = 4;
  var RESP_CAP = 90;                        // trava de seguranca, em quadros

  // Uma fase so: nao ha roteamento de cenas nem clone de Stage.
  //
  // O destravar automatico de inimigos tambem foi REMOVIDO. Ele existia para
  // compensar a fase gerada por script, que tinha paredes sem marcador de
  // virada. Com os marcadores colocados a mao no editor ele fica desnecessario
  // — e era ele que, ao virar o inimigo, o empurrava para dentro do abismo.

  // ---------------------------------------------------------------- helpers
  // Fase 1 e fase 2 rodam o mesmo codigo de eventos (code1/code4), entao tudo
  // aqui vale para as duas.
  function isStage(scene) {
    return scene.getName() === 'Stage';
  }

  function heroOf(scene) {
    var h = scene.getObjects('Hero');
    return h && h.length ? h[0] : null;
  }

  // Quantos quadros o inimigo fica vermelho ao levar tiro (so o piscar).
  var FLASH = 10;

  function damage(scene, enemy, dmg) {
    enemy.returnVariable(enemy.getVariables().get('enemyHP')).sub(dmg);

    // NAO mexer em HitStun. Essa variavel e' o que trava o movimento do
    // inimigo, e o codigo original so a usava no ataque corpo a corpo — onde
    // era preciso chegar perto para acertar, entao o congelamento era um
    // troco justo. Com tiro a distancia dava para prender o esqueleto parado
    // de longe e matar sem risco. Agora ele leva o dano e SEGUE andando.
    enemy.setColor('255;0;0');
    enemy.__flash = FLASH;
  }

  // Devolve a cor normal depois do piscar. Antes quem limpava era a logica de
  // HitStun do jogo; sem ela, o inimigo ficaria vermelho para sempre.
  function limparFlash(scene) {
    var listas = ['Skeleton', 'Ghost', 'Wolf', 'BossSkull'];
    for (var l = 0; l < listas.length; l++) {
      var objs = scene.getObjects(listas[l]);
      for (var i = 0; i < objs.length; i++) {
        var e = objs[i];
        if (!e.__flash) continue;
        e.__flash--;
        if (e.__flash === 0) e.setColor('255;255;255');
      }
    }
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


    limparFlash(scene);

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
