/**
 * Created by xiaochuntian on 2018/5/2.
 */


tywx.Util = {
    createUUID: function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    },

    getLocalUUID: function() {
        var local_uuid = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
        if (!local_uuid){
            local_uuid = tywx.Util.createUUID();
            tywx.Util.setItemToLocalStorage("LOCAL_UUID_KEY", local_uuid)
        }
        return local_uuid;
    },

    getItemFromLocalStorage: function(keyStr, defaultValue) {
        if(!cc.sys.localStorage.getItem) {
            return def_value;
        }
        var tmp = cc.sys.localStorage.getItem(keyStr);
        if (!tmp) {
            return defaultValue;
        }
        return String(tmp);
    },

    setItemToLocalStorage: function(keyStr, ValueStr) {
        try{
            cc.sys.localStorage.setItem(keyStr, ValueStr+"");
        } catch(e) {
            tywx.LOGE("tywx.Util", "setItemToLocalStorage fail");
        }
    }
};
