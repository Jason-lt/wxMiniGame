(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '41a6d+zz9JLm6SvBYPugiIf', 'Game', __filename);
// Scripts/Game.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var ThirdAPI = require('./common/ThirdAPI');
var Tmp = require('Tmp');
var TmpOne = require('TmpOne');
cc.Class({
    extends: cc.Component,

    properties: {
        girdRoot: {
            default: null,
            type: cc.Prefab
        },
        loadingUI: {
            default: null,
            type: cc.Node
        },
        bannerCloseBtn: {
            default: null,
            type: cc.Node
        },
        //声音
        btnSound: {
            default: null,
            type: cc.Prefab
        },
        /*
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
                //奖励预设
                rewardPrefab: {
                    default: null,
                    type: cc.Prefab,
                },
                propInfoPrefab: {
                    default: null,
                    type: cc.Prefab,
                },
                addPropInfoPrefab: {
                    default: null,
                    type: cc.Prefab,
                },*/
        //提示文本
        tipsNode: {
            default: null,
            type: cc.Node
        },

        bannerAdInstance: null
    },

    onLoad: function onLoad() {
        console.log("***", new Date().getTime());
        //记载游戏打点
        var biManager = require('biManager');
        biManager.bilog(biManager.loadGame, null);

        Global.game = this.getComponent('Game');
        this.tipsNode.active = false;

        var myUtil = require('myUtil');
        myUtil.resetInitData();
        //记录登录时的时间
        Global.loginDateStr = new Date().toDateString();

        //tcpManager.websocket.init();
        //tcpManager.sendCmd.lisiner();

        this.startLoadRes();

        //请求cdn数据
        var httpUtils = this.getComponent('httpUtils');
        var self = this;
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/my2048/my2048config1.json', function (data) {
            try {
                if (data === -1) {
                    //self.startLoadRes();
                    console.log('请检查网络！');
                } else {
                    var jsonData = JSON.parse(data);
                    console.log("jsonData:", jsonData);
                    if (jsonData) {
                        //cdn开关配置
                        if (jsonData.cdnGameConfig) {
                            Global.cdnGameConfig = jsonData.cdnGameConfig;
                        } else {
                            console.log('读取cdn文件错误，取本地数据');
                        }
                        //banner广告配置
                        if (jsonData.bannerAdConfig) {
                            Global.bannerAdConfig = jsonData.bannerAdConfig;
                        }
                        //复活消除行数
                        if (jsonData.reviveConfig) {
                            if (jsonData.reviveConfig.clearVNum) {
                                Global.clearVNum = jsonData.reviveConfig.clearVNum;
                            }
                        }
                        //add添加钻石数量
                        if (jsonData.startConfig) {
                            Global.startConfig = jsonData.startConfig;
                        }
                    }
                    listenUtil.eventCtrl.trigger('cdnchange', null);
                    console.log('Global.cdnGameConfig.totalSwith:' + Global.cdnGameConfig.totalSwith, Global.bannerAdConfig.swith);
                    //self.startLoadRes();
                }
            } catch (error) {
                //self.startLoadRes();
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

        //请求掉率配置文件
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/my2048/weightConfig.json', function (data) {
            try {
                if (data === -1) {
                    self.loadLocalWeightConfig();
                    console.log('请检查网络！');
                } else {
                    var jsonData = JSON.parse(data);
                    console.log("jsonData:", jsonData);
                    if (jsonData && jsonData.weightConfig) {
                        Global.weightConfig = jsonData.weightConfig;
                        console.log('从cdn读取掉率成功：', Global.weightConfig);
                    } else {
                        self.loadLocalWeightConfig();
                    }
                }
            } catch (error) {
                self.loadLocalWeightConfig();
                console.log('aaaaa:', error);
            }
        });

        //请求每日挑战json数据
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/my2048/grids.json', function (data) {
            try {
                if (data === -1) {
                    self.loadLocalDailyConfig();
                    console.log('请检查网络！');
                } else {
                    var jsonData = JSON.parse(data);
                    console.log("daily jsonData:", jsonData);
                    if (jsonData) {
                        Global.dailyConfig = jsonData;
                        console.log('从cdn读取每日挑战关卡成功：', Global.dailyConfig);
                    } else {
                        self.loadLocalDailyConfig();
                    }
                }
            } catch (error) {
                self.loadLocalDailyConfig();
                console.log(error);
            }
        });
    },


    loadingGame: function loadingGame() {
        // 加载界面/ReadyGo
        this.loadingUI.opacity = 0;
        this.loadingUI.active = true;
        var self = this;
        this.loadingUI.runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(1), cc.fadeOut(1), cc.callFunc(function () {
            self.loadingUI.active = false;

            console.log("***3", new Date().getTime());
            //记录成功进入游戏打点
            var biManager = require('biManager');
            biManager.bilog(biManager.enterGame, null);
            self.startGame();
            self.getProp();
            self.setTest();

            //初始化好友排行
            ThirdAPI.initFriendRank();
        })));
    },

    //开始加载资源并启动游戏
    startLoadRes: function startLoadRes() {
        console.log("***2", new Date().getTime());
        var self = this;
        Global.shareManager = require('./common/shareManager');
        Global.LoadAtlas = require("LoadAtlas");
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function () {});
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            self.loadingGame();
        });
    },

    setTest: function setTest() {},

    //加载本地掉率配置文件
    loadLocalWeightConfig: function loadLocalWeightConfig() {
        cc.loader.loadRes('weightConfig', function (err, data) {
            Global.weightConfig = data.weightConfig;
            console.log('读取本地掉率json文件', Global.weightConfig.oneWeightRate, Global.weightConfig.oneTotalWeight);
        });
    },

    //加载本地每日挑战的关卡数据
    loadLocalDailyConfig: function loadLocalDailyConfig() {
        cc.loader.loadRes('grids', function (err, data) {
            Global.dailyConfig = data;
            console.log("读取本地掉率json文件", data);
        });
    },

    //判断是否从群里面点击进入，有额外奖励道具
    getProp: function getProp() {
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
                    Global.game.showDialogPropText('恭喜获得万能道具一个！回赠给好友一个吧！');
                    Global.gameinfo.superPropNum++;
                    ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                }
            } else if (retCode == 3) {
                //点击得双倍道具
                if (Global.gameinfo.doublePropNum >= Global.doublePropLimit) {
                    Global.game.showDialogPropText('道具数量已达上限！');
                } else {
                    Global.game.showDialogPropText('恭喜获得双倍道具一个！回赠给好友一个吧！');
                    Global.gameinfo.doublePropNum++;
                    ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
                }
            } else if (retCode == 4) {
                Global.game.showDialogPropText('恭喜获得钻石！回赠给好友一个吧！');

                if (typeof wx !== 'undefined') {
                    /* let data = ThirdAPI.loadLocalScore();
                     var score = parseInt(data.maxscore);
                     var gold = parseInt(data.gold);
                     ThirdAPI.loadScore((maxscore, gold) => {
                         score = parseInt(maxscore);
                         gold = parseInt(gold);
                         console.log('game on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
                     });
                     Global.wxGold += 30;
                     ThirdAPI.saveScore(score, Global.wxGold);*/
                    console.log("加钻石1");
                    if (Global.startUI) {
                        console.log("加钻石2");
                        setTimeout(function () {
                            Global.startUI.updateGold(30);
                        }, 100);
                    } else {
                        console.log("加钻石3");
                        if (Global.startUI) {
                            setTimeout(function () {
                                Global.startUI.updateGold(30);
                            }, 500);
                        }
                    }
                }
            }
        } else {
            console.log('不是从微信群进入...');
        }
    },

    //加钻石存本地功能
    addStone: function addStone(stoneNum, msg) {
        console.log("好友互助 加钻石1");
        if (Global.startUI) {
            console.log("好友互助 加钻石2");
            Global.game.showDialogPropText(msg);
            Global.startUI.updateGold(stoneNum);
        } else {
            console.log("好友互助 加钻石3");
            var self = this;
            setTimeout(function () {
                self.addStone(stoneNum);
            }, 100);
        }
    },

    // 清除游戏缓存数据
    clearGameInfo: function clearGameInfo() {
        ThirdAPI.clearFriendGenStoneInfo();
    },

    //开始游戏
    startGame: function startGame() {
        var _this = this;

        var self = this;
        Global.LoadAtlas.loadPrefab('UIRoot', function (uiRootPrefab) {
            if (!Global.uiScript) {
                Global.uiScript = cc.instantiate(uiRootPrefab).getComponent("uiRoot");
            }
            //如果有父节点则删除自身节点
            if (Global.uiScript.node.parent) {
                Global.uiScript.node.parent.removeChild(Global.uiScript.node);
            }
            Global.uiScript.showStartUI();

            if (Global.startUI) {
                console.log('监听开始界面的cdn数据变化');
                listenUtil.eventCtrl.addListen('cdnchange', Global.startUI.cdnchange.bind(_this));
            }

            self.node.addChild(Global.uiScript.node);

            self.initStoreData();
            self.initTitleData();

            self.initUIData();
        });
    },

    //显示分享界面
    showShareUI: function showShareUI() {
        var self = this;
        Global.LoadAtlas.loadPrefab('UIRoot', function (uiRootPrefab) {
            if (!Global.uiScript) {
                Global.uiScript = cc.instantiate(uiRootPrefab).getComponent("uiRoot");
            }
            //如果有父节点则删除自身节点
            if (Global.uiScript.node.parent) {
                Global.uiScript.node.parent.removeChild(Global.uiScript.node);
            }
            self.node.addChild(Global.uiScript.node);
            Global.uiScript.showShareUI();
        });
    },

    //显示排行榜界面
    showRank: function showRank(canShowGameClub) {
        var self = this;
        Global.LoadAtlas.loadPrefab('rankUI', function (rankPrefab) {
            if (!Global.rankui) {
                Global.rankui = cc.instantiate(rankPrefab).getComponent("rankUI");
            }
            if (Global.rankui.node.parent) {
                Global.rankui.node.parent.removeChild(Global.rankui.node);
            }
            self.node.addChild(Global.rankui.node);
            Global.rankui.initData(canShowGameClub);
        });
    },

    showGroupRank: function showGroupRank(canShowGameClub) {
        var self = this;
        Global.LoadAtlas.loadPrefab('rankUI', function (rankPrefab) {
            if (!Global.rankui) {
                Global.rankui = cc.instantiate(rankPrefab).getComponent("rankUI");
            }
            if (Global.rankui.node.parent) {
                Global.rankui.node.parent.removeChild(Global.rankui.node);
            }
            self.node.addChild(Global.rankui.node);
            Global.rankui.initGetGroupRank(canShowGameClub);
        });
    },

    //显示商店界面
    showStore: function showStore() {
        var self = this;
        Global.LoadAtlas.loadPrefab('UIStore', function (storePrefab) {
            if (!Global.storeUI) {
                Global.storeUI = cc.instantiate(storePrefab).getComponent("UIStore");
            }
            if (Global.storeUI.node.parent) {
                Global.storeUI.node.parent.removeChild(Global.storeUI.node);
            }
            self.node.addChild(Global.storeUI.node);
            Global.storeUI.initData();
            //记载成功进入皮肤打点
            var biManager = require('biManager');
            biManager.bilog(biManager.skin, null);
        });
    },

    //显示复活界面
    showRevive: function showRevive() {
        var self = this;
        Global.LoadAtlas.loadPrefab('reviveUI', function (revivePrefab) {
            if (!Global.reviveUI) {
                Global.reviveUI = cc.instantiate(revivePrefab).getComponent("reviveUI");
            }
            if (Global.reviveUI.node.parent) {
                Global.reviveUI.node.parent.removeChild(Global.reviveUI.node);
            }
            self.node.addChild(Global.reviveUI.node);
            Global.reviveUI.initData();
        });
    },

    //显示成就界面
    showTitle: function showTitle() {
        var self = this;
        Global.LoadAtlas.loadPrefab('UITitle', function (titlePrefab) {
            if (!Global.titleUI) {
                Global.titleUI = cc.instantiate(titlePrefab).getComponent("UITitle");
            }
            if (Global.titleUI.node.parent) {
                Global.titleUI.node.parent.removeChild(Global.titleUI.node);
            }
            self.node.addChild(Global.titleUI.node);
            Global.titleUI.initData();
            if (Global.titleUI) {
                Global.titleUI.onClose();
            }
        });
    },

    //显示成就查看界面
    showTitleInfo: function showTitleInfo() {
        var self = this;
        Global.LoadAtlas.loadPrefab('UITitleInfo', function (titleInfoPrefab) {
            if (!Global.titleInfoUI) {
                Global.titleInfoUI = cc.instantiate(titleInfoPrefab).getComponent("UITitleInfo");
            }
            if (Global.titleInfoUI.node.parent) {
                Global.titleInfoUI.node.parent.removeChild(Global.titleInfoUI.node);
            }
            self.node.addChild(Global.titleInfoUI.node);
            Global.titleInfoUI.initData();
        });
    },

    //弹出好友互助奖励界面
    showRewardUI: function showRewardUI() {
        var self = this;
        Global.LoadAtlas.loadPrefab('rewardInfo', function (rewardPrefab) {
            if (!Global.rewardUI) {
                Global.rewardUI = cc.instantiate(rewardPrefab).getComponent("rewardUI");
            }
            if (Global.rewardUI.node.parent) {
                Global.rewardUI.node.parent.removeChild(Global.rewardUI.node);
            }
            self.node.addChild(Global.rewardUI.node);
            //tcpManager.sendCmd.sendGetClickUserList();
            Global.rewardUI.initData();
        });
    },

    //显示道具分享弹框
    showPropDialog: function showPropDialog(isChest, showText, parmaIndex) {
        var self = this;
        Global.LoadAtlas.loadPrefab('propInfo', function (propInfoPrefab) {
            if (!Global.propInfoUI) {
                Global.propInfoUI = cc.instantiate(propInfoPrefab).getComponent("UIPropInfo");
            }
            if (Global.propInfoUI.node.parent) {
                Global.propInfoUI.node.parent.removeChild(Global.propInfoUI.node);
            }
            self.node.addChild(Global.propInfoUI.node);
            Global.propInfoUI.initData(isChest, showText, parmaIndex);
        });
    },

    //显示道具数量不足，拉起分享界面
    showAddPropDialog: function showAddPropDialog(parma) {
        var _this2 = this;

        var self = this;
        Global.LoadAtlas.loadPrefab('addPropInfo', function (addPropInfoPrefab) {
            if (!Global.addPropInfoUI) {
                Global.addPropInfoUI = cc.instantiate(addPropInfoPrefab).getComponent("addPropInfo");
            }
            if (Global.addPropInfoUI.node.parent) {
                Global.addPropInfoUI.node.parent.removeChild(Global.addPropInfoUI.node);
            }
            _this2.node.addChild(Global.addPropInfoUI.node);
            Global.addPropInfoUI.initData(parma);
        });
    },

    //初始化ui信息
    initUIData: function initUIData() {
        //初始化商城数据
        var self = this;
        Global.LoadAtlas.loadPrefab('UIStore', function (storePrefab) {
            if (!Global.storeUI) {
                Global.storeUI = cc.instantiate(storePrefab).getComponent("UIStore");
            }
            if (Global.storeUI.node.parent) {
                Global.storeUI.node.parent.removeChild(Global.storeUI.node);
            }
            self.node.addChild(Global.storeUI.node);
            Global.storeUI.initData();

            if (Global.storeUI) {
                Global.storeUI.onClose();
            }

            self.showTitle();
            if (Global.titleUI) {
                Global.titleUI.onClose();
            }

            //Global.titleUI.updateItemsState(1);
            //Global.titleUI.updateItemsState(2);
            //Global.titleUI.updateItemsState(3);
        });
    },

    //加载已购皮肤数据
    initStoreData: function initStoreData() {
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
    initTitleData: function initTitleData() {
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
            };
            ThirdAPI.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
        } else if (Global.shareData.shareDate != d.toDateString()) {
            //console.log('无今日分享限制数据，初始化');
            Global.shareData = {
                shareTimes: 0,
                shareDate: d.toDateString()
            };

            ThirdAPI.saveShareData(Global.shareData.shareTimes, Global.shareData.shareDate);
        }

        //获取系统日期
        //var d1 = new Date(Date.now());
        //console.log(d1.toDateString());
    },

    // 存储分数到服务器
    saveScore: function saveScore() {
        //更新金币并存储
        if (typeof wx !== 'undefined') {
            var data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore(function (maxscore, gold) {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                //console.log('gridController on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
            });
            ThirdAPI.saveScore(score, Global.wxGold);
        }
        if (Global.startUI) {
            Global.startUI.updateGold(0);
        }
    },

    //道具提示文本
    showDialogPropText: function showDialogPropText(text) {
        var _this3 = this;

        this.tipsNode.active = true;
        this.tipsNode.setLocalZOrder(10);
        this.tipsNode.stopAllActions();
        var label = this.tipsNode.getChildByName('label');
        label.getComponent(cc.Label).string = text;
        this.tipsNode.getChildByName("sprite").width = cc.find('Canvas').width;

        setTimeout(function () {
            _this3.tipsNode.active = false;
        }, 2000);
    },

    //分享完的提示文字
    showDialogText: function showDialogText(text, p) {
        var _this4 = this;

        //总开关判断
        if (!Global.cdnGameConfig.totalSwith) {
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

        setTimeout(function () {
            _this4.tipsNode.active = false;
        }, 2000);
    },

    //播放声音
    playSound: function playSound(sname, volume) {
        if (!Global.isSoundPlaying) {
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

    switchSound: function switchSound() {
        Global.isSoundPlaying = !Global.isSoundPlaying;
    },

    //重新开始
    restart: function restart() {
        this.enterScene();
    },

    //打开游戏战斗界面
    enterScene: function enterScene(list) {
        var self = this;
        Global.LoadAtlas.loadPrefab('gridRoot', function (girdRoot) {
            if (!Global.gridController) {
                Global.gridController = cc.instantiate(girdRoot);
            }
            if (Global.gridController.parent) {
                Global.gridController.parent.removeChild(Global.gridController);
            }
            self.node.addChild(Global.gridController);
            Global.gridController.getComponent("gridController").initGridData(list);
        });
    }

    /*
        creatBannerAdBtn: function () {
            this.bannerAdInstance = cc.instantiate(this.bannerCloseBtn);
            this.bannerAdInstance.setLocalZOrder(100);
            this.node.addChild(this.bannerAdInstance);
             this.bannerAdInstance.active = false;
        },
         //显示或者隐藏banner广告
        showOrHideBannerAd: function (parma) {
            if (!parma) {
                return;
            }
            //var pos = parma.pos;
             var spriteFrame = this.bannerAdInstance.getComponent(cc.Sprite).spriteFrame;
            var width = spriteFrame.getRect().width;
            var height = spriteFrame.getRect().height;
             this.bannerAdInstance.setPosition(cc.p(parma.x - width, parma.y - height));
            // this.bannerAdInstance.setPosition(cc.p(0, 0));
            this.bannerAdInstance.setLocalZOrder(10000);
            this.bannerAdInstance.active = true;
            console.log('******');
             this.showBannerAd();
        },
         showBannerAd: function () {
            if (this.bannerAdInstance) {
                this.bannerAdInstance.active = true;
            }
        },
        hideBannerAd: function () {
            if (this.bannerAdInstance) {
                this.bannerAdInstance.active = false;
            }
            var wxBannerAd = require('wxBannerAd');
            wxBannerAd.hideBannerAd();
        },
    */

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
        //# sourceMappingURL=Game.js.map
        