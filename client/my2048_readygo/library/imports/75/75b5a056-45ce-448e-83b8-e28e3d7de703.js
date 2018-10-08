"use strict";
cc._RF.push(module, '75b5aBWRc5EjoO44o49fecD', 'gamesdk');
// Scripts/sdk_readygo/gamesdk.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dataStatistics = require('./lib/dataStatistics.js');

var _dataStatistics2 = _interopRequireDefault(_dataStatistics);

var _game = require('./lib/game.js');

var _game2 = _interopRequireDefault(_game);

var _coinsdk = require('./lib/coinsdk.js');

var _coinsdk2 = _interopRequireDefault(_coinsdk);

var _config = require('./lib/config');

var _config2 = _interopRequireDefault(_config);

var _track = require('./lib/track.js');

var _track2 = _interopRequireDefault(_track);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = new function gameSdk() {
    _classCallCheck(this, gameSdk);

    this.dataStatistics = _dataStatistics2.default;
    this.game = _game2.default;
    this.coin = _coinsdk2.default;
    this.config = _config2.default;
    this.track = _track2.default;
}();
module.exports = exports['default'];

cc._RF.pop();