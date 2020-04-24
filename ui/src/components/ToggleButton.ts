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

/// <reference path="Button.ts" />

namespace eui
{
	/**
	 * The ToggleButton component defines a toggle button.
	 * Clicking the button toggles it between the up and an down states.
	 * If you click the button while it is in the up state, it toggles to the down state.
	 * You must click the button again to toggle it back to the up state.
	 * 
	 * You can get or set this state programmatically
	 * by using the *selected* property.
	 *
	 * @event egret.Event.CHANGE Dispatched when the *selected* property changes for the ToggleButton control.
	 * This event is dispatched only when the user interacts with the control by touching.
	 *
	 * @state up Button up state.
	 * @state down Button down state.
	 * @state disabled Button disabled state.
	 * @state upAndSelected Up state when the button is selected.
	 * @state downAndSelected Down state when the button is selected.
	 * @state disabledAndSelected Disabled state when the button is selected.
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample extension/eui/components/ToggleButtonExample.ts
	 */
	export class ToggleButton extends Button
	{
		/**
		 * @private
		 */
		$selected: boolean = false;

		/**
		 * Contains *true* if the button is in the down state, and *false* if it is in the up state.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public get selected():boolean{
			return this.$selected;
		}

		public set selected(value:boolean){
			this.$setSelected(value);
		}

		/**
		 * @private
		 * @param value 
		 */
		$setSelected(value:boolean):boolean{
			value = !!value;
			if (value === this.$selected)
				return false;
			this.$selected = value;
			this.invalidateState();
			PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selected");
			return true;
		}

		/**
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		protected getCurrentState():string{
			let state = super.getCurrentState();
			if (!this.$selected){
				return state;
			}
			else{
				let selectedState = state + "AndSelected";
				let skin = this.skin;
				if(skin&&skin.hasState(selectedState)){
					return selectedState;
				}
				return state=="disabled"?"disabled":"down";
			}
		}

		/**
		 * @private
		 * Whether to automatically change the selected state according to the touch event, the default is true.
		 * Only used within the framework.
		 */
		$autoSelected:boolean = true;

		/**
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		protected buttonReleased():void{
			if(!this.$autoSelected)
				return;
			this.selected = !this.$selected;
			this.dispatchEventWith(egret.Event.CHANGE);
		}
	}
	registerBindable(ToggleButton.prototype,"selected");
}