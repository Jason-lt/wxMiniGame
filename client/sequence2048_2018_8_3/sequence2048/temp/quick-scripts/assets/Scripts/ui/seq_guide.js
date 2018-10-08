(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/seq_guide.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'adf154D++hAmqLstriY0X1u', 'seq_guide', __filename);
// Scripts/ui/seq_guide.js

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
        guide_1: cc.Node,
        guide_2: cc.Node,
        guide_3: cc.Node,
        guide_4: cc.Node
    },

    onLoad: function onLoad() {
        this.guide_1.active = true;
        this.guide_2.active = false;
        this.guide_3.active = false;
        this.guide_4.active = false;

        this.playAni();
    },

    //切一次
    playOnce: function playOnce() {
        this.guide_1.active = false;
        this.guide_2.active = true;
        this.guide_3.active = false;
        this.guide_4.active = false;
    },

    //切第二次
    playTwoce: function playTwoce() {
        this.guide_1.active = false;
        this.guide_2.active = false;
        this.guide_3.active = true;
        this.guide_4.active = false;
    },

    //切第三次
    playThree: function playThree() {
        this.guide_1.active = false;
        this.guide_2.active = false;
        this.guide_3.active = false;
        this.guide_4.active = true;
    },

    //初始
    playInit: function playInit() {
        this.guide_1.active = true;
        this.guide_2.active = false;
        this.guide_3.active = false;
        this.guide_4.active = false;
    },

    playAni: function playAni() {
        var that = this;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.8), cc.callFunc(that.playOnce.bind(that)), cc.delayTime(0.8), cc.callFunc(that.playTwoce.bind(that)), cc.delayTime(0.8), cc.callFunc(that.playThree.bind(that)), cc.delayTime(0.8), cc.callFunc(that.playInit.bind(that)))));
    },

    onClose: function onClose() {
        this.node.stopAllActions();
        this.node.destroy();
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
        //# sourceMappingURL=seq_guide.js.map
        