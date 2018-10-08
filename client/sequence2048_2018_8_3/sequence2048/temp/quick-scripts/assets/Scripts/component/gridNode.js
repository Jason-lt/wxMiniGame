(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/component/gridNode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '23c93Aqrj5MWbS6ierlfS28', 'gridNode', __filename);
// Scripts/component/gridNode.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gridPrefab: cc.Prefab,
        itemPrefab: cc.Prefab

    },

    onLoad: function onLoad() {
        this.allGrids = [];
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_TOUCH_BEGAN, this._onTouchBegan, this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_TOUCH_MOVE, this._onTouchMove, this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_TOUCH_END, this._onTouchEnd, this);
        wxGame.NotificationCenter.listen(wxGame.EventType.MERGE_ITEM_SCORE, this.mergeItem, this);

        wxGame.NotificationCenter.listen(wxGame.EventType.CHECK_OVER, this.checkOver, this);

        wxGame.NotificationCenter.listen(wxGame.EventType.GAME_OVER_RESET, this.resetData, this);

        wxGame.NotificationCenter.listen(wxGame.EventType.REMOVE_GAME_ANI, this.removeGameAni, this);

        wxGame.NotificationCenter.listen(wxGame.EventType.SELECT_POWERFUL, this.selectPowerful, this);
        wxGame.NotificationCenter.listen(wxGame.EventType.SELECT_BOMBCARD, this.selectBombCard, this);

        wxGame.NotificationCenter.listen(wxGame.EventType.RECOVER_LAST_OPERATION, this.recoverLastOperation, this);

        wxGame.NotificationCenter.listen(wxGame.EventType.RESURGENCE_SUCCESS, this.resurgenceSuccess, this);
        this.lastItemScores = [];

        // 
    },

    //保存各个格子的分数
    saveLastData: function saveLastData() {
        if (this.allGrids.length <= 0) {
            return;
        }
        this.lastItemScores = [];
        for (var i = 0; i < this.allGrids.length; i++) {
            if (this.allGrids[i].item) {
                var data = {};
                data.propType = this.allGrids[i].item.getProp() || 0;
                data.score = this.allGrids[i].item.getScore() || 0;
                this.lastItemScores[i] = data;
            } else {
                var data = {};
                this.lastItemScores[i] = data;
            }
        }
    },

    //恢复上次操作
    recoverLastOperation: function recoverLastOperation() {
        if (this.lastItemScores.length <= 0) {
            // wxGame.GlobalFuncs.showToast("道具使用失败~");
            return;
        }
        this.node.setLocalZOrder(1);
        var index = 0;
        for (var i = 0; i < this.lastItemScores.length; i++) {
            if (!wxGame.GlobalFuncs.isEmptyObject(this.lastItemScores[i])) {
                index++;
            }
            if (this.allGrids[i].item) {
                this.allGrids[i].item.setItemZOrder(2);
                if (wxGame.GlobalFuncs.isEmptyObject(this.lastItemScores[i])) {
                    this.allGrids[i].item.onMergeRemoveItem(this.allGrids[i]);
                    this.allGrids[i].item = null;
                    if (i == 0) {
                        this.allGrids[i].hideColtSprite(true);
                    }
                } else {
                    this.allGrids[i].item.setScore(this.lastItemScores[i].score);
                    this.allGrids[i].item.setPropType(this.lastItemScores[i].propType);
                }
            } else {
                if (!wxGame.GlobalFuncs.isEmptyObject(this.lastItemScores[i])) {
                    var data = {};
                    data.grid = this.allGrids[i];
                    data.score = this.lastItemScores[i].score;
                    data.propType = this.lastItemScores[i].propType;
                    wxGame.NotificationCenter.trigger(wxGame.EventType.CREATE_ITEM, data);
                }
            }
        }
        // var index = this.lastItemScores.length;
        if (index > 0) {
            for (var i = index; i < this.allGrids.length; i++) {
                if (this.allGrids[i].item) {
                    this.allGrids[i].item.onMergeRemoveItem(this.allGrids[i]);
                    if (i == 0) {
                        this.allGrids[i].hideColtSprite(true);
                    }
                    this.allGrids[i].item = null;
                }
            }
        }
    },

    _onTouchBegan: function _onTouchBegan(item) {
        this.getNoneCardGrid();
        this.selectGrid = null;
        this.selectLastGrid = null;
        this.operItem = null;

        this.lastSelectGrid = null;
    },

    _onTouchMove: function _onTouchMove(data) {
        var pos = data.pos;
        var callFunc = data.callFunc;
        var _item = data.item;
        this.selectGrid = null;
        this.selectLastGrid = null;
        this.operItem = null;
        this.getNoneCardGrid();
        _item.setIsGridSelect(false);

        if (this.btmGrid) {
            var grid_pos = this.node.convertToNodeSpace(this.btmGrid.getRootNode().convertToWorldSpace(cc.p(0, 0)));
            pos = this.node.convertToNodeSpace(pos);
            var winSize = cc.director.getWinSize();
            var cardRect = cc.rect(grid_pos.x - winSize.width / 2, grid_pos.y - wxGame.Global.isXInter, this.btmGrid.node.width, this.btmGrid.node.height);
            if (cc.rectContainsPoint(cardRect, pos) && !this.isMergeIng) {
                //位置
                // wxGame.LOGW("file = [bottom] fun = [touchCardsMoved] 已到最上面四个空格子了 i = " + i);
                _item.setIsGridSelect(true);
                if (this.btmGrid == this.allGrids[0]) {
                    this.node.setLocalZOrder(1);
                } else {
                    this.node.setLocalZOrder(1000);
                }
                if (this.btmGridIndex == 0) {
                    this.btmGrid.ShowKunag(true);
                } else if (this.btmGridIndex > 0 && this.allGrids[this.btmGridIndex - 1]) {
                    this.allGrids[this.btmGridIndex - 1].item.ShowKunag(true);
                }

                if (this.lastSelectGrid != this.btmGrid) {
                    //记录上次选中格子,防止在同一个格子中移动重复振动
                    wxGame.GlobalFuncs.vibrateShort();

                    //播放选中音效
                    wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.select, 1.2);

                    this.lastSelectGrid = this.btmGrid;
                }

                this.selectGrid = this.btmGrid;
            } else {
                this.node.setLocalZOrder(1);
                this.lastSelectGrid = null;
            }
        } else if (this.allGrids[this.allGrids.length - 1].item) {
            var lastGrid = this.allGrids[this.allGrids.length - 1];

            var grid_pos = this.node.convertToNodeSpace(lastGrid.getRootNode().convertToWorldSpace(cc.p(0, 0)));
            pos = this.node.convertToNodeSpace(pos);
            var winSize = cc.director.getWinSize();
            var cardRect = cc.rect(grid_pos.x - winSize.width / 2, grid_pos.y - wxGame.Global.isXInter, lastGrid.node.width, lastGrid.node.height);
            if (cc.rectContainsPoint(cardRect, pos) && !this.isMergeIng) {
                //位置
                this.node.setLocalZOrder(1000);
                lastGrid.item.ShowKunag(true);
                // lastGrid.ShowLastKuang(true);
                if (this.lastSelectGrid != lastGrid) {
                    //记录上次选中格子,防止在同一个格子中移动重复振动
                    wxGame.GlobalFuncs.vibrateShort();
                    //播放选中音效
                    wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.select, 1.2);
                    this.lastSelectGrid = lastGrid;
                }
                if (lastGrid.item.getScore() == _item.getScore() || _item.getProp() == wxGame.Global.gameInfo.powerfulCard || _item.getProp() == wxGame.Global.gameInfo.bombCard) {
                    if (wxGame.GameConfig.itemScoreConfig.indexOf(lastGrid.item.getScore()) >= 0) {
                        this.selectLastGrid = lastGrid;
                        this.operItem = _item;
                    }
                }
                _item.setIsGridSelect(true);
            } else {
                this.node.setLocalZOrder(1);
                this.lastSelectGrid = null;
            }
        }

        callFunc();
    },

    _onTouchEnd: function _onTouchEnd() {
        var data = {};
        data.selectGrid = this.selectGrid;
        if (data.selectGrid) {
            //保存上次各个格子的分数
            data.callFunc = this.isMerge.bind(this);
            this.saveLastData();
            wxGame.Global.isLastOperation = true;
        } else {
            this.lastItemScores = [];
        }

        wxGame.NotificationCenter.trigger(wxGame.EventType.SELECT_GRID, data);
        if (this.selectLastGrid) {
            this.lastGridMerge();
            wxGame.Global.isLastOperation = true;
        }
    },

    //炸弹牌销毁上一张牌
    selectBombCard: function selectBombCard(grid) {
        if (this.allGrids.length <= 0) {
            return;
        }
        for (var i = 0; i < this.allGrids.length; i++) {
            if (this.allGrids[i] == grid) {
                if (this.allGrids[i - 1] && this.allGrids[i - 1].item) {
                    wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + this.allGrids[i - 1].item.getScore() * wxGame.Global.gameInfo.nowCrossBet;
                    // this.allGrids[i-1].item.onMergeRemoveItem(this.allGrids[i-1]);
                    this.allGrids[i - 1].item.bombAni();
                    this.allGrids[i - 1].item = null;
                    this.node.setLocalZOrder(1);
                    this.allGrids[0].hideColtSprite(true);
                    grid.item.bombAni();
                    grid.item = null;
                    // grid.item.onMergeRemoveItem(grid);
                } else if (i == 0) {
                    //放在第一行
                    // grid.item.onMergeRemoveItem(grid);
                    this.node.setLocalZOrder(1);
                    grid.hideColtSprite(true);
                    grid.item.bombAni();
                    grid.item = null;
                }
                break;
            }
        }
    },

    //设置万能卡牌分数
    selectPowerful: function selectPowerful(grid) {
        if (this.allGrids.length <= 0) {
            return;
        }
        for (var i = 0; i < this.allGrids.length; i++) {
            if (this.allGrids[i] == grid) {
                if (this.allGrids[i - 1]) {
                    //设置万能牌和上一张牌分数相同
                    grid.item.setScore(this.allGrids[i - 1].item.getScore());
                    break;
                } else if (i == 0) {
                    //放在第一行
                    var scoreConfig = wxGame.GameConfig.createCardConfig;
                    var score = wxGame.GlobalFuncs.randomForArray(scoreConfig);
                    grid.item.setScore(score);
                }
            }
        }
    },

    //最后一个格子直接合并
    lastGridMerge: function lastGridMerge() {
        wxGame.NotificationCenter.trigger(wxGame.EventType.SELECT_LAST_GRID);
        wxGame.GlobalFuncs.vibrateShort();
        //合并音效

        if (this.operItem.getIsPropCard() == wxGame.Global.gameInfo.powerfulCard) {
            wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.powerful, 1.2);
        } else {
            wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.merge, 1.2);
        }
        if (this.selectLastGrid.item.getIsPropCard() == wxGame.Global.gameInfo.undoCard || this.operItem.getIsPropCard() == wxGame.Global.gameInfo.undoCard) {
            //撤销卡牌合并
            wxGame.Global.gameInfo.revocation++;
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_REVOCATION_PROP);
        }

        if (this.selectLastGrid.item.getProp() == wxGame.Global.gameInfo.bombCard || this.operItem.getProp() == wxGame.Global.gameInfo.bombCard) {

            // if (this.operItem.getIsPropCard() == wxGame.Global.gameInfo.powerfulCard) {
            //     wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + this.selectLastGrid.item.getScore() * 5 * 2;
            // }else {
            //     wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + this.selectLastGrid.item.getScore()*2;
            // }
            // this.bomeMerge();
            wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + this.selectLastGrid.item.getScore() * 2 * wxGame.Global.gameInfo.nowCrossBet;
            // this.selectLastGrid.item.onMergeRemoveItem(this.selectLastGrid);
            // this.operItem.onMergeRemoveItem();

            this.selectLastGrid.item.bombAni();
            this.selectLastGrid.item = null;

            this.operItem.bombAni();
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);
            wxGame.NotificationCenter.trigger(wxGame.EventType.SELECT_LAST_GRID);
            return;
        }
        this.operItem.onMergeRemoveItem();
        this.selectLastGrid.item.setScore(this.selectLastGrid.item.getScore() * 2);

        var that = this;
        var _selectLastGrid = that.selectLastGrid;
        var boxCallFunc = function boxCallFunc() {
            if (!_selectLastGrid || !_selectLastGrid.item) {
                return;
            }
            var boxNumer = wxGame.Global.gameInfo.boxNumer;

            //合并的宝箱
            if (wxGame.GameConfig.boxCardConfig.indexOf(_selectLastGrid.item.getScore()) >= 0) {
                var probability = 1;
                if (wxGame.GameConfig.boxCardProbability && wxGame.GameConfig.boxCardProbability.length > 0) {
                    if (wxGame.GameConfig.boxCardProbability[boxNumer]) {
                        probability = wxGame.GameConfig.boxCardProbability[boxNumer];
                    } else {
                        probability = wxGame.GameConfig.boxCardProbability[wxGame.GameConfig.boxCardProbability.length - 1];
                    }
                }

                if (Math.random() <= probability) {
                    //合并的宝箱
                    if (wxGame.shareConfig.mergeBox.isUse) {
                        //弹出宝箱
                        wxGame.GlobalFuncs.popBoxUI(_selectLastGrid.item.getScore());
                        wxGame.Global.gameInfo.boxNumer++;
                    }
                }
            }

            //合并消除一列
            if (wxGame.GameConfig.clearCardConfig.indexOf(_selectLastGrid.item.getScore()) >= 0) {
                that.bomeMerge();
                //消除一列空丢弃栏
                // wxGame.NotificationCenter.trigger(wxGame.EventType.CLEAR_WASTE_STATE);
            }

            if (_selectLastGrid.item.getScore() == 2048) {
                //翻倍
                wxGame.Global.gameInfo.nowCrossBet++;
            }
        };

        var callFunc = function callFunc() {
            boxCallFunc();
            wxGame.NotificationCenter.trigger(wxGame.EventType.MERGE_ITEM_SCORE);
        };

        this.selectLastGrid.item.mergeAni(callFunc); //合并特效
        wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + this.selectLastGrid.item.getScore() * 2 * wxGame.Global.gameInfo.nowCrossBet;
        wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);
    },

    //获取没有卡牌最上面一层四个格子
    getNoneCardGrid: function getNoneCardGrid() {
        this.btmGrid = null;
        this.btmGridIndex = null;
        // this.allGrids[hIndex][vIndex]
        if (this.allGrids.length <= 0) {
            return;
        }
        for (var i = 0; i < this.allGrids.length; i++) {
            if (!this.allGrids[i].item) {
                this.btmGridIndex = i;
                this.btmGrid = this.allGrids[i];
                break;
            }
        }
    },

    //播放翻倍动画
    playBetAni: function playBetAni(posy, _bet, _node) {
        var grid_pos = cc.director.getScene().convertToNodeSpace(_node.getRootNode().convertToWorldSpace(cc.p(0, 0)));
        cc.loader.loadRes('prefab/betAni', function (err, prefab) {
            var betNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(betNode);
            var _size = _node.getRootNode().getContentSize();
            betNode.setPosition(cc.p(grid_pos.x + _size.width / 2, grid_pos.y + _size.height / 2));
            betNode.setTag(10);
            var com = betNode.getComponent('betScore');
            com.setBet(_bet);
        });
    },

    //检测是否可以
    isMerge: function isMerge() {
        var isMerge = false;
        if (!this.allGrids || this.allGrids.length <= 0) {
            return;
        }
        var that = this;
        for (var i = that.allGrids.length; i > 0; i--) {
            if (that.allGrids[i] && that.allGrids[i].item && that.allGrids[i - 1] && that.allGrids[i - 1].item) {
                var item_b = that.allGrids[i].item;
                var item_t = that.allGrids[i - 1].item;
                if (item_b.getScore() == item_t.getScore()) {
                    //相等可以合并
                    isMerge = true;
                    break;
                }
            }
        }

        return isMerge;
    },

    //合并
    mergeItem: function mergeItem() {
        if (this.allGrids.length <= 0) {
            return;
        }
        var that = this;
        var bet = 0;
        var checkMerge = function checkMerge() {
            that.isMergeIng = false;
            for (var i = that.allGrids.length; i > 0; i--) {
                if (that.allGrids[i] && that.allGrids[i].item && that.allGrids[i - 1] && that.allGrids[i - 1].item) {
                    var item_b = that.allGrids[i].item;
                    var item_t = that.allGrids[i - 1].item;
                    bet++;
                    if (item_b.getScore() == item_t.getScore() && wxGame.GameConfig.itemScoreConfig.indexOf(item_t.getScore() * 2) >= 0) {
                        that.isMergeIng = true;
                        //相等合并
                        var callFunc = function callFunc() {
                            // if (item_t.getProp() == wxGame.Global.gameInfo.bombCard || item_b.getProp() == wxGame.Global.gameInfo.bombCard) {
                            //     that.bomeMerge();
                            //     return
                            // }
                            if (i == 1 && that.allGrids[i - 1]) {
                                that.node.setLocalZOrder(1);
                                that.allGrids[i - 1].hideColtSprite(true);
                            }

                            //合并音效
                            if (item_b.getIsPropCard() == wxGame.Global.gameInfo.powerfulCard) {
                                wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.powerful, 1.2);
                                wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + item_t.getScore() * bet * 5 * 2 * wxGame.Global.gameInfo.nowCrossBet;
                            } else if (item_b.getIsPropCard() == wxGame.Global.gameInfo.undoCard) {
                                //撤销卡牌合并
                                wxGame.Global.gameInfo.revocation++;
                                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_REVOCATION_PROP);
                                wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.merge, 1.2);
                                wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + item_t.getScore() * bet * 2 * wxGame.Global.gameInfo.nowCrossBet;
                            } else {
                                wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.merge, 1.2);
                                wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + item_t.getScore() * bet * 2 * wxGame.Global.gameInfo.nowCrossBet;
                            }
                            if (item_t.getIsPropCard() == wxGame.Global.gameInfo.undoCard) {
                                wxGame.Global.gameInfo.revocation++;
                                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_REVOCATION_PROP);
                            }
                            if (bet > 1) {
                                var itemsize = that.allGrids[i - 1].getRootNode().getContentSize();
                                var posy = that.allGrids[i - 1].getRootNode().getPosition().y + itemsize.height / 2;
                                that.playBetAni(posy, bet, that.allGrids[i - 1]);
                            }
                            item_t.setScore(item_t.getScore() * 2, true);
                            item_t.mergeAni(checkMerge); //合并特效
                            wxGame.GlobalFuncs.vibrateShort();
                            item_b.onMergeRemoveItem(that.allGrids[i]);
                            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);
                            wxGame.NotificationCenter.trigger(wxGame.EventType.SAVE_DATA);

                            if (item_t.getScore() == 2048) {
                                //翻倍
                                wxGame.Global.gameInfo.nowCrossBet++;
                            }

                            //合并的宝箱
                            if (wxGame.GameConfig.boxCardConfig.indexOf(item_t.getScore()) >= 0) {
                                var boxNumer = wxGame.Global.gameInfo.boxNumer;
                                var probability = 1;
                                if (wxGame.GameConfig.boxCardProbability && wxGame.GameConfig.boxCardProbability.length > 0) {
                                    if (wxGame.GameConfig.boxCardProbability[boxNumer]) {
                                        probability = wxGame.GameConfig.boxCardProbability[boxNumer];
                                    } else {
                                        probability = wxGame.GameConfig.boxCardProbability[wxGame.GameConfig.boxCardProbability.length - 1];
                                    }
                                }

                                if (Math.random() <= probability) {
                                    //合并的宝箱
                                    if (wxGame.shareConfig.mergeBox.isUse) {
                                        //弹出宝箱
                                        wxGame.GlobalFuncs.popBoxUI(item_t.getScore());
                                        wxGame.Global.gameInfo.boxNumer++;
                                    }
                                }
                            }

                            //合并消除一列
                            if (wxGame.GameConfig.clearCardConfig.indexOf(item_t.getScore()) >= 0) {
                                that.bomeMerge();
                                //消除一列空丢弃栏
                                // wxGame.NotificationCenter.trigger(wxGame.EventType.CLEAR_WASTE_STATE);
                            }
                        };
                        item_b.moveToPosMerge(item_t.getRootNode().getPosition(), callFunc);
                        // this.allGrids[i].item = null;
                        break;
                    }
                }
            }
        };

        checkMerge();
    },

    //炸弹合并
    bomeMerge: function bomeMerge() {
        if (this.allGrids.length <= 0) {
            this.isMergeIng = false;
            return;
        }
        var timer = 0;
        var that = this;
        var index = 0;
        var callFunc = function callFunc() {
            that.isMergeIng = true;
            if (that.allGrids[index] && that.allGrids[index].item) {
                if (index == 0) {
                    that.allGrids[index].hideColtSprite(true);
                }
                wxGame.Global.gameInfo.score = wxGame.Global.gameInfo.score + that.allGrids[index].item.getScore() * wxGame.Global.gameInfo.nowCrossBet;
                that.node.setLocalZOrder(1);
                that.allGrids[index].item.bombAni();
                that.allGrids[index].item = null;
                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);
                wxGame.NotificationCenter.trigger(wxGame.EventType.SAVE_DATA); //存档
                that.node.runAction(cc.sequence(cc.delayTime(timer), cc.callFunc(function () {
                    callFunc();
                })));
                timer += 0.1;
            } else {
                that.isMergeIng = false;
            }
            index++;
        };

        callFunc();

        wxGame.GlobalFuncs.vibrateShort();

        //炸弹音效
        wxGame.AudioManager.playEffect(wxGame.AudioManager.AudioType.bomb, 1.2);
    },

    //检查游戏是否结束
    checkOver: function checkOver(item) {
        var isOver = true;
        // if (this.allGrids.length <= 0) {
        //     //
        //     return
        // }
        if (item) {
            if (item.getProp() == wxGame.Global.gameInfo.powerfulCard) {
                isOver = false;
            }
        }

        for (var i = 0; i < this.allGrids.length; i++) {
            if (!this.allGrids[i].item) {
                isOver = false;
            }
        }
        if (this.isMerge()) {
            isOver = false;
        }

        if (isOver) {
            if (this.allGrids[this.allGrids.length - 1].item && this.allGrids[this.allGrids.length - 1].item.getScore) {
                if (this.allGrids[this.allGrids.length - 1].item.getScore() == item.getScore()) {
                    isOver = false;
                }
            }
        }
        wxGame.NotificationCenter.trigger(wxGame.EventType.CHECK_OVER_RESULT, isOver);
    },

    //创建格子:
    createAllGrid: function createAllGrid(hIndex) {
        var gridInfo = wxGame.Global.gridInfo;
        for (var vIndex = 0; vIndex < gridInfo.rowNum; vIndex++) {
            var parma = {
                hIndex: hIndex,
                vIndex: vIndex
            };
            this.allGrids[vIndex] = this.createGrid(parma);
        }
    },

    //创建格子
    createGrid: function createGrid(parma) {
        //参数
        var hIndex = parma.hIndex;
        var vIndex = parma.vIndex;
        var gridInfo = wxGame.Global.gridInfo;
        var gridItem = cc.instantiate(this.gridPrefab);
        // var posX = this.startX + hIndex * Global.itemSize + hIndex * Global.itemSplit;
        // var posY = this.startY - vIndex * Global.itemSize - vIndex * Global.itemSplit;
        var _size = this.node.getContentSize();
        var gridSize = gridItem.getContentSize();
        var inter_r = (_size.height - gridSize.height) / (gridInfo.rowNum - 1);
        var inter_c = gridInfo.interval;
        // var initX = 0 - ((gridInfo.colNum-1) * inter_c + gridInfo.colNum*gridSize.width)/2;
        var posX = 0;

        var posY = _size.height / 2 - vIndex * inter_r - gridSize.height / 2;
        //设置格子的坐标
        gridItem.setPosition(cc.p(posX, posY));
        gridItem.setLocalZOrder(20);
        //设置索引和位置
        var gridView = gridItem.getComponent("gridView");
        gridView.node.setPosition(posX, posY);
        gridView.setIndex(hIndex, vIndex, this);
        if (vIndex == 0) {
            gridView.hideColtSprite(true);
        }
        this.node.addChild(gridItem);
        return gridView;
    },

    resurgenceSuccess: function resurgenceSuccess() {
        if (this.allGrids.length <= 0) {
            return;
        }
        var lastLength = this.allGrids.length - 1;

        var timer = 0;
        var that = this;
        var index = 0;
        var callFunc = function callFunc() {
            if (that.allGrids[lastLength - index] && that.allGrids[index].item && index < wxGame.resurgenceConfig.resurgenceRemove) {
                that.node.setLocalZOrder(1);
                that.allGrids[lastLength - index].item.bombAni();
                that.allGrids[lastLength - index].item = null;

                that.node.runAction(cc.sequence(cc.delayTime(timer), cc.callFunc(function () {
                    callFunc();
                })));
                timer += 0.05;
            }
            index++;
        };

        callFunc();
    },

    resetData: function resetData() {
        // this.selectGrid = null;
        if (this.allGrids.length <= 0) {
            return;
        }
        // this.node.stopAllActions();
        var timer = 0;

        var that = this;

        var index = 0;
        var callFunc = function callFunc() {
            if (that.allGrids[index] && that.allGrids[index].item) {
                if (index == 0) {
                    that.allGrids[index].hideColtSprite(true);
                }
                that.node.setLocalZOrder(1);
                that.allGrids[index].item.bombAni();
                that.allGrids[index].item = null;

                that.node.runAction(cc.sequence(cc.delayTime(timer), cc.callFunc(function () {
                    callFunc();
                })));
                timer += 0.05;
            }
            index++;
        };

        var randTimer = Math.random() / 2;
        this.node.runAction(cc.sequence(cc.delayTime(randTimer), cc.callFunc(function () {
            callFunc();
        })));
        this.lastItemScores = [];
        this.selectGrid = null;
        this.selectLastGrid = null;
        this.operItem = null;
    },

    removeGameAni: function removeGameAni() {
        this.lastItemScores = [];
        this.selectGrid = null;
        this.selectLastGrid = null;
        this.operItem = null;

        if (this.allGrids.length <= 0) {
            return;
        }

        for (var i = 0; i < this.allGrids.length; i++) {
            if (this.allGrids[i].item) {
                this.allGrids[i].item.removeeAni();
                this.allGrids[i].item = null;
            }
        }
    },

    onDestroy: function onDestroy() {
        wxGame.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
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
        //# sourceMappingURL=gridNode.js.map
        