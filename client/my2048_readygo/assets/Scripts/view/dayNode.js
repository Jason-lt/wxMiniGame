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
        bg:cc.Node,
        number:cc.Label,
        selectBg:cc.Node,
        dayLabel:cc.Label,
        twoNode:cc.Node,
        threeNode:cc.Node,

        dayIndex:"",
        rewardSpr:cc.Sprite,
        rewardSpriteFrame:[cc.SpriteFrame],
    },

    onLoad:function(){
        listenUtil.eventCtrl.addListen('updateState', this.updateState.bind(this));
    },
    setDayIndex:function(index){
        var dayIndexList = ["一","二","三","四","五","六","七"];
        this.dayIndex = dayIndexList[index];
        if (index == 4){
            this.twoNode.active = true;
            this.rewardSpr.node.active = false;
        }else if(index == 5){
            this.threeNode.active = true;
            this.rewardSpr.node.active = false;
        }
        this.updateData();
    },
    updateData:function(){
        if (Global.singinRewardConfig){
            for (var key in Global.singinRewardConfig){
                if (key == this.dayIndex){
                    if (Global.singinRewardConfig[key].des){
                        this.setNumber(Global.singinRewardConfig[key].des);
                    }
                    this.setDayLabel();
                    var _getRewardList = ThirdAPI.loadGetRewardList();
                    console.log(" 登录 key = " + key);
                    if (Global.singinRewardConfig[key].index <= _getRewardList.length){
                        console.log("已领取index= " + Global.singinRewardConfig[key].index);
                        this.isGetReward(true);
                    }
                }
            }
        }
    },

    isGetReward:function(isSelect){
        if (isSelect) {
            this.bg.setOpacity(120);
            this.selectBg.active = true;
        }
    },

    setNumber:function(num){
        this.number.string = num;
        switch (num){
            case "富豪皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[0];
                this.rewardSpr.node.setScale(0.3);
                break;
            case "甄嬛传皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[1];
                this.rewardSpr.node.setScale(0.3);
                
                break;
            case "脑残版皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[2];
                this.rewardSpr.node.setScale(0.3);
                break;
            case "扑克版皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[4];
                this.rewardSpr.node.setScale(0.3);
                break;
            case "复仇版皮肤":
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[3];
                this.rewardSpr.node.setScale(0.3);
                break;
        }
    },

    setDayLabel:function(){
        this.dayLabel.string = "第" + this.dayIndex + "天"
    },

    updateState:function(){
        this.updateData();
    },

    onDestroy:function(){
        listenUtil.eventCtrl.removeListen('updateState', this.updateState.bind(this));
    },


    // update (dt) {},
});
