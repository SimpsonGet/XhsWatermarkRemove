# XhsWatermarkRemove
frida脚本实现小红书保存图片不加水印

使用该脚本前还需要常规hook  libmsaoaidsec.so 的相关操作（x红薯也是采用的这个so文件检测frida）

+ 本脚本不包含该部分代码



该脚本通过hook相关的可以android加水印的api跟踪x红薯加水印的操作：

x红薯水印分成两块内容（logo水印+文字水印）

![image-20250627093030967](https://github.com/user-attachments/assets/7c9e5a4e-f2b7-4c78-adb6-568f560dc698)


去水印的方式也采取了两种

1、构造透明bitmap伪造原始水印覆盖到原始图片上

✅优点：对原始的app操作流程改动较小，可以和原来方式保存在相册

2、hook获得原始图片，保存在自定义路径（目前保存在sdcard目录下）

✅优点：直接获得了原始图片
