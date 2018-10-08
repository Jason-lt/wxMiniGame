(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/seq_huode_card.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb939xWWKpAZKPmIkdXp3Q/', 'seq_huode_card', __filename);
// Scripts/ui/seq_huode_card.js

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
        propCard: cc.Sprite,
        propCardSpriteFrame: [cc.SpriteFrame]

    },

    onLoad: function onLoad() {
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_huode');
        var that = this;
        that.isAction = true;
        anim.once("finished", function () {
            that.isAction = false;
        });

        anim.play();
        tywx.Timer.setTimer(that, that.onClose.bind(that), 1.5);
    },

    setPropCard: function setPropCard(index) {
        this.propIndex = index;
        if (this.propCardSpriteFrame[index]) {
            this.propCard.spriteFrame = this.propCardSpriteFrame[index];
        }
        switch (index) {
            case 0:
                //炸弹道具
                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_GET_PROP, index);
                break;
            case 1:
                //万能牌
                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_GET_PROP, index);
                break;
            case 2:
                //交换道具

                break;
        }
    },

    onClose: function onClose() {
        if (this.isAction) {
            return;
        }

        if (this.propIndex != null) {
            wxGame.NotificationCenter.trigger(wxGame.EventType.GET_PROP_CARD_ANI, this.propIndex);
        }

        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_huode');
        anim.stop();
        tywx.Timer.cancelTimer(this, function () {});
        this.node.destroy();
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
        //# sourceMappingURL=seq_huode_card.js.map
        