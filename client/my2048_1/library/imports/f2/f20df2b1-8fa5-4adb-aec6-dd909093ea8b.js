"use strict";
cc._RF.push(module, 'f20dfKxj6VK267G3ZCQk+qL', 'rewardItem');
// Scripts/ui/rewardItem.js

'use strict';

var ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        //分享按钮
        shareBtn: {
            default: null,
            type: cc.Node
        },
        //可领取按钮
        canTakeBtn: {
            default: null,
            type: cc.Node
        },
        //已领取按钮
        takedBtn: {
            default: null,
            type: cc.Node
        },
        descLabel: {
            default: null,
            type: cc.Label
        },
        rewardLabel: {
            default: null,
            type: cc.Label
        },
        parma: null,
        targetUserId: 0 //领取自己链接被点之后的用户id

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    setInfo: function setInfo(parma) {
        this.targetUserId = 0;
        this.parma = parma;
        //格式化字符串
        var desc = parma.desc;
        var inviteNum = parma.inviteTotalNum;
        var str = desc.replace('{0}', inviteNum);
        var progress = 0;
        if (Global.tcpData.clickItems) {
            progress = parseInt(Global.tcpData.clickItems.length) > parseInt(this.parma.inviteTotalNum) ? parseInt(this.parma.inviteTotalNum) : parseInt(Global.tcpData.clickItems.length);
        }
        str += '(' + progress + '/' + parseInt(this.parma.inviteTotalNum) + ')';

        this.descLabel.string = str;
        this.rewardLabel.string = parseInt(parma.rewardNum);

        this.shareBtn.active = false;
        this.canTakeBtn.active = false;
        this.takedBtn.active = false;

        //按钮显示状态
        if (Global.tcpData.clickItems) {
            //
            var index = parseInt(this.parma.id) - 1;
            var targetUser = Global.tcpData.clickItems[index];
            if (targetUser) {
                if (parseInt(targetUser.isGet) > 0) {
                    this.takedBtn.active = true;
                } else {
                    this.canTakeBtn.active = true;
                    this.targetUserId = parseInt(targetUser.userId);
                }
            } else {
                this.shareBtn.active = true;
            }
        } else {
            this.shareBtn.active = true;
        }
    },

    //分享
    onShareGame: function onShareGame() {
        Global.game.playSound('btn', 0.1);

        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), null);
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), null, '244');
        }
    },

    onShareSuccess: function onShareSuccess() {
        //游戏好友互助分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.rewardShare, null);
    },

    //领取
    takeReward: function takeReward() {
        if (this.targetUserId <= 0 || !Global.tcpData.clickItems) {
            Global.game.showDialogPropText('不能领取奖励');
            return;
        }
        //tcpManager.sendCmd.sendFetchClickReward(this.targetUserId);
    },

    //邀请按钮触发
    inviteFriend: function inviteFriend() {}

});

cc._RF.pop();