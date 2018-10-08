(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/seq_getBox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b97441BhlxOnrnpidzLU2RQ', 'seq_getBox', __filename);
// Scripts/ui/seq_getBox.js

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
        cardSprite: cc.Sprite,
        cardSpriteFrame: [cc.SpriteFrame],

        boxNode: cc.Node
    },

    onLoad: function onLoad() {
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SHARE_STATE, this.updateShareState, this);
        this.isAction = true;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_baoxiang');
        var that = this;
        anim.once("finished", function () {
            that.isAction = false;
        });
        anim.play();
    },

    setBoxCardScore: function setBoxCardScore(score) {
        var index = wxGame.GameConfig.itemScoreConfig.indexOf(score);
        if (index >= 0) {
            this.cardSprite.spriteFrame = this.cardSpriteFrame[index];
        }
    },

    updateShareState: function updateShareState() {
        if (wxGame.Global.sharePoint == "571") {
            wxGame.LOGW("file = [seq_getBox] fun = [updateShareState] ");
            var resultType = wxGame.shareManager.resultType;
            switch (resultType) {
                case 1:
                    wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
                    break;
                case 2:
                    wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
                    break;
                case 3:
                    var propList = [0, 1, 2];
                    var arrIndex = Math.floor(Math.random() * propList.length);
                    if (propList[arrIndex] != null) {
                        if (propList[arrIndex] == 2) {
                            tcpManager.sendCmd.shareToGetreward(10700001);
                            tywx.BiLog.clickStat(wxGame.biManager.getChangeCard, ["video", "box"]);
                        } else {
                            wxGame.GlobalFuncs.getCardProp(propList[arrIndex]);
                            if (this.propIndex == 0) {
                                //炸弹
                                tywx.BiLog.clickStat(wxGame.biManager.getBombCard, ["video", "box"]);
                            } else if (this.propIndex == 1) {
                                //万能
                                tywx.BiLog.clickStat(wxGame.biManager.getPowerfulCard, ["video", "box"]);
                            }
                        }
                    }
                    this.onClose();
                    break;
                case 6:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
                default:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
            }
            wxGame.shareManager.resultType = 0;
        }
    },

    onClickGetBox: function onClickGetBox() {
        if (this.isAction) {
            return;
        }
        if (wxGame.shareConfig.mergeBox.useMethod == "share") {
            wxGame.shareManager.sharePoint("571");
            tywx.BiLog.clickStat(wxGame.biManager.onClickBox, ["share"]);
        } else {
            tywx.BiLog.clickStat(wxGame.biManager.onClickBox, ["video"]);
            wxGame.wxAdManager.showRewardVideo(this.onAdSuccess.bind(this), this.onAdFail.bind(this));
        }
    },

    onAdSuccess: function onAdSuccess(isEnd) {
        if (isEnd) {
            var propList = [0, 1, 2];
            var arrIndex = Math.floor(Math.random() * propList.length);
            if (propList[arrIndex] != null) {
                if (propList[arrIndex] == 2) {
                    tcpManager.sendCmd.shareToGetreward(10700001);
                    tywx.BiLog.clickStat(wxGame.biManager.getChangeCard, ["share", "box"]);
                } else {
                    wxGame.GlobalFuncs.getCardProp(propList[arrIndex]);
                    if (this.propIndex == 0) {
                        //炸弹
                        tywx.BiLog.clickStat(wxGame.biManager.getBombCard, ["share", "box"]);
                    } else if (this.propIndex == 1) {
                        //万能
                        tywx.BiLog.clickStat(wxGame.biManager.getPowerfulCard, ["share", "box"]);
                    }
                }
            }
            this.onClose();
        } else {
            wxGame.GlobalFuncs.showToast("观看完整视频,才可获得奖励");
        }
        wxGame.wxBannerAd.createBannerAd();
    },

    onAdFail: function onAdFail() {
        wxGame.GlobalFuncs.showToast("激励视频已达上限!");
        wxGame.wxBannerAd.createBannerAd();
        if (wxGame.Global.isBringVersion) {
            return;
        }
        wxGame.shareManager.sharePoint("571");
    },

    onClickSkipBtn: function onClickSkipBtn() {
        if (this.isAction) {
            return;
        }
        this.onClose();
    },

    onClose: function onClose() {
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_baoxiang');
        anim.stop();

        this.boxNode.stopAllActions();

        this.node.destroy();
    },
    onDestroy: function onDestroy() {
        wxGame.boxUI = null;
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
        //# sourceMappingURL=seq_getBox.js.map
        