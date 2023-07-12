const { ccclass, property } = cc._decorator;

@ccclass
export default class FrogManager extends cc.Component {

    eventNode: cc.Node = null;

    frog: cc.Node = null;
    shadow: cc.Node = null;
    arrow: cc.Node = null;
    frogAnim: cc.Animation = null;
    effectAnim: cc.Animation = null;
    dir: cc.Node = null;

    canMove: Boolean = false;
    speed: cc.Vec2 = cc.v2(0, 0);
    gravity: number = 500;
    lastPos = cc.v2(0, 0);


    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.shadow = this.node.getChildByName("Shadow");
        this.arrow = this.node.getChildByName("Arrow");
        this.frog = this.node.getChildByName("Frog");
        this.frogAnim = this.frog.getComponent(cc.Animation);
        this.effectAnim = this.node.getChildByName("Effect").getComponent(cc.Animation);

    }

    start() {

    }

    init() {
        this.lastPos = this.node.getPosition();
        this.isJump = false;
        this.arrow.active = false;
        this.eventNode.on("canMove", (speed: cc.Vec2) => {
            this.speed = speed;
            this.canMove = true;
        }, this);
        this.eventNode.on("BgMoveCompleted", () => {
            this.lastPos = this.node.getPosition();
        }, this);

        this.eventNode.on("propRelive", this.relive, this);

        this.frogAnim.play("frog_idle");
    }

    isJump: boolean = false;
    update(dt) {
        if (this.canMove) {
            if (!this.isJump) {
                this.isJump = true;
                this.frogAnim.play("frog_jump2");
                // state.speed = 1000 / cc.Vec2.len(this.speed);
            }
            this.shadow.active = false;
            this.node.x += this.speed.x * dt * 2;
            this.node.y += this.speed.y * dt * 2;
            this.speed.y -= dt * this.gravity * 2;
        }
    }

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        switch (other.tag) {
            case 1:
                this.effectAnim.play("ef_coin");
                this.eventNode.emit("touchGold");
                other.node.destroy();
                break;
            case 2:
                if (self.tag == 10) return;
                let distance = this.node.x - this.lastPos.x;
                if (distance <= 0) {
                    return;
                }
                this.eventNode.emit("bgMove", distance);
                this.frogAnim.play("frog_idle")
                this.isJump = false;
                this.shadow.active = true;
                let stageCount = this.node.parent.getChildByName("PlayerCtrl").getComponent("PlayerCtrl").stageCount;
                let temp = Math.floor((stageCount + 1) * 100 + Math.random() * 100);
                other.node.parent.getChildByName("Tips").getComponent(cc.Label).string = "超越" + temp + "名玩家";
                this.eventNode.emit("touchStage");

                this.canMove = false;
                break;
            case 3:
                this.effectAnim.once("finished", () => {
                    this.eventNode.emit("touchWall");
                });
                this.effectAnim.once("play", () => {
                    this.canMove = false;
                    this.frog.active = false;
                    this.shadow.active = false;
                });
                this.effectAnim.play("ef_fail");
                break;
        }

    }

    relive() {
        this.node.setPosition(this.lastPos);
        this.frog.active = true;
        this.shadow.active = true;
        this.frogAnim.play("frog_idle");
        this.isJump = false;
    }
}
