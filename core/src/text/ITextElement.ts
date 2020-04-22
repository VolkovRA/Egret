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
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface IHitTextElement
    {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineIndex:number;

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        textElementIndex:number;
    }

    /**
     * Text Style.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface ITextStyle
    {
        /**
         * Text color.
         * @version Egret 2.4
         * @platform Web,Native
         * @see http://edn.egret.com/cn/docs/page/146 Basic structure of mixed text in multiple styles.
         */
        textColor?:number;

        /**
         * Stroke color.
         * @version Egret 2.4
         * @platform Web,Native
         */
        strokeColor?:number;

        /**
         * Size.
         * @version Egret 2.4
         * @platform Web,Native
         */
        size?:number;

        /**
         * Stroke width.
         * @version Egret 2.4
         * @platform Web,Native
         */
        stroke?:number;

        /**
         * Whether bold.
         * @version Egret 2.4
         * @platform Web,Native
         */
        bold?:boolean;

        /**
         * Whether italic.
         * @version Egret 2.4
         * @platform Web,Native
         */
        italic?:boolean;

        /**
         * Font family.
         * @version Egret 2.4
         * @platform Web,Native
         */
        fontFamily?:string;

        /**
         * Link events or address.
         * @version Egret 2.4
         * @platform Web,Native
         */
        href?:string;

        /**
         * Target.
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        target?:string;

        /**
         * Is underlined.
         * @version Egret 2.4
         * @platform Web,Native
         */
        underline?:boolean;
    }

    /**
     * Used to build the basic structure of text with a variety of mixed styles, mainly for setting textFlow property.
     * @see http://edn.egret.com/cn/docs/page/146 Text mixed in a variety of style.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface ITextElement
    {
        /**
         * String content.
         * @version Egret 2.4
         * @platform Web,Native
         */
        text:string;

        /**
         * Text style.
         * @version Egret 2.4
         * @platform Web,Native
         */
        style?:ITextStyle;
    }

    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface IWTextElement extends ITextElement
    {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        width:number;
    }

    /**
     * One-line data format for final text parsing.
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface ILineElement
    {
        /**
         * Text width.
         * @version Egret 2.4
         * @platform Web,Native
         */
        width:number;

        /**
         * Text occupancy height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        height:number;

        /**
         * Current total number of text characters. (Including line breaks)
         * @version Egret 2.4
         * @platform Web,Native
         */
        charNum:number;

        /**
         * Does it contain line breaks.
         * @version Egret 2.4
         * @platform Web,Native
         */
        hasNextLine:boolean;

        /**
         * Text content of this line.
         * @version Egret 2.4
         * @platform Web,Native
         */
        elements:Array<IWTextElement>;
    }
}