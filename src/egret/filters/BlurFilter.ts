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

/// <reference path="../filters/Filter.ts" />

namespace egret
{
    /**
     * The BlurFilter class lets you apply a blur visual effect to display objects. A blur effect softens the details of an image.
     * You can produce blurs that range from a softly unfocused look to a Gaussian blur, a hazy appearance like viewing an image through semi-opaque glass. 
     * @version Egret 3.0.1
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947#模糊滤镜 Blur filter.
     */
    export class BlurFilter extends Filter
    {
        /**
         * Initializes a BlurFilter object.
         * @param blurX {number} The amount of horizontal blur. Valid values are 0 to 255 (floating point).
         * @param blurY {number} The amount of vertical blur. Valid values are 0 to 255 (floating point). 
         * @param quality {number} The number of times to apply the filter.
         * @version Egret 3.1.0
         * @platform Web
         */
        constructor(blurX:number = 4, blurY:number = 4, quality:number = 1) {
            super();
            let self = this;
            self.type = "blur";
            self.$blurX = blurX;
            self.$blurY = blurY;
            self.$quality = quality;

            self.blurXFilter = new BlurXFilter(blurX);

            self.blurYFilter = new BlurYFilter(blurY);

            self.onPropertyChange();
        }

        /**
         * @private
         */
        public blurXFilter:IBlurXFilter;

        /**
         * @private
         */
        public blurYFilter:IBlurYFilter;

        /**
         * @private
         */
        public $quality:number;
        
        /**
         * The amount of horizontal blur.
         * @version Egret 3.1.0
         * @platform Web
         */
        public get blurX():number {
            return this.$blurX;
        }

        public set blurX(value:number) {
            let self = this;
            if (self.$blurX == value) {
                return;
            }
            self.$blurX = value;
            self.blurXFilter.blurX = value;
            self.onPropertyChange();
        }
        
        /**
         * @private
         */
        public $blurX:number;
        
        /**
         * The amount of vertical blur.
         * @version Egret 3.1.0
         * @platform Web
         */
        public get blurY():number {
            return this.$blurY;
        }

        public set blurY(value:number) {
            let self = this;
            if (self.$blurY == value) {
                return;
            }
            self.$blurY = value;
            self.blurYFilter.blurY = value;
            self.onPropertyChange();
        }
        
        /**
         * @private
         */
        public $blurY:number;

        /**
         * @private
         */
        public $toJson():string {
            return '{"blurX": ' + this.$blurX + ', "blurY": ' + this.$blurY + ', "quality": 1}';
        }

        protected updatePadding(): void {
            let self = this;
            self.paddingLeft = self.blurX;
            self.paddingRight = self.blurX;
            self.paddingTop = self.blurY;
            self.paddingBottom = self.blurY;
        }

        public onPropertyChange(): void {
            let self = this;
            self.updatePadding();
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.setFilterPadding(self.blurXFilter.$id, 0, 0, self.paddingLeft, self.paddingRight);
                egret_native.NativeDisplayObject.setFilterPadding(self.blurYFilter.$id, self.paddingTop, self.paddingBottom, 0, 0);
                egret_native.NativeDisplayObject.setDataToFilter(self);
            }
        }
    }

    /**
     * @private 
     */
    export interface IBlurXFilter extends Filter {
        type:string;
        $uniforms:any;
        blurX:number;
    }

    /**
     * @private 
     */
    export interface IBlurYFilter extends Filter {
        type:string;
        $uniforms:any;
        blurY:number;
    }

    class BlurXFilter extends Filter implements IBlurXFilter {
        constructor(blurX:number = 4) {
            super();

            if (egret.nativeRender) {
                this.type = "blur";
            }
            else {
                this.type = "blurX";
            }

            this.$uniforms.blur = { x: blurX, y: 0 };
            this.onPropertyChange();
        }

        public set blurX(value:number) {
            this.$uniforms.blur.x = value;
        }

        public get blurX():number {
            return this.$uniforms.blur.x;
        }
    }

    class BlurYFilter extends Filter implements IBlurYFilter {
        constructor(blurY:number = 4) {
            super();

            if (egret.nativeRender) {
                this.type = "blur";
            }
            else {
                this.type = "blurY";
            }

            this.$uniforms.blur = { x: 0, y: blurY };
            this.onPropertyChange();
        }

        public set blurY(value:number) {
            this.$uniforms.blur.y = value;
        }

        public get blurY():number {
            return this.$uniforms.blur.y;
        }
    }
}