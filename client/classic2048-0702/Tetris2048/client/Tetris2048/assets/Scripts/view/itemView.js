/*
    1. 从itemcontroller中产生
    2. 出生点，出生数字
    3. 受鼠标影响
    4. 运动停止，回调

*/
let ThirdAPI = require('../common/ThirdAPI')
cc.Class({
    extends: cc.Component,

    properties: {
        //出生item的精灵贴图
        itemSprite: {
            default: null,
            type: cc.Sprite,
        },
        //出生的数字
        itemNum: {
            default: null,
            type: cc.Prefab,
        },
        //下落声音
        downAudio: {
            url: cc.AudioClip,
            default: null
        },
        num1: {
            default: null,
            type: cc.Sprite,
        },
        num2: {
            default: null,
            type: cc.Sprite,
        },
        num3: {
            default: null,
            type: cc.Sprite,
        },
        num4: {
            default: null,
            type: cc.Sprite,
        },
        num5: {
            default: null,
            type: cc.Sprite,
        },
        numPrefab: {
            default: null,
            type: cc.Prefab,
        },
        goldPrefab: {
            default: null,
            type: cc.Prefab,
        },
        explosionPrefab: {
            default: null,
            type: cc.Prefab,
        },

        isSoonItem: false, //是即将出现的item？
        bornNum: 0, //出生的随机数
        targetGrid: null, //目标格子
        numInstance: null, //飞入分数的实例
        goldInstance: null, //飞入分数的实例
        curState: 0, //  1 等待下落   2 下落  3  下落完毕等待合并   4 合并
        canMove: true,

        useDouble: false, //是否使用双倍道具
        useClear: false, //是否使用锤子道具

        isStone: false, //是否是钻石
        isClearItem: false, //是否是锤子道具
        isSuperItem: false, //是否是万能道具
    },

    initData: function (randomIndex, isSoonItem) {
        this.isSoonItem = isSoonItem;
        this.bornNum = randomIndex;
        this.setSpriteFrame();
    },

    //根据生产的索引值来设置出生的精灵贴图
    setSpriteFrame: function () {
        this.updateColor();
        this.updateNum(-1);
    },

    updateNumForProp: function () {
        this.updateNum(Global.usePropStatus);
    },

    //等待下落
    changeStateToWaitDown: function (speed) {
        cc.log(this.curState);
        if (this.curState == 1) {
            return;
        }
        if (this.curState == 3) {
            this.startDownForBorn(speed);
            return;
        }
        if (this.curState > 3) {
            return;
        }
        if (Global.gridController.getComponent('gridController').bornGrid == this.node) {
            if (this.curState > 0) {
                this.curState = 1; //等待下落
                this.node.stopAllActions();
                this.forjoinaction = null;
                let self = this;
                this.node.runAction(cc.sequence(cc.delayTime(Global.waitToDown), cc.callFunc(function () {
                    self.startDownForBorn(speed);
                })));
            }
        }
    },

    canDown: function () {
        var nodePos = this.node.getPosition();
        var targetPos = this.targetGrid.getPosition();

        var cury = nodePos.y;
        var dist = cc.pDistance(nodePos, targetPos);
        var canDownNum = Math.floor(dist / Global.itemSize);
        var hdx = this.targetGrid.getComponent('gridView').hIndex;
        var vdx = this.targetGrid.getComponent('gridView').vIndex;
        var firstCurH = canDownNum <= 1 ? 0 : canDownNum;
        var gridController = Global.gridController.getComponent("gridController");
        var allGrids = gridController.allGrids;
        for (let curH = vdx - firstCurH; curH <= vdx; curH++) {
            var element1 = allGrids[hdx][curH];
            if (cury > element1.getPosition().y) {
                return true;
            }
        }
        return false;
    },

    //开始进行从出生点到最终位置的动作
    startDownForBorn: function (speed) {
        this.curState = 2; //下落

        //this.node.stopAllActions();
        var nodePos = this.node.getPosition();
        var targetPos = this.targetGrid.getPosition();

        var dist = cc.pDistance(nodePos, targetPos);
        var canDownNum = Math.floor(dist / Global.itemSize);

        var callback = cc.callFunc(this.callBackForJoin, this);

        var hdx = this.targetGrid.getComponent('gridView').hIndex;
        var vdx = this.targetGrid.getComponent('gridView').vIndex;

        var cury = nodePos.y;
        var actions = [];
        var t = 0;
        var firstCurH = canDownNum <= 1 ? 0 : canDownNum;
        var gridController = Global.gridController.getComponent("gridController");
        var allGrids = gridController.allGrids;

        for (let curH = vdx - firstCurH; curH <= vdx; curH++) {
            if (curH == -1) {
                continue;
            }
            if (actions.length > 0) {
                var actiond = cc.delayTime(Global.gridDownDelayTime);
                actions.push(actiond);
                t += Global.gridDownDelayTime;
            }

            var element1 = allGrids[hdx][curH];
            var playTime = Math.abs(cury - element1.getPosition().y) / speed;
            if (playTime == 0) {
                continue;
            }

            cury += element1.getPosition().y - cury;
            t += playTime;
            var action = cc.moveTo(playTime, element1.getPosition());
            actions.push(action);
        }

        actions.push(callback);

        //异常处理，当前节点和目标节点相等
        cc.log(this.curState);
        if (actions.length <= 1) {
            console.log('处理异常');
            if (this.forjoinaction == null) {
                this.curState = 4;
                this.node.runAction(callback);
            }
            return 0;
        } else {
            console.log('actions.length = 0');
            if (this.forjoinaction != null) {
                console.log('this.forjoinaction != null' + actions.length);
                this.node.stopAction(this.forjoinaction);
                this.forjoinaction = null;
            }
        }

        //var action = cc.moveTo(playTime, targetPos);
        var myAction = cc.sequence(actions);
        this.node.runAction(myAction);
        return t;
    },

    //快速下落动作
    startQuickDownForBorn: function (speed) {
        this.curState = 5;
        this.node.stopAllActions();
        var nodePos = this.node.getPosition();
        var targetPos = this.targetGrid.getPosition();
        var playTime = cc.pDistance(nodePos, targetPos) / speed;
        var action = cc.moveTo(playTime, targetPos);
        var callback = cc.callFunc(this.callBackForJoin, this);

        var myAction = cc.sequence(action, callback);
        this.node.runAction(myAction);
        return playTime;
    },
    /*
        //格子合并
        toJoin(pos) {
            var finished = cc.callFunc(this.toRemove, this);
            var playTime = cc.pDistance(this.node.getPosition(), pos) / Global.combineTime;
            //合并动作
            var action = cc.moveTo(playTime, pos);
            var action1 = cc.delayTime(0.1);

            //var seq = cc.sequence(action1,action);
            var myAction = cc.sequence(action1, action, finished);
            this.node.runAction(myAction);

            return playTime + 0.1;
        },*/

    toRemove: function () {
        this.node.stopAllActions();
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        this.node.targetOff(this);
        this.curState = 0;
    },

    //复活消除多余格子
    toRevive: function () {
        this.node.stopAllActions();
        var finished = cc.callFunc(this.toRemove, this);
        var action = cc.blink(1, 2);
        var myAction = cc.sequence(action, finished);
        this.node.runAction(myAction);
        return action.getDuration() + 0.01;
    },

    //消除动画
    clearItemToRemove: function () {
        this.node.stopAllActions();
        //动作完成则删除节点
        var callback = cc.callFunc(this.toRemove, this);
        //缩放动作
        var spawnAction = cc.spawn(cc.rotateBy(0.5, 360, 360), cc.sequence(cc.scaleTo(0.5, 0.5), cc.scaleTo(0.5, 0)));

        this.node.runAction(cc.sequence(spawnAction, callback));
        return 500;
    },

    //道具清除
    propClear: function () {
        this.node.stopAllActions();
        var finished = cc.callFunc(this.toRemove, this);
        var scaleAction1 = cc.scaleTo(1, 2);
        var scaleAction2 = cc.scaleTo(1, 1);
        var spawnAction = cc.sequence(cc.scaleTo(0.5, 0.9), cc.scaleTo(0.5, 0.8), cc.scaleTo(0.5, 1));
        this.node.runAction(cc.sequence(spawnAction, finished));
    },

    //更新分数图集
    updateNum: function (usePropStatus) {
        this.num5.setVisible(false);
        var LoadAtlas = require("LoadAtlas");

        if (usePropStatus != -1) {
            console.log('使用道具更新显示分数图集');
            var LoadAtlas = require("LoadAtlas");
            this.num1.setVisible(false);
            this.num2.setVisible(false);
            this.num3.setVisible(false);
            this.num4.setVisible(false);
            this.num5.setVisible(true);

            this.num5.node.scaleX = this.isSoonItem ? 0.5 : 0.7;
            this.num5.node.scaleY = this.isSoonItem ? 0.5 : 0.7;
            if (usePropStatus == 0) {
                this.num5.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'clear_spr');
                return;
            } else if (usePropStatus == 1) {
                this.num5.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'super_spr');
                return;
            } else if (usePropStatus == 2) {
                this.num5.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'double_spr');
                return;
            }
        }

        //钻石道具
        if (this.isStone) {
            this.num1.setVisible(false);
            this.num2.setVisible(false);
            this.num3.setVisible(false);
            this.num4.setVisible(false);
            this.num5.setVisible(true);
            this.num5.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'zuan');
            return;
        }


        if (Global.skinIndex == 0) {
            var tho = parseInt(this.bornNum / 1000);
            var hun = parseInt((this.bornNum / 100) % 10);
            var ten = parseInt((this.bornNum % 100) / 10);
            var uni = parseInt(this.bornNum % 10);
            //千位
            if (tho > 0) {
                this.getSpriteNum(this.num1, tho);
            }
            //百位
            if (hun > 0 || tho > 0) {
                this.getSpriteNum(this.num2, hun);
            }
            //十位
            if (ten > 0 || tho > 0 || hun > 0) {
                this.getSpriteNum(this.num3, ten);
            }
            //个位
            if (uni > 0 || tho > 0 || hun > 0 || ten > 0) {
                this.getSpriteNum(this.num4, uni);
            }

            //是否可见
            if (tho == 0) {
                this.num1.setVisible(false);
            }
            if (tho == 0 && hun == 0) {
                this.num2.setVisible(false);
            }
            if (tho == 0 && hun == 0 && ten == 0) {
                this.num3.setVisible(false);
            }

            //个位
            if (this.bornNum > 0 && this.bornNum < 9) {
                this.num4.node.x = 0;
            } else if (this.bornNum >= 10 && this.bornNum < 99) {
                var allWidth = this.num3.node.width + this.num4.node.width;
                this.num3.node.x = -allWidth / 2 + this.num3.node.width / 2;
                this.num4.node.x = this.num3.node.x + this.num3.node.width / 2 + this.num4.node.width / 2;
            } else if (this.bornNum >= 100 && this.bornNum < 999) {
                //百十个位 
                var allWidth = this.num2.node.width + this.num3.node.width + this.num4.node.width;
                this.num2.node.x = -allWidth / 2 + this.num2.node.width / 2;
                this.num3.node.x = this.num2.node.x + this.num2.node.width / 2 + this.num3.node.width / 2;
                this.num4.node.x = this.num3.node.x + this.num3.node.width / 2 + this.num4.node.width / 2;

            } else if (this.bornNum >= 1000 && this.bornNum < 9999) {
                var allWidth = this.num1.node.width + this.num2.node.width + this.num3.node.width + this.num4.node.width;
                this.num1.node.x = -allWidth / 2 + this.num1.node.width / 2 + 6;
                this.num2.node.x = this.num1.node.x + this.num1.node.width / 2 + this.num2.node.width / 2 - 3;
                this.num3.node.x = this.num2.node.x + this.num2.node.width / 2 + this.num3.node.width / 2 - 3;
                this.num4.node.x = this.num3.node.x + this.num3.node.width / 2 + this.num4.node.width / 2 - 3;
            }
        } else {
            console.log('皮肤', Global.skinIndex, this.bornNum, 'skin' + (Global.skinIndex + 1) + '_' + this.bornNum);
            var LoadAtlas = require("LoadAtlas");
            this.num4.spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/skins', 'skin' + (Global.skinIndex + 1) + '_' + this.bornNum);
            this.num4.node.width = this.num4.spriteFrame.getRect().width;
            this.num4.node.height = this.num4.spriteFrame.getRect().height;
            this.num4.node.scaleX = this.isSoonItem ? 0.8 : 1.1;
            this.num4.node.scaleY = this.isSoonItem ? 0.8 : 1.1;
        }
    },

    getSpriteNum: function (spr, num) {
        var string = "skin1_" + num;
        var LoadAtlas = require("LoadAtlas");
        var spriteFrame = LoadAtlas.getSpriteFrameFromName('textures/gridItem/skins', 'skin' + (Global.skinIndex + 1) + '_' + num);
        spr.spriteFrame = spriteFrame;
        spr.node.width = spriteFrame.getRect().width; // Global.gridNumSize;
        spr.node.height = spriteFrame.getRect().height; // Global.gridNumSize;
        spr.node.scaleX = (this.bornNum > 999 || this.isSoonItem) ? 0.8 : 1;
        spr.node.scaleY = (this.bornNum > 999 || this.isSoonItem) ? 0.8 : 1;
        spr.setVisible(true);
    },

    //更新color
    updateColor: function () {
        var self = this;
        var LoadAtlas = require("LoadAtlas");
        LoadAtlas.loadAtlasRes("textures/gridItem/items", function () {
            var LoadAtlas = require("LoadAtlas");
            self.itemSprite.spriteFrame = LoadAtlas.getSpriteFrameFromName("textures/gridItem/items", "color1_" + self.bornNum);
            var soonItemSize = Global.soonItemSize;
            if (self.bornNum > 99) {
                soonItemSize = 90;
            } else if (self.bornNum > 999) {
                soonItemSize = Global.itemSize;
            }
            self.itemSprite.node.width = self.isSoonItem ? soonItemSize : Global.itemSize;
            self.itemSprite.node.height = self.isSoonItem ? soonItemSize : Global.itemSize;
        });
    },

    //回调grid控制器的合并逻辑
    callBackForJoin: function () {
        if (this.curState < 3) {
            this.curState = 3
        }
        let self = this;
        let dtime = Global.forJoin;
        if (!this.canMove) {
            dtime = dtime / 3;
        }
        this.forjoinaction = cc.sequence(cc.delayTime(dtime), cc.callFunc(function () {
            self.forJoin();
        }));
        this.node.runAction(this.forjoinaction);
    },

    //格子合并
    toJoin(pos) {
        this.curState = 4;
        var finished = cc.callFunc(this.toRemove, this);
        var playTime = cc.pDistance(this.node.getPosition(), pos) / Global.combineTime;
        //合并动作
        var action = cc.moveTo(playTime, pos);
        var action1 = cc.delayTime(0.1);

        //var seq = cc.sequence(action1,action);
        var myAction = cc.sequence(action1, action, finished);
        this.node.runAction(myAction);
    },

    forJoin: function () {
        console.log('forJoin');
        //是否可以继续下降
        if (this.canDown()) {
            this.startDownForBorn(Global.gridDownSpeed);
            return;
        }
        //删除格子
        this.node.stopAllActions();
        var gridControllerScript = Global.gridController.getComponent("gridController");
        let idx = gridControllerScript.downGrids.indexOf(this.getComponent('itemView'));
        if (idx >= 0) {
            gridControllerScript.downGrids.splice(idx, 1);
        }

        var targetScript = this.targetGrid.getComponent('gridView');
        if (Global.usePropStatus == 1) {
            console.log('使用万能道具');
            //查找下方是否有格子
            var gridControllerScript = Global.gridController.getComponent("gridController");
            var checkGrid = gridControllerScript.allGrids[targetScript.hIndex][targetScript.vIndex + 1];
            if (checkGrid) {
                var buttonItem = checkGrid.getComponent("gridView").item;
                if (buttonItem) {
                    var buttonItemViewScript = buttonItem.getComponent("itemView");
                    if (!buttonItemViewScript.useClear) {
                        console.log('下方有格子，并且不是锤子道具', buttonItemViewScript.bornNum);

                        this.initData(buttonItemViewScript.bornNum, false);
                        Global.usePropStatus = -1;
                    } else {
                        console.log('下方有格子，但是下面的是锤子道具');
                    }
                }
            }
        } else if (Global.usePropStatus == 0) {
            console.log('使用锤子道具');
            //查找下方是否有格子
            var gridControllerScript = Global.gridController.getComponent("gridController");
            var checkGrid = gridControllerScript.allGrids[targetScript.hIndex][targetScript.vIndex + 1];
            if (checkGrid) {
                var buttonItem = checkGrid.getComponent("gridView").item;
                if (buttonItem) {
                    var buttonItemViewScript = buttonItem.getComponent("itemView");
                    console.log('下方有格子', buttonItemViewScript.bornNum);
                    var deleteGridScript = checkGrid.getComponent("gridView");
                    //销毁的item
                    var deleteItem = deleteGridScript.item;

                    ThirdAPI.shakeShort({});
                    //var explosionPrefab = cc.instantiate(this.explosionPrefab);
                    //deleteItem.node.addChild(explosionPrefab);

                    deleteItem.toRevive();

                    console.log('删除item：' + deleteGridScript.gridNum, deleteGridScript.hIndex, deleteGridScript.vIndex);
                    deleteGridScript.item = null;
                    deleteGridScript.resetData();

                    gridControllerScript.bornGrid = null;
                    this.toRevive();

                    this.playDownAudio();
                    this.canMove = false;
                    this.curState = 0;
                    return;
                }
            }
        }

        targetScript.item = this;
        this.node.setPosition(cc.p(targetScript.node.getPosition()));
        cc.log('下落停止 item callBackForJoin ：' + targetScript.hIndex + " :: " + targetScript.vIndex + "node pos X" + this.node.x + "  node pos Y" + this.node.y);
        targetScript.gridNum = this.bornNum;


        //添加事件侦听
        var gridControllerScript = Global.gridController.getComponent("gridController");
        this.node.on("itemclick", gridControllerScript.itemClick, gridControllerScript);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);

        // }, Global.gridDownDelayTime * 1000);

        this.playDownAudio();
        this.canMove = false;
        this.curState = 0;


        console.log('****************', targetScript.canDrop);
        //再生产道具
        if (Global.candropProp) {
            var targetGridView = this.targetGrid.getComponent('gridView');
            targetGridView.dropStone(targetScript.hIndex, targetScript.vIndex - 1);
        }
    },

    touchStart: function () {
        cc.log('itemclick');
        var evtObj = new cc.Event.EventCustom('itemclick', true);
        evtObj.setUserData(this.targetGrid);
        this.node.dispatchEvent(evtObj);
    },

    //创建道具实例
    createProp: function () {



    },


    //播放落地声音
    playDownAudio: function () {
        cc.log('play down audio');
        if (Global.isSoundPlaying && this.downAudio != null) {
            this.combineID = cc.audioEngine.play(this.downAudio, false, 1);
            //回调
            var self = this;
            if (self.combineID > 0) {
                cc.audioEngine.setFinishCallback(self.combineID, function () {
                    self.playAudioEnd();
                });
            }
        }
    },
    //播放声音
    playAudioStart: function () {
        if (this.combineID != 0) {
            cc.audioEngine.resume(this.combineID);
        }
    },
    //暂停声音声音
    playAudioEnd: function () {
        cc.audioEngine.uncache(this.combineID);
    },



    // update (dt) {},
});