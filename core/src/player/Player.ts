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

/// <reference path="SystemRenderer.ts" />
/// <reference path="FPSDisplay.ts" />
/// <reference path="DisplayList.ts" />
/// <reference path="RenderBuffer.ts" />
/// <reference path="../utils/HashObject.ts" />
/// <reference path="../display/Stage.ts" />
/// <reference path="../web/rendering/webgl/WebGLRenderContext.ts" />

namespace egret.sys
{
    export let $TempStage: egret.Stage;

    /**
     * @private
     * Egret player.
     */
    export class Player extends HashObject
    {
        /**
         * @private
         * Instantiate a player object.
         */
        public constructor(buffer: RenderBuffer, stage: Stage, entryClassName: string) {
            super();
            if (DEBUG && !buffer) {
                $error(1003, "buffer");
            }

            this.entryClassName = entryClassName;
            this.stage = stage;
            this.screenDisplayList = this.createDisplayList(stage, buffer);


            this.showFPS = false;
            this.showLog = false;
            this.stageDisplayList = null;

            if (egret.nativeRender) {
                egret_native.rootWebGLBuffer = buffer;
            }
        }

        /**
         * @private
         */
        private createDisplayList(stage: Stage, buffer: RenderBuffer): DisplayList {
            let displayList = new DisplayList(stage);
            displayList.renderBuffer = buffer;
            stage.$displayList = displayList;
            return displayList;
        }

        /**
         * @private
         */
        private screenDisplayList: DisplayList;

        /**
         * @private
         * The full class name of the entry class.
         */
        private entryClassName: string;

        /**
         * @private
         * Stage reference.
         */
        public stage: Stage;

        /**
         * @private
         * Entry class instance.
         */
        private root: DisplayObject;

        /**
         * @private
         */
        private isPlaying: boolean = false;

        /**
         * @private
         * Start the player.
         */
        public start(): void {
            if (this.isPlaying || !this.stage) {
                return;
            }

            $TempStage = $TempStage || this.stage;

            this.isPlaying = true;
            if (!this.root) {
                this.initialize();
            }
            ticker.$addPlayer(this);
        }

        /**
         * @private
         */
        private initialize(): void {
            let rootClass;
            if (this.entryClassName) {
                rootClass = egret.getDefinitionByName(this.entryClassName);
            }
            if (rootClass) {
                let rootContainer: any = new rootClass();
                this.root = rootContainer;
                if (rootContainer instanceof egret.DisplayObject) {
                    this.stage.addChild(rootContainer);
                }
                else {
                    DEBUG && $error(1002, this.entryClassName);
                }
            }
            else {
                DEBUG && $error(1001, this.entryClassName);
            }
        }

        /**
         * @private
         * Stop the player, it will not restart after stopping.
         */
        public stop(): void {
            this.pause();
            this.stage = null;
        }

        /**
         * @private
         * Pause the player, and then restart the player by calling start ().
         */
        public pause(): void {
            if (!this.isPlaying) {
                return;
            }
            this.isPlaying = false;
            ticker.$removePlayer(this);
        }

        /**
         * @private
         * Render screen.
         */
        $render(triggerByFrame: boolean, costTicker: number): void {
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                egret_native.nrRender();
                return;
            }

            let stage = this.stage;
            let t1 = egret.getTimer();
            let drawCalls = stage.$displayList.drawToSurface();
            let t2 = egret.getTimer();
            if (triggerByFrame && this.showFPS) {
                fpsDisplay.update(drawCalls, t2 - t1, costTicker);
            }
        }

        /**
         * @private
         * Update stage size.
         * @param stageWidth Stage width. (in pixels)
         * @param stageHeight Stage height. (in pixels)
         */
        public updateStageSize(stageWidth: number, stageHeight: number): void {
            let stage = this.stage;
            stage.$stageWidth = stageWidth;
            stage.$stageHeight = stageHeight;
            if (egret.nativeRender) {
                egret_native.nrResize(stageWidth, stageHeight);
            } else {
                this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                if (this.stageDisplayList) {
                    this.stageDisplayList.setClipRect(stageWidth, stageHeight);
                }
            }
            stage.dispatchEventWith(Event.RESIZE);
        }

