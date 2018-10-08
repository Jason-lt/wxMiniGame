/*
    合并触发判断，递归
*/
cc.Class({
    extends: cc.Component,

    properties: {
        combineAudio: {
            url: cc.AudioClip,
            default: null
        },

        numPrefab: {
            default: null,
            type: cc.Prefab,
        },
        goldPrefab: {
            default: null,
            type: cc.Prefab,
        },

        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },


        combineID: 0,
        allGrids: null, //所有的格子信息
        hIndex: 0,
        vIndex: 0,
        item: null,

        //格子上的分数
        gridNum: 0, //2  4 8  16

        //目标格子
        targetGrid: {
            default: null,
            type: cc.Node
        },

        isDown: false, //是否是下落的格子

        moveIndex: 0, //下方的格子被消灭后，移动的距离
        sameScoreNum: 0, //合并时记录相同的分数格子数量

        deleteGrids: [], //存储即将合并的格子
        isJoin: false,
        actionJoin: false,
        joinItems: [],

        canDrop: false,
        isMarkGrid: false, //是带有标识的格子
    },

    //设置索引index
    setIndex: function (hIndex, vIndex, gridController) {
        this.hIndex = hIndex;
        this.vIndex = vIndex;
    },

    //开始遍历
    startBianli: function () {
        var self = this;
        this.joinItems = [];

        var gridControllerScript = Global.gridController.getComponent("gridController");
        this.allGrids = gridControllerScript.allGrids;
        //将要合并的数组
        this.deleteGrids = [];

        this.bianliForGrid();
        //开始执行合并动作
        this.startJoin();
        //改变分数
        this.isDown = false;

        return (this.joinItems.length > 0);
    },

    //改变分数
    changeScore: function () {
        let self = this;
        var gridControllerScript = Global.gridController.getComponent("gridController");
        self.isDown = false;
        //改变分数
        if (self.deleteGrids.length > 0) {
            if (self.deleteGrids.length == 1) {
                self.gridNum *= 2;
            } else if (self.deleteGrids.length == 2) {
                self.gridNum *= 4;
            } else if (self.deleteGrids.length == 3) {
                self.gridNum *= 8;
            }

            //判断是否是有角标的道具
            /* var canShowDialog = false;
             for (let index = 0; index < self.deleteGrids.length; index++) {
                 var deleteGrid = self.deleteGrids[index];
                 var deleteGridScript = deleteGrid.getComponent("gridView");
                 //销毁的item
                 var deleteItem = deleteGridScript.item;
                 if (deleteItem && deleteItem.hasMark) {
                     canShowDialog = true;
                 }
             }*/


            //弹出宝箱分享弹框
            /*if (self.deleteGrids.length >= 2) {
                var random = Math.random();
                console.log('随机宝箱的概率：' + random);
                if (!Global.propInfoUI && random <= Global.randomChestWeight) {
                    setTimeout(() => {
                        Global.game.showPropDialog(true);
                    }, 300);
                }
            }*/

            //combine加分
            console.log('连击之前的分数：' + self.gridNum);
            var extraNum = 0;
            if (Global.combineTimes > 0) {
                if (Global.combineTimes > 4) {
                    Global.combineTimes = 4;
                }
                /*
                if (Global.combineTimes > 1) {
                    //合并数大于2
                    console.log('删除的格子数量：' + self.deleteGrids.length);
                    if (self.deleteGrids.length > 1) {
                        Global.combineTimes = self.deleteGrids.length + 1;
                    }
                }*/
                extraNum = (Global.combineTimes - 1) * self.gridNum;
                console.log('连击加的分数：' + extraNum);
            }
            console.log('连击之后的分数：' + (self.gridNum + extraNum));

            var doubleNum = 0;
            if (Global.usePropStatus == 2) {
                console.log('使用了双倍道具,加分之前的分数：', self.gridNum + extraNum);
                doubleNum = self.gridNum * (2 - 1);
                console.log('双倍道具使用之后的分数:' + self.gridNum + extraNum + doubleNum);
                Global.usePropStatus = -1;
            }

            if (self.gridNum > 4096) {
                self.gridNum = 4096;
            }

            //弹出道具分享
            /*if (Global.cdnGameConfig.totalSwith) {
                var currTime = (new Date()).getTime();
                if (Global.wxScore < Global.cdnGameConfig.newUserScore) {
                    if ((currTime - gridControllerScript.popDialogTimes) > Global.cdnGameConfig.newUserPropCd) {
                        if (Global.cdnGameConfig.newUserEquals && Global.cdnGameConfig.newUserEquals.indexOf(self.gridNum) > -1) {
                            //Global.game.showPropDialog(true);
                            gridControllerScript.popDialogTimes = currTime;
                        }
                    }
                } else {
                    var random = Math.random();
                    if (gridControllerScript.popDialogTimes < Global.cdnGameConfig.popPropTotalTimes || random <= Global.cdnGameConfig.weightRate) {
                        if (self.gridNum == 1024) {
                            //Global.game.showPropDialog(true);
                            gridControllerScript.popDialogTimes++;
                            itemViewScript.hasMark = true;
                        }
                    }
                }
            }*/


            console.log('deleteGrids:' + self.deleteGrids.length);

            console.log('addScore', self.gridNum);
            gridControllerScript.scoreScript.addScore(self.gridNum + extraNum + doubleNum);
            console.log('addScore end,self.item:', self.item);
            if (self.item) {
                var itemViewScript = self.item.getComponent('itemView');
                itemViewScript.bornNum = self.gridNum;
                //缩放动画
                var random = Math.random();
                console.log('设置item格子的标志概率：', random, gridControllerScript.popDialogTimes, Global.cdnGameConfig.popPropTotalTimes, self.gridNum);
                if (gridControllerScript.popDialogTimes < Global.cdnGameConfig.popPropTotalTimes || random <= Global.cdnGameConfig.weightRate) {
                    console.log('查找mark标识', Global.cdnGameConfig.markScoreEquals, self.gridNum);
                    if (Global.cdnGameConfig.markScoreEquals.indexOf(self.gridNum) > -1) {
                        //Global.game.showPropDialog(true);
                        gridControllerScript.popDialogTimes++;
                        itemViewScript.hasMark = true;
                        console.log('设置item格子的标志：', self.gridNum);
                    }
                }

                console.log('updateNum');
                itemViewScript.updateNum(-1);
                console.log('updateColor');
                itemViewScript.updateColor();
                console.log('playFlyNum');
                //飞入动画
                self.playFlyNum();
                console.log('playFlyGold');
                //飞入金币
                self.playFlyGold();
                console.log('updateGold');
                //gridControllerScript.updateGold(self.gridNum);

                //判断是否是有角标的道具
                //var canShowDialog = false;
                /* for (let index = 0; index < self.deleteGrids.length; index++) {
                     var deleteGrid = self.deleteGrids[index];
                     var deleteGridScript = deleteGrid.getComponent("gridView");
                     //销毁的item
                     var deleteItem = deleteGridScript.item;
                     if (deleteItem && deleteItem.hasMark) {
                         console.log('弹出宝箱');
                         Global.game.showPropDialog(true);
                     }
                 }*/

                // console.log('设置item格子的合成宝箱：', self.isMarkGrid, self.gridNum);
                // if (self.isMarkGrid && Global.cdnGameConfig.scoreEquals.indexOf(self.gridNum) > -1) {
                //     Global.game.showPropDialog(true);
                //     // //创建广告
                //     // var wxBannerAd = require('wxBannerAd');
                //     // wxBannerAd.createBannerAd();
                // }
            }
        }
    },

    //开始播放飞入动画
    playFlyNum: function () {
        //合成一个512或者2048就播放数字向上飘的动画
        var flyIndex = Global.canFlyNums.indexOf(parseInt(this.gridNum));
        if (flyIndex <= -1) {
            return;
        }
        // if (this.numInstance == null) {
        this.numInstance = cc.instantiate(this.numPrefab);
        // }
        // if (this.numInstance.parent) {
        //     this.numInstance.parent.removeChild(this.numInstance);
        // }
        this.numInstance.getComponent('flyNum').setNum(this.gridNum, Global.combineTimes);
        this.numInstance.setPosition(cc.p(this.node.getPosition().x, this.node.getPosition().y));
        this.node.parent.addChild(this.numInstance);
        this.numInstance.getComponent('flyNum').toPosition(-300);
    },

    //开始播放飞入动画
    playFlyNumToItem: function (num) {
        var numInstance = cc.instantiate(this.numPrefab);

        numInstance.getComponent('flyNum').setNum(num, Global.cdnGameConfig.bombDoubleRate);
        numInstance.setPosition(cc.p(this.node.getPosition().x, this.node.getPosition().y));
        this.node.parent.addChild(numInstance);
        var gridControllerScript = Global.gridController.getComponent("gridController");
        numInstance.getComponent('flyNum').toItemPosition(gridControllerScript.score.getPosition());
    },

    //播放钻石动画
    playFlyGold: function () {
        //合成一个512或者2048就播放数字向上飘的动画
        var flyIndex = Global.canFlyGolds.indexOf(parseInt(this.gridNum));
        if (flyIndex <= -1) {
            return;
        }
        this.goldInstance = cc.instantiate(this.goldPrefab);
        this.goldInstance.setPosition(cc.p(this.node.getPosition().x, this.node.getPosition().y));
        this.node.parent.addChild(this.goldInstance);
        //金币飞入到gridControllder的金币位置
        var gridControllerScript = Global.gridController.getComponent("gridController");
        this.goldInstance.getComponent('flyGold').toPosition(gridControllerScript.goldNode.getPosition(), this.gridNum);
    },

    //从当前的格子开始遍历
    bianliForGrid: function () {
        var gridViewScript = this.node.getComponent("gridView");
        //将要遍历格子的横向索引
        var bianliHIndex = gridViewScript.hIndex;
        //将要遍历格子的纵向索引
        var bianliVIndex = gridViewScript.vIndex;

        //遍历左边
        this.hasSameScore(bianliHIndex - 1, bianliVIndex);
        //遍历右边
        this.hasSameScore(bianliHIndex + 1, bianliVIndex);
        //遍历上边
        this.hasSameScore(bianliHIndex, bianliVIndex - 1);
        //遍历下边
        this.hasSameScore(bianliHIndex, bianliVIndex + 1);
    },

    //判断是否有相同分数的格子,如果有就进行合并
    hasSameScore: function (hIndex, vIndex) {
        //判断是否是边界
        if (hIndex < 0 || hIndex >= Global.hNum || vIndex < 0 || vIndex >= Global.vNum) {
            return;
        }

        if (hIndex == this.hIndex && vIndex == this.vIndex) {
            return;
        }

        var compareGrid = this.allGrids[hIndex][vIndex];
        if (this.deleteGrids.indexOf(compareGrid) > -1) {
            return;
        }
        var compareGridScript = compareGrid.getComponent("gridView");

        //判断是否有item
        if (compareGrid && compareGridScript.item == null) {
            return;
        }

        //判断是否是锤子道具
        var compareItem = compareGridScript.item;
        if (compareItem.getComponent("itemView").useClear) {
            console.log('匹配项是锤子道具111');
            return;
        }

        //达到最大分数
        if (compareGridScript.gridNum > Global.gridMaxScore) {
            return;
        }
        if (compareGridScript.isJoin) {
            return;
        }
        var gridScript = this.node.getComponent("gridView");
        if (gridScript.item && gridScript.item.getComponent("itemView").useClear) {
            console.log('当前项是锤子道具222');
            return;
        }
        //钻石道具
        var isDropProp = false;
        // if (compareItem.getComponent("itemView").isStone) {
        //     isDropProp = true;
        // }
        if (compareGridScript.gridNum == gridScript.gridNum || isDropProp) {
            this.deleteGrids.push(compareGrid);
            compareGridScript.isDown = false;
            this.bianliForGrid(compareGrid);
            compareGridScript.isJoin = true;
        }
    },

    //开始合并动作    
    startJoin: function () {
        var self = this;
        self.isMarkGrid = false;
        if (self.deleteGrids.length <= 0) {
            return 0;
        }

        this.joinItems = [];
        for (let index = 0; index < self.deleteGrids.length; index++) {
            var deleteGrid = self.deleteGrids[index];
            var deleteGridScript = deleteGrid.getComponent("gridView");
            //销毁的item
            var deleteItem = deleteGridScript.item;
            this.joinItems.push(deleteGridScript.item);

            //判断被销毁对格子是否是加倍道具
            if (deleteItem.useDouble) {
                console.log('加倍道具1' + deleteGridScript.gridNum);
                deleteItem.useDouble = false;
                Global.usePropStatus = 2;
            }
            //判断自己格子是否是加倍道具
            /*if (this.item.useDouble) {
                console.log('加倍道具2' + this.gridNum);
                this.item.useDouble = false;
                Global.usePropStatus = 2;
            }*/

            //判断是否是钻石道具
            if (deleteItem.isStone) {
                this.goldInstance = cc.instantiate(this.goldPrefab);
                this.goldInstance.setPosition(cc.p(this.node.getPosition().x, this.node.getPosition().y));
                this.node.parent.addChild(this.goldInstance);
                //金币飞入到gridControllder的金币位置
                var gridControllerScript = Global.gridController.getComponent("gridController");
                this.goldInstance.getComponent('flyGold').toPosition(gridControllerScript.goldNode.getPosition(), this.gridNum);

                console.log('删除项是钻石道具');
            }

            if (deleteItem.hasMark) {
                console.log('有标志');
                self.isMarkGrid = true;
            }
            deleteItem.hasMark = false;

            deleteItem.toJoin(this.node.getPosition());

            console.log('删除item：' + deleteGridScript.gridNum, deleteGridScript.hIndex, deleteGridScript.vIndex);
            deleteGridScript.item = null;
            deleteGridScript.resetData();
        }
        //播放合并的声音
        this.actionJoin = true;
        this.check();    
    },

    check: function () {
        console.log('gridView check');
        let self = this;
        this.node.runAction(cc.sequence(cc.delayTime(0.01), cc.callFunc(function () {
            self.checkJoinComplete();
        })));
    },

    checkJoinComplete: function () {
        let isComplete = true;
        for (let index = 0; index < this.joinItems.length; index++) {
            var deleteItem = this.joinItems[index];
            if (deleteItem.curState > 0) {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            if (this.joinItems.length > 0) {
                Global.candropProp = true;
            }
            console.log('合并结束，加分数');
            this.changeScore();
            this.actionJoin = false;
            this.playCombineAudio();
        } else {
            console.log('检查合并结束，重新check');
            this.check();
        }
    },

    playCombineAudio: function () {
        cc.log('play audio');
        if (Global.isSoundPlaying && this.combineAudio != null) {
            this.combineID = cc.audioEngine.play(this.combineAudio, false, 1);
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

    //重置数据
    resetData: function () {
        this.gridNum = 0;
    },

    //概率掉落道具(钻石)
    dropStone: function (hIndex, vIndex) {
        /*   //先判断上方是否有格子存在
           if (vIndex >= Global.vNum) {
               return;
           }
           var upGrid = this.allGrids[hIndex][vIndex];
           if (!upGrid) return;
           var upGridScript = upGrid.getComponent("gridView");

           //判断是否有item
           if (upGridScript.item !== null) {
               return;
           }
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

           var gridControllerScript = Global.gridController.getComponent("gridController");

           itemScript.targetGrid = this.allGrids[hIndex][vIndex];
           Global.candropProp = false;

           console.log('drop---------:', this.hIndex, this.vIndex,this.allGrids);*/


        //itemScript.targetGrid = upGrid;

        //itemScript.startDownForBorn(Global.gridDownSpeed);
    },



});