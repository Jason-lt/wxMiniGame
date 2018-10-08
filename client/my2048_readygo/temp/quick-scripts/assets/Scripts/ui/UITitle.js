(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ui/UITitle.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9a2e31K6eJJqZ0x+7kyGj7s', 'UITitle', __filename);
// Scripts/ui/UITitle.js

'use strict';

var ThirdAPI = require('../common/ThirdAPI');
var loadAtlas = require("LoadAtlas");

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
        // 成就项
        titleitemPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 完成数量标签
        labelComplete: {
            default: null,
            type: cc.Label
        },
        arrItems: [],
        itemHeight: 100
    },

    // LIFE-CYCLE CALLBACKS:

    // start () {},

    onLoad: function onLoad() {
        // 注册按钮
        this.buttonClose.on('click', this.onClose, this);

        this.initStoreList();
    },


    // 初始化商店
    initData: function initData() {
        this.initStore();
    },

    // 初始化商店
    initStore: function initStore() {

        // 使用已达成但是未解锁成就列表标记商品
        for (var i = 0; i < Global.titleUnlockData.length; i++) {
            var index = Global.titleUnlockData[i];
            this.arrItems[index].getComponent('TitleItem').setUnlock();
        }
        //console.log('是否有未解锁', Global.titleUnlockData.length);
        if (Global.titleUnlockData.length > Global.titleData.length) {}
        //console.log('红点显示');
        //Global.uiScript.startUI.getComponent('startUI').showRedDot(true);


        // 使用已购商品数据标记已经拥有商品
        for (var i = 0; i < Global.titleData.length; i++) {
            var index = Global.titleData[i];
            this.arrItems[index].getComponent('TitleItem').setIsHave();
            this.arrItems[index].getComponent('TitleItem').setDate(Global.titleDateData[i]);
        }
        this.updateLabelComplete();
        //console.log('初始化列表数据');
    },

    // 初始化商店列表
    initStoreList: function initStoreList() {
        var titleArray = [];

        titleArray.push({ type: 1, name: "分数小白", description: "单局得分达到", price: 2000, reward: 2 });
        titleArray.push({ type: 1, name: "分数菜鸟", description: "单局得分达到", price: 5000, reward: 4 });
        titleArray.push({ type: 1, name: "分数达人", description: "单局得分达到", price: 8000, reward: 8 });
        titleArray.push({ type: 1, name: "分数高手", description: "单局得分达到", price: 10000, reward: 16 });
        titleArray.push({ type: 1, name: "分数大师", description: "单局得分达到", price: 15000, reward: 32 });
        titleArray.push({ type: 1, name: "分数王者", description: "单局得分达到", price: 20000, reward: 64 });

        titleArray.push({ type: 2, name: "皮肤小白", description: "皮肤解锁达到", price: 1, reward: 1 });
        titleArray.push({ type: 2, name: "皮肤菜鸟", description: "皮肤解锁达到", price: 3, reward: 5 });
        titleArray.push({ type: 2, name: "皮肤达人", description: "皮肤解锁达到", price: 8, reward: 8 });
        titleArray.push({ type: 2, name: "皮肤高手", description: "皮肤解锁达到", price: 10, reward: 10 });
        titleArray.push({ type: 2, name: "皮肤大师", description: "皮肤解锁达到", price: 15, reward: 18 });
        titleArray.push({ type: 2, name: "皮肤王者", description: "皮肤解锁达到", price: 20, reward: 20 });

        titleArray.push({ type: 3, name: "成就小白", description: "成就解锁达到", price: 1, reward: 5 });
        titleArray.push({ type: 3, name: "成就达人", description: "成就解锁达到", price: 5, reward: 10 });
        titleArray.push({ type: 3, name: "成就王者", description: "成就解锁达到", price: 15, reward: 20 });

        /*
        titleArray.push('分数菜鸟');
        titleArray.push('分数达人');
        titleArray.push('分数高手');
        titleArray.push('分数大师');
        titleArray.push('分数王者');
         titleArray.push('皮肤小白');
        titleArray.push('皮肤菜鸟');
        titleArray.push('皮肤达人');
        titleArray.push('皮肤高手');
        titleArray.push('皮肤大师');
        titleArray.push('皮肤王者');
         titleArray.push('成就小白');
        titleArray.push('成就达人');
        titleArray.push('成就王者');*/

        for (var index = 0; index < titleArray.length; index++) {
            var item = cc.instantiate(this.titleitemPrefab);
            /*
            if (index <= 5) {
                item.getComponent('TitleItem').setTitleType(1);
                item.getComponent('TitleItem').setDescription('单局得分达到' + (index+1) * 1000);
                item.getComponent('TitleItem').setPrice((index+1) * 1000);
            }
            else if (index <= 11) {
                item.getComponent('TitleItem').setTitleType(2);
                item.getComponent('TitleItem').setDescription('皮肤解锁达到' + (index-5));
                item.getComponent('TitleItem').setPrice(index-5);
            }
            else if (index <= 17) {
                item.getComponent('TitleItem').setTitleType(3);
                item.getComponent('TitleItem').setDescription('成就解锁达到' + (index-11)*4);
                item.getComponent('TitleItem').setPrice((index-11)*4);
            }
            */

            item.getComponent('TitleItem').setTitle(titleArray[index].name);
            item.getComponent('TitleItem').setTitleType(titleArray[index].type);
            item.getComponent('TitleItem').setDescription(titleArray[index].description + titleArray[index].price);
            item.getComponent('TitleItem').setPrice(titleArray[index].price);
            item.getComponent('TitleItem').setReward(titleArray[index].reward);
            item.getComponent('TitleItem').index = index;
            item.setPosition(0, -1 * (index + 0.5) * this.itemHeight);

            this.content.addChild(item);
            this.arrItems.push(item);
        }
        this.content.height = titleArray.length * this.itemHeight;
    },

    // 更新完成数量
    updateLabelComplete: function updateLabelComplete() {
        this.labelComplete.string = '完成数量' + Global.titleData.length + '/' + this.arrItems.length;
    },

    // 更新列表成就状态（是否可以解锁）
    updateItemsState: function updateItemsState(titleType) {
        //console.log('解锁通知');
        var list = this.arrItems;
        var updateCount = 0;
        for (var index = 0; index < list.length; index++) {
            if (list[index].getComponent('TitleItem').updateState(titleType)) {
                updateCount++;

                var repeat = false;
                for (var i = 0; i < Global.titleUnlockData.length; i++) {
                    if (index == Global.titleUnlockData[i]) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    Global.titleUnlockData.push(index);
                    ThirdAPI.saveInfo('title-unlock', Global.titleUnlockData);
                }
            }
        }

        if (updateCount > 0) {
            // 通知有可以解锁的成就
            //console.log('通知有可以解锁的成就', updateCount);
            //Global.uiScript.startUI.getComponent('startUI').showRedDot(true);
        } else {
                //Global.uiScript.startUI.getComponent('startUI').showRedDot(false);
            }
    },

    // 按钮回调：关闭
    onClose: function onClose() {
        Global.game.playSound('btn', 0.1);
        //console.log("关闭成就");

        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
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
        //# sourceMappingURL=UITitle.js.map
        