import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'
import gamesdk from './lib_gamesdk/gamesdk';

wx.showShareMenu({
    success:function(){

    }
})

wx.onShareAppMessage(function () {
    try {
        return gamesdk.dataStatistics.onShareAppMsg(
            {
                title: '被动分享',
                //imageUrl: cc.url.raw("resources/Man100Layer/texture/shareImage.b24c4.jpg"),
                imageUrl: '',
                query:'val=valval',
                success: (info) => {
                    console.log("被动转发  成功：", info);
                    let shareType = 'passive'
                    gamesdk.dataStatistics.shareSuccess(shareType)
                },
                complet: info => {
                    console.log("被动转发完成：", info);
                }
            }
        );
    }
    catch (e) {
        console.log(e);
        throw new Error("未能成功获得有效的分享信息    详细信息：", e);
    }
});




wx.onHide(res=>{
    console.log('onHide')
    gamesdk.dataStatistics.onHideInfo();
})
new Main()
