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

/// <reference path="../states/State.ts" />
/// <reference path="../core/UIComponent.ts" />
/// <reference path="../utils/registerProperty.ts" />

namespace eui
{
    /**
     * @private
     */
    const enum Keys
    {
        contentWidth,
        contentHeight,
        scrollH,
        scrollV,
        scrollEnabled,
        touchThrough
    }

    /**
     * The Group class is defines the base class for layout component.
     * If the contents of the sub items are too large to scroll to show, you can wrap a Scroller component outside the
     * group (Give the instance of Group to *viewport* property of Scroller component).
     * The scroller component can adds a scrolling touch operation for the Group.
     *
     * @see http://edn.egret.com/cn/article/index/id/608 Simple container.
     * @defaultProperty elementsContent
     * @includeExample  extension/eui/components/GroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    export class Group extends egret.DisplayObjectContainer implements IViewport
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.initializeUIValues();
            this.$Group = {
                0: 0,        // contentWidth,
                1: 0,        // contentHeight,
                2: 0,        // scrollH,
                3: 0,        // scrollV,
                4: false,    // scrollEnabled,
                5: false,    // touchThrough
            };
            this.$stateValues.parent = this;
        }

        $Group:Object;

        /**
         * This property is Usually invoked in resolving an EXML for adding multiple children quickly.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public set elementsContent(value:egret.DisplayObject[]) {
            if (value) {
                let length = value.length;
                for (let i = 0; i < length; i++) {
                    this.addChild(value[i]);
                }
            }
        }

        /**
         * @private
         */
        $layout:LayoutBase = null;

        /**
         * The layout object for this container.
         * This object is responsible for the measurement and layout of the UIcomponent in the container.
         * @default eui.BasicLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get layout():LayoutBase {
            return this.$layout;
        }

        public set layout(value:LayoutBase) {
            this.$setLayout(value);
        }

        /**
         * @private
         * @param value
         */
        $setLayout(value:LayoutBase):boolean {
            if (this.$layout == value)
                return false;
            if (this.$layout) {
                this.$layout.target = null;
            }

            this.$layout = value;

            if (value) {
                value.target = this;
            }
            this.invalidateSize();
            this.invalidateDisplayList();

            return true;
        }

        /**
         * @copy eui.IViewport#contentWidth
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get contentWidth():number {
            return this.$Group[Keys.contentWidth];
        }

        /**
         * @copy eui.IViewport#contentHeight
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get contentHeight():number {
            return this.$Group[Keys.contentHeight];
        }

        /**
         * Sets the *contentWidth* and *contentHeight* properties.
         * This method is intended for layout class developers who should call it from *updateDisplayList()* methods.
         * @param width The new value of *contentWidth*.
         * @param height The new value of *contentHeight*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setContentSize(width:number, height:number):void {
            width = Math.ceil(+width || 0);
            height = Math.ceil(+height || 0);
            let values = this.$Group;
            let wChange = (values[Keys.contentWidth] !== width);
            let hChange = (values[Keys.contentHeight] !== height);
            if (!wChange && !hChange) {
                return;
            }
            values[Keys.contentWidth] = width;
            values[Keys.contentHeight] = height;
            if (wChange) {
                PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "contentWidth");
            }
            if (hChange) {
                PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "contentHeight");
            }
        }

        /**
         * @copy eui.IViewport#scrollEnabled
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get scrollEnabled():boolean {
            return this.$Group[Keys.scrollEnabled];
        }

        public set scrollEnabled(value:boolean) {
            value = !!value;
            let values = this.$Group;
            if (value === values[Keys.scrollEnabled])
                return;
            values[Keys.scrollEnabled] = value;
            this.updateScrollRect();
        }

        /**
         * @copy eui.IViewport#scrollH
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get scrollH():number {
            return this.$Group[Keys.scrollH];
        }

        public set scrollH(value:number) {
            value = +value || 0;
            let values = this.$Group;
            if (value === values[Keys.scrollH])
                return;
            values[Keys.scrollH] = value;
            if (this.updateScrollRect() && this.$layout) {
                this.$layout.scrollPositionChanged();
            }
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "scrollH");
        }

        /**
         * @copy eui.IViewport#scrollV
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get scrollV():number {
            return this.$Group[Keys.scrollV];
        }

        public set scrollV(value:number) {
            value = +value || 0;
            let values = this.$Group;
            if (value == values[Keys.scrollV])
                return;
            values[Keys.scrollV] = value;
            if (this.updateScrollRect() && this.$layout) {
                this.$layout.scrollPositionChanged();
            }
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "scrollV");
        }

        /**
         * @private
         * @returns
         */
        private updateScrollRect():boolean {
            let values = this.$Group;
            let hasClip = values[Keys.scrollEnabled];
            if (hasClip) {
                let uiValues = this.$UIComponent;
                this.scrollRect = egret.$TempRectangle.setTo(values[Keys.scrollH],
                    values[Keys.scrollV],
                    uiValues[sys.UIKeys.width], uiValues[sys.UIKeys.height]);
            }
            else if (this.$scrollRect) {
                this.scrollRect = null;
            }
            return hasClip;
        }

