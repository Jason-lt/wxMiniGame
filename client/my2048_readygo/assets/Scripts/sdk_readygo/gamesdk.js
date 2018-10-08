
import dataStatistics from './lib/dataStatistics.js';
import game from './lib/game.js';
import coinsdk from './lib/coinsdk.js';
import config from './lib/config';
import track from './lib/track.js';

export default new class gameSdk {
   constructor()
   {
       this.dataStatistics = dataStatistics;
       this.game = game;
       this.coin = coinsdk;
       this.config = config;
       this.track = track;
   }
}