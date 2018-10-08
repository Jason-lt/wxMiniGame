// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

let ThirdAPI = require('../common/ThirdAPI')
cc.Class({
    extends: cc.Component,


    properties: {
        top1: {
            default: null,
            type: cc.Node,
        },
        top2: {
            default: null,
            type: cc.Node,
        },
        rankPrefab: {
            default: null,
            type: cc.Prefab,
        },
        innerview: {
            default: null,
            type: cc.Node,
        },
        scrollView: {
            default: null,
            type: cc.Node,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        btn_group: {
            default: null,
            type: cc.Node,
        },
        myrankNode: {
            default: null,
            type: cc.Node,
        },
        myrankBg: {
            default: null,
            type: cc.Sprite,
        },
        myrankSpr: {
            default: null,
            type: cc.Sprite,
        },
        dailyLabel: {
            default: null,
            type: cc.Label,
        },
        entries: null,
        itemHeight: 30,
        arrItems: [],
        canShowGameClub: false, //是否可以显示游戏圈
        lbl_btn_group: null,
    },

    start() {

    },

    onLoad: function () {
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
    setHandWidthAndHeight: function () {
        let canvas = cc.find('Canvas');
        this.top1.width = canvas.width * 0.5;
        this.top2.width = canvas.width * 0.5;
    },

    setBtnLabel: function () {
        if (typeof wx !== 'undefined') {
            this.btn_group.active = true;
            this.lbl_btn_group.string = '查看群排行';
            this.showType = 1;
            this.dailyLabel.string = "查看每日排行";
            this.dailyType = 0;
            this.myrankNode.active = true;
        } else {
            this.btn_group.active = false;
            this.myrankNode.active = false;
            this.scrollView.height = 780;
            // this.innerview.height = 820;
            this.scrollView.y = -27;
        }
    },

    onBtnGroupClick: function () {
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

    //点击每日排行
    onBtnDailyClick: function () {
        console.log('点击每日排行');
        if (this.dailyType == 0) {
            this.dailyType = -1;
            this.dailyLabel.string = '查看好友排行';
            this.getDailyRank();
        } else {
            this.dailyType = 0;
            this.dailyLabel.string = '查看每日排行';
            this.getFriendRank();
        }
    },

    initData: function (canShowGameClub) {
        //记载成功进入排行榜打点
        var biManager = require('biManager');
        biManager.bilog(biManager.rank, null);

        if (typeof wx !== 'undefined') {
            //this.myrankBg.node.setCascadeOpacityEnabled(true);
            // this.myrankBg.node.setOpacity(255 * 0.3);
            //this.myrankBg.node.setLocalZOrder(-1);
        }
        this.canShowGameClub = canShowGameClub;
        this.lbl_btn_group = this.btn_group.getChildByName('Label').getComponent(cc.Label);
        this.setBtnLabel();

        //每次重进游戏置顶
        var scrollView = this.scrollView.getComponent(cc.ScrollView).scrollToTop(0);

        let item = cc.instantiate(this.rankPrefab);
        let itemheight = item.height + 5;
        let rankCount = 20;
        this.content.height = itemheight * rankCount;
        console.log('content width:' + this.content.width);
        //设置绘制照片姓名的画布
        var sprite = this.content.getChildByName('sprite');
        sprite.height = itemheight * rankCount;
        //this.innerview.height -= 100;
        //this.innerview.height = itemheight * rankCount;
        if (this.arrItems.length == 0) {
            for (let index = 0; index < rankCount; index++) {
                let item = cc.instantiate(this.rankPrefab);
                item.setLocalZOrder(-1);
                item.setPosition(cc.p(0, -0.5 * itemheight - index * itemheight));
                this.arrItems[index] = item;

                this.content.addChild(item);
            }
        }

        for (let index = 0; index < this.arrItems.length; index++) {
            const element = this.arrItems[index];
            element.getComponent('rankItem').setlevel(index + 1);
            element.getComponent('rankItem').hideAll();
        }
        //开始获取排行榜
        if (typeof wx !== 'undefined') {
            for (let index = 0; index < this.arrItems.length; index++) {
                const element = this.arrItems[index];
                element.getComponent('rankItem').level.node.active = false;
            }
            this.getFriendRank();
        } else if (typeof FBInstant !== 'undefined') {
            this.getRank();
        }
    },

    getFriendRank: function () {
        console.log("getFriendRank");
        var sprite = this.content.getChildByName('sprite');
        //sprite.width = this.content.width;

        let w = sprite.width;
        let h = sprite.height;
        let x = this.innerview.x - 0.5 * w;
        let y = this.innerview.y - 0.5 * h;
        this.drawRect = {
            x: x,
            y: y,
            width: w,
            height: h
        };
        console.log('draw rect:', this.drawRect, "this.content.width :" + this.content.width, "this.innerview.width" + this.innerview.width + "sprite.width :" + sprite.width);
        ThirdAPI.getRank({
            rect: this.drawRect,
            callback: (entries) => {
                if (typeof entries === 'object') {
                    this.updateContent(entries);
                    // this.getMyRank();
                } else if (typeof entries === 'string') {
                    this.updateWxRank = 100;
                }
            }
        }, 'Friend')
    },


    //初始化群排行
    initGetGroupRank: function (canShowGameClub) {
        console.log("getGroupRank");

        this.canShowGameClub = canShowGameClub;
        var sprite = this.content.getChildByName('sprite');

        let w = sprite.width; //this.content.width;
        let h = sprite.height; //this.content.height;
        let x = this.innerview.x - 0.5 * w;
        let y = this.innerview.y - 0.5 * h;
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
            callback: (entries) => {
                console.log('getGroupRank,oncallback', entries);
                if (typeof entries === 'object') {
                    this.updateContent(entries);
                    // this.getMyRank();
                } else if (typeof entries === 'string') {
                    if (entries == 'success') {
                        this.cleanRank();
                        this.updateWxRank = 1;
                        //游戏群排行分享成功
                        var biManager = require('biManager');
                        biManager.bilog(biManager.groupShare, null);
                    } else if (entries == 'failed') {
                        this.closeThis();
                        Global.game.showDialogText('分享失败！', {
                            x: 0,
                            y: 20
                        });
                        console.log('查看排行榜，分享到群失败');
                    } else {
                        //游戏群排行分享成功
                        var biManager = require('biManager');
                        biManager.bilog(biManager.groupShare, null);
                        this.cleanRank();
                        this.updateWxRank = 1;
                    }
                }
            }
        }, 'Group')
    },

    getGroupRank: function () {
        console.log("getGroupRank");

        var sprite = this.content.getChildByName('sprite');

        let w = sprite.width; //this.content.width;
        let h = sprite.height; //this.content.height;
        let x = this.innerview.x - 0.5 * w;
        let y = this.innerview.y - 0.5 * h;
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
            callback: (entries) => {
                console.log('getGroupRank,oncallback', entries);
                if (typeof entries === 'object') {
                    this.updateContent(entries);
                    // this.getMyRank();
                } else if (typeof entries === 'string') {
                    if (entries == 'success') {
                        this.cleanRank();
                        this.updateWxRank = 1;
                        //游戏群排行分享成功
                        var biManager = require('biManager');
                        biManager.bilog(biManager.groupShare, null);
                    } else if (entries == 'failed') {
                        this.showType = 1;
                        this.lbl_btn_group.string = '查看群排行';
                        this.cleanRank();
                        this.getFriendRank();
                    } else {
                        //游戏群排行分享成功
                        var biManager = require('biManager');
                        biManager.bilog(biManager.groupShare, null);
                        this.cleanRank();
                        this.updateWxRank = 1;
                    }
                }
            }
        }, 'Group')
    },

    //每日排行榜
    getDailyRank: function () {
        console.log("getDailyRank");
        var sprite = this.content.getChildByName('sprite');
        //sprite.width = this.content.width;

        let w = sprite.width;
        let h = sprite.height;
        let x = this.innerview.x - 0.5 * w;
        let y = this.innerview.y - 0.5 * h;
        this.drawRect = {
            x: x,
            y: y,
            width: w,
            height: h
        };

        console.log('draw rect:', this.drawRect, "this.content.width :" + this.content.width, "this.innerview.width" + this.innerview.width + "sprite.width :" + sprite.width);
        ThirdAPI.getRank({
            rect: this.drawRect,
            callback: (entries) => {
                if (typeof entries === 'object') {
                    this.updateContent(entries);
                    // this.getMyRank();
                } else if (typeof entries === 'string') {
                    if (entries == 'success') {
                        this.cleanRank();
                        this.updateWxRank = 1;
                        //游戏群排行分享成功
                        var biManager = require('biManager');
                        biManager.bilog(biManager.dailyRank, null);
                    } else if (entries == 'failed') {
                        /*this.showType = 1;
                        this.lbl_btn_group.string = '查看群排行';
                        this.cleanRank();
                        this.getFriendRank();*/
                    } else {
                        //游戏群排行分享成功
                        var biManager = require('biManager');
                        biManager.bilog(biManager.dailyRank, null);
                        this.cleanRank();
                        this.updateWxRank = 1;
                    }
                }
            }
        }, 'Daily')
    },

    //从fb上获取排行榜
    getRank: function () {
        if (typeof FBInstant === 'undefined') return;
        var self = this;
        FBInstant.getLeaderboardAsync('my_allrank')
            .then(leaderboard => {
                return leaderboard.getEntriesAsync();
            })
            .then(entries => {
                self.updateContent(entries);
                self.getMyRank();
            })
            .catch(error => {});
    },

    updateContent: function (entries) {
        if (!entries) {
            for (let index = 0; index < this.arrItems.length; index++) {
                const element = this.arrItems[index];
                if (element) {
                    element.active = fasle;
                }
            }
        } else {
            this.entries = entries;
            for (let index = 0; index < this.entries.length; index++) {
                const element = this.arrItems[index];
                if (element) {
                    const ent = this.entries[index];
                    element.getComponent('rankItem').setScore(ent.getScore());
                    element.getComponent('rankItem').setlevel(ent.getRank());
                    element.getComponent('rankItem').setNameAndPhoto(ent.getExtraData());
                    //this.content.addChild(element);
                }
            }
        }
    },

    updateMyContent: function (entri) {
        if (parseInt(entri.getRank()) <= 10) {
            return;
        }

        let index = this.entries.length;
        if (index == 10) {
            index = 9;
        }

        const element = this.arrItems[index];
        element.getComponent('rankItem').setScore(entri.getScore());
        element.getComponent('rankItem').setlevel(entri.getRank());
        element.getComponent('rankItem').setNameAndPhoto(entri.getExtraData());
    },

    cleanRank: function () {
        var sprite = this.content.getChildByName('sprite');
        sprite.getComponent(cc.Sprite).spriteFrame = null;
    },

    closeThis: function () {
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        if (this.canShowGameClub) {
            ThirdAPI.showGameClub(true);
        }
    },

    update(dt) {
        if (this.updateWxRank && this.updateWxRank > 100) {
            this.updateWxRank = 1;
            try {
                let openDataContext = wx.getOpenDataContext();
                let sharedCanvas = openDataContext.canvas;

                let texture = new cc.Texture2D();
                texture.initWithElement(sharedCanvas);
                texture.handleLoadedTexture();
                let sp = new cc.SpriteFrame(texture);

                var sprite = this.content.getChildByName('sprite');
                if (sprite) {
                    sprite.getComponent(cc.Sprite).type = cc.Sprite.Type.TILED;

                    sprite.width = texture.width;
                    sprite.height = texture.height - 90;
                    sprite.getComponent(cc.Sprite).spriteFrame = sp;
                }

                this.myrankSpr.spriteFrame = sp;
                this.myrankSpr.node.height = texture.height;
            } catch (error) {

            }
        } else {
            this.updateWxRank++;
        }
    },
});