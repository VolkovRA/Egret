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

/// <reference path="supportClasses/DefaultAssetAdapter.ts" />

namespace eui
{
    /**
     * The Image control lets you show JPEG, PNG, and GIF files at runtime.
     * Image inherit Bitmap，so you can set the *bitmapData* property to show the data.
     * You can also set the *source* property, Image will auto load and show the url image or the bitmapData.
     * @event egret.Event.COMPLETE Dispatched when the image loaded complete.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ImageExample.ts
     */
    export class Image extends egret.Bitmap implements UIComponent
    {
        /**
         * Constructor.
         * @param source The source used for the bitmap fill. The value can be a string or an instance of *egret.Texture*
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(source?: string | egret.Texture) {
            super();
            this.initializeUIValues();
            if (source) {
                this.source = source;
            }
        }

        /**
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when *fillMode* is *BitmapFillMode.SCALE*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get scale9Grid(): egret.Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value: egret.Rectangle) {
            this.$setScale9Grid(value);
            this.invalidateDisplayList();
        }

        /**
         * Determines how the bitmap fills in the dimensions.
         * * When set to *BitmapFillMode.CLIP*, the bitmap ends at the edge of the region.
         * * When set to *BitmapFillMode.REPEAT*, the bitmap repeats to fill the region.
         * * When set to *BitmapFillMode.SCALE*, the bitmap stretches to fill the region.
         * @default *BitmapFillMode.SCALE*
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get fillMode(): string {
            return this.$fillMode;
        }

        public set fillMode(value: string) {
            if (value == this.$fillMode) {
                return;
            }
            super.$setFillMode(value);
            this.invalidateDisplayList();
        }

        //if egret
        $setFillMode(value: string): boolean {
            let result: boolean = super.$setFillMode(value);
            this.invalidateDisplayList();

            return result;
        }

        //endif*/

        /**
         * @private
         */
        private sourceChanged: boolean = false;

        /**
         * @private
         */
        private _source: string | egret.Texture = null;

        /**
         * The source used for the bitmap fill. the value can be a string or an instance of *egret.Texture*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get source(): string | egret.Texture {
            return this._source;
        }

        public set source(value: string | egret.Texture) {
            if (value == this._source) {
                return;
            }
            this._source = value;
            if (this.$stage) {
                this.parseSource();
            }
            else {
                this.sourceChanged = true;
                this.invalidateProperties();
            }
        }

        $setTexture(value: egret.Texture): boolean {
            if (value == this.$texture) {
                return false;
            }
            let result: boolean = super.$setTexture(value);
            this.sourceChanged = false;
            this.invalidateSize();
            this.invalidateDisplayList();

            return result;
        }

        /**
         * @private
         * Parse source.
         */
        private parseSource(): void {
            this.sourceChanged = false;
            let source = this._source;
            if (source && typeof source == "string") {

                getAssets(<string>this._source, function (data) {
                    if (source !== this._source)
                        return;
                    if (!egret.is(data, "egret.Texture")) {
                        return;
                    }
                    this.$setTexture(data);
                    if (data) {
                        this.dispatchEventWith(egret.Event.COMPLETE);
                    }
                    else if (DEBUG) {
                        egret.$warn(2301, source);
                    }
                }, this);
            }
            else {
                this.$setTexture(<egret.Texture>source);
            }
        }

        $measureContentBounds(bounds: egret.Rectangle): void {
            let image = this.$texture;
            if (image) {
                let uiValues = this.$UIComponent;
                let width = uiValues[sys.UIKeys.width];
                let height = uiValues[sys.UIKeys.height];
                if (isNaN(width) || isNaN(height)) {
                    bounds.setEmpty();
                    return;
                }
                if (this.$fillMode == "clip") {
                    if (width > image.$getTextureWidth()) {
                        width = image.$getTextureWidth();
                    }
                    if (height > image.$getTextureHeight()) {
                        height = image.$getTextureHeight();
                    }
                }
                bounds.setTo(0, 0, width, height);
            }
            else {
                bounds.setEmpty();
            }
        }

        /**
         * @private
         * @param context
         */
        // $updateRenderNode(): void {
        //     let image = this.$bitmapData;
        //     if (!image) {
        //         return;
        //     }
        //     let uiValues = this.$UIComponent;
        //     let width = uiValues[sys.UIKeys.width];
        //     let height = uiValues[sys.UIKeys.height];
        //     if (width === 0 || height === 0) {
        //         return;
        //     }

