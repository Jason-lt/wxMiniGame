# -*- coding: utf-8 -*-
import os;
import shutil;

srcFolder ="./build/wechatgame/src"
srcOutFolder="./buildwx/src"
resFolder ="./build/wechatgame/res"
resOutFolder="./buildwx/res"

#移除文件夹
def removeFodler(folderPath):
    print(folderPath)
    if (os.path.exists(folderPath)):
        shutil.rmtree(folderPath, onerror=readonly_handler)

def readonly_handler(func, path, execinfo):
    os.chmod(path, 128)  # or os.chmod(path, stat.S_IWRITE) from "stat" module
    func(path)

#拷贝文件夹
def copyFodler(srcFolder, destFodler):
    if(os.path.exists(srcFolder)):
        shutil.copytree(srcFolder, destFodler)
    print(srcFolder)

def replaceFolder(srcFolder,destFolder):
    removeFodler(destFolder)
    copyFodler(srcFolder, destFolder)
if __name__ == '__main__':
#移除之前的输出目录
#拷贝现在的文件夹到输出目录
    replaceFolder(srcFolder,srcOutFolder)
    replaceFolder(resFolder,resOutFolder)
    print("done")