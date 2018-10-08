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
        mainNode: {
            default: null,
            type: cc.Node,
        },
        successNode: {
            default: null,
            type: cc.Node,
        },
        titleLabel: {
            default: null,
            type: cc.Label,
        },
        propSprite: {
            default: null,
            type: cc.Sprite,
        },
        propNum: {
            default: null,
            type: cc.Label,
        },
        propDesc: {
            default: null,
            type: cc.Label,
        },
        light: {
            default: null,
            type: cc.Sprite,
        },
        gainPropIcon: {
            default: null,
            type: cc.Sprite,
        },
        gainPropName: {
            default: null,
            type: cc.Label,
        },
        parma: null,
        showText: '', //显示分享文字
        parmaIndex: -1, //传入的索引
        gridControllerScript: null,
        closeTimer: null,
    },

    onLoad:function(){
        ctr.sxAdmanager3.hide();
    },

    //初始化分享获得道具数据
    initData: function (parma) {
        this.mainNode.active = true;
        this.successNode.active = false;

        this.parma = parma;
        this.parmaIndex = parma.parmaIndex;

        this.setInfo();
    },

    //
    setInfo: function () {
        this.pauseGame();
        //文字显示
        var prop_parma = Global.randomPropInfo[this.parmaIndex];
        if (prop_parma) {
            this.titleLabel.string = prop_parma.name;

            var self = this;
            var LoadAtlas = require("LoadAtlas");
            LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
                var LoadAtlas = require("LoadAtlas");
                self.propSprite.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", prop_parma.addPropSprite);
            });
            self.propNum.string = 'x' + prop_parma.gainAddPropNum;
            this.propDesc.string = prop_parma.desc;
        }
    },

    pauseGame: function () {
        if (Global.gridController) {
            this.gridControllerScript = Global.gridController.getComponent("gridController");
            this.gridControllerScript.onPauseGameForOther();
        }
    },

    playLightAction: function () {
        this.light.node.runAction(
            cc.repeatForever(
                cc.sequence(cc.rotateBy(0.3, -90), cc.rotateBy(0.3, -90), cc.rotateBy(0.3, -90), cc.rotateBy(0.3, -90)))
        );
    },

    //自己分享得道具
    onShargeGame: function () {
        Global.game.playSound('btn', 0.1);
        var myUtil = require('myUtil');
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(myUtil.getImgBase64(), null);
        } else if (typeof wx !== 'undefined') {
            var sourceCode = '028';
            if (this.parmaIndex == 1) {
                sourceCode = '029';
            }
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFailed.bind(this), sourceCode);
        } else {
            console.log('测试分享');
            this.onShareSuccess();
        }
    },

    onShareSuccess: function (openGId) {
        console.log('分享成功');
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

        //设置全屏的按钮
        let canvas = cc.find('Canvas');
        var button = this.successNode.getChildByName('button');
        if (button) {
            button.width = canvas.width;
            button.width = canvas.width;
        }
        this.playLightAction();

        this.mainNode.active = false;
        this.successNode.active = true;
        var prop_parma = Global.randomPropInfo[this.parmaIndex];
        //增加道具
        if (prop_parma) {
            if (this.parmaIndex == 0) {
                Global.gameinfo.clearPropNum += parseInt(prop_parma.gainAddPropNum);
                //游戏界面点击锤锤分享并成功
                var biManager = require('biManager');
                biManager.bilog(biManager.clearToShare, null);
            } else if (this.parmaIndex == 1) {
                Global.gameinfo.superPropNum += parseInt(prop_parma.gainAddPropNum);
                //游戏界面点击万能数字分享并成功
                var biManager = require('biManager');
                biManager.bilog(biManager.superToShare, null);
            } else if (this.parmaIndex == 2) {
                Global.gameinfo.doublePropNum += parseInt(prop_parma.gainAddPropNum);
            }
        }

        if (prop_parma) {
            this.titleLabel.string = prop_parma.name;

            var self = this;
            var LoadAtlas = require("LoadAtlas");
            LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
                var LoadAtlas = require("LoadAtlas");
                self.gainPropIcon.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", prop_parma.addPropSprite);
            });
            self.gainPropName.string = prop_parma.name + 'x' + prop_parma.gainAddPropNum;
        }
        //存储本地数据
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        if (this.gridControllerScript) {
            this.gridControllerScript.setPropSprite();
        }
        this.closeTimer = setTimeout(() => {
            this.onClose();
        }, 2000);
    },

    onShareFailed: function (msg) {
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

    // 按钮回调：关闭
    onClose: function () {
        Global.game.playSound('btn', 0.1);
        if (this.closeTimer !== null) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
        if (this.gridControllerScript) {
            console.log('恢复游戏');
            this.gridControllerScript.onPauseGameForOther();
        }
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        if (Global.addPropInfoUI && Global.addPropInfoUI.node && Global.addPropInfoUI.node.parent) {
            Global.addPropInfoUI.node.parent.removeChild(Global.addPropInfoUI.node);
        }
        this.node.destroy();
        Global.addPropInfoUI = null;

        // if (ctr.sxAdmanager3.adIcon) {
        //     ctr.sxAdmanager3.show();
        // }
    },

    onDestroy:function(){
        if (ctr.sxAdmanager3.adIcon) {
            ctr.sxAdmanager3.show();
        }
    },
});