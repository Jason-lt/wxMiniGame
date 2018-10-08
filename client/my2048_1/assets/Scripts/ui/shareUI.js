let ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        },
        line1: {
            default: null,
            type: cc.Node
        },
        line2: {
            default: null,
            type: cc.Node
        },
        //当前分数
        currScore: {
            default: null,
            type: cc.Label,
        },
        score: {
            default: null,
            type: cc.Label,
        },
        personPer: {
            default: null,
            type: cc.Label,
        },
        btn_label: {
            default: null,
            type: cc.Label,
        },
        node_gold: {
            default: null,
            type: cc.Node
        },
        fly_node: {
            default: null,
            type: cc.Node
        },
        lbl_gold: {
            default: null,
            type: cc.Label,
        },
        lbl_fly: {
            default: null,
            type: cc.Label,
        },
        soundOnBtn: {
            default: null,
            type: cc.Node
        },
        soundOffBtn: {
            default: null,
            type: cc.Node
        },
        dailyLabel: {
            default: null,
            type: cc.Label,
        },
        //背景音乐
        backgroundAudio: {
            url: cc.AudioClip,
            default: null
        },
        // 提示信息
        tipbox: {
            default: null,
            type: cc.Node,
        },
        //分享给好友得钻石
        getStoneBtn: {
            default: null,
            type: cc.Node,
        },
        shareBtn: {
            default: null,
            type: cc.Node,
        },

        /*
                buttonstate0: {
                    default: null,
                    type: cc.Node
                },
                buttonstate1: {
                    default: null,
                    type: cc.Node
                },*/

        hasShardReward: true,
        isStart: false,
    },

    start() {
        Global.shareUI = this.getComponent('shareUI');

        this.setBackground();
        this.isStart = true;
    },

    initData: function () {
        this.hasShardReward = true;
        this.destroyBannerAd();
        this.showEffect();
        this.setBackground();
        this.setShowButton();

        var gridControllerScript = Global.gridController.getComponent("gridController");
        if (gridControllerScript) {
            this.updateMaxLabel(gridControllerScript.scoreScript.scoreNum);
        }

        //记载进入结算界面打点
        var biManager = require('biManager');
        biManager.bilog(biManager.entershare, null);

        /*
                if (Global.cdnGameConfig.totalSwith || Global.isDailyLimit) {
                    this.buttonstate0.active = false;
                    this.buttonstate1.active = true;
                } else {
                    //分数开关判断
                    if (Global.cdnGameConfig.shareScoreSwith) {
                        //判断分数
                        console.log('判断分数：', Global.cdnGameConfig.shareScoreLimit, Global.wxScore);
                        var canShow = Global.wxScore > Global.cdnGameConfig.shareScoreLimit ? true : false;
                        console.log('分享界面按钮判断--canShow:', canShow);
                        if (canShow) {
                            this.buttonstate0.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? true : false;
                            this.buttonstate1.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? false : true;
                        } else {
                            this.buttonstate0.active = false;
                            this.buttonstate1.active = true;
                        }
                    } else {
                        this.buttonstate0.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? true : false;
                        this.buttonstate1.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? false : true;
                    }

                    // this.buttonstate0.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? true : false;
                    // this.buttonstate1.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? false : true;
                }*/


        // if (Global.shareData.shareTimes >= 5) {
        //     console.log('分享超过5次限制');
        //     this.buttonstate0.active = false;
        //     this.buttonstate1.active = true;
        // }
    },

    //根据开关设置分享按钮状态
    setShowButton: function () {
        if (!Global.cdnGameConfig.totalSwith || Global.isDailyLimit) {
            this.getStoneBtn.active = false;
            this.shareBtn.active = true;
        } else {
            var canShow = Global.wxScore > Global.cdnGameConfig.shareScoreLimit ? true : false;
            //开关打开，并且不能显示按钮
            if (Global.cdnGameConfig.shareScoreSwith && !canShow) {
                this.getStoneBtn.active = false;
                this.shareBtn.active = true;
            } else {
                this.getStoneBtn.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? true : false;
                this.shareBtn.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? false : true;
            }
        }
    },

    //销毁banner广告
    destroyBannerAd: function () {
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.destroyBannerAd();
    },

    // 显示提示框
    showTipbox: function () {
        this.tipbox.active = true;
    },

    onTipButton: function () {
        this.tipbox.active = false;
    },

    //设置头部图片的适配宽高
    setBackground: function () {
        let canvas = cc.find('Canvas');
        this.bg.width = canvas.width;
        this.line1.width = canvas.width;
        this.line2.width = canvas.width;
        console.log('width:', this.bg.width, this.line1.width, this.line2.width);
    },

    switchBGM: function () {
        Global.startUI.switchBGM();
    },

    showEffect: function () {
        this.node_gold.active = false;
        this.fly_node.active = false;

        this.node.setPosition(cc.p(-640, 0));
        var action = cc.moveTo(0.6, cc.p(0, 0));
        this.node.runAction(action);
    },

    updateMaxLabel: function (maxNum) {
        //本局最高分
        this.currScore.string = maxNum;
        //全球比分
        var myUtil = require('myUtil');
        this.personPer.string = myUtil.getPercentString(maxNum);
        this.score.string = '历史最高分：' + maxNum;
        if (typeof wx !== 'undefined') {
            let data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('on ThirdAPI loadScore', score, parseInt(gold));
            });
            if (Global.isDailyLimit) {
                this.dailyLabel.string = "每日挑战次数：" + (Global.dailyBattleTimes - Global.gameinfo.battleTimes) + "/" + Global.dailyBattleTimes;
            } else {
                this.dailyLabel.string = "";
            }

            //不是每日挑战
            if (!Global.isDailyLimit) {
                //历史最高分
                if (score < maxNum) {
                    ThirdAPI.saveScore(maxNum, gold);
                    this.score.string = '历史最高分：' + maxNum;
                    Global.historyMaxScore = maxNum;
                } else {
                    this.score.string = '历史最高分：' + score;
                    Global.historyMaxScore = score;
                }
            } else {
                //兼容dailyScore
                if (!Global.gameinfo) {
                    var myUtil = require('myUtil');
                    myUtil.resetInitData();
                }
                if (Global.gameinfo && !Global.gameinfo.dailyScore) {
                    Global.gameinfo.dailyScore = 0;
                }
                this.score.string = "今日挑战最高分数：" + parseInt(Global.gameInfo.dailyScore);
            }
        } else if (typeof FBInstant !== 'undefined') {
            if (maxNum > Global.fbScore) {
                this.score.string = maxNum;
                //测试
                Global.dataScript.saveScore(maxNum);
            } else {
                this.score.string = Global.fbScore;
            }
        }

        Global.titleMaxScore = maxNum;
        if (Global.titleUI) {
            Global.titleUI.updateItemsState(1);
        }
    },

    //进入游戏
    play: function () {
        Global.game.playSound('btn', 0.1);
        if (Global.isDailyLimit) {
            //判断挑战次数
            if (Global.gameinfo.battleTimes <= 0) {
                console.log('挑战次数不足');
                Global.game.showDialogPropText("每日挑战次数到达上限");
                return;
            }
            Global.gameinfo.battleTimes--;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        Global.game.enterScene();

        //记载结算界面重新开始打点
        var biManager = require('biManager');
        biManager.bilog(biManager.restar, null);
    },

    //返回主页
    gotoHome: function () {
        Global.game.playSound('btn', 0.1);
        Global.game.startGame();
    },

    //进入排行榜
    showRankUI: function () {
        Global.game.playSound('btn', 0.1);
        Global.game.showRank();
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function () {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else {
            let EChannelPrefix = require("EChannelPrefix");
            ThirdAPI.sendChannelPrefix(EChannelPrefix.result);
            ThirdAPI.shareGame('screenshot', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '252');
        }
    },

    //分享给好友成功
    onShareSuccess: function () {
        console.log('分享给好友成功');
        this.getStoneBtn.active = false;
        this.shareBtn.active = true;
        Global.game.showDialogPropText('分享成功！');
    },


    //分享得钻石
    getStoneForShare: function () {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            var myUtil = require('myUtil');
            ThirdAPI.shareGame(myUtil.getImgBase64(), this.onShareSuccess.bind(this));
        } else {
            let EChannelPrefix = require("EChannelPrefix");
            ThirdAPI.sendChannelPrefix(EChannelPrefix.result);
            ThirdAPI.shareGame('randomImg', this.onGetStoneSuccess.bind(this), this.onShareFail.bind(this), '251');
        }
    },

    //分享得钻石成功
    onGetStoneSuccess: function (openGId) {
        //结算界面通过送钻石分享成功
        var biManager = require('biManager');
        biManager.bilog(biManager.storeShare, null);

        if (Global.shareData.shareTimes >= 5) {
            console.log('分享超过5次限制');
            this.getStoneBtn.active = false;
            this.shareBtn.active = true;
            return;
        }

        //获得钻石动画
        if (this.hasShardReward) {
            /* if (Global.gameinfo.shareData3.arrOpenGId.indexOf(openGId) != -1) {
                 console.log('该群今日已经分享过', openGId);
                 Global.game.showDialogText('该群今日已经分享过无法获得奖励');
                 return;
             } else {
                 console.log('该群未分享过', openGId);
                 Global.gameinfo.shareData3.arrOpenGId.push(openGId);
                 ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
             }

             if (!openGId) {
                 Global.game.showDialogText('分享失败，必须分享到微信群', {
                     x: 0,
                     y: -200
                 });
                 console.log('shareUI 分享的不是群');
                 return;
             }*/
            console.log('分享获得钻石,开始播放动画');
            Global.shareData.shareTimes++;
            ThirdAPI.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);

            Global.wxGold += parseInt(Global.shareReward);
            //更新并存储
            if (typeof wx !== 'undefined') {
                let data = ThirdAPI.loadLocalScore();
                var score = parseInt(data.maxscore);
                var gold = parseInt(data.gold);
                ThirdAPI.loadScore((maxscore, gold) => {
                    score = parseInt(maxscore);
                    gold = parseInt(gold);
                    console.log('shareUI on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
                });
                ThirdAPI.saveScore(score, Global.wxGold);
            }

            //更改分享可获钻石状态
            this.hasShardReward = false;
            this.playGetGoldEffect();
        }
    },


    /*
        onShareSuccess: function (openGId) {
            //总开关判断
            if (Global.cdnGameConfig.totalSwith || Global.isDailyLimit) {
                this.buttonstate0.active = false;
                this.buttonstate1.active = true;
                return;
            } else {
                //分数开关判断
                if (Global.cdnGameConfig.shareScoreSwith) {
                    //判断分数
                    console.log('分享成功之后判断分数：', Global.cdnGameConfig.shareScoreLimit, Global.wxScore);
                    var canTakeReward = Global.wxScore > Global.cdnGameConfig.shareScoreLimit ? true : false;

                    if (!canTakeReward) {
                        console.log('分享成功不能领取奖励')
                        this.buttonstate0.active = false;
                        this.buttonstate1.active = true;
                        return;
                    }
                }
            }

    //console.log('今日分享次数:', Global.shareData.shareTimes);
    /* if (Global.shareData.shareTimes >= 5) {
            //console.log('分享超过5次限制');
            this.buttonstate0.active = false;
            this.buttonstate1.active = true;
            return;
        }

        //获得钻石动画
        if (this.hasShardReward) {
            if (Global.gameinfo.shareData3.arrOpenGId.indexOf(openGId) != -1) {
                console.log('该群今日已经分享过', openGId);
                Global.game.showDialogText('该群今日已经分享过无法获得奖励');
                return;
            } else {
                console.log('该群未分享过', openGId);
                Global.gameinfo.shareData3.arrOpenGId.push(openGId);
                ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            }

            if (!openGId) {
                Global.game.showDialogText('分享失败，必须分享到微信群', {
                    x: 0,
                    y: -200
                });
                console.log('shareUI 分享的不是群');
                return;
            }
            console.log('分享获得钻石,开始播放动画');
            Global.shareData.shareTimes++;
            ThirdAPI.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);

            Global.wxGold += parseInt(Global.shareReward);
            //更新并存储
            if (typeof wx !== 'undefined') {
                let data = ThirdAPI.loadLocalScore();
                var score = parseInt(data.maxscore);
                var gold = parseInt(data.gold);
                ThirdAPI.loadScore((maxscore, gold) => {
                    score = parseInt(maxscore);
                    gold = parseInt(gold);
                    console.log('shareUI on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
                });
                ThirdAPI.saveScore(score, Global.wxGold);
            }

            //更改分享可获钻石状态
            this.hasShardReward = false;
            this.playGetGoldEffect();
        }
    },*/


    onChallenge: function () {
        Global.game.playSound('btn', 0.1);
        var myUtil = require('myUtil');
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'INVITE',
            image: myUtil.getImgBase64(),
            text: 'I just challenged Tetris2048,Join me!',
            data: {
                myReplayData: '...'
            },
        }).then(() => {
            // continue with the game.
        });
    },

    //分享到群失败
    onShareFail: function () {
        console.log('分享失败');
        Global.game.showDialogText('分享失败!');
    },

    playGetGoldEffect: function () {
        this.getStoneBtn.active = false;
        this.shareBtn.active = true;
        //更改分享可获钻石状态
        this.hasShardReward = false;

        this.fly_node.active = true;
        this.lbl_fly.string = '+' + Global.shareReward;
        let ani = this.fly_node.getComponent(cc.Animation)
        ani.play();
        this.node_gold.active = true;
        this.lbl_gold.string = Global.wxGold - parseInt(Global.shareReward);
        this.node_gold.runAction(cc.fadeIn(0.5));

        ani.on('stop', () => {
            this.node_gold.runAction(cc.sequence(
                cc.scaleTo(0.2, 1.2),
                cc.callFunc(() => {
                    this.lbl_gold.string = Global.wxGold;
                    this.fly_node.active = false;
                }),
                cc.scaleTo(0.2, 1),
                cc.fadeOut(1)
            ));
        });
    },
});