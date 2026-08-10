gdjs.WinScreenCode = {};
gdjs.WinScreenCode.localVariables = [];
gdjs.WinScreenCode.idToCallbackMap = new Map();
gdjs.WinScreenCode.forEachCount0_3 = 0;

gdjs.WinScreenCode.forEachCount1_3 = 0;

gdjs.WinScreenCode.forEachCount2_3 = 0;

gdjs.WinScreenCode.forEachIndex3 = 0;

gdjs.WinScreenCode.forEachObjects3 = [];

gdjs.WinScreenCode.forEachTotalCount3 = 0;

gdjs.WinScreenCode.GDCongratsObjects1= [];
gdjs.WinScreenCode.GDCongratsObjects2= [];
gdjs.WinScreenCode.GDCongratsObjects3= [];
gdjs.WinScreenCode.GDWinTimeObjects1= [];
gdjs.WinScreenCode.GDWinTimeObjects2= [];
gdjs.WinScreenCode.GDWinTimeObjects3= [];
gdjs.WinScreenCode.GDNextStepsObjects1= [];
gdjs.WinScreenCode.GDNextStepsObjects2= [];
gdjs.WinScreenCode.GDNextStepsObjects3= [];
gdjs.WinScreenCode.GDFadeObjectObjects1= [];
gdjs.WinScreenCode.GDFadeObjectObjects2= [];
gdjs.WinScreenCode.GDFadeObjectObjects3= [];
gdjs.WinScreenCode.GDNewSpriteObjects1= [];
gdjs.WinScreenCode.GDNewSpriteObjects2= [];
gdjs.WinScreenCode.GDNewSpriteObjects3= [];
gdjs.WinScreenCode.GDNewSprite2Objects1= [];
gdjs.WinScreenCode.GDNewSprite2Objects2= [];
gdjs.WinScreenCode.GDNewSprite2Objects3= [];
gdjs.WinScreenCode.GDNewSprite3Objects1= [];
gdjs.WinScreenCode.GDNewSprite3Objects2= [];
gdjs.WinScreenCode.GDNewSprite3Objects3= [];


