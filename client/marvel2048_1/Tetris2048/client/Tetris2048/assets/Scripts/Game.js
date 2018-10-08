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

    },

    onLoad() {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            //cc.renderer.enableDirtyRegion(false);
        }
        //请求cdn数据
        //2048配置测试更新
        var httpUtils = this.getComponent('httpUtils');
        
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/mavel2048/2048version_11.json', function (data) {
            if (data === -1) {
                console.log('请检查网络！');
            } else {
                var jsonData = JSON.parse(data);
                console.log(jsonData);
                Global.cdnGameConfig = jsonData.cdnGameConfig;
                if (!Global.cdnGameConfig) {
                    Global.cdnGameConfig = Global.cdnGameConfig;
                    console.log('读取cdn文件错误，取本地数据');
                }
                console.log('Global.cdnGameConfig.totalSwith:' + Global.cdnGameConfig.totalSwith);
            }
        });
        
       console.log('startgame',Global.cdnGameConfig);

        //请求内链图
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/new2048/linkImages/linkImages_1.json', function (data) {
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
        httpUtils.httpGets('https://sanxqn.nalrer.cn/tysanxiao/mavel2048/shareInfo_1.json.json', function (data) {
            if (data === -1) {
                console.log('请检查网络！');
            } else {
                console.log('从CDN获取分享图数据');
                var jsonData = JSON.parse(data);
                console.log(jsonData);
                Global.cdnShareImages = jsonData.shareImages;
                Global.cdnTexts = jsonData.shareTexts;
                console.log(Global.cdnShareImages);
            }
        });

        this.tipsNode.active = false;
        this.initGameinfo();

        var self = this;
        Global.LoadAtlas = require("LoadAtlas");
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/skins", function () {});
        Global.LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            self.startGame();
        });

        Global.game = this.getComponent('Game');


        //每周清空排行榜数据
        //ThirdAPI.clearRankData();
        var str = "http://sanxqn.nalrer.cn/tysanxiao/new2048/linkImages/2048_Img_1.png";
        var index = str.lastIndexOf('/');
        console.log(index);
        var str2 = str.slice(index + 1);
        console.log(str2);


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

        //ThirdAPI.saveScore(0, 5000);

        //ThirdAPI.clearCurrentSkin();
        Global.skinIndex = ThirdAPI.loadCurrentSkin();
        if (Global.skinIndex == 0) {
            Global.skinIndexFrame = 5;
        }
        else if (Global.skinIndex == 1 ) {
            Global.skinIndexFrame = 0;
        }
        else if (Global.skinIndex == 2) {
            Global.skinIndexFrame = 1;
        }
        else if (Global.skinIndex == 3) {
            Global.skinIndexFrame = 2;
        }
        else if (Global.skinIndex == 4) {
            Global.skinIndexFrame = 3;
        }
        else if (Global.skinIndex == 5) {
            Global.skinIndexFrame = 4;
        }
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