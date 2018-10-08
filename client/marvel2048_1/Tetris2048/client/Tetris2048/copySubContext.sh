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