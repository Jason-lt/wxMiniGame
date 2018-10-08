let _audioManager = {

    resource: {},
    bgm: {},
    
    init () {

    },

    regist (name,audioSource) {
        if (this.resource[name]) {
            console.log('音频资源已存在: ',name);
        }
        this.resource[name] = audioSource;
    },

    registBGM(name, audioClip) {
        if (this.bgm[name]) {
            console.log('BGM音频资源已存在: ', name);
        }
        this.bgm[name] = audioClip;
    },

    unregist(name) {
        if (this.resource[name]) {
            this.resource[name] = null;
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },

    unregistAll() {
        this.resource = {};
    },

    play(name) {
        // 微信上不能改变音量,所以只能先这么处理;
        if (this.isMute) {
            return
        }
        if (this.resource[name]) {
            this.resource[name].play();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },

    stop(name) {
        if (this.resource[name]) {
            this.resource[name].play();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },


    pause(name) {
        if (this.resource[name]) {
            this.resource[name].pause();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },

    resume(name) {
        // 微信上不能改变音量,所以只能先这么处理;
        if (this.isMute) {
            return
        }
        if (this.resource[name]) {
            this.resource[name].resume();
        } else {
            console.log('音频资源不存在: ', name);
            return;
        }
    },


    mute (isMute) {
        this.isMute = isMute;
        for (const key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].mute = isMute;
            }
        }
        if (isMute) {
            cc.audioEngine.setVolume(0);
            this.pauseAll();
        } else {
            cc.audioEngine.setVolume(1);
            this.resumeAll();
        }

    },

    stopAll() {
        for (const key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].stop();
            }
        }
    },

    pauseAll() {
        for (const key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].pause();
            }
        }
    },

    resumeAll() {
        // 微信上不能改变音量,所以只能先这么处理;
        if (this.isMute) {
            return
        }
        for (const key in this.resource) {
            if (this.resource.hasOwnProperty(key)) {
                this.resource[key].resume();
            }
        }
    },

    playBGM(name,isLoop,finishCallback) {
        console.log('playBGM', name, isLoop)
        if (this.isMute) {
            return
        }
        if (this.bgm[name]) {
            let self = this;
            this.loadRemoteSource(this.bgm[name],(audio)=>{
                console.log('current play bgm',name,audio)
                self.currentBGM = cc.audioEngine.play(audio, isLoop, 1);
                console.log('current bgm id',self.currentBGM);
                if (!isLoop) {
                    cc.audioEngine.setFinishCallback(self.currentBGM, () => {
                        self.currentBGM = null;
                        if (finishCallback) {
                            finishCallback();
                        }
                    })
                }
            })

        }
    },

    stopBGM() {
        if (typeof this.currentBGM == 'number') {
            cc.audioEngine.stop(this.currentBGM);
        }
    },

    loopBGM() {
        let list = [];
        for (const key in this.bgm) {
            if (this.bgm.hasOwnProperty(key)) {
                const name = this.bgm[key];
                list.push(key);
            }
        }
        console.log('play loop bgm',list)
        let self = this;

        let loopfunc = null;
        loopfunc = function () {
            self.loopBGMid = Math.floor(Math.random() * list.length);
            self.playBGM(list[self.loopBGMid], false, loopfunc);
            console.log('now playing :', list[self.loopBGMid])
        }
        this.loopBGMid = Math.floor(Math.random() * list.length);
        console.log('now playing :', list[self.loopBGMid])
        this.playBGM(list[self.loopBGMid], false, loopfunc);
        
    },

    loadRemoteSource(url,callback,failedCallback) {
        cc.loader.load(url, (err, audio) => {
            if (err) {
                console.log('load error', err);
                if (failedCallback) {
                    failedCallback();
                }
                return
            }
            if (callback) {
                callback(audio);
            }
        })
    },

    pauseBGM() {
        console.log('pause bgm', this.currentBGM);
        if (typeof this.currentBGM == 'number') {
            cc.audioEngine.pause(this.currentBGM);
        }
    },

    resumeBGM() {
        console.log('resume bgm', this.currentBGM);
        if (typeof this.currentBGM == 'number') {
            cc.audioEngine.resume(this.currentBGM);
        }
    },

}

module.exports = _audioManager;