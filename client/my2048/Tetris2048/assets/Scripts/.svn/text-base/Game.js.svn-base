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
let Tmp = require('Tmp')
let TmpOne = require('TmpOne')
cc.Class({
    extends: cc.Component,

    properties: {
        girdRoot: {
            default: null,
            type: cc.Prefab,
        },
        loadingUI: {
            default: null,
            type: cc.Node,
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
        propInfoPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //提示文本
        tipsNode: {
            default: null,
            type: cc.Node,
        },

    },

    onLoad() {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            //cc.renderer.enableDirtyRegion(false);
        }
        //请求cdn数据
        //2048配置测试更新
        var httpUtils = this.getComponent('httpUtils');

        this.tipsNode.active = false;
        this.initGameinfo();

        // var wxRewardVideoAd = require('wxRewardVideoAd');
        // wxRewardVideoAd.initCreateReward();

        //请求cdn数据
        var httpUtils = this.getComponent('httpUtils');
        let self = this;
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/my2048/2048version_14.json', function (data) {
            try {
                if (data === -1) {
                    self.startLoadRes();
                    console.log('请检查网络！');
                } else {
                    var jsonData = JSON.parse(data);
                    console.log(jsonData);
                    if (jsonData) {

                        if (jsonData.cdnGameConfig) {
                            Global.cdnGameConfig = jsonData.cdnGameConfig;
                        }

                        // banner广告信息
                        if (jsonData.bannerAdConfig) {
                            Global.bannerAdConfig = jsonData.bannerAdConfig;
                            console.log('Banner ad config:', Global.bannerAdConfig);
                        }
                    } else {
                        console.log('读取cdn文件错误，取本地数据');
                    }
                    console.log('Global.cdnGameConfig.totalSwith:' + Global.cdnGameConfig.totalSwith);
                    self.startLoadRes();
                }
            } catch (error) {
                self.startLoadRes();
                console.log(error);
            }
        });

        console.log('startgame', Global.cdnGameConfig);

        //请求内链图
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/my2048/linkImages/linkImages.json', function (data) {
            if (data === -1) {
                console.log('请检查网络！');
            } else {
                console.log('从CDN获取内敛图数据');
                var jsonData = JSON.parse(data);
                console.log(jsonData);
                Global.linkImages = jsonData.linkImages;
                console.log(Global.linkImages);
            }
        });

        // 请求cdn分享图数据
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/my2048/shareInfo.json', function (data) {
            if (data === -1) {
                console.log('请检查网络！');
            } else {
                console.log('从CDN获取分享图数据');
                var jsonData = JSON.parse(data);
                console.log(jsonData);
                Global.cdnShareImages = jsonData.shareImages;
                Global.cdnTexts = jsonData.shareTexts;

                if (jsonData.propShareImages) {
                    Global.propShareImages = jsonData.propShareImages;
                }
                if (jsonData.propShareTexts) {
                    Global.propShareTexts = jsonData.propShareTexts;
                }
                console.log('道具分享图片配置文件：', Global.propShareImages);

                console.log(Global.cdnShareImages);
            }
        });



        //var self = this;
        //Global.LoadAtlas = require("LoadAtlas");
        //Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function () {});
        //Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
        //    self.loadingGame();
        //});

        Global.game = this.getComponent('Game');

        //每周清空排行榜数据
        //ThirdAPI.clearRankData();
    },

    startLoadRes: function () {
        var self = this;
        Global.LoadAtlas = require("LoadAtlas");
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function () {});
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            //self.startGame();
            self.loadingGame();
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
                videoData: {
                    videoDate: d.toDateString(),
                    Num: 0,
                },
            }
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
        }

        //判断是否初始化道具数量
        if (!Global.gameinfo.hasInit) {
            console.log('not hasInit ')
            Global.gameinfo.hasInit = true;
            Global.gameinfo.clearPropNum = 1;
            Global.gameinfo.superPropNum = 1;
            Global.gameinfo.doublePropNum = 0;
            ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
            console.log('not hasInit ', Global.gameinfo);
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
    },

    loadingGame: function () {
        // 加载界面/ReadyGo
        this.loadingUI.opacity = 0;
        this.loadingUI.active = true;
        var self = this;
        this.loadingUI.runAction(cc.sequence(
            cc.fadeIn(1),
            cc.delayTime(1),
            cc.fadeOut(1),
            cc.callFunc(function () {
                self.loadingUI.active = false;
                self.startGame();
                self.getPorps();
            })
        ));
    },

    getPorps: function () {
        console.log('检测是否从微信群进入...');
        var retCode = ThirdAPI.isFromGroup();
        if (retCode != -1) {
            console.log('是从微信群进入...');
            //Global.uiScript.startUI.getComponent('startUI').playGetGoldEffect();
            if (retCode == 1) {
                //点击得清除道具
                if (Global.gameinfo.clearPropNum >= Global.clearPropLimit) {
                    Global.game.showDialogPropText('道具数量已达上限！');
                } else {
                    console.log('获得消除锤锤一个');
                    //Global.game.showPropDialog(true, '恭喜获得消除锤锤道具一个！回赠给好友一个吧！');
                    Global.game.showDialogPropText('恭喜获得消除锤锤道具一个！回赠给好友一个吧！');
                    Global.gameinfo.clearPropNum++;
                    ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                }
            } else if (retCode == 2) {
                //点击得万能道具
                if (Global.gameinfo.superPropNum >= Global.superPropLimit) {
                    Global.game.showDialogPropText('道具数量已达上限！');
                } else {
                    console.log('获得万能道具一个');
                    //Global.game.showPropDialog(true, '恭喜获得万能道具一个！回赠给好友一个吧！');
                    Global.game.showDialogPropText('恭喜获得万能道具一个！回赠给好友一个吧！');
                    Global.gameinfo.superPropNum++;
                    ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                }
            } else if (retCode == 3) {
                //点击得双倍道具
                if (Global.gameinfo.doublePropNum >= Global.doublePropLimit) {
                    Global.game.showDialogPropText('道具数量已达上限！');
                } else {
                    //Global.game.showPropDialog(true, '恭喜获得双倍道具一个！回赠给好友一个吧！');
                    Global.game.showDialogPropText('恭喜获得双倍道具一个！回赠给好友一个吧！');
                    Global.gameinfo.doublePropNum++;
                    ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                }
            }
        } else {
            console.log('不是从微信群进入...');
        }
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
    showRank: function () {
        if (!Global.rankui) {
            Global.rankui = cc.instantiate(this.rankPrefab).getComponent("rankUI");
        }
        if (Global.rankui.node.parent) {
            Global.rankui.node.parent.removeChild(Global.rankui.node);
        }
        this.node.addChild(Global.rankui.node);
        Global.rankui.initData();
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

    //显示道具分享弹框
    showPropDialog: function (isChest, showText, parmaIndex) {
        if (!Global.propInfoUI) {
            Global.propInfoUI = cc.instantiate(this.propInfoPrefab).getComponent("UIPropInfo");
        }
        if (Global.propInfoUI.node.parent) {
            Global.propInfoUI.node.parent.removeChild(Global.propInfoUI.node);
        }
        this.node.addChild(Global.propInfoUI.node);
        Global.propInfoUI.initData(isChest, showText, parmaIndex);
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

    //道具提示文本
    showDialogPropText: function (text) {
        this.tipsNode.active = true;
        this.tipsNode.setLocalZOrder(10);
        this.tipsNode.stopAllActions();
        var label = this.tipsNode.getChildByName('label');
        label.getComponent(cc.Label).string = text;
        this.tipsNode.getChildByName("sprite").width = cc.find('Canvas').width;

        setTimeout(() => {
            this.tipsNode.active = false;
        }, 2000);
    },

    //分享完的提示文字
    showDialogText: function (text, p) {
        //总开关判断
        if (Global.cdnGameConfig.totalSwith) {
            console.log('开关已打开，不显示文字提示');
            return;
        }
        this.tipsNode.active = true;
        this.tipsNode.setLocalZOrder(10);
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
});