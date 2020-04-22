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

/// <reference path="TextAtlasStrategy.ts" />
/// <reference path="../../../utils/HashObject.ts" />
/// <reference path="../../../utils/NumberUtils.ts" />
/// <reference path="../../../player/nodes/TextNode.ts" />
/// <reference path="../../../player/nodes/TextFormat.ts" />
/// <reference path="../../../player/nodes/TextFormat.ts" />

namespace egret.web
{
    /**
     * Test the switch, turning on will intercept the old font rendering.
     */
    export const textAtlasRenderEnable: boolean = false;
    
    /**
     * Test object, no need for singleton first, follow up the code, just a new one,
     * put it in the global context as a member variable.
     */
    export let __textAtlasRender__: TextAtlasRender = null;
    
    /**
     * I do n’t want to change the TextNode code.
     * I ’ll implement it in this way first, and then change it later.
     */
    export const property_drawLabel: string = 'DrawLabel';

    /**
     * Turn on this, rendered with textAtlas, all are red letters, and add a black box.
     */
    const textAtlasDebug: boolean = false;

    /**
     * Draw a line.
     */
    export class DrawLabel extends HashObject
    {
        // Pool to prevent repeated creation.
        private static pool: DrawLabel[] = [];

        // Record initial position.
        public anchorX: number = 0;

        public anchorY: number = 0;

        // Block to draw.
        public textBlocks: TextBlock[] = [];

        // Clear the data and return to the pool.
        private clear(): void {
            this.anchorX = 0;
            this.anchorY = 0;
            this.textBlocks.length = 0; // This is fine, the entity is stored in the book.
        }

        // Pool creation.
        public static create(): DrawLabel {
            const pool = DrawLabel.pool;
            if (pool.length === 0) {
                pool.push(new DrawLabel);
            }

            return pool.pop();
        }

        // Back to pool.
        public static back(drawLabel: DrawLabel, checkRepeat: boolean): void {
            if (!drawLabel) {
                return;
            }

            const pool = DrawLabel.pool;
            if (checkRepeat && pool.indexOf(drawLabel) >= 0) {
                console.error('DrawLabel.back repeat');
                return;
            }

            drawLabel.clear();
            pool.push(drawLabel);
        }
    }

    /**
     * Record style.
     */
    class StyleInfo extends HashObject
    {
        // Various record information.
        public readonly textColor: number;
        public readonly strokeColor: number;
        public readonly size: number;
        public readonly stroke: number;
        public readonly bold: boolean;
        public readonly italic: boolean;
        public readonly fontFamily: string;
        public readonly font: string;
        public readonly format: sys.TextFormat = null;
        public readonly description: string;

        //
        constructor(textNode: sys.TextNode, format: sys.TextFormat) {
            super();

            // Debug force red
            let saveTextColorForDebug = 0;
            if (textAtlasDebug) {
                saveTextColorForDebug = textNode.textColor;
                textNode.textColor = 0xff0000;
            }
            // Save
            this.textColor = textNode.textColor;
            this.strokeColor = textNode.strokeColor;
            this.size = textNode.size;
            this.stroke = textNode.stroke;
            this.bold = textNode.bold;
            this.italic = textNode.italic;
            this.fontFamily = textNode.fontFamily;
            this.format = format;
            this.font = getFontString(textNode, this.format);
            // Description used to generate hashcode
            const textColor = (!format.textColor ? textNode.textColor : format.textColor);
            const strokeColor = (!format.strokeColor ? textNode.strokeColor : format.strokeColor);
            const stroke = (!format.stroke ? textNode.stroke : format.stroke);
            const size = (!format.size ? textNode.size : format.size);
            //
            this.description = '' + this.font + '-' + size;
            this.description += '-' + toColorString(textColor);
            this.description += '-' + toColorString(strokeColor);
            if (stroke) {
                this.description += '-' + stroke * 2;
            }
            // reduction
            if (textAtlasDebug) {
                textNode.textColor = saveTextColorForDebug;
            }
        }
    }

    /**
     * Measuring fonts and drawing.
     */
    class CharImageRender extends HashObject
    {
        /// The string to be rendered.
        public char: string = '';
        /// StyleInfo.
        public styleInfo: StyleInfo = null;
        /// Generate hashcode string.
        public hashCodeString: string = '';
        /// Letters: style sets the unique value of the itinerary.
        public charWithStyleHashCode: number = 0;
        /// Measure the actual size.
        public measureWidth: number = 0;
        public measureHeight: number = 0;
        /// Offset after edge enlargement.
        public canvasWidthOffset: number = 0;
        public canvasHeightOffset: number = 0;
        /// Stroke record.
        public stroke2: number = 0;
        /// Accelerated search for Chinese.
        private static readonly chineseCharactersRegExp: RegExp = new RegExp("^[\u4E00-\u9FA5]$");
        private static readonly chineseCharacterMeasureFastMap: { [index: string]: number } = {};

