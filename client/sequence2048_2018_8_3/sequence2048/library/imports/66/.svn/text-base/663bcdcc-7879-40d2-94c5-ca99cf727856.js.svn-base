"use strict";
cc._RF.push(module, '663bc3MeHlA0pTFypnPcnhW', 'resurgenceUI');
// Scripts/ui/resurgenceUI.js

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
        title: cc.Label,
        logoBtn: cc.Node,
        btnLabel: cc.Label,
        timerSprite: cc.Sprite
    },

    onLoad: function onLoad() {
        wxGame.GlobalFuncs.btnScaleEffect(this.logoBtn, 1.2);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SHARE_STATE, this.updateShareState, this);

        if (wxGame.resurgenceConfig.useMethod == "share") {
            this.btnLabel.string = "分享到群消" + wxGame.resurgenceConfig.resurgenceRemove + "行";
        } else {
            this.btnLabel.string = "看视频消" + wxGame.resurgenceConfig.resurgenceRemove + "行";
        }

        this.timerSprite.fillRange = 1;
        this.timer = 100;
        this.timerSpriteAni();
    },

    timerSpriteAni: function timerSpriteAni() {

        if (this.timer > 0) {
            var that = this;
            var callFunc = function callFunc() {
                that.timerSprite.fillRange = that.timer / 100;
                that.timer = that.timer - 0.2;
                that.timerSpriteAni();
            };
            this.node.runAction(cc.sequence(cc.delayTime(0.002), cc.callFunc(callFunc)));
        } else {
            this.onClose();
        }
    },

    onClickLogoBtn: function onClickLogoBtn() {
        this.node.stopAllActions();
        if (wxGame.resurgenceConfig.useMethod == "share") {
            wxGame.shareManager.sharePoint("575", this.shareSuccess.bind(this), this.shareFail.bind(this));
            tywx.BiLog.clickStat(wxGame.biManager.resurgenceBtn, ["share"]);
        } else {
            wxGame.wxAdManager.showRewardVideo(this.onAdSuccess.bind(this), this.onAdFail.bind(this));
            tywx.BiLog.clickStat(wxGame.biManager.resurgenceBtn, ["video"]);
        }

        // wxGame.shareManager.sharePoint("575");

        // wxGame.NotificationCenter.trigger(wxGame.EventType.RESURGENCE_SUCCESS);
        // this.onResurgence();

        // this.node.stopAllActions();
        // this.timerSprite.fillRange = 0;
    },

    onAdSuccess: function onAdSuccess(isEnd) {
        if (isEnd) {
            wxGame.NotificationCenter.trigger(wxGame.EventType.RESURGENCE_SUCCESS);
            tywx.BiLog.clickStat(wxGame.biManager.resurgenceSuccess, ["video"]);
            this.onResurgence();
        } else {
            wxGame.GlobalFuncs.showToast("观看完整视频,才可获得奖励");
            this.timerSpriteAni();
        }
    },

    onAdFail: function onAdFail() {
        wxGame.GlobalFuncs.showToast("激励视频已达上限!");
        if (wxGame.Global.isBringVersion) {
            this.timerSpriteAni();
            return;
        }
        wxGame.shareManager.sharePoint("575", this.shareSuccess.bind(this), this.shareFail.bind(this));
    },

    shareSuccess: function shareSuccess() {
        // var resultType = wxGame.shareManager.resultType;
        // switch (resultType) {
        //     case 1:
        //         wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
        //         break;
        //     case 2:
        //         wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
        //         break;
        //     case 3:
        //         // wxGame.GlobalFuncs.showToast("分享也不能复活!");
        //         wxGame.NotificationCenter.trigger(wxGame.EventType.RESURGENCE_SUCCESS);
        //         this.onResurgence();
        //         return;
        //         break;
        //     case 6:
        //         wxGame.GlobalFuncs.showToast("分享失败!");
        //         break;
        //     default:
        //         wxGame.GlobalFuncs.showToast("分享失败!");
        //         break;
        // }
        // wxGame.shareManager.resultType = 0;
        // this.onClose();
        this.timerSpriteAni();
    },

    shareFail: function shareFail() {
        this.timerSpriteAni();
        // wxGame.GlobalFuncs.showToast("分享失败!");
    },

    updateShareState: function updateShareState() {
        if (wxGame.Global.sharePoint == "575") {
            wxGame.LOGW("file = [resurgenceUI] fun = [updateShareState] wxGame.Global.sharePoint = " + wxGame.Global.sharePoint);
            var resultType = wxGame.shareManager.resultType;
            switch (resultType) {
                case 1:
                    wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
                    break;
                case 2:
                    wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
                    break;
                case 3:
                    wxGame.NotificationCenter.trigger(wxGame.EventType.RESURGENCE_SUCCESS);
                    tywx.BiLog.clickStat(wxGame.biManager.resurgenceSuccess, ["share"]);
                    this.onResurgence();
                    return;
                    break;
                case 6:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
                default:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
            }
            wxGame.shareManager.resultType = 0;
            // this.onClose();
        }
    },

    onClickSkipBtn: function onClickSkipBtn() {
        tywx.BiLog.clickStat(wxGame.biManager.resurgenceSkip, ["onClickSkipBtn"]);
        this.onClose();
    },

    onClose: function onClose() {
        this.logoBtn.stopAllActions();
        wxGame.NotificationCenter.trigger(wxGame.EventType.GAME_OVER_RESET);
        wxGame.NotificationCenter.trigger(wxGame.EventType.POP_RESULTUI);
        this.node.destroy();
    },

    onResurgence: function onResurgence() {
        this.logoBtn.stopAllActions();
        this.node.stopAllActions();
        this.timerSprite.fillRange = 0;
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
        wxGame.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});

cc._RF.pop();