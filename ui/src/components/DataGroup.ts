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
     * @private
     */
    const enum Keys
    {
        useVirtualLayout,
        useVirtualLayoutChanged,
        rendererToClassMap,
        freeRenderers,
        createNewRendererFlag,
        itemRendererChanged,
        itemRenderer,
        itemRendererFunction,
        typicalItemChanged,
        typicalLayoutRect,
        cleanFreeRenderer,
        renderersBeingUpdated,
        typicalItem,
        itemRendererSkinName,
        itemRendererSkinNameChange
    }

    /**
     * The DataGroup class is the base container class for data items.
     * The DataGroup class converts data items to visual elements for display.
     * While this container can hold visual elements, it is often used only
     * to hold data items as children.
     * @see eui.Group
     * @see http://edn.egret.com/cn/article/index/id/527 Data container.
     * @see http://edn.egret.com/cn/article/index/id/528 Array collection.
     * @defaultProperty DataProvider.
     * @includeExample  extension/eui/components/DataGroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class DataGroup extends Group
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$DataGroup = {
                0: true,      // useVirtualLayout
                1: false,     // useVirtualLayoutChanged
                2: {},        // rendererToClassMap
                3: {},        // freeRenderers
                4: false,     // createNewRendererFlag
                5: false,     // itemRendererChanged
                6: null,      // itemRenderer
                7: null,      // itemRendererFunction
                8: false,     // typicalItemChanged
                9: null,      // typicalLayoutRect
                10: false,    // cleanFreeRenderer
                11: false,    // renderersBeingUpdated
                12: null,     // typicalItem
                13: null,     // itemRendererSkinName
                14: false,    // itemRendererSkinNameChange
            };
        }

        $DataGroup: Object;

        /**
         * @copy eui.LayoutBase#useVirtualLayout
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get useVirtualLayout(): boolean {
            return this.$layout ? this.$layout.$useVirtualLayout :
                this.$DataGroup[Keys.useVirtualLayout];
        }

        public set useVirtualLayout(value: boolean) {
            value = !!value;
            let values = this.$DataGroup;
            if (value === values[Keys.useVirtualLayout])
                return;

            values[Keys.useVirtualLayout] = value;
            if (this.$layout)
                this.$layout.useVirtualLayout = value;
        }

        /**
         * @private
         * @param value
         */
        $setLayout(value: LayoutBase): boolean {
            if (value == this.$layout)
                return false;

            if (this.$layout) {
                this.$layout.setTypicalSize(0, 0);
                this.$layout.removeEventListener("useVirtualLayoutChanged", this.onUseVirtualLayoutChanged, this);
            }

            if (this.$layout && value && (this.$layout.$useVirtualLayout != value.$useVirtualLayout))
                this.onUseVirtualLayoutChanged();
            let result: boolean = super.$setLayout(value);
            if (value) {
                let rect = this.$DataGroup[Keys.typicalLayoutRect];
                if (rect) {
                    value.setTypicalSize(rect.width, rect.height);
                }
                value.useVirtualLayout = this.$DataGroup[Keys.useVirtualLayout];
                value.addEventListener("useVirtualLayoutChanged", this.onUseVirtualLayoutChanged, this);
            }

            return result;
        }

        /**
         * @private
         * Whether to use the virtual layout tag change.
         */
        private onUseVirtualLayoutChanged(event?: egret.Event): void {
            let values = this.$DataGroup;
            values[Keys.useVirtualLayoutChanged] = true;
            values[Keys.cleanFreeRenderer] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setVirtualElementIndicesInView(startIndex: number, endIndex: number): void {
            if (!this.$layout || !this.$layout.$useVirtualLayout) {
                return;
            }
            let indexToRenderer = this.$indexToRenderer;
            let keys = Object.keys(indexToRenderer);
            let length = keys.length;
            for (let i = 0; i < length; i++) {
                let index = +keys[i];
                if (index < startIndex || index > endIndex) {
                    this.freeRendererByIndex(index);
                }
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getElementAt(index: number): egret.DisplayObject {
            return this.$indexToRenderer[index];
        }

        /**
         * @version Egret 2.5.2
         * @version eui 1.0
         * @platform Web,Native
         */
        public getVirtualElementAt(index: number): UIComponent {
            index = +index | 0;
            if (index < 0 || index >= this.$dataProvider.length)
                return null;
            
            let renderer = this.$indexToRenderer[index];
            if (!renderer) {
                let item: any = this.$dataProvider.getItemAt(index);
                renderer = this.createVirtualRenderer(item);
                this.$indexToRenderer[index] = renderer;
                this.updateRenderer(renderer, index, item);
                let values = this.$DataGroup;
                if (values[Keys.createNewRendererFlag]) {
                    renderer.validateNow();
                    values[Keys.createNewRendererFlag] = false;
                    this.rendererAdded(renderer, index, item);
                }
            }

            return renderer;
        }

        /**
         * @private
         * Release the item renderer at the specified index.
         */
        private freeRendererByIndex(index: number): void {
            let renderer = this.$indexToRenderer[index];
            if (renderer) {
                delete this.$indexToRenderer[index];
                this.doFreeRenderer(renderer);
            }
        }

        /**
         * @private
         * @param renderer
         */
        private doFreeRenderer(renderer: IItemRenderer): void {
            let values = this.$DataGroup;
            let rendererClass = values[Keys.rendererToClassMap][renderer.$hashCode];
            let hashCode = rendererClass.$hashCode;
            if (!values[Keys.freeRenderers][hashCode]) {
                values[Keys.freeRenderers][hashCode] = [];
            }
            values[Keys.freeRenderers][hashCode].push(renderer);
            renderer.visible = false;
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateSize(): void {
            if (!this.$DataGroup[Keys.createNewRendererFlag]) { // No need to re-authenticate when creating children in virtual layout.
                super.invalidateSize();
            }
        }

        /**
         * @private
         * Create a virtual item renderer for the specified index.
         */
        private createVirtualRenderer(item: any): IItemRenderer {
            let renderer: IItemRenderer;
            let rendererClass = this.itemToRendererClass(item);
            let hashCode = rendererClass.$hashCode;
            let values = this.$DataGroup;
            let freeRenderers = values[Keys.freeRenderers];
            if (freeRenderers[hashCode] && freeRenderers[hashCode].length > 0) {
                renderer = freeRenderers[hashCode].pop();
                renderer.visible = true;
                this.invalidateDisplayList();
                return renderer;
            }
            values[Keys.createNewRendererFlag] = true;
            return this.createOneRenderer(rendererClass);
        }

        /**
         * @private
         * Create a renderer based on rendererClass and add it to the display list.
         */
        private createOneRenderer(rendererClass: any): IItemRenderer {
            let renderer = <IItemRenderer>(new rendererClass());
            let values = this.$DataGroup;
            values[Keys.rendererToClassMap][renderer.$hashCode] = rendererClass;
            if (!egret.is(renderer, "eui.IItemRenderer")) {
                return null;
            }
            if (values[Keys.itemRendererSkinName]) {
                this.setItemRenderSkinName(renderer, values[Keys.itemRendererSkinName]);
            }
            this.addChild(renderer);
            return renderer;
        }

        /**
         * @private
         * Set the default skin of the item renderer.
         */
        private setItemRenderSkinName(renderer: IItemRenderer, skinName: any): void {
            if (renderer && renderer instanceof Component) {
                let comp: Component = <Component><any>renderer;
                if (!comp.$Component[sys.ComponentKeys.skinNameExplicitlySet]) {
                    comp.skinName = skinName;
                    comp.$Component[sys.ComponentKeys.skinNameExplicitlySet] = false;
                }

            }
        }

        /**
         * @private
         */
        $dataProviderChanged: boolean = false;

        /**
         * @private
         */
        $dataProvider: ICollection = null;

        /**
         * The data provider for this DataGroup.
         * It must be an ICollection, such as ArrayCollection.
         * @see eui.ICollection
         * @see eui.ArrayCollection
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get dataProvider(): ICollection {
            return this.$dataProvider;
        }

        public set dataProvider(value: ICollection) {
            this.$setDataProvider(value);
        }

        /**
         * @private
         * @param value
         */
        $setDataProvider(value: ICollection): boolean {
            if (this.$dataProvider == value || (value && !value.getItemAt))
                return false;
            
            this.removeDataProviderListener();
            this.$dataProvider = value;
            this.$dataProviderChanged = true;
            this.$DataGroup[Keys.cleanFreeRenderer] = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();

            return true;
        }

        /**
         * @private
         * Remove data source monitoring.
         */
        private removeDataProviderListener(): void {
            if (this.$dataProvider)
                this.$dataProvider.removeEventListener(CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
        }

        /**
         * Called when contents within the dataProvider changes. 
         * We will catch certain events and update our children based on that.
         * @param event Object of event *eui.CollectionEvent*.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onCollectionChange(event: CollectionEvent): void {
            switch (event.kind) {
                case CollectionEventKind.ADD:
                    this.itemAddedHandler(event.items, event.location);
                    break;
                case CollectionEventKind.REMOVE:
                    this.itemRemovedHandler(event.items, event.location);
                    break;
                case CollectionEventKind.UPDATE:
                case CollectionEventKind.REPLACE:
                    this.itemUpdatedHandler(event.items[0], event.location);
                    break;
                case CollectionEventKind.RESET:
                case CollectionEventKind.REFRESH: {
                    if (this.$layout && this.$layout.$useVirtualLayout) {
                        const indexToRenderer = this.$indexToRenderer;
                        const keys = Object.keys(indexToRenderer);
                        const length = keys.length;
                        for (let i = length - 1; i >= 0; i--) {
                            const index = +keys[i];
                            this.freeRendererByIndex(index);
                        }
                    }
                    this.$dataProviderChanged = true;
                    this.invalidateProperties();
                    break;
                }
                default: {
                    egret.$warn(2204, event.kind);
                    break;
                }
            }
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * @private
         * Add event processing from data source.
         */
        private itemAddedHandler(items: any[], index: number): void {
            let length = items.length;
            for (let i = 0; i < length; i++) {
                this.itemAdded(items[i], index + i);
            }
            this.resetRenderersIndices();
        }

        /**
         * @private
         * Data source removal project event handling.
         */
        private itemRemovedHandler(items: any[], location: number): void {
            let length = items.length;
            for (let i = length - 1; i >= 0; i--) {
                this.itemRemoved(items[i], location + i);
            }

            this.resetRenderersIndices();
        }

        /**
         * Adds the item for the specified dataProvider item to this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param item The item that was added, the value of dataProvider[index].
         * @param index The index where the dataProvider item was added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemAdded(item: any, index: number): void {
            if (this.$layout)
                this.$layout.elementAdded(index);

            if (this.$layout && this.$layout.$useVirtualLayout) {
                this.$indexToRenderer.splice(index, 0, null);
                return;
            }
            let renderer = this.createVirtualRenderer(item);
            this.$indexToRenderer.splice(index, 0, renderer);
            if (renderer) {
                this.updateRenderer(renderer, index, item);
                let values = this.$DataGroup;
                if (values[Keys.createNewRendererFlag]) {
                    values[Keys.createNewRendererFlag] = false;
                    this.rendererAdded(renderer, index, item);
                }
            }
        }

        /**
         * Removes the itemRenderer for the specified dataProvider item from this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param item The item that is being removed.
         * @param index The index of the item that is being removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemRemoved(item: any, index: number): void {
            if (this.$layout)
                this.$layout.elementRemoved(index);
            let oldRenderer = this.$indexToRenderer[index];

            if (this.$indexToRenderer.length > index)
                this.$indexToRenderer.splice(index, 1);

            if (oldRenderer) {
                if (this.$layout && this.$layout.$useVirtualLayout) {
                    this.doFreeRenderer(oldRenderer);
                }
                else {
                    this.rendererRemoved(oldRenderer, index, item);
                    this.removeChild(oldRenderer);
                }
            }
        }

        /**
         * @private
         * Update the index of all current items.
         */
        private resetRenderersIndices(): void {
            let indexToRenderer = this.$indexToRenderer;
            if (indexToRenderer.length == 0)
                return;

            if (this.$layout && this.$layout.$useVirtualLayout) {
                let keys = Object.keys(indexToRenderer);
                let length = keys.length;
                for (let i = 0; i < length; i++) {
                    let index = +keys[i];
                    this.resetRendererItemIndex(index);
                }
            }
            else {
                let indexToRendererLength = indexToRenderer.length;
                for (let index = 0; index < indexToRendererLength; index++) {
                    this.resetRendererItemIndex(index);
                }
            }
        }

        /**
         * @private
         * Data source update or replacement project event handling.
         */
        private itemUpdatedHandler(item: any, location: number): void {
            if (this.$DataGroup[Keys.renderersBeingUpdated]) {
                return; // Prevent infinite loop
            }

            let renderer = this.$indexToRenderer[location];
            if (renderer)
                this.updateRenderer(renderer, location, item);
        }

        /**
         * @private
         * Adjust the index value of the specified item renderer.
         */
        private resetRendererItemIndex(index: number): void {
            let renderer = this.$indexToRenderer[index];
            if (renderer)
                renderer.itemIndex = index;
        }

        /**
         * The item renderer to use for data items.
         * The class must implement the IItemRenderer interface.
         * If defined, the *itemRendererFunction* property takes precedence over this property.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get itemRenderer(): any {
            return this.$DataGroup[Keys.itemRenderer];
        }

        public set itemRenderer(value: any) {
            let values = this.$DataGroup;
            if (values[Keys.itemRenderer] == value)
                return;
            values[Keys.itemRenderer] = value;
            values[Keys.itemRendererChanged] = true;
            values[Keys.typicalItemChanged] = true;
            values[Keys.cleanFreeRenderer] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        }

        /**
         * The skinName property of the itemRenderer.This property will be passed to itemRenderer.skinName as default value,
         * if you did not set it explicitly.
         * Note: This property is invalid if the itemRenderer is not a subclass of the Component class.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get itemRendererSkinName(): any {
            return this.$DataGroup[Keys.itemRendererSkinName];
        }

        public set itemRendererSkinName(value: any) {
            let values = this.$DataGroup;
            if (values[Keys.itemRendererSkinName] == value)
                return;
            values[Keys.itemRendererSkinName] = value;
            if (this.$UIComponent[sys.UIKeys.initialized]) {
                values[Keys.itemRendererSkinNameChange] = true;
                this.invalidateProperties();
            }
        }

        /**
         * Function that returns an item renderer for a specific item.
         * If defined, this property takes precedence over the *itemRenderer* property.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get itemRendererFunction(): (item: any) => any {
            return this.$DataGroup[Keys.itemRendererFunction];
        }

        public set itemRendererFunction(value: (item: any) => any) {
            let values = this.$DataGroup;
            if (values[Keys.itemRendererFunction] == value)
                return;
            values[Keys.itemRendererFunction] = value;
            values[Keys.itemRendererChanged] = true;
            values[Keys.typicalItemChanged] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        }

        /**
         * @private
         * Factory instance that returns an item renderer for a specific data item.
         */
        private itemToRendererClass(item: any): any {
            let rendererClass: any;
            let values = this.$DataGroup;
            if (values[Keys.itemRendererFunction]) {
                rendererClass = values[Keys.itemRendererFunction](item);
            }
            if (!rendererClass) {
                rendererClass = values[Keys.itemRenderer];
            }
            if (!rendererClass) {
                rendererClass = ItemRenderer;
            }
            if (!rendererClass.$hashCode) {
                rendererClass.$hashCode = egret.$hashCount++;
            }
            return rendererClass;
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren(): void {
            if (!this.$layout) {
                let layout: VerticalLayout = new VerticalLayout();
                layout.gap = 0;
                layout.horizontalAlign = JustifyAlign.CONTENT_JUSTIFY;
                this.$setLayout(layout);
            }
            super.createChildren();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties(): void {
            let values = this.$DataGroup;
            if (values[Keys.itemRendererChanged] || this.$dataProviderChanged || values[Keys.useVirtualLayoutChanged]) {
                this.removeAllRenderers();
                if (this.$layout)
                    this.$layout.clearVirtualLayoutCache();
                this.setTypicalLayoutRect(null);
                values[Keys.useVirtualLayoutChanged] = false;
                values[Keys.itemRendererChanged] = false;
                if (this.$dataProvider)
                    this.$dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
                if (this.$layout && this.$layout.$useVirtualLayout) {
                    this.invalidateSize();
                    this.invalidateDisplayList();
                }
                else {
                    this.createRenderers();
                }
                if (this.$dataProviderChanged) {
                    this.$dataProviderChanged = false;
                    this.scrollV = this.scrollH = 0;
                }
            }

            super.commitProperties();

            if (values[Keys.typicalItemChanged]) {
                values[Keys.typicalItemChanged] = false;
                if (this.$dataProvider && this.$dataProvider.length > 0) {
                    values[Keys.typicalItem] = this.$dataProvider.getItemAt(0);
                    this.measureRendererSize();
                }
            }

            if (values[Keys.itemRendererSkinNameChange]) {
                values[Keys.itemRendererSkinNameChange] = false;
                let skinName = values[Keys.itemRendererSkinName];
                let indexToRenderer = this.$indexToRenderer;
                let keys = Object.keys(indexToRenderer);
                let length = keys.length;
                for (let i = 0; i < length; i++) {
                    let index = keys[i];
                    this.setItemRenderSkinName(indexToRenderer[index], skinName);
                }
                let freeRenderers = values[Keys.freeRenderers];
                keys = Object.keys(freeRenderers);
                length = keys.length;
                for (let i = 0; i < length; i++) {
                    let hashCode = keys[i];
                    let list: IItemRenderer[] = freeRenderers[hashCode];
                    let length = list.length;
                    for (let i = 0; i < length; i++) {
                        this.setItemRenderSkinName(list[i], skinName);
                    }
                }
            }
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measure(): void {
            if (this.$layout && this.$layout.$useVirtualLayout) {
                this.ensureTypicalLayoutElement();
            }
            super.measure();
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
            let useVirtualLayout = (this.$layout && this.$layout.$useVirtualLayout);
            if (useVirtualLayout) {
                this.ensureTypicalLayoutElement();
            }
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            let values = this.$DataGroup;
            if (useVirtualLayout) {
                // Check if the measurement size of the item at index 0 has changed, if it changes, recalculate typicalLayoutRect
                let rect = values[Keys.typicalLayoutRect];
                if (rect) {
                    let renderer = this.$indexToRenderer[0];
                    if (renderer) {
                        let bounds = egret.$TempRectangle;
                        renderer.getPreferredBounds(bounds);
                        if (bounds.width != rect.width || bounds.height != rect.height) {
                            values[Keys.typicalLayoutRect] = null;
                        }
                    }
                }
            }
        }

        /**
         * @private
         * Make sure to measure the default entry size.
         */
        private ensureTypicalLayoutElement(): void {
            if (this.$DataGroup[Keys.typicalLayoutRect])
                return;

            if (this.$dataProvider && this.$dataProvider.length > 0) {
                this.$DataGroup[Keys.typicalItem] = this.$dataProvider.getItemAt(0);
                this.measureRendererSize();
            }
        }

        /**
         * @private
         * Measurement item renderer default size.
         */
        private measureRendererSize(): void {
            let values = this.$DataGroup;
            if (values[Keys.typicalItem] == undefined) {
                this.setTypicalLayoutRect(null);
                return;
            }

            let typicalRenderer = this.createVirtualRenderer(values[Keys.typicalItem]);
            if (!typicalRenderer) {
                this.setTypicalLayoutRect(null);
                return;
            }

            this.updateRenderer(typicalRenderer, 0, values[Keys.typicalItem]);
            typicalRenderer.validateNow();
            let bounds = egret.$TempRectangle;
            typicalRenderer.getPreferredBounds(bounds);
            let rect = new egret.Rectangle(0, 0, bounds.width, bounds.height);
            if (this.$layout && this.$layout.$useVirtualLayout) {
                if (values[Keys.createNewRendererFlag]) {
                    this.rendererAdded(typicalRenderer, 0, values[Keys.typicalItem]);
                }
                this.doFreeRenderer(typicalRenderer);
            }
            else {
                this.removeChild(typicalRenderer);
            }
            this.setTypicalLayoutRect(rect);
            values[Keys.createNewRendererFlag] = false;
        }

        /**
         * @private
         * Set the default size of the project.
         */
        private setTypicalLayoutRect(rect: egret.Rectangle): void {
            this.$DataGroup[Keys.typicalLayoutRect] = rect;
            if (this.$layout) {
                if (rect) {
                    this.$layout.setTypicalSize(rect.width, rect.height);
                }
                else {
                    this.$layout.setTypicalSize(0, 0);
                }
            }
        }

        /**
         * @private
         * Index-to-item renderer conversion array.
         */
        $indexToRenderer: IItemRenderer[] = [];

        /**
         * @private
         * Remove all item renderers.
         */
        private removeAllRenderers(): void {
            let indexToRenderer = this.$indexToRenderer;
            let keys = Object.keys(indexToRenderer);
            let length = keys.length;
            for (let i = 0; i < length; i++) {
                let index = keys[i];
                let renderer = indexToRenderer[index];
                if (renderer) {
                    this.rendererRemoved(renderer, renderer.itemIndex, renderer.data);
                    this.removeChild(renderer);
                }
            }
            this.$indexToRenderer = [];
            let values = this.$DataGroup;
            if (values[Keys.cleanFreeRenderer]) {
                let freeRenderers = values[Keys.freeRenderers];
                let keys = Object.keys(freeRenderers);
                let length = keys.length;
                for (let i = 0; i < length; i++) {
                    let hashCode = keys[i];
                    let list: IItemRenderer[] = freeRenderers[hashCode];
                    let length = list.length;
                    for (let i = 0; i < length; i++) {
                        let renderer = list[i];
                        this.rendererRemoved(renderer, renderer.itemIndex, renderer.data);
                        this.removeChild(renderer);
                    }
                }
                values[Keys.freeRenderers] = {};
                values[Keys.rendererToClassMap] = {};
                values[Keys.cleanFreeRenderer] = false;
            }
        }

        /**
         * @private
         * Create item renderers for data items.
         */
        private createRenderers(): void {
            if (!this.$dataProvider)
                return;
            let index = 0;
            let length = this.$dataProvider.length;
            for (let i = 0; i < length; i++) {
                let item = this.$dataProvider.getItemAt(i);
                let rendererClass = this.itemToRendererClass(item);
                let renderer: IItemRenderer = this.createOneRenderer(rendererClass);
                if (!renderer)
                    continue;
                this.$indexToRenderer[index] = renderer;
                this.updateRenderer(renderer, index, item);
                this.rendererAdded(renderer, index, item);
                index++;
            }
        }

        /**
         * Updates the renderer for reuse.
         * This method first prepares the item renderer for reuse by cleaning out any stale properties
         * as well as updating it with new properties.
         *
         * The last thing this method should do is set the *data* property of the item renderer.
         *
         * @param renderer The item renderer.
         * @param itemIndex The index of the data in the data provider.
         * @param data The data object this item renderer is representing.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer {
            let values = this.$DataGroup;
            values[Keys.renderersBeingUpdated] = true;
            renderer.itemIndex = itemIndex;
            if (renderer.parent == this) {
                this.setChildIndex(renderer, itemIndex);
            }
            renderer.data = data;
            values[Keys.renderersBeingUpdated] = false;
            return renderer;
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get numElements(): number {
            if (!this.$dataProvider)
                return 0;
            return this.$dataProvider.length;
        }

        /**
         * Adds the itemRenderer for the specified dataProvider item to this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param renderer The renderer that was added.
         * @param index The index where the dataProvider item was added.
         * @param item The item that was added, the value of dataProvider[index].
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected rendererAdded(renderer: IItemRenderer, index: number, item: any): void {
        }

        /**
         * Removes the itemRenderer for the specified dataProvider item from this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param renderer The renderer that is being removed.
         * @param index The index of the item that is being removed.
         * @param item The item that is being removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected rendererRemoved(renderer: IItemRenderer, index: number, item: any): void {
        }
    }

    registerProperty(DataGroup, "itemRenderer", "Class");
    registerProperty(DataGroup, "itemRendererSkinName", "Class");
    registerProperty(DataGroup, "dataProvider", "eui.ICollection", true);
}