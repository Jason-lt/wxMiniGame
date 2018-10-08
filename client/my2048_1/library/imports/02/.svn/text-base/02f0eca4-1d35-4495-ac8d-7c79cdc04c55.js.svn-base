"use strict";
cc._RF.push(module, '02f0eykHTVElayNfHnNwExV', 'reviveUI');
// Scripts/ui/reviveUI.js

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

var ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        sLabel: {
            default: null,
            type: cc.Label
        },
        lbl_countdown: {
            default: null,
            type: cc.Label
        },
        tip: {
            default: null,
            type: cc.Label
        },
        shareLabel: {
            default: null,
            type: cc.Label
        },

        rewardAdBtn: {
            default: null,
            type: cc.Node
        },
        shareBtn: {
            default: null,
            type: cc.Node
        },
        shareNotReviveBtn: {
            default: null,
            type: cc.Node
        },

        scoreNum: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    initData: function initData() {
        this.showBannerAd();

        this.startContinueConutDown();
        this.setShowButton();
        var gridControllerScript = Global.gridController.getComponent("gridController");
        if (gridControllerScript) {
            this.setScore(gridControllerScript.scoreScript.scoreNum);
        }
        this.tip.node.active = false;
    },

    //显示banner广告
    showBannerAd: function showBannerAd() {
        console.log('reviveUI show bannerAd');
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.createBannerAd();
    },

    //设置显示按钮
    setShowButton: function setShowButton() {
        this.rewardAdBtn.active = false;
        this.shareBtn.active = false;

        if (typeof wx !== 'undefined') {
            if (Global.cdnGameConfig.totalSwith) {
                if (Global.cdnGameConfig.reviveScoreSwith) {
                    //判断分数
                    console.log('判断分数：', Global.cdnGameConfig.reviveScoreLimit, Global.wxScore);
                    var canRevive = Global.wxScore > Global.cdnGameConfig.reviveScoreLimit ? true : false;
                    if (canRevive) {
                        console.log('是否可以复活');
                        this.shareBtn.active = true;
                    } else {
                        this.rewardAdBtn.active = true;
                    }
                } else {
                    console.log('复活分数开关已经关闭', Global.cdnGameConfig.reviveScoreSwith);
                    this.shareBtn.active = true;
                }
            } else {
                this.rewardAdBtn.active = true;
            }
        } else if (typeof FBInstant !== 'undefined') {
            this.shareBtn.active = true;
        } else {
            this.shareBtn.active = true;
        }
    },
    /*
        //设置分享按钮文本
        setShareLabel: function () {
            if (typeof wx !== 'undefined') {
                if (Global.cdnGameConfig.totalSwith) {
                    this.shareLabel.string = "看视频消" + Global.clearVNum + "行"; //'分享也不能复活';
                    //this.shareNotRevive.active = true;
                } else {
                    if (Global.cdnGameConfig.reviveScoreSwith) {
                        //判断分数
                        console.log('判断分数：', Global.cdnGameConfig.reviveScoreLimit, Global.wxScore);
                        var canRevive = Global.wxScore > Global.cdnGameConfig.reviveScoreLimit ? true : false;
                        if (canRevive) {
                            console.log('是否可以复活');
                            this.shareLabel.string = '分享到群继续玩';
                        } else {
                            this.shareLabel.string = "分享也不能复活"; //'分享也不能复活';
                            //this.shareNotRevive.active = true;
                        }
                    } else {
                        console.log('分享开关已经关闭', Global.cdnGameConfig.reviveScoreSwith);
                        this.shareLabel.string = '分享到群继续玩';
                    }
                }
            } else if (typeof FBInstant !== 'undefined') {
                this.shareLabel.string = 'share game';
            } else {
                this.shareLabel.string = '分享复活';
            }
        },*/

    //设置倒计时
    startContinueConutDown: function startContinueConutDown() {
        var _this = this;

        var times = 10;
        this.lbl_countdown.string = times;
        this.pauseInterval = false;
        this.countDownInterval = setInterval(function () {
            if (!_this.pauseInterval) {
                times--;
                if (times >= 0) {
                    _this.lbl_countdown.string = times;
                } else {
                    _this.giveUpShare();
                    clearInterval(_this.countDownInterval);
                }
            }
        }, 1000);
    },

    //设置分数
    setScore: function setScore(score) {
        this.scoreNum = score;
        if (typeof wx !== 'undefined') {
            this.sLabel.string = '当前分数：' + this.scoreNum;
        } else if (typeof FBInstant !== 'undefined') {
            this.sLabel.string = 'current score:' + this.scoreNum;
        } else {
            this.sLabel.string = '当前分数:' + this.scoreNum;
        }
    },

    //看视频分享游戏   
    rewardVideoAdShare: function rewardVideoAdShare() {
        Global.game.playSound('btn', 0.1);

        this.tip.node.active = false;
        this.pauseInterval = true;

        //删除banner广告
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.destroyBannerAd();

        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.onWxRewardVideoSuccess.bind(this), this.onWxRewardVideoFailed.bind(this));
    },

    //看视频成功
    onWxRewardVideoSuccess: function onWxRewardVideoSuccess() {
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.createBannerAd();

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        this.pauseInterval = false;
        clearInterval(this.countDownInterval);

        //可以复活
        Global.reviveShareTimes--;
        //保存本地
        if (Global.reviveShareTimes > -1) {
            ThirdAPI.saveReviveData(Global.reviveShareTimes);
        }
        //当局复活次数加1
        Global.reviveTimes++;

        //开始消除格子，继续游戏
        var gridControllerScript = Global.gridController.getComponent("gridController");
        gridControllerScript.clearGridForRevive();
    },

    //看视频失败
    onWxRewardVideoFailed: function onWxRewardVideoFailed() {
        this.pauseInterval = false;
        console.log('onWxRewardVideoFailed');
    },

    //分享
    shareGame: function shareGame() {
        Global.game.playSound('btn', 0.1);

        this.tip.node.active = false;
        this.pauseInterval = true;

        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            console.log('----------------复活分享-----------------');
            var EChannelPrefix = require("EChannelPrefix");
            ThirdAPI.sendChannelPrefix(EChannelPrefix.resurrection);
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '250');
        } else {
            this.onShareSuccess();
        }

        /*
                //删除banner广告
                var wxBannerAd = require('wxBannerAd');
                wxBannerAd.destroyBannerAd();
                 var wxRewardVideoAd = require('wxRewardVideoAd');
                wxRewardVideoAd.initCreateReward(this.onShareSuccess.bind(this), this.onWxRewardVideoFailed.bind(this));*/

        /* //星星复活
         if (Global.wxGold < Global.reviveConfig.costNum) {
             Global.game.showDialogPropText('星星数量不足！');
             this.pauseInterval = false;
             return;
         }
         Global.wxGold -= parseInt(Global.reviveConfig.costNum);
         var gridControllerScript = Global.gridController.getComponent("gridController");
         gridControllerScript.showGold();
         Global.game.saveScore();
         this.onShareSuccess();*/
    },

    //分享成功
    onShareSuccess: function onShareSuccess(openGId) {
        //游戏过程中复活分享并分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.reviveShare, null);

        /*
        //总开关判断
        if (Global.cdnGameConfig.totalSwith) {
            this.giveUpShare();
            clearInterval(this.countDownInterval);
            console.log('功能开关已打开1');
            return;
        } else {
            //分数开关判断
            if (Global.cdnGameConfig.reviveScoreSwith) {
                //判断分数
                console.log('判断分数：', Global.cdnGameConfig.reviveScoreLimit, Global.wxScore);
                var canRevive = Global.wxScore > Global.cdnGameConfig.reviveScoreLimit ? true : false;
                 if (!canRevive) {
                    this.giveUpShare();
                    clearInterval(this.countDownInterval);
                    console.log('revive复活界面--分数开关已打开2');
                    return;
                }
            }
        }*/

        //是否分享到群
        if (typeof wx !== 'undefined') {
            if (!openGId) {
                this.pauseInterval = false;
                Global.game.showDialogText('分享失败，分享到群才能复活');
                console.log('分享失败，分享到群才能复活');
                return;
            }
        }
        if (Global.gameinfo.shareData2.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群今日已经分享过', openGId);
            this.pauseInterval = false;
            Global.game.showDialogText('该群今日已经分享过无法复活');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData2.arrOpenGId.push(openGId);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.createBannerAd();

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        this.pauseInterval = false;
        clearInterval(this.countDownInterval);

        //可以复活
        Global.reviveShareTimes--;
        //保存本地
        if (Global.reviveShareTimes > -1) {
            ThirdAPI.saveReviveData(Global.reviveShareTimes);
        }
        //当局复活次数加1
        Global.reviveTimes++;

        //开始消除格子，继续游戏
        var gridControllerScript = Global.gridController.getComponent("gridController");
        gridControllerScript.clearGridForRevive();
    },

    //分享失败
    onShareFailed: function onShareFailed() {
        this.pauseInterval = false;
        console.log('分享失败');
        Global.game.showDialogText('分享失败');
    },

    //分享也不能复活
    shareNotRevive: function shareNotRevive() {
        Global.game.playSound('btn', 0.1);

        this.tip.node.active = false;
        this.pauseInterval = true;

        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            console.log('----分享也不能复活的分享----');
            var EChannelPrefix = require("EChannelPrefix");
            ThirdAPI.sendChannelPrefix(EChannelPrefix.resurrection);
            ThirdAPI.shareGame('randomImg', this.onShareNotReviveSuccess.bind(this), this.onShareFailed.bind(this), '250');
        } else {
            this.onShareNotReviveSuccess();
        }
    },

    //分享也不能复活（分享成功）
    onShareNotReviveSuccess: function onShareNotReviveSuccess() {
        this.giveUpShare();
        clearInterval(this.countDownInterval);
        console.log('revive复活界面--分数开关已打开，分数未达到，也不能复活');
    },

    //放弃分享
    giveUpShare: function giveUpShare() {
        Global.game.playSound('btn', 0.1);
        //记载死亡后跳过打点
        var biManager = require('biManager');
        biManager.bilog(biManager.dead2, null);

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        this.pauseInterval = false;
        clearInterval(this.countDownInterval);
        Global.game.showShareUI();
        //Global.shareUI.updateMaxLabel(this.scoreNum);
    }
});

cc._RF.pop();