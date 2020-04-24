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

// This js file will be automatically excluded in the release and all DEBUG and RELEASE constants in the code will be removed.
// If you need to write code that only runs in the debug version or only in the release version, you can refer to the following
// code block writing:
//
//  if(DEBUG){
//      console.log("debug");
//  }
//
// The above code block will simplify the code block with only one statement in the release:
//
//  console.log("release");
//

/**
 * Is debug mode compilation.
 * This value is set at the phase of code compression by uglify or other JavaScript compressor.
 * @version Egret 2.5
 * @platform Web,Native
 */
declare const DEBUG: boolean;

namespace egret
{
    /**
     * @private
     */
    export function $error(code: number, ...params: any[]): void {
        let text: string = egret.sys.tr.apply(null, arguments);
        if (DEBUG)
            egret.sys.$errorToFPS("Error #" + code + ": " + text);

        // Using this method to report an error can terminate subsequent code to continue running:
        throw new Error("#" + code + ": " + text);
    }

    /**
     * @private
     */
    export function $warn(code: number, ...params: any[]): void {
        if (DEBUG) {
            let text: string = egret.sys.tr.apply(null, arguments);

            egret.sys.$warnToFPS("Warning #" + code + ": " + text);
            egret.warn("Warning #" + code + ": " + text);
        }
    }

    /**
     * @private
     */
    export function getString(code: number, ...params: any[]): string {
        if (DEBUG)
            return egret.sys.tr.apply(egret.sys, arguments);
        else
            return "";
    }

    /**
     * @private
     */
    export function $markCannotUse(instance: any, property: string, defaultValue: any): void {
        if (DEBUG) {
            Object.defineProperty(instance.prototype, property, {
                get: function () {
                    egret.$warn(1009, getQualifiedClassName(instance), property);
                    return defaultValue;
                },
                set: function (value) {
                    egret.$error(1009, getQualifiedClassName(instance), property);
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}