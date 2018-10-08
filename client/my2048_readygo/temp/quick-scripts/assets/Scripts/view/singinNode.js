(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/view/singinNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9b0c7IMYVZFWYxDXQOAV7b6', 'singinNode', __filename);
// Scripts/view/singinNode.js

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

var ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        getRewardBtn: cc.Node,
        pageBg: cc.Node,
        layout_1: cc.Node,
        layout_2: cc.Node,
        dayNode: cc.Prefab,
        shareBtn: cc.Node
    },

    onLoad: function onLoad() {
        this.getRewardBtn.active = false;
        this.shareBtn.active = false;
        var _getRewardList = ThirdAPI.loadGetRewardList();
        if (_getRewardList.indexOf(Global.accumulateSingin) == -1) {
            this.getRewardBtn.active = true;
            if (Global.cdnGameConfig && Global.cdnGameConfig.totalSwith) {
                this.shareBtn.active = true;
            } else {
                this.shareBtn.active = false;
            }
        }

        var size = cc.director.getWinSize();
        var scene_scale = size.width / 640;
        this.pageBg.setScale(scene_scale);
        this.createDataNode();
    },

    createDataNode: function createDataNode() {
        for (var i = 0; i < 7; i++) {
            var dayNode = cc.instantiate(this.dayNode);
            var com = dayNode.getComponent("dayNode");
            com.setDayIndex(i);
            if (i < 3) {
                this.layout_1.addChild(dayNode);
            } else {
                this.layout_2.addChild(dayNode);
            }
        }
    },

    onClickGetReward: function onClickGetReward() {
        if (Global.singinRewardConfig) {
            for (var key in Global.singinRewardConfig) {
                var _getRewardList = ThirdAPI.loadGetRewardList();
                if (Global.singinRewardConfig[key].index == _getRewardList.length + 1) {
                    var _getRewardList = ThirdAPI.loadGetRewardList();
                    _getRewardList.push(Global.accumulateSingin);
                    var number = Global.singinRewardConfig[key].numer;
                    //领取当天奖励
                    if (Global.singinRewardConfig[key].des.indexOf("皮肤") >= 0) {
                        var skipList = ["数字皮肤", "富豪皮肤", "甄嬛传皮肤", "脑残版皮肤", "扑克版皮肤", "复仇版皮肤"];
                        var money = [0, 50, 150, 300, 500, 850];
                        var index = skipList.indexOf(Global.singinRewardConfig[key].des);

                        if (Global.storeData.indexOf(index + 100) == -1) {
                            Global.storeData.push(index + 1 * 100);
                            ThirdAPI.saveInfo('skinstore', Global.storeData);
                            var tips = "累积登录" + _getRewardList.length + "天" + "恭喜获得" + Global.singinRewardConfig[key].des;
                        } else {
                            var skin_money = money[index] || 0;
                            var tips = "累积登录" + _getRewardList.length + "天" + "奖励已自动转换为星星" + skin_money;
                            Global.startUI.updateGold(skin_money);
                        }
                    } else {
                        if (this.shareDouble) {
                            number = number * 2;
                        }
                        var tips = "累积登录" + _getRewardList.length + "天" + "恭喜获得星星" + number;
                        Global.startUI.updateGold(number);
                    }
                    Global.game.showDialogPropText(tips);
                    this.getRewardBtn.active = false;
                    this.shareBtn.active = false;

                    ThirdAPI.saveGetRewardList(_getRewardList);

                    listenUtil.eventCtrl.trigger('updateState', null);
                    break;
                }
            }
        }

        this.shareDouble = false;
    },

    onShareDouble: function onShareDouble() {
        this.shareDouble = false;
        if (Global.cdnGameConfig && Global.cdnGameConfig.totalSwith) {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '247');
        } else {
            this.onClickGetReward();
        }
    },

    onShareSuccess: function onShareSuccess(openGId) {
        if (typeof wx !== 'undefined') {
            if (!openGId) {
                Global.game.showDialogText('分享失败，分享到群才有效');
                console.log('分享失败，分享到群才有效');
                return;
            }
        }
        if (Global.gameinfo.shareData1.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群今日已经分享过', openGId);
            Global.game.showDialogText('分享失败，请分享到不同群');
            return;
        } else {
            console.log('该群未分享过', openGId);
            this.shareDouble = true;
            this.onClickGetReward();
        }
    },

    onShareFail: function onShareFail(msg) {
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

    onClose: function onClose() {
        this.node.destroy();
        Global.singinUI = null;
    }

    // update (dt) {},
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
        //# sourceMappingURL=singinNode.js.map
        