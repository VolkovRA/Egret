//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

/// <reference path="Player.ts" />
/// <reference path="../events/Event.ts" />
/// <reference path="../display/Stage.ts" />

namespace egret.sys
{
    /**
     * @private
     */
    export let $START_TIME: number = 0;

    /**
     * @private
     * Whether to broadcast the Event.RENDER event flag.
     */
    export let $invalidateRenderFlag: boolean = false;

    /**
     * @private
     * Need to refresh the screen immediately.
     */
    export let $requestRenderingFlag: boolean = false;

    /**
     * Egret heartbeat timer.
     */
    export class SystemTicker
    {
        /**
         * @private
         */
        public constructor() {
            if (DEBUG && ticker) {
                $error(1008, "egret.sys.SystemTicker");
            }
            $START_TIME = Date.now();
            this.frameDeltaTime = 1000 / this.$frameRate;
            this.lastCount = this.frameInterval = Math.round(60000 / this.$frameRate);
        }

        /**
         * @private
         */
        private playerList: Player[] = [];

        /**
         * @private
         * Register a player instance and run.
         */
        $addPlayer(player: Player): void {
            if (this.playerList.indexOf(player) != -1) {
                return;
            }
            if (DEBUG) {
                egret_stages.push(player.stage);
            }
            this.playerList = this.playerList.concat();
            this.playerList.push(player);
        }

        /**
         * @private
         * Stop the running of a player instance.
         */
        $removePlayer(player: Player): void {
            let index = this.playerList.indexOf(player);
            if (index !== -1) {
                if (DEBUG) {
                    let i = egret_stages.indexOf(player.stage);
                    egret_stages.splice(i, 1);
                }
                this.playerList = this.playerList.concat();
                this.playerList.splice(index, 1);
            }
        }

        /**
         * @private
         */
        private callBackList: Function[] = [];

        /**
         * @private
         */
        private thisObjectList: any[] = [];

        /**
         * @private
         */
        $startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void {
            let index = this.getTickIndex(callBack, thisObject);
            if (index != -1) {
                return;
            }
            this.concatTick();
            this.callBackList.push(callBack);
            this.thisObjectList.push(thisObject);
        }

        /**
         * @private
         */
        $stopTick(callBack: (timeStamp: number) => boolean, thisObject: any): void {
            let index = this.getTickIndex(callBack, thisObject);
            if (index == -1) {
                return;
            }
            this.concatTick();
            this.callBackList.splice(index, 1);
            this.thisObjectList.splice(index, 1);
        }

        /**
         * @private
         */
        private getTickIndex(callBack: Function, thisObject: any): number {
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            for (let i = callBackList.length - 1; i >= 0; i--) {
                if (callBackList[i] == callBack &&
                    thisObjectList[i] == thisObject) { // === cannot be used here, because it is possible to pass in undefined and null.
                    return i;
                }
            }
            return -1;
        }

        /**
         * @private
         *
         */
        private concatTick(): void {
            this.callBackList = this.callBackList.concat();
            this.thisObjectList = this.thisObjectList.concat();
        }

        /**
         * @private
         * Global frame rate.
         */
        $frameRate: number = 30;

        /**
         * @private
         */
        private frameInterval: number;

        /**
         * @private
         */
        private frameDeltaTime: number;

        /**
         * @private
         */
        private lastTimeStamp: number = 0;

        /**
         * @private
         * Set global frame rate.
         */
        $setFrameRate(value: number): boolean {
            if (value <= 0) {
                return false;
            }
            if (this.$frameRate == value) {
                return false;
            }
            this.$frameRate = value;
            if (value > 60) {
                value = 60;
            }
            this.frameDeltaTime = 1000 / value;
            // Here 60 * 1000 is used to avoid the problem of inaccurate calculation of floating point numbers.
            this.lastCount = this.frameInterval = Math.round(60000 / value);
            return true;
        }

        /**
         * @private
         */
        private lastCount: number;

        /**
         * @private
         * Ticker time spent.
         */
        private costEnterFrame: number = 0;

        /**
         * @private
         * Whether to be suspended.
         */
        private isPaused: boolean = false;

        /**
         * Pause the ticker.
         * @version Egret 5.0.2
         * @platform Web,Native
         */
        public pause(): void {
            this.isPaused = true;
        }

        /**
         * Resume the ticker.
         * @version Egret 5.0.2
         * @platform Web,Native
         */
        public resume(): void {
            this.isPaused = false;
        }

        /**
         * @private
         * Perform a refresh.
         */
        public update(forceUpdate?: boolean): void {
            let t1 = egret.getTimer();
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            let length = callBackList.length;
            let requestRenderingFlag = $requestRenderingFlag;
            let timeStamp = egret.getTimer();
            let contexts = lifecycle.contexts;
            for (let c of contexts) {
                if (c.onUpdate) {
                    c.onUpdate();
                }
            }
            if (this.isPaused) {
                this.lastTimeStamp = timeStamp;
                return;
            }
            this.callLaterAsyncs();
            for (let i = 0; i < length; i++) {
                if (callBackList[i].call(thisObjectList[i], timeStamp)) {
                    requestRenderingFlag = true;
                }
            }
            let t2 = egret.getTimer();
            let deltaTime = timeStamp - this.lastTimeStamp;
            this.lastTimeStamp = timeStamp;
            if (deltaTime >= this.frameDeltaTime || forceUpdate) {
                this.lastCount = this.frameInterval;
            }
            else {
                this.lastCount -= 1000;
                if (this.lastCount > 0) {
                    if (requestRenderingFlag) {
                        this.render(false, this.costEnterFrame + t2 - t1);
                    }
                    return;
                }
                this.lastCount += this.frameInterval;
            }
            this.render(true, this.costEnterFrame + t2 - t1);
            let t3 = egret.getTimer();
            this.broadcastEnterFrame();
            let t4 = egret.getTimer();
            this.costEnterFrame = t4 - t3;
        }

