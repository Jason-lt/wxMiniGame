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
        cardSprite:cc.Sprite,
        cardSpriteFrame:[cc.SpriteFrame],
    },

    onLoad:function(){

    },

    moveToTarget:function(index,posx,posy,nodex,nodey){
        if (this.cardSpriteFrame[index]) {
            this.cardSprite.spriteFrame = this.cardSpriteFrame[index];
        }
        this.node.active = true;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('kapai');
        anim.play();

        var interx = posx - nodex;
        var intery = posy - nodey;
        var oncePos = cc.p(nodex+(interx/1.5) - interx/2,nodey);
        var twoPos = cc.p(posx,nodey+intery/4);
        var toPos = cc.p(posx,posy);
        var controlPoints1 = [     oncePos,     twoPos,     toPos   ];

        var bezierToDst1 = cc.bezierTo(1, controlPoints1);

        this.node.runAction(cc.sequence(bezierToDst1,cc.callFunc(this.onAniEnd.bind(this))));
    },

    onAniEnd:function(){
        wxGame.NotificationCenter.trigger(wxGame.EventType.PROP_CARD_BAG_ANI);
        this.onClose();
        this.node.active = false;
    },

    onClose:function(){
        this.node.stopAllActions();
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState('kapai');
        anim.stop();
    },

    // update (dt) {},
});
