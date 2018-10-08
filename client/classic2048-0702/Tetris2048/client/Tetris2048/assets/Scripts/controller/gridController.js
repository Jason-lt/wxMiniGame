let ThirdAPI = require('../common/ThirdAPI')
cc.Class({
    extends: cc.Component,

    properties: {
        //下一个好友的节点
        nextFriendNode: {
            default: null,
            type: cc.Node,
        },
        //下一个好友的精灵
        nextFriendSp: {
            default: null,
            type: cc.Sprite,
        },

        gridPrefab: {
            default: null,
            type: cc.Prefab
        },
        pauseNode: {
            default: null,
            type: cc.Node
        },
        chooseNode: {
            default: null,
            type: cc.Node
        },
        test_btnNode: {
            default: null,
            type: cc.Node
        },

        //格子内的item
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },

        //右上角显示即将下落的格子分数
        randomScore: 0,
        //即将出现的格子
        soonGridNum: {
            default: null,
            type: cc.Prefab,
        },
        soonGridInstance: null,

        startX: 0,
        startY: 0,
        //所有格子节点坐标
        allGrids: [],
        //出生的格子
        bornGrid: null,
        //开始触摸的位置坐标
        startTouchPosition: null,

        //将要合并的数组
        deleteGrids: [],
        joinGrids: [],
        //目标的格子
        targetGrid: {
            default: null,
            type: cc.Node
        },

        line: {
            default: null,
            type: cc.Sprite,
        },
        //金币节点
        goldNode: {
            default: null,
            type: cc.Node
        },
        prop: {
            default: null,
            type: cc.Node
        },
        nodesGroup: {
            default: null,
            type: cc.Node,
        },
        //清除道具
        clearPropBtn: {
            default: null,
            type: cc.Sprite,
        },
        clearLabel: {
            default: null,
            type: cc.Label,
        },
        clearAdd: {
            default: null,
            type: cc.Sprite,
        },
        //清除道具数量节点
        clearUseNumNode: {
            default: null,
            type: cc.Node
        },
        clearUseNum: {
            default: null,
            type: cc.Label,
        },
        //万能道具
        superPropBtn: {
            default: null,
            type: cc.Sprite,
        },
        superLabel: {
            default: null,
            type: cc.Label,
        },
        superAdd: {
            default: null,
            type: cc.Sprite,
        },
        //万能道具数量节点
        superUseNumNode: {
            default: null,
            type: cc.Node
        },
        superUseNum: {
            default: null,
            type: cc.Label,
        },
        //双倍道具
        doublePropBtn: {
            default: null,
            type: cc.Sprite,
        },
        doubleLabel: {
            default: null,
            type: cc.Label,
        },
        layoutNode: {
            default: null,
            type: cc.Node,
        },
        fitOffsetY: 0,
        propClearTime: 0, //使用道具消除点击格子的动画时间

        //分数
        score: {
            default: null,
            type: cc.Node,
        },
        //可下落格子
        downGrids: [],

        scoreScript: null,
        isClickBomming: false,
        clickGridNum: 0, //消除格子数量
        createItemIndex: 0,
        moveItemIndex: 0,

        startTime: 0, //开始时间
        addTimes: 0, //加速次数

        usePropTimes: 0, //使用清除道具次数
        useSuperTimes: 0, //使用万能道具的次数
        useDoubleTimes: 0, //使用万能道具的次数
        useProp: -1, //使用道具，生产下一个生效

        //弹出道具分享的次数
        popDialogTimes: 0,
    },

    onLoad: function () {
        // 适配
        //var isFitIphoneX = cc.winSize.width / cc.winSize.height < 0.50;
        var myUtil = require('myUtil');
        var isFitIphoneX = myUtil.isIphoneX();

        this.fitOffsetY = 0;
        if (isFitIphoneX) {
            this.fitOffsetY = 40;
            this.nodesGroup.setPosition(0, -this.fitOffsetY);
            this.nodesGroup.getComponent(cc.Widget).top = this.fitOffsetY;
            console.log('widght:', this.fitOffsetY);

            this.layoutNode.getPosition().y += 30;
            this.layoutNode.getComponent(cc.Widget).top += 30;
        }
    },

    initGridData: function (listParma) {
        // 适配
        //var isFitIphoneX = cc.winSize.width / cc.winSize.height < 0.50;
        var myUtil = require('myUtil');
        var isFitIphoneX = myUtil.isIphoneX();

        this.fitOffsetY = 0;
        if (isFitIphoneX) {
            this.fitOffsetY = 40;
            // this.nodesGroup.setPosition(0, -this.fitOffsetY);
            // this.nodesGroup.getComponent(cc.Widget).top = this.fitOffsetY;
            console.log('widght:', this.fitOffsetY);
        }

        //设置位置坐标
        var allWidth = Global.hNum * Global.itemSize + (Global.hNum - 1) * Global.itemSplit;
        var allHeight = Global.vNum * Global.itemSize + (Global.vNum - 1) * Global.itemSplit;

        this.startX = -(Global.screenWidth / 2) + (Global.screenWidth - allWidth) / 2 + Global.itemSize / 2;
        this.startY = 330 - this.fitOffsetY; //-(Global.screenHeight / 2) + Global.paddingButtom + allHeight - Global.itemSize + 30 - this.fitOffsetY; 

        this.scoreScript = this.score.getComponent("score");

        //重置所有数据
        this.reset();

        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.createBannerAd();
        //初始化棋盘
        this.createAllGrid();
        //添加触摸侦听
        this.setTouchControl();
        //每日挑战
        if (Global.isDailyLimit || listParma != undefined) {
            if (listParma != undefined) {
                this.startInit(listParma.list);
                this.scoreScript.addScore(listParma.score);
            } else {
                this.initForDailyLimit();
            }
        } else {
            //开始处理业务逻辑
            this.process();
        }

        //显示星星
        this.updateGold();
        //下一个好友
        this.getNextFriend();
        cc.director.getScheduler().schedule(this.getNextFriend, this, 1, false);

        this.setLine(allWidth, allHeight);
        this.pauseNode.active = false;
        this.chooseNode.active = false;
        this.nextFriendNode.active = !Global.isDailyLimit;

        this.layoutNode.active = Global.cdnGameConfig.totalSwith;
        this.test_btnNode.active = Global.canTest;
        if (Global.canTest) {
            var label = this.test_btnNode.getChildByName('Label');
            label.getComponent(cc.Label).string = '测试 ' + (Global.testEnabled ? '开' : '关');
        }
    },

    getNextFriend: function () {
        console.log("更新即将超越好友信息", this.scoreScript.scoreNum);

        this.drawRect = {
            x: 0,
            y: 0,
            width: this.nextFriendSp.node.width,
            height: this.nextFriendSp.node.height
        };
        ThirdAPI.getNextFriend({
            rect: this.drawRect,
            score: this.scoreScript.scoreNum,
            callback: (entries) => {
                console.log('获取即将超越好友信息成功');

                setTimeout(() => {
                    try {
                        let openDataContext = wx.getOpenDataContext();
                        let sharedCanvas = openDataContext.canvas;

                        let texture = new cc.Texture2D();
                        texture.initWithElement(sharedCanvas);
                        texture.handleLoadedTexture();
                        let sp = new cc.SpriteFrame(texture);
                        this.nextFriendSp.spriteFrame = sp;
                    } catch (error) {

                    }
                }, 500);
            }
        });
    },

    //每日限时初始化格子
    initForDailyLimit: function () {
        //根据初始时间来计算到现在多少天
        var myUtil = require('myUtil');
        var unixTime = (new Date()).getTime();
        var today = myUtil.getDayForYear(unixTime);
        var startDay = myUtil.getDayForYear(Global.dailyTime * 1000);
        var day = Math.abs(today - startDay);
        this.data = null;
        var self = this;
        console.log('today:' + today, "startDay:" + startDay);
        if (Global.dailyConfig && !Global.dailyConfig[day]) {
            console.log('没有json数据，取json的第一个');
            self.data = Global.dailyConfig[0];
        } else {
            console.log('取json的第' + day + "个");
            self.data = Global.dailyConfig[day];
        }
        Global.gameinfo.dailyTime = (new Date()).getTime();
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

        self.startInit(self.data);
        console.log(self.data);
    },

    startInit: function (data) {
        var num = 0;
        for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
            for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
                if (parseInt(data[num]) > 0) {
                    let item = cc.instantiate(this.itemPrefab);
                    //限时格子的初始位置
                    var pos = this.allGrids[hIndex][vIndex].getPosition();
                    item.setPosition(cc.p(pos.x, pos.y));
                    item.getComponent('itemView').initData(data[num], false);
                    this.node.addChild(item);
                    var gridScript = this.allGrids[hIndex][vIndex].getComponent('gridView');
                    gridScript.item = item.getComponent('itemView');
                    gridScript.gridNum = data[num];
                }
                num++;
            }
        }
        this.process();
    },

    //设置线的位置和大小
    setLine: function (width, height) {
        this.line.node.width = width + 20;
        this.line.node.height = height + 20;
        var linePosY = height / 2 - this.startY - Global.itemSize / 2;
        this.line.node.setPosition(cc.p(0, -linePosY));
    },

    process: function () {
        //1.格子下落
        this.down();
        //格子合并
        this.checkGridJoin();
    },

    //下落
    down: function () {
        this.isDown = false;
        this.downGrids = [];
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                if (this.resetItemAction(hIndex, vIndex, false)) {
                    this.isDown = true;
                }
            }
        }

        if (this.bornGrid && this.bornGrid.getComponent('itemView').curState > 0) {
            this.isDown = true;
        }
    },

    checkGridJoin: function () {
        let self = this;
        let downNum = 0;
        // for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
        //     for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
        //         var gridScript = self.allGrids[hIndex][vIndex].getComponent('gridView');
        //         if (gridScript.item && gridScript.item.getComponent('itemView').curState > 0) {
        //             downNum++;
        //         }
        //     }
        // }
        for (let index = 0; index < this.downGrids.length; index++) {
            const element = this.downGrids[index];
            if (element.curState > 0) {
                downNum++;
            }
        }
        if (this.bornGrid != null && this.bornGrid.getComponent('itemView').curState > 0) {
            downNum++;
        }
        if ((this.bornGrid == null || this.bornGrid.getComponent('itemView').curState == 0) && downNum == 0) {
            this.gridJoin();
        } else {
            this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                self.checkGridJoin();
            })));
        }

        //this.gridJoin();
    },

    gridJoin: function () {
        var self = this;
        //2.格子合并
        //self.bornGrid = null;

        //是否有被删除的格子
        if (self.clickGridNum > 0) {
            self.process();
            self.clickGridNum = 0;
            return;
        }

        self.clearAllJoin();

        let canJoin = false;
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                var gridScript = self.allGrids[hIndex][vIndex].getComponent('gridView');
                if (!self.findDownNum() || (self.findDownNum() && gridScript.isDown)) {
                    //执行合并
                    if (gridScript.startBianli()) {
                        canJoin = true;
                    }
                }
            }
        }

        if (canJoin) {
            Global.combineTimes++;
            console.log('要开始合并啦,combineTimes:' + Global.combineTimes);
            this.checkJoin();
        } else {
            var hightBornGrid = self.allGrids[Global.bornXgridNum][0];
            if (hightBornGrid.getComponent('gridView').item != null && !self.isDown) {
                //gameover
                let self = this;
                self.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    self.gameOver();
                })));
                return;
            }
            if (!self.isDown) {
                Global.combineTimes = 0;
                self.bornGrid = null;
                self.createItem();
            } else {
                self.process();
            }
        }
    },

    //合并判断
    checkJoin: function () {
        let self = this;
        self.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            let isFind = false;
            for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
                for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                    var gridScript = self.allGrids[hIndex][vIndex].getComponent('gridView');
                    if (gridScript.actionJoin) {
                        isFind = true;
                        break;
                    }
                }
            }
            if (!isFind) {
                self.joinComplete();
            } else {
                self.checkJoin();
            }
        })));

    },

    joinComplete: function () {
        let self = this;
        //最高点合并之后重新生产
        var hightBornGrid = self.allGrids[Global.bornXgridNum][0];
        if (hightBornGrid.getComponent('gridView').item != null) {
            //因为在最开始创建的时候下方有物体，所以不能isDown，合并完之后需要重设isDown，
            //再继续判断是否可以合并，如果没有则再生产一个item，
            self.isDown = true;
        }
        self.gridJoin();
    },

    findDownNum: function () {
        var self = this;
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                var gridScript = self.allGrids[hIndex][vIndex].getComponent('gridView');
                if (gridScript.isDown) {
                    return true;
                }
            }
        }
        return false;
    },

    //清除所有的可合并变量
    clearAllJoin: function () {
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                var gridScript = this.allGrids[hIndex][vIndex].getComponent('gridView');
                gridScript.isJoin = false;
            }
        }
    },

    //生产下落的item
    createItem: function () {
        //判断是否可以生产钻石
        //this.dropStone();

        var myUtil = require("myUtil");
        if (this.randomScore == 0) {
            this.randomScore = myUtil.randomForArray(Global.gridRandomScores);
        }

        if (Global.testEnabled) {
            this.showChooseNum();
        } else {
            this.createItem2();
        }

        /*
                //出生的目标点
                item.setPosition(cc.p(this.allGrids[Global.bornXgridNum][0].getPosition().x, this.allGrids[Global.bornXgridNum][0].getPosition().y + Global.itemSize));
                //hightBornGrid.getComponent('gridView').gridNum = this.randomScore;
                item.getComponent('itemView').initData(this.randomScore, false);
                this.node.addChild(item);

                this.bornGrid = item;

                var downSpeed = Global.gridDownSpeed;
                var downNum = this.getStopPosition(Global.bornXgridNum, 0);
                var targetView = this.allGrids[Global.bornXgridNum][downNum];

                this.bornGrid.getComponent('itemView').targetGrid = targetView;

                item.getComponent('itemView').startDownForBorn(downSpeed);

                this.setSoonGrid();
                this.process();
                this.createItemIndex++;*/
    },

    //概率掉落道具(钻石)
    dropStone: function () {
        //第一次判断分数，之后判断时间


        //判断每行是否有空余的格子,并且钻石在格子之上，概率一样
        var list = []; //格式：[[0,1],[2,4],[hIndex,vIndex]]
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            var hasGrid = false;
            for (let vIndex = Global.vNum - 1; vIndex >= 0; vIndex--) {
                var gridScript = this.allGrids[hIndex][vIndex].getComponent('gridView');
                if (gridScript.item != null) {
                    hasGrid = true;
                } else {
                    if (hasGrid) {
                        list.push([hIndex, vIndex]);
                        break;
                    }
                }


                /*
                                if (hasGrid && gridScript.item == null) {
                                    list.push([hIndex, vIndex]);
                                    break;
                                } else {
                                    //再判断
                                    hasGrid = true;
                                }*/
            }
        }
        console.log('list:', list);
        if (list.length <= 0) return;

        //随机产生一个
        var myUtil = require('myUtil');
        var targetPos = myUtil.randomForArray(list);
        var hIndex = targetPos[0];
        var vIndex = targetPos[1];



        /*
                //先判断上方是否有格子存在
                if (vIndex >= Global.vNum) {
                    return;
                }
                var upGrid = this.allGrids[hIndex][vIndex];
                if (!upGrid) return;
                var upGridScript = upGrid.getComponent("gridView");

                //判断是否有item
                if (upGridScript.item !== null) {
                    return;
                }*/
        var upGrid = this.allGrids[hIndex][vIndex];
        var upGridScript = upGrid.getComponent("gridView");
        //开始创建item
        let item = cc.instantiate(this.itemPrefab);
        //出生的目标点
        item.setPosition(upGrid.getPosition());
        var itemScript = item.getComponent('itemView');
        itemScript.isStone = true;

        itemScript.initData(0, false);
        itemScript.updateNumForProp();

        Global.gridController.addChild(item);
        upGridScript.item = itemScript;

        //var gridControllerScript = Global.gridController.getComponent("gridController");

        //itemScript.targetGrid = this.allGrids[hIndex][vIndex];
        //Global.candropProp = false;
    },

    createItem2: function () {
        if (this.useProp != -1) {
            console.log('生产道具', this.useProp);
            Global.usePropStatus = this.useProp;
        } else {
            Global.usePropStatus = -1;
        }
        this.useProp = -1;

        let item = cc.instantiate(this.itemPrefab);
        //出生的目标点
        var bornXgrid = this.allGrids[Global.bornXgridNum][0];
        var posX = 0;
        var posY = this.startY;
        if (bornXgrid) {
            var position = bornXgrid.getPosition();
            posX = position.x;
            posY = position.y;
        }
        item.setPosition(cc.p(posX, posY + Global.itemSize));

        //item.setPosition(cc.p(this.allGrids[Global.bornXgridNum][0].getPosition().x, this.allGrids[Global.bornXgridNum][0].getPosition().y + Global.itemSize));

        item.getComponent('itemView').initData(this.randomScore, false);
        item.getComponent('itemView').updateNumForProp();
        if (Global.usePropStatus == 0) {
            console.log('锤子道具');
            item.getComponent('itemView').useClear = true;
        } else if (Global.usePropStatus == 2) {
            console.log('设置双倍标识');
            item.getComponent('itemView').useDouble = true;
        }
        this.node.addChild(item);

        this.bornGrid = item;

        var downSpeed = Global.gridDownSpeed;
        var downNum = this.getStopPosition(Global.bornXgridNum, 0);
        var targetView = this.allGrids[Global.bornXgridNum][downNum];

        this.bornGrid.getComponent('itemView').targetGrid = targetView;

        item.getComponent('itemView').startDownForBorn(downSpeed);

        this.setSoonGrid();
        this.process();
        this.createItemIndex++;
    },

    //设置即将下落的格子分数
    setSoonGrid: function (nextScore) {
        if (nextScore !== undefined) {
            this.randomScore = nextScore;
        } else {
            var myUtil = require("myUtil");
            var randomScores = Global.gridRandomScores.concat(Global.joinRandomScores);
            this.randomScore = myUtil.randomForArray(randomScores);
        }

        if (!this.soonGridInstance || (this.soonGridInstance && !this.soonGridInstance.parent)) {
            this.soonGridInstance = cc.instantiate(this.soonGridNum);
            this.node.addChild(this.soonGridInstance);
        }
        this.soonGridInstance.setPosition(0, 430 - this.fitOffsetY);
        this.soonGridInstance.getComponent("itemView").initData(this.randomScore, true);
    },

    useClearProp: function () {
        //使用清除道具
        if (Global.gameinfo.clearPropNum <= 0) {
            Global.game.showDialogPropText('道具不足！');
            // console.log('调起道具分享界面');
            // var parma = {
            //     'parmaIndex': 0
            // };
            // Global.game.showAddPropDialog(parma);
            //Global.game.showPropDialog(false, "", 0);
            return;
        }
        var parma = Global.randomPropInfo[0];
        if (parma && this.usePropTimes >= parma.limitForGame) {
            Global.game.showDialogPropText('每局只能使用' + parma.limitForGame + '次道具哦');
            return;
        }
        Global.gameinfo.clearPropNum--;
        this.usePropTimes++;
        this.useProp = 0;
        //变灰
        this.setPropSprite();
        if (this.soonGridInstance) {
            this.soonGridInstance.getComponent("itemView").updateNum(0);
        }
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);

        //记载使用消除锤锤打点
        var biManager = require('biManager');
        biManager.bilog(biManager.useClearProp, null);
    },

    //使用万能道具
    useSuperProp: function () {
        console.log('aaa:', Global.usePropStatus, this.useProp);

        if (this.useProp == 1) {
            Global.game.showDialogPropText('这一次道具使用完才能再次使用！');
            return;
        }

        if (Global.gameinfo.superPropNum <= 0) {
            Global.game.showDialogPropText('道具不足！');
            //console.log('调起道具分享界面');
            // Global.game.showAddPropDialog({
            //     'parmaIndex': 1
            // });
            //Global.game.showPropDialog(false, "", 1);
            return;
        }
        var parma = Global.randomPropInfo[1];
        if (parma && this.useSuperTimes >= parma.limitForGame) {
            Global.game.showDialogPropText('每局只能使用' + parma.limitForGame + '次道具哦');
            return;
        }
        this.showChooseNum();
        // this.useSuperTimes++;
        // Global.gameinfo.superPropNum--;
        //this.useProp = 1;
        // this.setPropSprite();
        // this.soonGridInstance.getComponent("itemView").updateNum(1);
        // ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
    },

    //使用双倍道具
    useDoubleProp: function () {
        Global.game.showDialogPropText('正在努力开发中...');
        return;
        //使用清除道具
        if (Global.gameinfo.doublePropNum <= 0) {
            Global.game.showAddPropDialog({
                'parmaIndex': 2
            });
            return;
        }
        var parma = Global.randomPropInfo[2];
        if (parma && this.useDoubleTimes >= parma.limitForGame) {
            Global.game.showDialogPropText('每局只能使用' + parma.limitForGame + '次道具哦');
            return;
        }
        this.useDoubleTimes++;
        Global.gameinfo.doublePropNum--;
        this.useProp = 2;
        this.setPropSprite();
        if (this.soonGridInstance) {
            this.soonGridInstance.getComponent("itemView").updateNum(2);
        }
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
    },

    setPropSprite: function () {
        var LoadAtlas = require("LoadAtlas");
        //清除
        this.clearAdd.setVisible(false);
        this.clearUseNumNode.active = false;
        var clearParma = Global.randomPropInfo[0];
        if (clearParma && this.usePropTimes >= clearParma.limitForGame) {
            this.clearPropBtn.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'clear_spr1');
            //this.clearUseNumNode.active = false;
        } else {
            this.clearPropBtn.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'clear_spr');
            //剩余可使用道具显示
            //this.clearUseNumNode.active = true;
            if (clearParma) {
                this.clearUseNum.string = clearParma.limitForGame - this.usePropTimes;
            }
        }
        if (Global.gameinfo.clearPropNum > 0) {
            this.clearLabel.string = Global.gameinfo.clearPropNum;
            //this.clearAdd.setVisible(false);
        } else {
            this.clearLabel.string = '0';
            //this.clearAdd.setVisible(true);
        }

        //万能
        this.superUseNumNode.active = false;
        var superParma = Global.randomPropInfo[1];
        if (superParma && this.useSuperTimes >= superParma.limitForGame) {
            this.superPropBtn.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'super_spr1');
            //this.superUseNumNode.active = false;
        } else {
            this.superPropBtn.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'super_spr');
            //this.superUseNumNode.active = true;
            if (superParma) {
                this.superUseNum.string = superParma.limitForGame - this.useSuperTimes;
            }
        }
        this.superAdd.setVisible(false);
        if (Global.gameinfo.superPropNum > 0) {
            this.superLabel.string = Global.gameinfo.superPropNum;
            //this.superAdd.setVisible(false);
        } else {
            this.superLabel.string = '0';
            //this.superAdd.setVisible(true);
        }
        //this.superLabel.string = '万能方块 x' + Global.gameinfo.superPropNum;

        //双倍
        var doubleParma = Global.randomPropInfo[2];
        if (doubleParma && this.useDoubleTimes >= doubleParma.limitForGame) {
            this.doublePropBtn.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'double_spr1');
        } else {
            this.doublePropBtn.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'double_spr');
        }
        this.doubleLabel.string = '双倍方块';
    },

    //测试开关是否开启
    testEnabled: function () {
        /* Global.testEnabled = !Global.testEnabled;
         var btn_node = this.node.getChildByName('test_btn');
         if (btn_node) {
             var label = btn_node.getChildByName('Label');
             label.getComponent(cc.Label).string = '测试 ' + (Global.testEnabled ? '开' : '关');
         }*/

    },

    //关闭监听
    closeListen: function () {
        //关闭触摸
        this.node.off(cc.Node.EventType.TOUCH_START, this.nodeStart, this);
        //关闭移动
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.nodeMove, this);
    },

    createAllGrid: function () {
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                var parma = {
                    hIndex: hIndex,
                    vIndex: vIndex,
                };
                if (!this.allGrids[hIndex]) {
                    this.allGrids[hIndex] = [];
                }
                this.allGrids[hIndex][vIndex] = this.createGrid(parma);
            }
        }
    },

    //创建格子
    createGrid: function (parma) {
        //参数
        var hIndex = parma.hIndex;
        var vIndex = parma.vIndex;
        var posX = this.startX + hIndex * Global.itemSize + hIndex * Global.itemSplit;
        var posY = this.startY - vIndex * Global.itemSize - vIndex * Global.itemSplit;

        //设置格子的坐标
        var gridItem = cc.instantiate(this.gridPrefab);
        gridItem.setPosition(cc.p(posX, posY));

        gridItem.setLocalZOrder(20000);

        //设置索引和位置
        var gridView = gridItem.getComponent("gridView");
        gridView.node.setPosition(posX, posY);
        gridView.setIndex(hIndex, vIndex, this);
        this.node.addChild(gridItem);
        return gridItem;
    },

    itemClick: function (event) {
        var self = this;
        if (!self.isClickBomming) {
            return;
        }
        if (this.clickGridNum >= 1) {
            return;
        }
        var clickGrid = event.getUserData();
        self.clickGrid = clickGrid;

        //道具缩放动画停止
        this.prop.stopAllActions();
        var scale1 = cc.scaleTo(0.1, 1, 1);
        this.prop.runAction(scale1);

        //停止生产下落的格子
        // if (this.bornGrid) {
        //     this.bornGrid.pauseAllActions();
        // }
        //this.node.stopAllActions();

        //消除格子
        var scaleTime = this.clickGrid.getComponent('gridView').item.getComponent("itemView").clearItemToRemove();
        this.clickGrid.getComponent('gridView').item = null;
        //将上方的格子下落
        var currHindex = this.clickGrid.getComponent('gridView').hIndex;
        var currVindex = this.clickGrid.getComponent('gridView').vIndex;
        for (let vIndex = currVindex - 1; vIndex > 0; vIndex--) {
            var downtime = this.resetItemAction(currHindex, vIndex, true);
        }

        this.clickGridNum++;
        this.isClickBomming = false;
        //消耗金币
        Global.wxGold -= Global.costGold;
        //更新金币并存储
        if (typeof wx !== 'undefined') {
            let data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('gridController on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
            });
            ThirdAPI.saveScore(score, Global.wxGold);
        }
        //更新分数
        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;


        //console.log('scaleTime:' + scaleTime);
        //缩放动画播完后再继续下落合并的逻辑(马上按下暂停这里时间就会出现问题)
        // this.node.stopAllActions();
        // this.node.runAction(cc.sequence(cc.delayTime(scaleTime / 1000), cc.callFunc(self.process, self)));
    },

    //点击道具
    clickProp: function () {
        if (Global.wxGold < Global.costGold) {
            console.log('my costGold is ' + Global.costGold);
            return;
        }

        if (this.isClickBomming) {
            this.resetProp();
        } else {
            var scale1 = cc.scaleBy(0.4, 1.1, 1.1);
            var scale2 = cc.scaleBy(0.4, 1 / 1.1, 1 / 1.1);
            var repeat = cc.repeat(cc.sequence(scale1, scale2), 99999);
            this.prop.stopAllActions();
            this.prop.runAction(repeat);
            // if (this.bornGrid) {
            //     this.bornGrid.pauseAllActions();
            // }
            // this.node.stopAllActions();
            this.isClickBomming = true;
            this.clickGridNum = 0;
        }
    },

    resetProp: function () {
        this.isClickBomming = false;
        this.prop.stopAllActions();
        var scale1 = cc.scaleTo(0.1, 1, 1);
        this.prop.runAction(scale1);


        // if (this.bornGrid) {
        //恢复下落格子的动作，将当前格子的item置为下落格子item
        // var bornGridhIndex = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize));
        // var bornGridvIndex = Math.ceil(Math.abs((this.bornGrid.y - this.startY) / Global.itemSize));
        // this.allGrids[bornGridhIndex][bornGridvIndex].getComponent('gridView').item = this.bornGrid;
        // this.isClickBomming = false;
        //this.propClearTime = 0;
        // this.process();
        //     console.log('还可以继续下落');
        // } else {
        //     console.log('没有下落的格子');
        // }
    },

    //先获取出生点那一列最终的目标点
    getStopPosition: function (xBorn, yBorn) {
        var addIndex = 0;
        for (let index = Global.vNum - 1; index >= 0; index--) {
            var node = this.allGrids[xBorn][index];
            var gridView = node.getComponent("gridView");
            if (gridView && gridView.item == null && gridView.vIndex > yBorn) {
                addIndex++;
            }
        }
        return addIndex;
    },

    //设置鼠标或者手势操作动作
    setTouchControl: function () {
        var self = this;
        if (self.node.parent) {
            //开始触摸
            self.node.on(cc.Node.EventType.TOUCH_START, this.nodeStart, this);
            //触摸移动
            self.node.on(cc.Node.EventType.TOUCH_MOVE, this.nodeMove, this);
        }
    },

    nodeStart: function (event) {
        if (!this.bornGrid) return;
        this.startTouchPosition = event.getLocation();
        this.moveItemIndex = this.createItemIndex;
        this.moveStartX = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize));
    },

    nodeMove: function (event) {
        if (!this.bornGrid) return;
        if (this.moveItemIndex != this.createItemIndex) {
            return;
        }
        var self = this;
        if (this.bornGrid && this.bornGrid.getComponent('itemView').canMove && !cc.game.isPaused() && !this.isClickBomming) {
            var moveTemp = event.getLocation();
            var dist = moveTemp.x - self.startTouchPosition.x;
            var downDist = moveTemp.y - self.startTouchPosition.y;

            //左右移动
            var xPadding = Math.round(dist / Global.moveThreshold);
            var isUpOrDown = Math.abs(downDist) > Global.moveDownThreshold ? true : false;

            //self.startTouchPosition = moveTemp;
            var targetGrid = self.canMoveGrid(this.moveStartX + xPadding);
            if (isUpOrDown) {
                //上下移动
                var isTouchDown = moveTemp.y <= self.startTouchPosition.y ? true : false;
                //self.startTouchPosition = moveTemp;
                var targetGrid = self.canMoveQuickDown(isTouchDown);
                if (targetGrid) {
                    this.bornGrid.x = targetGrid.getPosition().x;
                    var downNum = self.getStopPosition(targetGrid.getComponent('gridView').hIndex, targetGrid.getComponent('gridView').vIndex);
                    var targetView = self.allGrids[targetGrid.getComponent('gridView').hIndex][targetGrid.getComponent('gridView').vIndex + downNum];
                    var priView = self.allGrids[targetGrid.getComponent('gridView').hIndex][targetGrid.getComponent('gridView').vIndex];
                    priView.getComponent('gridView').isDown = false;
                    targetView.getComponent('gridView').isDown = true;

                    this.bornGrid.getComponent('itemView').targetGrid = targetView;
                    //快速开始进行从出生点到最终位置的动作
                    cc.log('quick down:' + downNum);
                    if (this.bornGrid.getComponent('itemView').curState == 2 || this.bornGrid.getComponent('itemView').curState == 1) {
                        self.maxDownTime = this.bornGrid.getComponent('itemView').startQuickDownForBorn(Global.gridQuickDownSpeed);
                    }
                    self.node.stopAllActions();
                    self.checkGridJoin();
                }
            } else if (targetGrid) {
                this.bornGrid.x = targetGrid.getPosition().x;
                cc.log('change bornGridx:' + this.bornGrid.x);
                var downNum = self.getStopPosition(targetGrid.getComponent('gridView').hIndex, targetGrid.getComponent('gridView').vIndex);
                var targetView = self.allGrids[targetGrid.getComponent('gridView').hIndex][targetGrid.getComponent('gridView').vIndex + downNum];
                var priView = self.allGrids[targetGrid.getComponent('gridView').hIndex][targetGrid.getComponent('gridView').vIndex];
                priView.getComponent('gridView').isDown = false;
                targetView.getComponent('gridView').isDown = true;

                this.bornGrid.getComponent('itemView').targetGrid = targetView;
                this.bornGrid.getComponent('itemView').changeStateToWaitDown(Global.gridDownSpeed);
                self.node.stopAllActions();
                self.checkGridJoin();
            }
        }
    },

    /*是否可左右移动 */
    canMoveGrid: function (hindex) {
        //横、纵坐标的索引,向下取整
        var _hIndex = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize));
        var _vIndex = Math.ceil(Math.abs((this.bornGrid.y - this.startY) / Global.itemSize));

        if (hindex == _hIndex) {
            return null;
        }

        if (hindex < 0 || hindex >= Global.hNum) {
            return null;
        }
        //即将移动到的gird位置
        //中间元素是否可以移动
        let startX = hindex + 1;
        let endx = _hIndex - 1;
        if (hindex > _hIndex) {
            startX = _hIndex + 1;
            endx = hindex - 1;
        }
        while (startX <= endx) {
            var soonMoveGrid = this.allGrids[startX][_vIndex];
            if (soonMoveGrid && soonMoveGrid.getComponent("gridView").item == null) {
                startX++;
                continue;
            }
            return null;
        }
        var soonMoveGrid = this.allGrids[hindex][_vIndex];

        if (soonMoveGrid && soonMoveGrid.getComponent("gridView").item == null) {
            return soonMoveGrid;
        }
        return null;
    },

    /*是否可以向下移动 */
    canMoveQuickDown: function (isTouchDown) {
        //横、纵坐标的索引,向上取整
        var hIndex = Math.ceil(Math.abs((this.bornGrid.x - this.startX) / Global.itemSize));
        var vIndex = Math.floor(Math.abs((this.bornGrid.y - this.startY) / Global.itemSize));

        if (!isTouchDown) {
            return null;
        }
        if (vIndex >= (Global.vNum - 1)) {
            return null;
        }

        var soonMoveGrid = this.allGrids[hIndex][vIndex + 1];
        if (soonMoveGrid && soonMoveGrid.getComponent("gridView").item == null) {
            return soonMoveGrid;
        }
        return null;
    },

    //重设动作目标
    resetItemAction: function (hindex, vindex, isClearGrid) {
        var gridviewScript = this.allGrids[hindex][vindex].getComponent('gridView');
        if (gridviewScript.item == null) {
            return false;
        }
        var downNum;
        if (isClearGrid) {
            downNum = 1;
        } else {
            downNum = this.getStopPosition(hindex, vindex);
        }
        //设置索引
        if (downNum == 0) {
            return false;
        }

        var targetView = this.allGrids[hindex][vindex + downNum];
        targetView.getComponent('gridView').isDown = true;
        var _curitem = gridviewScript.item.getComponent('itemView');
        _curitem.targetGrid = targetView;

        var downSpeed = (this.isDown || Global.combineTimes > 0) ? Global.gridCombineDownSpeed : Global.gridDownSpeed;
        console.log('速度：' + downSpeed, Global.combineTimes);
        var curtime = _curitem.startDownForBorn(downSpeed);

        gridviewScript.item = null;
        //targetView.getComponent('gridView').item = _curitem;
        gridviewScript.gridNum = 0;
        //加入下落格子数组
        this.downGrids.push(_curitem);

        return true;
    },

    //游戏中暂停游戏
    onPauseOrResume: function () {
        Global.game.playSound('btn', 0.1);
        if (Global.isPaused) {
            if (this.bornGrid) {
                this.bornGrid.resumeAllActions();
            }
            this.node.resumeAllActions();
            this.pauseNode.active = false;
            Global.isPaused = false;
        } else {
            if (this.isClickBomming) {
                this.resetProp();
            }
            if (this.bornGrid) {
                this.bornGrid.pauseAllActions();
            }
            this.node.pauseAllActions();

            Global.isPaused = true;
            this.pauseNode.active = true;
            this.pauseNode.setLocalZOrder(10);
        }
    },

    //游戏其他功能需要暂停游戏
    onPauseGameForOther: function () {
        if (Global.isPaused) {
            if (this.bornGrid) {
                this.bornGrid.resumeAllActions();
            }
            this.node.resumeAllActions();
            Global.isPaused = false;
        } else {
            if (this.isClickBomming) {
                this.resetProp();
            }
            if (this.bornGrid) {
                this.bornGrid.pauseAllActions();
            }
            this.node.pauseAllActions();

            Global.isPaused = true;
        }
    },

    //显示数字选择
    showChooseNum: function () {
        Global.game.playSound('btn', 0.1);
        this.chooseNode.active = true;
        this.chooseNode.setLocalZOrder(1);
        this.onPauseGameForOther();
    },

    //隐藏数字选择
    hideChooseNum: function () {
        Global.game.playSound('btn', 0.1);
        this.chooseNode.active = false;
        this.onPauseGameForOther();
    },

    //重新开始
    onRestart: function () {
        Global.game.playSound('btn', 0.1);
        this.closeListen();
        this.reset();

        if (this.bornGrid && this.bornGrid.parent) {
            this.bornGrid.parent.removeChild(this.bornGrid);
        }
        Global.game.restart();
    },

    //返回主界面
    onMainScene: function () {
        Global.game.playSound('btn', 0.1);
        this.closeListen();
        this.reset();

        if (this.bornGrid && this.bornGrid.parent) {
            this.bornGrid.parent.removeChild(this.bornGrid);
        }
        Global.game.startGame();
        //返回主界面的时间如果是暂停状态那就恢复游戏
        if (cc.game.isPaused()) {
            cc.game.resume();
        }
    },

    //分享
    onShareGame: function () {
        Global.game.playSound('btn', 0.1);
        if (typeof FBInstant !== 'undefined') {
            ThirdAPI.shareGame(this.getImgBase64(), null);
        } else {
            ThirdAPI.shareGame('screenshotForDown', null, null, '125');
        }
    },

    //更新星星的数量
    updateGold: function (goldNum) {
        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;
        //判断是否可以存储和飞入
        if (Global.addGold[goldNum] === undefined) {
            cc.log('update gold ');
            return;
        }
        if (parseInt(Global.addGold[goldNum]) <= 0) {
            return;
        }
        Global.wxGold += parseInt(Global.addGold[goldNum]);
        console.log('1 :' + Global.addGold[goldNum] + "goldNum :" + goldNum);
        //更新并存储
        if (typeof wx !== 'undefined') {
            let data = ThirdAPI.loadLocalScore();
            var score = parseInt(data.maxscore);
            var gold = parseInt(data.gold);
            ThirdAPI.loadScore((maxscore, gold) => {
                score = parseInt(maxscore);
                gold = parseInt(gold);
                console.log('gridController on ThirdAPI loadScore', score, parseInt(gold), Global.wxGold);
            });
            ThirdAPI.saveScore(score, Global.wxGold);
        }
        this.showGold();
    },

    showGold: function () {
        var goldLabel = this.goldNode.getChildByName('label');
        goldLabel.getComponent(cc.Label).string = Global.wxGold;
    },

    //游戏结束
    gameOver: function () {
        this.node.stopAllActions();
        this.closeListen();
        ThirdAPI.clearGameProgressInfo();
        //取消定时器
        cc.director.getScheduler().unschedule(this.getNextFriend, this);
        //销毁banner广告
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.destroyBannerAd();

        //获取复活次数
        Global.reviveShareTimes = ThirdAPI.loadReviveData();

        //判断当局的次数和当天的复活次数
        if (Global.reviveTimes < Global.reviveTotalTimes && Global.reviveShareTimes > 0) {
            Global.game.showRevive();
            Global.reviveUI.setScore(this.scoreScript.scoreNum);
        } else {
            Global.game.showShareUI();
            Global.shareUI.updateMaxLabel(this.scoreScript.scoreNum);
        }
    },

    //复活消除几行
    clearGridForRevive: function () {
        this.node.stopAllActions();
        //取消定时器
        cc.director.getScheduler().unschedule(this.getNextFriend, this);

        //暂停所有的格子动作
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                var grid = this.allGrids[hIndex][vIndex];
                var gridView = grid.getComponent("gridView");
                if (gridView && gridView.item != null) {
                    gridView.node.stopAllActions();
                    gridView.item.getComponent("itemView").node.stopAllActions();
                }
            }
        }

        //开始销毁行数
        var time = 0;
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.clearVNum; vIndex++) {
                var grid = this.allGrids[hIndex][vIndex];
                var gridView = grid.getComponent("gridView");
                if (gridView && gridView.item != null) {
                    var itemViewScript = gridView.item.getComponent("itemView");
                    var clearTime = itemViewScript.toRevive();
                    if (clearTime > time) {
                        time = clearTime;
                    }
                    gridView.gridNum = 0;
                    gridView.item = null;
                }
            }
        }

        //开始销毁小于64的格子
        /*var time = 0;
        for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
            for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                var grid = this.allGrids[hIndex][vIndex];
                var gridView = grid.getComponent("gridView");
                if (gridView && gridView.item != null && gridView.gridNum < 64) {
                    var itemViewScript = gridView.item.getComponent("itemView");
                    var clearTime = itemViewScript.toRevive();
                    if (clearTime > time) {
                        time = clearTime;
                    }
                    gridView.gridNum = 0;
                    gridView.item = null;
                }
            }
        }*/

        this.clearAllJoin();

        //销毁所有数字
        for (let index = 0; index < Global.flyNumPools.length; index++) {
            const element = Global.flyNumPools[index];
            if (element && element.parent) {
                element.getComponent('flynum').finished();
            }
        }

        //添加触摸侦听
        console.log('clear time:' + time);
        var self = this;
        self.node.runAction(cc.sequence(cc.delayTime(time + 0.1), cc.callFunc(function () {
            //记载复活成功打点
            var biManager = require('biManager');
            biManager.bilog(biManager.reviveSuccess, null);

            if (self.bornGrid) {
                self.bornGrid.stopAllActions();
                if (self.bornGrid.parent) {
                    self.bornGrid.parent.removeChild(self.bornGrid);
                }
            }
            self.bornGrid = null;

            //重置所有数据
            //self.reset();
            //初始化棋盘
            //self.createAllGrid();
            //添加触摸侦听
            self.setTouchControl();
            //开始处理业务逻辑
            self.process();
        })));
    },

    /*
    //时间判断加速
    update: function () {
        var unixTime = (new Date()).getTime();
        if (unixTime > (this.startTime + Global.accessTime) && this.addTimes < Global.addTimes) {
            this.addTimes++;
            this.startTime = (new Date()).getTime();

            Global.gridDownSpeed *= 1.2;
            Global.gridDownSpeed = parseInt(Global.gridDownSpeed * 100) / 100;
            Global.waitToDown *= 0.8;
            Global.waitToDown = parseInt(Global.waitToDown * 100) / 100;
            console.log('加速', Global.gridDownSpeed, Global.waitToDown);
        }
    },*/

    //重置
    reset: function () {
        var wxBannerAd = require('wxBannerAd');
        wxBannerAd.destroyBannerAd();

        this.node.stopAllActions();
        cc.director.getScheduler().unschedule(this.getNextFriend, this);

        this.popDialogTimes = 0;
        //初始时间
        this.startTime = (new Date()).getTime();
        this.usePropTimes = 0;
        this.useSuperTimes = 0;
        this.useDoubleTimes = 0;
        this.useProp = -1;
        this.setPropSprite();
        Global.usePropStatus = -1;
        this.addTimes = 0;
        Global.reviveTimes = 0;
        Global.combineTimes = 0;
        Global.testEnabled = false;
        this.randomScore = 0;
        Global.joinRandomScores = [];
        Global.isPaused = false;
        this.isClickBomming = false;
        this.propClearTime = 0;
        this.clickGridNum = 0;
        this.createItemIndex = 0;
        this.moveItemIndex = 0;
        //销毁所有数字
        for (let index = 0; index < Global.flyNumPools.length; index++) {
            const element = Global.flyNumPools[index];
            if (element && element.parent) {
                element.getComponent('flynum').finished();
            }
        }

        if (this.bornGrid) {
            this.bornGrid.stopAllActions();
            if (this.bornGrid.parent) {
                this.bornGrid.parent.removeChild(this.bornGrid);
            }
        }
        //销毁所有格子
        if (this.allGrids.length > 0) {
            for (let hIndex = 0; hIndex < Global.hNum; hIndex++) {
                for (let vIndex = 0; vIndex < Global.vNum; vIndex++) {
                    var grid = this.allGrids[hIndex][vIndex];
                    var gridView = grid.getComponent("gridView");
                    grid.stopAllActions();
                    if (gridView && gridView.item != null) {
                        gridView.item.getComponent("itemView").toRemove();
                    }

                    //销毁grid
                    if (grid.parent) {
                        grid.parent.removeChild(grid);
                    }
                }
            }
            this.clearAllJoin();
        }
        this.allGrids = [];
        this.scoreScript.reset();
        this.bornGrid = null;
        if (this.soonGridInstance && this.soonGridInstance.parent) {
            this.soonGridInstance.parent.removeChild(this.soonGridInstance);
        }
        //设置概率
        var myUtil = require('myUtil');
        myUtil.randomForWeight(Global.weightConfig.oneWeightRate, Global.weightConfig.oneTotalWeight);
    },
});