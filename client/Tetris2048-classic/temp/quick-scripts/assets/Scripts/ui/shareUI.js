(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/shareUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ab6408y4ihGvpo29uPO2m4E', 'shareUI', __filename);
// Scripts/ui/shareUI.js

'use strict';

var ThirdAPI = require('../common/ThirdAPI');
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
            type: cc.Label
        },
        score: {
            default: null,
            type: cc.Label
        },
        personPer: {
            default: null,
            type: cc.Label
        },
        buttonstate0: {
            default: null,
            type: cc.Node
        },
        buttonstate1: {
            default: null,
            type: cc.Node
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
            type: cc.Label
        },
        lbl_fly: {
            default: null,
            type: cc.Label
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
        // 提示信息
        tipbox: {
            default: null,
            type: cc.Node
        },

        hasShardReward: true,
        isStart: false
    },

    start: function start() {
        Global.shareUI = this.getComponent('shareUI');

        this.setBackground();
        this.isStart = true;
    },


    initData: function initData() {
        this.destroyBannerAd();

        this.hasShardReward = true;
        this.showEffect();
        this.setBackground();

        console.log('1---------------》进入分享界面！', Global.cdnGameConfig.totalSwith);
        if (Global.cdnGameConfig.totalSwith) {
            console.log('2a---------------》进入分享界面！');
            this.buttonstate0.active = false;
            this.buttonstate1.active = true;
        } else {
            console.log('2b---------------》进入分享界面！', Global.cdnGameConfig.shareScoreSwith);
            //分数开关判断
            if (Global.cdnGameConfig.shareScoreSwith) {
                console.log('3a---------------》进入分享界面！', Global.shareData.shareTimes);
                //判断分数
                console.log('判断分数：', Global.cdnGameConfig.shareScoreLimit, Global.wxScore);
                var canShow = Global.wxScore > Global.cdnGameConfig.shareScoreLimit ? true : false;
                console.log('分享界面按钮判断--canShow:', canShow);
                if (canShow) {
                    this.buttonstate0.active = this.hasShardReward && Global.shareData.shareTimes < 5 ? true : false;
                    this.buttonstate1.active = this.hasShardReward && Global.shareData.shareTimes < 5 ? false : true;
                } else {
                    this.buttonstate0.active = false;
                    this.buttonstate1.active = true;
                }
            } else {
                console.log('3b---------------》进入分享界面！', Global.shareData.shareTimes);
                this.buttonstate0.active = this.hasShardReward && Global.shareData.shareTimes < 5 ? true : false;
                this.buttonstate1.active = this.hasShardReward && Global.shareData.shareTimes < 5 ? false : true;
            }

            // this.buttonstate0.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? true : false;
            // this.buttonstate1.active = (this.hasShardReward && Global.shareData.shareTimes < 5) ? false : true;
        }

        // if (Global.shareData.shareTimes >= 5) {
        //     console.log('分享超过5次限制');
        //     this.buttonstate0.active = false;
        //     this.buttonstate1.active = true;
        // }
    },

    //销毁banner广告
    destroyBannerAd: function destroyBannerAd() {
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.destroyBannerAd();
    },

    // 显示提示框
    showTipbox: function showTipbox() {
        this.tipbox.active = true;
    },

    onTipButton: function onTipButton() {
        this.tipbox.active = false;
    },

    //设置头部图片的适配宽高
    setBackground: function setBackground() {
        var canvas = cc.find('Canvas');
        this.bg.width = canvas.width;
        this.line1.width = canvas.width;
        this.line2.width = canvas.width;
        console.log('width:', this.bg.width, this.line1.width, this.line2.width);
    },

    switchBGM: function switchBGM() {
        Global.startUI.switchBGM();
    },

    showEffect: function showEffect() {
        this.node_gold.active = false;
        this.fly_node.active = false;

        this.node.setPosition(cc.p(-640, 0));
        var action = cc.moveTo(0.6, cc.p(0, 0));
        this.node.runAction(action);
    },

    updateMaxLabel: function updateMaxLabel(maxNum) {
        //本局最高分
        this.currScore.string = maxNum;
        //全球比分
        var myUtil = require('myUtil');
        this.personPer.string = myUtil.getPercentString(maxNum);
        this.score.string = '历史最高分：' + maxNum;
        if (typeof wx !== 'undefined') {
            var data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore(function (maxscore, gold) {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('on ThirdAPI loadScore', score, parseInt(gold));
            });

            //历史最高分
            if (score < maxNum) {
                ThirdAPI.saveScore(maxNum, gold);
                this.score.string = '历史最高分：' + maxNum;
            } else {
                this.score.string = '历史最高分：' + score;
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
    play: function play() {
        Global.game.playSound('btn', 0.1);
        Global.game.enterScene();
    },

    //返回主页
    gotoHome: function gotoHome() {
        Global.game.playSound('btn', 0.1);
        Global.game.startGame();
    },

    //进入排行榜
    showRankUI: function showRankUI() {
        Global.game.playSound('btn', 0.1);
        Global.toRankPoint = 0;
        Global.game.showRank(false);
    },

    // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    onShareGame: function onShareGame() {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), this.onShareSuccess.bind(this));
        } else {
            ThirdAPI.shareGame('screenshot', this.onShareSuccess.bind(this), this.onShareFail.bind(this), '003');
        }
    },

    onChallenge: function onChallenge() {
        Global.game.playSound('btn', 0.1);
        var img = this.getImgBase64();
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'INVITE',
            image: img,
            text: 'I just challenged Tetris2048,Join me!',
            data: {
                myReplayData: '...'
            }
        }).then(function () {
            // continue with the game.
        });
    },

    onShareSuccess: function onShareSuccess(openGId) {
        //总开关判断
        if (Global.cdnGameConfig.totalSwith) {
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
                    console.log('分享成功不能领取奖励');
                    this.buttonstate0.active = false;
                    this.buttonstate1.active = true;
                    return;
                }
            }
        }

        /*
                if (Global.Gameversion) {
                    this.buttonstate0.active = false;
                    this.buttonstate1.active = true;
                    return;
                }*/

        //console.log('今日分享次数:', Global.shareData.shareTimes);
        if (Global.shareData.shareTimes >= 5) {
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
                var data = ThirdAPI.loadLocalScore();
                var score = parseInt(data.maxscore);
                var gold = parseInt(data.gold);
                ThirdAPI.loadScore(function (maxscore, gold) {
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

    //分享到群失败
    onShareFail: function onShareFail() {
        console.log('向好友索取失败');
        Global.game.showDialogText('分享失败，必须分享到微信群');
    },

    playGetGoldEffect: function playGetGoldEffect() {
        var _this = this;

        this.buttonstate0.active = false;
        this.buttonstate1.active = true;
        //更改分享可获钻石状态
        this.hasShardReward = false;

        this.fly_node.active = true;
        this.lbl_fly.string = '+' + Global.shareReward;
        var ani = this.fly_node.getComponent(cc.Animation);
        ani.play();
        this.node_gold.active = true;
        this.lbl_gold.string = Global.wxGold - parseInt(Global.shareReward);
        this.node_gold.runAction(cc.fadeIn(0.5));

        ani.on('stop', function () {
            _this.node_gold.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.callFunc(function () {
                _this.lbl_gold.string = Global.wxGold;
                _this.fly_node.active = false;
            }), cc.scaleTo(0.2, 1), cc.fadeOut(1)));
        });
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64: function getImgBase64() {
        var target = cc.find('Canvas');
        var width = parseInt(target.width),
            height = parseInt(target.height);
        var renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var texture = renderTexture.getSprite().getTexture();
            var image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            var _texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _texture, 0);
            var data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var rowBytes = width * 4;
            for (var row = 0; row < height; row++) {
                var srow = height - 1 - row;
                var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                var imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        cc.log('to share');
        return canvas.toDataURL('image/png');
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
        //# sourceMappingURL=shareUI.js.map
        