        public reset(char: string, styleKey: StyleInfo): CharImageRender {
            this.char = char;
            this.styleInfo = styleKey;
            this.hashCodeString = char + ':' + styleKey.description;
            this.charWithStyleHashCode = NumberUtils.convertStringToHashCode(this.hashCodeString);
            this.canvasWidthOffset = 0;
            this.canvasHeightOffset = 0;
            this.stroke2 = 0;
            return this;
        }

        public measureAndDraw(targetCanvas: HTMLCanvasElement): void {
            const canvas = targetCanvas;
            if (!canvas) {
                return;
            }
            // Read settings
            const text = this.char;
            const format: sys.TextFormat = this.styleInfo.format;
            const textColor = (!format.textColor ? this.styleInfo.textColor : format.textColor);
            const strokeColor = (!format.strokeColor ? this.styleInfo.strokeColor : format.strokeColor);
            const stroke = (!format.stroke ? this.styleInfo.stroke : format.stroke);
            const size = (!format.size ? this.styleInfo.size : format.size);
            // Start measurement---------------------------------------
            this.measureWidth = this.measure(text, this.styleInfo, size);
            this.measureHeight = size;//this.styleInfo.size;
            // Adjust Reference TextField: $getRenderBounds(): Rectangle {
            let canvasWidth = this.measureWidth;
            let canvasHeight = this.measureHeight;
            const _strokeDouble = stroke * 2;
            if (_strokeDouble > 0) {
                canvasWidth += _strokeDouble * 2;
                canvasHeight += _strokeDouble * 2;
            }
            this.stroke2 = _strokeDouble;
            // Assignment
            canvas.width = canvasWidth = Math.ceil(canvasWidth) + 2 * 2;
            canvas.height = canvasHeight = Math.ceil(canvasHeight) + 2 * 2;
            this.canvasWidthOffset = (canvas.width - this.measureWidth) / 2;
            this.canvasHeightOffset = (canvas.height - this.measureHeight) / 2;
            // Keep all numberOfPrecision decimal places
            const numberOfPrecision = 3;
            const precision = Math.pow(10, numberOfPrecision);
            this.canvasWidthOffset = Math.floor(this.canvasWidthOffset * precision) / precision;
            this.canvasHeightOffset = Math.floor(this.canvasHeightOffset * precision) / precision;
            // Start drawing again---------------------------------------
            const context = egret.sys.getContext2d(canvas);
            context.save();
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.lineJoin = 'round';
            context.font = this.styleInfo.font;
            context.fillStyle = toColorString(textColor);
            context.strokeStyle = toColorString(strokeColor);
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (stroke) {
                context.lineWidth = stroke * 2;
                context.strokeText(text, canvas.width / 2, canvas.height / 2);
            }
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            context.restore();
        }

