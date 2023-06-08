export default class AudioManager {

    public static playBGM(clipName: string) {
        cc.resources.load("sounds/" + clipName, (err, clip: cc.AudioClip) => {
            if (err) {
                console.log(err);
                return;
            }
            cc.audioEngine.playMusic(clip, true);
        })
    }

    public static playSound(clipName: string) {
        cc.resources.load("sounds/" + clipName, (err, clip: cc.AudioClip) => {
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
