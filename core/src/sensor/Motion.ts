/// <reference path="../events/EventDispatcher.ts" />

namespace egret
{
    /**
     * @copy egret.Motion
     */
    export let Motion: { new (): Motion };

    /**
     * The Motion class emits events based on activity detected by the device's motion sensor.
     * This data represents the device's movement along a 3-dimensional axis.
     * When the device moves, the sensor detects this movement and emit the CHANGE event.
     * 
     * @see egret.MotionEvent
     * @event egret.Event.CHANGE Device is moved.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     */
    export interface Motion extends EventDispatcher
    {
        /**
         * Start to monitor device movement.
         * @version Egret 2.4
         * @platform Web
         */
        start(): void;

        /**
         * Stop monitor device movement.
         * @version Egret 2.4
         * @platform Web
         */
        stop(): void;
    }

    /**
     * A DeviceRotationRate object provides information about the rate at which the device is rotating around all three axes.
     * @version Egret 2.4
     * @platform Web
     */
    export interface DeviceRotationRate
    {
        /**
         * The amount of rotation around the Z axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         */
        alpha: number;

        /**
         * The amount of rotation around the X axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         */
        beta: number;

        /**
         * The amount of rotation around the Y axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         */
        gamma: number;
    }

    /**
     * A DeviceAcceleration object provides information about the amount of acceleration the
     * device is experiencing along all three axes.
     * Acceleration is expressed in m/s2.
     * @version Egret 2.4
     * @platform Web
     */
    export interface DeviceAcceleration
    {
        /**
         * The amount of acceleration along the X axis.
         * @version Egret 2.4
         * @platform Web
         */
        x: number;

        /**
         * The amount of acceleration along the Y axis.
         * @version Egret 2.4
         * @platform Web
         */
        y: number;

        /**
         * The amount of acceleration along the Z axis.
         * @version Egret 2.4
         * @platform Web
         */
        z: number;
    }
}