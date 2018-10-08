#!/bin/bash

echo "Begin copy game.json to build/wechatgame/game.json ..."
cp -r game.json build/wechatgame/game.json
echo "Copy cocos2d-js completed!"

echo "Begin copy openDataContext to build/openDataContext ..."
cp -r openDataContext build/wechatgame/src
echo "Copy openDataContext completed!"

echo "Begin copy cocos2d-js to build/cocos2d-js ..."
cp -r cocos2d-js-min.js build/cocos2d-js-min.js
echo "Copy cocos2d-js completed!"
