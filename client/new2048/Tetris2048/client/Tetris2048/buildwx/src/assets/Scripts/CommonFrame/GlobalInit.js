tywx={StateInfo:{networkConnected:!0,networkType:"none",isOnForeground:!0},SystemInfo:{clientId:"H5_2.0_weixin.weixin.0-hall301.weixin.sxnew2048",intClientId:23142,cloudId:30,version:2,webSocketUrl:"ws://192.168.10.88/",loginUrl:"https://xyxsx.nalrer.cn/",shareManagerUrl:"https://market.touch4.me/",deviceId:"wechatGame",wxAppId:"wxbb777fbea1e15f52",appId:10894,gameId:301,hall_version:"hall37",cdnPath:"https://richqn.nalrer.cn/dizhu/",remotePackPath:"remote_res/res.zip",biLogServer:"https://cbi.touch4.me/api/bilog5/text",errorLogServer:"https://clienterr.touch4.me/api/bilog5/clientlog",biJsonLogServer:"https://cbi.touch4.me/api/bilog5/report"},UserInfo:{userId:0,userName:"TuWechatGame",userPic:"",authorCode:"",systemType:0,wechatType:"6.6.1",model:"未知设备",system:"iOS 10.0.1",loc:"",scene_id:"",scene_param:"",invite_id:0,wxgame_session_key:""},LOGD:function(r,t){var n=(r=r||"tywx")+" : "+t;console.log(n)},LOGE:function(r,t){var n=(r=r||"tywx")+" : "+t;console.info(n)},IsWechatPlatform:function(){try{return wx,wx.showShareMenu(),!0}catch(r){return!1}}},function(){var o=0,c="",i=8;function u(r,t){r[t>>5]|=128<<t%32,r[14+(t+64>>>9<<4)]=t;for(var n=1732584193,e=-271733879,o=-1732584194,c=271733878,a=0;a<r.length;a+=16){var i=n,u=e,h=o,l=c;e=d(e=d(e=d(e=d(e=m(e=m(e=m(e=m(e=s(e=s(e=s(e=s(e=f(e=f(e=f(e=f(e,o=f(o,c=f(c,n=f(n,e,o,c,r[a+0],7,-680876936),e,o,r[a+1],12,-389564586),n,e,r[a+2],17,606105819),c,n,r[a+3],22,-1044525330),o=f(o,c=f(c,n=f(n,e,o,c,r[a+4],7,-176418897),e,o,r[a+5],12,1200080426),n,e,r[a+6],17,-1473231341),c,n,r[a+7],22,-45705983),o=f(o,c=f(c,n=f(n,e,o,c,r[a+8],7,1770035416),e,o,r[a+9],12,-1958414417),n,e,r[a+10],17,-42063),c,n,r[a+11],22,-1990404162),o=f(o,c=f(c,n=f(n,e,o,c,r[a+12],7,1804603682),e,o,r[a+13],12,-40341101),n,e,r[a+14],17,-1502002290),c,n,r[a+15],22,1236535329),o=s(o,c=s(c,n=s(n,e,o,c,r[a+1],5,-165796510),e,o,r[a+6],9,-1069501632),n,e,r[a+11],14,643717713),c,n,r[a+0],20,-373897302),o=s(o,c=s(c,n=s(n,e,o,c,r[a+5],5,-701558691),e,o,r[a+10],9,38016083),n,e,r[a+15],14,-660478335),c,n,r[a+4],20,-405537848),o=s(o,c=s(c,n=s(n,e,o,c,r[a+9],5,568446438),e,o,r[a+14],9,-1019803690),n,e,r[a+3],14,-187363961),c,n,r[a+8],20,1163531501),o=s(o,c=s(c,n=s(n,e,o,c,r[a+13],5,-1444681467),e,o,r[a+2],9,-51403784),n,e,r[a+7],14,1735328473),c,n,r[a+12],20,-1926607734),o=m(o,c=m(c,n=m(n,e,o,c,r[a+5],4,-378558),e,o,r[a+8],11,-2022574463),n,e,r[a+11],16,1839030562),c,n,r[a+14],23,-35309556),o=m(o,c=m(c,n=m(n,e,o,c,r[a+1],4,-1530992060),e,o,r[a+4],11,1272893353),n,e,r[a+7],16,-155497632),c,n,r[a+10],23,-1094730640),o=m(o,c=m(c,n=m(n,e,o,c,r[a+13],4,681279174),e,o,r[a+0],11,-358537222),n,e,r[a+3],16,-722521979),c,n,r[a+6],23,76029189),o=m(o,c=m(c,n=m(n,e,o,c,r[a+9],4,-640364487),e,o,r[a+12],11,-421815835),n,e,r[a+15],16,530742520),c,n,r[a+2],23,-995338651),o=d(o,c=d(c,n=d(n,e,o,c,r[a+0],6,-198630844),e,o,r[a+7],10,1126891415),n,e,r[a+14],15,-1416354905),c,n,r[a+5],21,-57434055),o=d(o,c=d(c,n=d(n,e,o,c,r[a+12],6,1700485571),e,o,r[a+3],10,-1894986606),n,e,r[a+10],15,-1051523),c,n,r[a+1],21,-2054922799),o=d(o,c=d(c,n=d(n,e,o,c,r[a+8],6,1873313359),e,o,r[a+15],10,-30611744),n,e,r[a+6],15,-1560198380),c,n,r[a+13],21,1309151649),o=d(o,c=d(c,n=d(n,e,o,c,r[a+4],6,-145523070),e,o,r[a+11],10,-1120210379),n,e,r[a+2],15,718787259),c,n,r[a+9],21,-343485551),n=g(n,i),e=g(e,u),o=g(o,h),c=g(c,l)}return Array(n,e,o,c)}function h(r,t,n,e,o,c){return g((a=g(g(t,r),g(e,c)))<<(i=o)|a>>>32-i,n);var a,i}function f(r,t,n,e,o,c,a){return h(t&n|~t&e,r,t,o,c,a)}function s(r,t,n,e,o,c,a){return h(t&e|n&~e,r,t,o,c,a)}function m(r,t,n,e,o,c,a){return h(t^n^e,r,t,o,c,a)}function d(r,t,n,e,o,c,a){return h(n^(t|~e),r,t,o,c,a)}function n(r,t){var n=l(r);16<n.length&&(n=u(n,r.length*i));for(var e=Array(16),o=Array(16),c=0;c<16;c++)e[c]=909522486^n[c],o[c]=1549556828^n[c];var a=u(e.concat(l(t)),512+t.length*i);return u(o.concat(a),640)}function g(r,t){var n=(65535&r)+(65535&t);return(r>>16)+(t>>16)+(n>>16)<<16|65535&n}function l(r){for(var t=Array(),n=(1<<i)-1,e=0;e<r.length*i;e+=i)t[e>>5]|=(r.charCodeAt(e/i)&n)<<e%32;return t}function e(r){for(var t="",n=(1<<i)-1,e=0;e<32*r.length;e+=i)t+=String.fromCharCode(r[e>>5]>>>e%32&n);return t}function a(r){for(var t=o?"0123456789ABCDEF":"0123456789abcdef",n="",e=0;e<4*r.length;e++)n+=t.charAt(r[e>>2]>>e%4*8+4&15)+t.charAt(r[e>>2]>>e%4*8&15);return n}function w(r){for(var t="",n=0;n<4*r.length;n+=3)for(var e=(r[n>>2]>>n%4*8&255)<<16|(r[n+1>>2]>>(n+1)%4*8&255)<<8|r[n+2>>2]>>(n+2)%4*8&255,o=0;o<4;o++)8*n+6*o>32*r.length?t+=c:t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>6*(3-o)&63);return t}tywx.hex_md5=function(r){return a(u(l(r),r.length*i))},tywx.b64_md5=function(r){return w(u(l(r),r.length*i))},tywx.str_md5=function(r){return e(u(l(r),r.length*i))},tywx.hex_hmac_md5=function(r,t){return a(n(r,t))},tywx.b64_hmac_md5=function(r,t){return w(n(r,t))},tywx.str_hmac_md5=function(r,t){return e(n(r,t))}}();