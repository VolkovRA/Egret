
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

/// <reference path="../../events/EventDispatcher.ts" />
/// <reference path="../../events/Event.ts" />
/// <reference path="../ImageLoader.ts" />

namespace egret.web
{
    let winURL = window["URL"] || window["webkitURL"];

    /**
     * @private
     * ImageLoader Classes can be used to load image (JPG, PNG, or GIF) files. Use the load () method to start loading.
     * The loaded image object data will be stored in the ImageLoader.data property.
     */
    export class WebImageLoader extends EventDispatcher implements ImageLoader
    {
        /**
         * @private
         * Use the load () method to load the successful BitmapData image data.
         */
        public data:BitmapData = null;

        /**
         * @private
         * When loading an image from another site, specify whether to enable cross-domain resource sharing (CORS), the default value is null.
         * Can be set to "anonymous", "use-credentials" or null, set to other values will be equivalent to "anonymous".
         */
        private _crossOrigin:string = null;

        /**
         * @private
         * Mark whether crossOrigin has been set, use the set properties after setting.
         */
        private _hasCrossOriginSet:boolean = false;

        public set crossOrigin(value:string) {
            this._hasCrossOriginSet = true;
            this._crossOrigin = value;
        }

        public get crossOrigin():string {
            return this._crossOrigin;
        }

        /**
         * @private
         * Specify whether to enable cross-domain resource sharing.
         * If the ImageLoader instance has the crossOrigin property set, the set property will be used.
         */
        public static crossOrigin:string = null;

        /**
         * @private
         */
        private currentImage:HTMLImageElement = null;

        /**
         * @private
         */
        private currentURL:string;

        /**
         * @private
         */
        private request:WebHttpRequest = null;

        /**
         * @private
         * Start an image load. Note: If the load request has already been called before, calling load () again will terminate the previous request and start a new load.
         * @param url The address of the image file to be loaded.
         */
        public load(url:string):void {
            if (Html5Capatibility._canUseBlob
                && url.indexOf("wxLocalResource:") != 0 // We cannot use blob for WeChat.
                && url.indexOf("data:") != 0
                && url.indexOf("http:") != 0
                && url.indexOf("https:") != 0) {// If it is a base64-encoded or cross-domain access picture, use Image.src directly to parse.
                let request = this.request;
                if (!request) {
                    request = this.request = new egret.web.WebHttpRequest();
                    request.addEventListener(egret.Event.COMPLETE, this.onBlobLoaded, this);
                    request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onBlobError, this);
                    request.responseType = "blob";
                }
                if (DEBUG) {
                    this.currentURL = url;
                }
                request.open(url);
                request.send();
            }
            else {
                this.loadImage(url);
            }
        }

        /**
         * @private
         */
        private onBlobLoaded(event:egret.Event):void {
            let blob:Blob = this.request.response;
            this.request = undefined;
            this.loadImage(winURL.createObjectURL(blob));
        }

        /**
         * @private
         */
        private onBlobError(event:egret.Event):void {
            this.dispatchIOError(this.currentURL);
            this.request = undefined;
        }

        /**
         * @private
         */
        private loadImage(src:string):void {
            let image = new Image();
            this.data = null;
            this.currentImage = image;
            if(this._hasCrossOriginSet) {
                if (this._crossOrigin) {
                    image.crossOrigin = this._crossOrigin;
                }
            }
            else {
                if(WebImageLoader.crossOrigin) {
                    image.crossOrigin = WebImageLoader.crossOrigin;
                }
            }
            /*else {
                if (image.hasAttribute("crossOrigin")) {// Compatible with cheetah
                    image.removeAttribute("crossOrigin");
                }
            }*/
            image.onload = this.onImageComplete.bind(this);
            image.onerror = this.onLoadError.bind(this);
            image.src = src;
        }

        /**
         * @private
         */
        private onImageComplete(event):void {
            let image = this.getImage(event);
            if (!image) {
                return;
            }
            this.data = new egret.BitmapData(image);
            let self = this;
            window.setTimeout(function ():void {
                self.dispatchEventWith(Event.COMPLETE);
            }, 0);
        }

        /**
         * @private
         */
        private onLoadError(event):void {
            let image = this.getImage(event);
            if (!image) {
                return;
            }
            this.dispatchIOError(image.src);
        }

        private dispatchIOError(url:string):void {
            let self = this;
            window.setTimeout(function ():void {
                if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
                    $error(1011, url);
                }
                self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            }, 0);
        }

        /**
         * @private
         */
        private getImage(event:any):HTMLImageElement {
            let image:HTMLImageElement = event.target;
            let url:string = image.src;
            if (url.indexOf("blob:") == 0) {
                try {
                    winURL.revokeObjectURL(image.src);
                }
                catch(e) {
                    egret.$warn(1037);
                }
            }
            image.onerror = null;
            image.onload = null;
            if (this.currentImage !== image) {
                return null;
            }
            this.currentImage = null;
            return image;
        }
    }

    ImageLoader = WebImageLoader;
}