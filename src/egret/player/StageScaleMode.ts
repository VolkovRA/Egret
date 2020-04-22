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

namespace egret
{
    /**
     * StageScaleMode class provides values for the stage zoom mode.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/player/StageScaleMode.ts
     */
    export class StageScaleMode
    {
        /**
         * Do not scale application content.
         * Even when you change the player viewport size, it remains unchanged.
         * If the player is smaller than the viewport content, possibly with some cropping.
         * 
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) always with the player viewport size consistent.
         */
        public static NO_SCALE:string = "noScale";

        /**
         * Keep the original aspect ratio scaling application content, after scaling a wide directions application content to
         * fill the viewport players on both sides in the other direction may not be wide enough and left black bars.
         * 
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization
         * incoming external application content size.
         */
        public static SHOW_ALL:string = "showAll";

        /**
         * Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content
         * to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.
         * 
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming
         * external application content size.
         */
        public static NO_BORDER:string = "noBorder";

        /**
         * Do not keep the original aspect ratio scaling application content, after scaling application content just
         * fill the player viewport.
         * 
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization
         * incoming external application content size.
         */
        public static EXACT_FIT:string = "exactFit";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal
         * and vertical directions to fill the viewport player, but only to keep the contents of the original application
         * constant width, height may change.
         * 
         * In this mode, the stage width (Stage.stageWidth) is always equal to initialize external incoming application content width.
         * Stage height (Stage.stageHeight) by the current scale with the player viewport height decision.
         */
        public static FIXED_WIDTH:string = "fixedWidth";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and
         * vertical directions to fill the viewport player, but only to keep the contents of the original application constant
         * height, width may change.
         * 
         * In this mode, the stage height (Stage.stageHeight) is always equal to initialize external incoming application content
         * height. Stage width (Stage.stageWidth) by the current scale with the player viewport width decision.
         */
        public static FIXED_HEIGHT:string = "fixedHeight";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and
         * vertical directions to fill the viewport player,a narrow direction may not be wide enough and fill.
         * 
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with
         * the player viewport size.
         */
        public static FIXED_NARROW:string = "fixedNarrow";

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and
         * vertical directions to fill the viewport player, a wide direction may exceed the viewport and the player is cut.
         * 
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with
         * the player viewport size.
         */
        public static FIXED_WIDE:string = "fixedWide";
    }
}