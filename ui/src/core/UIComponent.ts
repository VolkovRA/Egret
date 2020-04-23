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

/// <reference path="Validator.ts" />

namespace eui
{
    export function getAssets(source: string, callback: (content: any) => void, thisObject: any) {
        let adapter: IAssetAdapter = egret.getImplementation("eui.IAssetAdapter");
        if (!adapter) {
            adapter = new DefaultAssetAdapter();
        }
        adapter.getAsset(source, content => {
            callback.call(thisObject, content);
        }, this);
    }

    export function getTheme(source: string, callback: (content: any) => void) {

        let adapter: IThemeAdapter = egret.getImplementation("eui.IThemeAdapter");
        if (!adapter) {
            adapter = new DefaultThemeAdapter();
        }
        adapter.getTheme(source, (data) => {
            callback(data)
        }, (e) => { console.log(e) }, this);
    }

    /**
     * The UIComponent class is the base class for all visual components, both skinnable and nonskinnable.
     * @event egret.Event.RESIZE Dispatch when the component is resized.
     * @event eui.UIEvent.MOVE Dispatch when the object has moved.
     * @event eui.UIEvent.CREATION_COMPLETE  Dispatch when the component has finished its construction,
     * property processing, measuring, layout, and drawing.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export interface UIComponent extends egret.DisplayObject
    {
        ///**
        // * Create subitems, subclasses override this method to complete the initialization of component subitems,
        // * be sure to call super.createChildren() to complete the initialization of the parent component.
        // */
        // protected createChildren():void{}

        ///**
        // * Submit properties.
        // * Subclasses should override this method to apply properties after calling the invalidateProperties() method.
        // */
        // protected commitProperties():void{}

        ///**
        // * Measuring component dimensions.
        // */
        // protected measure():void{}

        ///**
        // * Update display list.
        // */
        // protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{}

        ///**
        // * Mark the size and display list of the parent container as invalid.
        // */
        // protected invalidateParentLayout():void{}

        //$getWidth():number;
        //$setWidth(value:number):void;

        //$getHeight():number;
        //$setHeight(value:number):void;

        /**
         * @private
         */
        $UIComponent: Object;

        /**
         * @private
         */
        $includeInLayout: boolean;

