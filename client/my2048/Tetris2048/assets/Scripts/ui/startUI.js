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

        shareFriendState0: {
            default: null,
            type: cc.Node
        },
        shareFriendState1: {
            default: null,
            type: cc.Node
        },
        adBtn: {
            default: null,
            type: cc.Node
        },
        //金币节点
        goldNode: {
            default: null,
            type: cc.Node
        },
        videoNode: {
            default: null,
            type: cc.Node,
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
        currentBGM: -1,


        // 红点
        reddot: {
            default: null,
            type: cc.Node
        },
    },

    start: function () {
        this.init();
        this.initAudio();
        //this.reddot.active = false;
    },

    init: function () {
        //ThirdAPI.showGameClub(true);
        this.updateBestScore();
        this.icon.spriteFrame.getTexture().setAliasTexParameters();
        this.bg.spriteFrame.getTexture().setAliasTexParameters();
        this.soundOnBtn.active = Global.isBGMPlaying;
        this.soundOffBtn.active = !Global.isBGMPlaying;

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
        */
        if (Global.cdnGameConfig.totalSwith) {
            this.friendBtn.active = false;
        } else {
            //分数开关判断
            if (Global.cdnGameConfig.startScoreSwith) {
                //判断分数
                console.log('判断分数：', Global.cdnGameConfig.startScoreLimit, Global.wxScore);
                var canShow = Global.wxScore > Global.cdnGameConfig.startScoreLimit ? true : false;
                console.log('首页索取按钮判断--canShow:', canShow, Global.gameinfo.shareTotalTimes, time);
                this.friendBtn.active = (canShow) ? true : false;
            } else {
                console.log('设置好友索取按钮状态');
                this.friendBtn.active = true;
            }
        }

        console.log('------------------>分享次数:', Global.gameinfo.shareTimes, Global.dailyTotalTimes);
        if (Global.gameinfo.shareTimes < Global.dailyTotalTimes) {
            this.shareFriendState0.active = false;
            this.shareFriendState1.active = true;
            this.canTakeShareReward = true;
        } else {
            this.shareFriendState0.active = true;
            this.shareFriendState1.active = false;
            this.canTakeShareReward = false;
        }

        //this.friendBtn.active = (!Global.Gameversion && Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
        this.updateGold(0);
        this.moreGameRunAction();
        this.videoRunAction();

        this.videoNode.active = Global.gameinfo.videoData.Num < 3;
    },

    moreGameRunAction: function () {
        this.spriteMoreGame.node.rotation = 0;
        this.spriteMoreGame.node.stopAllActions();
        this.spriteMoreGame.node.runAction(
            cc.repeatForever(
                cc.sequence(cc.rotateBy(0.1, 10), cc.rotateBy(0.2, -20), cc.rotateBy(0.2, 20), cc.rotateBy(0.2, -20), cc.rotateBy(0.1, 10), cc.delayTime(2)))
        );
    },
    videoRunAction: function () {
        this.videoNode.rotation = 0;
        this.videoNode.stopAllActions();
        this.videoNode.runAction(
            cc.repeatForever(
                cc.sequence(cc.rotateBy(0.1, 10), cc.rotateBy(0.2, -20), cc.rotateBy(0.2, 20), cc.rotateBy(0.2, -20), cc.rotateBy(0.1, 10), cc.delayTime(2)))
        );
    },

    //初始化音乐
    initAudio: function () {
        this.currentBGM = cc.audioEngine.play(this.backgroundAudio, false, 0.2);
        cc.audioEngine.setLoop(this.currentBGM, true);
        cc.audioEngine.setVolume(this.currentBGM, 0.2);
        var volume = cc.audioEngine.getVolume(this.currentBGM);
        console.log('currentBGM volume is ' + volume);
        Global.isBGMPlaying = true;
    },

    //宝箱赠送
    showChest: function () {
        Global.game.showPropDialog(2);
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
            this.score.string = "最高分:" + Global.wxScore;
        } else if (typeof FBInstant !== 'undefined') {
            this.score.string = "High score:" + Global.fbScore;
        }
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function () {
        Global.game.playSound('btn', 0.1);


        this.pauseInterval = true;
        this.pauseInterval1 = true;

        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '003');
            //wxRewardVideoAd.initCreateReward(this.onShareSuccess.bind(this));
        } else {
            Global.game.showDialogText('索取失败，必须分享到不同微信群', {
                x: 0,
                y: 20
            });
            this.onShareSuccess();
        }
    },

    //测试广告
    testAd: function () {
        var wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.onAdSuccess.bind(this));
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
        this.startContinueConutDown();
        this.friendBtn.active = true; //(Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
        this.adBtn.active = false;
        console.log('adBtn' + this.adBtn.active + 'friendBtn' + this.friendBtn.active);
        //钻石
        this.createGemstone();
    },

    /*
        onShareSuccess: function (openGId, shareTicket) {
            if (typeof wx !== 'undefined') {
                if (!shareTicket) {
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
            console.log('startUI onshareSuccess:', Global.gameinfo.shareDate, (new Date()).toDateString())
            if (Global.gameinfo.shareDate != (new Date()).toDateString()) {
                var d = new Date(Date.now());
                Global.gameinfo.shareTimes = 0;
                Global.gameinfo.shareTotalTimes = 0;
                Global.gameinfo.shareTime = 0;
                Global.gameinfo.shareDate = d.toDateString();

                Global.gameinfo.shareData1 = {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
                };
                Global.gameinfo.shareData2 = {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
                };
                Global.gameinfo.shareData3 = {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
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
                Global.gameinfo.shareTime = (new Date()).getTime();
            }
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            var time = (new Date()).getTime() - Global.gameinfo.shareTime;
            console.log('分享成功的时间：', new Date().getTime(), Global.gameinfo.shareTime, time);

            this.pauseInterval = false;
            clearInterval(this.countDownInterval);

            console.log('shareTotalTimes:' + Global.gameinfo.shareTotalTimes);

            this.friendBtn.active = false; //(Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
            this.adBtn.active = true;
            console.log('adBtn' + this.adBtn.active + 'friendBtn' + this.friendBtn.active);
            //钻石
            //this.createGemstone();
        },
    */

    //设置倒计时
    startContinueConutDown1: function () {
        let times = 15 * 60;
        let myUtil = require("myUtil");

        this.pauseInterval1 = false;

        clearInterval(this.countDownInterval1);
        this.countDownInterval1 = setInterval(() => {
            if (!this.pauseInterval1) {
                times--;
                if (times >= 0) {
                    //this.friendBtnLabel.string = '邀请好友' + myUtil.getSecondString(times);
                } else {
                    this.shareFriendState0.active = false;
                    this.shareFriendState1.active = true;
                    this.canTakeShareReward = true;
                    clearInterval(this.countDownInterval1);
                }
            }
        }, 1000);
    },

    onShareSuccess: function (openGId, shareTicket) {

        if (!this.canTakeShareReward) {
            
            return;
        }

        if (typeof wx !== 'undefined') {
            if (!shareTicket) {
                Global.game.showDialogText('请分享到不同群！', {
                    x: 0,
                    y: 20
                });
                console.log('索取失败，必须分享到微信群');
                return;
            }
        }

        if (Global.gameinfo.shareTimes < Global.dailyTotalTimes) {
            Global.gameinfo.shareTimes++;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

            //钻石
            this.createGemstone();
        } else {
            //Global.game.showDialogText('当日得钻数量已达上限！');
        }

        this.shareFriendState0.active = true;
        this.shareFriendState1.active = false;
        this.canTakeShareReward = false;

        console.log('------------------>分享次数:', Global.gameinfo.shareTimes, Global.dailyTotalTimes);
        if (Global.gameinfo.shareTimes < Global.dailyTotalTimes) {
            this.startContinueConutDown1();
        }
    },

    //分享到群失败
    onShareFail: function () {
        console.log('向好友索取失败');
        Global.game.showDialogText('请分享到不同群！');

        this.pauseInterval = false;
        this.pauseInterval1 = false;
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

        //var times = 30;
        var times = Math.floor(Math.random() * 4 + 1) * 5;
        clearInterval(this.addInterval);
        this.addInterval = setInterval(() => {
            times -= 5;
            if (times >= 0) {
                var instance = cc.instantiate(this.gemStone);
                instance.setPosition(cc.p(0, 0));
                this.node.addChild(instance);
                var pos = Global.startUI.goldNode.getPosition();
                instance.getComponent('getGemStone').toPosition([pos.x, pos.y], 1);
            } else {
                clearInterval(this.addInterval);
            }
        }, 300);

    },

    //弹出道具详情
    dialogForPropInfo: function () {
        Global.game.showDialogText('恭喜获得双倍道具一个！回赠给好友一个吧！');
        //setTimeout(() => {
        //    Global.game.showPropDialog(true, "恭喜获得双倍道具一个！回赠给好友一个吧！");

        //}, 500);

    },

    //进入游戏
    play: function () {
        Global.game.playSound('btn', 0.1);
        Global.game.enterScene();
    },

    //进入排行榜
    showRankUI: function () {
        Global.game.playSound('btn', 0.1);
        Global.game.showRank();
    },

    //皮肤商城
    onShowStore: function () {
        Global.game.playSound('btn', 0.1);
        /*
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64());
        } else {
            ThirdAPI.shareGame();
        }*/
        //Global.game.showStore();
        //Global.game.showTitle();
        Global.game.showStore();
    },

    //pk竞技
    onChallenge: function () {
        Global.game.playSound('btn', 0.1);
        Global.shareUI.onChallenge();
    },

    switchBGM: function () {
        Global.game.playSound('btn', 0.1);
        if (Global.isBGMPlaying) {
            this.pauseBGM();
            // this.soundOnBtn.active = false;
            // this.soundOffBtn.active = true;
        } else {
            this.playBGM();
            // this.soundOnBtn.active = true;
            // this.soundOffBtn.active = false;
        }
        Global.isBGMPlaying = !Global.isBGMPlaying;
    },

    switchBGM1: function () {
        Global.game.playSound('btn', 0.1);
        if (Global.isBGMPlaying1) {
            this.pauseBGM();
            this.soundOnBtn.active = false;
            this.soundOffBtn.active = true;
        } else {
            this.playBGM();
            this.soundOnBtn.active = true;
            this.soundOffBtn.active = false;
        }
        Global.isBGMPlaying1 = !Global.isBGMPlaying1;
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

    onVideo: function () {
        let wxRewardVideoAd = require('wxRewardVideoAd');
        wxRewardVideoAd.initCreateReward(this.videoCloseCallback.bind(this));
    },

    videoCloseCallback: function (isEnded) {
        console.log('===========>广告是否看完：', isEnded);
        if (isEnded) {
            if (Global.gameinfo.videoData.Num < 3) {
                Global.gameinfo.videoData.Num++;
                ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

                this.createGemstone1();

                if (Global.gameinfo.videoData.Num >= 3) {
                    this.videoNode.active = false;
                }
            } else {
                Global.game.showDialogText('领取钻石次数已达上限!');
            }
        }
    },

    //创建随机掉落的钻石
    createGemstone1: function () {
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
        //var times = Math.floor(Math.random()*4+1)*5;
        clearInterval(this.addInterval);
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
            }
        }, 300);

    },
});