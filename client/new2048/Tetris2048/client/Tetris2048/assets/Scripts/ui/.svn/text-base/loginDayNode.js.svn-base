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
        bgSprite:cc.Sprite,
        rewardSpr:cc.Sprite,
        rewardSpriteFrame:[cc.SpriteFrame],
        getSelect:cc.Node,
        number:cc.Label,
        dayLabel:cc.Label,
        replace:cc.Node,
        getRewardBtn:cc.Node,
    },

    onLoad:function(){

    },

    updateState:function(state){
        this.getRewardBtn.active = false;
        if (state == 1){    //已领取
            this.bgSprite.spriteFrame = this.rewardSpriteFrame[8];
            this.getSelect.active = true;
            this.replace.active = false;
        }else if (state == 2) {     //补签
            this.bgSprite.spriteFrame = this.rewardSpriteFrame[8];
            this.getSelect.active = false;
            this.replace.active = true;
        }else { //未领取
            this.bgSprite.spriteFrame = this.rewardSpriteFrame[7];
            this.getSelect.active = false;
            this.replace.active = false;
        }
    },

    updateReward:function(index,inList){
        //{"day":"2018/9/22","number":8,"reward":"钻石","isMarket":"","dayDesc":"10.1"},
        this.number.string = "x" + Global.loginRewardConfig[index].number;
        this.dayLabel.string = Global.loginRewardConfig[index].dayDesc;
        if (Global.loginRewardConfig[index].isMarket == "red") {
            this.bgSprite.spriteFrame = this.rewardSpriteFrame[9];
        }
        this.updateRewardSpr(index);
        this.day = Global.loginRewardConfig[index].day;
        this.rewardIndex = index;
        // var dd = (new Date()).toLocaleDateString();
        // console.log('revive storage dd : ' + dd);
        var _list = ThirdAPI.loadGetRewardList();
        // var _date = (new Date()).toLocaleDateString();
        var _dates = new Date((new Date()).toDateString());

        var y = _dates.getFullYear();
        var m = _dates.getMonth()+1;
        var d = _dates.getDate();

        var _date = y+ "/" + m + "/" + d;

        tywx.LOGE(null,"file = [loginDayNode] fun = [updateReward] _date = " + _date);
        tywx.LOGE(null,"file = [loginDayNode] fun = [updateReward] Global.loginRewardConfig[index].day = " + Global.loginRewardConfig[index].day);
        if (_date == Global.loginRewardConfig[index].day) {  //当天
            if (_list.indexOf(_date) == -1) {
                this.updateState();
                this.getRewardBtn.active = true;
            }else {
                this.updateState(1);
            }
        }else if (this.changeDataArr(Global.loginRewardConfig[index].day) < this.changeDataArr(_date)){     //当天之前
            if (_list.indexOf(Global.loginRewardConfig[index].day) == -1) {
                this.updateState(2);
            }else {
                this.updateState(1);
            }
        }else {
            this.updateState();
        }

        if (!inList) {
            this.replace.active = false;
            this.getRewardBtn.active = false;
        }
    },

    changeDataArr:function(date){
        var dayArr = date.split("/");
        var timerArr = "";
        if (dayArr && dayArr.length > 0) {
            for (var i = 0; i < dayArr.length; i++){
                timerArr = timerArr + dayArr[i];
            }
        }
        return timerArr
    },

    updateRewardSpr:function(index){
        switch (Global.loginRewardConfig[index].reward){
            case "钻石":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[0];
                this.rewardSpr.node.setScale(1);
                break;
            case "道具":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[1];
                this.rewardSpr.node.setScale(1);
                this.rewardSpr.node.y = -10;
                break;
            case "富豪皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[2];
                this.rewardSpr.node.setScale(0.25);
                this.number.string = Global.loginRewardConfig[index].reward;
                break;
            case "甄嬛传皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[3];
                this.rewardSpr.node.setScale(0.25);
                this.number.string = Global.loginRewardConfig[index].reward;
                break;
            case "脑残版皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[4];
                this.rewardSpr.node.setScale(0.25);
                this.number.string = Global.loginRewardConfig[index].reward;
                break;
            case "扑克版皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[6];
                this.rewardSpr.node.setScale(0.25);
                this.number.string = Global.loginRewardConfig[index].reward;
                break;
            case "复仇版皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[5];
                this.rewardSpr.node.setScale(0.25);
                this.number.string = Global.loginRewardConfig[index].reward;
                break;
        }
    },

    //获得奖励
    getReward:function(day){

        // var _number = Global.loginRewardConfig[this.rewardIndex].number;
        // var _reward = Global.loginRewardConfig[this.rewardIndex].reward;

        var _list = ThirdAPI.loadGetRewardList();
        _list.push(day);
        ThirdAPI.saveGetRewardList(_list);

        listenUtil.eventCtrl.trigger('updatePercent',null);

        //领取当天奖励
        // if(_reward.indexOf("皮肤") >= 0){
        //     var skipList = ["数字皮肤","富豪皮肤","甄嬛传皮肤","脑残版皮肤","扑克版皮肤","复仇版皮肤"];
        //     var money = [0,50,150,300,500,850];
        //     var index = skipList.indexOf(_reward);
        //     if (Global.storeData.indexOf(index+100) == -1){
        //         Global.storeData.push(index + 1 * 100);
        //         ThirdAPI.saveInfo('skinstore', Global.storeData);
        //     }else {
        //         var skin_money = money[index] || 0;
        //         Global.startUI.updateGold(skin_money);
        //     }
        // }else if (_reward == "道具") {
        //     Global.gameinfo.clearPropNum += _number;
        //     ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        //     Global.gameinfo.superPropNum += _number;
        //     ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        // }else {
        //     Global.startUI.updateGold(_number);
        // }
    },

    //领取
    onGetRewardBtn:function(){
        var _list = ThirdAPI.loadGetRewardList();
        // var _date = (new Date()).toLocaleDateString();
        var _dates = new Date((new Date()).toDateString());

        var y = _dates.getFullYear();
        var m = _dates.getMonth()+1;
        var d = _dates.getDate();

        var _date = y+ "/" + m + "/" + d;
        if (_list.indexOf(_date) == -1) {
            listenUtil.eventCtrl.trigger('gerRewardAni', this.rewardIndex);
            this.getReward(_date);
        }
        this.updateState(1);
    },

    //补领
    onClickReplaceBtn:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.loginRewardReplace, null);
        if (Global.loginRewardDouble && Global.loginRewardDouble.type == "share") {
            this.onClickShare();
        }else {
            this.onSeeVideo();
        }
    },
    getReplaceReward:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.loginRewardReplaceSuccess, null);
        var _list = ThirdAPI.loadGetRewardList();
        if (_list.indexOf(this.day) == -1) {
            listenUtil.eventCtrl.trigger('gerRewardAni', this.rewardIndex);
            this.getReward(this.day);
        }
        this.updateState(1);
    },

    onSeeVideo:function(){
        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.seeVideoSuccess.bind(this), this.seeVideoFail.bind(this));
    },

    seeVideoSuccess:function(){
        this.getReplaceReward();
    },

    seeVideoFail:function(isFail){
        if(Global.cdnGameConfig.videoChangeShare && isFail) {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), '1127');
        }
    },

    onClickShare:function(){
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
        this.getReplaceReward();
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

    // update (dt) {},
});
