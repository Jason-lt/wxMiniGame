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
        gird_1:cc.Node,
        gird_2:cc.Node,
        gridPrefab:cc.Prefab,
        itemPrefab:cc.Prefab,
        grideNode:cc.Prefab,
        changePropLabel:cc.Label,
        revocationLabel:cc.Label,
        castOffNode:cc.Node,
        cardBag:cc.Node,
        powerfulPropLabel:cc.Label,
        bombPropLabel:cc.Label,
        changeBtn:cc.Node,
        recoverBtn:cc.Node,
    },

    onLoad:function(){
        this.girdView_1 = this.gird_1.getComponent("gridView");
        this.girdView_1.hideColtSprite(false);
        this.girdView_2 = this.gird_2.getComponent("gridView");
        this.girdView_2.hideColtSprite(false);

        wxGame.NotificationCenter.listen(wxGame.EventType.SELECT_GRID,this._selectGrid,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.SELECT_LAST_GRID,this._selectLastGrid,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_CHANGE_PROP,this.updateChangeProp,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_REVOCATION_PROP,this.updateRevocationProp,this);


        wxGame.NotificationCenter.listen(wxGame.EventType.CHECK_OVER_RESULT,this._checkOverResult,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.BEGIN_GAME,this.beginGame,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.CREATE_ITEM,this.createItem,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.RECOVER_LAST_OPERATION,this.recoverLastOperation,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.SELECT_WASTE,this._selectWaste,this);

        wxGame.NotificationCenter.listen(wxGame.EventType.REMOVE_GAME_ANI,this.removeGameAni,this);
        
        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_GET_PROP,this._updateGetProp,this);

        wxGame.NotificationCenter.listen(wxGame.EventType.GAME_OVER_RESET,this.reSetGame,this);

        wxGame.NotificationCenter.listen(wxGame.EventType.RESURGENCE_SUCCESS,this.resurgenceSuccess,this);
        
        wxGame.NotificationCenter.listen(wxGame.EventType.SAVE_DATA,this.onSaveGame,this);

        wxGame.NotificationCenter.listen(wxGame.EventType.POP_RESULTUI,this.popResurtUI,this);
        
        wxGame.NotificationCenter.listen(wxGame.EventType.USE_PROP,this.useChangeProp,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.PUT_CARD_POOL,this.putCardPool,this);

        wxGame.NotificationCenter.listen(wxGame.EventType.UPDATE_SHARE_STATE,this.updateShareState,this);
        
        wxGame.NotificationCenter.listen(wxGame.EventType.GET_PROP_CARD_ANI,this.getPropCard,this);
        
        wxGame.NotificationCenter.listen(wxGame.EventType.PROP_CARD_BAG_ANI,this.propCardBagAni,this);

        this.cardBag.setLocalZOrder(1001);
        this.changeBtn.setLocalZOrder(1002);
        this.recoverBtn.setLocalZOrder(1002);
        //初始化对象池,添加34张手牌
        this.cardPool = new cc.NodePool();

        var i;
        for (i = 0; i < 34; i++){
            this.cardPool.put(cc.instantiate(this.itemPrefab));
        }
        wxGame.wxAdManager.checkVideoAd();
        this.operationItem = null;
        this.isOverList = [];
        // this.repertoprCard = [];
        this.allGridsNode = [];

        this._initUI();
        
        this.createAllGridNode();
        this.beginGame();

        var util = require('myUtil');
        // 适配iphoneX
        var isFitIphoneX =util.isIphoneX();
        if (isFitIphoneX){
            var _widget = this.node.getComponent(cc.Widget);
            _widget.bottom = 30;
            wxGame.Global.isXInter = 30;
        }else if (cc.winSize.width / cc.winSize.height <= 0.53){
            var _widget = this.node.getComponent(cc.Widget);
            _widget.bottom = 30;
            wxGame.Global.isXInter = 30;
        }
        var winSize = cc.director.getWinSize();
        var sizeScale = winSize.width / winSize.height;
        wxGame.LOGW("file = [bottom] fun = [onLoad] sizeScale = " + sizeScale);
        wxGame.LOGW("file = [bottom] fun = [onLoad] winSize.width = " + winSize.width);
        wxGame.LOGW("file = [bottom] fun = [onLoad] winSize.height = " + winSize.height);
    },

    //创建格子:
    createAllGridNode:function(){
        var gridInfo = wxGame.Global.gridInfo;
        for (var hIndex = 0; hIndex < gridInfo.colNum; hIndex++) {
            var gridNode = cc.instantiate(this.grideNode);
            this.node.addChild(gridNode);
            var gridNodeCom = gridNode.getComponent("gridNode");
            gridNodeCom.createAllGrid(hIndex);
            var inter_c = gridInfo.interval;
            var initX = 0 - ((gridInfo.colNum-1) * inter_c + gridInfo.colNum * gridInfo.width)/2;
            var posX = initX + hIndex*(gridInfo.width + inter_c) + gridInfo.width/2;
            var pos = gridNode.getPosition();
            pos.x = posX;
            this.allGridsNode[hIndex] = gridNodeCom;
            gridNode.setPosition(pos);
        }
    },

    //开始游戏
    beginGame:function(){
        this.createCard();
        this.createCard();

        // if (wxGame.GlobalFuncs.isEmptyObject(wxGame.saveGameInfo)) {
        //     //开始游戏分数重置
        //     wxGame.Global.gameInfo.score = 0;
        //     wxGame.Global.gameInfo.boxNumer = 0;
        //
        //     wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);
        //
        //     this.lastMainData = {};
        //
        //     this.updateChangeProp();
        //     this.updateRevocationProp();
        // }else {
        //
        // }
        wxGame.Global.isLastOperation = false;
        wxGame.Global.gameInfo.score = wxGame.saveGameInfo.allScore || 0;
        wxGame.Global.gameInfo.nowCrossBet = wxGame.saveGameInfo.nowCrossBet || 1;
        wxGame.Global.gameInfo.nowCardNumber = wxGame.saveGameInfo.nowCardNumber || 0;
        wxGame.Global.gameInfo.boxNumer = 0;
        wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);
        wxGame.Global.gameInfo.revocation = 0;
        if (wxGame.saveGameInfo.revocation) {
            wxGame.Global.gameInfo.revocation = wxGame.saveGameInfo.revocation;
        }

        wxGame.Global.gameInfo.powerfulProp = 0;
        if (wxGame.saveGameInfo.powerfulProp) {
            wxGame.Global.gameInfo.powerfulProp = wxGame.saveGameInfo.powerfulProp;
        }

        wxGame.Global.gameInfo.bombProp = 0;
        if (wxGame.saveGameInfo.bombProp) {
            wxGame.Global.gameInfo.bombProp = wxGame.saveGameInfo.bombProp;
        }

        this.lastMainData = {};

        this.updateChangeProp();
        this.updateRevocationProp();
        this.updatePowerfulProp();
        this.updateBombProp();
        var com = this.castOffNode.getComponent("castOffNode");
        if ( wxGame.saveGameInfo.wasteNumer) {
            com.wasteNumer = wxGame.saveGameInfo.wasteNumer;
            com.setWasteState();
        }

        var that = this;
        var nextCallBack = function(){
            if (wxGame.saveGameInfo.itemScores && wxGame.saveGameInfo.itemScores.length > 0) {
                var itemScores = wxGame.saveGameInfo.itemScores;
                for (var i = 0; i < itemScores.length; i++){
                    if (that.allGridsNode[i] && itemScores[i].length > 0 && that.allGridsNode[i].allGrids.length > 0) {
                        for (var j = 0; j < itemScores[i].length; j++) {
                            var data = {};
                            data.grid = that.allGridsNode[i].allGrids[j];
                            data.score = itemScores[i][j].score;
                            data.propType = itemScores[i][j].propType;
                            that.createItem(data)
                        }
                    }
                }
            }
            wxGame.saveGameInfo = {};

            wxGame.wxBannerAd.createBannerAd();
        };

        requestAnimationFrame(nextCallBack);
    },
    
    _initUI:function(){
        var that = this;
        var containerRect = cc.rect(0, 0, this.node.width, this.node.height);

        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            var pos = that.node.convertToNodeSpace(event.touch.getLocation());

            if(!that.operationItem) {
                that.operationItem = that.isTouchOnCard(pos);
            }
            if (cc.rectContainsPoint(containerRect, pos) && that.operationItem) {
                that._onTouchBegan(pos);
            }
        }, that, true);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            var pos = that.node.convertToNodeSpace(event.touch.getLocation());
            if (cc.rectContainsPoint(containerRect, pos)) {
                // var item = that.isTouchOnCard(pos);
                if (that.operationItem) {
                    that.touchCardsMoved(pos);
                }
            }
        }, that, true);
        this.node.on(cc.Node.EventType.TOUCH_END, function(){
            that.touchCardsEnd();
        }, that, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(){
            that.touchCardsEnd();
        }, that, true);

        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: false,
        //     onTouchBegan: function(touch, event) {
        //         var pos = that.node.convertToNodeSpace(touch.getLocation());
        //         that.operationItem = that.isTouchOnCard(pos);
        //         if (cc.rectContainsPoint(containerRect, pos) && that.operationItem) {
        //             return that._onTouchBegan(pos);
        //         }
        //         return false;
        //     },
        //     onTouchEnded: function(touch, event) {
        //         that.touchCardsEnd();
        //
        //     },
        //     onTouchMoved: function(touch, event) {
        //         var pos = that.node.convertToNodeSpace(touch.getLocation());
        //         if (cc.rectContainsPoint(containerRect, pos)) {
        //             // var item = that.isTouchOnCard(pos);
        //             if (that.operationItem) {
        //                 that.touchCardsMoved(pos);
        //             }
        //         }
        //     },
        // }, this.node);
    },

    _onTouchBegan: function(pos) {
        if (this.isOver) {
            return false;
        }
        // this.hideCardBag();
        if(this.operationItem){
            pos.x = pos.x - this.node.width/2;
            pos.y = pos.y + this.operationItem.node.height/2;
            this.operationItem.setItemPosition(pos);
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_TOUCH_BEGAN,this.operationItem);
        }
        return true;
    },

    touchCardsMoved:function(pos){
        // wxGame.LOGD("file = [bottom] fun = [touchCardsMoved] pos = " +pos);
        wxGame.NotificationCenter.trigger(wxGame.EventType.HIDE_GRID_KUANG,false);
        if(this.operationItem){
            // wxGame.LOGD("file = [bottom] fun = [touchCardsMoved] this.operationItem = ");
            pos.x = pos.x - this.node.width/2;
            pos.y = pos.y + this.operationItem.node.height/2;
            this.operationItem.setItemPosition(pos);
            this.selectGrid = null;
            //将手牌放入格子中

            var callFunc = function(){

            };
            var data = {};
            data.pos = pos;
            data.item = this.operationItem;
            data.callFunc = callFunc;
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_TOUCH_MOVE,data);
        }

    },

    touchCardsEnd:function(){
        this.evnetIndex = 0;
        this.recoverCard = false;
        wxGame.Global.isLastOperation = false;
        if(this.operationItem){
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_TOUCH_END);
            this.operationItem = null;
        }
    },

    _selectGrid:function(data){
        this.evnetIndex ++;
        var gridInfo = wxGame.Global.gridInfo;
        var selectGrid = data.selectGrid;
        if (this.operationItem) {
            if (selectGrid) {

                //保存上次操作数据
                this.saveLastData();

                var grid_pos = this.node.convertToNodeSpace(selectGrid.getRootNode().convertToWorldSpace(cc.p(0,0)));
                grid_pos.x = grid_pos.x = grid_pos.x - this.node.width/2 + this.operationItem.node.width/2;
                grid_pos.y = grid_pos.y + this.operationItem.node.height/2;
                this.operationItem.setItemPosition(grid_pos);
                selectGrid.item = this.operationItem;

                //万能卡牌
                if (selectGrid.item.getProp() == wxGame.Global.gameInfo.powerfulCard){
                    wxGame.NotificationCenter.trigger(wxGame.EventType.SELECT_POWERFUL,selectGrid);
                }

                //炸弹卡牌
                if (selectGrid.item.getProp() == wxGame.Global.gameInfo.bombCard){
                    wxGame.NotificationCenter.trigger(wxGame.EventType.SELECT_BOMBCARD,selectGrid);
                }

                if (data.callFunc && !data.callFunc()) {
                    this.operationItem.selectAni();
                }else {
                    wxGame.NotificationCenter.trigger(wxGame.EventType.MERGE_ITEM_SCORE);
                }
                this.girdView_2.item = null;
                // this.operationItem = null;
                this.recoverCard = true;    //卡牌选中格子
                
                // this.isOverList = [];
                this.createCard();

                this.onSaveGame();
            }

            if ((this.evnetIndex == gridInfo.colNum) && !this.recoverCard) {
                if (this.girdView_2.item){
                    this.operationItem.setItemPosition(this.gird_2.getPosition());
                }
                else if (this.girdView_1.item) {
                    this.operationItem.setItemPosition(this.gird_1.getPosition());
                }

            }
        }
        wxGame.NotificationCenter.trigger(wxGame.EventType.HIDE_GRID_KUANG,false);
    },

    _selectLastGrid:function(){
        //保存上次操作数据
        this.saveLastData();
        
        this.girdView_2.item = null;
        // this.operationItem = null;
        this.recoverCard = true;

        wxGame.NotificationCenter.trigger(wxGame.EventType.MERGE_ITEM_SCORE);

        this.createCard();
        this.onSaveGame();
    },

    _selectWaste:function(selectWaste){
        if (selectWaste && this.operationItem) {
            this.saveLastData();

            this.operationItem.onMergeRemoveItem();
            this.operationItem = null;
            this.girdView_2.item = null;
            this.recoverCard = true;

            this.createCard();
        }
    },

    _updateGetProp:function(index){
        if (!this.girdView_1.item) {
            return
        }
        if (index == 0){    //炸弹
            // this.girdView_1.item.setPropType(wxGame.Global.gameInfo.bombCard);
            wxGame.Global.gameInfo.bombProp++;
            this.updateBombProp();
        }else if (index == 1) { //万能
            wxGame.Global.gameInfo.powerfulProp++;
            this.updatePowerfulProp();
            // this.girdView_1.item.setPropType(wxGame.Global.gameInfo.powerfulCard);
        }
    },

    updateBombProp:function(){
        this.bombPropLabel.string = "x" + wxGame.Global.gameInfo.bombProp;
    },

    updatePowerfulProp:function(){
        this.powerfulPropLabel.string = "x" + wxGame.Global.gameInfo.powerfulProp;
    },

    saveLastData:function(){
        //保存上次操作数据
        this.lastMainData.score = wxGame.Global.gameInfo.score;
        this.lastMainData.nowCrossBet = wxGame.Global.gameInfo.nowCrossBet;
        this.lastMainData.nowCardNumber = wxGame.Global.gameInfo.nowCardNumber;
        this.lastMainData.changeProp = wxGame.Global.gameInfo.changeProp;
        // this.lastMainData.revocation = wxGame.Global.gameInfo.revocation;
        this.lastMainData.powerfulProp = wxGame.Global.gameInfo.powerfulProp;
        this.lastMainData.bombProp = wxGame.Global.gameInfo.bombProp;
        this.lastMainData.propType_1 = this.girdView_1.item.getProp();
        this.lastMainData.itme_1 = this.girdView_1.item.getScore();
        this.lastMainData.propType_2 = this.girdView_2.item.getProp();
        this.lastMainData.itme_2 = this.girdView_2.item.getScore();
        wxGame.Global.isLastOperation = true;
    },

    _checkOverResult:function(isOver){
        this.isOverList.push(isOver);
        var gridInfo = wxGame.Global.gridInfo;
        if (this.isOverList.length == gridInfo.colNum){
            var isOver = true;
            for (var i = 0; i < this.isOverList.length; i++){
                if (!this.isOverList[i]) {
                    isOver = false;
                    break;
                }
            }

            var that = this;
            this.isOver = isOver;
            if (isOver) {
                wxGame.NotificationCenter.trigger(wxGame.EventType.STOP_UPDATE_RANK);
                wxGame.wxBannerAd.destroyBannerAd();
                this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                    // wxGame.GlobalFuncs.showGameResultUI();
                    if (wxGame.resurgenceConfig.isResurgence){
                        wxGame.GlobalFuncs.showResurgenceUI();
                    }else {
                        wxGame.NotificationCenter.trigger(wxGame.EventType.GAME_OVER_RESET);
                        that.popResurtUI();
                    }
                })));
            }
            this.isOverList = [];
        }
    },

    //弹出结算
    popResurtUI:function(){
        this.node.runAction(cc.sequence(cc.delayTime(1.6),cc.callFunc(function() {
            wxGame.GlobalFuncs.showGameResultUI();
        })));
    },

    resurgenceSuccess:function(){
        this.isOver = false;
        this.onSaveGame();
        this.lastMainData = {};
        wxGame.Global.isLastOperation = false;
    },

    // 触摸区域是否在出牌区
    isTouchOnCard:function(pos){
        // var len = this.repertoprCard.length;
        // if (len <= 0) {
        //     return null;
        // }

        if (this.girdView_2.item && this.girdView_2.item.getRootNode()){
            var cardRect_2 = cc.rect(this.girdView_2.item.getRootNode().x+this.node.width/2 - this.girdView_2.item.node.width/2,
                this.girdView_2.item.getRootNode().y - this.girdView_2.item.getRootNode().height/2,
                this.girdView_2.item.getRootNode().width, this.girdView_2.item.getRootNode().height);
            if (cc.rectContainsPoint(cardRect_2, pos)) {
                return this.girdView_2.item;
            }
            return null
        }

        if (this.girdView_1.item && this.girdView_1.item.getRootNode()){
            var cardRect_1 = cc.rect(this.girdView_1.item.getRootNode().x+this.node.width/2,
                this.girdView_1.item.getRootNode().y - this.girdView_1.item.getRootNode().height/2,
                this.girdView_1.item.getRootNode().width, this.girdView_1.item.getRootNode().height);
            if (cc.rectContainsPoint(cardRect_1, pos)) {
                return this.girdView_1.item;
            }
            return null
        }

        return null;
    },

    //添加新牌
    createCard:function(){

        var scoreConfig = wxGame.GameConfig.createCardConfig;
        var score = wxGame.GlobalFuncs.randomForArray(scoreConfig);

        if (wxGame.Global.gameInfo.score > wxGame.GameConfig.ProplimitScore) {
            
            if (wxGame.GameConfig.showPropCardInterval && (wxGame.Global.gameInfo.nowCardNumber%wxGame.GameConfig.showPropCardInterval == 0)) {
                if (wxGame.GameConfig.showPropCardProbabilityList){
                    var _random = Math.random();
                    for (var key in wxGame.GameConfig.showPropCardProbabilityList) {
                        var porpData = wxGame.GameConfig.showPropCardProbabilityList[key];
                        if (_random >= porpData.probability[0] && _random < porpData.probability[1]){
                            if (porpData.score) {
                                score = porpData.score;
                            }
                        }
                    }
                }
            }

            // if (wxGame.GameConfig.showPropCardProbabilityList){
            //     var _random = Math.random();
            //     for (var key in wxGame.GameConfig.showPropCardProbabilityList) {
            //         var porpData = wxGame.GameConfig.showPropCardProbabilityList[key];
            //         if (_random >= porpData.probability[0] && _random < porpData.probability[1]){
            //             if (porpData.score) {
            //                 score = porpData.score;
            //             }
            //         }
            //     }
            // }
            
        }

        if (this.girdView_1.item) {
            if (!this.girdView_2.item){
                this.girdView_1.item.moveToPos(this.gird_2.getPosition());
                this.girdView_2.item = this.girdView_1.item;
                this.girdView_1.item = null;
                this.girdView_2.item.setItemZOrder(3);
                // this.girdView_2.item.setScore(score);
                // this.repertoprCard[1] = this.girdView_2.item;
                this.createCard();
            }
        }else {

            //创建一张新手牌
            var itemPrefab
            if (this.cardPool.size() > 0){
                itemPrefab = this.cardPool.get();
            }else{
                wxGame.LOGD("file = [bottom] fun = [createCard] 非牌池");
                itemPrefab = cc.instantiate(this.itemPrefab);
            }
            // var itemPrefab = cc.instantiate(this.itemPrefab);
            itemPrefab.setPosition(this.gird_1.getPosition());
            this.node.addChild(itemPrefab);
            this.girdView_1.item = itemPrefab.getComponent("itemView");
            // this.repertoprCard[0] = this.girdView_1.item;
            this.girdView_1.item.moveLeftToPos(this.gird_1.getPosition());
            this.girdView_1.item.setItemZOrder(1);
            this.girdView_1.item.setScore(score);
            wxGame.Global.gameInfo.nowCardNumber++;
            this.isOver = false;
            wxGame.NotificationCenter.trigger(wxGame.EventType.CHECK_OVER,this.girdView_2.item);
        }
    },

    //手牌不用了,归还牌池
    putCardPool:function(card){
        this.cardPool.put(card);
    },

    createItem:function(data){
        // grid,score,propType
        var grid = data.grid;
        var score = data.score;
        var propType = data.propType;
        var itemPrefab = cc.instantiate(this.itemPrefab);

        var grid_pos = this.node.convertToNodeSpace(grid.getRootNode().convertToWorldSpace(cc.p(0,0)));
        grid_pos.x = grid_pos.x = grid_pos.x - this.node.width/2 + itemPrefab.width/2;
        grid_pos.y = grid_pos.y + itemPrefab.height/2;
        itemPrefab.setPosition(grid_pos);
        this.node.addChild(itemPrefab);
        var item = itemPrefab.getComponent("itemView");
        // this.repertoprCard[0] = this.girdView_1.item;
        item.setItemZOrder(2);
        item.setScore(score);
        item.setPropType(propType);
        grid.item = item;
    },

    //清除手牌区
    resetHandCard:function(){
        if (this.girdView_1.item) {
            this.girdView_1.item.gameOverRemove();
            this.girdView_1.item = null;
        }
        if (this.girdView_2.item) {
            this.girdView_2.item.gameOverRemove();
            this.girdView_2.item = null;
        }
    },

    reSetGame:function(){
        this.resetHandCard();
        this.isOverList = [];
        this.operationItem = null;
        this.recoverCard = true;
        this.isOver = false;
        this.evnetIndex = 0;
        wxGame.saveGameInfo = {};
        tcpManager.sendCmd.saveRecord({});
        wxGame.Global.isLastOperation = false;
    },

    removeGameAni:function(){
        this.resetHandCard();
        this.isOverList = [];
        this.operationItem = null;
        this.recoverCard = true;
        this.isOver = false;
        this.evnetIndex = 0;

        if (this.kapaiAni) {
            var com = this.kapaiAni.getComponent("kapai");
            com.onClose();
            this.kapaiAni.removeFromParent();
            this.kapaiAni = null;
        }
        if (this.daojubao) {
            var ani = this.daojubao.getComponent(cc.Animation);
            var anim = ani.getAnimationState("daojubao");
            anim.stop();
            this.daojubao.removeFromParent();
            this.daojubao = null;
        }
    },

    recoverLastOperation:function(){
        if (this.isOver) {
            return false;
        }
        wxGame.Global.isLastOperation = false;
        if (wxGame.GlobalFuncs.isEmptyObject(this.lastMainData)) {
            //上次操作为空
            wxGame.GlobalFuncs.showToast("当前无操作~");
            return
        }
        wxGame.Global.gameInfo.score = this.lastMainData.score;

        wxGame.Global.gameInfo.nowCrossBet = this.lastMainData.nowCrossBet;
        wxGame.Global.gameInfo.nowCardNumber = this.lastMainData.nowCardNumber;

        wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_SCORE_LABEL);

        // wxGame.Global.gameInfo.changeProp = this.lastMainData.changeProp;
        this.updateChangeProp();
        // wxGame.Global.gameInfo.revocation = this.lastMainData.revocation;
        this.updateRevocationProp();

        wxGame.Global.gameInfo.powerfulProp = this.lastMainData.powerfulProp;
        this.updatePowerfulProp();

        wxGame.Global.gameInfo.bombProp = this.lastMainData.bombProp;
        this.updateBombProp();

        this.girdView_1.item.setScore(this.lastMainData.itme_1);
        this.girdView_1.item.setPropType(this.lastMainData.propType_1);

        this.girdView_2.item.setScore(this.lastMainData.itme_2);
        this.girdView_2.item.setPropType(this.lastMainData.propType_2);
        this.girdView_2.item.setItemZOrder(3);

        this.lastMainData = {};
    },

    //刷新互换牌道具
    updateChangeProp:function(){
        this.changePropLabel.string = "x" + wxGame.Global.gameInfo.changeProp;
    },

    //刷新撤销道具数量
    updateRevocationProp:function(){
        // this.revocationLabel.string = "撤销(" + wxGame.Global.gameInfo.revocation + ")";
        this.revocationLabel.string = "撤销";
    },

    onSaveGame:function(){
        if (this.allGridsNode.length > 0) {
            wxGame.LOGD("file = [bottom] fun = [onSaveGame]");
            var gameInfo = {};
            gameInfo.itemScores = [];
            var isHavaData = false;
            for (var i = 0; i < this.allGridsNode.length; i++){
                if (this.allGridsNode[i].allGrids && this.allGridsNode[i].allGrids.length > 0) {

                    var gridScore = [];
                    var allGrids = this.allGridsNode[i].allGrids;
                    for (var j = 0; j < allGrids.length; j++){
                        if (allGrids[j].item) {
                            isHavaData = true;
                            var data = {};
                            data.score = allGrids[j].item.getScore();
                            data.propType = allGrids[j].item.getProp();
                            gridScore.push(data);
                        }
                    }
                    gameInfo.itemScores.push(gridScore)
                }
            }

            if (!isHavaData) {
                tcpManager.sendCmd.saveRecord({});
                return
            }
            if (wxGame.Global.gameInfo.score) {
                gameInfo.allScore = wxGame.Global.gameInfo.score;
            }

            if (wxGame.Global.gameInfo.nowCrossBet) {
                gameInfo.nowCrossBet = wxGame.Global.gameInfo.nowCrossBet;
            }

            if (wxGame.Global.gameInfo.nowCardNumber) {
                gameInfo.nowCardNumber = wxGame.Global.gameInfo.nowCardNumber;
            }

            var com = this.castOffNode.getComponent("castOffNode");
            if (com.wasteNumer) {
                gameInfo.wasteNumer = com.wasteNumer;
            }

            if (wxGame.Global.gameInfo.revocation) {
                gameInfo.revocation = wxGame.Global.gameInfo.revocation;
            }

            if (wxGame.Global.gameInfo.powerfulProp) {
                gameInfo.powerfulProp = wxGame.Global.gameInfo.powerfulProp;
            }

            if (wxGame.Global.gameInfo.bombProp) {
                gameInfo.bombProp = wxGame.Global.gameInfo.bombProp;
            }

            tcpManager.sendCmd.saveRecord(gameInfo);
        }
    },

    hideCardBag:function(){
        this.cardBag.stopAllActions();
        if (this.cardBag.getScaleY() == 1) {
            var scale1 = cc.scaleTo(0.1, 1, 0);
            this.cardBag.runAction(scale1);
        }
    },

    showCardBag:function(){
        this.cardBag.stopAllActions();
        if (this.cardBag.getScaleY() == 0) {
            var scale1 = cc.scaleTo(0.1, 1, 1);
            this.cardBag.runAction(scale1);
        }else {
            var scale1 = cc.scaleTo(0.1, 1, 0);
            this.cardBag.runAction(scale1);
        }
    },

    onClickCardBag:function(){
        tywx.BiLog.clickStat(wxGame.biManager.clickPropCardBag, ["onClickCardBag"]);
        if (this.isOver) {
            return;
        }
        this.showCardBag();
    },

    //交换道具
    onClickChangeBtn:function(){
        if (this.isOver) {
            return;
        }
        this.hideCardBag();
        if (wxGame.Global.gameInfo.changeProp > 0) {
            tcpManager.sendCmd.consumeAssets(1,"item:1415");
        }else {
            if (wxGame.shareConfig.getProp && wxGame.shareConfig.getProp.isUse) {
                wxGame.GlobalFuncs.getPropWindow(2);
            }else {
                wxGame.GlobalFuncs.showToast("使用道具失败~");
            }
        }
    },

    //炸弹卡牌
    onClickBombCard:function(){
        this.hideCardBag();
        if (wxGame.Global.gameInfo.bombProp > 0) {
            wxGame.Global.gameInfo.bombProp--;
            this.updateBombProp();
            this.girdView_2.item.setPropType(wxGame.Global.gameInfo.bombCard);
            tywx.BiLog.clickStat(wxGame.biManager.useBombCard, ["useBombCard"]);
        }else {
            if (wxGame.shareConfig.getProp && wxGame.shareConfig.getProp.isUse) {
                wxGame.GlobalFuncs.getPropWindow(0);
            }else {
                wxGame.GlobalFuncs.showToast("道具数量不足~");
            }
        }
    },

    //万能卡牌
    onClickPowerfulCard:function(){
        this.hideCardBag();
        if (wxGame.Global.gameInfo.powerfulProp > 0) {
            wxGame.Global.gameInfo.powerfulProp--;
            this.updatePowerfulProp();
            this.girdView_2.item.setPropType(wxGame.Global.gameInfo.powerfulCard);
            tywx.BiLog.clickStat(wxGame.biManager.usePowerfulCard, ["usePowerfulCard"]);
        }else {

            if (wxGame.shareConfig.getProp && wxGame.shareConfig.getProp.isUse) {
                wxGame.GlobalFuncs.getPropWindow(1);
            }else {
                wxGame.GlobalFuncs.showToast("道具数量不足~");
            }
        }
    },

    //使用交换道具
    useChangeProp:function(result){
        if(result.success == 1){
            if (this.girdView_1.item && this.girdView_2.item && result.itemId == "item:1415") {
                if (wxGame.Global.gameInfo.changeProp > 0) {
                    [this.girdView_1.item,this.girdView_2.item] = [this.girdView_2.item,this.girdView_1.item];
                    this.girdView_1.item.moveToPos(this.gird_1.getPosition());
                    this.girdView_1.item.setItemZOrder(1);
                    this.girdView_2.item.moveToPos(this.gird_2.getPosition());
                    this.girdView_2.item.setItemZOrder(3);
                    wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_CHANGE_PROP);
                }
            }
            tywx.BiLog.clickStat(wxGame.biManager.useChangeCard, ["useChangeProp"]);
        }else {
            if (wxGame.shareConfig.getProp && wxGame.shareConfig.getProp.isUse) {
                wxGame.GlobalFuncs.getPropWindow(2);
            }else {
                wxGame.GlobalFuncs.showToast("使用道具失败~");
            }
        }
    },

    onClickRevocationBtn:function(){
        // if (wxGame.Global.gameInfo.revocation > 0) {
        //     // if (wxGame.Global.isLastOperation) {
        //         wxGame.NotificationCenter.trigger(wxGame.EventType.RECOVER_LAST_OPERATION);
        //         wxGame.Global.gameInfo.revocation--;
        //         wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_REVOCATION_PROP);
        //
        //     // }else {
        //     //     wxGame.GlobalFuncs.showToast("使用道具失败~");
        //     // }
        //
        // }else {
        //     wxGame.GlobalFuncs.showToast("使用道具失败~");
        // }

        if (wxGame.shareConfig.undo.useMethod == "share") {
            wxGame.shareManager.sharePoint("967");
            tywx.BiLog.clickStat(wxGame.biManager.clickUndo, ["share"]);
        }else {
            wxGame.wxAdManager.showRewardVideo(this.onUndoAdSuccess.bind(this),this.onUndoAdFail.bind(this));
            tywx.BiLog.clickStat(wxGame.biManager.clickUndo, ["video"]);
        }
    },

    onUndoAdSuccess:function(isEnd){
        if (isEnd){
            wxGame.NotificationCenter.trigger(wxGame.EventType.RECOVER_LAST_OPERATION);
            wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_REVOCATION_PROP);
        }else {
            wxGame.GlobalFuncs.showToast("观看完整视频,才可获得奖励");
        }
        wxGame.wxBannerAd.createBannerAd();
    },

    onUndoAdFail:function(){
        wxGame.GlobalFuncs.showToast("激励视频已达上限!");
        wxGame.wxBannerAd.createBannerAd();
        if (wxGame.Global.isBringVersion) {
            return
        }
        wxGame.shareManager.sharePoint("967");
    },

    updateShareState:function(){
        if (wxGame.Global.sharePoint == "967") {
            wxGame.LOGW("file = [bottom] fun = [updateShareState] ");
            var resultType = wxGame.shareManager.resultType;
            switch (resultType) {
                case 1:
                    wxGame.GlobalFuncs.showToast("分享到群才有效哦~");
                    break;
                case 2:
                    wxGame.GlobalFuncs.showToast("这个群今天已经打扰过了哦~");
                    break;
                case 3:
                    wxGame.NotificationCenter.trigger(wxGame.EventType.RECOVER_LAST_OPERATION);
                    wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_REVOCATION_PROP);
                    break;
                case 6:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
                default:
                    wxGame.GlobalFuncs.showToast("分享失败!");
                    break;
            }
            wxGame.shareManager.resultType = 0;
        }
    },

    onClickBgBtn:function(){
        this.hideCardBag();
    },

    //获得道具卡
    getPropCard:function(index){
        var that = this;
        if (this.kapaiAni) {
            this.kapaiAni.x = 0;
            this.kapaiAni.y = this.node.height/1.8;
            var com = this.kapaiAni.getComponent("kapai");
            com.moveToTarget(index,that.changeBtn.x,that.changeBtn.y,0,that.kapaiAni.y);
        }else {
            cc.loader.loadRes('prefab/kapaiAni', function (err, prefab) {
                if (prefab) {
                    that.kapaiAni = cc.instantiate(prefab);
                    that.kapaiAni.x = 0;
                    that.kapaiAni.y = that.node.height/1.8;
                    that.node.addChild(that.kapaiAni,1003);
                    var com = that.kapaiAni.getComponent("kapai");
                    com.moveToTarget(index,that.changeBtn.x,that.changeBtn.y,0,that.kapaiAni.y);
                }
            });
        }
    },

    //道具卡包动画
    propCardBagAni:function(){
        var that = this;
        if (!that.daojubao) {
            cc.loader.loadRes('animation/daojubao', function (err, prefab) {
                that.daojubao = cc.instantiate(prefab);
                that.daojubao.x = that.changeBtn.x;
                that.daojubao.y = that.changeBtn.y;
                that.node.addChild(that.daojubao,1003);
                var ani = that.daojubao.getComponent(cc.Animation);
                var anim = ani.getAnimationState("daojubao");
                anim.once("finished",function(){
                    that.daojubao.active = false;
                })
                anim.play();
            });
        }else {
            that.daojubao.active = true;
            var ani = that.daojubao.getComponent(cc.Animation);
            var anim = ani.getAnimationState("daojubao");
            anim.once("finished",function(){
                that.daojubao.active = false;
            })
            anim.play();
        }
    },

    onDestroy:function () {
        wxGame.NotificationCenter.ignoreScope(this);
        wxGame.wxBannerAd.destroyBannerAd();
    }

    // update (dt) {},
});
