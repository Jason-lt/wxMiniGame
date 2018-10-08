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
    },

    start() {
        this.reset();
    },

    addScore: function (addNum) {
        this.scoreNum += addNum;
        //保存微信分数
        if (this.scoreNum > Global.wxScore) {
            console.log('from socre.js add score:', Global.wxScore, Global.wxGold);
            Global.wxScore = this.scoreNum;
            ThirdAPI.saveScore(Global.wxScore, Global.wxGold);
        }
        //添加128的掉落数据
        if (this.scoreNum > 10000) {
            /* var randomScores = Global.gridRandomScores.concat(Global.joinRandomScores);
             var index = randomScores.indexOf(128);
             if (index <= -1) {
                 Global.joinRandomScores.push(128);
             }
             console.log('array' + Global.joinRandomScores);*/

            var myUtil = require('myUtil');
            myUtil.randomForWeight(Global.weightScores2);
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
    }
});