        /**
         * Specifies whether this component is included in the layout of the parent container.
         * If *false*, the object size and position are not affected by its parent container's layout.
         * This value is different with *visible*. the object size and position is still affected by its parent
         * container's layout when the *visible* is false.
         * @default true
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        includeInLayout: boolean;

        /**
         * The horizontal distance in pixels from the left edge of the component to the anchor target's left edge.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        left: any;

        /**
         * The horizontal distance in pixels from the right edge of the component to the anchor target's right edge.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        right: any;

        /**
         * The vertical distance in pixels from the top edge of the component to the anchor target's top edge.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        top: any;

        /**
         * The vertical distance in pixels from the bottom edge of the component to the anchor target's bottom edge.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        bottom: any;

        /**
         * The horizontal distance in pixels from the center of the component to the center of the anchor target's content area.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        horizontalCenter: any;

        /**
         * The vertical distance in pixels from the center of the component to the center of the anchor target's content area.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        verticalCenter: any;

        /**
         * Specifies the width of a component as a percentage of its parent's size. Allowed values are 0-100.
         * Setting the *width* or *explicitWidth* properties resets this property to NaN.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        percentWidth: number;

        /**
         * Specifies the height of a component as a percentage of its parent's size.
         * Allowed values are 0-100. Setting the *height* or *explicitHeight* properties resets this property to NaN.
         * @default NaN
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        percentHeight: number;

        /**
         * Number that specifies the explicit width of the component, in pixels, in the component's coordinates.
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        readonly explicitWidth: number;

        /**
         * Number that specifies the explicit height of the component, in pixels, in the component's coordinates.
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        readonly explicitHeight: number;

        /**
         * The minimum recommended width of the component to be considered by the parent during layout.
         * This value is in the component's coordinates, in pixels.
         * The default value depends on the component's implementation.
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        minWidth: number;

        /**
         * The maximum recommended width of the component to be considered by the parent during layout.
         * This value is in the component's coordinates, in pixels.
         * The default value of this property is set by the component developer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        maxWidth: number;

        /**
         * The minimum recommended height of the component to be considered by the parent during layout.
         * This value is in the component's coordinates, in pixels.
         * The default value depends on the component's implementation.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        minHeight: number;

        /**
         * The maximum recommended height of the component to be considered by the parent during layout.
         * This value is in the component's coordinates, in pixels.
         * The default value of this property is set by the component developer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        maxHeight: number;

        /**
         * Set the result of measuring.
         * @param width Measured width.
         * @param height Measured height.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        setMeasuredSize(width: number, height: number): void;

        /**
         * Marks a component so that its *commitProperties()* method gets
         * called during a later screen update.
         *
         * Invalidation is a useful mechanism for eliminating duplicate
         * work by delaying processing of changes to a component until a
         * later screen update.
         *
         * For example, if you want to change the text color and size,
         * it would be wasteful to update the color immediately after you
         * change it and then update the size when it gets set.
         * It is more efficient to change both properties and then render
         * the text with its new size and color once.
         *
         * Invalidation methods rarely get called.
         * In general, setting a property on a component automatically
         * calls the appropriate invalidation method.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        invalidateProperties(): void;

        /**
         * Used by layout logic to validate the properties of a component by calling the *commitProperties()* method.
         * In general, subclassers should override the *commitProperties()* method and not this method.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        validateProperties(): void;

        /**
         * Marks a component so that its *measure()*
         * method gets called during a later screen update.
         *
         * Invalidation is a useful mechanism for eliminating duplicate
         * work by delaying processing of changes to a component until a
         * later screen update.
         *
         * For example, if you want to change the text and font size,
         * it would be wasteful to update the text immediately after you
         * change it and then update the size when it gets set.
         * It is more efficient to change both properties and then render
         * the text with its new size once.
         *
         * Invalidation methods rarely get called.
         * In general, setting a property on a component automatically
         * calls the appropriate invalidation method.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        invalidateSize(): void;

        /**
         * Validates the measured size of the component.
         * @param recursive If *true*, call this method on the objects children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        validateSize(recursive?: boolean): void;

        /**
         * Marks a component so that its *updateDisplayList()*
         * method gets called during a later screen update.
         *
         * Invalidation is a useful mechanism for eliminating duplicate
         * work by delaying processing of changes to a component until a
         * later screen update.
         *
         * For example, if you want to change the width and height,
         * it would be wasteful to update the component immediately after you
         * change the width and then update again with the new height.
         * It is more efficient to change both properties and then render
         * the component with its new size once.
         *
         * Invalidation methods rarely get called.
         * In general, setting a property on a component automatically
         * calls the appropriate invalidation method.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        invalidateDisplayList(): void;

        /**
         * Validates the position and size of children and draws other visuals.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        validateDisplayList(): void;

        /**
         * Validate and update the properties and layout of this object
         * and redraw it, if necessary.
         *
         * Processing properties that require substantial computation are normally
         * not processed until the script finishes executing.
         *
         * For example setting the *width* property is delayed, because it can
         * require recalculating the widths of the objects children or its parent.
         * Delaying the processing prevents it from being repeated
         * multiple times if the script sets the *width* property more than once.
         * This method lets you manually override this behavior.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        validateNow(): void;

        /**
         * Sets the layout size of the element.
         * This is the size that the element uses to draw on screen.
         *
         * If the *width* and/or *height* parameters are left unspecified (NaN),
         * EUI sets the element's layout size to its preferred width and/or preferred height.
         *
         * Note that calls to the *setLayoutBoundSize()* method can affect the layout position, so
         * call *setLayoutBoundPosition()* after calling *setLayoutBoundSize()*.
         *
         * @param layoutWidth The element's layout width.
         * @param layoutHeight The element's layout height.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;

        /**
         * Sets the coordinates that the element uses to draw on screen.
         *
         * Note that calls to the *setLayoutBoundSize()* method can affect the layout position, so
         * call *setLayoutBoundPosition()* after calling *setLayoutBoundSize()*.
         *
         * @param x The x-coordinate of the top-left corner of the bounding box.
         * @param y The y-coordinate of the top-left corner of the bounding box.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        setLayoutBoundsPosition(x: number, y: number): void;

        /**
         * Get the layout bounds that the element uses to draw on screen.
         * Commonly used in the *updateDisplayList()* method in parent container.
         * 
         * Priority: layout > explicit > measure.
         * The result of this method is contains *scale* and *rotation*.
         *
         * @param bounds the instance of *egret.Rectangle* can set result.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        getLayoutBounds(bounds: egret.Rectangle): void;

        /**
         * Get the element's preferred bounds.
         * Commonly used in the *measure()* method in parent container.
         * 
         * Priority: explicit > measure.
         * 
         * The result of this method is contains *scale* and *rotation*.
         *
         * @param bounds the instance of *egret.Rectangle* can set result.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        getPreferredBounds(bounds: egret.Rectangle): void;
    }
}

namespace eui.sys
{
    /**
     * @private
     */
    export const enum UIKeys
    {
        left,
        right,
        top,
        bottom,
        horizontalCenter,
        verticalCenter,
        percentWidth,
        percentHeight,
        explicitWidth,
        explicitHeight,
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        measuredWidth,
        measuredHeight,
        oldPreferWidth,
        oldPreferHeight,
        oldX,
        oldY,
        oldWidth,
        oldHeight,
        invalidatePropertiesFlag,
        invalidateSizeFlag,
        invalidateDisplayListFlag,
        layoutWidthExplicitlySet,
        layoutHeightExplicitlySet,
        initialized
    }

