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
        title:cc.Label,
        titleLayout:cc.Node,
        layout_1:cc.Node,
        layout_2:cc.Node,
        percentLabel:cc.Label,
        dayNode:cc.Prefab,
        AniNode:cc.Node,
        rewardSprite:cc.Sprite,
        rewardSpriteFrame:[cc.SpriteFrame],
        light:cc.Node,
        rewardName:cc.Label,
        doubleBtn:cc.Node,
        doubleBtnLabel:cc.Label,
        completeBtn:cc.Node,
        completeBtnLabel:cc.Label,
        doubleIcon:cc.Node,
        limitTips:cc.Label,
        bg:cc.Node,
        //翻倍特效声音
        doubleAudio: {
            url: cc.AudioClip,
            default: null
        },
    },

    onLoad:function(){
        this.createDayNode();
        ctr.sxAdmanager.hide();
        listenUtil.eventCtrl.addListen('gerRewardAni', this.gerRewardAni.bind(this));
        listenUtil.eventCtrl.addListen('updatePercent', this.updatePercent.bind(this));
        this.isDouble = false;
        this.rewardIndex = -1;

        var size = cc.director.getWinSize();
        var scene_scale = size.width/640;
        this.bg.setScale(scene_scale);

        this.updatePercent();
    },

    updatePercent:function(){
        var _list = ThirdAPI.loadGetRewardList();
        var element = _list.length;
        var denominator = Global.loginRewardConfig.length;
        this.percentLabel.string = element + "/" + denominator;
        if (element >= denominator && (Global.storeData.indexOf("106") == -1)) {
            this.percentLabel.node.active = false;
            this.completeBtn.active = true;
            if (Global.storeData.indexOf("106") == -1) {
                this.completeBtnLabel.string = "领取";
            }else {
                this.completeBtnLabel.string = "已领取";
            }
        }else {
            this.percentLabel.node.active = true;
            this.completeBtn.active = false;
        }
    },

    createDayNode:function(){
        if (Global.loginRewardConfig && Global.loginRewardConfig.length) {

            var inList = false;
            for (var i = 0; i < Global.loginRewardConfig.length; i++) {
                // var _date = (new Date()).toLocaleDateString();
                var _dates = new Date((new Date()).toDateString());

                var y = _dates.getFullYear();
                var m = _dates.getMonth()+1;
                var d = _dates.getDate();

                var _date = y+ "/" + m + "/" + d;
                if (_date == Global.loginRewardConfig[i].day) {  //当天在活动中
                    tywx.LOGE(null,"file = [loginRewardNode] fun = [createDayNode] _date = " + _date)
                    inList = true;
                    break;
                }
            }

            if (!inList) {
                ThirdAPI.clearGetRewardList();
            }

            for (var i = 0; i < Global.loginRewardConfig.length; i++) {
                var dayNode = cc.instantiate(this.dayNode);
                var com = dayNode.getComponent("loginDayNode");
                com.updateReward(i,inList);
                if (i < 4){
                    this.layout_1.addChild(dayNode);
                }else {
                    this.layout_2.addChild(dayNode);
                }
            }
        }
    },

    //播放落地声音
    playDoubleAniAudio: function () {
        if (Global.isSoundPlaying && this.doubleAudio != null) {
            this.combineID = cc.audioEngine.play(this.doubleAudio, false, 1);
            //回调
            var self = this;
            if (self.combineID > 0) {
                cc.audioEngine.setFinishCallback(self.combineID, function () {
                    self.playAudioEnd();
                });
            }
        }
    },

    //暂停声音声音
    playAudioEnd: function () {
        cc.audioEngine.uncache(this.combineID);
    },

    gerRewardAni:function(rewardIndex){

        this.rewardIndex = rewardIndex;
        this.doubleBtn.active = true;
        this.AniNode.active = true;
        this.limitTips.node.active = false;
        this.doubleIcon.active = false;
        var _number = Global.loginRewardConfig[rewardIndex].number;
        var _reward = Global.loginRewardConfig[rewardIndex].reward;
        if (_reward.indexOf("皮肤") == -1) {
            if (this.isDouble) {
                _number = _number * 2
                this.doubleBtn.active = false;
                this.getReward();
                this.doubleIcon.active = true;
                //双倍奖励效果
                var ani = this.doubleIcon.getComponent(cc.Animation);
                var anim = ani.getAnimationState("doubleAni");
                var that = this;
                anim.once("finished",function(){
                    that.playDoubleAniAudio();
                });
                anim.play();
                // this.doubleIcon.runAction(cc.sequence(cc.delayTime(0.8),cc.spawn(cc.fadeIn(0.3),cc.scaleTo(0.3,1,1))));
            }
        }else {
            this.doubleBtn.active = false;
        }

        this.rewardName.string = _reward + "x" + _number;
        switch (_reward){
            case "富豪皮肤":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[2];
                this.rewardSprite.node.setScale(1);
                break;
            case "甄嬛传皮肤":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[3];
                this.rewardSprite.node.setScale(1);

                break;
            case "脑残版皮肤":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[4];
                this.rewardSprite.node.setScale(1);
                break;
            case "扑克版皮肤":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[6];
                this.rewardSprite.node.setScale(1);
                break;
            case "复仇版皮肤":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[5];
                this.rewardSprite.node.setScale(1);
                break;
            case "钻石":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[0];
                this.rewardSprite.node.setScale(1.5);
                break;
            case "道具":
                this.rewardSprite.spriteFrame = this.rewardSpriteFrame[1];
                this.rewardSprite.node.setScale(1.5);
                break;
        }
        if (!this.isDouble) {
            this.getReward();
        }
        this.isDouble = false;
    },

    //获得奖励
    getReward:function(){

        var _number = Global.loginRewardConfig[this.rewardIndex].number;
        var _reward = Global.loginRewardConfig[this.rewardIndex].reward;

        //领取当天奖励
        if(_reward.indexOf("皮肤") >= 0){
            var skipList = ["数字皮肤","富豪皮肤","甄嬛传皮肤","脑残版皮肤","扑克版皮肤","复仇版皮肤"];
            var money = [0,50,150,300,500,850];
            var index = skipList.indexOf(_reward);
            var indexs = (index+100) + "";
            if (Global.storeData.indexOf(indexs) == -1){
                Global.storeData.push(indexs);
                ThirdAPI.saveInfo('skinstore', Global.storeData);
            }else {
                var skin_money = money[index] || 0;
                Global.startUI.updateGold(skin_money);
            }
        }else if (_reward == "道具") {
            Global.gameinfo.clearPropNum += _number;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            Global.gameinfo.superPropNum += _number;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }else {
            Global.startUI.updateGold(_number);
        }
    },

    onRewardDouble:function(){
        if (Global.loginRewardDouble && Global.loginRewardDouble.type == "share") {
            this.doubleBtnLabel.string = "分享翻倍";
            this.onClickShare();
        }else {
            this.doubleBtnLabel.string = "看视频翻倍";
            this.onSeeVideo();
        }
        this.isDouble = true;
    },

    onSeeVideo:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.loginRewardVideo, null);
        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.seeVideoSuccess.bind(this), this.seeVideoFail.bind(this));
    },

    seeVideoSuccess:function(){
        this.gerRewardAni(this.rewardIndex);
    },

    seeVideoFail:function(isFail){
        if(Global.cdnGameConfig.videoChangeShare && isFail) {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '1127');
        }else {
            // this.isDouble = false;
        }
    },

    onClickShare:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.loginRewardShare, null);

        ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '1127');
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
        this.gerRewardAni(this.rewardIndex);
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

    closeAniNode:function(){
        var ani = this.doubleIcon.getComponent(cc.Animation);
        var anim = ani.getAnimationState("doubleAni");
        anim.stop();
        this.isDouble = false;
        this.AniNode.active = false;
    },

    onClose:function(){
        var ani = this.doubleIcon.getComponent(cc.Animation);
        var anim = ani.getAnimationState("doubleAni");
        anim.stop();
        this.node.destroy();
        Global.loginRewardUI = null;
        listenUtil.eventCtrl.trigger('onceOpenTurnTable', null);
    },

    getLimitSkip:function(){
        this.doubleBtn.active = false;
        this.AniNode.active = true;
        this.limitTips.node.active = true;
        this.rewardName.string = "限定皮肤x1";
        this.rewardSprite.spriteFrame = this.rewardSpriteFrame[7];
        this.rewardSprite.node.setScale(1);
    },

    onComplete:function(){
        //获得限时皮肤
        // Global.game.showDialogPropText('恭喜获得限时出售皮肤');
        Global.storeData = ThirdAPI.loadInfo('skinstore');
        if (Global.storeData.indexOf("106") == -1){
            var indexs = (6 + 1 * 100) + "";
            Global.storeData.push(indexs);
            ThirdAPI.saveInfo('skinstore', Global.storeData);
            this.getLimitSkip();
            this.updatePercent();
            Global.skinIndex = 6;
            ThirdAPI.saveCurrentSkin(Global.skinIndex);
            Global.startUIShare = true;
        }else {
            Global.game.showDialogPropText('已领取');
        }
    },

    onDestroy:function(){
        if (ctr.sxAdmanager && ctr.sxAdmanager.adIcon){
            ctr.sxAdmanager.show();
        }
        listenUtil.eventCtrl.removeListen('gerRewardAni', this.gerRewardAni.bind(this));
        listenUtil.eventCtrl.removeListen('updatePercent', this.updatePercent.bind(this));
    },

    update :function(dt) {
        if (this.AniNode.active) {
            this.light.rotation += 0.5;
        }
    },
});