gdjs.WinScreenCode.eventsList0 = function(runtimeScene) {

};gdjs.WinScreenCode.eventsList1 = function(runtimeScene) {

{

gdjs.copyArray(runtimeScene.getObjects("Congrats"), gdjs.WinScreenCode.GDCongratsObjects2);
gdjs.copyArray(runtimeScene.getObjects("NextSteps"), gdjs.WinScreenCode.GDNextStepsObjects2);
gdjs.copyArray(runtimeScene.getObjects("WinTime"), gdjs.WinScreenCode.GDWinTimeObjects2);

gdjs.WinScreenCode.forEachTotalCount3 = 0;
gdjs.WinScreenCode.forEachObjects3.length = 0;
gdjs.WinScreenCode.forEachCount0_3 = gdjs.WinScreenCode.GDCongratsObjects2.length;
gdjs.WinScreenCode.forEachTotalCount3 += gdjs.WinScreenCode.forEachCount0_3;
gdjs.WinScreenCode.forEachObjects3.push.apply(gdjs.WinScreenCode.forEachObjects3,gdjs.WinScreenCode.GDCongratsObjects2);
gdjs.WinScreenCode.forEachCount1_3 = gdjs.WinScreenCode.GDWinTimeObjects2.length;
gdjs.WinScreenCode.forEachTotalCount3 += gdjs.WinScreenCode.forEachCount1_3;
gdjs.WinScreenCode.forEachObjects3.push.apply(gdjs.WinScreenCode.forEachObjects3,gdjs.WinScreenCode.GDWinTimeObjects2);
gdjs.WinScreenCode.forEachCount2_3 = gdjs.WinScreenCode.GDNextStepsObjects2.length;
gdjs.WinScreenCode.forEachTotalCount3 += gdjs.WinScreenCode.forEachCount2_3;
gdjs.WinScreenCode.forEachObjects3.push.apply(gdjs.WinScreenCode.forEachObjects3,gdjs.WinScreenCode.GDNextStepsObjects2);
for (gdjs.WinScreenCode.forEachIndex3 = 0;gdjs.WinScreenCode.forEachIndex3 < gdjs.WinScreenCode.forEachTotalCount3;++gdjs.WinScreenCode.forEachIndex3) {
gdjs.WinScreenCode.GDCongratsObjects3.length = 0;

gdjs.WinScreenCode.GDNextStepsObjects3.length = 0;

gdjs.WinScreenCode.GDWinTimeObjects3.length = 0;


if (gdjs.WinScreenCode.forEachIndex3 < gdjs.WinScreenCode.forEachCount0_3) {
    gdjs.WinScreenCode.GDCongratsObjects3.push(gdjs.WinScreenCode.forEachObjects3[gdjs.WinScreenCode.forEachIndex3]);
}
else if (gdjs.WinScreenCode.forEachIndex3 < gdjs.WinScreenCode.forEachCount0_3+gdjs.WinScreenCode.forEachCount1_3) {
    gdjs.WinScreenCode.GDWinTimeObjects3.push(gdjs.WinScreenCode.forEachObjects3[gdjs.WinScreenCode.forEachIndex3]);
}
else if (gdjs.WinScreenCode.forEachIndex3 < gdjs.WinScreenCode.forEachCount0_3+gdjs.WinScreenCode.forEachCount1_3+gdjs.WinScreenCode.forEachCount2_3) {
    gdjs.WinScreenCode.GDNextStepsObjects3.push(gdjs.WinScreenCode.forEachObjects3[gdjs.WinScreenCode.forEachIndex3]);
}
let isConditionTrue_0 = false;
if (true) {
{for(var i = 0, len = gdjs.WinScreenCode.GDCongratsObjects3.length ;i < len;++i) {
    gdjs.WinScreenCode.GDCongratsObjects3[i].setX(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0) - ((gdjs.WinScreenCode.GDCongratsObjects3[i].getWidth()) / 2));
}
for(var i = 0, len = gdjs.WinScreenCode.GDWinTimeObjects3.length ;i < len;++i) {
    gdjs.WinScreenCode.GDWinTimeObjects3[i].setX(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0) - ((gdjs.WinScreenCode.GDWinTimeObjects3[i].getWidth()) / 2));
}
for(var i = 0, len = gdjs.WinScreenCode.GDNextStepsObjects3.length ;i < len;++i) {
    gdjs.WinScreenCode.GDNextStepsObjects3[i].setX(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0) - ((gdjs.WinScreenCode.GDNextStepsObjects3[i].getWidth()) / 2));
}
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("FadeObject"), gdjs.WinScreenCode.GDFadeObjectObjects2);
{for(var i = 0, len = gdjs.WinScreenCode.GDFadeObjectObjects2.length ;i < len;++i) {
    gdjs.WinScreenCode.GDFadeObjectObjects2[i].setPosition(0,0);
}
}
{for(var i = 0, len = gdjs.WinScreenCode.GDFadeObjectObjects2.length ;i < len;++i) {
    gdjs.WinScreenCode.GDFadeObjectObjects2[i].getBehavior("Resizable").setHeight(gdjs.evtTools.camera.getCameraHeight(runtimeScene, "", 0));
}
}
{for(var i = 0, len = gdjs.WinScreenCode.GDFadeObjectObjects2.length ;i < len;++i) {
    gdjs.WinScreenCode.GDFadeObjectObjects2[i].getBehavior("Resizable").setWidth(gdjs.evtTools.camera.getCameraWidth(runtimeScene, "", 0));
}
}
{for(var i = 0, len = gdjs.WinScreenCode.GDFadeObjectObjects2.length ;i < len;++i) {
    gdjs.WinScreenCode.GDFadeObjectObjects2[i].getBehavior("Tween").addObjectOpacityTween("SceneFadeIn", 0, "linear", 500, false);
}
}
}

}


