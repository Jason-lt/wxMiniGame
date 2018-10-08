"use strict";
cc._RF.push(module, 'a4c47PqE5hCjIciwhmBcxrv', 'StoreItem');
// Scripts/ui/StoreItem.js

"use strict";

var ThirdAPI = require('../common/ThirdAPI');
var loadAtlas = require("LoadAtlas");

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Sprite
        },
        front: {
            default: null,
            type: cc.Sprite
        },
        photo: {
            default: null,
            type: cc.Sprite
        },
        buttonBuy: {
            default: null,
            type: cc.Node
        },
        buttonState1: {
            default: null,
            type: cc.Node
        },
        buttonState2: {
            default: null,
            type: cc.Node
        },
        buttonState3: {
            default: null,
            type: cc.Node
        },

        labelname: {
            default: null,
            type: cc.Label
        },
        price: 0,
        index: 0,
        // 1, 2, 3, 4
        waretype: 1,
        // 此皮肤是否已经拥有
        isHave: false,
        // 是否为当前皮肤
        isCurrent: false
    },

    hideAll: function hideAll() {
        //this.price.string = '';
        this.photo.setVisible(false);
        this.bg.setVisible(false);
    },

    setPhoto: function setPhoto(photo) {
        this.photo.spriteFrame = photo;
    },

    setButtonState: function setButtonState(state) {
        this.buttonState1.active = false;
        this.buttonState2.active = false;
        this.buttonState3.active = false;

        if (state == 1) {
            this.buttonState1.active = true;
        } else if (state == 2) {
            this.buttonState2.active = true;
        } else if (state == 3) {
            this.buttonState3.active = true;
        }
    },

    updateState: function updateState() {
        if (this.isHave) return;

        // 可以购买
        if (this.price <= Global.wxGold) {}
        //this.buttonBuy.getComponent(cc.Button).interactable = true;

        // 不可以购买
        else {
                //this.buttonBuy.getComponent(cc.Button).interactable = false;
            }
    },

    setPrice: function setPrice(price) {
        //this.price.string = price+" 积分";
        this.buttonState1.getChildByName("text").getComponent(cc.Label).string = price;
        this.price = price;

        // 可以购买
        if (price <= Global.wxGold) {}
        //this.buttonBuy.getComponent(cc.Button).interactable = true;

        // 不可以购买
        else {
                //this.buttonBuy.getComponent(cc.Button).interactable = false;
            }
    },

    setCurrent: function setCurrent(value) {
        if (Global.storeUI == null) return;
        if (!this.isHave) return;

        //console.log("set current skin");
        this.isCurrent = value;
        //this.buttonBuy.getChildByName("price").getComponent(cc.Label).string = value ? "已拥有" : "换上";
        this.setButtonState(value ? 3 : 2);
        if (this.isCurrent) {
            if (this.waretype == 1) {
                //Global.skinBall = this.photo.spriteFrame;
                Global.storeUI.getComponent("UIStore").setCurrentItem(this.node);
                Global.skinIndex = this.index;

                ThirdAPI.saveCurrentSkin(Global.skinIndex);
            }
        }
    },

    setWareType: function setWareType(n) {
        this.waretype = n;
        this.photo.node.setContentSize(50, 50);
    },

    setIsHave: function setIsHave() {
        //this.buttonBuy.getComponent(cc.Button).interactable = true;
        this.isHave = true;
        //this.buttonBuy.getChildByName("price").getComponent(cc.Label).string = "换上";
        this.bg.spriteFrame = loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin-bg1');
        this.front.spriteFrame = loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin-front1');
        //this.zuan.node.active = false;
        this.setButtonState(2);
    },

    setName: function setName(name) {
        this.labelname.string = name;
    },

    start: function start() {
        this.buttonBuy.on('click', this.onButtonBy, this);
        //this.isHave = false;
        //this.isCurrent = false;
    },


    // 按钮回调：购买
    onButtonBy: function onButtonBy() {
        Global.game.playSound('btn', 0.1);
        //console.log('是否拥有: ', this.isHave);
        if (!this.isHave) {
            //console.log("购买:" + this.index + ", 价格:" + this.buttonBuy.getChildByName("price").getComponent(cc.Label).string);

            if (this.price <= Global.wxGold) {
                Global.storeUI.getComponent("UIStore").showTipbox('购买成功！');
            }
            // 不可以购买
            else {
                    Global.storeUI.getComponent("UIStore").showTipbox('您的钻石数量不够！');
                    return;
                }

            this.isHave = true;
            var repeat = false;
            for (var i = 0; i < Global.storeData.length; i++) {
                if (this.index + this.waretype * 100 == Global.storeData[i]) {
                    repeat = true;
                }
            }
            if (!repeat) {
                Global.storeData.push(this.index + this.waretype * 100);
                ThirdAPI.saveInfo('skinstore', Global.storeData);
            }

            Global.wxGold -= this.price;
            Global.storeUI.getComponent("UIStore").propScore.string = Global.wxGold;
            Global.game.saveScore();

            // 更新商店积分信息，和对商店商品的影响
            Global.storeUI.getComponent("UIStore").updateStoreItemsState();

            //this.buttonBuy.getChildByName("price").getComponent(cc.Label).string = "换上";


            this.bg.spriteFrame = loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin-bg1');
            this.front.spriteFrame = loadAtlas.getSpriteFrameFromName('textures/gridItem/items', 'skin-front1');
            //this.zuan.node.active = false;
            this.setButtonState(2);

            if (Global.titleUI) Global.titleUI.updateItemsState(2);
        } else {
            if (!this.isCurrent) this.setCurrent(true);
        }
    }

    // update (dt) {},
});

cc._RF.pop();