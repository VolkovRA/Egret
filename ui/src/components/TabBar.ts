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

/// <reference path="supportClasses/ListBase.ts" />

namespace eui
{
    /**
     * The TabBar class displays a set of identical tabs.
     * One tab can be selected at a time, and the first tab is selected by default.
     * 
     * The set of tabs is defined by the *dataProvider* property.
     * The appearance of each tab is defined by the *ItemRenderer* class.
     * 
     * You can use the TabBar control to set the active child of a ViewStack container,
     * as the following example shows:
     * 
     *       <s:TabBar dataProvider="{viewStack}"/>
     *       <s:ViewStack id="viewStack">
     *          <s:Group name="tab1"/>
     *          <s:Group name="tab2"/>
     *          <s:Group name="tab3"/>
     *       </s:ViewStack>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/TabBarExample.ts
     */
    export class TabBar extends ListBase
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(){
            super();
            this.requireSelection = true;
            this.useVirtualLayout = false;
        }

        /**
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren():void{
            if (!this.$layout) {
                let layout = new HorizontalLayout();
                layout.gap = 0;
                layout.horizontalAlign = JustifyAlign.JUSTIFY;
                layout.verticalAlign = JustifyAlign.CONTENT_JUSTIFY;
                this.$setLayout(layout);
            }
            super.createChildren();
        }

        /**
         * @private
         * @param value 
         */
        $setDataProvider(value:ICollection):boolean{
            let dp = this.$dataProvider;
            if(dp&&dp instanceof eui.ViewStack){
                dp.removeEventListener(PropertyEvent.PROPERTY_CHANGE,this.onViewStackIndexChange,this);
                this.removeEventListener(egret.Event.CHANGE,this.onIndexChanged,this);
            }

            if(value&&value instanceof eui.ViewStack){
                value.addEventListener(PropertyEvent.PROPERTY_CHANGE,this.onViewStackIndexChange,this);
                this.addEventListener(egret.Event.CHANGE,this.onIndexChanged,this);
            }
            return super.$setDataProvider(value);
        }

        /**
         * @private
         */
        private indexBeingUpdated:boolean = false;

        /**
         * @private
         * Touch to change the selected item.
         */
        private onIndexChanged(event:egret.Event):void{
            this.indexBeingUpdated = true;
            (<ViewStack><any> (this.$dataProvider)).selectedIndex = this.selectedIndex;
            this.indexBeingUpdated = false;
        }

        /**
         * @private
         * ViewStack selection changes.
         */
        private onViewStackIndexChange(event:PropertyEvent):void{
            if(event.property=="selectedIndex"&&!this.indexBeingUpdated){
                this.setSelectedIndex((<ViewStack><any> (this.$dataProvider)).selectedIndex, false);
            }
        }
    }
}