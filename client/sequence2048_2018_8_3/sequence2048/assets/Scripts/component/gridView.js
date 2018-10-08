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
        coltSprite:cc.Node,
        item:null,
        kuang:cc.Node,
    },

    onLoad:function(){
        var gridInfo = wxGame.Global.gridInfo;
        this.node.setContentSize(gridInfo.width, gridInfo.height);
        wxGame.NotificationCenter.listen(wxGame.EventType.HIDE_GRID_KUANG,this.ShowKunag,this);
        wxGame.NotificationCenter.listen(wxGame.EventType.GAME_OVER_RESET,this.resetData,this);
    },

    hideColtSprite:function(isShow){
        this.coltSprite.active = isShow || false;
    },

    ShowKunag:function(isSHow,isOne){
        if (this.kuang) {
            if (this.item) {
                // this.kuang.active = false;
                this.hideColtSprite(false);
                this.kuang.active = isSHow;
                if (!isSHow) {
                    this.item.setIsGridSelect(false);
                }
            }else {
                this.kuang.active = isSHow;
            }
        }


    },

    ShowLastKuang:function(isSHow) {
        this.kuang.active = isSHow;
    },

    getRootNode:function(){
        return this.node;
    },

    setIndex:function(hIndex, vIndex, par){
        this.hIndex = hIndex;
        this.vIndex = vIndex;
        this.parent = par;
    },

    resetData:function(){

    },

});
