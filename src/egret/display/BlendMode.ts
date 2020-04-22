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
    // Mixed mode is only partially supported on the web, and all are supported in Native.
    // The browsers currently supported by all platforms are: Layer, Alpha, Normal, Add, ERASE.
    // All browsers in IOS and some browsers in Android also support: Multiply, Screen, Lighten, Darken, Difference, Overlay, HardLight.
    // Only supported on the Native side: Subtract, Invert.

    /**
     * A class that provides constant values for visual blend mode effects.
     * These constants are used in the blendMode property of the DisplayObject class.
     * @see egret.DisplayObject#blendMode
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BlendMode.ts
     * @see http://edn.egret.com/cn/docs/page/108 The concept and implementation of display container.
     */
    export class BlendMode
    {
        /**
         * The display object appears in front of the background.
         * Pixel values of the display object override the pixel values of the background.
         * Where the display object is transparent, the background is visible.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        public static NORMAL:string = "normal";

        /**
         * Adds the values of the constituent colors of the display object to the colors of its background, applying a
         * ceiling of 0xFF. This setting is commonly used for animating a lightening dissolve between two objects.
         * 
         * For example, if the display object has a pixel with an RGB value of 0xAAA633, and the background pixel has an
         * RGB value of 0xDD2200, the resulting RGB value for the displayed pixel is 0xFFC833 (because 0xAA + 0xDD > 0xFF,
         * 0xA6 + 0x22 = 0xC8, and 0x33 + 0x00 = 0x33).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ADD:string = "add";

        /**
         * Erases the background based on the alpha value of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ERASE:string = "erase";
    }
}

namespace egret.sys
{
    let blendModeString = ["normal", "add", "erase"];
    let blendModeNumber = {};
    let length = blendModeString.length;
    for (let i = 0; i < length; i++) {
        let str = blendModeString[i];
        blendModeNumber[str] = i;
    }

    /**
     * @private
     * Convert the blendMode string to a number.
     */
    export function blendModeToNumber(blendMode:string):number {
        let num = blendModeNumber[blendMode];
        return num === undefined ? 0 : num;
    }

    /**
     * @private
     * Convert number to blendMode string.
     */
    export function numberToBlendMode(blendMode:number):string {
        let str = blendModeString[blendMode];
        return str === undefined ? "normal" : str;
    }
}