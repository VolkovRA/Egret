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

/// <reference path="Ease.ts" />

namespace egret
{
	/**
     * Tween is the animation easing class of Egret.
     * @see http://edn.egret.com/cn/docs/page/576 Tween ease animation.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
	 */
    export class Tween extends EventDispatcher
    {
		/**
         * No special treatment.
		 * @constant {number} egret.Tween.NONE
         * @private
		 */
        private static NONE = 0;

		/**
         * Cycle.
		 * @constant {number} egret.Tween.LOOP
         * @private
		 */
        private static LOOP = 1;

		/**
         * Reverse order.
		 * @constant {number} egret.Tween.REVERSE
         * @private
		 */
        private static REVERSE = 2;

        /**
         * @private
         */
        private static _tweens: Tween[] = [];

        /**
         * @private
         */
        private static IGNORE: any = {};

        /**
         * @private
         */
        private static _plugins: any = {};

        /**
         * @private
         */
        private static _inited = false;

        /**
         * @private
         */
        private _target: any = null;

        /**
         * @private
         */
        private _useTicks: boolean = false;

        /**
         * @private
         */
        private ignoreGlobalPause: boolean = false;

        /**
         * @private
         */
        private loop: boolean = false;

        /**
         * @private
         */
        private pluginData: any = null;

        /**
         * @private
         */
        private _curQueueProps: any;

        /**
         * @private
         */
        private _initQueueProps: any;

        /**
         * @private
         */
        private _steps: any[] = null!;

        /**
         * @private
         */
        private paused: boolean = false;

        /**
         * @private
         */
        private duration: number = 0;

        /**
         * @private
         */
        private _prevPos: number = -1;

        /**
         * @private
         */
        private position: number = null!;

        /**
         * @private
         */
        private _prevPosition: number = 0;

        /**
         * @private
         */
        private _stepPosition: number = 0;
        
        /**
         * @private
         */
        private passive: boolean = false;

		/**
         * Activate an object and add a Tween animation to the object.
         * @param target {any} The object to be activated.
         * @param props {any} Parameters, support loop onChange onChangeObj.
         * @param pluginData {any} Write realized.
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * Not recommended, you can use Tween.removeTweens(target) instead.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static get(target: any, props?: { loop?: boolean, onChange?: Function, onChangeObj?: any }, pluginData: any = null, override: boolean = false): Tween {
            if (override)
                Tween.removeTweens(target);
            
            return new Tween(target, props, pluginData);
        }

		/**
         * Delete all Tween animations from an object.
		 * @param target The object whose Tween to be deleted.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static removeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens: Tween[] = Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }

        /**
         * Pause all Tween animations of a certain object.
         * @param target The object whose Tween to be paused.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static pauseTweens(target: any): void {
            if (!target.tween_count)
                return;
            
            let tweens: egret.Tween[] = egret.Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        }

        /**
         * Resume playing all easing of a certain object.
         * @param target The object whose Tween to be resumed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static resumeTweens(target: any): void {
            if (!target.tween_count)
                return;
            
            let tweens: egret.Tween[] = egret.Tween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target)
                    tweens[i].paused = false;
            }
        }

        /**
         * @private
         * @param delta 
         * @param paused 
         */
        private static tick(timeStamp: number, paused = false): boolean {
            let delta = timeStamp - Tween._lastTime;
            Tween._lastTime = timeStamp;

            let tweens: Tween[] = Tween._tweens.concat();
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween: Tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused)
                    continue;
                
                tween.$tick(tween._useTicks ? 1 : delta);
            }