    let UIComponentClass = "eui.UIComponent";

    function isDeltaIdentity(m: egret.Matrix): boolean {
        return (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1);
    }

    let validator = new sys.Validator();

    /**
     * @private
     * EUI display object base class template.
     * Just as the default implementation of UIComponent, it provides code templates for egret.sys.implemenetUIComponenet () method.
     * Note: The super keyword is not allowed to directly access the super class method in this class.
     * Always use the this. $Super attribute to access.
     */
    export class UIComponentImpl extends egret.DisplayObject implements eui.UIComponent
    {
        /**
         * @private
         * Constructor.
         */
        public constructor() {
            super();
            this.initializeUIValues();
        }

        /**
         * @private
         * Please do not add any initial value to all variables defined by UIComponentImpl, they must be initialized here.
         */
        private initializeUIValues(): void {
            this.$UIComponent =
            {
                0: NaN,       // left
                1: NaN,       // right
                2: NaN,       // top
                3: NaN,       // bottom
                4: NaN,       // horizontalCenter
                5: NaN,       // verticalCenter
                6: NaN,       // percentWidth
                7: NaN,       // percentHeight
                8: NaN,       // explicitWidth
                9: NaN,       // explicitHeight
                10: 0,        // width
                11: 0,        // height
                12: 0,        // minWidth
                13: 100000,   // maxWidth
                14: 0,        // minHeight
                15: 100000,   // maxHeight
                16: 0,        // measuredWidth
                17: 0,        // measuredHeight
                18: NaN,      // oldPreferWidth
                19: NaN,      // oldPreferHeight
                20: 0,        // oldX
                21: 0,        // oldY
                22: 0,        // oldWidth
                23: 0,        // oldHeight
                24: true,     // invalidatePropertiesFlag
                25: true,     // invalidateSizeFlag
                26: true,     // invalidateDisplayListFlag
                27: false,    // layoutWidthExplicitlySet
                28: false,    // layoutHeightExplicitlySet
                29: false,    // initialized
            };
            this.$includeInLayout = true;
            //if egret
            this.$touchEnabled = true;
            //endif*/
        }

        /**
         * @private
         * Subclasses override this method to perform some initialization subitem operations.
         * This method is called only once when the component is first added to the stage.
         * Please call super.createChildren() to complete the initialization of the parent component
         */
        protected createChildren(): void {
        }

        /**
         * @private
         * After the child is created, this method is executed after createChildren().
         */
        protected childrenCreated(): void {
        }

        /**
         * @private
         * Submit properties.
         * Subclasses should override this method to apply properties after calling the invalidateProperties() method.
         */
        protected commitProperties(): void {
            let values = this.$UIComponent;
            if (values[UIKeys.oldWidth] != values[UIKeys.width] || values[UIKeys.oldHeight] != values[UIKeys.height]) {
                this.dispatchEventWith(egret.Event.RESIZE);
                values[UIKeys.oldWidth] = values[UIKeys.width];
                values[UIKeys.oldHeight] = values[UIKeys.height];
            }
            if (values[UIKeys.oldX] != this.$getX() || values[UIKeys.oldY] != this.$getY()) {
                UIEvent.dispatchUIEvent(this, UIEvent.MOVE);
                values[UIKeys.oldX] = this.$getX();
                values[UIKeys.oldY] = this.$getY();
            }
        }

        /**
         * @private
         * Measuring component dimensions.
         */
        protected measure(): void {
        }

        /**
         * @private
         * Update display list.
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
        }

        $super: any;

        $UIComponent: Object;

        $includeInLayout: boolean;

        /**
         * @private
         * Specify whether this component is included in the layout of the parent container.
         * If false, the parent container ignores this component during the measurement and layout stages.
         * The default value is true.
         * Note that the visible attribute is different from this attribute.
         * If visible is set to false, the parent container will still lay it out.
         */
        public get includeInLayout(): boolean {
            return this.$includeInLayout;
        }

