#!/bin/bash

echo "Begin remove buildwx directory ..."
rm -r buildwx
echo "Remove buildwx directory completed!"

echo "Begin copy build/wechatgame to buildwx ..."
cp -r build/wechatgame buildwx
echo "Copy build/wechatgame to buildwx completed!"

echo "Begin copy openDataContext to buildwx/openDataContext ..."
cp -r openDataContext buildwx/openDataContext
echo "Copy openDataContext completed!"

echo "Begin copy cocos2d-js to buildwx/cocos2d-js ..."
cp -r cocos2d-js-min.js buildwx/cocos2d-js-min.js
echo "Copy cocos2d-js completed!"