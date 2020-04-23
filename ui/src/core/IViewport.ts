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
	 * The IViewport interface is implemented by components that support a viewport.
	 *
	 * If a component's children are larger than the component,
	 * and you want to clip the children to the component boundaries, you can define a viewport.
	 *
	 * A viewport is a rectangular subset of the area of a component that you want to display,
	 * rather than displaying the entire component.
	 *
	 * @see eui.Scroller
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	export interface IViewport extends UIComponent
	{
		/**
		 * The width of the viewport's contents.
		 *
		 * If *scrollEnabled* is true, the viewport's *contentWidth* defines the limit for
		 * horizontal scrolling and the viewport's actual width defines how much of the content is visible.
		 *
		 * To scroll through the content horizontally, vary the *scrollH* between 0 and *contentWidth - width*.
		 *
		 * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		contentWidth:number;
		
		/**
		 * The height of the viewport's content.
		 *
		 * If *scrollEnabled* is true, the viewport's *contentHeight* defines the limit for
		 * vertical scrolling and the viewport's actual height defines how much of the content is visible.
		 *
		 * To scroll through the content vertically, vary the *scrollV* between 0 and *contentHeight - height*.
		 *
		 * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		contentHeight:number;
		
		/**
		 * The x coordinate of the origin of the viewport in the component's coordinate system,
		 * where the default value is (0,0) corresponding to the upper-left corner of the component.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		scrollH:number;
		
		/**
		 * The y coordinate of the origin of the viewport in the component's coordinate system,
		 * where the default value is (0,0) corresponding to the upper-left corner of the component.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		scrollV:number;
		
		/**
		 * If *true*, specifies to clip the children to the boundaries of the viewport.
		 * If *false*, the container children extend past the container boundaries,
		 * regardless of the size specification of the component.
		 * @default false
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		scrollEnabled:boolean;
	}
}