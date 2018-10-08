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
        this.updateBestScore();
        this.icon.spriteFrame.getTexture().setAliasTexParameters();
        this.bg.spriteFrame.getTexture().setAliasTexParameters();
        this.soundOnBtn.active = Global.isBGMPlaying;
        this.soundOffBtn.active = !Global.isBGMPlaying;
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
});