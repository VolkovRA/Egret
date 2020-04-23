namespace eui
{
    /**
     * @private
     */
    export class ScrollerThrowEvent extends egret.Event
    {
        public static THROW = "throw";

        /**
         * Scroll area current scroll position.
         */
        public currentPos:number;

        /**
         * The position to scroll to modifying the current value will modify the position to be scrolled to,
         * but when moveFlag is false, modifying this value will still not scroll.
         * If you still want to adjust the position of the scroll area at this time, you can set it.
         */
        public toPos:number;

        /**
         * Animation information, can be adjusted or modified.
         */
        //public tween;

        public constructor(type:string, bubbles?:boolean, cancelable?:boolean,currentPos?:number,toPos?:number) {
            super(type, bubbles, cancelable);
            currentPos = +currentPos;
            toPos = +toPos;
            this.currentPos = currentPos;
            this.toPos = toPos;
        }
    }
}