        //     let scale9Grid = this.scale9Grid || this.$texture["scale9Grid"];
        //     if (scale9Grid) {
        //         if (this.$renderNode instanceof egret.sys.NormalBitmapNode) {
        //             this.$renderNode = new egret.sys.BitmapNode();
        //         }
        //         egret.sys.BitmapNode.$updateTextureDataWithScale9Grid(<egret.sys.NormalBitmapNode>this.$renderNode, this.$bitmapData, scale9Grid,
        //             this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight,
        //             this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight,
        //             width, height, this.$sourceWidth, this.$sourceHeight, this.$smoothing);
        //     }
        //     else {
        //         if (this.fillMode == egret.BitmapFillMode.REPEAT && this.$renderNode instanceof egret.sys.NormalBitmapNode) {
        //             this.$renderNode = new egret.sys.BitmapNode();
        //         }
        //         egret.sys.BitmapNode.$updateTextureData(<egret.sys.NormalBitmapNode>this.$renderNode, this.$bitmapData,
        //             this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight,
        //             this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight,
        //             width, height, this.$sourceWidth, this.$sourceHeight, this.$fillMode, this.$smoothing);
        //     }
        // }

        //=======================UIComponent interface implementation===========================
        /**
         * @private
         * Please do not add any initial value to all variables defined by UIComponentImpl, they must be initialized here.
         */
        private initializeUIValues: () => void;

        /**
         * @copy eui.UIComponent#createChildren
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren(): void {
            if (this.sourceChanged) {
                this.parseSource();
            }
        }

        /**
         * @private
         * Set the width and height of the component.
         * This method is different from directly setting the width and height properties,
         * will not affect the explicit mark size attribute.
         */
        protected setActualSize(w: number, h: number): void {
            sys.UIComponentImpl.prototype["setActualSize"].call(this, w, h);
            super.$setWidth(w);
            super.$setHeight(h);
        }

        /**
         * @copy eui.UIComponent#childrenCreated
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected childrenCreated(): void {
        }

        /**
         * @copy eui.UIComponent#commitProperties
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties(): void {
            sys.UIComponentImpl.prototype["commitProperties"].call(this);
            if (this.sourceChanged) {
                this.parseSource();
            }
        }

        /**
         * @copy eui.UIComponent#measure
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measure(): void {
            let texture = this.$texture;
            if (texture) {
                this.setMeasuredSize(texture.$getTextureWidth(), texture.$getTextureHeight());
            }
            else {
                this.setMeasuredSize(0, 0);
            }
        }

        /**
         * @copy eui.UIComponent#updateDisplayList
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            this.$renderDirty = true;
        }

        /**
         * @copy eui.UIComponent#invalidateParentLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected invalidateParentLayout(): void {
        }

        /**
         * @private
         */
        $UIComponent: Object;

        /**
         * @private
         */
        $includeInLayout: boolean;

        /**
         * @copy eui.UIComponent#includeInLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public includeInLayout: boolean;

        /**
         * @copy eui.UIComponent#left
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public left: any;

        /**
         * @copy eui.UIComponent#right
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public right: any;

        /**
         * @copy eui.UIComponent#top
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public top: any;

        /**
         * @copy eui.UIComponent#bottom
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public bottom: any;

        /**
         * @copy eui.UIComponent#horizontalCenter
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public horizontalCenter: any;

        /**
         * @copy eui.UIComponent#verticalCenter
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public verticalCenter: any;

        /**
         * @copy eui.UIComponent#percentWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentWidth: number;

        /**
         * @copy eui.UIComponent#percentHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentHeight: number;

        /**
         * @copy eui.UIComponent#explicitWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitWidth: number;

        /**
         * @copy eui.UIComponent#explicitHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitHeight: number;

        /**
         * @copy eui.UIComponent#minWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minWidth: number;

        /**
         * @copy eui.UIComponent#maxWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxWidth: number;

        /**
         * @copy eui.UIComponent#minHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minHeight: number;

        /**
         * @copy eui.UIComponent#maxHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxHeight: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width: number, height: number): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateProperties(): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateProperties(): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateSize(): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?: boolean): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList(): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateDisplayList(): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateNow(): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x: number, y: number): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds: egret.Rectangle): void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds: egret.Rectangle): void {
        }
    }

    sys.implementUIComponent(Image, egret.Bitmap);
    registerProperty(Image, "scale9Grid", "egret.Rectangle");
}