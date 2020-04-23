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
     * The SetProperty class specifies a property value that is in effect only during the parent view state.
     * You use this class in the *overrides* property of the State class.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class SetStateProperty implements IOverride
    {
        /**
         * Constructor.
         * @param target The object whose property is being set. By default, EUI uses the immediate parent of the State object.
         * @param name The property to set.
         * @param value The value of the property in the view state.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(host:any, templates:any[], chainIndex:number[], target:any, prop:string) {
            this.host = host;
            this.templates = templates;
            this.chainIndex = chainIndex;
            this.target = target;
            this.prop = prop;
        }

        /**
         * Skin object.
         * @private
         */
        private host:any;
        
        /**
         * @private
         * List of bound templates.
         */
        public templates:any[];

        /**
         * @private
         * ChainIndex is a list of indexes, and each index points to a value in templates, which represents the attribute chain.
         */
        public chainIndex:number[];

        /**
         * A value in the object s to be bound, which represents the property chain.
         * @private
         */
        private target:any;

        /**
         * The property of the object to be bound.
         * @private
         */
        private prop:string;

        /**
         * Last data.
         * @private
         */
        private oldValue:any;

        /**
         * @version Egret 3.0
         * @version eui 1.0
         * @platform Web,Native
         */
        public apply(host:Skin, parent:egret.DisplayObjectContainer):void {
            if (!this.target) {
                return;
            }
            let nextOldValue = this.target[this.prop];
            if (this.oldValue) {
                this.setPropertyValue(this.target, this.prop, this.oldValue, this.oldValue);
            }
            if (nextOldValue) {
                this.oldValue = nextOldValue;
            }
            eui.Binding.$bindProperties(this.host, this.templates.concat(), this.chainIndex.concat(), this.target, this.prop);
        }

        /**
         * @version Egret 3.0
         * @version eui 1.0
         * @platform Web,Native
         */
        public remove(host:Skin, parent:egret.DisplayObjectContainer):void {
            if (!this.target) {
                return;
            }
            let oldValue = this.oldValue;
            if (this.target[this.prop]) {
                this.oldValue = this.target[this.prop];
            }
            if (oldValue) {
                this.setPropertyValue(this.target, this.prop, oldValue, oldValue);
            }
        }

        /**
         * @private
         * Set property value.
         */
        private setPropertyValue(obj:any, name:string, value:any,
                                 valueForType:any):void {
            if (value === undefined || value === null)
                obj[name] = value;
            else if (typeof (valueForType) == "number")
                obj[name] = +value;
            else if (typeof (valueForType) == "boolean")
                obj[name] = this.toBoolean(value);
            else
                obj[name] = value;
        }

        /**
         * @private
         * Convert to Boolean value.
         */
        private toBoolean(value:any):boolean {
            if (typeof (value) == "string")
                return value.toLowerCase() == "true";

            return value != false;
        }
    }
}