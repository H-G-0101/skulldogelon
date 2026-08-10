gdjs.CreditsCode = {};
gdjs.CreditsCode.localVariables = [];
gdjs.CreditsCode.idToCallbackMap = new Map();
gdjs.CreditsCode.GDCreditsObjects1= [];
gdjs.CreditsCode.GDCreditsObjects2= [];


gdjs.CreditsCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Credits"), gdjs.CreditsCode.GDCreditsObjects1);
{for(var i = 0, len = gdjs.CreditsCode.GDCreditsObjects1.length ;i < len;++i) {
    gdjs.CreditsCode.GDCreditsObjects1[i].setCenterPositionInScene(gdjs.evtTools.camera.getCameraX(runtimeScene, "", 0),gdjs.evtTools.camera.getCameraY(runtimeScene, "", 0));
}
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
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(13255044);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Title", false);
}
}

}


};

gdjs.CreditsCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.CreditsCode.GDCreditsObjects1.length = 0;
gdjs.CreditsCode.GDCreditsObjects2.length = 0;

gdjs.CreditsCode.eventsList0(runtimeScene);
gdjs.CreditsCode.GDCreditsObjects1.length = 0;
gdjs.CreditsCode.GDCreditsObjects2.length = 0;


return;

}

gdjs['CreditsCode'] = gdjs.CreditsCode;