        /**
         * @private
         * FPS is displayed.
         */
        public displayFPS(showFPS: boolean, showLog: boolean, logFilter: string, styles: Object) {
            showLog = !!showLog;
            if (showLog) {
                egret.log = function () {
                    let length = arguments.length;
                    let info = "";
                    for (let i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$logToFPS(info);
                    console.log.apply(console, toArray(arguments));
                };
                egret.warn = function () {
                    let length = arguments.length;
                    let info = "";
                    for (let i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$warnToFPS(info);
                    console.warn.apply(console, toArray(arguments));
                };
                egret.error = function () {
                    let length = arguments.length;
                    let info = "";
                    for (let i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$errorToFPS(info);
                    console.error.apply(console, toArray(arguments));
                };
            }
            this.showFPS = !!showFPS;
            this.showLog = showLog;
            if (!fpsDisplay) {
                fpsDisplay = new FPS(this.stage, showFPS, showLog, logFilter, styles);

                let logLength = logLines.length;
                for (let i = 0; i < logLength; i++) {
                    fpsDisplay.updateInfo(logLines[i]);
                }
                logLines = null;

                let warnLength = warnLines.length;
                for (let i = 0; i < warnLength; i++) {
                    fpsDisplay.updateWarn(warnLines[i]);
                }
                warnLines = null;

                let errorLength = errorLines.length;
                for (let i = 0; i < errorLength; i++) {
                    fpsDisplay.updateError(errorLines[i]);
                }
                errorLines = null;
            }
        }

        /**
         * @private
         */
        private showFPS: boolean;

        /**
         * @private
         */
        private showLog: boolean;

        /**
         * @private
         */
        private stageDisplayList: DisplayList;
    }

    /**
     * @private
     * FPS display objects.
     */
    interface FPS
    {
        /**
         * Update FPS information.
         */
        update(drawCalls: number, costRender: number, costTicker: number): void;

        /**
         * Insert a log message.
         */
        updateInfo(info: string): void;

        /**
         * Insert a warn message.
         */
        updateWarn(info: string): void;

        /**
         * Insert an error message.
         */
        updateError(info: string): void;
    }

    declare let FPS: { new(stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): FPS };

    /**
     * @private
     */
    export let $logToFPS: (info: string) => void;

    /**
     * @private
     */
    export let $warnToFPS: (info: string) => void;

    /**
     * @private
     */
    export let $errorToFPS: (info: string) => void;

    let logLines: string[] = [];
    let warnLines: string[] = [];
    let errorLines: string[] = [];
    let fpsDisplay: FPS;

    $logToFPS = function (info: string): void {
        if (!fpsDisplay) {
            logLines.push(info);
            return;
        }
        fpsDisplay.updateInfo(info);
    };

    $warnToFPS = function (info: string): void {
        if (!fpsDisplay) {
            warnLines.push(info);
            return;
        }
        fpsDisplay.updateWarn(info);
    };

    $errorToFPS = function (info: string): void {
        if (!fpsDisplay) {
            errorLines.push(info);
            return;
        }
        fpsDisplay.updateError(info);
    };

    class FPSImpl
    {
        private infoLines = [];
        private totalTime = 0;
        private totalTick = 0;
        private lastTime = 0;
        private drawCalls = 0;
        private costRender = 0;
        private costTicker = 0;
        private _stage: egret.Stage;
        private fpsDisplay: FPSDisplay;
        private filter: any;

        constructor(stage: egret.Stage, private showFPS: boolean, private showLog: boolean, private logFilter: string, private styles?: Object) {
            this.infoLines = [];
            this.totalTime = 0;
            this.totalTick = 0;
            this.lastTime = 0;
            this.drawCalls = 0;
            this.costRender = 0;
            this.costTicker = 0;
            this._stage = stage;
            this.showFPS = showFPS;
            this.showLog = showLog;
            this.logFilter = logFilter;
            this.styles = styles;
            this.fpsDisplay = new FPSDisplay(stage, showFPS, showLog, logFilter, styles);
            let logFilterRegExp: RegExp;
            try {
                logFilterRegExp = logFilter ? new RegExp(logFilter) : null;

            }
            catch (e) {
                log(e);
            }
            this.filter = function (message: string): boolean {
                if (logFilterRegExp)
                    return logFilterRegExp.test(message);
                return !logFilter || message.indexOf(logFilter) == 0;
            }
        }

        update(drawCalls: number, costRender, costTicker) {
            let current = egret.getTimer();
            this.totalTime += current - this.lastTime;
            this.lastTime = current;
            // todo many Player
            this.totalTick++;
            this.drawCalls += drawCalls;
            this.costRender += costRender;
            this.costTicker += costTicker;
            if (this.totalTime >= 1000) {

                let lastFPS = Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), ticker.$frameRate);
                let lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                let lastCostRender = Math.round(this.costRender / this.totalTick);
                let lastCostTicker = Math.round(this.costTicker / this.totalTick);
                this.fpsDisplay.update(
                    {
                        fps: lastFPS,
                        draw: lastDrawCalls,
                        costTicker: lastCostTicker,
                        costRender: lastCostRender
                    }
                )
                this.totalTick = 0;
                this.totalTime = this.totalTime % 1000;
                this.drawCalls = 0;
                this.costRender = 0;
                this.costTicker = 0;
            }
        }

        updateInfo(info: any) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            this.fpsDisplay.updateInfo(info);
        }

