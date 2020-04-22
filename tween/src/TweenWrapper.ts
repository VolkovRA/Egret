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

/// <reference path="Tween.ts" />

namespace egret.tween
{
    /**
     * Ease function type.
     */
    export type EaseType =
        'quadIn' | 'quadOut' | 'quadOut' | 'quadInOut' |
        'cubicIn' | 'cubicOut' | 'cubicInOut' |
        'quartIn' | 'quartOut' | 'quartInOut' |
        'quintIn' | 'quintOut' | 'quintInOut' |
        'sineIn' | 'sineOut' | 'sineInOut' |
        'backIn' | 'backOut' | 'backInOut' |
        'circIn' | 'circOut' | 'circInOut' |
        'bounceIn' | 'bounceOut' | 'bounceInOut' |
        'elasticIn' | 'elasticOut' | 'elasticInOut';

    /**
     * Abstract class, Indicate the base action.
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    export abstract class BasePath extends EventDispatcher
    {
        /**
         * The name of this action.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public name: string = "";
    }

    /**
     * Indicate the to action.
     * See: *Tween.to*.
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    export class To extends BasePath
    {
        /**
         * Property set of an object.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public props: any = undefined;

        /**
         * Duration.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public duration: number = 500;

        /**
         * Easing function.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public ease: EaseType | EaseFunc | undefined = undefined;
    }

    /**
     * Indicate the wait action.
     * See: *Tween.wait*.
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    export class Wait extends BasePath
    {
        /**
         * Duration.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public duration: number = 500;

        /**
         * Whether properties are updated during the waiting time.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public passive: boolean | undefined = undefined;
    }

    /**
     * Indicate the set action.
     * See: *Tween.set*.
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    export class Set extends BasePath
    {
        /**
         * Property set of an object.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public props: Object | undefined = undefined;
    }

    /**
     * Indicate the tick action.
     * See: *Tween.tick*.
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    export class Tick extends BasePath
    {
        /**
         * Delta time.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public delta: number = 0;
    }

    function convertEase(ease: EaseType | EaseFunc | undefined): EaseFunc | null {
        if (typeof ease === 'function')
            return ease;

        let func: EaseFunc = Ease[ease!];
        if (typeof func === 'function')
            return func;

        return null;
    }

    /**
     * Use in exml:
     * ```
     * 	<tween:TweenItem target="{this.button}">
     * 		<tween:props>
     * 			<e:Object loop="{true}"/>
     * 		</tween:props>
     * 		<tween:paths>
     * 			<e:Array>
     * 				<tween:To duration="500">
     * 					<tween:props>
     * 						<e:Object x="{100}" y="{200}" />
     * 					</tween:props>
     * 				</tween:To>
     * 				<tween:Wait duration="1000" />
     * 				<tween:To duration="1000">
     * 					<tween:props>
     * 						<e:Object x="{200}" y="{100}" />
     * 					</tween:props>
     * 				</tween:To>
     * 			</e:Array>
     * 		</tween:paths>
     * 	</tween:TweenItem>
     * ```
     */
    export class TweenItem extends EventDispatcher
    {
        private tween: Tween | undefined;

        constructor() {
            super();
        }

        /**
         * @private
         */
        private _props: any;

        /**
         * The Tween's props.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public get props(): any {
            return this._props;
        }

        public set props(value: any) {
            this._props = value;
        }

        /**
         * @private
         */
        private _target: any;

        /**
         * The Tween's target.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public get target(): any {
            return this._target;
        }

        public set target(value: any) {
            this._target = value;
        }

        /**
         * @private
         */
        private _paths: BasePath[] | undefined;

