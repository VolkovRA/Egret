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
     * The State class defines a view state, a particular view of a component.
     *
     * For example, a product thumbnail could have two view states;
     * a base view state with minimal information, and a rich view state with
     * additional information.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class State extends egret.HashObject
    {
        /**
         * Constructor.
         * @param name The name of the view state. State names must be unique for a given component. This property must be set.
         * @param overrides The overrides for this view state, as an Array of objects that implement the IOverride interface.
         * These overrides are applied in order when the state is entered, and removed in reverse order when the state is exited.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(name:string, overrides:IOverride[]=[]) {
            super();
            this.name = name;
            this.overrides = overrides;
        }

        /**
         * The name of the view state.
         * State names must be unique for a given component.
         * This property must be set.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public name:string;

        /**
         * The overrides for this view state, as an Array of objects that implement the IOverride interface.
         * These overrides are applied in order when the state is entered, and removed in reverse order when the state is exited.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public overrides:IOverride[];

        /**
         * The state groups that this view state belongs to as an array of String.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public stateGroups:string[];

        /**
         * Initialize this state and all of its overrides.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public initialize(host:any, stage:egret.Stage):void {
            let overrides = this.overrides;
            let length = overrides.length;
            for (let i = 0; i < length; i++) {
                let addItems:AddItems = <AddItems>overrides[i];
                if (addItems instanceof eui.AddItems) {
                    let target:egret.DisplayObject = host[addItems.target];
                    if (target&&target instanceof eui.Image&&!target.$parent) {
                        stage.addChild(target);
                        stage.removeChild(target);
                    }
                }
            }
        }
    }
}

namespace eui.sys
{
    /**
     * @private
     */
    export class StateClient
    {
        /**
         * @private
         */
        $stateValues:StateValues;

        /**
         * @private
         * The view state defined for this component.
         */
        public get states():eui.State[] {
            return this.$stateValues.states;
        }

        public set states(value:eui.State[]) {
            if (!value)
                value = [];
            let values = this.$stateValues;
            values.states = value;
            let statesMap = {};
            let length = value.length;
            for (let i = 0; i < length; i++) {
                let state = value[i];
                statesMap[state.name] = state;
            }
            values.statesMap = statesMap;
            if (values.parent) {
                this.commitCurrentState();
            }
        }

        /**
         * @private
         * The current view state of the component.
         * Set it to "" or null to reset the component back to its basic state.
         */
        public get currentState():string {
            return this.$stateValues.currentState;
        }

        public set currentState(value:string) {
            let values = this.$stateValues;
            values.explicitState = value;
            values.currentState = value;
            this.commitCurrentState();
        }

        /**
         * @private
         * Apply the current view state.
         * Subclasses override this method to perform corresponding update operations when the view state changes.
         */
        private commitCurrentState():void {
            let values = this.$stateValues;
            if (!values.parent) {
                return;
            }
            let destination:eui.State = values.statesMap[values.currentState];
            if (!destination) {
                if (values.states.length > 0) {
                    values.currentState = values.states[0].name;
                }
                else {
                    return;
                }
            }
            if (values.oldState == values.currentState) {
                return;
            }

            let parent = values.parent;
            let state = values.statesMap[values.oldState];
            if (state) {
                let overrides = state.overrides;
                let length = overrides.length;
                for (let i = 0; i < length; i++) {
                    overrides[i].remove(this, parent);
                }
            }

            values.oldState = values.currentState;

            state = values.statesMap[values.currentState];
            if (state) {
                let overrides = state.overrides;
                let length = overrides.length;
                for (let i = 0; i < length; i++) {
                    overrides[i].apply(this, parent);
                }
            }
        }

        /**
         * @private
         * Returns whether the view state contains the specified name.
         * @param stateName The name of the view state to check.
         */
        public hasState(stateName:string):boolean {
            return !!this.$stateValues.statesMap[stateName];
        }

        /**
         * @private
         * Initialize all view states.
         */
        private initializeStates(stage:egret.Stage):void {
            this.$stateValues.intialized = true;
            let states = this.states;
            let length = states.length;
            for (let i = 0; i < length; i++) {
                states[i].initialize(this,stage);
            }
        }
    }

    /**
     * @private
     */
    export class StateValues
    {
        /**
         * @private
         */
        public intialized:boolean = false;

        /**
         * @private
         */
        public statesMap:any = {};

        /**
         * @private
         */
        public states:eui.State[] = [];

        /**
         * @private
         */
        public oldState:string = null;

        /**
         * @private
         */
        public explicitState:string = null;

        /**
         * @private
         */
        public currentState:string = null;

        /**
         * @private
         */
        public parent:egret.DisplayObjectContainer = null;

        /**
         * @private
         */
        public stateIsDirty:boolean = false;
    }
}