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
        scoreNode:cc.Node,
        gridNode:cc.Node,
        bottomNode:cc.Node,
        itemPrefab:cc.Prefab,
        gridPrefab:cc.Prefab,
    },

    onLoad:function(){
        if (wxGame.GlobalFuncs.isEmptyObject(wxGame.saveGameInfo)) {
            wxGame.GlobalFuncs.greenHandUI();
        }
    },

    onClickPauseBtn:function(){
        wxGame.wxBannerAd.destroyBannerAd();
        wxGame.GlobalFuncs.showPauseUI();
    },

    // update (dt) {},
});
