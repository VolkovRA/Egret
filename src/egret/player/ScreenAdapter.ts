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

/// <reference path="StageScaleMode.ts" />
/// <reference path="../utils/HashObject.ts" />
/// <reference path="../system/Capabilities.ts" />

namespace egret.sys
{
    /**
     * @private
     * Screen adapter interface.
     * When the player's viewport size changes, the screen adapter will be used to calculate the
     * current corresponding stage display size.
     */
    export interface IScreenAdapter
    {
        /**
         * @private
         * Calculate the stage display size.
         * @param scaleMode The current zoom mode.
         * @param screenWidth player viewport width.
         * @param screenHeight player viewport height.
         * @param contentWidth Initialize the content width.
         * @param contentHeight Initialize content height.
         */
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number,
            contentWidth: number, contentHeight: number): StageDisplaySize;
    }

    /**
     * @private
     * Stage display size data.
     */
    export interface StageDisplaySize
    {
        /**
         * @private
         * Stage width.
         */
        stageWidth: number;

        /**
         * @private
         * Stage height.
         */
        stageHeight: number;

        /**
         * @private
         * If the display width is different from the stage width, scaling will occur.
         */
        displayWidth: number;

        /**
         * @private
         * If the display height is different from the height of the stage, zooming will occur.
         */
        displayHeight: number;
    }

    /**
     * @private
     * Screen adapter instance, the developer can implement an instance of the IScreenAdapter
     * interface by assigning a value to this variable, thereby injecting a custom screen adapter.
     */
    export let screenAdapter: IScreenAdapter;

    /**
     * @private
     * The screen adapter is implemented by default, and developers can implement screen adapters with custom rules.
     * And assign the instance of the adapter to egret.sys.screenAdapter during initial loading, thus replacing the default adapter.
     */
    export class DefaultScreenAdapter extends HashObject implements IScreenAdapter
    {
        /**
         * @private
         */
        public constructor() {
            super();
        }

        /**
         * @private
         * Calculate the stage display size.
         * @param scaleMode The current zoom mode.
         * @param screenWidth Player viewport width.
         * @param screenHeight Player viewport height.
         * @param contentWidth Initialize the content width.
         * @param contentHeight Initialize content height.
         */
        public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number,
            contentWidth: number, contentHeight: number): StageDisplaySize {
            let displayWidth = screenWidth;
            let displayHeight = screenHeight;
            let stageWidth = contentWidth;
            let stageHeight = contentHeight;
            let scaleX = (screenWidth / stageWidth) || 0;
            let scaleY = (screenHeight / stageHeight) || 0;
            switch (scaleMode) {
                case StageScaleMode.EXACT_FIT:
                    break;
                case StageScaleMode.FIXED_HEIGHT:
                    stageWidth = Math.round(screenWidth / scaleY);
                    break;
                case StageScaleMode.FIXED_WIDTH:
                    stageHeight = Math.round(screenHeight / scaleX);
                    break;
                case StageScaleMode.NO_BORDER:
                    if (scaleX > scaleY) {
                        displayHeight = Math.round(stageHeight * scaleX);
                    }
                    else {
                        displayWidth = Math.round(stageWidth * scaleY);
                    }
                    break;
                case StageScaleMode.SHOW_ALL:
                    if (scaleX > scaleY) {
                        displayWidth = Math.round(stageWidth * scaleY);
                    }
                    else {
                        displayHeight = Math.round(stageHeight * scaleX);
                    }
                    break;
                case StageScaleMode.FIXED_NARROW:
                    if (scaleX > scaleY) {
                        stageWidth = Math.round(screenWidth / scaleY);
                    }
                    else {
                        stageHeight = Math.round(screenHeight / scaleX);
                    }
                    break;
                case StageScaleMode.FIXED_WIDE:
                    if (scaleX > scaleY) {
                        stageHeight = Math.round(screenHeight / scaleX);
                    }
                    else {
                        stageWidth = Math.round(screenWidth / scaleY);
                    }
                    break;
                default:
                    stageWidth = screenWidth;
                    stageHeight = screenHeight;
                    break;
            }
            if (egret.Capabilities.runtimeType != egret.RuntimeType.WXGAME) {
                // The width and height are not an integer multiple of 2 will cause problems with picture drawing
                if (stageWidth % 2 != 0) {
                    stageWidth += 1;
                }
                if (stageHeight % 2 != 0) {
                    stageHeight += 1;
                }
                if (displayWidth % 2 != 0) {
                    displayWidth += 1;
                }
                if (displayHeight % 2 != 0) {
                    displayHeight += 1;
                }
            }
            return {
                stageWidth: stageWidth,
                stageHeight: stageHeight,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            };
        }
    }
}