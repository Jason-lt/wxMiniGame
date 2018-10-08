(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/component/itemView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96567mGVBlJp41UWCNJPVAy', 'itemView', __filename);
// Scripts/component/itemView.js

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
        numSpreite: cc.Sprite,
        lastSprite: cc.Sprite,
        numSpriteFrame: [cc.SpriteFrame],
        bombSpr: cc.Node,
        powerFul: cc.Node,
        undo: cc.Node,
        kuang: cc.Node,
        lizi: cc.Node
    },

    onLoad: function onLoad() {
        this.interTime = 0.2;
        this.score = 0;

        this.propType = 0;
        this.isGridSelect = false;
        this.lizi.setPosition(cc.p(0, 0));
        this.lizi.getComponent('cc.ParticleSystem').stopSystem();
        this.numSpreite.node.active = false;

        wxGame.NotificationCenter.listen(wxGame.EventType.HIDE_GRID_KUANG, this.ShowKunag, this);
        this.isPropCard = 0;
        // stopSystem
    },

    ShowKunag: function ShowKunag(isSHow) {
        if (this.kuang) {
            this.kuang.active = isSHow;
            if (!isSHow) {
                this.setIsGridSelect(false);
            }
        }
    },

    setScore: function setScore(score, isMerge) {
        var itemScoreConfig = wxGame.GameConfig.itemScoreConfig;
        this.lizi.setPosition(cc.p(0, 0));
        this.lizi.getComponent('cc.ParticleSystem').stopSystem();
        this.lizi.active = false;
        this.lastSprite.node.active = true;
        this.lastSprite.node.setOpacity(255);
        this.lastSprite.node.setScale(1);
        this.numSpreite.node.active = false;

        this.propType = 0;

        var scoreConfig = wxGame.GameConfig.createCardConfig;
        if (score == wxGame.Global.gameInfo.bombCard) {
            //炸弹
            this.propType = score;
            score = wxGame.GlobalFuncs.randomForArray(scoreConfig);
        } else if (score == wxGame.Global.gameInfo.powerfulCard) {
            //万能
            this.propType = score;
            // score = wxGame.GlobalFuncs.randomForArray(scoreConfig);
        } else if (score == wxGame.Global.gameInfo.undoCard) {
            //撤销
            this.propType = score;
            score = wxGame.GlobalFuncs.randomForArray(scoreConfig);
        }

        this.numSpreite.spriteFrame = this.lastSprite.spriteFrame;

        this.score = score;
        if (itemScoreConfig) {
            var index = itemScoreConfig.indexOf(score);
            if (index >= 0 && this.numSpriteFrame[index]) {
                this.lastSprite.spriteFrame = this.numSpriteFrame[index];
            }
        }

        this.setProp();
    },

    //合并特效
    mergeAni: function mergeAni(aniOVerFunc) {
        this.lastSprite.node.active = true;
        this.numSpreite.node.active = true;

        var ani = this.node.getComponent(cc.Animation);
        var anim_h = ani.getAnimationState('2048_fangzhi');
        anim_h.stop();

        var anim = ani.getAnimationState('2048_hebing');
        var that = this;
        anim.once("finished", function () {
            if (aniOVerFunc) {
                aniOVerFunc();
            }
        });
        anim.play();
        that.clearProp();
    },

    clearProp: function clearProp() {
        this.isPropCard = 0;
    },

    //放置特效
    selectAni: function selectAni() {
        this.lastSprite.node.active = true;
        this.numSpreite.node.active = false;
        var ani = this.node.getComponent(cc.Animation);
        var anim_h = ani.getAnimationState('2048_hebing');
        anim_h.stop();
        var anim = ani.getAnimationState('2048_fangzhi');
        anim.once("finished", function () {
            wxGame.NotificationCenter.trigger(wxGame.EventType.MERGE_ITEM_SCORE);
        });
        anim.play();
    },

    //爆炸动画
    bombAni: function bombAni() {
        this.bombSpr.active = false;
        // this.powerFul.active = false;
        this.lizi.active = true;
        var ani_2 = this.node.getComponent(cc.Animation);
        var anim_2 = ani_2.getAnimationState('2048_hebing');
        anim_2.stop();

        // this.lizi.resetSystem();
        this.lizi.getComponent('cc.ParticleSystem').resetSystem();
        this.lastSprite.node.active = true;
        this.numSpreite.node.active = false;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_baozha');
        var that = this;
        anim.once("finished", function () {
            // that.lizi.destroy();
            that.gameOverRemove();
        });

        anim.play();
    },

    getScore: function getScore() {
        return this.score;
    },

    setPropType: function setPropType(propType) {
        this.propType = propType;
        this.setProp();
    },

    setProp: function setProp() {

        if (this.propType == 0) {
            this.bombSpr.active = false;
            this.powerFul.active = false;
            this.undo.active = false;
        } else if (this.propType == wxGame.Global.gameInfo.bombCard) {
            this.bombSpr.active = true;
            this.powerFul.active = false;
            this.undo.active = false;
            this.isPropCard = this.propType;
        } else if (this.propType == wxGame.Global.gameInfo.powerfulCard) {
            this.bombSpr.active = false;
            this.powerFul.active = true;
            this.undo.active = false;
            this.isPropCard = this.propType;
        } else if (this.propType == wxGame.Global.gameInfo.undoCard) {
            this.bombSpr.active = false;
            this.powerFul.active = false;
            this.undo.active = true;
            this.isPropCard = this.propType;
        }
    },

    getIsPropCard: function getIsPropCard() {
        return this.isPropCard;
    },

    getProp: function getProp() {
        return this.propType;
    },

    setItemPosition: function setItemPosition(pos) {
        this.node.stopAllActions();
        this.node.setPosition(pos);
    },

    getRootNode: function getRootNode() {
        return this.node;
    },

    setIsGridSelect: function setIsGridSelect(isSelect) {
        this.isGridSelect = isSelect;
    },

    getIsGridSelect: function getIsGridSelect() {
        return this.isGridSelect;
    },

    moveToPos: function moveToPos(pos) {
        this.node.stopAllActions();
        var move = cc.moveTo(this.interTime, pos);
        this.node.runAction(move);
    },

    moveLeftToPos: function moveLeftToPos(pos) {
        this.node.stopAllActions();
        var move_1 = cc.moveTo(this.interTime / 3 * 2, cc.p(pos.x - 30, pos.y));
        var move_2 = cc.moveTo(this.interTime / 3, cc.p(pos.x, pos.y));
        this.node.runAction(cc.sequence(move_1, move_2));
    },

    moveToPosMerge: function moveToPosMerge(pos, callFunc) {
        this.node.stopAllActions();
        var move = cc.moveTo(this.interTime, pos);
        var myAction = cc.sequence(move, cc.callFunc(function () {
            if (callFunc) {
                callFunc();
            }
        }));
        this.node.runAction(myAction);
    },

    //合并移除多余的一个牌
    onMergeRemoveItem: function onMergeRemoveItem(grid) {
        this.isPropCard = null;
        this.gameOverRemove();
        if (grid) {
            grid.item = null;
        }
        // wxGame.NotificationCenter.trigger(wxGame.EventType.MERGE_ITEM_SCORE);
    },

    //游戏结束销毁卡牌
    gameOverRemove: function gameOverRemove() {
        this.node.stopAllActions();
        wxGame.NotificationCenter.trigger(wxGame.EventType.PUT_CARD_POOL, this.node);
        // this.node.destroy();
    },

    setItemZOrder: function setItemZOrder(tag) {
        this.node.setLocalZOrder(tag);
    },

    removeeAni: function removeeAni() {
        var ani_1 = this.node.getComponent(cc.Animation);
        var anim_1 = ani_1.getAnimationState('2048_hebing');
        anim_1.stop();

        var anim = ani_1.getAnimationState('2048_baozha');
        anim.stop();

        var anim_2 = ani_1.getAnimationState('2048_fangzhi');
        anim_2.stop();

        this.gameOverRemove();
    },

    onDestroy: function onDestroy() {
        wxGame.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=itemView.js.map
        