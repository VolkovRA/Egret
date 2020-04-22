/// <reference path="../events/EventDispatcher.ts" />

namespace egret
{
    /**
     * The Geolocation able to obtain the position of the device.
     * Geolocation will emit CHANGE event when the device's location is changed.
     * It will emit IO_ERROR event if the location request is denied or there is no location service on the device.
     * @event egret.Event.CHANGE The device's location is changed.
     * @event egret.Event.IO_ERROR Error occurred while getting the location.
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Geolocation.ts
     */
    export interface Geolocation extends EventDispatcher
    {
        /**
         * Start to monitor the device's location.
         * @returns 
         * @version Egret 2.4
         * @platform Web
         */
        start(): void;

        /**
         * Stop monitor the device's location.
         * @returns 
         * @version Egret 2.4
         * @platform Web
         */
        stop(): void;
    }

    /**
     * @copy egret.Geolocation
     */
    export let Geolocation:
    {
        /**
         * Constructor.
         * @version Egret 2.4
         * @platform Web
         */
        new (): Geolocation
    };
}