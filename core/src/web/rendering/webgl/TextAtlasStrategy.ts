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

/// <reference path="../../../utils/HashObject.ts" />

/**
 * A management model, including: back-> page-> line-> textBlock.
 */
namespace egret.web
{
    export class TextBlock extends HashObject
    {
        private readonly _width: number = 0;
        private readonly _height: number = 0;
        private readonly _border: number = 0;
        public line: Line = null;
        public x: number = 0;
        public y: number = 0;
        public u: number = 0;
        public v: number = 0;
        public tag: string = '';
        public readonly measureWidth: number = 0;
        public readonly measureHeight: number = 0;
        public readonly canvasWidthOffset: number = 0;
        public readonly canvasHeightOffset: number = 0;
        public readonly stroke2: number = 0;
        
        constructor(width: number, height: number, measureWidth: number, measureHeight: number, canvasWidthOffset: number, canvasHeightOffset: number, stroke2: number, border: number) {
            super();
            this._width = width;
            this._height = height;
            this._border = border;
            this.measureWidth = measureWidth;
            this.measureHeight = measureHeight;
            this.canvasWidthOffset = canvasWidthOffset;
            this.canvasHeightOffset = canvasHeightOffset;
            this.stroke2 = stroke2;
        }

        public get border(): number {
            return this._border;
        }

        public get width(): number {
            return this._width + this.border * 2;
        }

        public get height(): number {
            return this._height + this.border * 2;
        }

        public get contentWidth(): number {
            return this._width;
        }

        public get contentHeight(): number {
            return this._height;
        }

        public get page(): Page {
            return this.line ? this.line.page : null;
        }

        public updateUV(): boolean {
            const line = this.line;
            if (!line) {
                return false; // It is wrong to not belong to any line.
            }
            this.u = line.x + this.x + this.border * 1;
            this.v = line.y + this.y + this.border * 1;
            return true;
        }

        public get subImageOffsetX(): number {
            const line = this.line;
            if (!line) {
                return 0;
            }
            return line.x + this.x + this.border;
        }

        public get subImageOffsetY(): number {
            const line = this.line;
            if (!line) {
                return 0;
            }
            return line.y + this.y + this.border;
        }
    }

    export class Line extends HashObject {
        public page: Page = null;
        private readonly textBlocks: TextBlock[] = [];
        public dynamicMaxHeight: number = 0;
        public readonly maxWidth: number = 0;
        public x: number = 0;
        public y: number = 0;

        constructor(maxWidth: number) {
            super();
            this.maxWidth = maxWidth;
        }

        public isCapacityOf(textBlock: TextBlock): boolean {
            if (!textBlock) {
                return false;
            }
            //
            let posx = 0;
            let posy = 0;
            const lastTxtBlock = this.lastTextBlock();
            if (lastTxtBlock) {
                posx = lastTxtBlock.x + lastTxtBlock.width;
                posy = lastTxtBlock.y;
            }
            //
            if (posx + textBlock.width > this.maxWidth) {
                return false; // Not enough width
            }
            //
            if (this.dynamicMaxHeight > 0) {
                if (textBlock.height > this.dynamicMaxHeight || (textBlock.height / this.dynamicMaxHeight < 0.5)) {
                    return false; // If there is already a dynamic height, here, either the height is not enough or less than the 0.6 gap of the dynamic height, it will not be filled
                }
            }
            return true;
        }

        private lastTextBlock(): TextBlock {
            const textBlocks = this.textBlocks;
            if (textBlocks.length > 0) {
                return textBlocks[textBlocks.length - 1];
            }
            return null;
        }

        public addTextBlock(textBlock: TextBlock, needCheck: boolean): boolean {
            //
            if (!textBlock) {
                return false;
            }
            //
            if (needCheck) {
                if (!this.isCapacityOf(textBlock)) {
                    return false;
                }
            }
            //
            let posx = 0;
            let posy = 0;
            const lastTxtBlock = this.lastTextBlock();
            if (lastTxtBlock) {
                posx = lastTxtBlock.x + lastTxtBlock.width;
                posy = lastTxtBlock.y;
            }
            //
            textBlock.x = posx;
            textBlock.y = posy;
            textBlock.line = this;
            this.textBlocks.push(textBlock);
            this.dynamicMaxHeight = Math.max(this.dynamicMaxHeight, textBlock.height);
            return true;
        }
    }

