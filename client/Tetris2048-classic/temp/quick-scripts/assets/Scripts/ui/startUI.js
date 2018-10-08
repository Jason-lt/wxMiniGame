(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/startUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bca9aXCN59LNZb12NxU6UO1', 'startUI', __filename);
// Scripts/ui/startUI.js

'use strict';

var ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            default: null,
            type: cc.Label
        },
        icon: {
            default: null,
            type: cc.Sprite
        },
        bg: {
            default: null,
            type: cc.Sprite
        },
        //随机钻石预设
        gemStone: {
            default: null,
            type: cc.Prefab
        },
        friendBtn: {
            default: null,
            type: cc.Node
        },
        //金币节点
        goldNode: {
            default: null,
            type: cc.Node
        },
        spriteMoreGame: {
            default: null,
            type: cc.Sprite
        },
        videoNode: {
            default: null,
            type: cc.Node
        },
        //背景音乐
        backgroundAudio: {
            url: cc.AudioClip,
            default: null
        },
        currentBGM: -1,

        // 红点
        reddot: {
            default: null,
            type: cc.Node
        },

        //复活币界面
        reviveCoinUI: {
            default: null,
            type: cc.Node
        },
        labelReviveCoin: {
            default: null,
            type: cc.Label
        }
    },

    start: function start() {
        this.init();
        this.initAudio();
        //this.reddot.active = false;
    },

    init: function init() {
        ThirdAPI.showGameClub(true);
        this.updateBestScore();
        this.icon.spriteFrame.getTexture().setAliasTexParameters();
        this.bg.spriteFrame.getTexture().setAliasTexParameters();

        // 复活币界面
        this.reviveCoinUI.active = false;
        this.labelReviveCoin.string = 'X' + Global.gameinfo.reviveCoinNum;

        //显示星星
        var time = new Date().getTime() - Global.gameinfo.shareTime;
        console.log("索取次数判断：", Global.gameinfo.shareTotalTimes, Global.dailyTotalTimes, time);

        //cdn判断
        //总开关判断
        /*
        if (Global.cdnGameConfig.totalSwith) {
            this.friendBtn.active = false;
        } else {
            //分数开关判断
            if (Global.cdnGameConfig.startScoreSwith) {
                //判断分数
                console.log('判断分数：', Global.cdnGameConfig.startScoreLimit, Global.wxScore);
                var canShow = Global.wxScore > Global.cdnGameConfig.startScoreLimit ? true : false;
                console.log('首页索取按钮判断--canShow:', canShow, Global.gameinfo.shareTotalTimes, time);
                this.friendBtn.active = (canShow && Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
            } else {
                console.log('设置好友索取按钮状态');
                this.friendBtn.active = (Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
            }
        }
        */

        //this.friendBtn.active = (!Global.Gameversion && Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
        this.updateGold(0);
        //this.moreGameRunAction();
        this.videoRunAction();

        this.videoNode.active = Global.gameinfo.videoData.Num < 3;
    },

    updateReviveCoin: function updateReviveCoin() {
        this.labelReviveCoin.string = 'X' + Global.gameinfo.reviveCoinNum;
    },

    moreGameRunAction: function moreGameRunAction() {
        this.spriteMoreGame.node.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(0.1, 10), cc.rotateBy(0.2, -20), cc.rotateBy(0.2, 20), cc.rotateBy(0.2, -20), cc.rotateBy(0.1, 10), cc.delayTime(2))));
    },

    videoRunAction: function videoRunAction() {
        this.videoNode.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(0.1, 10), cc.rotateBy(0.2, -20), cc.rotateBy(0.2, 20), cc.rotateBy(0.2, -20), cc.rotateBy(0.1, 10), cc.delayTime(2))));
    },

    //初始化音乐
    initAudio: function initAudio() {
        /*
        this.currentBGM = cc.audioEngine.play(this.backgroundAudio, false, 0.2);
        cc.audioEngine.setLoop(this.currentBGM, true);
        cc.audioEngine.setVolume(this.currentBGM, 0.2);
        var volume = cc.audioEngine.getVolume(this.currentBGM);
        console.log('currentBGM volume is ' + volume);
        Global.isBGMPlaying = true;
        */
    },

    // 显示提示红点
    showRedDot: function showRedDot(ret) {
        //this.reddot.active = ret;
    },

    //更新星星的数量
    updateGold: function updateGold(num) {
        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;

        Global.wxGold += parseInt(num);
        console.log('1 :' + num, Global.wxGold);
        //更新并存储
        if (typeof wx !== 'undefined') {
            var data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore(function (maxscore, gold) {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('gridController on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
            });
            ThirdAPI.saveScore(score, Global.wxGold);
        }

        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;
    },

    //更新分数
    updateBestScore: function updateBestScore() {
        if (typeof wx !== 'undefined') {
            var data = ThirdAPI.loadLocalScore();
            Global.wxScore = parseInt(data.maxscore);
            Global.wxGold = parseInt(data.gold);
            ThirdAPI.loadScore(function (maxscore, gold) {
                Global.wxScore = parseInt(maxscore);
                Global.wxGold = parseInt(gold);
                console.log('on ThirdAPI loadScore', Global.wxScore + " :: " + Global.wxGold);
            });
            this.score.string = "最高分:" + Global.wxScore;
        } else if (typeof FBInstant !== 'undefined') {
            this.score.string = "High score:" + Global.fbScore;
        }
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function onShareGame() {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '003');
        } else {
            Global.game.showDialogText('索取失败，必须分享到不同微信群', {
                x: 0,
                y: 20
            });
            this.onShareSuccess();
        }
    },

    onShareSuccess: function onShareSuccess(openGId) {
        //return;

        if (Global.cdnGameConfig.totalSwith) {
            return;
        }

        if (typeof wx !== 'undefined') {
            if (!openGId) {
                Global.game.showDialogText('索取失败，必须分享到不同微信群', {
                    x: 0,
                    y: 20
                });
                console.log('索取失败，必须分享到不同微信群');
                return;
            }
        }

        if (Global.gameinfo.shareData1.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群今日已经分享过', openGId);
            Global.game.showDialogText('该群今日已经分享过无法获得奖励');
            return;
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData1.arrOpenGId.push(openGId);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        //判断是否是当日(向朋友索取),防止凌晨状态
        console.log('startUI onshareSuccess:', Global.gameinfo.shareDate, new Date().toDateString());
        if (Global.gameinfo.shareDate != new Date().toDateString()) {
            var d = new Date(Date.now());
            Global.gameinfo.shareTimes = 0;
            Global.gameinfo.shareTotalTimes = 0;
            Global.gameinfo.shareTime = 0;
            Global.gameinfo.shareDate = d.toDateString();

            Global.gameinfo.shareData1 = {
                shareDate: d.toDateString(),
                arrOpenGId: []
            };
            Global.gameinfo.shareData2 = {
                shareDate: d.toDateString(),
                arrOpenGId: []
            };
            Global.gameinfo.shareData3 = {
                shareDate: d.toDateString(),
                arrOpenGId: []
            };
            ThirdAPI.loadFriendGenStoneInfo(Global.gameinfo);
        }
        Global.gameinfo.shareTimes++;

        //先判断5次机会，再判断每日总次数3次
        if (Global.gameinfo.shareTimes >= Global.getForTotalTimes) {
            console.log('次数已满', Global.gameinfo.shareTimes);
            //5次已满
            Global.gameinfo.shareTimes = 0;
            Global.gameinfo.shareTotalTimes++;
            Global.gameinfo.shareTime = new Date().getTime();
        }
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        var time = new Date().getTime() - Global.gameinfo.shareTime;
        console.log('分享成功的时间：', new Date().getTime(), Global.gameinfo.shareTime, time);
        //this.friendBtn.active = (Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
        //钻石
        this.createGemstone();
    },

    //分享到群失败
    onShareFail: function onShareFail() {
        return;
        console.log('向好友索取失败');
        //Global.game.showDialogText('索取失败，必须分享到不同微信群');
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame1: function onShareGame1() {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onShareSuccess1.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess1.bind(this), this.onShareFail1.bind(this), '003');
        } else {
            Global.game.showDialogText('索取失败，必须分享到不同微信群', {
                x: 0,
                y: 20
            });
            this.onShareSuccess1();
        }
    },

    onShareSuccess1: function onShareSuccess1(openGId) {},

    //分享到群失败
    onShareFail1: function onShareFail1() {
        return;
    },

    //创建随机掉落的钻石
    createGemstone: function createGemstone() {
        var myUtil = require('myUtil');
        var randomNum = myUtil.randomForArray(Global.randomGemStone);
        for (var i = 0; i < randomNum; i++) {
            var instance = cc.instantiate(this.gemStone);
            var posX = myUtil.randomForMinAndMax(-Global.screenHeight / 2 + 100, Global.screenHeight / 2 - 100);
            var posY = myUtil.randomForMinAndMax(-Global.screenWidth / 2 + 100, Global.screenWidth / 2 - 100);
            console.log('gemStone pos:', posX, posY);
            instance.setPosition(cc.p(0, Global.screenHeight / 2 + 50));
            var action = cc.moveTo(2, cc.p(posX, posY)).easing(cc.easeElasticOut(1));
            this.node.addChild(instance);
            instance.runAction(action);
        }
    },

    //进入游戏
    play: function play() {
        Global.game.playSound('btn', 0.1);
        ThirdAPI.showGameClub(false);
        Global.game.enterScene();
    },

    //进入排行榜
    showGroupRankUI: function showGroupRankUI() {
        Global.game.playSound('btn', 0.1);
        ThirdAPI.showGameClub(false);
        Global.toRankPoint = 1;
        Global.game.showRank(true);
    },

    //进入排行榜
    showFriendRankUI: function showFriendRankUI() {
        Global.game.playSound('btn', 0.1);
        ThirdAPI.showGameClub(false);
        Global.toRankPoint = 1;
        Global.game.showRank(false);
    },

    //皮肤商城
    onShowStore: function onShowStore() {
        Global.game.playSound('btn', 0.1);
        /*
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64());
        } else {
            ThirdAPI.shareGame();
        }*/
        //Global.game.showStore();
        //Global.game.showTitle();
        ThirdAPI.showGameClub(false);
        Global.game.showStore();
    },

    //复活币界面
    onReviveCoinUI: function onReviveCoinUI() {
        Global.game.playSound('btn', 0.1);

        this.reviveCoinUI.active = true;
        ThirdAPI.showGameClub(false);
    },

    //关闭复活币界面
    onCloseReviveCoinUI: function onCloseReviveCoinUI() {
        Global.game.playSound('btn', 0.1);

        this.reviveCoinUI.active = false;
        ThirdAPI.showGameClub(true);
    },

    // 按钮回调：赠送复活币
    onGiveReviveCoin: function onGiveReviveCoin() {
        Global.game.playSound('btn', 0.1);

        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onGiveReviveCoinSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onGiveReviveCoinSuccess.bind(this), this.onGiveReviveCoinFail.bind(this), '006');
        } else {
            Global.game.showDialogText('索取失败，必须分享到不同微信群', {
                x: 0,
                y: 20
            });
            this.onShareSuccess();
        }
    },

    onGiveReviveCoinSuccess: function onGiveReviveCoinSuccess(openGId) {
        console.log('赠送一个复活币！');
        //this.playGetGoldEffect();
        Global.game.showDialogTextAlawys("赠人玫瑰，手有余香!");
    },
    onGiveReviveCoinFail: function onGiveReviveCoinFail() {},

    //pk竞技
    onChallenge: function onChallenge() {
        Global.game.playSound('btn', 0.1);
        Global.shareUI.onChallenge();
    },

    // 按钮回调：更多游戏
    onMoreGame: function onMoreGame() {
        Global.game.playSound('btn', 0.1);
        var LinkImages = require('LinkImages');

        if (Global.linkImages && Global.linkImages.length > 0) {
            console.log('link image : ', Global.linkImages, Global.linkImages.length);

            var httpStr;
            while (1) {
                var index = Math.floor(cc.random0To1() * Global.linkImages.length);
                console.log('link image index : ', index);
                httpStr = Global.linkImages[index];
                var indexStr = httpStr.indexOf('2048');
                if (indexStr == -1) {
                    break;
                }
            }
            console.log('httpStr:', httpStr);
            LinkImages.previewImage(httpStr);
        }
    },

    // 按钮回调：赠送钻石
    onGiveGold: function onGiveGold() {
        Global.game.playSound('btn', 0.1);

        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onGiveGoldSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onGiveGoldSuccess.bind(this), this.onGiveGoldSuccess.bind(this), '005');
        } else {
            Global.game.showDialogText('索取失败，必须分享到不同微信群', {
                x: 0,
                y: 20
            });
            this.onShareSuccess();
        }
    },

    onGiveGoldSuccess: function onGiveGoldSuccess(openGId) {
        console.log('赠送一个宝箱！');
        //this.playGetGoldEffect();
    },
    onGiveGoldFail: function onGiveGoldFail() {},

    playGetGoldEffect: function playGetGoldEffect() {
        var _this = this;

        //console.log('===========>得钻石特效！');
        var times = 30;
        clearInterval(this.addInterval);
        this.addInterval = setInterval(function () {
            times -= 5;
            if (times >= 0) {
                //console.log('===========>得钻石特效i！');
                var instance = cc.instantiate(_this.gemStone);
                instance.setPosition(cc.p(0, 0));
                _this.node.addChild(instance);
                var pos = Global.startUI.goldNode.getPosition();
                instance.getComponent('getGemStone').toPosition([pos.x, pos.y], 5, 1);
            } else {
                clearInterval(_this.addInterval);
            }
        }, 150);
    },

    switchBGM: function switchBGM() {
        Global.game.playSound('btn', 0.1);
        var audioManager = require('audioManager');
        if (Global.isBGMPlaying) {
            //this.pauseBGM();
            audioManager.pauseBGM();
        } else {
            //this.playBGM();
            audioManager.resumeBGM();
        }
        Global.isBGMPlaying = !Global.isBGMPlaying;
    },

    playBGM: function playBGM() {
        if (this.currentBGM > -1) {
            cc.audioEngine.resume(this.currentBGM);
        }
    },

    pauseBGM: function pauseBGM() {
        if (this.currentBGM > -1) {
            cc.audioEngine.pause(this.currentBGM);
        }
    },

    onVideo: function onVideo() {
        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.videoCloseCallback.bind(this));
    },

    videoCloseCallback: function videoCloseCallback(isEnded) {
        console.log('===========>广告是否看完：', isEnded);
        if (isEnded) {
            if (Global.gameinfo.videoData.Num < 3) {
                Global.gameinfo.videoData.Num++;
                ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

                this.playGetGoldEffect();

                if (Global.gameinfo.videoData.Num >= 3) {
                    this.videoNode.active = false;
                }
            } else {
                Global.game.showDialogTextAlawys('领取钻石次数已达上限!');
            }
        }
    }
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
        //# sourceMappingURL=startUI.js.map
        