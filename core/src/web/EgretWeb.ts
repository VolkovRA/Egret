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

namespace egret.web
{
    /**
     * @private
     * Refresh the display area size of all Egret players.
     * Only when the size of the Egret container is dynamically modified using external JavaScript code,
     * you need to manually call this method to refresh the display area.
     * This method will be called automatically when the web page size changes.
     */
    function updateAllScreens(): void {
        if (!isRunning) {
            return;
        }
        
        let containerList = document.querySelectorAll(".egret-player");
        let length = containerList.length;
        for (let i = 0; i < length; i++) {
            let container = containerList[i];
            let player = <WebPlayer>container["egret-player"];
            player.updateScreenSize();
        }
    }

    let isRunning: boolean = false;

    /**
     * @private
     * The web page is loaded and the Egret tag defined in the page is instantiated.
     */
    function runEgret(options?: runEgretOptions): void {
        if (isRunning) {
            return;
        }

        isRunning = true;

        if (!options) {
            options = {};
        }

        let ua: string = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") >= 0 && ua.indexOf("egretwebview") == -1) {
            Capabilities["runtimeType" + ""] = egret.RuntimeType.RUNTIME2;
        }

        if (ua.indexOf("egretnative") >= 0 && egret.nativeRender) { // Egret Native
            egret_native.addModuleCallback(function () {
                Html5Capatibility.$init();

                // WebGL context parameter customization
                if (options.renderMode == "webgl") {
                    // WebGL anti-aliasing is off by default, improving the performance of PC and some platforms
                    let antialias = options.antialias;
                    WebGLRenderContext.antialias = !!antialias;
                }

                sys.CanvasRenderBuffer = CanvasRenderBuffer;
                setRenderMode(options.renderMode);
                egret_native.nrSetRenderMode(2);

                let canvasScaleFactor;
                if (options.canvasScaleFactor) {
                    canvasScaleFactor = options.canvasScaleFactor;
                }
                else if (options.calculateCanvasScaleFactor) {
                    canvasScaleFactor = options.calculateCanvasScaleFactor(sys.canvasHitTestBuffer.context);
                }
                else {
                    canvasScaleFactor = window.devicePixelRatio;
                }
                sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;

                let ticker = egret.ticker;
                startTicker(ticker);
                if (options.screenAdapter) {
                    egret.sys.screenAdapter = options.screenAdapter;
                }
                else if (!egret.sys.screenAdapter) {
                    egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
                }

                let list = document.querySelectorAll(".egret-player");
                let length = list.length;
                for (let i = 0; i < length; i++) {
                    let container = <HTMLDivElement>list[i];
                    let player = new WebPlayer(container, options);
                    container["egret-player"] = player;
                }
                WebGLRenderContext.getInstance().getSupportedCompressedTexture();
                window.addEventListener("resize", function () {
                    if (isNaN(resizeTimer)) {
                        resizeTimer = window.setTimeout(doResize, 300);
                    }
                });
            }, null);
            egret_native.initNativeRender();
        }
        else {
            Html5Capatibility._audioType = options.audioType;
            Html5Capatibility.$init();
            let renderMode = options.renderMode;
            // WebGL context parameter customization
            if (renderMode == "webgl") {
                // WebGL anti-aliasing is off by default, improving the performance of PC and some platforms
                let antialias = options.antialias;
                WebGLRenderContext.antialias = !!antialias;
                // WebGLRenderContext.antialias = (typeof antialias == undefined) ? true : antialias;
            }

            sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
            if (ua.indexOf("egretnative") >= 0 && renderMode != "webgl") {
                egret.warn(1051);
                renderMode = "webgl";
            }

            setRenderMode(renderMode);

            let canvasScaleFactor;
            if (options.canvasScaleFactor) {
                canvasScaleFactor = options.canvasScaleFactor;
            }
            else if (options.calculateCanvasScaleFactor) {
                canvasScaleFactor = options.calculateCanvasScaleFactor(sys.canvasHitTestBuffer.context);
            }
            else {
                // Based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
                let context = sys.canvasHitTestBuffer.context;
                let backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
            }
            sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;

            let ticker = egret.ticker;
            startTicker(ticker);
            if (options.screenAdapter) {
                egret.sys.screenAdapter = options.screenAdapter;
            }
            else if (!egret.sys.screenAdapter) {
                egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
            }

            let list = document.querySelectorAll(".egret-player");
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let container = <HTMLDivElement>list[i];
                let player = new WebPlayer(container, options);
                container["egret-player"] = player;
            }

            window.addEventListener("resize", function () {
                if (isNaN(resizeTimer)) {
                    resizeTimer = window.setTimeout(doResize, 300);
                }
            });
        }
    }

    /**
     * Set the rendering mode: "auto", "webgl", "canvas".
     * @param renderMode
     */
    function setRenderMode(renderMode: string): void {
        if (renderMode == "webgl" && WebGLUtils.checkCanUseWebGL()) {
            sys.RenderBuffer = web.WebGLRenderBuffer;
            sys.systemRenderer = new WebGLRenderer();
            sys.canvasRenderer = new CanvasRenderer();
            sys.customHitTestBuffer = new WebGLRenderBuffer(3, 3);
            sys.canvasHitTestBuffer = new CanvasRenderBuffer(3, 3);
            Capabilities["renderMode" + ""] = "webgl";
        }
        else {
            sys.RenderBuffer = web.CanvasRenderBuffer;
            sys.systemRenderer = new CanvasRenderer();
            sys.canvasRenderer = sys.systemRenderer;
            sys.customHitTestBuffer = new CanvasRenderBuffer(3, 3);
            sys.canvasHitTestBuffer = sys.customHitTestBuffer;
            Capabilities["renderMode" + ""] = "canvas";
        }
    }

    egret.sys.setRenderMode = setRenderMode;

    /**
     * @private
     * Start the heartbeat timer.
     */
    function startTicker(ticker: egret.sys.SystemTicker): void {
        let requestAnimationFrame =
            window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"];

        if (!requestAnimationFrame) {
            requestAnimationFrame = function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }

        requestAnimationFrame(onTick);
        function onTick(): void {
            requestAnimationFrame(onTick);
            ticker.update();
        }
    }

    // Overriding the native isNaN () method implementation, there are 2 ~ 10 times performance improvement on different browsers.
    window["isNaN"] = function (value: number): boolean {
        value = +value;
        return value !== value;
    };

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;

    let resizeTimer: number = NaN;

    function doResize() {
        resizeTimer = NaN;
        egret.updateAllScreens();
    }
}