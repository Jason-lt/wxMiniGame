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
        tipsLabel:cc.Label,
    },

    onLoad:function(){

    },

    // 1看视频  2概率看视频
    setType:function(type){
        this.rewardType = 1;  //1看视频, 2分享
        if (type == 1){
            this.tipsLabel.string = "欣赏视频可以消除最上方一行";
        }else if (type == 2){
            if (Math.random() <= Global.probabilityVideo.bomb) {
                //看视频
                this.tipsLabel.string = "欣赏视频可以消除最上方一行";
            }else {
                this.rewardType = 2;
                this.tipsLabel.string = "分享到群可以消除最上方一行";
            }
        }
    },

    onClickSureBtn:function(){
        // if     
    },
    
    // update (dt) {},
});
