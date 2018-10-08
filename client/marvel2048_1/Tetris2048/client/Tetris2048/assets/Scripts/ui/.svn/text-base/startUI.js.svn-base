let ThirdAPI = require('../common/ThirdAPI')
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
        this.updateGold(0);
        this.moreGameRunAction();
    },

    moreGameRunAction: function () {
        this.spriteMoreGame.node.runAction(
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
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onShareSuccess.bind(this));
        } else if (typeof wx !== 'undefined') {
            ThirdAPI.shareGame('randomImg', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '003');
        } else {
            Global.game.showDialogText('索取失败，必须分享到微信群', {
                x: 0,
                y: 20
            });
            this.onShareSuccess();
        }
    },

    onShareSuccess: function (openGId, shareTicket) {
        /*
        if (typeof wx !== 'undefined') {
            if (!openGId) {
                Global.game.showDialogText('索取失败，必须分享到微信群', {
                    x: 0,
                    y: 20
                });
                console.log('索取失败，必须分享到微信群');
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
        }*/

        if (!shareTicket) {
            Global.game.showDialogText('索取失败，必须分享到微信群', {
                x: 0,
                y: 20
            });
            console.log('索取失败，必须分享到微信群');
            return;
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
        this.friendBtn.active = (Global.gameinfo.shareTotalTimes < Global.dailyTotalTimes && time > Global.intervalTime) ? true : false;
        //钻石
        this.createGemstone();
    },

    //分享到群失败
    onShareFail: function () {
        console.log('向好友索取失败');
        Global.game.showDialogText('索取失败，必须分享到微信群');
    },


    //创建随机掉落的钻石
    createGemstone: function () {
        var myUtil = require('myUtil');
        var randomNum = myUtil.randomForArray(Global.randomGemStone);
        for (let i = 0; i < randomNum; i++) {
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

            var httpStr;
            while (1) {
                let index = Math.floor(cc.random0To1() * Global.linkImages.length);
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
});