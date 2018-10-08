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
        propCard:cc.Sprite,
        propCardSpriteFrame:[cc.SpriteFrame],

    },

    onLoad:function(){
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_huode');
        var that = this;
        that.isAction = true;
        anim.once("finished", function () {
            that.isAction = false;
        });

        anim.play();
        tywx.Timer.setTimer(that, that.onClose.bind(that), 1.5);
    },

    setPropCard:function(index){
        this.propIndex = index;
        if (this.propCardSpriteFrame[index]) {
            this.propCard.spriteFrame = this.propCardSpriteFrame[index];
        }
        switch (index) {
            case 0:     //炸弹道具
                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_GET_PROP,index);
                break;
            case 1:     //万能牌
                wxGame.NotificationCenter.trigger(wxGame.EventType.UPDATE_GET_PROP,index);
                break;
            case 2:    //交换道具

                break;
        }
    },

    onClose:function(){
        if (this.isAction) {
            return
        }

        if (this.propIndex != null){
            wxGame.NotificationCenter.trigger(wxGame.EventType.GET_PROP_CARD_ANI,this.propIndex);
        }

        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('2048_huode');
        anim.stop();
        tywx.Timer.cancelTimer(this,function(){});
        this.node.destroy();

    },

    // update (dt) {},
});
