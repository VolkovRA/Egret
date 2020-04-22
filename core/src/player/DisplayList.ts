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

/// <reference path="RenderBuffer.ts" />
/// <reference path="nodes/RenderNode.ts" />
/// <reference path="../display/BitmapData.ts" />
/// <reference path="../utils/HashObject.ts" />

namespace egret.sys
{
    let displayListPool: DisplayList[] = [];
    let blendModes = ["source-over", "lighter", "destination-out"];
    let defaultCompositeOp = "source-over";

    /**
     * @private
     * Show list.
     */
    export class DisplayList extends HashObject
    {
        /**
         * Create a DisplayList object.
         * If there is insufficient memory or the RenderBuffer cannot be created, null will be returned.
         */
        public static create(target: DisplayObject): DisplayList {
            let displayList = new egret.sys.DisplayList(target);
            try {
                let buffer = new RenderBuffer();
                displayList.renderBuffer = buffer;
            }
            catch (e) {
                return null;
            }
            displayList.root = target;
            return displayList;
        }

        /**
         * @private
         * Create a DisplayList object.
         */
        public constructor(root: DisplayObject) {
            super();
            this.root = root;
            this.isStage = (root instanceof Stage);
        }

        private isStage: boolean = false;

        /**
         * Bitmap rendering node.
         */
        $renderNode: RenderNode = new BitmapNode();

        /**
         * @private
         * Get render node.
         */
        $getRenderNode(): sys.RenderNode {
            return this.$renderNode;
        }

        /**
         * @private
         */
        public renderBuffer: RenderBuffer = null;

        /**
         * @private
         */
        public offsetX: number = 0;

        /**
         * @private
         */
        public offsetY: number = 0;

        /**
         * @private
         */
        private offsetMatrix: Matrix = new Matrix();

        /**
         * @private
         * Show list root node
         */
        public root: DisplayObject;

        /**
         * @private
         * Set the clipping boundary, no longer draw the complete target object, the canvas size is determined by the outside,
         * and the nodes beyond the boundary will skip drawing.
         */
        public setClipRect(width: number, height: number): void {
            width *= DisplayList.$canvasScaleX;
            height *= DisplayList.$canvasScaleY;
            this.renderBuffer.resize(width, height);
        }

        public $canvasScaleX: number = 1;

        public $canvasScaleY: number = 1;

        /**
         * @private
         * Draw the root node display object to the target canvas and return the number of draws.
         */
        public drawToSurface(): number {
            let drawCalls = 0;
            this.$canvasScaleX = this.offsetMatrix.a = DisplayList.$canvasScaleX;
            this.$canvasScaleY = this.offsetMatrix.d = DisplayList.$canvasScaleY;
            if (!this.isStage) { // The non-stage canvas should be changed according to the size of the target display object.
                this.changeSurfaceSize();
            }
            let buffer = this.renderBuffer;
            buffer.clear();
            drawCalls = systemRenderer.render(this.root, buffer, this.offsetMatrix);

            if (!this.isStage) { // Render nodes should be saved for non-stage canvases.
                let surface = buffer.surface;
                let renderNode = <BitmapNode>this.$renderNode;
                renderNode.drawData.length = 0;
                let width = surface.width;
                let height = surface.height;
                if (!this.bitmapData) {
                    this.bitmapData = new egret.BitmapData(surface);
                }
                else {
                    this.bitmapData.source = surface;
                    this.bitmapData.width = width;
                    this.bitmapData.height = height;
                }
                renderNode.image = this.bitmapData;
                renderNode.imageWidth = width;
                renderNode.imageHeight = height;
                renderNode.drawImage(0, 0, width, height, -this.offsetX, -this.offsetY, width / this.$canvasScaleX, height / this.$canvasScaleY);
            }

            return drawCalls;
        }

        private bitmapData: egret.BitmapData;

        /**
         * @private
         * Change the size of the canvas, because the canvas size modification will clear the original canvas.
         * So here we draw the original canvas to a new canvas and then exchange it with the original canvas.
         */
        public changeSurfaceSize(): void {
            let root = this.root;
            let oldOffsetX = this.offsetX;
            let oldOffsetY = this.offsetY;
            let bounds = this.root.$getOriginalBounds();
            var scaleX = this.$canvasScaleX;
            var scaleY = this.$canvasScaleY;
            this.offsetX = -bounds.x;
            this.offsetY = -bounds.y;
            this.offsetMatrix.setTo(this.offsetMatrix.a, 0, 0, this.offsetMatrix.d, this.offsetX, this.offsetY);
            let buffer = this.renderBuffer;
            // In chrome, a canvas equal to 256 * 256 will not enable GPU acceleration.
            let width = Math.max(257, bounds.width * scaleX);
            let height = Math.max(257, bounds.height * scaleY);
            if (this.offsetX == oldOffsetX &&
                this.offsetY == oldOffsetY &&
                buffer.surface.width == width &&
                buffer.surface.height == height) {
                return;
            }
            buffer.resize(width, height);
        }

        public static $canvasScaleFactor: number = 1;

        /**
         * @private
         */
        public static $canvasScaleX: number = 1;

        public static $canvasScaleY: number = 1;

        /**
         * @private
         */
        public static $setCanvasScale(x: number, y: number): void {
            DisplayList.$canvasScaleX = x;
            DisplayList.$canvasScaleY = y;
            if (egret.nativeRender) {
                egret_native.nrSetCanvasScaleFactor(DisplayList.$canvasScaleFactor, x, y);
            }
        }

        //for 3D&2D
        /**
         * @private
         * Stage rendering.
         */
        public $stageRenderToSurface = function () {
            sys.systemRenderer.render(this.root, this.renderBuffer, this.offsetMatrix);
        };
    }
}