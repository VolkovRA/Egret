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
     */
    export let $callLaterFunctionList:any[] = [];

    /**
     * @private
     */
    export let $callLaterThisList:any[] = [];

    /**
     * @private
     */
    export let $callLaterArgsList:any[] = [];

    /**
     * Delay the function to run unless screen is redrawn.
     * @param method {Function} The function to be delayed to run.
     * @param thisObject {any} This reference of callback function.
     * @param ...args {any} Function parameter list.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/callLater.ts
     */
    export function callLater(method:Function, thisObject:any, ...args):void
    {
        $callLaterFunctionList.push(method);
        $callLaterThisList.push(thisObject);
        $callLaterArgsList.push(args);
    }

    /**
     * @private
     */
    export let $callAsyncFunctionList:any[] = [];

    /**
     * @private
     */
    export let $callAsyncThisList:any[] = [];

    /**
     * @private
     */
    export let $callAsyncArgsList:any[] = [];

    /**
     * Call functions asynchronously.
     * @param method {Function} The function to be called asynchronously.
     * @param thisObject {any} Function this reference.
     * @param ... args {any} Function parameter list.
     * @private
     */
    export function $callAsync(method:Function, thisObject:any, ...args):void
    {
        $callAsyncFunctionList.push(method);
        $callAsyncThisList.push(thisObject);
        $callAsyncArgsList.push(args);
    }
}