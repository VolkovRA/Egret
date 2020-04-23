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

/// <reference path="../core/UIComponent.ts" />
/// <reference path="../utils/registerProperty.ts" />

namespace eui.sys
{
    /**
     * @private
     */
    export const enum ComponentKeys
    {
        hostComponentKey,
        skinName,
        explicitState,
        enabled,
        stateIsDirty,
        skinNameExplicitlySet,
        explicitTouchChildren,
        explicitTouchEnabled,
        skin
    }
}

namespace eui
{
    /**
     * The Component class defines the base class for skinnable components.
     * The skins used by a Component class are typically child classes of the Skin class.
     *
     * Associate a skin class with a component class by setting the *skinName* property of the component class.
     * @event egret.Event.COMPLETE Dispatch when *skinName* property is set the path of external EXML file and the EXML file is resolved.
     *
     * @includeExample  extension/eui/components/ComponentExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class Component extends egret.DisplayObjectContainer implements UIComponent
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
            this.$Component = {
                0: null,         // hostComponentKey,
                1: null,         // skinName,
                2: "",           // explicitState,
                3: true,         // enabled,
                4: false,        // stateIsDirty,
                5: false,        // skinNameExplicitlySet,
                6: true,         // explicitTouchChildren,
                7: true,         // explicitTouchEnabled
                8: null          // skin
            };

            //if egret
            this.$touchEnabled = true;
            //endif*/
        }

        $Component: Object;

        /**
         * A identifier of host component which can determine only one component names.
         * Usually used for quering a default skin name in theme.
         * @default null
         * @see eui.Theme#getSkinName()
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get hostComponentKey(): string {
            return this.$Component[sys.ComponentKeys.hostComponentKey];
        }

        public set hostComponentKey(value: string) {
            this.$Component[sys.ComponentKeys.hostComponentKey] = value;
        }

        /**
         * Identifier of skin. Valid values: class definition of skin,
         * class name of skin, instance of skin, EXML or external EXML file path.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get skinName(): any {
            return this.$Component[sys.ComponentKeys.skinName];
        }

        public set skinName(value: any) {
            let values = this.$Component;
            values[sys.ComponentKeys.skinNameExplicitlySet] = true;
            if (values[sys.ComponentKeys.skinName] == value)
                return;
            
            if (value) {
                values[sys.ComponentKeys.skinName] = value;
            }
            else {
                let theme = egret.getImplementation("eui.Theme");
                if (theme) {
                    let skinName = theme.getSkinName(this);
                    if (skinName) {
                        values[sys.ComponentKeys.skinName] = skinName;
                    }
                }
            }
            this.$parseSkinName();
        }

        /**
         * @private
         * Resolve skinName.
         */
        $parseSkinName(): void {
            let skinName = this.skinName;
            let skin: any;
            if (skinName) {
                if (skinName.prototype) {
                    skin = new skinName();
                }
                else if (typeof (skinName) == "string") {
                    let clazz: any;
                    let text: string = skinName.trim();
                    if (text.charAt(0) == "<") {
                        clazz = EXML.parse(text);
                    }
                    else {
                        clazz = egret.getDefinitionByName(skinName);
                        if (!clazz && text.toLowerCase().indexOf(".exml") != -1) {
                            EXML.load(skinName, this.onExmlLoaded, this, true);
                            return;
                        }
                    }
                    if (clazz) {
                        skin = new clazz();
                    }
                }
                else {
                    skin = skinName;
                }
            }
            this.setSkin(skin);
        }

        /**
         * @private
         * @param clazz
         * @param url
         */
        private onExmlLoaded(clazz: any, url: string): void {
            if (this.skinName != url) {
                return;
            }
            let skin = new clazz();
            this.setSkin(skin)
        }

        /**
         * The instance of the skin class for this component instance.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get skin(): Skin {
            return this.$Component[sys.ComponentKeys.skin];
        }

        /**
         * Setter for the skin instance.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setSkin(skin: Skin): void {
            if (skin && !(skin instanceof eui.Skin)) {
                skin = null;
                DEBUG && egret.$error(2202);
            }
            let values = this.$Component;
            let oldSkin: Skin = values[sys.ComponentKeys.skin];
            if (oldSkin) {
                let skinParts: string[] = oldSkin.skinParts;
                let length = skinParts.length;
                for (let i = 0; i < length; i++) {
                    let partName = skinParts[i];
                    if (this[partName]) {
                        this.setSkinPart(partName, null);
                    }
                }
                let children = oldSkin.$elementsContent;
                if (children) {
                    length = children.length;
                    for (let i = 0; i < length; i++) {
                        let child = children[i];
                        if (child.$parent == this) {
                            this.removeChild(child);
                        }
                    }
                }
                oldSkin.hostComponent = null;
            }
            values[sys.ComponentKeys.skin] = skin;
            if (skin) {
                let skinParts: string[] = skin.skinParts;
                let length = skinParts.length;
                for (let i = 0; i < length; i++) {
                    let partName = skinParts[i];
                    let instance = skin[partName];
                    if (instance) {
                        this.setSkinPart(partName, instance);
                    }
                }
                let children = skin.$elementsContent;
                if (children) {
                    for (let i = children.length - 1; i >= 0; i--) {
                        this.addChildAt(children[i], 0);
                    }
                }
                skin.hostComponent = this;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
            this.dispatchEventWith(egret.Event.COMPLETE);
        }

        /**
         * Find the skin parts in the skin class and assign them to the properties of the component.
         * You do not call this method directly. This method will be invoked automatically when using a EXML as skin.
         * The ID for a tag in an EXML will be passed in as *partName*, and the instance of the tag will be
         * passed in as *instance*.
         * @param partName Name of a skin part.
         * @param instance Instance of a skin part.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setSkinPart(partName: string, instance: any): void {
            let oldInstance = this[partName];
            if (oldInstance) {
                this.partRemoved(partName, oldInstance);
            }
            this[partName] = instance;
            if (instance) {
                this.partAdded(partName, instance);
            }
        }

        /**
         * Called when a skin part is added.
         * You do not call this method directly.
         * EUI calls it automatically when it calls the *setSkinPart()* method.
         *
         * Override this function to attach behavior to the part, such as add event listener or
         * assign property values cached.
         * @param partName Name of a skin part to add.
         * @param instance Instance of a skin part to add.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName: string, instance: any): void {
        }

        /**
         * Called when an instance of a skin part is being removed.
         * You do not call this method directly.
         * EUI calls it automatically when it calls the *setSkinPart()* method.
         *
         * Override this function to clean behavior of the part, such as remove event listener or
         * disconnect the cache reference.
         * @param partName name of a skin part to remove.
         * @param instance instance of a skin part to remove.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partRemoved(partName: string, instance: any): void {
        }

        /**
         * @private
         * @param value
         */
        $setTouchChildren(value: boolean): boolean {
            value = !!value;
            let values = this.$Component;
            values[sys.ComponentKeys.explicitTouchChildren] = value;
            if (values[sys.ComponentKeys.enabled]) {
                values[sys.ComponentKeys.explicitTouchChildren] = value;
                return super.$setTouchChildren(value);
            }
            else {
                return true;
            }
        }

        /**
         * @private
         * @param value
         */
        $setTouchEnabled(value: boolean): void {
            value = !!value;
            let values = this.$Component;
            values[sys.ComponentKeys.explicitTouchEnabled] = value;
            if (values[sys.ComponentKeys.enabled]) {
                super.$setTouchEnabled(value);
            }
        }

        /**
         * Whether the component can accept user interaction.
         * After setting the *enabled* property to *false*, components will disabled touch event
         * (set *touchEnabled* and *touchChildren* to false) and set state of skin to "disabled".
         * @default true
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get enabled(): boolean {
            return this.$Component[sys.ComponentKeys.enabled];
        }

        public set enabled(value: boolean) {
            value = !!value;
            this.$setEnabled(value);
        }

        /**
         * @private
         * @param value
         */
        $setEnabled(value: boolean): boolean {

            let values = this.$Component;
            if (value === values[sys.ComponentKeys.enabled]) {
                return false;
            }
            values[sys.ComponentKeys.enabled] = value;
            if (value) {
                this.$touchEnabled = values[sys.ComponentKeys.explicitTouchEnabled];
                this.$touchChildren = values[sys.ComponentKeys.explicitTouchChildren];
            }
            else {
                this.$touchEnabled = false;
                this.$touchChildren = false;
            }
            this.invalidateState();

            return true;
        }

        //========================Skin view state=====================start=======================

        /**
         * The current view state of the component. When you use this property to set a component's state,
         * EUI will explicit update state of skin and ignore the return of *getCurrentState()*.
         *
         * Set to *""* or *null* to reset the component back to its base state.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get currentState(): string {
            let values = this.$Component;
            return values[sys.ComponentKeys.explicitState] ?
                values[sys.ComponentKeys.explicitState] : this.getCurrentState();
        }

        public set currentState(value: string) {
            let values = this.$Component;
            if (value == values[sys.ComponentKeys.explicitState]) {
                return;
            }
            values[sys.ComponentKeys.explicitState] = value;
            this.invalidateState();
        }

        /**
         * Marks the component so that the new state of the skin is set during a later screen update.
         * A subclass of SkinnableComponent must override *getCurrentState()* to return a value.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateState(): void {
            let values = this.$Component;
            if (values[sys.ComponentKeys.stateIsDirty])
                return;

            values[sys.ComponentKeys.stateIsDirty] = true;
            this.invalidateProperties();
        }

        /**
         * Returns the name of the state to be applied to the skin.
         * A subclass of SkinnableComponent must override this method to return a value.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState(): string {
            return "";
        }

        //========================Skin view state===================end========================


        //=======================UIComponent interface implementation===========================
        /**
         * @private
         * Please do not add any initial value to all variables defined by UIComponentImpl, they must be initialized here.
         */
        private initializeUIValues: () => void;

        /**
         * Create child objects of the component.
         * This is an advanced method that you might override when creating a subclass of Component.
         * This method will be called once it be added to stage.
         * You must invoke *super.createChildren()* to complete initialization of the parent class.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren(): void {
            let values = this.$Component;
            if (!values[sys.ComponentKeys.skinName]) {
                let theme = egret.getImplementation("eui.Theme");
                if (theme) {
                    let skinName = theme.getSkinName(this);
                    if (skinName) {
                        values[sys.ComponentKeys.skinName] = skinName;
                        this.$parseSkinName();
                    }
                }
            }
        }

        /**
         * Performs any final processing after child objects are created.
         * This is an advanced method that you might override when creating a subclass of Component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected childrenCreated(): void {
        }

        /**
         * Processes the properties set on the component.
         * You can override this method when creating a subclass of Component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties(): void {
            sys.UIComponentImpl.prototype["commitProperties"].call(this);
            let values = this.$Component;
            if (values[sys.ComponentKeys.stateIsDirty]) {
                values[sys.ComponentKeys.stateIsDirty] = false;
                if (values[sys.ComponentKeys.skin]) {
                    values[sys.ComponentKeys.skin].currentState = this.currentState;
                }
            }
        }

        /**
         * Calculates the default size.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measure(): void {
            sys.measure(this);
            let skin = this.$Component[sys.ComponentKeys.skin];
            if (!skin) {
                return;
            }
            let values = this.$UIComponent;
            if (!isNaN(skin.width)) {
                values[sys.UIKeys.measuredWidth] = skin.width;
            }
            else {
                if (values[sys.UIKeys.measuredWidth] < skin.minWidth) {
                    values[sys.UIKeys.measuredWidth] = skin.minWidth;
                }
                if (values[sys.UIKeys.measuredWidth] > skin.maxWidth) {
                    values[sys.UIKeys.measuredWidth] = skin.maxWidth;
                }
            }

            if (!isNaN(skin.height)) {
                values[sys.UIKeys.measuredHeight] = skin.height;
            }
            else {
                if (values[sys.UIKeys.measuredHeight] < skin.minHeight) {
                    values[sys.UIKeys.measuredHeight] = skin.minHeight;
                }
                if (values[sys.UIKeys.measuredHeight] > skin.maxHeight) {
                    values[sys.UIKeys.measuredHeight] = skin.maxHeight;
                }
            }
        }

        /**
         * Draws the object and/or sizes and positions its children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            sys.updateDisplayList(this, unscaledWidth, unscaledHeight);
        }

        /**
         * Method to invalidate parent size and display list if this object affects its layout (includeInLayout is true).
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
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public includeInLayout: boolean;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public left: any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public right: any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public top: any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public bottom: any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public horizontalCenter: any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public verticalCenter: any;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentWidth: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentHeight: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitWidth: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitHeight: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minWidth: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxWidth: number;

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minHeight: number;

        /**
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
    
    registerProperty(Component, "skinName", "Class");
    sys.implementUIComponent(Component, egret.DisplayObjectContainer, true);
}