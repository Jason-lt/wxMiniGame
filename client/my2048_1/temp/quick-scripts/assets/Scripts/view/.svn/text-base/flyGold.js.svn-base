(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/view/flyGold.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3e754b7ty1Lnr0FUnSfrDyx', 'flyGold', __filename);
// Scripts/view/flyGold.js

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

    properties: {
        num: 0,
        Sprite: {
            default: null,
            type: cc.Sprite
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    toPosition: function toPosition(p, gridNum) {
        this.num = gridNum;
        this.node.stopAllActions();
        //再上移
        var finished = cc.callFunc(this.finished, this);
        var action = cc.spawn(cc.moveTo(0.5, cc.p(p.x, p.y)), cc.rotateBy(0.5, 0));
        var action2 = cc.scaleTo(0.3, 2, 2);
        var updateGoldNum = cc.callFunc(this.updateGold, this);
        var myAction = cc.sequence(action, action2, updateGoldNum, finished);
        this.node.runAction(myAction);
        this.node.setLocalZOrder(10);
    },

    finished: function finished() {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
        this.node.destroy();

        var gridControllerScript = Global.gridController.getComponent("gridController");
        gridControllerScript.updateGold(this.num);
    }

    // update (dt) {},
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
        //# sourceMappingURL=flyGold.js.map
        