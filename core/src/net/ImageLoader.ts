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

/// <reference path="../events/EventDispatcher.ts" />

namespace egret
{
    /**
     * The Loader class is used to load image (JPG, PNG, or GIF) files. Use the load() method to initiate loading.
     * The loaded image data is in the data property of ImageLoader.
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.IOErrorEvent.IO_ERROR Dispatched when the net request is failed.
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/net/ImageLoaderExample.ts
     * @see http://edn.egret.com/cn/docs/page/590 Load bitmap file.
     */
    export interface ImageLoader extends EventDispatcher
    {
        /**
         * The data received from the load operation.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        data:BitmapData;

        /**
         * Specifies whether or not cross-site Access-Control requests should be made when loading a image from foreign origins.
         * 
         * Possible values are: "anonymous", "use-credentials" or null.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        crossOrigin:string;

        /**
         * Start a load operation.
         * 
         * Note: Calling this method for an already active request (one for which load() has already been
         * called) will abort the last load operation immediately.
         * @param url The address of the image file to be loaded.
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(url:string):void;
    }

    /**
     * Creates a ImageLoader object.
     * @version Egret 2.4
     * @platform Web,Native
     */
    export let ImageLoader:
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @platform Web,Native
         */
        new():ImageLoader;

        /**
         * Specifies whether to enable cross-origin resource sharing.
         * If ImageLoader instance has been set crossOrigin property will be used to set the property.
         * @version Egret 2.5.7
         * @platform Web,Native
         */
        crossOrigin:string;
    };
}