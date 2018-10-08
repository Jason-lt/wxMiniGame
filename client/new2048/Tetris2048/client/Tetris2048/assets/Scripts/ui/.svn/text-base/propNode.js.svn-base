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
        selectBg:cc.Node,
        propName:cc.Label,
        propType:"",
    },

    onLoad:function(){
        this.selectBg.active = false;
        this.updatePropName();
        listenUtil.eventCtrl.addListen('initPropData', this.initPropData.bind(this));
        listenUtil.eventCtrl.addListen('turnTableGetReward', this.getRewardQni.bind(this));
    },

    initPropData:function(){
        this.setSelect(false);
    },

    setSelect:function(isSelect){
        this.selectBg.active = isSelect;
        if (isSelect) {
            var action = cc.blink(0.5, 2);
            this.selectBg.runAction(action);
        }
    },
    
    updatePropName:function(){
        for (var key in Global.turnTableConfig){
            if (key && key == this.propType){
                // "clear":{"number":2,"probability":0.45,"name":"锤锤"},
                this.propName.string = Global.turnTableConfig[key].name + "x" + Global.turnTableConfig[key].number;
            }
        }
    },

    getRewardQni:function(name){
        if (name == this.propType) {
            this.setSelect(true);
        }
    },


    onDestroy:function(){
        listenUtil.eventCtrl.removeListen('initPropData', this.initPropData.bind(this));
        listenUtil.eventCtrl.removeListen('turnTableGetReward', this.getRewardQni.bind(this));
    },


    // update (dt) {},
});
