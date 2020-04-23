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
    function joinValues(templates:any[]):any {
        let first = templates[0];
        let value = first instanceof Watcher ? first.getValue() : first;
        let length = templates.length;
        for (let i = 1; i < length; i++) {
            let item = templates[i];
            if (item instanceof Watcher) {
                item = item.getValue();
            }
            value += item;
        }
        return value;
    }

    /**
     * The Binding class defines utility methods for performing data binding.
     * You can use the methods defined in this class to configure data bindings.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     */
    export class Binding
    {
        /**
         * Binds a property, *prop* on the *target* Object, to a bindable property or peoperty chain.
         * @param host The object that hosts the property or property chain to be watched.
         * The *host* maintains a list of *targets* to update theirs *prop* when *chain* changes.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property *host.a.b.c*,
         * you need call the method like this: *indProperty(host, ["a","b","c"], ...)*
         * @param target The Object defining the property to be bound to *chain*.
         * @param prop The name of the public property defined in the *site* Object to be bound.
         * @returns A ChangeWatcher instance, if at least one property name has been specified
         * to the *chain* argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static bindProperty(host:any, chain:string[], target:any, prop:string):Watcher {
            let watcher = Watcher.watch(host, chain, null, null);
            if (watcher) {
                let assign = function (value:any):void {
                    target[prop] = value;
                };
                watcher.setHandler(assign, null);
                assign(watcher.getValue());
            }
            return watcher;
        }

        /**
         * Binds a callback, <prop>handler* on the *target* Object, to a bindable property or peoperty chain.
         * Callback method to invoke with an argument of the current value of *chain* when that value changes.
         * @param host The object that hosts the property or property chain to be watched.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property *host.a.b.c*,
         * you need call the method like this: *indProperty(host, ["a","b","c"], ...)*
         * @param handler method to invoke with an argument of the current value of *chain* when that value changes.
         * @param thisObject *this* Object of binding method.
         * @returns A ChangeWatcher instance, if at least one property name has been  specified to the *chain* argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static bindHandler(host:any, chain:string[], handler:(value:any)=>void, thisObject:any):Watcher {
            let watcher = Watcher.watch(host, chain, handler, thisObject);
            if (watcher) {
                handler.call(thisObject, watcher.getValue());
            }
            return watcher;
        }

        static $bindProperties(host:any, templates:any[], chainIndex:number[], target:any, prop:string):Watcher {
            if (templates.length == 1 && chainIndex.length == 1) {
                return Binding.bindProperty(host, templates[0].split("."), target, prop);
            }

            let assign = function ():void {
                target[prop] = joinValues(templates);
            };
            let length = chainIndex.length;
            let watcher:Watcher;
            for (let i = 0; i < length; i++) {
                let index = chainIndex[i];
                let chain = templates[index].split(".");
                watcher = Watcher.watch(host, chain, null, null);
                if (watcher) {
                    templates[index] = watcher;
                    watcher.setHandler(assign, null);
                }
            }

            assign();
            return watcher;
        }
    }
}