    export class Page extends HashObject {
        public readonly lines: Line[] = [];
        public readonly pageWidth: number = 0;
        public readonly pageHeight: number = 0;
        public webGLTexture: WebGLTexture = null;

        constructor(pageWidth: number, pageHeight: number) {
            super();
            this.pageWidth = pageWidth;
            this.pageHeight = pageHeight;
        }

        public addLine(line: Line): boolean {
            if (!line) {
                return false;
            }
            //
            let posx = 0;
            let posy = 0;
            //
            const lines = this.lines;
            if (lines.length > 0) {
                const lastLine = lines[lines.length - 1];
                posx = lastLine.x;
                posy = lastLine.y + lastLine.dynamicMaxHeight;
            }
            if (line.maxWidth > this.pageWidth) {
                console.error('line.maxWidth = ' + line.maxWidth + ', ' + 'this.pageWidth = ' + this.pageWidth);
                return false; // Not enough width
            }
            if (posy + line.dynamicMaxHeight > this.pageHeight) {
                return false; // full
            }
            // update data
            line.x = posx;
            line.y = posy;
            line.page = this;
            this.lines.push(line);
            return true;
        }
    }

    export class Book extends HashObject {
        private readonly _pages: Page[] = [];
        private _sortLines: Line[] = [];
        private readonly _maxSize: number = 1024;
        private readonly _border: number = 1;

        constructor(maxSize: number, border: number) {
            super();
            this._maxSize = maxSize;
            this._border = border;
        }

        public addTextBlock(textBlock: TextBlock): boolean {
            const result = this._addTextBlock(textBlock);
            if (!result) {
                return false;
            }
            // Update uv.
            textBlock.updateUV();
            // No need to add.
            let exist = false;
            const cast = result as [Page, Line];
            const _sortLines = this._sortLines;
            for (const line of _sortLines) {
                if (line === cast[1]) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                _sortLines.push(cast[1]);
            }
            // Rearrange.
            this.sort();
            return true;
        }

        private _addTextBlock(textBlock: TextBlock): [Page, Line] | null {
            if (!textBlock) {
                return null;
            }
            if (textBlock.width > this._maxSize || textBlock.height > this._maxSize) {
                // console.log('this._maxSize = ' + this._maxSize + ', textBlock.width = ' + textBlock.width + ', textBlock.height = ' + textBlock.height);
                return null;
            }
            // Find the most suitable.
            const _sortLines = this._sortLines;
            for (let i = 0, length = _sortLines.length; i < length; ++i) {
                const line = _sortLines[i];
                if (!line.isCapacityOf(textBlock)) {
                    continue;
                }
                if (line.addTextBlock(textBlock, false)) {
                    return [line.page, line];
                }
            }
            // Make a new line.
            const newLine = new Line(this._maxSize);
            if (!newLine.addTextBlock(textBlock, true)) {
                console.error('_addTextBlock !newLine.addTextBlock(textBlock, true)');
                return null;
            }
            // Insert into existing page.
            const _pages = this._pages;
            for (let i = 0, length = _pages.length; i < length; ++i) {
                const page = _pages[i];
                if (page.addLine(newLine)) {
                    return [page, newLine];
                }
            }
            // Nothing, just make a new page.
            // Add target line.
            const newPage = this.createPage(this._maxSize, this._maxSize);
            if (!newPage.addLine(newLine)) {
                console.error('_addText newPage.addLine failed');
                return null;
            }
            return [newPage, newLine];
        }
        
        private createPage(pageWidth: number, pageHeight: number): Page {
            const newPage = new Page(pageWidth, pageHeight);
            this._pages.push(newPage);
            return newPage;
        }

        private sort(): void {
            if (this._sortLines.length <= 1) {
                return;
            }
            const sortFunc = (a: Line, b: Line): number => {
                return (a.dynamicMaxHeight < b.dynamicMaxHeight) ? -1 : 1;
            }
            this._sortLines = this._sortLines.sort(sortFunc);
        }

        public createTextBlock(tag: string, width: number, height: number, measureWidth: number, measureHeight: number, canvasWidthOffset: number, canvasHeightOffset: number, stroke2: number): TextBlock {
            const txtBlock = new TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, this._border);
            if (!this.addTextBlock(txtBlock)) {
                // It's almost impossible to get here unless the memory allocation is gone.
                // It has not yet reached the point of submitting textures, now it is all virtual.
                return null;
            }
            txtBlock.tag = tag;
            return txtBlock;
        }
    }
}