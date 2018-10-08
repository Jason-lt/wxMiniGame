window.Global = {
    hNum: 5, //横向个数
    vNum: 8, //纵向个数
    itemSize: 100,
    soonItemSize: 70, //即将出现格子的大小
    itemSplit: 0, //棋子之间的间隔

    screenWidth: 960, //屏幕宽度
    screenHeight: 640, //屏幕高度
    paddingButtom: -100, //距离底部
    gridNumSize: 24, //格子上的分数大小
    bornXgridNum: 2, //格子在x从左至右的第几格开始生产
    weightScores: [{
            id: 2,
            weight: 11 / 60
        },
        {
            id: 4,
            weight: 11 / 60
        },
        {
            id: 8,
            weight: 11 / 60
        },
        {
            id: 16,
            weight: 11 / 60
        },
        {
            id: 32,
            weight: 11 / 60
        },
        {
            id: 64,
            weight: 5 / 60
        },
    ],
    weightScores2: [{
            id: 2,
            weight: 16 / 70
        },
        {
            id: 4,
            weight: 15 / 70
        },
        {
            id: 8,
            weight: 12 / 70
        },
        {
            id: 16,
            weight: 12 / 70
        },
        {
            id: 32,
            weight: 5 / 70
        },
        {
            id: 64,
            weight: 5 / 70
        },
        {
            id: 128,
            weight: 5 / 70
        },
    ],


    gridRandomScores: [2, 4, 8, 16, 32, 64], //随机格子分数
    gridRandomScores2: [],

    joinRandomScores: [], //加入随机的格子分数
    gridDownSpeed: 1700, //正常下落的速度，时间=距离／速度
    gridQuickDownSpeed: 5000, //快速向下滑动的下落的速度
    gridCombineDownSpeed: 600, //合并之后的格子下落的速度
    moveThreshold: 125, //左右移动的阈值
    moveDownThreshold: 150, //上下移动的阈值
    gridMaxScore: 1024, //格子的最大分数
    combineTime: 2000, //格子的合并时间
    gridDownDelayTime: 1, //格子下落时的停顿时间

    shareImages: ['weixin_fenxiang-2.png', 'weixin_fenxiang-3.png', 'weixin_fenxiang-4.png', 'weixin_fenxiang-5.png'], //微信分享界面的显示图片随机
    shareTexts: [
        '这游戏玩不到2万分的自己退群吧',
        '方块界最好玩的2048，2048界最好玩的俄罗斯方块',
        '朋友圈智商最高的一群人，已经悄悄玩起了这个',
        '本以为，这波我必不会死，结果……',
        '欧美玩家已经玩疯了！国内终于开放了，点击查看',
        '来自战斗民族的游戏!',
        '8090的回忆，俄罗斯方块重磅回归',
        '玩这个坐过了3站，但是合成了3个2048这波不亏！',
        '我已凑齐7个2048，来一起召唤神龙吧！',
        '智慧与美貌并存，俄罗斯与2048双飞。',
        '白富美都去约会了，剩下矮穷矬的我还在这里玩这个！',
        '加班这辈子不可能加班，只能玩这个勉强维持生活酱紫'
    ],

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

    isBGMPlaying: true,
    isPaused: false,

    game: null, //game实例
    gridController: null,

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

    shareReward: 10, //分享可获得钻石数量

    reviveTimes: 0, //每一局的复活次数
    reviveTotalTimes: 1, //每一局的复活总次数
    reviveTodayTimes: 10, //每天可复活的次数
    reviveShareTimes: 0, //当天可以复活分享的次数

    clearVNum: 3, //消除的行数

    combineTimes: 0, //合并的次数

    testEnabled: false,
    canTest: false,

    accessTime: 480000,
    addTimes: 2,

    //wx最高分数
    wxScore: 0,
    //wx的金币数
    wxGold: 0,


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
    forJoin: 0.2, //0.1
};