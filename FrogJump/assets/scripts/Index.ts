/*
 * @Author: LXR 923390756@qq.com
 * @Date: 2023-06-09 01:01:36
 * @LastEditors: LXR 923390756@qq.com
 * @LastEditTime: 2023-09-12 04:00:50
 * @FilePath: \FrogJump\assets\scripts\Index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import AudioManager from "./AudioManager";
import { HttpManager } from "./HttpManager";
import { WXManager } from "./WXManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Node)
    rankBtn: cc.Node = null;

    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    @property(cc.Label)
    nickName: cc.Label = null;

    @property(cc.Node)
    rankLayer: cc.Node = null;


    onLoad() {
        cc.director.preloadScene("Game");
        if (WXManager.isLogin) {
            this.init();
        } else {
            WXManager.wxLogin(this.rankBtn, this.onBtnOpenRank.bind(this), this.setAvatar.bind(this), this.setInfo.bind(this));
        }
    }

    init() {
        this.setAvatar();
        this.setInfo();
    }

    start() {
        this.rankLayer.active = false;
        AudioManager.playBGM("home");
    }

    BtnStart() {
        AudioManager.stopMusic();
        cc.director.loadScene("Game");
    }


    setAvatar() {
        this.avatar.spriteFrame = HttpManager.avatar;
        this.nickName.string = HttpManager.nickName;
    }


    setInfo() {
        this.scoreLabel.string = HttpManager.score + "";
        this.goldLabel.string = HttpManager.gold + "";
    }

    onBtnOpenRank() {
        this.rankLayer.active = true;
    }

    onBtnCloseRank() {
        this.rankLayer.active = false;
    }


}
