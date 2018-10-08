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
        propNumber: {
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
        myParticleSystem1: {
            default: null,
            type: cc.ParticleSystem,
        },
        myParticleSystem2: {
            default: null,
            type: cc.ParticleSystem,
        },
        flySprite: {
            default: null,
            type: cc.Sprite,
        },
        shareBtn: {
            default: null,
            type: cc.Node,
        },
        isChest: false, //是否是宝箱
        showText: '', //显示分享文字
        parmaIndex: -1, //传入的索引
        gridControllerScript: null,
        randomIndex: 0, //随机道具索引
        closeTimer: null,

        doubleNode:cc.Node,
        doubleToggle:cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {

    },

    onLoad:function(){
        ctr.sxAdmanager3.hide();
    },

    initData: function (isChest, showText, parmaIndex) {
        this.mainNode.active = true;
        this.successNode.active = false;
        this.flySprite.setVisible(false);

        var btnLabel = this.shareBtn.getChildByName('Label');
        // if (Global.cdnGameConfig && Global.cdnGameConfig.totalSwith) {
        //     this.shareBtn.width = 230;
        //     btnLabel.getComponent(cc.Label).string = "免费获得";
        //     this.doubleNode.active = true;
        // } else {
        //     this.shareBtn.width = 300;
        //     btnLabel.getComponent(cc.Label).string = "看视频得道具";
        //     this.doubleNode.active = false;
        // }

        if (Global.cdnGameConfig && Global.cdnGameConfig.totalSwith) {
            this.shareBtn.width = 230;
            btnLabel.getComponent(cc.Label).string = "免费获得";
            // this.doubleNode.active = true;
        } else {
            this.shareBtn.width = 300;
            btnLabel.getComponent(cc.Label).string = "看视频得道具";
            // this.doubleNode.active = false;
        }

        if (Global.gridController) {
            this.gridControllerScript = Global.gridController.getComponent("gridController");
            this.gridControllerScript.onPauseGameForOther();
        } 

        var callback = cc.callFunc(function () {
            this.isChest = isChest;
            this.showText = showText;
            this.parmaIndex = parmaIndex;
            this.title.string = this.isChest ? '获得免费道具' : "道具";
            if (this.isChest) {
                this.showChest();
            } else {
                this.randomProp();
            }
        }, this);

        this.mainNode.scale = 0.5;
        var finished = cc.callFunc(this.chestRunAction, this);
        var spawnAction = cc.sequence(callback, cc.scaleTo(0.3, 1.08), cc.scaleTo(0.1, 1), finished);
        this.mainNode.runAction(spawnAction);

        // this.myParticleSystem1.resetSystem();
        setTimeout(() => {
            // this.myParticleSystem2.resetSystem();
        }, 500);

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

    chestRunAction: function () {
        this.chest.node.runAction(
            cc.repeatForever(
                cc.sequence(cc.rotateBy(0.1, 10), cc.rotateBy(0.2, -20), cc.rotateBy(0.2, 20), cc.rotateBy(0.2, -20), cc.rotateBy(0.1, 10), cc.delayTime(2)))
        );
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

        var propSpr = "chest";
        if (self.randomIndex == 0) {
            propSpr = "clear_spr";
        }else if (self.randomIndex == 1) {
            propSpr = "super_spr";
        }
        var LoadAtlas = require("LoadAtlas");
        LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            var LoadAtlas = require("LoadAtlas");
            self.chest.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", propSpr);

            var rect = self.chest.spriteFrame.getRect();
            self.chest.node.width = rect.width;
            self.chest.node.height = rect.height;
            self.chest.node.scale = 1.5;
        });

        this.propName.string = "";
        this.propNum.string = "";

        var prop_parma = Global.randomPropInfo[this.randomIndex];
        // if (Global.getPropMethod && Global.getPropMethod.type == "share") {
        //     this.propNumber.string = "x1";
        // } else {
        //     this.propNumber.string = "x" + parseInt(prop_parma.gainAddPropNum);
        // }
        this.propNumber.string = "x" + parseInt(prop_parma.gainAddPropNum);

        //文字显示
        // var prop_parma = Global.randomPropInfo[self.randomIndex];
        // if (prop_parma) {
        //     if (this.showText && this.showText != '') {
        //         self.propInfo.string = this.showText;
        //     } else {
        //         self.propInfo.string = prop_parma.name + '宝箱藏，送给群友尝一尝'; //'恭喜获得' + prop_parma.name + '宝箱！可以免费送给朋友们！';
        //     }
        // }
        self.propInfo.string = '恭喜获得免费道具\n快来领取吧';
    },

    onShargeGame: function () {
        Global.game.playSound('btn', 0.1);
        this.isShareDouble = true;
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
            if (Global.cdnGameConfig && Global.cdnGameConfig.totalSwith) {
                // if (this.doubleToggle.isChecked) {
                    ThirdAPI.shareGame(img, this.onShareSuccess.bind(this), this.onShareFailed.bind(this), sourceCode);
                // }else {
                //     this.isShareDouble = false;
                //     this.onAdSuccess();
                // }


            } else {
                var wxRewardVideoAd = require('wxRewardVideoAd');
                wxRewardVideoAd.initCreateReward(this.onAdSuccess.bind(this), this.onAdFail.bind(this));
            }
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
            Global.game.showDialogText('该群今天已打扰过了,换个群试试');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData1.arrOpenGId.push(openGId);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        this.onAdSuccess();
    },

    //看视频成功得道具
    onAdSuccess: function () {
        //设置全屏的按钮
        let canvas = cc.find('Canvas');
        var button = this.successNode.getChildByName('button');
        if (button) {
            button.width = canvas.width;
            button.width = canvas.width;
        }
        this.playLightAction();

        //
        if (!this.isShareDouble) {
            var biManager = require('biManager');
            biManager.bilog(biManager.getProp, null);
        }

        this.mainNode.active = false;
        this.successNode.active = true;
        var prop_parma = Global.randomPropInfo[this.randomIndex];
        console.log('分享成功', prop_parma.name, parseInt(prop_parma.gainAddPropNum));
        //增加道具
        if (prop_parma) {
            if (this.randomIndex == 0) {
                if (!this.isShareDouble){
                    Global.gameinfo.clearPropNum += 1;
                }else {
                    Global.gameinfo.clearPropNum += parseInt(prop_parma.gainAddPropNum);
                }

            } else if (this.randomIndex == 1) {
                if (!this.isShareDouble){
                    Global.gameinfo.superPropNum += 1;
                }else {
                    Global.gameinfo.superPropNum += parseInt(prop_parma.gainAddPropNum);
                }

            } else if (this.randomIndex == 2) {
                if (!this.isShareDouble){
                    Global.gameinfo.doublePropNum += 1;
                }else {
                    Global.gameinfo.doublePropNum += parseInt(prop_parma.gainAddPropNum);
                }

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

            if (!this.isShareDouble){
                self.gainPropName.string = prop_parma.name + 'x1';
            }else {
                self.gainPropName.string = prop_parma.name + 'x' + prop_parma.gainAddPropNum;
            }

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

    onAdFail: function (isFail) {
        if(Global.cdnGameConfig.videoChangeShare && isFail) {
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
        }else {
            // Global.game.showDialogPropText('观看完整视频获得道具');
        }
    },

    onShareFailed: function (msg) {
        if (msg === undefined) {
            Global.game.showDialogText('分享失败！');
        } else if (msg == 'fail') {
            Global.game.showDialogText('该群今天已打扰过了,换个群试试');
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

    //缩放消失效果
    scaleToClose: function () {
        /*var scaleAction = cc.scaleTo(0.3, 0);
        var callback = cc.callFunc(this.onClose, this);
        this.node.runAction(cc.sequence(scaleAction,callback));*/
        //this.propFly();
    },

    propFly: function () {
        var prop_parma = Global.randomPropInfo[this.randomIndex];
        if (prop_parma) {
            var self = this;
            var LoadAtlas = require("LoadAtlas");
            LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
                var LoadAtlas = require("LoadAtlas");
                self.flySprite.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", prop_parma.addPropSprite);
            });
        }

        var gridControllerScript = Global.gridController.getComponent("gridController");
        //层级组件的位置
        var layoutPos = gridControllerScript.propLayout.getPosition();
        if (layoutPos) {
            var propPos = cc.p(0, 0);
            if (this.randomIndex == 0 && gridControllerScript.clearUseNumNode.parent) {
                toPos = gridControllerScript.clearUseNumNode.parent.getPosition();
            } else if (this.randomIndex == 1 && gridControllerScript.superUseNumNode.parent) {
                toPos = gridControllerScript.superUseNumNode.parent.getPosition();
            }
        }


        var toPos = cc.p(0, 200);
        if (this.randomIndex == 0 && gridControllerScript.clearUseNumNode.parent) {
            toPos = gridControllerScript.clearUseNumNode.parent.getPosition();
        } else if (this.randomIndex == 1) {
            toPos = gridControllerScript.superUseNumNode.getPosition();
        }
        this.flySprite.node.setPosition(cc.p(0, 0));

        var flyAction = cc.moveTo(2, cc.p(-260, 432));
        var hideAction = cc.fadeTo(0, 0);
        // var callback = cc.callFunc(this.removeNode, this);

        this.flySprite.node.runAction(cc.sequence(flyAction, hideAction));


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
        this.removeNode();
        // //创建广告
        // var wxBannerAd = require('wxBannerAd');
        // wxBannerAd.createBannerAd();

        //     }, this);

        //     var spawnAction = cc.sequence(cc.scaleTo(0.2, 0.7), callback);
        //     this.mainNode.runAction(spawnAction);
        
    },

    removeNode: function () {
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        if (Global.propInfoUI && Global.propInfoUI.node && Global.propInfoUI.node.parent) {
            Global.propInfoUI.node.parent.removeChild(Global.propInfoUI.node);
        }
        this.node.destroy();
        Global.propInfoUI = null;
    },

    onDestroy:function(){
        if (ctr.sxAdmanager3.adIcon) {
            ctr.sxAdmanager3.show();
        }
    },
});