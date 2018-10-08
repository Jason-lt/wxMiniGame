"use strict";
cc._RF.push(module, '1d312sOYC9FRZDNYldP3Bfa', 'recordUI');
// Scripts/ui/recordUI.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {},

    onContinueBtn: function onContinueBtn() {
        wxGame.GlobalFuncs.playGame();
    },

    onBeginGameBtn: function onBeginGameBtn() {
        wxGame.saveGameInfo = {};
        wxGame.GlobalFuncs.playGame();
    }

    // update (dt) {},
});

cc._RF.pop();