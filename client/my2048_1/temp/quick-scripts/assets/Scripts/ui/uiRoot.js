(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/uiRoot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '84c41LsrfFPsriorNv8+hdx', 'uiRoot', __filename);
// Scripts/ui/uiRoot.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        startUI: {
            default: null,
            type: cc.Node
        },

        shareUI: {
            default: null,
            type: cc.Node
        }
    },

    start: function start() {
        Global.startUI = this.startUI.getComponent('startUI');
        Global.shareUI = this.shareUI.getComponent("shareUI");
    },


    showStartUI: function showStartUI() {
        this.startUI.active = true;
        this.shareUI.active = false;
        if (Global.startUI) {
            Global.startUI.init();
        }
    },

    showShareUI: function showShareUI() {
        this.startUI.active = false;
        this.shareUI.active = true;
        if (Global.shareUI == null) {
            Global.shareUI = this.shareUI.getComponent("shareUI");
        }
        Global.shareUI.initData();
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
        //# sourceMappingURL=uiRoot.js.map
        