(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/rankUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7c4f6Im+E9CPLgq3LIDqUzw', 'rankUI', __filename);
// Scripts/ui/rankUI.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        //随机钻石预设
        gemStone: {
            default: null,
            type: cc.Prefab
        },
        //金币节点
        goldNode: {
            default: null,
            type: cc.Node
        },
        //钻石按钮
        btnZuan: {
            default: null,
            type: cc.Node
        },
        top1: {
            default: null,
            type: cc.Node
        },
        top2: {
            default: null,
            type: cc.Node
        },
        rankPrefab: {
            default: null,
            type: cc.Prefab
        },
        innerview: {
            default: null,
            type: cc.Node
        },
        scrollView: {
            default: null,
            type: cc.Node
        },
        content: {
            default: null,
            type: cc.Node
        },
        btn_group: {
            default: null,
            type: cc.Node
        },
        myrankNode: {
            default: null,
            type: cc.Node
        },
        myrankBg: {
            default: null,
            type: cc.Sprite
        },
        myrankSpr: {
            default: null,
            type: cc.Sprite
        },
        entries: null,
        itemHeight: 30,
        arrItems: []
    },

    start: function start() {},


    onLoad: function onLoad() {
        /*if (typeof wx !== 'undefined') {
            this.lbl_btn_group = this.btn_group.getChildByName('Label').getComponent(cc.Label);
            this.btn_group.active = true;
            this.lbl_btn_group.string = '查看群排行';
            this.showType = 1;
            this.myrankNode.active = true;
        } else {
            this.btn_group.active = false;
            this.myrankNode.active = false;
            this.scrollView.height = 780;
            // this.innerview.height = 820;
            this.scrollView.y = -27;
        }*/
        this.setHandWidthAndHeight();
    },

    //设置头部图片的适配宽高
    setHandWidthAndHeight: function setHandWidthAndHeight() {
        var canvas = cc.find('Canvas');
        this.top1.width = canvas.width * 0.5;
        this.top2.width = canvas.width * 0.5;
    },

    onBtnGroupClick: function onBtnGroupClick() {
        if (this.showType == 1) {
            this.showType = 2;
            this.lbl_btn_group.string = '查看好友排行';
            this.getGroupRank();
        } else {
            this.showType = 1;
            this.lbl_btn_group.string = '查看群排行';
            this.getFriendRank();
        }
    },

    initData: function initData(isGroup) {
        if (typeof wx !== 'undefined') {}
        //this.myrankBg.node.setCascadeOpacityEnabled(true);
        // this.myrankBg.node.setOpacity(255 * 0.3);
        //this.myrankBg.node.setLocalZOrder(-1);


        //每次重进游戏置顶
        var scrollView = this.scrollView.getComponent(cc.ScrollView).scrollToTop(0);

        var item = cc.instantiate(this.rankPrefab);
        var itemheight = item.height + 5;
        var rankCount = 20;
        this.content.height = itemheight * rankCount;
        console.log('content width:' + this.content.width);
        //设置绘制照片姓名的画布
        var sprite = this.content.getChildByName('sprite');
        sprite.height = itemheight * rankCount;
        //this.innerview.height -= 100;
        //this.innerview.height = itemheight * rankCount;
        if (this.arrItems.length == 0) {
            for (var index = 0; index < rankCount; index++) {
                var _item = cc.instantiate(this.rankPrefab);
                _item.setLocalZOrder(-1);
                _item.setPosition(cc.p(0, -0.5 * itemheight - index * itemheight));
                this.arrItems[index] = _item;

                this.content.addChild(_item);
            }
        }

        for (var _index = 0; _index < this.arrItems.length; _index++) {
            var element = this.arrItems[_index];
            element.getComponent('rankItem').setlevel(_index + 1);
            element.getComponent('rankItem').hideAll();
        }

        this.btnZuan.active = false;
        //this.btnZuan.runAction(cc.repeatForever(cc.));
        this.updateGold(0);
        //开始获取排行榜
        if (typeof wx !== 'undefined') {
            for (var _index2 = 0; _index2 < this.arrItems.length; _index2++) {
                var _element = this.arrItems[_index2];
                _element.getComponent('rankItem').level.node.active = false;
            }
            if (isGroup) {
                this.initGetGroupRank();
            } else {
                this.getFriendRank();
            }
        } else if (typeof FBInstant !== 'undefined') {
            this.getRank();
        }
    },

    getFriendRank: function getFriendRank() {
        var _this = this;

        console.log("getFriendRank");
        var sprite = this.content.getChildByName('sprite');
        //sprite.width = this.content.width;

        var w = sprite.width;
        var h = sprite.height;
        var x = this.innerview.x - 0.5 * w;
        var y = this.innerview.y - 0.5 * h;
        this.drawRect = {
            x: x,
            y: y,
            width: w,
            height: h
        };
        console.log('draw rect:', this.drawRect, "this.content.width :" + this.content.width, "this.innerview.width" + this.innerview.width + "sprite.width :" + sprite.width);
        ThirdAPI.getRank({
            rect: this.drawRect,
            callback: function callback(entries) {
                if ((typeof entries === 'undefined' ? 'undefined' : _typeof(entries)) === 'object') {
                    _this.updateContent(entries);
                    // this.getMyRank();
                } else if (typeof entries === 'string') {
                    _this.updateWxRank = 100;
                }
            }
        }, 'Friend');
    },

    //初始化群排行
    initGetGroupRank: function initGetGroupRank() {
        var _this2 = this;

        console.log("getGroupRank");

        var sprite = this.content.getChildByName('sprite');

        var w = sprite.width; //this.content.width;
        var h = sprite.height; //this.content.height;
        var x = this.innerview.x - 0.5 * w;
        var y = this.innerview.y - 0.5 * h;
        this.drawRect = {
            x: x,
            y: y,
            width: w,
            height: h
        };
        console.log('draw rect:', this.drawRect);

        this.cleanRank();
        ThirdAPI.getRank({
            rect: this.drawRect,
            callback: function callback(openGId, shareTicket) {
                console.log('getGroupRank,oncallback', openGId, shareTicket);

                if (openGId) {
                    console.log('分享到群成功');
                    _this2.cleanRank();
                    _this2.updateWxRank = 1;

                    if (Global.gameinfo.shareGroupData.arrOpenGId.indexOf(openGId) != -1) {
                        console.log('该群今日已经分享过', openGId);
                        //Global.game.showDialogText('该群今日已经分享过无法获得奖励');
                        return;
                    } else {
                        console.log('该群未分享过', openGId);
                        Global.gameinfo.shareGroupData.arrOpenGId.push(openGId);
                        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

                        _this2.btnZuan.active = true;
                    }
                } else {
                    console.log('查看排行榜，分享到群失败');
                    _this2.closeThis();
                    _this2.btnZuan.active = false;
                }
            }
        }, 'Group');
    },

    getGroupRank: function getGroupRank() {
        var _this3 = this;

        console.log("getGroupRank");

        var sprite = this.content.getChildByName('sprite');

        var w = sprite.width; //this.content.width;
        var h = sprite.height; //this.content.height;
        var x = this.innerview.x - 0.5 * w;
        var y = this.innerview.y - 0.5 * h;
        this.drawRect = {
            x: x,
            y: y,
            width: w,
            height: h
        };
        console.log('draw rect:', this.drawRect);

        ThirdAPI.getRank({
            rect: this.drawRect,
            callback: function callback(openGId, shareTicket) {
                console.log('getGroupRank,oncallback', openGId, shareTicket);

                if (openGId) {
                    console.log('分享到群成功');
                    _this3.cleanRank();
                    _this3.updateWxRank = 1;

                    if (Global.gameinfo.shareGroupData.arrOpenGId.indexOf(openGId) != -1) {
                        console.log('该群今日已经分享过', openGId);
                        //Global.game.showDialogText('该群今日已经分享过无法获得奖励');
                        return;
                    } else {
                        console.log('该群未分享过', openGId);
                        Global.gameinfo.shareGroupData.arrOpenGId.push(openGId);
                        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

                        _this3.btnZuan.active = true;
                    }
                } else {
                    console.log('查看排行榜，分享到群失败');
                    _this3.btnZuan.active = false;
                }
            }
        }, 'Group');
    },

    //点击钻石按钮
    onGetZuan: function onGetZuan(num) {
        this.btnZuan.active = false;
        this.playGetGoldEffect();
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

    playGetGoldEffect: function playGetGoldEffect() {
        var _this4 = this;

        var times = Math.floor(Math.random() * 4 + 1) * 5;
        console.log('得钻：', times);
        //var times = 30;
        clearInterval(this.addInterval);
        this.addInterval = setInterval(function () {
            times -= 5;
            if (times >= 0) {
                var instance = cc.instantiate(_this4.gemStone);
                instance.setPosition(_this4.btnZuan.position);
                _this4.node.addChild(instance);
                var pos = _this4.goldNode.getPosition();
                instance.getComponent('getGemStone').toPosition([pos.x, pos.y], 5, 2);
            } else {
                clearInterval(_this4.addInterval);
            }
        }, 500);
    },

    //从fb上获取排行榜
    getRank: function getRank() {
        if (typeof FBInstant === 'undefined') return;
        var self = this;
        FBInstant.getLeaderboardAsync('my_allrank').then(function (leaderboard) {
            return leaderboard.getEntriesAsync();
        }).then(function (entries) {
            self.updateContent(entries);
            self.getMyRank();
        }).catch(function (error) {});
    },

    updateContent: function updateContent(entries) {
        if (!entries) {
            for (var index = 0; index < this.arrItems.length; index++) {
                var element = this.arrItems[index];
                if (element) {
                    element.active = fasle;
                }
            }
        } else {
            this.entries = entries;
            for (var _index3 = 0; _index3 < this.entries.length; _index3++) {
                var _element2 = this.arrItems[_index3];
                if (_element2) {
                    var ent = this.entries[_index3];
                    _element2.getComponent('rankItem').setScore(ent.getScore());
                    _element2.getComponent('rankItem').setlevel(ent.getRank());
                    _element2.getComponent('rankItem').setNameAndPhoto(ent.getExtraData());
                    //this.content.addChild(element);
                }
            }
        }
    },

    updateMyContent: function updateMyContent(entri) {
        if (parseInt(entri.getRank()) <= 10) {
            return;
        }

        var index = this.entries.length;
        if (index == 10) {
            index = 9;
        }

        var element = this.arrItems[index];
        element.getComponent('rankItem').setScore(entri.getScore());
        element.getComponent('rankItem').setlevel(entri.getRank());
        element.getComponent('rankItem').setNameAndPhoto(entri.getExtraData());
    },

    cleanRank: function cleanRank() {
        var sprite = this.content.getChildByName('sprite');
        sprite.getComponent(cc.Sprite).spriteFrame = null;
    },

    closeThis: function closeThis() {

        if (Global.toRankPoint == 1) {
            ThirdAPI.showGameClub(true);
        }

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
    },

    update: function update(dt) {
        if (this.updateWxRank && this.updateWxRank > 100) {

            console.log('redraw wx rank');
            this.updateWxRank = 1;
            try {
                var openDataContext = wx.getOpenDataContext();
                var sharedCanvas = openDataContext.canvas;

                var texture = new cc.Texture2D();
                texture.initWithElement(sharedCanvas);
                texture.handleLoadedTexture();
                var sp = new cc.SpriteFrame(texture);
                console.log('texture.width :' + texture.width, texture.height + " :: " + this.content.width);

                var sprite = this.content.getChildByName('sprite');

                sprite.getComponent(cc.Sprite).type = cc.Sprite.Type.TILED;

                sprite.width = texture.width;
                sprite.height = texture.height - 90;
                sprite.getComponent(cc.Sprite).spriteFrame = sp;

                this.myrankSpr.spriteFrame = sp;
                this.myrankSpr.node.height = texture.height;
            } catch (error) {}
        } else {
            this.updateWxRank++;
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
        //# sourceMappingURL=rankUI.js.map
        