        /**
         * The number of layout element in this container.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get numElements():number {
            return this.$children.length;
        }

        /**
         * Returns the layout element at the specified index.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getElementAt(index:number):egret.DisplayObject {
            return this.$children[index];
        }
        public getVirtualElementAt(index:number):egret.DisplayObject{
            return this.getElementAt(index);
        }

        /**
         * Set the index range of the sub Visual element in container which support virtual layout.
         * This method is invalid in container which do not support virtual layout.
         * This method is usually invoked before layout. Override this method to release the invisible elements.
         * @param startIndex the start index of sub visual elements（include）
         * @param endIndex the end index of sub visual elements（include）
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setVirtualElementIndicesInView(startIndex:number, endIndex:number):void {

        }

        /**
         * When *true*, this property ensures that the entire bounds of the Group respond to touch events such as begin.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get touchThrough():boolean{
            return this.$Group[Keys.touchThrough];
        }

        public set touchThrough(value:boolean){
            this.$Group[Keys.touchThrough] = !!value;
        }

        /**
         * @private
         */
        $hitTest(stageX:number, stageY:number):egret.DisplayObject {
            let target = super.$hitTest(stageX, stageY);
            if (target || this.$Group[Keys.touchThrough]) {
                return target;
            }
            // Bug: When group.sacleX or scaleY == 0, click anywhere and click successfully
            // Although the width and height are detected once in super. $ HitTest, the function is not directly exited,
            // so it needs to be judged again; (width, height can not be judged)
            if (!this.$visible || !this.touchEnabled || this.scaleX === 0 || this.scaleY === 0 || this.width === 0 || this.height === 0) {
                return null;
            }
            let point = this.globalToLocal(stageX, stageY, egret.$TempPoint);
            let values = this.$UIComponent;
            let bounds = egret.$TempRectangle.setTo(0, 0, values[sys.UIKeys.width], values[sys.UIKeys.height]);
            let scrollRect = this.$scrollRect;
            if(scrollRect){
                bounds.x = scrollRect.x;
                bounds.y = scrollRect.y;
            }
            if (bounds.contains(point.x, point.y)) {
                return this;
            }
            return null;
        }

        /**
         * @private
         */
        $stateValues:sys.StateValues = new sys.StateValues();

        /**
         * The list of state for this component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public states:State[];

        /**
         * @copy eui.Component#currentState
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public currentState:string;

        /**
         * @copy eui.Skin#hasState()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public hasState:(stateName:string)=>boolean;

        /**
         * @private
         * Initialize all view states.
         */
        private initializeStates:(stage:egret.Stage)=>void;

        /**
         * @private
         * Apply the current view state.
         * Subclasses override this method to perform corresponding update operations when the view state changes.
         */
        private commitCurrentState:()=>void;

        /**
         * @copy eui.Component#invalidateState()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateState():void {
            let values = this.$stateValues;
            if (values.stateIsDirty) {
                return;
            }
            values.stateIsDirty = true;
            this.invalidateProperties();
        }

        /**
         * @copy eui.Component#getCurrentState()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState():string {
            return "";
        }


        //=======================UIComponent interface implementation===========================
        /**
         * @private
         * Please do not add any initial value to all variables defined by UIComponentImpl, they must be initialized here.
         */
        private initializeUIValues:()=>void;

        /**
         * @copy eui.Component#createChildren()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren():void {
            if (!this.$layout) {
                this.$setLayout(new BasicLayout());
            }
            this.initializeStates(this.$stage);
        }

        /**
         * @copy eui.Component#childrenCreated()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected childrenCreated():void {
        }

        /**
         * @copy eui.Component#commitProperties()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            sys.UIComponentImpl.prototype["commitProperties"].call(this);
            let values = this.$stateValues;
            if (values.stateIsDirty) {
                values.stateIsDirty = false;
                if (!values.explicitState) {
                    values.currentState = this.getCurrentState();
                    this.commitCurrentState();
                }
            }
        }

        /**
         * @copy eui.Component#measure()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measure():void {
            if (!this.$layout) {
                this.setMeasuredSize(0, 0);
                return;
            }
            this.$layout.measure();
        }

        /**
         * @copy eui.Component#updateDisplayList()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            if (this.$layout) {
                this.$layout.updateDisplayList(unscaledWidth, unscaledHeight);
            }
            this.updateScrollRect();
        }

        /**
         * @copy eui.Component#invalidateParentLayout()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected invalidateParentLayout():void {
        }

        /**
         * @private
         */
        $UIComponent:Object;

        /**
         * @private
         */
        $includeInLayout:boolean;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public includeInLayout:boolean;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public left:any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public right:any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public top:any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public bottom:any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public horizontalCenter:any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public verticalCenter:any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentWidth:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentHeight:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitWidth:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitHeight:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minWidth:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxWidth:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minHeight:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxHeight:number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateProperties():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateProperties():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateDisplayList():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateNow():void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds:egret.Rectangle):void {
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds:egret.Rectangle):void {
        }
    }

    sys.implementUIComponent(Group, egret.DisplayObjectContainer, true);
    sys.mixin(Group, sys.StateClient);
    registerProperty(Group, "elementsContent", "Array", true);
    registerProperty(Group, "states", "State[]");
}