        updateWarn(info) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            if (this.fpsDisplay.updateWarn) {
                this.fpsDisplay.updateWarn(info);
            }
            else {
                this.fpsDisplay.updateInfo("[Warning]" + info);
            }
        }

        updateError(info) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            if (this.fpsDisplay.updateError) {
                this.fpsDisplay.updateError(info);
            }
            else {
                this.fpsDisplay.updateInfo("[Error]" + info);
            }
        }
    }

    __global.FPS = FPSImpl;

    function toArray(argument) {
        let args = [];
        for (let i = 0; i < argument.length; i++) {
            args.push(argument[i]);
        }
        return args;
    }

    egret.warn = function () {
        console.warn.apply(console, toArray(arguments))
    };
    egret.error = function () {
        console.error.apply(console, toArray(arguments))
    };
    egret.assert = function () {
        console.assert.apply(console, toArray(arguments))
    };
    egret.log = function () {
        console.log.apply(console, toArray(arguments));
    };

    export let setRenderMode: (renderMode: string) => void;

    export let WebGLRenderContext: { new(width?: number, height?: number, context?: WebGLRenderingContext): RenderContext };
}

/**
 * @private
 */
module egret
{
    /**
     * @private
     */
    export var nativeRender: boolean = __global.nativeRender;

    // Check if the version matches, if not match, use non-native accelerated rendering
    if (nativeRender) {
        const nrABIVersion = egret_native.nrABIVersion;
        const nrMinEgretVersion = egret_native.nrMinEgretVersion;
        const requiredNrABIVersion = 5;
        if (nrABIVersion < requiredNrABIVersion) {
            nativeRender = false;
            const msg = "You need to upgrade the micro-end version to 0.1.14 to enable native rendering acceleration";
            sys.$warnToFPS(msg);
            egret.warn(msg);
        }
        else if (nrABIVersion > requiredNrABIVersion) {
            nativeRender = false;
            const msg = `You need to upgrade the engine version to ${nrMinEgretVersion} for enable native rendering acceleration`;
            sys.$warnToFPS(msg);
            egret.warn(msg);
        }
    }
}