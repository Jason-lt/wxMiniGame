let ThirdAPI = require('../common/ThirdAPI')
let wxRewardVideoAd = require('../common/wxRewardVideoAd')
cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            default: null,
            type: cc.Label,
        },
        icon: {
            default: null,
            type: cc.Sprite,
        },
        bg: {
            default: null,
            type: cc.Sprite,
        },
        soundOnBtn: {
            default: null,
            type: cc.Node
        },
        soundOffBtn: {
            default: null,
            type: cc.Node
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
        friendBtnLabel: {
            default: null,
            type: cc.Label
        },
        adBtn: {
            default: null,
            type: cc.Node
        },
        dailyLabel: {
            default: null,
            type: cc.Label,
        },
        //金币节点
        goldNode: {
            default: null,
            type: cc.Node
        },
        spriteMoreGame: {
            default: null,
            type: cc.Sprite,
        },
        //背景音乐
        backgroundAudio: {
            url: cc.AudioClip,
            default: null
        },
        //广告按钮
        rewardVideoAdBtn: {
            default: null,
            type: cc.Node
        },
        addBtn: {
            default: null,
            type: cc.Node
        },
        //存档界面
        keepDataNode: {
            default: null,
            type: cc.Node
        },
        //每日挑战按钮
        dailyBtn: {
            default: null,
            type: cc.Node
        },
        layoutNode: {
            default: null,
            type: cc.Node,
        },
        version: {
            default: null,
            type: cc.Label,
        },
        currentBGM: -1,


        // 红点
        reddot: {
            default: null,
            type: cc.Node
        },
        moreGameNode: {
            default: null,
            type: cc.Node
        },

        tips_1:cc.Node,

        tips_2:cc.Node,

        turnTableIcon:cc.Node,
        turnTableBtn:cc.Node,
        loginRewardBtn:cc.Node,
    },

    onLoad: function () {
        console.log("开始游戏界面的onLoad方法");
        listenUtil.eventCtrl.addListen('cdnchange', this.cdnchange.bind(this));
        listenUtil.eventCtrl.addListen('IPCheckSuccess', this.cdnchange.bind(this));
        listenUtil.eventCtrl.addListen('onceOpenTurnTable', this.onceOpenTurnTable.bind(this));
    },

    start: function () {
        console.log('开始界面调用 start方法');
        this.init();
        this.initAudio();
        //this.reddot.active = false;
    },

    cdnchange: function (params) {
        console.log('cdn数据变化');
        this.addBtn.active = Global.cdnGameConfig.totalSwith;
    },

    init: function () {
        ThirdAPI.showGameClub(true);
        this.checkLogin();
        this.setShowRewardVideoAd();
        this.updateBestScore();
        this.icon.spriteFrame.getTexture().setAliasTexParameters();
        this.bg.spriteFrame.getTexture().setAliasTexParameters();
        this.soundOnBtn.active = Global.isBGMPlaying;
        this.soundOffBtn.active = !Global.isBGMPlaying;
        this.addBtn.active = Global.cdnGameConfig.totalSwith;
        this.keepDataNode.active = false;

        if (Global.cdnGameConfig && Global.cdnGameConfig.version) {
            this.version.string = Global.cdnGameConfig.version;
        }

        // var baseScale = 640 / 1136;
        //var scale = Math.floor(cc.winSize.width / cc.winSize.height / baseScale);

        //this.layoutNode.scale = cc.winSize.width / cc.winSize.height / baseScale;


        //显示星星
        var time = (new Date()).getTime() - Global.gameinfo.shareTime;
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

        //this.friendBtn.active = (!Global.Gameversion && Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;

        if (Global.gameinfo.shareTimes >= Global.getForTotalTimes) {
            this.friendBtn.active = false;
            this.adBtn.active = false;
            console.log('每日的分享次数已经满了');
        } else {
            console.log('Global.gameinfo.shareTimesAndRewardVideoAd:', Global.gameinfo.shareTimesAndRewardVideoAd);
            if (Global.gameinfo.shareTimesAndRewardVideoAd % 2 == 0) {
                this.friendBtn.active = false;
                this.adBtn.active = true;
            } else {
                this.friendBtn.active = true;
                this.adBtn.active = false;
            }
        }*/
        // Global.startUIShare = true;
        this.updateGold(0);
        // this.setMoreGameBtn();
        this.moreGameRunAction();
        this.tips_2.active = false;
        if (Global.cdnGameConfig.totalSwith) {
            if (!Global.startUIShare) {
                this.tips_1.active = true;
            }
        }
        // this.onceOpenTurnTable();

        ctr.sxAdmanager.show();
        ctr.sxAdmanager.setPositionById(102);

        if (Global.turnTableConfig) {
            this.turnTableBtn.active = true;
        }else {
            this.turnTableBtn.active = false;
        }

        if (Global.loginRewardConfig) {
            this.loginRewardBtn.active = true;
            this.onceOpenLoginReward();
        }else {
            this.loginRewardBtn.active = false;
        }

        Global.startUIShare = false;

        ctr.sxAdmanager3.hide();
    },

    onceOpenTurnTable:function(){
        if (Global.turnTableExpend && Global.turnTableExpend.isOncePop) {
            if (this.node.active) {
                var open = ThirdAPI.loadTurnTableData();
                if (!open) {
                    ThirdAPI.saveOpenTurnTable();
                    var biManager = require('biManager');
                    biManager.bilog(biManager.drivingTurnTable, null);
                    var self = this;
                    Global.LoadAtlas.loadPrefab('turntable', function(turntablePrefab) {

                        if (Global.turnTableUI) {
                            Global.turnTableUI.onClose();
                        }
                        var profebNode = cc.instantiate(turntablePrefab);
                        self.node.addChild(profebNode);
                        Global.turnTableUI = profebNode.getComponent("turntable");
                        Global.turnTableUI.onceNoCharge();
                    });
                }
            }
        }
    },

    onceOpenLoginReward:function(){
        if (Global.loginRewardDouble && Global.loginRewardDouble.isOncePop && Global.loginRewardConfig && Global.loginRewardConfig.length) {
            if (this.node.active) {
                var open = ThirdAPI.loadLoginReward();
                if (!open) {
                    ThirdAPI.saveOpenLoginReward();
                    var biManager = require('biManager');
                    biManager.bilog(biManager.drivingLoginReward, null);
                    var self = this;
                    if (Global.loginRewardUI) {
                        Global.loginRewardUI.onClose();
                    }
                    Global.LoadAtlas.loadPrefab('loginRewardNode', function(turntablePrefab) {
                        var profebNode = cc.instantiate(turntablePrefab);
                        self.node.addChild(profebNode);
                        Global.loginRewardUI = profebNode.getComponent("loginRewardNode");
                    });
                }else {
                    this.onceOpenTurnTable();
                }
            }
        }else {
            ThirdAPI.clearGetRewardList();
            this.onceOpenTurnTable();
        }
    },

    //打开连续登录奖励
    onOpenLoginReward:function(){
        var biManager = require('biManager');
        biManager.bilog(biManager.loginReward, null);
        var self = this;
        if (Global.loginRewardUI) {
            Global.loginRewardUI.onClose();
        }
        Global.LoadAtlas.loadPrefab('loginRewardNode', function(turntablePrefab) {
            var profebNode = cc.instantiate(turntablePrefab);
            self.node.addChild(profebNode);
            Global.loginRewardUI = profebNode.getComponent("loginRewardNode");
        });
    },

    //显示广告
    setShowRewardVideoAd: function () {
        //判断看广告是否在当天
        var d = new Date(Date.now());
        if (Global.gameinfo.showRewardVideoAdDate != d.toDateString()) {
            Global.gameinfo.showRewardVideoAdTimes = 0;
            Global.gameinfo.showRewardVideoAdDate = d.toDateString();
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        console.log('setShowRewardVideoAd:', Global.gameinfo.showRewardVideoAdTimes, Global.showTotalTimes);
        //判断次数限制
        // this.rewardVideoAdBtn.active = Global.gameinfo.showRewardVideoAdTimes < Global.showTotalTimes ? true : false;
    },

    setMoreGameBtn:function() {
    },

    hideMoreGameBtn:function() {
        if (tywx.AdManager.getAdNodeByTag("myFirstAdNode")) {
            tywx.AdManager.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }
    },
    //每次到开始界面都判断是否需要重新登录，拉去最新数据
    checkLogin: function () {
        console.log('开始界面判断日期', Global.loginDateStr != (new Date()).toDateString())
        if (Global.loginDateStr != (new Date()).toDateString()) {
            console.log('登录');
            tcpManager.sendCmd.sendLoginData();
        }
    },

    moreGameRunAction: function () {
        // this.spriteMoreGame.node.rotation = 0;
        // this.spriteMoreGame.node.stopAllActions();
        // this.spriteMoreGame.node.runAction(
        //     cc.repeatForever(
        //         cc.sequence(cc.rotateBy(0.1, 10), cc.rotateBy(0.2, -20), cc.rotateBy(0.2, 20), cc.rotateBy(0.2, -20), cc.rotateBy(0.1, 10), cc.delayTime(2)))
        // );
    },

    //初始化音乐
    initAudio: function () {
        this.currentBGM = cc.audioEngine.play(this.backgroundAudio, false, 0.2);
        cc.audioEngine.setLoop(this.currentBGM, true);
        cc.audioEngine.setVolume(this.currentBGM, 0.2);
        var volume = cc.audioEngine.getVolume(this.currentBGM);
        console.log('currentBGM volume is ' + volume);
        Global.isBGMPlaying = true;
        Global.isSoundPlaying = true;
    },

    //宝箱赠送
    showChest: function () {
        ThirdAPI.showGameClub(false);
        Global.game.showPropDialog(true);
        this.hideMoreGameBtn();
    },

    // 显示提示红点
    showRedDot: function (ret) {
        //this.reddot.active = ret;
    },

    //更新星星的数量
    updateGold: function (num) {
        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;

        Global.wxGold += parseInt(num);
        console.log('1 :' + num, Global.wxGold);
        //更新并存储
        if (typeof wx !== 'undefined') {
            let data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('gridController on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
            });
            ThirdAPI.saveScore(score, Global.wxGold);
        }

        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;

        if (Global.gridController) {
            var gridControllerScript = Global.gridController.getComponent("gridController");
            gridControllerScript.showGold();
        }
    },

    //更新分数
    updateBestScore: function () {
        if (typeof wx !== 'undefined') {
            let data = ThirdAPI.loadLocalScore();
            Global.wxScore = parseInt(data.maxscore);
            Global.wxGold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                Global.wxScore = parseInt(maxscore);
                Global.wxGold = parseInt(gold);
                console.log('on ThirdAPI loadScore', Global.wxScore + " :: " + Global.wxGold);
            });
            this.dailyLabel.string = "每日挑战 " + (Global.dailyBattleTimes - Global.gameinfo.battleTimes) + "/" + Global.dailyBattleTimes;
            this.score.string = "最高分:" + Global.wxScore;
            Global.historyMaxScore = Global.wxScore;
        } else if (typeof FBInstant !== 'undefined') {
            this.score.string = "High score:" + Global.fbScore;
        }
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function () {
        Global.game.playSound('btn', 0.1);

        this.pauseInterval = true;
        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '122');
        }
    },

    shareToWx: function () {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.shareToWXSuccess.bind(this), null, '122');
        }
    },

    shareToWXSuccess: function (openGId) {
        //游戏首页点击分享到微信群并分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.shareToWX, null);
        
        if (!this.tips_1.active) {
            return
        }
        if (typeof wx !== 'undefined') {
            if (!openGId) {
                Global.game.showDialogText('分享失败，分享到群才有效');
                console.log('分享失败，分享到群才有效');
            }
        }
        if (Global.gameinfo.shareData1.arrOpenGId.indexOf(openGId) != -1) {
            console.log('该群今日已经分享过', openGId);
            Global.game.showDialogText('该群今天已打扰过了,换个群试试');
        } else {
            console.log('该群未分享过', openGId);
            Global.gameinfo.shareData1.arrOpenGId.push(openGId);
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

            this.tips_1.active = false;
            if (Global.cdnGameConfig.totalSwith) {
                Global.startUIShare = true;
                this.tips_2.active = true;
            }
        }
    },

    showGroupRank: function () {
        ThirdAPI.showGameClub(false);
        Global.game.playSound('btn', 0.1);
        Global.game.showGroupRank(true);
        this.hideMoreGameBtn();
    },

    //好友互助奖励
    onShowRewardUI: function () {
        ThirdAPI.showGameClub(false);
        Global.game.playSound('btn', 0.1);
        this.hideMoreGameBtn();
    },

    //测试广告
    testAd: function () {
        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.onAdSuccess.bind(this));
    },

    //抽奖
    drawLottery: function () {
        var biManager = require('biManager');
        biManager.bilog(biManager.openTurnTable, null);
        var self = this;
        Global.LoadAtlas.loadPrefab('turntable', function(turntablePrefab) {

            if (Global.turnTableUI) {
                Global.turnTableUI.onClose();
            }
            var profebNode = cc.instantiate(turntablePrefab);
            self.node.addChild(profebNode);
            Global.turnTableUI = profebNode.getComponent("turntable");

        });
    },

    onclose: function () {
        console.log('关闭广告');

    },

    //设置倒计时
    startContinueConutDown: function () {
        let times = 300;
        let myUtil = require("myUtil");

        this.friendBtnLabel.string = '邀请好友' + myUtil.getSecondString(times);
        this.pauseInterval = false;

        clearInterval(this.countDownInterval);
        this.countDownInterval = setInterval(() => {
            if (!this.pauseInterval) {
                times--;
                if (times >= 0) {
                    this.friendBtnLabel.string = '邀请好友' + myUtil.getSecondString(times);
                } else {
                    this.friendBtn.active = false;
                    this.adBtn.active = true;
                    clearInterval(this.countDownInterval);
                }
            }
        }, 1000);
    },

    onAdSuccess: function () {
        Global.gameinfo.showRewardVideoAdTimes++;
        console.log('保存看广告的次数', Global.gameinfo.showRewardVideoAdTimes);
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        // if (Global.gameinfo.showRewardVideoAdTimes >= Global.showTotalTimes) {
        //     this.rewardVideoAdBtn.active = false;
        // } else {
        //     this.rewardVideoAdBtn.active = true;
        // }

        //钻石
        this.createGemstone();
    },

    onShareSuccess: function (openGId) {
        //判断是否是当日(向朋友索取),防止凌晨状态
        console.log('startUI onshareSuccess:', Global.gameinfo.shareDate, (new Date()).toDateString())
        if (Global.gameinfo.shareDate != (new Date()).toDateString()) {
            var myUtil = require('myUtil');
            myUtil.resetInitData();
        }
        Global.gameinfo.shareTimes++;
        Global.gameinfo.shareTimesAndRewardVideoAd++;

        //先判断5次机会，再判断每日总次数3次
        if (Global.gameinfo.shareTimes >= Global.getForTotalTimes) {
            console.log('次数已满', Global.gameinfo.shareTimes);
            //5次已满
            // Global.gameinfo.shareTimes = 0;
            // Global.gameinfo.shareTotalTimes++;
            // Global.gameinfo.shareTime = (new Date()).getTime();
        }
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        var time = (new Date()).getTime() - Global.gameinfo.shareTime;
        console.log('分享成功的时间：', new Date().getTime(), Global.gameinfo.shareTime, time);

        this.pauseInterval = false;
        clearInterval(this.countDownInterval);

        if (Global.gameinfo.shareTimes >= Global.getForTotalTimes) {
            this.friendBtn.active = false;
            this.adBtn.active = false;
            console.log('每日的分享次数已经满了');
        } else {
            this.friendBtn.active = false;
            this.adBtn.active = true;
        }
        console.log('adBtn' + this.adBtn.active + 'friendBtn' + this.friendBtn.active);
        //钻石
        //this.createGemstone();
    },

    //分享到群失败
    onShareFail: function (msg) {
        console.log('分享失败！');
        if (msg === undefined) {
            Global.game.showDialogText('分享失败！');
        } else if (msg == 'fail') {
            Global.game.showDialogText('分享失败，分享到群才有效');
        } else if (msg == 'cancel') {
            Global.game.showDialogText('分享失败！');
        } else {
            Global.game.showDialogText('分享失败！');
        }
        this.pauseInterval = false;
    },

    //加号分享得钻石
    addShareGame: function () {
        Global.game.playSound('btn', 0.1);
        this.pauseInterval = true;

        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onAddShareSuccess.bind(this), this.onShareFail.bind(this), '120');
        }
    },

    //加号分享成功
    onAddShareSuccess: function (openGId) {
        //游戏首页点击+号并分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.addShare, null);

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

        //判断是否是当日(向朋友索取)
        var d = new Date(Date.now());
        if (Global.gameinfo.shareDate != d.toDateString()) {
            Global.gameinfo.shareTimesAndRewardVideoAd = 0;
            Global.gameinfo.shareTimes = 0;
            Global.gameinfo.shareTotalTimes = 0;
            Global.gameinfo.shareTime = 0;
            Global.gameinfo.shareDate = d.toDateString();
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        //判断次数
        Global.gameinfo.shareTimes++;
        Global.gameinfo.shareDate = d.toDateString();

        //先判断5次机会，再判断每日总次数3次
        if (Global.gameinfo.shareTimes >= Global.getForTotalTimes) {
            console.log('次数已满', Global.gameinfo.shareTimes);
            return;
        }
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        this.pauseInterval = false;
        clearInterval(this.countDownInterval);

        //兼容
        if (!Global.startConfig) {
            Global.startConfig = {
                'addStone': 5
            };
        }
        //加钻石
        var msg = '恭喜获得' + Global.startConfig.addStone + '钻石';
        Global.game.showDialogPropText(msg);
        this.updateGold(Global.startConfig.addStone);
    },

    //创建随机掉落的钻石
    createGemstone: function () {
        var myUtil = require('myUtil');
        var randomNum = 5; //myUtil.randomForArray(Global.randomGemStone);
        /*  for (let i = 0; i < randomNum; i++) {
              var instance = cc.instantiate(this.gemStone);
              var posX = myUtil.randomForMinAndMax(-Global.screenHeight / 2 + 100, Global.screenHeight / 2 - 100);
              var posY = myUtil.randomForMinAndMax(-Global.screenWidth / 2 + 100, Global.screenWidth / 2 - 100);
              console.log('gemStone pos:', posX, posY);
              instance.setPosition(cc.p(0, 0));
              //instance.setPosition(cc.p(0, Global.screenHeight / 2 + 50));
              //var action = cc.moveTo(2, cc.p(posX, posY)).easing(cc.easeElasticOut(1));
              this.node.addChild(instance);
              var pos = Global.startUI.goldNode.getPosition();
              //var addNum = (i == randomNum - 1) ? 30 - randomNum : 1;
              instance.getComponent('getGemStone').toRepeat([pos.x, pos.y], 1);
              //instance.runAction(action);
          }*/

        var times = 30;
        clearInterval(this.addInterval);
        this.goldNode.active = true;
        this.addInterval = setInterval(() => {
            times -= 5;
            if (times >= 0) {
                var instance = cc.instantiate(this.gemStone);
                instance.setPosition(cc.p(0, 0));
                this.node.addChild(instance);
                var pos = Global.startUI.goldNode.getPosition();
                instance.getComponent('getGemStone').toPosition([pos.x, pos.y], 5);
            } else {
                clearInterval(this.addInterval);
                this.goldNode.active = false;
            }
        }, 150);

    },

    //弹出道具详情
    dialogForPropInfo: function () {
        Global.game.showPropDialog(true);
    },

    //进入游戏
    play: function () {
        if (!Global.weightConfig) {
            var self = this;
            cc.loader.loadRes('weightConfig', function (err, data) {
                Global.weightConfig = data.weightConfig;
                self.onPlay();
            });
        } else {
            this.onPlay();
        }
    },

    onPlay: function () {
        ThirdAPI.showGameClub(false);
        this.hideMoreGameBtn();
        Global.game.playSound('btn', 0.1);
        Global.isDailyLimit = false;

        //判断是否有存储
        this.keepDataNode.active = false;
        var parma = ThirdAPI.loadGameProgress();
        if (!parma || (parma && parma.list.length <= 0)) {
            Global.game.enterScene();
            //记载点击开始游戏打点
            var biManager = require('biManager');
            biManager.bilog(biManager.startGame, null);
        } else {
            this.keepDataNode.active = true;
        }
    },

    //存档进入游戏
    keepDataEnterGame: function () {
        var list = ThirdAPI.loadGameProgress();
        console.log('keepDataEnterGame:', list);
        Global.game.enterScene(list);
        //记载点击开始游戏打点
        var biManager = require('biManager');
        biManager.bilog(biManager.startGame, null);
    },

    //重新开始
    restartGame: function () {
        ThirdAPI.clearGameProgressInfo();
        Global.game.enterScene();
        //记载点击开始游戏打点
        var biManager = require('biManager');
        biManager.bilog(biManager.startGame, null);
    },

    //存档关闭
    closekeepData: function () {
        this.keepDataNode.active = false;
    },

    //进入每日挑战
    dailyPlay: function () {
        ThirdAPI.showGameClub(false);
        this.hideMoreGameBtn();
        Global.game.playSound('btn', 0.1);
        if (!Global.dailyConfig) {
            var self = this;
            cc.loader.loadRes('grids', function (err, data) {
                Global.dailyConfig = data;
                self.onPlayDaily();
                console.log("start ui 读取本地掉率json文件", data);
            });
        } else {
            this.onPlayDaily();
        }
    },

    onPlayDaily: function () {
        //判断挑战次数
        if (Global.gameinfo.battleTimes <= 0) {
            // Global.game.showDialogPropText("每日挑战次数到达上限");
            // console.log('开始界面，挑战次数不足');
            if (typeof FBInstant !== 'undefined') {
                var myUtil = require('myUtil');
                ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
            } else if (typeof wx !== 'undefined') {
                if (Global.cdnGameConfig && Global.cdnGameConfig.totalSwith) {
                    ThirdAPI.shareGame('randomImg', this.onDailyShareSuccess.bind(this), this.onDailyShareFail.bind(this), '121');
                } else {
                    var wxRewardVideoAd = require('wxRewardVideoAd');
                    wxRewardVideoAd.initCreateReward(this.onDailyAdSuccess.bind(this), this.onDailyAdFail.bind(this));
                }
            }
            return;
        }
        Global.gameinfo.battleTimes--;
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        Global.isDailyLimit = true;
        Global.game.enterScene();
        this.hideMoreGameBtn();
    },

    onDailyShareSuccess: function (openGId) {
        //游戏首页点击每日挑战并分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.dailyShare, null);

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

        Global.gameinfo.battleTimes = Global.dailyBattleTimes;
        Global.gameinfo.battleTimes--;
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        Global.isDailyLimit = true;
        Global.game.enterScene();
    },

    onDailyShareFail: function (msg) {
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

    //每日挑战没有次数观看激励视频成功回调
    onDailyAdSuccess: function () {
        Global.gameinfo.battleTimes = Global.dailyBattleTimes;
        Global.gameinfo.battleTimes--;
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        Global.isDailyLimit = true;
        Global.game.enterScene();
    },

    //每日挑战观看激励视频失败
    onDailyAdFail: function () {
        // Global.game.showDialogPropText('观看完整视频获得额外挑战次数');
    },

    //进入排行榜
    showRankUI: function () {
        ThirdAPI.showGameClub(false);
        Global.game.playSound('btn', 0.1);
        Global.game.showRank(true);
        this.hideMoreGameBtn();
    },

    //皮肤商城
    onShowStore: function () {
        ThirdAPI.showGameClub(false);
        Global.game.playSound('btn', 0.1);
        Global.game.showStore();
        this.hideMoreGameBtn();
    },

    //pk竞技
    onChallenge: function () {
        ThirdAPI.showGameClub(false);
        Global.game.playSound('btn', 0.1);
        Global.shareUI.onChallenge();
        this.hideMoreGameBtn();
    },

    switchBGM: function () {
        Global.game.playSound('btn', 0.1);
        if (Global.isBGMPlaying) {
            this.pauseBGM();
            this.soundOnBtn.active = false;
            this.soundOffBtn.active = true;
        } else {
            this.playBGM();
            this.soundOnBtn.active = true;
            this.soundOffBtn.active = false;
        }
        Global.isBGMPlaying = !Global.isBGMPlaying;
    },

    playBGM: function () {
        if (this.currentBGM > -1) {
            cc.audioEngine.resume(this.currentBGM);
        }
    },

    pauseBGM: function () {
        if (this.currentBGM > -1) {
            cc.audioEngine.pause(this.currentBGM);
        }
    },

    // 按钮回调：更多游戏
    onMoreGame: function () {
        Global.game.playSound('btn', 0.1);
        var LinkImages = require('LinkImages');

        if (Global.linkImages && Global.linkImages.length > 0) {
            console.log('link image : ', Global.linkImages, Global.linkImages.length);

            let index = Math.floor(cc.random0To1() * Global.linkImages.length);
            var httpStr = Global.linkImages[index];
            console.log('httpStr:', httpStr);
            LinkImages.previewImage(httpStr);
        }
    },

    update:function(dt){
        if (this.node.active){
            this.turnTableIcon.rotation += 1;
        }
    }
});