        private measure(text: string, styleKey: StyleInfo, textFlowSize: number): number {
            const isChinese = CharImageRender.chineseCharactersRegExp.test(text);
            if (isChinese) {
                if (CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]) {
                    return CharImageRender.chineseCharacterMeasureFastMap[styleKey.font];
                }
            }
            const measureTextWidth = egret.sys.measureText(text, styleKey.fontFamily, textFlowSize || styleKey.size, styleKey.bold, styleKey.italic);
            if (isChinese) {
                CharImageRender.chineseCharacterMeasureFastMap[styleKey.font] = measureTextWidth;
            }
            return measureTextWidth;
        }
    }

    // External class
    export class TextAtlasRender extends HashObject {

        private readonly book: Book = null;
        private readonly charImageRender: CharImageRender = new CharImageRender;
        private readonly textBlockMap: { [index: number]: TextBlock } = {};
        private _canvas: HTMLCanvasElement = null;
        private readonly textAtlasTextureCache: WebGLTexture[] = [];
        private readonly webglRenderContext: WebGLRenderContext = null;

        //
        constructor(webglRenderContext: WebGLRenderContext, maxSize: number, border: number) {
            super();
            this.webglRenderContext = webglRenderContext;
            this.book = new Book(maxSize, border);
        }

        // Analyze the textNode, extract the data, and hang the rendered information to the textNode
        public static analysisTextNodeAndFlushDrawLabel(textNode: sys.TextNode): void {
            if (!textNode) {
                return;
            }
            if (!__textAtlasRender__) {
                // Create, will be transferred to WebGLRenderContext
                const webglcontext = egret.web.WebGLRenderContext.getInstance(0, 0);
                // Initially 512, because there is no large-scale batching, it is best not to use this directly for old projects. A few TextFields with variable content can be used, so first do not need $maxTextureSize
                __textAtlasRender__ = new TextAtlasRender(webglcontext, textAtlasDebug ? 512 : 512/*webglcontext.$maxTextureSize*/, textAtlasDebug ? 12 : 1);
            }
            // Clear command
            textNode[property_drawLabel] = textNode[property_drawLabel] || [];
            let drawLabels = textNode[property_drawLabel] as DrawLabel[];
            for (const drawLabel of drawLabels) {
                // Go back
                DrawLabel.back(drawLabel, false);
            }
            drawLabels.length = 0;
            // Refill
            const offset = 4;
            const drawData = textNode.drawData;
            let anchorX = 0;
            let anchorY = 0;
            let labelString = '';
            let labelFormat: sys.TextFormat = {};
            let resultAsRenderTextBlocks: TextBlock[] = [];
            for (let i = 0, length = drawData.length; i < length; i += offset) {
                anchorX = drawData[i + 0] as number;
                anchorY = drawData[i + 1] as number;
                labelString = drawData[i + 2] as string;
                labelFormat = drawData[i + 3] as sys.TextFormat || {};
                resultAsRenderTextBlocks.length = 0;
                // Extract data
                __textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleInfo(textNode, labelFormat), resultAsRenderTextBlocks);
                // Pool creation + add command
                const drawLabel = DrawLabel.create();
                drawLabel.anchorX = anchorX;
                drawLabel.anchorY = anchorY;
                drawLabel.textBlocks = [].concat(resultAsRenderTextBlocks);
                drawLabels.push(drawLabel);
            }
        }

        // Convert string to TextBlock
        private convertLabelStringToTextAtlas(labelstring: string, styleKey: StyleInfo, resultAsRenderTextBlocks: TextBlock[]): void {
            const canvas = this.canvas;
            const charImageRender = this.charImageRender;
            const textBlockMap = this.textBlockMap;
            for (const char of labelstring) {
                // Do not create repeatedly
                charImageRender.reset(char, styleKey);
                if (textBlockMap[charImageRender.charWithStyleHashCode]) {
                    // Check duplicates
                    resultAsRenderTextBlocks.push(textBlockMap[charImageRender.charWithStyleHashCode]);
                    continue;
                }
                // Draw to canvas
                charImageRender.measureAndDraw(canvas);
                // Create a new text block
                const txtBlock = this.book.createTextBlock(char,
                    canvas.width, canvas.height,
                    charImageRender.measureWidth, charImageRender.measureHeight,
                    charImageRender.canvasWidthOffset, charImageRender.canvasHeightOffset,
                    charImageRender.stroke2);

                if (!txtBlock) {
                    continue;
                }
                // Need to draw
                resultAsRenderTextBlocks.push(txtBlock);
                // Quick record search
                textBlockMap[charImageRender.charWithStyleHashCode] = txtBlock;
                // Generate texture
                const page = txtBlock.page;
                if (!page.webGLTexture) {
                    page.webGLTexture = this.createTextTextureAtlas(page.pageWidth, page.pageHeight, textAtlasDebug);
                }
                const gl = this.webglRenderContext.context;
                page.webGLTexture[glContext] = gl;
                gl.bindTexture(gl.TEXTURE_2D, page.webGLTexture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                page.webGLTexture[UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                
            }
        }

        // Create a texture for a page
        private createTextTextureAtlas(width: number, height: number, debug: boolean): WebGLTexture {
            let texture: WebGLTexture = null;
            if (debug) {
                // Make a black background, easy to debug code
                const canvas = egret.sys.createCanvas(width, width);
                const context = egret.sys.getContext2d(canvas);
                context.fillStyle = 'black';
                context.fillRect(0, 0, width, width);
                texture = egret.sys.createTexture(this.webglRenderContext, canvas);
            }
            else {
                // Really
                texture = egret.sys._createTexture(this.webglRenderContext, width, height, null);
            }
            if (texture) {
                // Save it, you can delete it in the future, or view it
                this.textAtlasTextureCache.push(texture);
            }
            return texture;
        }

        // Canvas for CharImageRender
        private get canvas(): HTMLCanvasElement {
            if (!this._canvas) {
                // Use the default volume of 24
                this._canvas = egret.sys.createCanvas(24, 24);
            }
            return this._canvas;
        }
    }
}