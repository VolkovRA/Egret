namespace egret
{
    /**
     * The GradientType class provides values for the type parameter in the beginGradientFill() methods of the egret.Graphics class.
     * @see egret.Graphics#beginGradientFill()
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class GradientType
    {
        /**
         * Value used to specify a linear gradient fill.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LINEAR:string = "linear";

        /**
         * Value used to specify a radial gradient fill.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static RADIAL:string = "radial";
    }
}