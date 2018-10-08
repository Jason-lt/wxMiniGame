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
        gainPropIcon: {
            default: null,
            type: cc.Sprite,
        },
        gainPropName: {
            default: null,
            type: cc.Label,
        },
        light: {
            default: null,
            type: cc.Sprite,
        },
        propSprite: {
            default: null,
            type: cc.Sprite,
        },
        propName: {
            default: null,
            type: cc.Label,
        },
        propNum: {
            default: null,
            type: cc.Label,
        },
        propInfo: {
            default: null,
            type: cc.Label,
        },
        chest: {
            default: null,
            type: cc.Sprite,
        },
        title: {
            default: null,
            type: cc.Label,
        },
        isChest: false, //是否是宝箱
        showText: '', //显示分享文字
        parmaIndex: -1, //传入的索引
        gridControllerScript: null,
        randomIndex: 0, //随机道具索引
        closeTimer: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    initData: function (isChest, showText, parmaIndex) {
        this.mainNode.active = true;
        this.successNode.active = false;

        if (Global.gridController) {
            this.gridControllerScript = Global.gridController.getComponent("gridController");
            this.gridControllerScript.onPauseGameForOther();
        }

        var callback = cc.callFunc(function () {
            this.isChest = isChest;
            this.showText = showText;
            this.parmaIndex = parmaIndex;
            this.title.string = this.isChest ? '获得免费宝箱' : "道具";
            if (this.isChest) {
                this.showChest();
            } else {
                this.randomProp();
            }
        }, this);

        this.mainNode.scale = 0.5;
        var spawnAction = cc.sequence(callback, cc.scaleTo(0.3, 1.08), cc.scaleTo(0.1, 1));
        this.mainNode.runAction(spawnAction);



        /*var callback = cc.callFunc(function () {
            if (Global.gridController) {
                this.gridControllerScript = Global.gridController.getComponent("gridController");
                this.gridControllerScript.onPauseOrResume();
            }
            this.isChest = isChest;
            this.showText = showText;
            this.parmaIndex = parmaIndex;
            this.title.string = this.isChest ? '藏宝箱' : "道具";
            if (this.isChest) {
                this.showChest();
            } else {
                this.randomProp();
            }

        }, this);*/
        //var spawnAction = cc.spawn(cc.sequence(cc.scaleBy(2, 2), cc.scaleTo(2, 1)));
        // var callback = cc.callFunc(function () {
        //     cc.scaleTo(0.1, 0.8, 1.2),
        // },this);

        /* this.mainNode.scale = 0.5;
         var spawnAction = cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.25, 1));
         this.mainNode.runAction(spawnAction);*/


        /*if (Global.gridController) {
            this.gridControllerScript = Global.gridController.getComponent("gridController");
            this.gridControllerScript.onPauseOrResume();
        }
        this.isChest = isChest;
        this.showText = showText;
        this.parmaIndex = parmaIndex;
        this.title.string = this.isChest ? '藏宝箱' : "道具";
        if (this.isChest) {
            this.showChest();
        } else {
            this.randomProp();
        }*/
    },

    //动画
    playScale: function () {
        var callback = cc.callFunc(function () {
            if (Global.gridController) {
                this.gridControllerScript = Global.gridController.getComponent("gridController");
                this.gridControllerScript.onPauseGameForOther();
            }
            this.isChest = isChest;
            this.showText = showText;
            this.parmaIndex = parmaIndex;
            this.title.string = this.isChest ? '藏宝箱' : "道具";
            if (this.isChest) {
                this.showChest();
            } else {
                this.randomProp();
            }

        }, this);
        var spawnAction = cc.spawn(cc.sequence(cc.scaleTo(0, 0.5), cc.scaleTo(0.5, 1)));
        this.node.runAction(spawnAction, callback);
    },

    //随机道具显示
    randomProp: function () {
        this.propSprite.setVisible(true);
        this.chest.setVisible(false);
        var myUtil = require('myUtil');
        this.randomIndex = myUtil.randomForArray(Global.randomPropCode);
        if (this.parmaIndex != -1) {
            console.log('传入的道具索引：' + this.parmaIndex);
            this.randomIndex = this.parmaIndex;
        }
        console.log('randomIndex:' + this.randomIndex);

        var name = 'clear_spr';
        var propNum = 0;
        if (this.randomIndex == 0) {
            name = 'chest_clesr';
            propNum = Global.gameinfo.clearPropNum;
        } else if (this.randomIndex == 1) {
            name = 'chest_super';
            propNum = Global.gameinfo.superPropNum;
        } else if (this.randomIndex == 2) {
            name = 'chest_double';
            propNum = Global.gameinfo.doublePropNum;
        }

        var self = this;
        var LoadAtlas = require("LoadAtlas");
        LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            var LoadAtlas = require("LoadAtlas");
            self.propSprite.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", name);
        });

        //文字显示
        var prop_parma = Global.randomPropInfo[self.randomIndex];
        if (prop_parma) {
            this.propName.string = prop_parma.name;
            this.propInfo.string = prop_parma.desc;

            this.propNum.string = 'x' + propNum;
            if (propNum > 0) {
                this.propNum.node.color = new cc.Color(158, 107, 70);
            } else {
                this.propNum.node.color = new cc.Color(204, 33, 33);
            }
        }
    },

    //显示宝箱弹框    
    showChest: function () {
        var self = this;
        self.propSprite.setVisible(false);
        self.chest.setVisible(true);
        var myUtil = require('myUtil');
        self.randomIndex = myUtil.randomForArray(Global.randomPropCode);
        self.randomIndex = myUtil.randomForArray([0, 1]);
        console.log('randomIndex:' + self.randomIndex);

        var LoadAtlas = require("LoadAtlas");
        LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            var LoadAtlas = require("LoadAtlas");
            self.chest.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", 'chest');

            var rect = self.chest.spriteFrame.getRect();
            self.chest.node.width = rect.width;
            self.chest.node.height = rect.height;
            self.chest.node.scale = 1;
        });

        this.propName.string = "";
        this.propNum.string = "";

        //文字显示
        // var prop_parma = Global.randomPropInfo[self.randomIndex];
        // if (prop_parma) {
        //     if (this.showText && this.showText != '') {
        //         self.propInfo.string = this.showText;
        //     } else {
        //         self.propInfo.string = prop_parma.name + '宝箱藏，送给群友尝一尝'; //'恭喜获得' + prop_parma.name + '宝箱！可以免费送给朋友们！';
        //     }
        // }
        self.propInfo.string = '你真棒！合出了顶级数字\n送你一个大礼包';
    },

    onShargeGame: function () {
        Global.game.playSound('btn', 0.1);
        var myUtil = require('myUtil');
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(myUtil.getImgBase64(), null);
        } else if (typeof wx !== 'undefined') {
            var sourceCode = '028';
            var img = 'randomImg';
            if (this.randomIndex == 0) {
                sourceCode = '028';
                img = '01';
            } else if (this.randomIndex == 1) {
                sourceCode = '029';
                img = '02';
            } else if (this.randomIndex == 2) {
                sourceCode = '300';
                img = '03';
            } else if (this.randomIndex == 4) {
                sourceCode = '137';
                img = 'randomImg';
            }
            ThirdAPI.shareGame(img, this.onShareSuccess.bind(this), this.onShareFailed.bind(this), sourceCode);
        } else {
            console.log('测试分享');
            this.onShareSuccess();
        }
    },

    onShareSuccess: function (openGId) {
        //游戏过程中通过宝箱分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.chestShare, null);

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
        var prop_parma = Global.randomPropInfo[this.randomIndex];
        console.log('分享成功', prop_parma.name, parseInt(prop_parma.gainAddPropNum));
        //增加道具
        if (prop_parma) {
            if (this.randomIndex == 0) {
                Global.gameinfo.clearPropNum += parseInt(prop_parma.gainAddPropNum);
            } else if (this.randomIndex == 1) {
                Global.gameinfo.superPropNum += parseInt(prop_parma.gainAddPropNum);
            } else if (this.randomIndex == 2) {
                Global.gameinfo.doublePropNum += parseInt(prop_parma.gainAddPropNum);
            } else if (this.randomIndex == 4) {
                Global.startUI.updateGold(parseInt(prop_parma.gainAddPropNum));
                var gridController = Global.gridController.getComponent('gridController');
                gridController.showGold();
            }
        }

        if (prop_parma) {
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

    playLightAction: function () {
        this.light.node.runAction(
            cc.repeatForever(
                cc.sequence(cc.rotateBy(0.3, -90), cc.rotateBy(0.3, -90), cc.rotateBy(0.3, -90), cc.rotateBy(0.3, -90)))
        );
    },

    // 按钮回调：关闭
    onClose: function () {
        Global.game.playSound('btn', 0.1);
        // this.mainNode.stopAllActions();
        // var callback = cc.callFunc(function () {
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
        if (Global.propInfoUI && Global.propInfoUI.node && Global.propInfoUI.node.parent) {
            Global.propInfoUI.node.parent.removeChild(Global.propInfoUI.node);
        }
        Global.propInfoUI = null;
        //     }, this);

        //     var spawnAction = cc.sequence(cc.scaleTo(0.2, 0.7), callback);
        //     this.mainNode.runAction(spawnAction);
    },
});