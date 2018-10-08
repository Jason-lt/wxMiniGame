(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/pauseUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96eabSGlhpIBpRDsG7NBH5N', 'pauseUI', __filename);
// Scripts/ui/pauseUI.js

'use strict';

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

    properties: {
        soundOnBtn: {
            default: null,
            type: cc.Node
        },
        soundOffBtn: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function onLoad() {
        this.initAudio();
    },

    initAudio: function initAudio() {
        this.soundOnBtn.active = Global.isSoundPlaying;
        this.soundOffBtn.active = !Global.isSoundPlaying;
    },

    // onLoad () {},
    toHome: function toHome() {
        Global.game.playSound('btn', 0.1);
        var myUtil = require('myUtil');
        myUtil.saveData();
        Global.isPaused = false;
        Global.gridController.getComponent('gridController').goMainScene();
    },

    play: function play() {
        Global.game.playSound('btn', 0.1);
        var gridController = Global.gridController.getComponent('gridController');
        if (Global.isPaused) {
            if (gridController.bornGrid) {
                gridController.bornGrid.resumeAllActions();
            }
            gridController.node.resumeAllActions();
            this.node.active = false;
            Global.isPaused = false;
        } else {
            gridController.bornGrid.pauseAllActions();
            gridController.node.pauseAllActions();

            this.node.active = true;
            this.node.setLocalZOrder(1);
        }
    },

    replay: function replay() {
        Global.game.playSound('btn', 0.1);
        var gridController = Global.gridController.getComponent('gridController');
        gridController.onRestart();
    },

    //关闭暂停界面
    close: function close() {
        this.play();
    },

    switchBGM: function switchBGM() {
        Global.game.playSound('btn', 0.1);
        Global.game.switchSound();
        this.initAudio();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=pauseUI.js.map
        