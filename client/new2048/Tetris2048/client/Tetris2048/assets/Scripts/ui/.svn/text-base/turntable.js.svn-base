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
        //
        turnTableNode:cc.Node,
        turntable:cc.Node,
        aniNode:cc.Node,
        rewardSprite:cc.Sprite,
        rewardSpriteFrame:[cc.SpriteFrame],
        light:cc.Node,
        rewardName:cc.Label,
        btnLayout:cc.Node,
        leftBtnLabel:cc.Label,
        rightBtnLabel:cc.Label,
        diamondLabel:cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function() {
        this.turnSpeed = 0;
        this.isRunTurn = false;
        var size = cc.director.getWinSize();
        tywx.LOGD("","file = [turntable] fun = [onLoad] size = " + size);
        this.turnTableNode.setScale(size.width/640,size.width/640);

        this.selectIndex = 0;
        this.isSpeedUp = true;  //true:加速  false:减速
        if (Global.turnTableExpend && Global.turnTableExpend.type == "share") {
            this.leftBtnLabel.string = "分享抽奖";
        }else {
            this.leftBtnLabel.string = "看视频抽奖";
        }
        var _use = Global.turnTableExpend.use || 60;
        this.rightBtnLabel.string = _use + "钻石抽奖";
        this.isNoCharge = false;
        this.diamondLabel.string = Global.wxGold;

        ctr.sxAdmanager.hide();
    },

    onceNoCharge:function(){
        this.isNoCharge = true;
        this.rightBtnLabel.string = "首次免费";
    },

    onClickLeftBtn:function(){
        if (Global.turnTableExpend && Global.turnTableExpend.type == "share") {
            this.onClickShare();
        }else {
            this.onSeeVideo();
        }
    },

    onSeeVideo:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.turnTableVideo, null);
        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.seeVideoSuccess.bind(this), this.seeVideoFail.bind(this));
    },

    seeVideoSuccess:function(){
        this.selectPrize();
    },

    seeVideoFail:function(isFail){
        if(Global.cdnGameConfig.videoChangeShare && isFail) {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '758');
        }else {
            // Global.game.showDialogPropText('观看完整视频获得道具');
        }

    },

    onClickShare:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.turnTableShare, null);

        ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '758');
    },

    onShareSuccess:function(openGId){
        if (typeof wx !== 'undefined') {
            if (!openGId) {
                Global.game.showDialogText('分享失败，分享到群才有效');
                console.log('分享失败，分享到群才有效');
                return;
            }
        }

        if (Global.gameinfo.shareData1.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群今日已经分享过', openGId);
            Global.game.showDialogText('该群今天已打扰过了,换个群试试');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData1.arrOpenGId.push(openGId);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        this.selectPrize();
    },

    onShareFailed:function(msg){
        if (msg === undefined) {
            Global.game.showDialogText('分享失败！');
        } else if (msg == 'fail') {
            Global.game.showDialogText('分享失败，分享到群才有效');
        } else if (msg == 'cancel') {
            Global.game.showDialogText('分享失败！');
        } else {
            Global.game.showDialogText('分享失败！');
        }
    },

    onClickUseDiamond:function(){

        var _use = Global.turnTableExpend.use || 60;
        if (this.isNoCharge){
            var biManager = require('biManager');
            biManager.bilog(biManager.noChargeDiamond, null);
            this.selectPrize();
            this.isNoCharge = false;
            this.rightBtnLabel.string = _use + "钻石抽奖";
        }else {
            var biManager = require('biManager');
            biManager.bilog(biManager.turnTableDiamond, null);
            if (Global.wxGold >= _use) {
                Global.wxGold -= _use;
                Global.game.saveScore();
                this.diamondLabel.string = Global.wxGold;
                this.selectPrize();
            }else {
                Global.game.showDialogPropText('钻石不足!');
            }
        }
        // this.selectPrize();
    },
    
    //中奖
    selectPrize:function(){
        this.selectKey = "";
        this.selectIndex = 0;
        var _random = Math.random();
        for (var key in Global.turnTableConfig){
            if (key){
                if (Global.turnTableConfig[key].probability) {
                    if (_random >= Global.turnTableConfig[key].probability[0] &&
                        _random < Global.turnTableConfig[key].probability[1]){
                        //中奖
                        tywx.LOGE("","file = [turntable] fun = [runTurn] 中奖了 key = " + key);
                        this.selectKey = key;
                        this.selectIndex = Global.turnTableConfig[key].index;
                        break;
                    }
                }

            }
        }

        if (this.selectKey != "" && this.selectIndex > 0) {
            this.runTurn();
        }
    },

    //开始转动
    runTurn:function(){
        if (this.isRunTurn) {
            return
        }
        this.btnLayout.active = false;
        listenUtil.eventCtrl.trigger('initPropData', null);
        this.turntable.rotation = 0;
        this.turnSpeed = 0;
        this.isRunTurn = true;
        this.isSpeedUp = true;
        var that = this;
        this.rotation = Math.random() * 60 + (this.selectIndex - 1) * 60 + 360 + 1080;
        // this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
        //     that.turnSpeed = 0;
        //     that.turntable.rotation = 0;
        //     that.turntable.runAction(cc.rotateBy(1,720 + rotation))
        // })));
    },

    //中奖,播放动画,发放奖励
    getRewardAni:function(){
        this.btnLayout.active = true;
        this.aniNode.active = true;
        var count = Global.turnTableConfig[this.selectKey].number;
        switch (this.selectKey){
            case "clear":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[0];
                Global.gameinfo.clearPropNum += count;
                ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                this.rewardName.string = Global.turnTableConfig[this.selectKey].name + "x" + count;
                break;
            case "touzi":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[1];
                Global.gameinfo.superPropNum += count;
                ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                this.rewardName.string = Global.turnTableConfig[this.selectKey].name + "x" + count;
                break;
            case "diamond_1":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[2];
                Global.startUI.updateGold(count);
                this.diamondLabel.string = Global.wxGold;
                this.rewardName.string = Global.turnTableConfig[this.selectKey].name + "x" + count;
                break;
            case "diamond_2":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[2];
                Global.startUI.updateGold(count);
                this.diamondLabel.string = Global.wxGold;
                this.rewardName.string = Global.turnTableConfig[this.selectKey].name + "x" + count;
                break;
            case "diamond_3":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[2];
                Global.startUI.updateGold(count);
                this.diamondLabel.string = Global.wxGold;
                this.rewardName.string = Global.turnTableConfig[this.selectKey].name + "x" + count;
                break;
            case "gift":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[3];
                //
                var len = Global.storeData.length;
                if (6-len > 0){
                    var skipList = ["数字","富豪","甄嬛传","脑残版","扑克版","复仇版"];
                    var randomIndex = Math.floor(Math.random()*(6-len));
                    var indexs = (len+randomIndex + 1 * 100) + "";
                    Global.storeData.push(indexs);
                    ThirdAPI.saveInfo('skinstore', Global.storeData);
                    this.rewardName.string = skipList[len+randomIndex] + "皮肤x1";
                }else {
                    this.rewardName.string = "钻石x850";
                    Global.startUI.updateGold(850);
                }

                break;
        }
    },

    onCloseAniNode:function(){
        this.aniNode.active = false;
    },

    onClose:function(){
        this.turnSpeed = 0;
        this.isRunTurn = false;
        this.node.stopAllActions();
        this.turntable.stopAllActions();
        Global.turnTableUI = null;
        this.node.destroy();
    },

    update:function (dt) {
        if (this.isRunTurn) {
            //转起来
            if (this.isSpeedUp) {
                if (this.turnSpeed <= 20){
                    this.turnSpeed += 0.5;
                }else {
                    this.isSpeedUp = false;
                }
            }else {
                if (this.turntable.rotation >= 1080){
                    this.turnSpeed -= 0.5;
                    if (this.turnSpeed <= 2) {
                        this.turnSpeed = 2;
                    }
                }
            }

            this.turntable.rotation += this.turnSpeed;
            if (this.turntable.rotation >= this.rotation){
                this.isRunTurn = false;
                listenUtil.eventCtrl.trigger('turnTableGetReward', this.selectKey);
                this.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(this.getRewardAni.bind(this))));
            }
        }

        if (this.aniNode.active) {
            this.light.rotation += 0.5;
        }
    },

    onDestroy:function(){
        if (ctr.sxAdmanager && ctr.sxAdmanager.adIcon){
            ctr.sxAdmanager.show();
        }
    },


});
