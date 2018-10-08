// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let ThirdAPI = require('../common/ThirdAPI')
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

        scoreNum: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    initData: function () {
        this.startContinueConutDown();
        this.tip.node.active = false;
    },

    //设置倒计时
    startContinueConutDown: function () {
        let times = 10;
        this.lbl_countdown.string = times;
        this.pauseInterval = false;
        this.countDownInterval = setInterval(() => {
            if (!this.pauseInterval) {
                times--;
                if (times >= 0) {
                    this.lbl_countdown.string = times;
                } else {
                    this.giveUpShare();
                    clearInterval(this.countDownInterval);
                }
            }
        }, 1000);
    },

    //设置分数
    setScore: function (score) {
        this.scoreNum = score;
        if (typeof wx !== 'undefined') {
            this.sLabel.string = '当前分数：' + this.scoreNum;
        } else {
            this.sLabel.string = 'current score:' + this.scoreNum;
        }
    },

    //分享
    shareGame: function () {
        Global.game.playSound('btn', 0.1);

        this.tip.node.active = false;
        this.pauseInterval = true;
        if (typeof FBInstant !== 'undefined') {
            var Util = require('Util');
            ThirdAPI.shareGame(Util.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            console.log('----------------复活分享-----------------');
            ThirdAPI.shareGame(null, this.onShareSuccess.bind(this), this.onShareFailed.bind(this));
        } else {
            console.log('----------------直接复活-----------------');
            this.onShareSuccess();
        }
    },

    //分享成功
    onShareSuccess: function (shareTickets) {
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
    onShareFailed: function () {
        this.pauseInterval = false;
    },

    //放弃分享
    giveUpShare: function () {
        Global.game.playSound('btn', 0.1);
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        this.pauseInterval = false;
        clearInterval(this.countDownInterval);
        Global.game.showShareUI();
        Global.shareUI.updateMaxLabel(this.scoreNum);
    },

});