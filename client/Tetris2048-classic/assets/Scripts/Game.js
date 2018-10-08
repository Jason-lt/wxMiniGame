// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let ThirdAPI = require('./common/ThirdAPI')
cc.Class({
    extends: cc.Component,

    properties: {
        girdRoot: {
            default: null,
            type: cc.Prefab,
        },
        bg: {
            default: null,
            type: cc.Sprite,
        },
        //声音
        btnSound: {
            default: null,
            type: cc.Prefab,
        },

        //战斗
        battleRootPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //ui
        uiRootPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //排行
        rankPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //商店
        storePrefab: {
            default: null,
            type: cc.Prefab,
        },
        //复活界面
        revivePrefab: {
            default: null,
            type: cc.Prefab,
        },
        //成就
        titlePrefab: {
            default: null,
            type: cc.Prefab,
        },
        //成就查看
        titleInfoPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //提示文本
        tipsNode: {
            default: null,
            type: cc.Node,
        },
        btnCloseBanner: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        console.log('主场景加载');

        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            //cc.renderer.enableDirtyRegion(false);
        }
        //请求cdn数据
        //2048配置测试更新
        var httpUtils = this.getComponent('httpUtils');

        this.tipsNode.active = false;
        //this.clearGameInfo();
        this.initGameinfo();

        //请求cdn数据
        this.getConfigFile();
        console.log('startgame', Global.cdnGameConfig);

        var self = this;
        Global.LoadAtlas = require("LoadAtlas");
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function () {});
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            self.startGame();

            //ThirdAPI.registOnShow({callback: self.getReviveCoin.bind(self)});
            self.getReviveCoin(Global.reviveCoinState);
            Global.registReviveCoinCallback(self.getReviveCoin.bind(self));
        });

        Global.game = this.getComponent('Game');

        ThirdAPI.initFriendRank();
        //this.getReviveCoin();

        //每周清空排行榜数据
        //ThirdAPI.clearRankData();
    },

    // 从cdn获取文件
    getConfigFile: function () {
        let self = this;
        try {
            let xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", "https://sanxqn.nalrer.cn/tysanxiao/classics2048/config1.json", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300)) {
                        console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
                        try {
                            let ret = JSON.parse(xhr.responseText);
                            console.log('get config', ret);

                            // 游戏开关
                            
                            Global.cdnGameConfig = ret.cdnGameConfig;
                            console.log('Global.cdnGameConfig.totalSwith:' + Global.cdnGameConfig.totalSwith);

                            // 游戏内链图
                            Global.linkImages = ret.linkImages;
                            console.log('LinkImages:', Global.linkImages);

                            // 游戏分享图及文案
                            Global.cdnShareImages = ret.shareImages;
                            Global.cdnTexts = ret.shareTexts;
                            console.log('Share images and texts:', Global.cdnShareImages, Global.cdnTexts);

                            Global.cdnShareImages1 = ret.shareImages1;
                            Global.cdnTexts1 = ret.shareTexts1;
                            console.log('Share prop images and texts:', Global.cdnShareImages1, Global.cdnTexts1);

                            // 音频文件
                            if (ret.bgm && ret.bgm.length > 0) {
                                let audioManager = require('audioManager');
                                for (let i = 0; i < ret.bgm.length; i++) {
                                    console.log('注册背景音乐:', i, ret.bgm[i]);
                                    audioManager.registBGM(i, ret.bgm[i]);
                                }

                                audioManager.loopBGM();
                            }

                            // banner广告信息
                            if (ret.bannerAdConfig) {
                                Global.bannerAdConfig = ret.bannerAdConfig;
                                console.log('Banner ad config:', Global.bannerAdConfig);
                            }

                        } catch (e) {
                            console.log("err:" + e);
                        }
                    } else {
                        console.log('get config error', xhr);
                    }
                }
            };
            xhr.send();
        } catch (error) {
            console.log(' get config error', error);
        }
    },

    startLoadRes: function () {
        var self = this;
        Global.LoadAtlas = require("LoadAtlas");
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function () {});
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            self.startGame();
        });
    },

    // 清除游戏缓存数据
    clearGameInfo: function () {
        ThirdAPI.clearFriendGenStoneInfo();
    },

    // 加载游戏缓存数据
    initGameinfo: function () {
        var d = new Date(Date.now());

        // 加载游戏缓存数据
        Global.gameinfo = ThirdAPI.loadFriendGenStoneInfo();

        // 没有数据初始化
        if (!Global.gameinfo) {
            Global.gameinfo = {
                shareTimes: 0,
                shareTotalTimes: 0,
                shareDate: d.toDateString(),
                shareTime: 0,
                shareData1: {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
                },
                shareData2: {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
                },
                shareData3: {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
                },
                shareGroupData: {
                    shareDate: d.toDateString(),
                    arrOpenGId: [],
                },
                reviveCoinNum: 0,
                shareReviveCoinData: {
                    shareDate: d.toDateString(),
                    arrInviteCode: [],
                },
                videoData: {
                    videoDate: d.toDateString(),
                    Num: 0,
                },
            }
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        //判断是否是当日(向朋友索取)
        if (Global.gameinfo.shareDate != d.toDateString()) {
            Global.gameinfo.shareTimes = 0;
            Global.gameinfo.shareTotalTimes = 0;
            Global.gameinfo.shareTime = 0;
            Global.gameinfo.shareDate = d.toDateString();
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        if (!Global.gameinfo.videoData || Global.gameinfo.videoData.videoDate != d.toDateString()) {
            Global.gameinfo.videoData = {
                videoDate: d.toDateString(),
                Num: 0,
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        if (!Global.gameinfo.shareData1 || Global.gameinfo.shareData1.shareDate != d.toDateString()) {
            Global.gameinfo.shareData1 = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        if (!Global.gameinfo.shareData2 || Global.gameinfo.shareData2.shareDate != d.toDateString()) {
            Global.gameinfo.shareData2 = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }
        if (!Global.gameinfo.shareData3 || Global.gameinfo.shareData3.shareDate != d.toDateString()) {
            Global.gameinfo.shareData3 = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        // 分享群的奖励的数据存储
        if (!Global.gameinfo.shareGroupData || Global.gameinfo.shareGroupData.shareDate != d.toDateString()) {
            Global.gameinfo.shareGroupData = {
                shareDate: d.toDateString(),
                arrOpenGId: [],
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        // 复活卡的数据存储
        if (!Global.gameinfo.shareReviveCoinData || Global.gameinfo.shareReviveCoinData.shareDate != d.toDateString()) {
            Global.gameinfo.shareReviveCoinData = {
                shareDate: d.toDateString(),
                arrInviteCode: [],
            };
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        if (Global.gameinfo.reviveCoinNum == undefined) {
            Global.gameinfo.reviveCoinNum = 1;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        } else if (Global.gameinfo.reviveCoinNum > 1) {
            Global.gameinfo.reviveCoinNum = 1;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        console.log('game info : ', Global.gameinfo);
    },

    //判断是否获得复活币
    getReviveCoin: function (reviveCoinState) {
        console.log('getReviveCoin ', reviveCoinState);
        var shareTicket = reviveCoinState.shareTicket;
        var shareInfo = reviveCoinState.shareInfo;
        console.log('检测是否从微信群进入...', shareTicket, shareInfo);
        if (shareTicket && shareInfo) {
            console.log('是从微信群进入...');
            if (shareInfo.sourceCode == 3020000006) {
                console.log('是从微信群道具分享点进入...');

                var d = new Date();
                console.log('分享时间和点击时间对比：', d.toString(), shareInfo.shareTime);
                if (Date.parse(d) - Date.parse(shareInfo.shareTime) < 60 * 60 * 1000) {
                    console.log('链接可用');

                    if (Global.gameinfo.reviveCoinNum == 0) {
                        if (Global.gameinfo.shareReviveCoinData.arrInviteCode.indexOf(shareInfo.inviteCode) != -1) {
                            console.log('今日已经领取过次好友赠送的复活卡了', shareInfo.inviteCode);
                            Global.game.showDialogTextAlawys('今日已经领取过次好友赠送的复活卡了!');
                        } else {
                            console.log('此人的送道具链接没点过', shareInfo.inviteCode);
                            Global.gameinfo.shareReviveCoinData.arrInviteCode.push(shareInfo.inviteCode);
                            Global.gameinfo.reviveCoinNum = 1;
                            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

                            if (Global.startUI) {
                                Global.startUI.updateReviveCoin();
                            }
                            if (Global.reviveUI) {
                                Global.reviveUI.updateReviveCoin();
                            }
                            this.showDialogTextAlawys("获得复活卡一张！");
                        }
                    } else {
                        this.showDialogTextAlawys("复活卡已达数量上限");
                    }
                } else {
                    console.log('链接已过期');
                    this.showDialogTextAlawys("已被抢光了，下次加油吧！");
                }
            }
        } else {
            console.log('不是从微信群进入...');
        }

        /*
        var d = new Date();
        console.log('当前时间：', d, Date.parse(d));
        setTimeout(() => {
            var d1 = new Date();
            console.log('当前时间：', d1, Date.parse(d1), Date.parse(d)+10*1000);
        }, 10000);
        */
    },

    //开始游戏
    startGame: function () {
        if (!Global.uiScript) {
            Global.uiScript = cc.instantiate(this.uiRootPrefab).getComponent("uiRoot");
        }
        //如果有父节点则删除自身节点
        if (Global.uiScript.node.parent) {
            Global.uiScript.node.parent.removeChild(Global.uiScript.node);
        }
        Global.uiScript.showStartUI();

        this.node.addChild(Global.uiScript.node);

        this.initStoreData();
        this.initTitleData();

        this.initUIData();
    },

    //显示分享界面
    showShareUI: function () {
        if (!Global.uiScript) {
            Global.uiScript = cc.instantiate(this.uiRootPrefab).getComponent("uiRoot");
        }
        //如果有父节点则删除自身节点
        if (Global.uiScript.node.parent) {
            Global.uiScript.node.parent.removeChild(Global.uiScript.node);
        }
        this.node.addChild(Global.uiScript.node);
        Global.uiScript.showShareUI();
    },

    //显示排行榜界面
    showRank: function (isGroup) {
        if (!Global.rankui) {
            Global.rankui = cc.instantiate(this.rankPrefab).getComponent("rankUI");
        }
        if (Global.rankui.node.parent) {
            Global.rankui.node.parent.removeChild(Global.rankui.node);
        }
        this.node.addChild(Global.rankui.node);
        Global.rankui.initData(isGroup);
    },

    //显示商店界面
    showStore: function () {
        if (!Global.storeUI) {
            Global.storeUI = cc.instantiate(this.storePrefab).getComponent("UIStore");
        }
        if (Global.storeUI.node.parent) {
            Global.storeUI.node.parent.removeChild(Global.storeUI.node);
        }
        this.node.addChild(Global.storeUI.node);
        Global.storeUI.initData();
    },

    //显示复活界面
    showRevive: function () {
        if (!Global.reviveUI) {
            Global.reviveUI = cc.instantiate(this.revivePrefab).getComponent("reviveUI");
        }
        if (Global.reviveUI.node.parent) {
            Global.reviveUI.node.parent.removeChild(Global.reviveUI.node);
        }
        this.node.addChild(Global.reviveUI.node);
        Global.reviveUI.initData();
    },

    //显示成就界面
    showTitle: function () {
        if (!Global.titleUI) {
            Global.titleUI = cc.instantiate(this.titlePrefab).getComponent("UITitle");
        }
        if (Global.titleUI.node.parent) {
            Global.titleUI.node.parent.removeChild(Global.titleUI.node);
        }
        this.node.addChild(Global.titleUI.node);
        Global.titleUI.initData();
    },

    //显示成就查看界面
    showTitleInfo: function () {
        if (!Global.titleInfoUI) {
            Global.titleInfoUI = cc.instantiate(this.titleInfoPrefab).getComponent("UITitleInfo");
        }
        if (Global.titleInfoUI.node.parent) {
            Global.titleInfoUI.node.parent.removeChild(Global.titleInfoUI.node);
        }
        this.node.addChild(Global.titleInfoUI.node);
        Global.titleInfoUI.initData();
    },

    //初始化ui信息
    initUIData: function () {
        this.showStore();
        if (Global.storeUI) {
            Global.storeUI.onClose();
        }

        this.showTitle();
        if (Global.titleUI) {
            Global.titleUI.onClose();
        }

        //Global.titleUI.updateItemsState(1);
        //Global.titleUI.updateItemsState(2);
        //Global.titleUI.updateItemsState(3);
    },

    //加载已购皮肤数据
    initStoreData: function () {
        //ThirdAPI.clearInfo('skinstore');
        Global.storeData = ThirdAPI.loadInfo('skinstore');
        if (Global.storeData == null) {
            Global.storeData = [];
        }

        //ThirdAPI.saveScore(0, 0);

        //ThirdAPI.clearCurrentSkin();
        Global.skinIndex = ThirdAPI.loadCurrentSkin();
        //console.log('current skin index : ', Global.skinIndex);
    },

    //加载成就数据
    initTitleData: function () {
        //ThirdAPI.clearInfo('title');
        //Global.titleData = ThirdAPI.loadInfo('title');
        if (Global.titleData == null) {
            Global.titleData = [];
        }

        //ThirdAPI.clearInfo('title-date');
        //Global.titleDateData = ThirdAPI.loadInfo('title-date');
        if (Global.titleDateData == null) {
            Global.titleDateData = [];
        }

        //ThirdAPI.clearInfo('title-unlock');
        //Global.titleUnlockData = ThirdAPI.loadInfo('title-unlock');
        if (Global.titleUnlockData == null) {
            Global.titleUnlockData = [];
        }

        //ThirdAPI.clearInfo('title-unlock');
        Global.shareData = ThirdAPI.loadShareData();
        var d = new Date(Date.now());
        if (!Global.shareData) {
            //console.log('无分享限制数据，初始化');
            var d1 = new Date(Date.now());
            //console.log(d1.toDateString());
            Global.shareData = {
                shareTimes: 0,
                shareDate: d1.toDateString()
            }
            ThirdAPI.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
        } else if (Global.shareData.shareDate != d.toDateString()) {
            //console.log('无今日分享限制数据，初始化');
            Global.shareData = {
                shareTimes: 0,
                shareDate: d.toDateString()
            }

            ThirdAPI.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
        }

        //获取系统日期
        //var d1 = new Date(Date.now());
        //console.log(d1.toDateString());
    },

    // 存储分数到服务器
    saveScore: function () {
        //更新金币并存储
        if (typeof wx !== 'undefined') {
            let data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                //console.log('gridController on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
            });
            ThirdAPI.saveScore(score, Global.wxGold);
        }
    },

    //分享完的提示文字
    showDialogText: function (text, p) {
        //总开关判断
        if (Global.cdnGameConfig.totalSwith) {
            console.log('开关已打开，不显示文字提示');
            return;
        }
        this.tipsNode.active = true;
        this.tipsNode.setLocalZOrder(1000);
        this.tipsNode.stopAllActions();
        // this.tipsNode.x = p.x;
        // this.tipsNode.y = p.y;
        var label = this.tipsNode.getChildByName('label');
        label.getComponent(cc.Label).string = text;
        this.tipsNode.getChildByName("sprite").width = cc.find('Canvas').width;

        setTimeout(() => {
            this.tipsNode.active = false;
        }, 2000);
    },

    //分享完的提示文字
    showDialogTextAlawys: function (text, p) {
        /*
        console.log('提示文字：', text);
        this.tipsNode.active = true;
        this.tipsNode.setLocalZOrder(1000);
        this.tipsNode.stopAllActions();
        // this.tipsNode.x = p.x;
        // this.tipsNode.y = p.y;
        var label = this.tipsNode.getChildByName('label');
        label.getComponent(cc.Label).string = text;
        this.tipsNode.getChildByName("sprite").width = cc.find('Canvas').width;

        setTimeout(() => {
            this.tipsNode.active = false;
        }, 2000);
        */

        console.log('提示文字：', text);
        this.tipsNode.active = true;
        this.tipsNode.setLocalZOrder(1000);
        this.tipsNode.stopAllActions();
        // this.tipsNode.x = p.x;
        // this.tipsNode.y = p.y;
        var label = this.tipsNode.getChildByName('label');
        label.getComponent(cc.Label).string = text;
        this.tipsNode.getChildByName("sprite").width = cc.find('Canvas').width;

        var self = this;
        this.tipsNode.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            self.tipsNode.active = false;
        })));
    },

    //播放声音
    playSound: function (sname, volume) {
        if (!Global.isBGMPlaying) {
            return;
        }
        var self = this;
        cc.loader.loadRes("audio/" + sname, cc.AudioClip, function (err, clip) {
            var sound = cc.instantiate(self.btnSound);
            self.node.addChild(sound);
            var audioSource = sound.getComponent(cc.AudioSource);
            audioSource.clip = clip;
            audioSource.volume = volume;
            audioSource.play();
        });
    },

    //重新开始
    restart: function () {
        this.enterScene();
    },

    //打开游戏战斗界面
    enterScene: function () {
        if (!Global.gridController) {
            Global.gridController = cc.instantiate(this.girdRoot);
        }
        if (Global.gridController.parent) {
            Global.gridController.parent.removeChild(Global.gridController);
        }
        this.node.addChild(Global.gridController);
        Global.gridController.getComponent("gridController").initGridData();
    },

    onCloseBanner: function () {
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.hideBannerAd();
        this.btnCloseBanner.active = false;
    },
});