        public set includeInLayout(value: boolean) {
            value = !!value;
            if (this.$includeInLayout === value)
                return;
            this.$includeInLayout = true;
            this.invalidateParentLayout();
            this.$includeInLayout = value;
        }

        /**
         * @private
         * @param stage
         * @param nestLevel
         */
        $onAddToStage(stage: egret.Stage, nestLevel: number): void {
            this.$super.$onAddToStage.call(this, stage, nestLevel);
            this.checkInvalidateFlag();
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.initialized]) {
                values[sys.UIKeys.initialized] = true;
                this.createChildren();
                this.childrenCreated();
                UIEvent.dispatchUIEvent(this, UIEvent.CREATION_COMPLETE);
            }
        }

        /**
         * @private
         * Check the attribute invalidation flag and apply.
         */
        private checkInvalidateFlag(event?: Event): void {
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidatePropertiesFlag]) {
                validator.invalidateProperties(this);
            }
            if (values[sys.UIKeys.invalidateSizeFlag]) {
                validator.invalidateSize(this);
            }
            if (values[sys.UIKeys.invalidateDisplayListFlag]) {
                validator.invalidateDisplayList(this);
            }
        }

        /**
         * @private
         * Distance from parent container to the left.
         */
        public get left(): any {
            return this.$UIComponent[UIKeys.left];
        }

        public set left(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }

            let values = this.$UIComponent;
            if (values[UIKeys.left] === value)
                return;
            values[UIKeys.left] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Distance from the right side of the parent container.
         */
        public get right(): any {
            return this.$UIComponent[UIKeys.right];
        }

        public set right(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.right] === value)
                return;
            values[UIKeys.right] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Distance from top of parent container.
         */
        public get top(): any {
            return this.$UIComponent[UIKeys.top];
        }

        public set top(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.top] === value)
                return;
            values[UIKeys.top] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Distance from the bottom of the parent container.
         */
        public get bottom(): any {
            return this.$UIComponent[UIKeys.bottom];
        }

        public set bottom(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.bottom] == value)
                return;
            values[UIKeys.bottom] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * The distance from the horizontal center position in the parent container.
         */
        public get horizontalCenter(): any {
            return this.$UIComponent[UIKeys.horizontalCenter];
        }

        public set horizontalCenter(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.horizontalCenter] === value)
                return;
            values[UIKeys.horizontalCenter] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * The distance from the vertical center position in the parent container.
         */
        public get verticalCenter(): any {
            return this.$UIComponent[UIKeys.verticalCenter];
        }

        public set verticalCenter(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.verticalCenter] === value)
                return;
            values[UIKeys.verticalCenter] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Percentage relative to the width of the parent container.
         */
        public get percentWidth(): number {
            return this.$UIComponent[UIKeys.percentWidth];
        }

        public set percentWidth(value: number) {
            value = +value;
            let values = this.$UIComponent;
            if (values[UIKeys.percentWidth] === value)
                return;
            values[UIKeys.percentWidth] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Percentage relative to the height of the parent container.
         */
        public get percentHeight(): number {
            return this.$UIComponent[UIKeys.percentHeight];
        }

        public set percentHeight(value: number) {
            value = +value;
            let values = this.$UIComponent;
            if (values[UIKeys.percentHeight] === value)
                return;
            values[UIKeys.percentHeight] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Externally specified width.
         */
        public get explicitWidth(): number {
            return this.$UIComponent[UIKeys.explicitWidth];
        }

        /**
         * @private
         * Externally specified height.
         */
        public get explicitHeight(): number {
            return this.$UIComponent[UIKeys.explicitHeight];
        }

        /**
         * @private
         * The width of the component, the default value is egret.NaN, set to NaN will automatically
         * calculate the size using the component's measure() method.
         */
        $getWidth(): number {
            this.validateSizeNow();
            return this.$UIComponent[UIKeys.width];
        }

        /**
         * @private
         * @param value
         */
        $setWidth(value: number): boolean {
            value = +value;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.width] === value && values[UIKeys.explicitWidth] === value)
                return false;
            values[UIKeys.explicitWidth] = value;
            if (isNaN(value))
                this.invalidateSize();
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentLayout();

            return true;
        }

        /**
         * @private
         * Verify your size immediately.
         */
        private validateSizeNow(): void {
            this.validateSize(true);
            this.updateFinalSize();
        }

        /**
         * @private
         * Component height, the default value is NaN, set to NaN will use the component's measure()
         * method to automatically calculate the size.
         */
        $getHeight(): number {
            this.validateSizeNow();
            return this.$UIComponent[UIKeys.height];
        }

        /**
         * @private
         * @param value
         */
        $setHeight(value: number): boolean {
            value = +value;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.height] === value && values[UIKeys.explicitHeight] === value)
                return false;
            values[UIKeys.explicitHeight] = value;
            if (isNaN(value))
                this.invalidateSize();
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentLayout();

            return true;
        }

        /**
         * @private
         * The minimum width of the component.
         * This property is invalid when it is set to a value greater than maxWidth.
         * It also affects the size of measurement and automatic layout.
         */
        public get minWidth(): number {
            return this.$UIComponent[UIKeys.minWidth];
        }

        public set minWidth(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.minWidth] === value) {
                return;
            }
            values[UIKeys.minWidth] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * The maximum height of the component.
         * It also affects the size of measurement and automatic layout.
         */
        public get maxWidth(): number {
            return this.$UIComponent[UIKeys.maxWidth];
        }

        public set maxWidth(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.maxWidth] === value) {
                return;
            }
            values[UIKeys.maxWidth] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * The minimum height of the component.
         * This property is invalid when set to a value greater than maxHeight.
         * It also affects the size of measurement and automatic layout.
         */
        public get minHeight(): number {
            return this.$UIComponent[UIKeys.minHeight];
        }

        public set minHeight(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.minHeight] === value) {
                return;
            }
            values[UIKeys.minHeight] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * The maximum height of the component affects both measurement and automatic layout dimensions.
         */
        public get maxHeight(): number {
            return this.$UIComponent[UIKeys.maxHeight];
        }

        public set maxHeight(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.maxHeight] === value) {
                return;
            }
            values[UIKeys.maxHeight] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * Set the measurement result.
         * @param width Measuring width.
         * @param height Measuring height.
         */
        public setMeasuredSize(width: number, height: number): void {
            let values = this.$UIComponent;
            values[UIKeys.measuredWidth] = Math.ceil(+width || 0);
            values[UIKeys.measuredHeight] = Math.ceil(+height || 0);
        }

        /**
         * @private
         * Set the width and height of the component.
         * This method is different from directly setting the width and height properties,
         * will not affect the explicit mark size attribute.
         */
        private setActualSize(w: number, h: number): void {
            let change = false;
            let values = this.$UIComponent;
            if (values[UIKeys.width] !== w) {
                values[UIKeys.width] = w;
                change = true;
            }
            if (values[UIKeys.height] !== h) {
                values[UIKeys.height] = h;
                change = true;
            }
            if (change) {
                this.invalidateDisplayList();
                this.dispatchEventWith(egret.Event.RESIZE);
            }
        }

        /**
         * @private
         */
        protected $updateUseTransform(): void {
            this.$super.$updateUseTransform.call(this);
            this.invalidateParentLayout();
        }

        /**
         * @private
         */
        $setMatrix(matrix: egret.Matrix, needUpdateProperties: boolean = true): boolean {
            this.$super.$setMatrix.call(this, matrix, needUpdateProperties);
            this.invalidateParentLayout();
            return true;
        }

        /**
         * @private
         */
        $setAnchorOffsetX(value: number): boolean {
            this.$super.$setAnchorOffsetX.call(this, value);
            this.invalidateParentLayout();
            return true;
        }

        /**
         * @private
         */
        $setAnchorOffsetY(value: number): boolean {
            this.$super.$setAnchorOffsetY.call(this, value);
            this.invalidateParentLayout();
            return true;
        }

        /**
         * @private
         * @param value
         * @returns
         */
        $setX(value: number): boolean {
            let change = this.$super.$setX.call(this, value);
            if (change) {
                this.invalidateParentLayout();
                this.invalidateProperties();
            }
            return change;
        }

        /**
         * @private
         * @param value
         * @returns
         */
        $setY(value: number): boolean {
            let change = this.$super.$setY.call(this, value);
            if (change) {
                this.invalidateParentLayout();
                this.invalidateProperties();
            }
            return change;
        }

        /**
         * @private
         * Mark attribute invalid.
         */
        public invalidateProperties(): void {
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidatePropertiesFlag]) {
                values[sys.UIKeys.invalidatePropertiesFlag] = true;
                if (this.$stage)
                    validator.invalidateProperties(this);
            }
        }

        /**
         * @private
         * Verify component properties.
         */
        public validateProperties(): void {
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidatePropertiesFlag]) {
                this.commitProperties();
                values[sys.UIKeys.invalidatePropertiesFlag] = false;
            }
        }

        /**
         * @private
         * Mark submitted, need to verify component size.
         */
        public invalidateSize(): void {
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidateSizeFlag]) {
                values[sys.UIKeys.invalidateSizeFlag] = true;
                if (this.$stage)
                    validator.invalidateSize(this);
            }
        }

        /**
         * @private
         * Verify the dimensions of the components.
         */
        public validateSize(recursive?: boolean): void {
            if (recursive) {
                let children = this.$children;
                if (children) {
                    let length = children.length;
                    for (let i = 0; i < length; i++) {
                        let child = children[i];
                        if (egret.is(child, UIComponentClass)) {
                            (<eui.UIComponent>child).validateSize(true);
                        }
                    }
                }
            }

            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidateSizeFlag]) {
                let changed = this.measureSizes();
                if (changed) {
                    this.invalidateDisplayList();
                    this.invalidateParentLayout();
                }
                values[sys.UIKeys.invalidateSizeFlag] = false;
            }
        }

        /**
         * @private
         * Measure the component size and return whether the size has changed.
         */
        private measureSizes(): boolean {
            let changed = false;
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidateSizeFlag])
                return changed;

            if (isNaN(values[UIKeys.explicitWidth]) || isNaN(values[UIKeys.explicitHeight])) {
                this.measure();
                if (values[UIKeys.measuredWidth] < values[UIKeys.minWidth]) {
                    values[UIKeys.measuredWidth] = values[UIKeys.minWidth];
                }
                if (values[UIKeys.measuredWidth] > values[UIKeys.maxWidth]) {
                    values[UIKeys.measuredWidth] = values[UIKeys.maxWidth];
                }
                if (values[UIKeys.measuredHeight] < values[UIKeys.minHeight]) {
                    values[UIKeys.measuredHeight] = values[UIKeys.minHeight];
                }
                if (values[UIKeys.measuredHeight] > values[UIKeys.maxHeight]) {
                    values[UIKeys.measuredHeight] = values[UIKeys.maxHeight]
                }
            }
            let preferredW = this.getPreferredUWidth();
            let preferredH = this.getPreferredUHeight();
            if (preferredW !== values[UIKeys.oldPreferWidth] ||
                preferredH !== values[UIKeys.oldPreferHeight]) {
                values[UIKeys.oldPreferWidth] = preferredW;
                values[UIKeys.oldPreferHeight] = preferredH;
                changed = true;
            }
            return changed;
        }

        /**
         * @private
         * Mark needs to verify the display list.
         */
        public invalidateDisplayList(): void {
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidateDisplayListFlag]) {
                values[sys.UIKeys.invalidateDisplayListFlag] = true;
                if (this.$stage)
                    validator.invalidateDisplayList(this);
            }
        }

        /**
         * @private
         * Verify the position and size of subitems and draw other visual content.
         */
        public validateDisplayList(): void {
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidateDisplayListFlag]) {
                this.updateFinalSize();
                this.updateDisplayList(values[UIKeys.width], values[UIKeys.height]);
                values[sys.UIKeys.invalidateDisplayListFlag] = false;
            }
        }

        /**
         * @private
         * Update the final component width and height.
         */
        private updateFinalSize(): void {
            let unscaledWidth = 0;
            let unscaledHeight = 0;
            let values = this.$UIComponent;
            if (values[sys.UIKeys.layoutWidthExplicitlySet]) {
                unscaledWidth = values[UIKeys.width];
            }
            else if (!isNaN(values[UIKeys.explicitWidth])) {
                unscaledWidth = values[UIKeys.explicitWidth];
            }
            else {
                unscaledWidth = values[UIKeys.measuredWidth];
            }
            if (values[sys.UIKeys.layoutHeightExplicitlySet]) {
                unscaledHeight = values[UIKeys.height];
            }
            else if (!isNaN(values[UIKeys.explicitHeight])) {
                unscaledHeight = values[UIKeys.explicitHeight];
            }
            else {
                unscaledHeight = values[UIKeys.measuredHeight];
            }
            this.setActualSize(unscaledWidth, unscaledHeight);
        }

        /**
         * @private
         * Immediately apply all properties of the component and its children.
         */
        public validateNow(): void {
            if (this.$stage)
                validator.validateClient(this);
        }

        /**
         * @private
         * Mark the size and display list of the parent container as invalid.
         */
        protected invalidateParentLayout(): void {
            let parent = this.$parent;
            if (!parent || !this.$includeInLayout || !egret.is(parent, UIComponentClass))
                return;
            (<eui.UIComponent><any>parent).invalidateSize();
            (<eui.UIComponent><any>parent).invalidateDisplayList();
        }

        /**
         * @private
         * Set the layout width and height of the component.
         */
        public setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void {
            layoutHeight = +layoutHeight;
            layoutWidth = +layoutWidth;
            if (layoutHeight < 0 || layoutWidth < 0) {
                return;
            }
            let values = this.$UIComponent;
            let maxWidth = values[UIKeys.maxWidth];
            let maxHeight = values[UIKeys.maxHeight];
            let minWidth = Math.min(values[UIKeys.minWidth], maxWidth);
            let minHeight = Math.min(values[UIKeys.minHeight], maxHeight);
            let width: number;
            let height: number;
            if (isNaN(layoutWidth)) {
                values[sys.UIKeys.layoutWidthExplicitlySet] = false;
                width = this.getPreferredUWidth();
            }
            else {
                values[sys.UIKeys.layoutWidthExplicitlySet] = true;
                width = Math.max(minWidth, Math.min(maxWidth, layoutWidth));
            }
            if (isNaN(layoutHeight)) {
                values[sys.UIKeys.layoutHeightExplicitlySet] = false;
                height = this.getPreferredUHeight();
            }
            else {
                values[sys.UIKeys.layoutHeightExplicitlySet] = true;
                height = Math.max(minHeight, Math.min(maxHeight, layoutHeight));
            }
            let matrix = this.getAnchorMatrix();
            if (isDeltaIdentity(matrix)) {
                this.setActualSize(width, height);
                return;
            }

            let fitSize = sys.MatrixUtil.fitBounds(layoutWidth, layoutHeight, matrix,
                values[UIKeys.explicitWidth], values[UIKeys.explicitHeight],
                this.getPreferredUWidth(), this.getPreferredUHeight(),
                minWidth, minHeight, maxWidth, maxHeight);
            if (!fitSize) {
                fitSize = egret.Point.create(minWidth, minHeight);
            }
            this.setActualSize(fitSize.x, fitSize.y);
            egret.Point.release(fitSize);
        }

        /**
         * @private
         * Set the layout position of the component.
         */
        public setLayoutBoundsPosition(x: number, y: number): void {
            let matrix = this.$getMatrix();
            if (!isDeltaIdentity(matrix) || this.anchorOffsetX != 0 || this.anchorOffsetY != 0) {
                let bounds = egret.$TempRectangle;
                this.getLayoutBounds(bounds);
                x += this.$getX() - bounds.x;
                y += this.$getY() - bounds.y;
            }
            let changed: boolean = this.$super.$setX.call(this, x);
            if (this.$super.$setY.call(this, y) || changed) {
                UIEvent.dispatchUIEvent(this, UIEvent.MOVE);
            }
        }

        /**
         * @private
         * The layout size of the component, commonly used in the updateDisplayList() method of the parent
         * In accordance with the priority order of layout size > externally set size > measured size, return size,
         * Note that the return value of this method already contains scale and rotation.
         */
        public getLayoutBounds(bounds: egret.Rectangle): void {
            let values = this.$UIComponent;
            let w: number;
            if (values[sys.UIKeys.layoutWidthExplicitlySet]) {
                w = values[UIKeys.width];
            }
            else if (!isNaN(values[UIKeys.explicitWidth])) {
                w = values[UIKeys.explicitWidth];
            }
            else {
                w = values[UIKeys.measuredWidth];
            }
            let h: number;
            if (values[sys.UIKeys.layoutHeightExplicitlySet]) {
                h = values[UIKeys.height];
            }
            else if (!isNaN(values[UIKeys.explicitHeight])) {
                h = values[UIKeys.explicitHeight];
            }
            else {
                h = values[UIKeys.measuredHeight];
            }
            this.applyMatrix(bounds, w, h);
        }

        /**
         * @private
         * @returns
         */
        private getPreferredUWidth(): number {
            let values = this.$UIComponent;
            return isNaN(values[UIKeys.explicitWidth]) ?
                values[UIKeys.measuredWidth] : values[UIKeys.explicitWidth];
        }

        /**
         * @private
         * @returns
         */
        private getPreferredUHeight(): number {
            let values = this.$UIComponent;
            return isNaN(values[UIKeys.explicitHeight]) ?
                values[UIKeys.measuredHeight] : values[UIKeys.explicitHeight];
        }

        /**
         * @private
         * Get the preferred size of the component, often used in the parent's measure() method
         * In accordance with the priority order of externally set size > measured size, return the size
         * Note that the return value of this method already contains scale and rotation.
         */
        public getPreferredBounds(bounds: egret.Rectangle): void {
            let w = this.getPreferredUWidth();
            let h = this.getPreferredUHeight();
            this.applyMatrix(bounds, w, h);
        }

        /**
         * @private
         */
        private applyMatrix(bounds: egret.Rectangle, w: number, h: number): void {
            bounds.setTo(0, 0, w, h);
            let matrix = this.getAnchorMatrix();

            if (isDeltaIdentity(matrix)) {
                bounds.x += matrix.tx;
                bounds.y += matrix.ty;
            }
            else {
                matrix.$transformBounds(bounds);
            }
        }

        /**
         * @private
         */
        private getAnchorMatrix(): egret.Matrix {
            let matrix = this.$getMatrix();
            let offsetX = this.anchorOffsetX;
            let offsetY = this.anchorOffsetY;
            if (offsetX != 0 || offsetY != 0) {
                let tempM = egret.$TempMatrix;
                matrix.$preMultiplyInto(tempM.setTo(1, 0, 0, 1, -offsetX, -offsetY), tempM);
                return tempM;
            }
            return matrix;
        }
    }

    /**
     * Check if the method body of a function is empty.
     */
    function isEmptyFunction(prototype: any, key: string): boolean {
        if (typeof prototype[key] != "function") {
            return false;
        }
        let body = prototype[key].toString();
        let index = body.indexOf("{");
        let lastIndex = body.lastIndexOf("}");
        body = body.substring(index + 1, lastIndex);
        return body.trim() == "";
    }

    /**
     * @private
     * Copy the method body and attributes of the template class to the target class.
     * @param target Target class.
     * @param template Template class.
     */
    export function mixin(target: any, template: any): void {
        for (let property in template) {
            if (property != "prototype" && template.hasOwnProperty(property)) {
                target[property] = template[property];
            }
        }
        let prototype = target.prototype;
        let protoBase = template.prototype;
        let keys = Object.keys(protoBase);
        let length = keys.length;
        for (let i = 0; i < length; i++) {
            let key = keys[i];
            if (key == "__meta__") {
                continue;
            }
            if (!prototype.hasOwnProperty(key) || isEmptyFunction(prototype, key)) {
                let value = Object.getOwnPropertyDescriptor(protoBase, key);
                Object.defineProperty(prototype, key, value);
            }
        }
    }

    /**
     * @private
     * The steps of custom class to implement UIComponent:
     * 1. Called in the constructor of the custom class: this.initializeUIValues();
     * 2. Copy all the contents defined by the UIComponent interface (including the commented protected function)
     * to the custom class, and declare all the methods that need to be covered by the subclasses as empty method bodies.
     * 3. Call sys.implementUIComponent () outside the end of the definition class and pass in the custom class.
     * 4. If you override a method of UIComponent, you need to manually call UIComponentImpl.prototype ["method name"]. Call (this);
     * @param descendant Custom UIComponent subclass.
     * @param base Custom subclass inherited from the parent class.
     */
    export function implementUIComponent(descendant: any, base: any, isContainer?: boolean): void {
        mixin(descendant, UIComponentImpl);
        let prototype = descendant.prototype;
        prototype.$super = base.prototype;

        registerProperty(descendant, "left", "Percentage");
        registerProperty(descendant, "right", "Percentage");
        registerProperty(descendant, "top", "Percentage");
        registerProperty(descendant, "bottom", "Percentage");
        registerProperty(descendant, "horizontalCenter", "Percentage");
        registerProperty(descendant, "verticalCenter", "Percentage");
        if (isContainer) {
            prototype.$childAdded = function (child: egret.DisplayObject, index: number): void {
                this.invalidateSize();
                this.invalidateDisplayList();
            };
            prototype.$childRemoved = function (child: egret.DisplayObject, index: number): void {
                this.invalidateSize();
                this.invalidateDisplayList();
            };
        }

        if (DEBUG) { // Convenient properties for viewing layout size during debugging, removed during release.

            Object.defineProperty(prototype, "preferredWidth", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "preferredHeight", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "preferredX", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "preferredY", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsX", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsY", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsWidth", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsHeight", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "measuredWidth", {
                get: function () {
                    return this.$UIComponent[UIKeys.measuredWidth];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "measuredHeight", {
                get: function () {
                    return this.$UIComponent[UIKeys.measuredHeight];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutWidthExplicitlySet", {
                get: function () {
                    return this.$UIComponent[UIKeys.layoutWidthExplicitlySet];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutHeightExplicitlySet", {
                get: function () {
                    return this.$UIComponent[UIKeys.layoutHeightExplicitlySet];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "invalidatePropertiesFlag", {
                get: function () {
                    return this.$UIComponent[UIKeys.invalidatePropertiesFlag];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "invalidateSizeFlag", {
                get: function () {
                    return this.$UIComponent[UIKeys.invalidateSizeFlag];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "invalidateDisplayListFlag", {
                get: function () {
                    return this.$UIComponent[UIKeys.invalidateDisplayListFlag];
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}