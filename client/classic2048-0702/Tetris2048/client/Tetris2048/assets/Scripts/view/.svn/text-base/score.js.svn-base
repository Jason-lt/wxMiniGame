// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

let ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        curLabel: {
            default: null,
            type: cc.Label,
        },
        scoreNum: 0,
        showScore: 0,

        hasResetWeight2: false,
        hasResetWeight3: false,
        hasResetWeight4: false,
        hasResetWeight5: false,
    },

    start() {
        // console.log('aaaaa');
        // this.reset();
    },

    addScore: function (addNum) {
        console.log('bbbb');
        this.scoreNum += addNum;
        //保存微信分数
        if (Global.isDailyLimit) {
            if (!Global.gameinfo) {
                var myUtil = require('myUtil');
                myUtil.resetInitData();
            }
            //是每日挑战
            Global.gameinfo.dailyTime = (new Date()).getTime();
            if (Global.gameinfo && !Global.gameinfo.dailyScore) {
                Global.gameinfo.dailyScore = 0;
            }
            if (this.scoreNum > Global.gameinfo.dailyScore) {
                Global.gameinfo.dailyScore = this.scoreNum;
                ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            }
        } else {
            if (this.scoreNum > Global.wxScore) {
                console.log('from socre.js add score:', Global.wxScore, Global.wxGold);
                Global.wxScore = this.scoreNum;
                ThirdAPI.saveScore(Global.wxScore, Global.wxGold);
            }
            var myUtil = require('myUtil');
            /*    //添加128的掉落数据
                if (this.scoreNum > 6000 && !this.hasResetWeight2) {
                    /* var randomScores = Global.gridRandomScores.concat(Global.joinRandomScores);
                     var index = randomScores.indexOf(128);
                     if (index <= -1) {
                         Global.joinRandomScores.push(128);
                     }
                     console.log('array' + Global.joinRandomScores);*/


            // myUtil.randomForWeight(Global.weightScores2);
            // this.hasResetWeight2 = true;
            // console.log('重设掉落概率2');
            // }
            // else if (this.scoreNum > 100000 && !this.hasResetWeight3) {
            //     myUtil.randomForWeight(Global.weightScores2);
            //     this.hasResetWeight3 = true;
            //     console.log('重设掉落概率2');
            // }*／

            if (this.scoreNum > Global.weightConfig.oneGearScore && this.scoreNum <= Global.weightConfig.twoGearScore && !this.hasResetWeight2) {
                myUtil.randomForWeight(Global.weightConfig.twoWeightRate, Global.weightConfig.twoTotalWeight);
                this.hasResetWeight2 = true;
                console.log('重设第二档掉率：', Global.weightConfig.oneGearScore, Global.weightConfig.twoGearScore);
            } else if (this.scoreNum > Global.weightConfig.twoGearScore && this.scoreNum <= Global.weightConfig.threeGearScore && !this.hasResetWeight3) {
                myUtil.randomForWeight(Global.weightConfig.threeWeightRate, Global.weightConfig.threeTotalWeight);
                this.hasResetWeight3 = true;
                console.log('重设第三档掉率：', Global.weightConfig.twoGearScore, Global.weightConfig.threeGearScore);
            } else if (this.scoreNum > Global.weightConfig.threeGearScore && this.scoreNum <= Global.weightConfig.fourGearScore && !this.hasResetWeight4) {
                myUtil.randomForWeight(Global.weightConfig.fourWeightRate, Global.weightConfig.fourTotalWeight);
                this.hasResetWeight4 = true;
                console.log('重设第四档掉率：', Global.weightConfig.threeGearScore, Global.weightConfig.fourGearScore);
            } else if (this.scoreNum > Global.weightConfig.fourGearScore && !this.hasResetWeight5) {
                myUtil.randomForWeight(Global.weightConfig.fiveWeightRate, Global.weightConfig.fiveTotalWeight);
                this.hasResetWeight5 = true;
                console.log('重设第五档掉率：', Global.weightConfig.fourGearScore);
            }
        }
    },

    update(dt) {
        if (this.showScore >= this.scoreNum) {
            return;
        }

        if (this.scoreNum > this.showScore + 100) {
            this.showScore += 20;
        } else if (this.scoreNum > this.showScore + 20) {
            this.showScore += 10;
        } else {
            this.showScore += 1;
        }
        this.curLabel.string = this.showScore;
    },

    reset: function () {
        this.scoreNum = 0;
        this.showScore = -1;
        this.hasResetWeight2 = false;
        this.hasResetWeight3 = false;
        this.hasResetWeight4 = false;
        this.hasResetWeight5 = false;
    }
});