{


let isConditionTrue_0 = false;
{
}

}


};gdjs.WinScreenCode.eventsList2 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {

{ //Subevents
gdjs.WinScreenCode.eventsList1(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("FadeObject"), gdjs.WinScreenCode.GDFadeObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.WinScreenCode.GDFadeObjectObjects1.length;i<l;++i) {
    if ( gdjs.WinScreenCode.GDFadeObjectObjects1[i].getBehavior("Tween").exists("SceneFadeIn") ) {
        isConditionTrue_0 = true;
        gdjs.WinScreenCode.GDFadeObjectObjects1[k] = gdjs.WinScreenCode.GDFadeObjectObjects1[i];
        ++k;
    }
}
gdjs.WinScreenCode.GDFadeObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.WinScreenCode.GDFadeObjectObjects1.length;i<l;++i) {
    if ( gdjs.WinScreenCode.GDFadeObjectObjects1[i].getBehavior("Tween").hasFinished("SceneFadeIn") ) {
        isConditionTrue_0 = true;
        gdjs.WinScreenCode.GDFadeObjectObjects1[k] = gdjs.WinScreenCode.GDFadeObjectObjects1[i];
        ++k;
    }
}
gdjs.WinScreenCode.GDFadeObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(13270444);
}
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.playSoundOnChannel(runtimeScene, "Johnathan_So-Victory.ogg", 80, false, 100, 1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
isConditionTrue_1 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "m");
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
isConditionTrue_1 = gdjs.evtsExt__Gamepads__C_Button_pressed.func(runtimeScene, 1, "Y", null);
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
}
}
{
}
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(13272692);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Title", false);
}
}

}


};

gdjs.WinScreenCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.WinScreenCode.GDCongratsObjects1.length = 0;
gdjs.WinScreenCode.GDCongratsObjects2.length = 0;
gdjs.WinScreenCode.GDCongratsObjects3.length = 0;
gdjs.WinScreenCode.GDWinTimeObjects1.length = 0;
gdjs.WinScreenCode.GDWinTimeObjects2.length = 0;
gdjs.WinScreenCode.GDWinTimeObjects3.length = 0;
gdjs.WinScreenCode.GDNextStepsObjects1.length = 0;
gdjs.WinScreenCode.GDNextStepsObjects2.length = 0;
gdjs.WinScreenCode.GDNextStepsObjects3.length = 0;
gdjs.WinScreenCode.GDFadeObjectObjects1.length = 0;
gdjs.WinScreenCode.GDFadeObjectObjects2.length = 0;
gdjs.WinScreenCode.GDFadeObjectObjects3.length = 0;
gdjs.WinScreenCode.GDNewSpriteObjects1.length = 0;
gdjs.WinScreenCode.GDNewSpriteObjects2.length = 0;
gdjs.WinScreenCode.GDNewSpriteObjects3.length = 0;
gdjs.WinScreenCode.GDNewSprite2Objects1.length = 0;
gdjs.WinScreenCode.GDNewSprite2Objects2.length = 0;
gdjs.WinScreenCode.GDNewSprite2Objects3.length = 0;
gdjs.WinScreenCode.GDNewSprite3Objects1.length = 0;
gdjs.WinScreenCode.GDNewSprite3Objects2.length = 0;
gdjs.WinScreenCode.GDNewSprite3Objects3.length = 0;

gdjs.WinScreenCode.eventsList2(runtimeScene);
gdjs.WinScreenCode.GDCongratsObjects1.length = 0;
gdjs.WinScreenCode.GDCongratsObjects2.length = 0;
gdjs.WinScreenCode.GDCongratsObjects3.length = 0;
gdjs.WinScreenCode.GDWinTimeObjects1.length = 0;
gdjs.WinScreenCode.GDWinTimeObjects2.length = 0;
gdjs.WinScreenCode.GDWinTimeObjects3.length = 0;
gdjs.WinScreenCode.GDNextStepsObjects1.length = 0;
gdjs.WinScreenCode.GDNextStepsObjects2.length = 0;
gdjs.WinScreenCode.GDNextStepsObjects3.length = 0;
gdjs.WinScreenCode.GDFadeObjectObjects1.length = 0;
gdjs.WinScreenCode.GDFadeObjectObjects2.length = 0;
gdjs.WinScreenCode.GDFadeObjectObjects3.length = 0;
gdjs.WinScreenCode.GDNewSpriteObjects1.length = 0;
gdjs.WinScreenCode.GDNewSpriteObjects2.length = 0;
gdjs.WinScreenCode.GDNewSpriteObjects3.length = 0;
gdjs.WinScreenCode.GDNewSprite2Objects1.length = 0;
gdjs.WinScreenCode.GDNewSprite2Objects2.length = 0;
gdjs.WinScreenCode.GDNewSprite2Objects3.length = 0;
gdjs.WinScreenCode.GDNewSprite3Objects1.length = 0;
gdjs.WinScreenCode.GDNewSprite3Objects2.length = 0;
gdjs.WinScreenCode.GDNewSprite3Objects3.length = 0;


return;

}

gdjs['WinScreenCode'] = gdjs.WinScreenCode;
