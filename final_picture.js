const Canvas = Java.use("android.graphics.Canvas");
const Rect = Java.use("android.graphics.Rect");
const Config = Java.use("android.graphics.Bitmap$Config");
const Bitmap = Java.use("android.graphics.Bitmap");
const FileOutputStream = Java.use("java.io.FileOutputStream");
const File = Java.use("java.io.File");
const CompressFormat = Java.use("android.graphics.Bitmap$CompressFormat");

//1、dump形式1将bitmap以png的格式保存在sdcard中
function dumpBitmap(bitmap, name) {
    try {
        const file = File.$new("/sdcard/" + name + ".png");
        const out = FileOutputStream.$new(file);
        bitmap.compress(CompressFormat.PNG.value, 100, out);
        out.close();
        console.log(`[*] Bitmap dumped: ${file.getAbsolutePath()}`);
    } catch (e) {
        console.error("Bitmap dump failed:", e);
    }
}

function hook_picture(){
    Java.perform(function () {
        //水印2文字去除
        try {
            Canvas.drawText.overload(
                "java.lang.String", "float", "float", "android.graphics.Paint"
            ).implementation = function (text, x, y, paint) {
                console.log("[*] Canvas.drawText() called with text: " + text);
                console.log("[*] Canvas.drawText() called with x, y: " + x + "   " + y);
                if (text.toLowerCase().includes("小红书") || text.toLowerCase().includes("xhs")) {
                    console.warn(">>>>> Suspected watermark text found!");
                }
                //将原有的 text（小红书号:xxxxx)替换为空
                return this.drawText('', x, y, paint);
            };
        } catch (e) {
            console.error("[!] Error hooking Canvas.drawText:", e);
        }

        //水印1logo去除
        var count = 0;
        Canvas.drawBitmap.overload(
            "android.graphics.Bitmap", "android.graphics.Rect", "android.graphics.Rect", "android.graphics.Paint"
        ).implementation = function (bitmap, srcRect, dstRect, paint) {
            logBitmap(bitmap, "Rect/Rect");
            // count++
            // dumpBitmap(bitmap, `rect${count}`)
            const width = bitmap.getWidth();
            const height = bitmap.getHeight();

            // console.log(width + "   " + height)
            //根据前面Rect的hook点获得的水印bitmap的大小进行修改
            if (width === 325 && height === 103) {
                console.warn(`[HOOK] Blocked watermark bitmap: ${width}x${height}`);
                const empty = getTransparentBitmap(width, height)
                return this.drawBitmap(empty, srcRect, dstRect, paint);
            }else if(width === 138 && height === 172){
                console.warn(`[HOOK] Blocked watermark bitmap: ${width}x${height}`);
                const empty = getTransparentBitmap(width, height)
                return this.drawBitmap(empty, srcRect, dstRect, paint);
            }
            return this.drawBitmap(bitmap, srcRect, dstRect, paint);
        };
    });
}

//生成透明bitmap作为fakebitmap进行替换
let transparentMap = {};
function getTransparentBitmap(width, height) {
    const key = `${width}x${height}`;
    if (!transparentMap[key]) {
        transparentMap[key] = Bitmap.createBitmap(width, height, Config.ARGB_8888.value);
        console.log(`[+] Created transparent bitmap for size: ${key}`);
    }
    return transparentMap[key];
}

setImmediate(hook_picture())