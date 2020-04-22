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
     * Type of operation.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export namespace RuntimeType
    {
        /**
         * Running on Web.
         * @version Egret 2.4
         * @platform Web,Native
         */
        export const WEB = "web";

        /**
         * Running on NATIVE.
         * @version Egret 2.4
         * @deprecated
         * @platform Web,Native
         */
        export const NATIVE = "native";

        /**
         * Running on Runtime2.0
         * @version Egret 5.1.5
         * @platform Web,Native
         */
        export const RUNTIME2 = "runtime2";

        /**
         * Running on Alipay.
         * @version Egret 5.2.33
         * @platform All
         */
        export const MYGAME = "mygame";

        /**
         * Running on WeChat mini game.
         * @version Egret 5.1.5
         * @platform All
         */
        export const WXGAME = "wxgame";

        /**
         * Running on Baidu mini game.
         * @version Egret 5.2.13
         * @platform All
         */
        export const BAIDUGAME = "baidugame";

        /**
         * Running on Xiaomi quick game.
         * @version Egret 5.2.14
         * @platform All
         */
        export const QGAME = "qgame";

        /**
         * Running on OPPO mini game.
         * @version Egret 5.2.14
         * @platform All
         */
        export const OPPOGAME = "oppogame";

         /**
         * Running on QQ mini game.
         * @version Egret 5.2.25
         * @platform All
         */
        export const QQGAME = "qqgame";

        /**
         * Running on vivo mini game.
         * @version Egret 5.2.23
         * @platform All
         */
        export const VIVOGAME = "vivogame";
    }

    export interface SupportedCompressedTexture
    {
        pvrtc: boolean;
        etc1: boolean;
    }

    /**
     * The Capabilities class provides properties that describe the system and runtime that are hosting the application.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    export class Capabilities
    {
        /**
         * Specifies the language code of the system on which the content is running.
         * The language is specified as a lowercase two-letter language code from ISO 639-1.
         * For Chinese, an additional uppercase two-letter country code from ISO 3166
         * distinguishes between Simplified and Traditional Chinese.
         * 
         * The following table lists the possible values,but not limited to them:
         * * Simplified - Chinese  zh-CN
         * * Traditional - Chinese  zh-TW
         * * English - en
         * * Japanese - ja
         * * Korean - ko
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        static readonly language: string = "zh-CN";

        /**
         * Specifies whether the system is running in a mobile device. (Such as a mobile phone or tablet)
         * @version Egret 2.4
         * @platform Web,Native
         */
        static readonly isMobile: boolean;

        /**
         * Specifies the current operating system.
         * The os property can return the following strings:
         * * iPhone - "iOS"
         * * Android Phone - "Android"
         * * Windows Phone - "Windows Phone"
         * * Windows Desktop - "Windows PC"
         * * Mac Desktop - "Mac OS"
         * * Unknown OS - "Unknown"
         * @version Egret 2.4
         * @platform Web,Native
         */
        static readonly os: string = "Unknown";

        /**
         * It indicates the current type of operation.
         * RuntimeType property returns the following string:
         * * Run on Web - egret.RuntimeType.WEB
         * * Run on Runtime2.0 - egret.RuntimeType.RUNTIME2
         * * Run on WeChat mini game - egret.RuntimeType.WXGAME
         * @version Egret 2.4
         * @platform Web,Native
         */
        static readonly runtimeType: string = egret.RuntimeType.WEB;

        /**
         * Version of Egret.
         * @type {string}
         * @version Egret 3.2.0
         * @platform Web,Native
         */
        public static readonly engineVersion: string = "5.2.33";

        /**
         * Current render mode.
         * @type {string}
         * @version Egret 3.0.7
         * @platform Web,Native
         */
        static readonly renderMode: string = "Unknown";

        /**
         * Clients border width.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version Egret 3.1.3
         * @platform Web,Native
         */
        static readonly boundingClientWidth: number = 0;

        /**
         * Clients border height.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version Egret 3.1.3
         * @platform Web,Native
         */
        static readonly boundingClientHeight: number = 0;

        /**
         * Supported compressed texture.
         * @version Egret 5.2.19
         * @platform Web,Native
         */
        static supportedCompressedTexture: SupportedCompressedTexture;
    }
}