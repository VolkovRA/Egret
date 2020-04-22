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

/// <reference path="TextField.ts" />
/// <reference path="ITextElement.ts" />
/// <reference path="HorizontalAlign.ts" />
/// <reference path="VerticalAlign.ts" />

namespace egret
{
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class TextFieldUtils
    {
        /**
         * Get the number of the first line drawn.
         * @param textfield TextField.
         * @returns {number} Number of lines, starting from 0.
         * @private
         */
        static $getStartLine(textfield:egret.TextField):number {
            let values = textfield.$TextField;
            let textHeight:number = TextFieldUtils.$getTextHeight(textfield);
            let startLine:number = 0;
            let textFieldHeight: number = values[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight)) { //
                if (textHeight < textFieldHeight) { // The maximum height is smaller than the height that needs to be displayed.

                }
                else if (textHeight > textFieldHeight) { // The maximum height is greater than the height that needs to be displayed.
                    startLine = Math.max(values[sys.TextKeys.scrollV] - 1, 0);
                    startLine = Math.min(values[sys.TextKeys.numLines] - 1, startLine);
                }

                if (!values[sys.TextKeys.multiline]) {
                    startLine = Math.max(values[sys.TextKeys.scrollV] - 1, 0);
                    if (values[sys.TextKeys.numLines] > 0) {
                        startLine = Math.min(values[sys.TextKeys.numLines] - 1, startLine);    
                    }
                }
            }

            return startLine;
        }

        /**
         * Get horizontal ratio.
         * @param textfield TextField.
         * @returns {number} Horizontal scale.
         * @private
         */
        static $getHalign(textfield:egret.TextField):number {
            let lineArr:Array<egret.ILineElement>  = textfield.$getLinesArr2();
            let halign:number = 0;
            if (textfield.$TextField[sys.TextKeys.textAlign] == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (textfield.$TextField[sys.TextKeys.textAlign] == HorizontalAlign.RIGHT) {
                halign = 1;
            }

            if (textfield.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT && !textfield.$TextField[sys.TextKeys.multiline] && lineArr.length > 1) {
                halign = 0;
            }

            return halign;
        }

        /**
         * @private
         * @param textfield 
         * @returns 
         */
        static $getTextHeight(textfield:egret.TextField):number {
            let textHeight:number = (egret.TextFieldType.INPUT == textfield.$TextField[sys.TextKeys.type]
                && !textfield.$TextField[sys.TextKeys.multiline]) ? textfield.$TextField[sys.TextKeys.fontSize] : (textfield.$TextField[sys.TextKeys.textHeight] + (textfield.$TextField[sys.TextKeys.numLines] - 1) * textfield.$TextField[sys.TextKeys.lineSpacing]);
            return textHeight;
        }

        /**
         * Get vertical scale.
         * @param textfield TextField.
         * @returns {number} Vertical scale.
         * @private
         */
        static $getValign(textfield:egret.TextField):number{
            let textHeight:number = TextFieldUtils.$getTextHeight(textfield);
            //if (textfield.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
            //    if (textfield.$TextField[sys.TextKeys.multiline]) {
                    //return 0;
                //}
                //return 0.5;
            //}
            let textFieldHeight:number = textfield.$TextField[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight)) { //
                if (textHeight < textFieldHeight) { // The maximum height is smaller than the height that needs to be displayed.
                    let valign:number = 0;
                    if (textfield.$TextField[sys.TextKeys.verticalAlign] == VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (textfield.$TextField[sys.TextKeys.verticalAlign] == VerticalAlign.BOTTOM)
                        valign = 1;

                    return valign;
                }
            }
            return 0;
        }

        /**
         * Get text items based on x and y.
         * @param textfield TextField.
         * @param x x coordinate value.
         * @param y y coordinate value.
         * @returns text item.
         * @private
         */
        static $getTextElement(textfield:egret.TextField, x:number, y:number):ITextElement {
            let hitTextEle:IHitTextElement = TextFieldUtils.$getHit(textfield, x, y);

            let lineArr:Array<egret.ILineElement>  = textfield.$getLinesArr2();
            if (hitTextEle && lineArr[hitTextEle.lineIndex] && lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex]) {
                return lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex];
            }
            return null;
        }

        /**
         * Get text click block.
         * @param textfield TextField.
         * @param x X Coordinate value.
         * @param y Y Coordinate value.
         * @returns Text click block.
         * @private
         */
        static $getHit(textfield:egret.TextField, x:number, y:number):IHitTextElement {
            let lineArr:Array<egret.ILineElement>  = textfield.$getLinesArr2();
            if (textfield.$TextField[sys.TextKeys.textFieldWidth] == 0) { // Text clickable area
                return null;
            }
            let line:number = 0;

            let textHeight:number = TextFieldUtils.$getTextHeight(textfield);
            let startY:number = 0;
            let textFieldHeight:number = textfield.$TextField[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                let valign:number = TextFieldUtils.$getValign(textfield);
                startY = valign * (textFieldHeight - textHeight);
                if (startY != 0) {
                    y -= startY;
                }
            }

            let startLine:number = TextFieldUtils.$getStartLine(textfield);
            let lineH:number = 0;
            for (let i:number = startLine; i < lineArr.length; i++) {
                let lineEle:egret.ILineElement = lineArr[i];
                if (lineH + lineEle.height >= y) {
                    if (lineH < y) {
                        line = i + 1;
                    }
                    break;
                }
                else {
                    lineH += lineEle.height;
                }

                if (lineH + textfield.$TextField[sys.TextKeys.lineSpacing] > y) {
                    return null;
                }

                lineH += textfield.$TextField[sys.TextKeys.lineSpacing];
            }
            if(line == 0) {
                return null;
            }
            let lineElement:egret.ILineElement = lineArr[line - 1];


            let textFieldWidth:number = textfield.$TextField[sys.TextKeys.textFieldWidth];
            if (isNaN(textFieldWidth)) {
                textFieldWidth = textfield.textWidth;
            }
            let halign:number = TextFieldUtils.$getHalign(textfield);
            x -= halign * (textFieldWidth - lineElement.width);
            let lineW:number = 0;
            for (let i = 0; i < lineElement.elements.length; i++) {
                let iwTE:IWTextElement = lineElement.elements[i];

                if (lineW + iwTE.width <= x) {
                    lineW += iwTE.width;
                }
                else if (lineW < x) {
                    return {"lineIndex" : line - 1, "textElementIndex" : i};
                }
            }

            return null;
        }

        /**
         * Get how many lines are currently displayed.
         * @param textfield TextField.
         * @returns {number} The number of lines displayed.
         * @private
         */
        static $getScrollNum(textfield:egret.TextField):number {
            let scrollNum:number = 1;
            if (textfield.$TextField[sys.TextKeys.multiline]) {
                let height = textfield.height;
                let size = textfield.size;
                let lineSpacing = textfield.lineSpacing;
                scrollNum = Math.floor(height / (size + lineSpacing));
                let leftH = height - (size + lineSpacing) * scrollNum;
                if (leftH > size / 2) {
                    scrollNum++;
                }
            }
            return scrollNum;
        }
    }
}