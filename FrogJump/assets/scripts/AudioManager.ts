/*
 * @Author: LXR 923390756@qq.com
 * @Date: 2023-06-09 01:01:36
 * @LastEditors: LXR 923390756@qq.com
 * @LastEditTime: 2023-09-12 03:53:30
 * @FilePath: \FrogJump\assets\scripts\AudioManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default class AudioManager {

    public static soundsBundle: cc.AssetManager.Bundle = null;

    public static loadSoundBundle() {
        cc.assetManager.loadBundle("sounds", (e, bundle) => {
            if (e) {
                console.log(e);
                return;
            }
            console.log("音乐资源分包加载完成");
            this.soundsBundle = bundle;
        })
    }

    public static playBGM(clipName: string) {
        this.soundsBundle.load(clipName, (err, clip: cc.AudioClip) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("播放bgm：", clipName);
            cc.audioEngine.playMusic(clip, true);
        })
    }

    public static playSound(clipName: string) {
        this.soundsBundle.load(clipName, (err, clip: cc.AudioClip) => {
            if (err) {
                console.log(err);
                return;
            }
            cc.audioEngine.play(clip, false, 1);
        })
    }

    public static stopMusic() {
        cc.audioEngine.stopMusic();
    }
}
