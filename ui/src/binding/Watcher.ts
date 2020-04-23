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
    let listeners = "__listeners__";

    /**
     * @private
     */
    let bindables = "__bindables__";

    /**
     * @private
     */
    let bindableCount = 0;

    /**
     * @private
     * @param host
     * @param property
     * @returns
     */
    function getPropertyDescriptor(host:any, property:string):any {
        let data = Object.getOwnPropertyDescriptor(host, property);
        if (data) {
            return data;
        }
        let prototype = Object.getPrototypeOf(host);
        if (prototype) {
            return getPropertyDescriptor(prototype, property);
        }
        return null;
    }

    function notifyListener(host:any, property:string):void {
        let list:any[] = host[listeners];
        let length = list.length;
        for (let i = 0; i < length; i+=2) {
            let listener:Function = list[i];
            let target:any = list[i+1];
            listener.call(target,property);
        }
    }

    /**
     * The Watcher class defines utility method that you can use with bindable properties.
     * These methods let you define an event handler that is executed whenever a bindable property is updated.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    export class Watcher
    {
        /**
         * Creates and starts a Watcher instance.
         * The Watcher can only watch the property of a Object which host is instance of egret.IEventDispatcher.
         * @param host The object that hosts the property or property chain to be watched.
         * You can use the use the *reset()* method to change the value of the *host* argument
         * after creating the Watcher instance.
         * The *host* maintains a list of *handlers* to invoke when *prop* changes.
         * @param chain A value specifying the property or chain to be watched.
         * For example, to watch the property *host.a.b.c*,
         * call the method as: *watch(host, ["a","b","c"], ...)*.
         * @param handler  An event handler function called when the value of the watched property
         * (or any property in a watched chain) is modified.
         * @param thisObject *this* object of which binding with handler
         * @returns he ChangeWatcher instance, if at least one property name has been specified to
         * the *chain* argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static watch(host:any, chain:string[], handler:(value:any)=>void, thisObject:any):Watcher {
            if (DEBUG) {
                if (!chain) {
                    egret.$error(1003, "chain");
                }
            }
            if (chain.length > 0) {
                let property = chain.shift();
                let next = Watcher.watch(null, chain, handler, thisObject);
                let watcher = new Watcher(property, handler, thisObject, next);
                watcher.reset(host);
                return watcher;
            }
            else {
                return null;
            }
        }

        /**
         * @private
         * Check if the property can be bound:
         * * If it is not bound yet, try to add a binding event.
         * * If the attribute is read-only or write-only, return false.
         */
        private static checkBindable(host:any, property:string):boolean {
            let list:string[] = host[bindables];
            if (list && list.indexOf(property) != -1) {
                return true;
            }
            let isEventDispatcher = egret.is(host, "egret.IEventDispatcher");
            if(!isEventDispatcher && !host[listeners]){
                host[listeners] = [];
            }
            let data:PropertyDescriptor = getPropertyDescriptor(host, property);
            if (data && data.set && data.get) {
                let orgSet = data.set;
                data.set = function (value:any) {
                    if (this[property] != value) {
                        orgSet.call(this, value);
                        if(isEventDispatcher){
                            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, property);
                        }
                        else{
                            notifyListener(this,property);
                        }
                    }
                };
            }
            else if (!data || (!data.get && !data.set)) {
                bindableCount++;
                let newProp = "_" + bindableCount + property;
                host[newProp] = data ? data.value : null;
                data = <any>{enumerable: true, configurable: true};
                data.get = function ():any {
                    return this[newProp];
                };
                data.set = function (value:any) {
                    if (this[newProp] != value) {
                        this[newProp] = value;
                        if(isEventDispatcher){
                            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, property);
                        }
                        else{
                            notifyListener(this,property);
                        }
                    }
                };
            }
            else {
                return false;
            }
            Object.defineProperty(host, property, data);
            registerBindable(host, property);
        }

        /**
         * Constructor. Not for public use.
         * This method is called only from the *watch()* method.
         * See the *watch()* method for parameter usage.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(property:string, handler:(value:any)=>void, thisObject:any, next?:Watcher) {
            this.property = property;
            this.handler = handler;
            this.next = next;
            this.thisObject = thisObject;
        }

        /**
         * @private
         */
        private host:any;

        /**
         * @private
         */
        private property:string;

        /**
         * @private
         */
        private handler:(value:any)=>void;

        /**
         * @private
         */
        private thisObject:any;

        /**
         * @private
         */
        private next:Watcher;

        /**
         * @private
         */
        private isExecuting:boolean = false;

        /**
         * Detaches this Watcher instance, and its handler function, from the current host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public unwatch():void {
            this.reset(null);
            this.handler = null;
            if (this.next) {
                this.next.handler = null;
            }
        }

        /**
         * Retrieves the current value of the watched property or property chain, or null if the host object is null.
         * @example
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getValue():any {
            if (this.next) {
                return this.next.getValue();
            }
            return this.getHostPropertyValue();
        }

        /**
         * Sets the handler function.s
         * @param handler The handler function. This argument must not be null.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setHandler(handler:(value:any)=>void, thisObject:any):void {
            this.handler = handler;
            this.thisObject = thisObject;
            if (this.next) {
                this.next.setHandler(handler, thisObject);
            }
        }

        /**
         * Resets this ChangeWatcher instance to use a new host object.
         * You can call this method to reuse a watcher instance on a different host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public reset(newHost:egret.IEventDispatcher):void {
            let oldHost = this.host;
            if(oldHost){
                if (egret.is(oldHost, "egret.IEventDispatcher")) {
                    oldHost.removeEventListener(PropertyEvent.PROPERTY_CHANGE, this.wrapHandler, this);
                }
                else {
                    let list:any[] = oldHost[listeners];
                    let index = list.indexOf(this);
                    list.splice(index-1,2);
                }
            }

            this.host = newHost;

            if(newHost){
                Watcher.checkBindable(newHost, this.property);
                if (egret.is(newHost, "egret.IEventDispatcher")) {
                    newHost.addEventListener(PropertyEvent.PROPERTY_CHANGE, this.wrapHandler, this, false, 100);
                }
                else{
                    let list:any[] = newHost[listeners];
                    list.push(this.onPropertyChange);
                    list.push(this);
                }
            }

            if (this.next)
                this.next.reset(this.getHostPropertyValue());
        }

        /**
         * @private
         * @returns
         */
        private getHostPropertyValue():any {
            return this.host ? this.host[this.property] : null;
        }

        /**
         * @private
         */
        private wrapHandler(event:PropertyEvent):void {
            this.onPropertyChange(event.property);
        }

        /**
         * @private
         */
        private onPropertyChange(property:string):void{
            if (property == this.property && !this.isExecuting) {
                try {
                    this.isExecuting = true;
                    if (this.next)
                        this.next.reset(this.getHostPropertyValue());
                    this.handler.call(this.thisObject, this.getValue());
                }
                finally {
                    this.isExecuting = false;
                }
            }
        }
    }
}