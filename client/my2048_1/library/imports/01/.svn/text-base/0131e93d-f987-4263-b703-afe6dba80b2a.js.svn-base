"use strict";
cc._RF.push(module, '0131ek9+YdCY7cDr+bbqAsq', 'chooseNum');
// Scripts/ui/chooseNum.js

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

var ThirdAPI = require('../common/ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        gridControllerScript: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.gridControllerScript = Global.gridController.getComponent("gridController");
    },


    choose2: function choose2() {
        this.gridControllerScript.randomScore = 2;
        //this.gridControllerScript.createItem2();
        this.gridControllerScript.setSoonGrid(2);
        this.updateData();
        this.gridControllerScript.hideChooseNum();
        //记载使用万能道具打点
        this.biManager();
    },
    choose4: function choose4() {
        this.gridControllerScript.randomScore = 4;
        //this.gridControllerScript.createItem2();
        this.gridControllerScript.setSoonGrid(4);
        this.updateData();
        this.gridControllerScript.hideChooseNum();
        //记载使用万能道具打点
        this.biManager();
    },
    choose8: function choose8() {
        this.gridControllerScript.randomScore = 8;
        //this.gridControllerScript.createItem2();
        this.gridControllerScript.setSoonGrid(8);
        this.updateData();
        this.gridControllerScript.hideChooseNum();
        //记载使用万能道具打点
        this.biManager();
    },
    choose16: function choose16() {
        this.gridControllerScript.randomScore = 16;
        //this.gridControllerScript.createItem2();
        this.gridControllerScript.setSoonGrid(16);
        this.updateData();
        this.gridControllerScript.hideChooseNum();
        //记载使用万能道具打点
        this.biManager();
    },
    choose32: function choose32() {
        this.gridControllerScript.randomScore = 32;
        //this.gridControllerScript.createItem2();
        this.gridControllerScript.setSoonGrid(32);
        this.updateData();
        this.gridControllerScript.hideChooseNum();
        //记载使用万能道具打点
        this.biManager();
    },
    choose64: function choose64() {
        this.gridControllerScript.randomScore = 64;
        //this.gridControllerScript.createItem2();
        this.gridControllerScript.setSoonGrid(64);
        this.updateData();
        this.gridControllerScript.hideChooseNum();
        //记载使用万能道具打点
        this.biManager();
    },

    close: function close() {
        this.gridControllerScript.hideChooseNum();
        if (Global.isPropGuide && this.gridControllerScript) {
            this.gridControllerScript.process();
        }
    },

    //更新数据
    updateData: function updateData() {
        if (!Global.isPropGuide) {
            this.gridControllerScript.useSuperTimes++;
            Global.gameinfo.superPropNum--;
        } else {
            this.gridControllerScript.createDownGrid();
            this.gridControllerScript.setSoonGrid();
            this.gridControllerScript.process();
            Global.isPropGuide = false;
        }
        this.gridControllerScript.setPropSprite();
        ThirdAPI.saveFriendGenStoneInfo(Global.gameinfo);
    },

    //使用万能道具打点
    biManager: function biManager() {
        //记载使用万能道具打点
        var biManager = require('biManager');
        biManager.bilog(biManager.useSuperProp, null);
    }
});

cc._RF.pop();