            return false;
        }

        private static _lastTime: number = 0;

        /**
         * @private
         * @param tween 
         * @param value 
         */
        private static _register(tween: Tween, value: boolean): void {
            let target: any = tween._target;
            let tweens: Tween[] = Tween._tweens;

            if (value) {
                if (target)
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                
                tweens.push(tween);

                if (!Tween._inited) {
                    Tween._lastTime = egret.getTimer();
                    ticker.$startTick(Tween.tick, null);
                    Tween._inited = true;
                }
            }
            else {
                if (target)
                    target.tween_count--;
                
                let i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        }

		/**
         * Delete all Tween.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static removeAllTweens(): void {
            let tweens: Tween[] = Tween._tweens;
            for (let i = 0, l = tweens.length; i < l; i++) {
                let tween: Tween = tweens[i];
                tween.paused = true;
                tween._target.tween_count = 0;
            }
            tweens.length = 0;
        }

        /**
         * Create an egret.Tween object.
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target: any, props: any, pluginData: any) {
            super();
            this.initialize(target, props, pluginData);
        }

        /**
         * @private
         * @param target 
         * @param props 
         * @param pluginData 
         */
        private initialize(target:any, props: any, pluginData: any): void {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                
                props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                
                if (props.override) 
                    Tween.removeTweens(target);
            }

            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            if (props && props.paused)
                this.paused = true;
            else
                Tween._register(this, true);

            if (props && props.position != null)
                this.setPosition(props.position, Tween.NONE);
        }

        /**
         * @private
         * @param value 
         * @param actionsMode 
         * @returns 
         */
        public setPosition(value: number, actionsMode: number = 1): boolean {
            if (value < 0) {
                value = 0;
            }

            // Normalized position
            let t: number = value;
            let end: boolean = false;
            if (t >= this.duration) {
                if (this.loop) {
                    var newTime = t % this.duration;
					if (t > 0 && newTime === 0)
						t = this.duration;
					else
						t = newTime;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos)
                return end;
            if (end)
                this.setPaused(true);

            let prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;

            if (this._target) {
                if (this._steps.length > 0) {
                    // Find new tween
                    let l = this._steps.length;
                    let stepIndex = -1;
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "step") {
                            stepIndex = i;
                            if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t)
                                break;
                        }
                    }
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "action") {
                            // Execute actions
                            if (actionsMode != 0) {
                                if (this._useTicks) {
                                    this._runAction(this._steps[i], t, t);
                                }
                                else if (actionsMode == 1 && t < prevPos) {
                                    if (prevPos != this.duration)
                                        this._runAction(this._steps[i], prevPos, this.duration);

                                    this._runAction(this._steps[i], 0, t, true);
                                }
                                else {
                                    this._runAction(this._steps[i], prevPos, t);
                                }
                            }
                        }
                        else if (this._steps[i].type == "step") {
                            if (stepIndex == i) {
                                let step = this._steps[stepIndex];
                                this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }

            this.dispatchEventWith("change");
            return end;
        }

        /**
         * @private
         * @param startPos 
         * @param endPos 
         * @param includeStart 
         */
        private _runAction(action: any, startPos: number, endPos: number, includeStart: boolean = false) {
            let sPos: number = startPos;
            let ePos: number = endPos;
            if (startPos > endPos) {
                // Invert all
                sPos = endPos;
                ePos = startPos;
            }

            let pos = action.t;

            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        }

        /**
         * @private
         * @param step 
         * @param ratio 
         */
        private _updateTargetProps(step: any, ratio: number) {
            let p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                // Do not update props.
                if (this.passive)
                    return;
                
                // Use ease.
                if (step.e)
                    ratio = step.e(ratio, 0, 1, 1);
                
                p0 = step.p0;
                p1 = step.p1;
            }

            for (let n in this._initQueueProps) {
                if ((v0 = p0[n]) == null)
                    p0[n] = v0 = this._initQueueProps[n];
                if ((v1 = p1[n]) == null)
                    p1[n] = v1 = v0;
                
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number"))
                    v = ratio == 1 ? v1 : v0;
                else
                    v = v0 + (v1 - v0) * ratio;

                let ignore = false;
                if (arr = Tween._plugins[n]) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        let v2:any = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE)
                            ignore = true;
                        else
                            v = v2;
                    }
                }
                if (!ignore)
                    this._target[n] = v;
            }
        }

		/**
         * Whether setting is paused.
		 * @param value {boolean} Whether to pause.
		 * @returns Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public setPaused(value: boolean): Tween {
            if(this.paused == value)
                return this;
            
            this.paused = value;
            Tween._register(this, !value);
            return this;
        }

        /**
         * @private
         * @param props 
         * @returns 
         */
        private _cloneProps(props: any): any {
            let o:any = {};
            for (let n in props)
                o[n] = props[n];
            
            return o;
        }

        /**
         * @private
         * @param o 
         * @returns 
         */
        private _addStep(o: any): Tween {
            if (o.d > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }

        /**
         * @private
         * @param o 
         * @returns 
         */
        private _appendQueueProps(o: any): any {
            let arr, oldValue, i, l, injectProps;
            for (let n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    // Set plugins
                    if (arr = Tween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }

            for (let n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = Tween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps)
                this._appendQueueProps(injectProps);
            
            return this._curQueueProps;
        }

        /**
         * @private
         * @param o 
         * @returns 
         */
        private _addAction(o:any): Tween {
            o.t = this.duration;
            o.type = "action";
            this._steps.push(o);
            return this;
        }

        /**
         * @private
         * @param props 
         * @param o 
         */
        private _set(props: any, o: any): void {
            for (let n in props)
                o[n] = props[n];
        }

		/**
         * Wait the specified milliseconds before the execution of the next animation.
		 * @param duration {number} Waiting time, in milliseconds.
		 * @param passive {boolean} Whether properties are updated during the waiting time.
		 * @returns Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public wait(duration: number, passive?: boolean): Tween {
            if (duration == null || duration <= 0)
                return this;
            
            let o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        }

		/**
         * Modify the property of the specified object to a specified value.
		 * @param props {Object} Property set of an object.
		 * @param duration {number} Duration.
		 * @param ease {egret.Ease} Easing algorithm.
		 * @returns {egret.Tween} Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public to(props: any, duration?: number, ease: EaseFunc | undefined | null = undefined) {
            if (!(duration! > 0))
                duration = 0;
            
            this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            // Add a one-step set to prevent the value of the attribute obtained by the call to to be incorrect when the game is extremely stuck
            return this.set(props);
        }

		/**
         * Execute callback function.
		 * @param callback {Function} Callback method.
		 * @param thisObj {any} This action scope of the callback method.
		 * @param params {any[]} Parameter of the callback method.
		 * @returns {egret.Tween} Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
         * @example
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); // the first parameter passed 233
         *      console.log("b: " + b); // the second parameter passed “hello”
         *  }, this, [233, "hello"]);
		 */
        public call(callback: Function, thisObj: any = undefined, params: any[] = undefined!): Tween {
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        }

        /**
         * Now modify the properties of the specified object to the specified value.
         * @param props {Object} Property set of an object.
         * @param target The object whose Tween to be resumed.
         * @returns {egret.Tween} Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public set(props: any, target = null): Tween {
            // Update current data to ensure smoothness and smoothness.
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        }

		/**
         * Execute.
		 * @param tween {egret.Tween} The Tween object to be operated. Default: this.
		 * @returns {egret.Tween} Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public play(tween?: Tween): Tween {
            if (!tween)
                tween = this;
            
            return this.call(tween.setPaused, tween, [false]);
        }

		/**
         * Pause.
		 * @param tween {egret.Tween} The Tween object to be operated. Default: this.
		 * @returns {egret.Tween} Tween object itself.
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public pause(tween?: Tween): Tween {
            if (!tween)
                tween = this;
            
            return this.call(tween.setPaused, tween, [true]);
        }

		/**
		 * @method egret.Tween#tick
		 * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public $tick(delta: number): void {
            if (this.paused)
                return;
            
            this.setPosition(this._prevPosition + delta);
        }
    }
}