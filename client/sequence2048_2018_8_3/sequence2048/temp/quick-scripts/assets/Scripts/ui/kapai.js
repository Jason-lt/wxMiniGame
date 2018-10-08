(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/kapai.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '03ba2x/GO1H57GpKEXvgNs8', 'kapai', __filename);
// Scripts/ui/kapai.js

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
        cardSprite: cc.Sprite,
        cardSpriteFrame: [cc.SpriteFrame]
    },

    onLoad: function onLoad() {},

    moveToTarget: function moveToTarget(index, posx, posy, nodex, nodey) {
        if (this.cardSpriteFrame[index]) {
            this.cardSprite.spriteFrame = this.cardSpriteFrame[index];
        }
        this.node.active = true;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('kapai');
        anim.play();

        var interx = posx - nodex;
        var intery = posy - nodey;
        var oncePos = cc.p(nodex + interx / 1.5 - interx / 2, nodey);
        var twoPos = cc.p(posx, nodey + intery / 4);
        var toPos = cc.p(posx, posy);
        var controlPoints1 = [oncePos, twoPos, toPos];

        var bezierToDst1 = cc.bezierTo(1, controlPoints1);

        this.node.runAction(cc.sequence(bezierToDst1, cc.callFunc(this.onAniEnd.bind(this))));
    },

    onAniEnd: function onAniEnd() {
        wxGame.NotificationCenter.trigger(wxGame.EventType.PROP_CARD_BAG_ANI);
        this.onClose();
        this.node.active = false;
    },

    onClose: function onClose() {
        this.node.stopAllActions();
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('kapai');
        anim.stop();
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
        //# sourceMappingURL=kapai.js.map
        