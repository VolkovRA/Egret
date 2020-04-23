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

namespace eui
{
    /**
     * The LayoutBase class defines the base class for all Spark layouts.
     * To create a custom layout that works with the Spark containers,
     * you must extend *LayoutBase* or one of its subclasses.
     *
     * Subclasses must implement the *updateDisplayList()*
     * method, which positions and sizes the *target* GroupBase's elements, and
     * the *measure()* method, which calculates the default
     * size of the *target*.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class LayoutBase extends egret.EventDispatcher
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        $target:Group = null;

        /**
         * The Group container whose elements are measured, sized and positioned by this layout.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get target():Group {
            return this.$target;
        }

        public set target(value:Group) {
            if (this.$target === value)
                return;
            this.$target = value;
            this.clearVirtualLayoutCache();
        }

        /**
         * @private
         */
        $useVirtualLayout:boolean = false;

        /**
         * To configure a container to use virtual layout, set the *useVirtualLayout* property
         * to *true* for the layout associated with the container.
         * Only DataGroup with layout set to VerticalLayout,
         * HorizontalLayout, or TileLayout supports virtual layout.
         * Layout subclasses that do not support virtualization must prevent changing
         * this property.
         * 
         * @default false
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get useVirtualLayout():boolean {
            return this.$useVirtualLayout;
        }

        public set useVirtualLayout(value:boolean) {
            value = !!value;
            if (this.$useVirtualLayout == value)
                return;

            this.$useVirtualLayout = value;
            this.dispatchEventWith("useVirtualLayoutChanged");

            if (this.$useVirtualLayout && !value)
                this.clearVirtualLayoutCache();
            if (this.target)
                this.target.invalidateDisplayList();
        }

        /**
         * @private
         */
        $typicalWidth:number = 71;

        /**
         * @private
         */
        $typicalHeight:number = 22;

        /**
         * Set this size of a typical element.
         * @param width The height of element.
         * @param height The width of element.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setTypicalSize(width:number, height:number):void {
            width = +width || 71;
            height = +height || 22;
            if (width !== this.$typicalWidth || height !== this.$typicalHeight) {
                this.$typicalWidth = width;
                this.$typicalHeight = height;
                if (this.$target) {
                    this.$target.invalidateSize();
                }
            }
        }

        /**
         * Called when the *verticalScrollPosition* or
         * *horizontalScrollPosition* properties change.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public scrollPositionChanged():void {
        }

        /**
         * When *useVirtualLayout* is *true*, this method can be used by the layout target
         * to clear cached layout information when the target changes.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public clearVirtualLayoutCache():void {
        }

        /**
         * Called by the target after a layout element has been added and
         * before the target's size and display list are validated.
         * Layouts that cache per element state, like virtual layouts, can
         * override this method to update their cache.
         * @param index The index of the element that was added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public elementAdded(index:number):void {
        }

        /**
         * This method must is called by the target after a layout element
         * has been removed and before the target's size and display list are
         * validated.
         * Layouts that cache per element state, like virtual layouts, can
         * override this method to update their cache.
         * @param index The index of the element that was added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public elementRemoved(index:number):void {
        }

        /**
         * Return the indices of the element visible within this Group.
         * @return The indices of the visible element.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getElementIndicesInView():number[]{
            return null;
        }

        /**
         * Measures the target's default size based on its content.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public measure():void {
        }

        /**
         * Sizes and positions the target's elements.
         * @param unscaledWidth Specifies the width of the target, in pixels, in the targets's coordinates.
         * @param unscaledHeight Specifies the height of the component, in pixels, in the target's coordinates.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateDisplayList(width:number, height:number):void {
        }
    }
}