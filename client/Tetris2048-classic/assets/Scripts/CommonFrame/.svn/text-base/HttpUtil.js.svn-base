/**
 * Created by xiaochuntian on 2018/5/2.
 */

tywx.HttpUtil = {
    httpPost:function (cfgObj,httpType) {
        if(tywx.IsWechatPlatform()) {
            wx.request({
                url : cfgObj.url,
                data : cfgObj.postData,
                header : cfgObj.header,
                method : httpType,
                dataType : 'json',
                success : function (res) {
                    console.log(res);
                    if (res.statusCode == 200){
                        //正常连接{"/api/bilog5/clientlog": "ok"}
                        if (res.data && res.data.hasOwnProperty('/api/bilog5/clientlog')
                            && res.data['/api/bilog5/clientlog'] == "ok") {
                            tywx.LOGD('ty.HttpUtil.httpPost', 'post success! ');
                        }
                    }
                    else{
                        tywx.LOGD('ty.HttpUtil.httpPost', 'statusCode:' + res.statusCode);
                    }
                },
                fail : function (res) {
                    console.log(res);
                    tywx.LOGD('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
                }
            });
        }
    }
};