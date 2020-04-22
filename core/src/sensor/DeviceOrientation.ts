/// <reference path="../events/EventDispatcher.ts" />

namespace egret
{
    /**
     * Orientation monitor the orientation of the device, send CHANGE event when the orientation is changed
     * @event egret.Event.CHANGE Device's orientation is changed.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @see http://edn.egret.com/cn/docs/page/661 Get device rotation angle.
     */
    export interface DeviceOrientation extends EventDispatcher
    {
        /**
         * Start to monitor the device's orientation.
         * @version Egret 2.4
         * @platform Web
         */
        start(): void;

        /**
         * Stop monitor the device's orientation.
         * @version Egret 2.4
         * @platform Web
         */
        stop(): void;
    }

    /**
     * @copy egret.Orientation
     */
    export let DeviceOrientation: { new (): DeviceOrientation } = null;
}