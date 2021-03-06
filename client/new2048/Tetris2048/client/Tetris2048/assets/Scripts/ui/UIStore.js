let ThirdAPI = require('../common/ThirdAPI')
var loadAtlas = require("LoadAtlas")

cc.Class({
    extends: cc.Component,

    properties: {
        // content 节点，商品列表Content
        content: {
            default: null,
            type: cc.Node
        },
        // buttonClose 节点，关闭商店
        buttonClose: {
            default: null,
            type: cc.Node
        },
        // 商品项
        storeitemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        // 提示信息
        tipbox: {
            default: null,
            type: cc.Node,
        },
        // 道具分数
        propScore: {
            default: null,
            type: cc.Label
        },
        arrItems: [],
        itemWidth: 260,
        itemHeight: 260,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start:function() {
        // 注册按钮
        this.buttonClose.on('click', this.onClose, this);
        this.initStoreList();
        this.initStore();
    },

    // 显示提示框
    showTipbox: function (text) {
        this.tipbox.active = true;
        this.tipbox.getChildByName("text").getComponent(cc.Label).string = text;
    },

    onTipButton: function () {
        this.tipbox.active = false;
    },

    // 初始化商店
    initData: function () {
        // 道具分数
        //console.log('钻石分：', Global.wxGold);
        this.propScore.string = Global.wxGold;
        this.initStore();
        this.updateStoreItemsState();
    },

    // 初始化商店
    initStore: function () {

        // 将默认皮肤标记为已经拥有
        if (this.arrItems[0]) {
            this.arrItems[0].getComponent('StoreItem').setIsHave();
        }

        Global.storeData = ThirdAPI.loadInfo('skinstore');
        // 使用已购商品数据标记已经拥有商品
        console.log("已购商品列表", Global.storeData);
        for (let i = 0; i < Global.storeData.length; i++) {
            var data = Global.storeData[i];
            var wareType = Math.floor(data / 100);
            var wareIndex = data % 100;
            console.log("已购商品 type:" + wareType + "index:" + wareIndex);
            if (wareType == 1) {
                if ( this.arrItems[wareIndex]) {
                    this.arrItems[wareIndex].getComponent('StoreItem').setIsHave();
                }
                //console.log('将已购商品标记出来');
            }
        }

        // 使用当前索引标记当前皮肤
        if (this.arrItems[Global.skinIndex]) {
            this.arrItems[Global.skinIndex].getComponent('StoreItem').setCurrent(true);
        }

    },

    // 初始化商店列表
    initStoreList: function () {
        var skinArray = [];
        skinArray.push({
            type: 1,
            name: "数字",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin1'),
            price: 0
        });
        skinArray.push({
            type: 1,
            name: "富豪",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin2'),
            price: 50
        });
        skinArray.push({
            type: 1,
            name: "甄嬛传",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin3'),
            price: 150
        });
        skinArray.push({
            type: 1,
            name: "脑残版",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin4'),
            price: 300
        });
        skinArray.push({
            type: 1,
            name: "扑克版",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/skins', 'skin5'),
            price: 500
        });
        skinArray.push({
            type: 1,
            name: "复仇版",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin5'),
            price: 850
        });
        skinArray.push({
            type: 1,
            name: "传统佳节版",
            photo: loadAtlas.getSpriteFrameFromName('textures/gridItem/skin7', 'skin7'),
            price: "活动领取"
        });

        this.content.removeAllChildren();
        for (let index = 0; index < skinArray.length; index++) {
            var item = cc.instantiate(this.storeitemPrefab);
            item.getComponent('StoreItem').setPhoto(skinArray[index].photo);
            item.getComponent('StoreItem').setWareType(skinArray[index].type);
            item.getComponent('StoreItem').setPrice(skinArray[index].price);
            item.getComponent('StoreItem').setName(skinArray[index].name);
            this.setStoreItemPos(item, index);
            item.getComponent('StoreItem').index = index;
            item.getComponent('StoreItem').setCurrent(index == Global.skinIndex);
            this.content.addChild(item);

            this.arrItems.push(item);
        }
        this.content.height = Math.ceil(skinArray.length / 2) * this.itemHeight;
    },

    // 更新列表商品状态（是否可以购买）
    updateStoreItemsState: function () {
        var list = this.arrItems;
        for (let index = 0; index < list.length; index++) {
            list[index].getComponent('StoreItem').updateState();
        }
    },

    // 设置为当前
    setCurrentItem: function (itemCurrent) {
        for (let index = 0; index < this.arrItems.length; index++) {
            var item = this.arrItems[index];
            if (item != itemCurrent) {
                item.getComponent('StoreItem').setCurrent(false);
            }
        }
    },

    // 根据索引设置商品的位置（双排布局）
    setStoreItemPos: function (item, index) {
        if (index % 2 == 0) {
            item.setPosition(cc.p(-this.itemWidth / 2, -(Math.floor(index / 2) + 1 / 2) * this.itemHeight));
        } else {
            item.setPosition(cc.p(this.itemWidth / 2, -(Math.floor(index / 2) + 1 / 2) * this.itemHeight));
        }
    },

    // 按钮回调：关闭
    onClose: function () {
        Global.game.playSound('btn', 0.1);
        //console.log("关闭商店");

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
        ctr.addGuide.show();
        ThirdAPI.showGameClub(true);
    },

    // update (dt) {},
});