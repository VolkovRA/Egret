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
     * Register a property for a class definition in running,
     * so that the EUI can get type of property accurate when parsing a EXML.
     * This need not be called directly in most of time. Only when you have a custom UI
     * component need to be described in EXML, you may invoke this method explicitly.
     *
     * Contains no following：
     * When the property is the basic data type(boolean, number, string or Array), you only need set a correct initial value
     * for he custom property then the EXML parser can get the correct property type in running.
     *
     * If you can not set the correct initial value (such as *null*), the EXML parser will treat this property as
     * *string*. If there is no inital value, EUI will throw an error. But you can invoked this method to register
     * a property in this case.
     *
     * @param classDefinition The class definition need to be registered.
     * @param property The property need to be registered. Note that the property name cannot start with "_" or "$".
     * @param type The type need to be registered, such as “boolean","number","string","Array","egret.Rectangle" and so on.
     * @param asDefault Whether register this property as a default property of component.
     * One component can register only on default property. And the default property can be spare in an EXML.
     * @example
     * 
     *      <s:Scroller>
     *          <s:viewport>
     *          <s:Group/>
     *          </e:viewport>
     *      </e:Scroller>
     * 
     * // Cuz *viewport* is the default property of Scroller. So you can write as follow:
     * 
     *      <s:Scroller>
     *          <s:Group/>
     *      </e:Scroller>
     * 
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    export function registerProperty(classDefinition:any,property:string,type:string,asDefault?:boolean):void{
        if (DEBUG) {
            if(!classDefinition){
                egret.$error(1003, "classDefinition");
            }
            if(!classDefinition.prototype){
                egret.$error(1012,"classDefinition")
            }
            if(!property){
                egret.$error(1003, "property");
            }
            if(!type){
                egret.$error(1003, "type");
            }
        }
        let prototype: any = classDefinition.prototype;
        prototype.__meta__ = prototype.__meta__||{};
        prototype.__meta__[property] = type;
        if(asDefault){
            prototype.__defaultProperty__ = property;
        }
    }
}