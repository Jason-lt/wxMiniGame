(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '706f3NfOLBHb7CfrXxA4ezP', 'Global', __filename);
// Scripts/Global.js

"use strict";

window.Global = {
    cdnGameConfig: {
        "totalSwith": false, //游戏总开关7
        "startScoreSwith": false, //开始分数开关
        "startScoreLimit": 1000, //开始界面的分数限制
        "reviveScoreSwith": true, //复活分数开关
        "reviveScoreLimit": 1000, //复活界面的分数限制
        "shareScoreSwith": true, //分享界面的开关
        "shareScoreLimit": 500, //分享界面的分数限制
        "popPropTotalTimes": 1, //每一局可100%加标识的最大次数
        "weightRate": 0.5, //加标志的概率
        "markScoreEquals": [128, 1024], //可以加标识的分数格子
        "scoreEquals": [256, 512, 2048, 4096], //弹出宝箱的分数
        "newUserPropCd": 60000, //新用户弹出道具cd时间
        "newUserScore": 0, //新用户分数限制
        "newUserEquals": [64],
        "validTime": 3600000, //群里小卡片的奖励有效期popPropTotalTimes
        "bombShareTimes": 3, //爆炸每局的分享次数
        "bombDoubleRate": 3, //爆炸翻倍次数
        "createGridNumForClear": -1, //生产格子数量产生消除锤锤
        "createGridNumForSuper": -1, //生产格子数量产生万能道具
        "histroyMaxScore": 200, //历史最高分数,
        "dailyStartTime": 1535245481, //是秒数，不是毫秒
        // "coolingTime": 180000, //是秒数，不是毫秒
        "version": "v.1.7.6",
        "itemNumber": 45, //控制格子宝箱(首次弹出)
        "gridAddBox": 120, //控制格子宝箱,
        "banSwtich": true, //ip检测开关
        "banList": ["北京", "上海", "广州", "深圳", "天津", "成都", "杭州"] //屏蔽城市
    },
    bannerAdConfig: {
        "swith": false,
        "showHeight": 100,
        "interval": 20000 //显示banner广告的间隔时间
    },
    reviveConfig: {
        "clearVNum": 3,
        "costNum": 50
    },
    startConfig: {
        "addStone": 5
    },

    singinRewardConfig: {
        "一": { "numer": 10, "des": "x10", "index": 1 },
        "二": { "numer": 20, "des": "x20", "index": 2 },
        "三": { "numer": 1, "des": "富豪皮肤", "index": 3 },
        "四": { "numer": 30, "des": "x30", "index": 4 },
        "五": { "numer": 50, "des": "x50", "index": 5 },
        "六": { "numer": 80, "des": "x80", "index": 6 },
        "七": { "numer": 1, "des": "扑克版皮肤", "index": 7 }
    },

    hNum: 5, //横向个数
    vNum: 7, //纵向个数
    itemSize: 93,
    soonItemSize: 70, //即将出现格子的大小
    itemSplit: 0, //棋子之间的间隔
    linePosY: 0, //线的y位置坐标
    lineHight: 0, //线的总高度

    screenWidth: 960, //屏幕宽度
    screenHeight: 640, //屏幕高度
    paddingButtom: -100, //距离底部
    gridNumSize: 24, //格子上的分数大小
    bornXgridNum: 2, //格子在x从左至右的第几格开始生产

    weightConfig: null, //权重配置
    dailyConfig: null, //每日挑战配置文件

    historyMaxScore: 0, //历史最高分
    isPropGuide: false, //是否道具引导
    candropProp: false,

    popBoxTimer: 0, //记录上次合并弹出宝箱时间

    rewardConfig: {
        items: [{
            id: 1,
            inviteTotalNum: 1,
            desc: "邀请{0}位好友上线",
            rewardNum: 30
        }, {
            id: 2,
            inviteTotalNum: 2,
            desc: "邀请{0}位好友上线",
            rewardNum: 30
        }, {
            id: 3,
            inviteTotalNum: 3,
            desc: "邀请{0}位好友上线",
            rewardNum: 30
        }, {
            id: 4,
            inviteTotalNum: 4,
            desc: "邀请{0}位好友上线",
            rewardNum: 30
        }, {
            id: 5,
            inviteTotalNum: 5,
            desc: "邀请{0}位好友上线",
            rewardNum: 30
        }],
        inviteNum: 30,
        dailyRewardNum: 30,
        dailyTime: [{
            startTime: 36000,
            endTime: 64800
        }, {
            startTime: 64800,
            endTime: 86400
        }]
    },
    tcpData: {}, //服务器数据
    helpInfo: null,
    loginDate: '', //登录时的日期


    gridRandomScores: [2, 4, 8, 16, 32, 64], //随机格子分数
    gridRandomScores2: [],

    joinRandomScores: [], //加入随机的格子分数
    gridDownSpeed: 1200, //正常下落的速度，时间=距离／速度
    gridQuickDownSpeed: 5000, //快速向下滑动的下落的速度
    gridCombineDownSpeed: 600, //合并之后的格子下落的速度
    moveThreshold: 125, //左右移动的阈值
    moveDownThreshold: 150, //上下移动的阈值
    gridMaxScore: 1024, //格子的最大分数
    combineTime: 2000, //格子的合并时间
    gridDownDelayTime: 1, //格子下落时的停顿时间

    cdnShareImages: null,
    cdnTexts: null,
    propShareImages: null,
    propShareTexts: {
        "01": "10W分大佬都在用的消除锤锤免费送，快来抢！",
        "02": "10W分大佬都在用的万能方块免费送，快来抢！"
    },
    shareImages: ['weixin_fenxiang-5.jpg'], //微信分享界面的显示图片随机
    shareTexts: ['这游戏玩不到2万分的自己退群吧', '方块界最好玩的2048，2048界最好玩的俄罗斯方块', '朋友圈智商最高的一群人，已经悄悄玩起了这个', '本以为，这波我必不会死，结果……', '欧美玩家已经玩疯了！国内终于开放了，点击查看', '来自战斗民族的游戏!', '8090的回忆，俄罗斯方块重磅回归', '玩这个坐过了3站，但是合成了3个2048这波不亏！', '我已凑齐7个2048，来一起召唤神龙吧！', '智慧与美貌并存，俄罗斯与2048双飞。', '白富美都去约会了，剩下矮穷矬的我还在这里玩这个！', '加班这辈子不可能加班，只能玩这个勉强维持生活酱紫'],

    //向上飞的数字或者金币
    canFlyNums: [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
    canFlyGolds: [1024, 2048, 4096],
    //每次合成所加的金币数
    addGold: {
        '1024': 1,
        '2048': 1,
        '4096': 2
    },
    flyNumPools: [],
    costGold: 15, //每次点击道具消耗的金币数量

    LoadAtlas: null,

    isBGMPlaying: true, //背景音乐状态
    isSoundPlaying: true, //音效
    isPaused: false,

    game: null, //game实例
    gridController: null,
    myUtil: null,

    startUI: null, //主界面的startUI脚本
    shareUI: null,
    battleRootScript: null,
    uiScript: null,
    dataScript: null,
    rankui: null,
    storeUI: null,
    reviveUI: null,
    titleUI: null,
    titleInfoUI: null,
    propInfoUI: null,
    rewardUI: null,
    addPropInfoUI: null,

    linkImages: null,
    shareManager: null,

    shareReward: 10, //分享可获得星星数量

    reviveTimes: 0, //每一局的复活次数
    reviveTotalTimes: 1, //每一局的复活总次数
    reviveTodayTimes: 10, //每天可复活的次数
    reviveShareTimes: 0, //当天可以复活分享的次数

    clearVNum: 4, //消除的行数

    combineTimes: 0, //合并的次数

    testEnabled: false,
    canTest: false,

    accessTime: 480000,
    addTimes: 2,

    //wx最高分数
    wxScore: 0,
    //wx的金币数
    wxGold: 0,

    isDailyLimit: false,
    dailyVNum: 5,
    dailyBattleTimes: 3, //每日挑战次数最高上限

    tipsPos: null,

    gameinfo: {
        shareTimes: 0, //向好友索取的分享次数
        shareTotalTimes: 0, //分享的大次数
        shareDate: 0, //记录当天的日期
        shareTime: 0, //记录倒计时的时间

        shareData1: {
            shareDate: 0,
            arrOpenGId: []
        },
        shareData2: {
            shareDate: 0,
            arrOpenGId: []
        },
        shareData3: {
            shareDate: 0,
            arrOpenGId: []
        },
        //邀请用户列表
        inviteUserList: {
            inviteDate: 0,
            userList: []
        },
        hasInit: false, //是否有初始化
        clearPropNum: 0, //清除道具
        superPropNum: 0, //万能道具
        doublePropNum: 0, //双倍道具

        dailyTime: 0,
        dailyScore: 0,
        battleTimes: 3,

        showRewardVideoAdTimes: 0, //看广告的次数
        showRewardVideoAdDate: '' //看广告日期
    },

    showTotalTimes: 3, //总次数

    clearPropLimit: 5, //清除道具拥有上限
    superPropLimit: 5, //万能道具拥有上限
    doublePropLimit: 5, //双倍道具拥有上限


    usePropStatus: -1, //-1无道具使用, 0:锤子，1:万能，2:双倍 6:格子宝箱
    randomPropCode: [0, 1],

    randomPropInfo: {
        0: {
            name: '消除锤锤',
            desc: '我这把锤子可以锤掉一切',
            addPropSprite: 'clear_spr', //分享获得道具的精灵名称
            gainAddPropNum: 2, //分享加道具的数量
            limitForGame: 3
        },
        1: {
            name: '万能道具',
            desc: '万能方块，使用后跟着你变',
            addPropSprite: 'super_spr',
            gainAddPropNum: 2,
            limitForGame: 5
        },
        2: {
            name: '双倍道具',
            desc: '双倍方块，使用后分数根本停不下来',
            addPropSprite: 'double_spr',
            gainAddPropNum: 2,
            limitForGame: 2
        },
        4: {
            name: '星星',
            desc: '星星',
            addPropSprite: 'zuan',
            gainAddPropNum: 30
        }
    },
    randomChestWeight: 0.15, //随机宝箱的概率

    randomGemStone: [3, 4, 5, 6, 7, 8], //向好友索取的随机星星数量
    // gemStoneInfo: {
    //     getTimes: 0, //向好友获取的次数
    //     showShareTime: 0, //显示分享好友的按钮时间
    //     time: 0, //记录每天的时间（时间戳）
    // },
    getForTotalTimes: 5, //向好友索取的总次数
    dailyTotalTimes: 3, //向好友索取每天的总次数
    //shareEndForTotalTimes: 5, //分享界面的分享给好友的总次数
    intervalTime: 900000, //显示向好友索取的间隔时间10分钟（毫秒）

    //fbname
    fbname: '',
    //照片
    fbphoto: '',
    //fb上的分数
    fbScore: 0,

    // 商店相关数据
    skinIndex: 0, // 当前皮肤
    storeData: null, // 已购皮肤列表

    // 成就相关数据
    titleData: null, // 已解锁成就列表
    titleDateData: null, // 已解锁成就日期列表
    titleUnlockData: null, // 已达成但是未解锁成就列表

    shareData: null,

    titleMaxScore: 0,

    waitToDown: 0.5, //0.5
    forMerge: 0.2 //0.1
};

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
        //# sourceMappingURL=Global.js.map
        