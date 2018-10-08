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
        guide_1:cc.Node,
        guide_2:cc.Node,
        guide_3:cc.Node,
        guide_4:cc.Node,
    },

    onLoad:function(){
        this.guide_1.active = true;
        this.guide_2.active = false;
        this.guide_3.active = false;
        this.guide_4.active = false;

        this.playAni();
    },

    //切一次
    playOnce:function(){
        this.guide_1.active = false;
        this.guide_2.active = true;
        this.guide_3.active = false;
        this.guide_4.active = false;
    },

    //切第二次
    playTwoce:function(){
        this.guide_1.active = false;
        this.guide_2.active = false;
        this.guide_3.active = true;
        this.guide_4.active = false;
    },

    //切第三次
    playThree:function(){
        this.guide_1.active = false;
        this.guide_2.active = false;
        this.guide_3.active = false;
        this.guide_4.active = true;
    },

    //初始
    playInit:function(){
        this.guide_1.active = true;
        this.guide_2.active = false;
        this.guide_3.active = false;
        this.guide_4.active = false;
    },

    playAni:function(){
        var that = this;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.8),cc.callFunc(that.playOnce.bind(that)),
            cc.delayTime(0.8),cc.callFunc(that.playTwoce.bind(that)),
            cc.delayTime(0.8),cc.callFunc(that.playThree.bind(that)),
            cc.delayTime(0.8),cc.callFunc(that.playInit.bind(that)))));
    },

    onClose:function(){
        this.node.stopAllActions();
        this.node.destroy();
    },


});
