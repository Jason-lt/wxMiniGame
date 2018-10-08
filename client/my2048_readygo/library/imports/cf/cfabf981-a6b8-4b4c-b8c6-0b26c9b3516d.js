"use strict";
cc._RF.push(module, 'cfabfmBprhLTLjGCybJs1Ft', 'TitleItem');
// Scripts/ui/TitleItem.js

'use strict';

var ThirdAPI = require('../common/ThirdAPI');

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Sprite
        },
        title: {
            default: null,
            type: cc.Label
        },
        description: {
            default: null,
            type: cc.Label
        },
        button: {
            default: null,
            type: cc.Node
        },
        // 达成条件
        price: 0,
        // 奖励
        reward: 0,
        // 达成日期
        date: '',
        // 成就类型
        // 1 单局分数达到n
        // 2 解锁皮肤达到n个
        // 3 解锁成就达到n个
        titleType: 1,
        index: 0,
        // 此皮肤是否已经拥有
        isHave: false
    },

    onLoad: function onLoad() {
        this.button.on('click', this.onButton, this);
        this.isHave = false;
        //this.reward = 0;

        this.button.getComponent(cc.Button).interactable = false;
        this.button.getChildByName("price").getComponent(cc.Label).string = "未达成";
    },


    // 设置名字
    setTitle: function setTitle(title) {
        this.title.string = title;
    },

    // 设置描述
    setDescription: function setDescription(description) {
        this.description.string = description;
    },

    // 更新状态，如果可以解锁，返回true
    updateState: function updateState(titleType) {
        if (this.isHave) return false;
        if (titleType != this.titleType) return false;

        if (this.titleType == 1) {
            // 可以购买
            if (this.price <= Global.titleMaxScore) {
                this.button.getComponent(cc.Button).interactable = true;
                this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
                return true;
            }
            // 不可以购买
            else {
                    this.button.getComponent(cc.Button).interactable = false;
                    this.button.getChildByName("price").getComponent(cc.Label).string = "未达成";
                    return false;
                }
        } else if (this.titleType == 2) {
            // 可以购买
            if (this.price <= Global.storeData.length) {
                this.button.getComponent(cc.Button).interactable = true;
                this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
                return true;
            }
            // 不可以购买
            else {
                    this.button.getComponent(cc.Button).interactable = false;
                    this.button.getChildByName("price").getComponent(cc.Label).string = "未达成";
                    return false;
                }
        } else if (this.titleType == 3) {
            //console.log('解锁第三种道具', this.price, Global.titleData.length);
            // 可以购买
            if (this.price <= Global.titleData.length) {
                this.button.getComponent(cc.Button).interactable = true;
                this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
                return true;
            }
            // 不可以购买
            else {
                    this.button.getComponent(cc.Button).interactable = false;
                    this.button.getChildByName("price").getComponent(cc.Label).string = "未达成";
                    return false;
                }
        }
    },

    // 设置为达成未解锁
    setUnlock: function setUnlock() {
        if (this.isHave) return;

        this.button.getComponent(cc.Button).interactable = true;
        this.button.getChildByName("price").getComponent(cc.Label).string = "领取";
    },

    // 设置成就类型
    setTitleType: function setTitleType(titleType) {
        this.titleType = titleType;
    },

    // 设置数值
    setPrice: function setPrice(price) {
        this.price = price;
    },

    // 奖励
    setReward: function setReward(reward) {
        this.reward = reward;
        //console.log('奖励星星个数：', this.reward);
    },

    // 设置日期
    setDate: function setDate(date) {
        this.date = date;
    },

    // 设置是否拥有
    setIsHave: function setIsHave() {
        this.isHave = true;
        this.button.getComponent(cc.Button).interactable = true;
        this.button.getChildByName("price").getComponent(cc.Label).string = "查看";
    },

    // 按钮回调：购买
    onButton: function onButton() {
        Global.game.playSound('btn', 0.1);
        if (!this.isHave) {
            this.isHave = true;
            var repeat = false;
            for (var i = 0; i < Global.titleData.length; i++) {
                if (this.index == Global.titleData[i]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                Global.titleData.push(this.index);
                ThirdAPI.saveInfo('title', Global.titleData);

                var d = new Date(Date.now());
                this.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                Global.titleDateData.push(this.date);
                ThirdAPI.saveInfo('title-date', Global.titleDateData);
                //console.log('get title date : ' ,this.date);

                Global.titleUI.updateLabelComplete();
            }

            this.button.getChildByName("price").getComponent(cc.Label).string = "查看";

            if (Global.titleUI) Global.titleUI.updateItemsState(3);

            // 查看
            //console.log('查看成就：', this.index);
            Global.game.showTitleInfoWindow();
            if (Global.titleInfoUI) {
                //console.log('奖励星星个数：', this.reward);
                Global.titleInfoUI.initData(this.title.string, this.description.string, this.reward + '个星星', this.date);
                Global.titleInfoUI.addPropScore(this.reward);
            }
        } else {
            // 查看
            //console.log('查看成就：', this.index);
            Global.game.showTitleInfoWindow();
            if (Global.titleInfoUI) {
                //console.log('奖励星星个数：', this.reward);
                Global.titleInfoUI.initData(this.title.string, this.description.string, this.reward + '个星星', this.date);
            }
        }
    }

    // update (dt) {},
});

cc._RF.pop();