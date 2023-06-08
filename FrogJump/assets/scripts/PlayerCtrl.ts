import FrogManager from "./FrogManager";
import GameBg from "./GameBg";
import UIManager from "./UIManager";
import User from "./User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerCtrl extends cc.Component {

    @property(cc.Node)
    frog: cc.Node = null;

    @property(cc.Node)
    stages: cc.Node = null;

    @property(cc.Node)
    forceProgress: cc.Node = null;

    @property(GameBg)
    gameBg: GameBg = null;

    @property(UIManager)
    UIManager: UIManager = null;

    @property(FrogManager)
    frogManager: FrogManager = null;

    eventNode: cc.Node = null;
    graph: cc.Graphics = null;
    drawStartPos: cc.Vec2 = cc.v2(0, 0);
    maxLength: number = 1000;
    dir: cc.Vec2 = cc.v2(0, 0);
    stageCount: number = 12;
    gold: number = 0;
    score: number = 0;
    canTouchMove: boolean = false;
    reliveNum: number = 0;
    manager;
    arrow: cc.Node = null;


    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.manager = cc.director.getCollisionManager();
        this.graph = this.node.getComponent(cc.Graphics);
        this.arrow = this.frog.getChildByName("Arrow");


        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    start() {
        this.init();
    }



    init() {
        this.eventNode.targetOff(this.eventNode);
        this.gameBg.init();
        this.UIManager.init();
        this.frogManager.init();
        this.manager.enabled = true;
        this.stageCount = 0;
        this.gold = 0;
        this.score = 0;
        this.reliveNum = 0;
        this.forceProgress.active = false;
        this.canTouchMove = true;

        this.eventNode.on("touchGold", this.touchGold, this);
        this.eventNode.on("touchStage", this.touchStage, this);
        this.eventNode.on("touchWall", () => {
            this.eventNode.emit("openPropRelive", this.reliveNum);
        }, this);
        this.eventNode.on("propRelive", this.relive, this);
        this.eventNode.on("propHelp", this.help, this);
        this.eventNode.on("bgMove", (distance) => {
            this.eventNode.emit("move", distance, 1);
        }, this);
        this.eventNode.on("BgMoveCompleted", () => {
            this.canTouchMove = true;
        }, this);
    }

    touchGold() {
        this.score += 1;
        this.gold += 1;
        this.eventNode.emit("gold", this.gold);
        this.eventNode.emit("score", this.score);
    }

    touchStage() {
        this.canTouchMove = true;
        this.stageCount++;
        this.score += 2;
        this.eventNode.emit("score", this.score);
    }

    touchStart(e: cc.Event.EventTouch) {
        if (!this.canTouchMove) {
            return;
        }
        this.arrow.active = true;
        this.arrow.angle = 0;
        this.drawStartPos = this.node.convertToNodeSpaceAR(e.getLocation());
    }

    touchMove(e) {
        if (!this.canTouchMove) {
            return;
        }
        let endPos = this.node.convertToNodeSpaceAR(e.getLocation());
        let drawVec = cc.Vec2.subtract(new cc.Vec2, this.drawStartPos, endPos);
        let angle = Math.atan2(drawVec.y, drawVec.x) * 180 / Math.PI;
        let dir = cc.Vec2.normalize(new cc.Vec2(), drawVec).multiplyScalar(100);
        this.arrow.setPosition(dir);
        this.arrow.angle = angle;
        let speed = drawVec.multiplyScalar(4);
        this.graph.clear();
        this.drawLine(this.graph, this.frog.getPosition(), speed);
        this.setCtrlInfo(this.drawStartPos, endPos);
    }

    touchEnd(e) {
        if (!this.canTouchMove) {
            return;
        }
        this.arrow.active = false;
        this.graph.clear();
        this.forceProgress.active = false;

        let endPos = this.node.convertToNodeSpaceAR(e.getLocation());
        let drawVec = cc.Vec2.subtract(new cc.Vec2, this.drawStartPos, endPos);
        let angle = Math.atan2(drawVec.y, drawVec.x) * 180 / Math.PI;

        if (angle < -90 || angle > 90) {
            return;
        }

        this.canTouchMove = false;
        let speed = drawVec.multiplyScalar(4);
        speed = cc.v2(Math.abs(speed.x) > 800 ? 800 : speed.x, Math.abs(speed.y) > 800 ? 800 : speed.y);
        // let speed = cc.Vec2.normalize(new cc.Vec2(), drawVec).multiplyScalar(400);
        this.eventNode.emit("canMove", speed);
    }

    drawLine(graph: cc.Graphics, startPos, speed) {
        return;
        graph.clear();
        let dt = 0.05;
        let count = 150;//15
        let start = cc.v2(startPos.x, startPos.y);
        let sp = cc.v2(speed.x, speed.y);
        let nextPos = cc.v2(0, 0);
        let lastIndex = cc.Vec2.len(speed) / 300;
        for (let i = 0; i < count; i++) {
            nextPos.x = start.x + dt * sp.x;
            nextPos.y = start.y + dt * sp.y;
            if (nextPos.x > this.frog.position.x + 300) {
                // break;
            }
            if (i > 5 - lastIndex) {
                graph.circle(nextPos.x, nextPos.y, 2);
            }
            start = cc.v2(nextPos.x, nextPos.y);
            sp.y -= dt * 500;
        }
        graph.fill();

    }

    setArrow(angle: number) {

    }

    setCtrlInfo(startPos: cc.Vec2, endPos: cc.Vec2) {
        let drawVec = cc.Vec2.subtract(new cc.Vec2, startPos, endPos);
        let length = cc.Vec2.len(drawVec) > 800 ? 800 : cc.Vec2.len(drawVec);
        this.forceProgress.getComponent(cc.ProgressBar).progress = (length / 200) > 1 ? 1 : (length / 200);
        // this.forceProgress.getComponent(cc.ProgressBar).progress = length / 800;
        this.forceProgress.active = true;
    }


    getSettleData() {
        return {
            score: this.score,
            gold: this.gold
        };
    }

    relive() {
        this.reliveNum++;
        this.canTouchMove = true;
    }

    help() {
        if (!this.canTouchMove) {
            return;
        }
        this.canTouchMove = false;
        let near;
        for (let i = 0; i < this.stages.children.length; i++) {
            if ((this.stages.children[i].x - this.frog.x) > 150) {
                near = this.stages.children[i];
                break;
            }
        }
        for (let i = 0; i < this.stages.children.length; i++) {
            if ((this.stages.children[i].x - this.frog.x) > 150 && (this.stages.children[i].x - this.frog.x) < (near.x - this.frog.x)) {
                near = this.stages.children[i];
            }
        }
        let distanceX = near.x - this.frog.x;
        let t = 1;
        let speed = cc.v2(0, 0);
        speed.x = distanceX / t;
        let tempY = near.y - this.frog.y;
        speed.y = tempY + 250;
        this.eventNode.emit("canMove", speed);
    }
}