        /**
         * The Actions in Tween.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public get paths(): BasePath[] | undefined {
            return this._paths;
        }

        public set paths(value: BasePath[] | undefined) {
            this._paths = value || [];
        }

        /**
         * Play the Tween.
         * @position The starting position, the default is from the last position to play.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public play(position?: number): void {
            if (!this.tween) {
                this.createTween(position);
            }
            else {
                this.tween.setPaused(false);
                if (this.isStop && position == undefined) {
                    position = 0;
                    this.isStop = false;
                }
                if (position !== undefined && position !== null) {
                    this.tween.setPosition(position);
                }
            }
        }

        /**
         * Pause the Tween.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public pause(): void {
            if (this.tween) {
                this.tween.setPaused(true);
            }
        }

        private isStop:boolean = false;

        /**
         * Stop the Tween.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public stop(): void {
            this.pause();
            this.isStop = true;
        }

        private createTween(position: number | undefined): void {
            this.tween = Tween.get(this._target, this._props);

            if (this._paths)
                this.applyPaths();
            if (position !== undefined && position !== null)
                this.tween.setPosition(position);
        }

        private applyPaths(): void {
            for (let i = 0; i < this._paths!.length; i++) {
                let path = this._paths![i];
                this.applyPath(path);
            }
        }

        private applyPath(path: BasePath): void {
            if (path instanceof To)
                this.tween!.to(path.props, path.duration, convertEase(path.ease));
            else if (path instanceof Wait)
                this.tween!.wait(path.duration, path.passive);
            else if (path instanceof Set)
                this.tween!.set(path.props);
            else if (path instanceof Tick)
                this.tween!.$tick(path.delta);

            this.tween!.call(() => this.pathComplete(path));
        }

        private pathComplete(path: BasePath): void {
            path.dispatchEventWith('complete');
            this.dispatchEventWith('pathComplete', false, path);

            let index = this._paths!.indexOf(path);
            if (index >= 0 && index === this._paths!.length - 1) {
                this.dispatchEventWith('complete');
            }
        }
    }

    registerProperty(TweenItem, 'paths', 'Array', true);

    /**
     * TweenGroup is a collection of TweenItem that can be played in parallel with each Item.
     * 
     * @event itemComplete Dispatched when some TweenItem has complete.
     * @event complete Dispatched when all TweenItems has complete.
     * 
     * @version Egret 3.1.8
     * @platform Web,Native
     * @includeExample extension/tween/TweenWrapper.ts
     */
    export class TweenGroup extends EventDispatcher
    {
        private completeCount: number = 0;

        constructor() {
            super();
        }

        /**
         * @private
         */
        private _items: TweenItem[] | undefined;

        /**
         * The Array that TweenItems in TweenGroup.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public get items(): TweenItem[] | undefined {
            return this._items;
        }

        public set items(value: TweenItem[] | undefined ) {
            this.completeCount = 0;
            this.registerEvent(false);
            this._items = value;
            this.registerEvent(true);
        }

        private registerEvent(add: boolean): void {
            this._items && this._items.forEach(item => {
                if (add)
                    item.addEventListener('complete', this.itemComplete, this);
                else
                    item.removeEventListener('complete', this.itemComplete, this);
            });
        }

        /**
         * Play the all TweenItems.
         * @time The starting position, the default is from the last position to play.
         * If use 0, the group will play from the start position.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public play(time?: number): void {
            if (!this._items) {
                return;
            }
            for (let i = 0; i < this._items.length; i++) {
                let item = this._items[i];
                item.play(time);
            }
        }

        /**
         * Pause the all TweenItems.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public pause(): void {
            if (!this._items) {
                return;
            }
            for (let i = 0; i < this._items.length; i++) {
                let item = this._items[i];
                item.pause();
            }
        }

        /**
         * Stop the all TweenItems.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        public stop(): void {
            if (!this._items) {
                return;
            }
            for (let i = 0; i < this._items.length; i++) {
                let item = this._items[i];
                item.stop();
            }
        }

        private itemComplete(e: Event): void {
            let item = e.currentTarget as TweenItem;
            this.completeCount++;
            this.dispatchEventWith('itemComplete', false, item);
            if (this.completeCount === this.items!.length) {
                this.dispatchEventWith('complete');
                this.completeCount = 0;
            }
        }
    }

    registerProperty(TweenGroup, 'items', 'Array', true);

    function registerProperty(classDefinition: any, property: string, type: string, asDefault?: boolean): void {
        let prototype: any = classDefinition.prototype;
        prototype.__meta__ = prototype.__meta__ || {};
        prototype.__meta__[property] = type;
        if (asDefault) {
            prototype.__defaultProperty__ = property;
        }
    }
}