        /**
         * @private
         * Perform a screen rendering.
         */
        private render(triggerByFrame: boolean, costTicker: number): void {
            let playerList = this.playerList;
            let length = playerList.length;
            if (length == 0) {
                return;
            }
            this.callLaters();
            if ($invalidateRenderFlag) {
                this.broadcastRender();
                $invalidateRenderFlag = false;
            }
            for (let i = 0; i < length; i++) {
                playerList[i].$render(triggerByFrame, costTicker);
            }
            $requestRenderingFlag = false;
        }

        /**
         * @private
         * Broadcast EnterFrame event.
         */
        private broadcastEnterFrame(): void {
            let list: any[] = DisplayObject.$enterFrameCallBackList;
            let length = list.length;
            if (length == 0) {
                return;
            }
            list = list.concat();
            for (let i = 0; i < length; i++) {
                list[i].dispatchEventWith(Event.ENTER_FRAME);
            }
        }

        /**
         * @private
         * Broadcast Render events.
         */
        private broadcastRender(): void {
            let list = DisplayObject.$renderCallBackList;
            let length = list.length;
            if (length == 0) {
                return;
            }
            list = list.concat();
            for (let i = 0; i < length; i++) {
                list[i].dispatchEventWith(Event.RENDER);
            }
        }

        /**
         * @private
         */
        private callLaters(): void {
            let functionList: any[];
            let thisList: any[];
            let argsList: any[];
            if ($callLaterFunctionList.length > 0) {
                functionList = $callLaterFunctionList;
                $callLaterFunctionList = [];
                thisList = $callLaterThisList;
                $callLaterThisList = [];
                argsList = $callLaterArgsList;
                $callLaterArgsList = [];
            }

            if (functionList) {
                let length: number = functionList.length;
                for (let i: number = 0; i < length; i++) {
                    let func: Function = functionList[i];
                    if (func != null) {
                        func.apply(thisList[i], argsList[i]);
                    }
                }
            }
        }

        /**
         * @private
         */
        private callLaterAsyncs(): void {
            if ($callAsyncFunctionList.length > 0) {
                let locCallAsyncFunctionList = $callAsyncFunctionList;
                let locCallAsyncThisList = $callAsyncThisList;
                let locCallAsyncArgsList = $callAsyncArgsList;

                $callAsyncFunctionList = [];
                $callAsyncThisList = [];
                $callAsyncArgsList = [];

                for (let i: number = 0; i < locCallAsyncFunctionList.length; i++) {
                    let func: Function = locCallAsyncFunctionList[i];
                    if (func != null) {
                        func.apply(locCallAsyncThisList[i], locCallAsyncArgsList[i]);
                    }
                }
            }
        }

        //for 3D&2D
        /**
         * @private
         */
        public $beforeRender = () => {
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            let length = callBackList.length;
            let timeStamp = egret.getTimer();
            let contexts = lifecycle.contexts;
            for (let c of contexts) {
                if (c.onUpdate) {
                    c.onUpdate();
                }
            }
            if (this.isPaused) {
                this.lastTimeStamp = timeStamp;
                return;
            }
            this.callLaterAsyncs();
            for (let i = 0; i < length; i++) {
                callBackList[i].call(thisObjectList[i], timeStamp)
            }

            this.callLaters();
            if (sys.$invalidateRenderFlag) {
                this.broadcastRender();
                sys.$invalidateRenderFlag = false;
            }
        };

        //for 3D&2D
        /**
         * @private
         */
        public $afterRender = () => {
            this.broadcastEnterFrame();
        };
    }
}

module egret {

    export namespace lifecycle {

        export type LifecyclePlugin = (context: LifecycleContext) => void;

        /**
         * @private
         */
        export let stage: egret.Stage;

        /**
         * @private
         */
        export let contexts: LifecycleContext[] = [];
        let isActivate = true;

        export class LifecycleContext {

            pause() {
                if (isActivate) {
                    isActivate = false;
                    stage.dispatchEvent(new Event(Event.DEACTIVATE));
                    if (onPause) {
                        onPause();
                    }
                }
            }

            resume() {
                if (!isActivate) {
                    isActivate = true;
                    stage.dispatchEvent(new Event(Event.ACTIVATE));
                    if (onResume) {
                        onResume();
                    }
                }
            }

            onUpdate?: () => void;
        }

        export let onResume: () => void;

        export let onPause: () => void;

        export function addLifecycleListener(plugin: LifecyclePlugin) {
            let context = new LifecycleContext();
            contexts.push(context);
            plugin(context);
        }
    }

    /**
     * Single heartbeat timer.
     */
    export let ticker: sys.SystemTicker = new sys.SystemTicker();
}

/**
 * @private
 */
declare let egret_stages: egret.Stage[];
if (DEBUG) {
    global.egret_stages = [];
}