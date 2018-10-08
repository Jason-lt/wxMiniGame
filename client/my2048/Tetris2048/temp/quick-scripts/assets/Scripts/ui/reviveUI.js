(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/reviveUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '02f0eykHTVElayNfHnNwExV', 'reviveUI', __filename);
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
        shareNotRevive: {
            default: null,
            type: cc.Node
        },

        scoreNum: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    initData: function initData() {
        this.startContinueConutDown();
        this.setShareLabel();
        this.tip.node.active = false;
        this.shareNotRevive.active = false;
        //ThirdAPI.showGameClub(false);
    },

    //设置分享按钮文本
    setShareLabel: function setShareLabel() {
        if (typeof wx !== 'undefined') {
            if (Global.cdnGameConfig.totalSwith) {
                this.shareLabel.string = '分享也不能复活'; //"看视频继续玩";
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
    },

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

    //分享
    showRewardAd: function showRewardAd() {
        Global.game.playSound('btn', 0.1);

        this.tip.node.active = false;
        this.pauseInterval = true;

        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.onRewardAdClose.bind(this));
    },

    //分享成功
    onRewardAdClose: function onRewardAdClose(openGId) {
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
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '004');
        } else {
            console.log('----------------直接复活-----------------');
            this.onShareSuccess();
        }
    },

    //分享成功
    onShareSuccess: function onShareSuccess(openGId, shareTicket) {

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
        }

        /*
        if (Global.gameinfo.shareData2.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群今日已经分享过', openGId);
            this.pauseInterval = false;
            Global.game.showDialogText('该群今日已经分享过无法复活');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData2.arrOpenGId.push(openGId);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }*/

        //是否分享到群
        if (!shareTicket) {
            Global.game.showDialogText('请分享到不同群！', {
                x: 0,
                y: -120
            });
            this.pauseInterval = false;
            console.log('分享失败，必须分享到不同微信群!');
            return;
        }

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
        Global.game.showDialogText('请分享到不同群！');
    },

    //放弃分享
    giveUpShare: function giveUpShare() {
        Global.game.playSound('btn', 0.1);
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        this.pauseInterval = false;
        clearInterval(this.countDownInterval);
        Global.game.showShareUI();
        Global.shareUI.updateMaxLabel(this.scoreNum);
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
        //# sourceMappingURL=reviveUI.js.map
        