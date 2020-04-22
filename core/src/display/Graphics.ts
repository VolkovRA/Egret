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

/// <reference path="../utils/HashObject.ts" />

namespace egret
{
    /**
     * @private
     * Format arc angle value.
     */
    function clampAngle(value): number {
        value %= Math.PI * 2;
        if (value < 0) {
            value += Math.PI * 2;
        }
        return value;
    }

    /**
     * @private
     * Return a set of points on the Bezier curve according to the incoming anchor point group, the return type is egret.Point [];
     * @param pointsData Anchor point group, save the x and y coordinates of all control points, the format is [x0, y0, x1, y1, x2, y2 ...]
     * @param pointsAmount The total number of points to be obtained, the actual number of points returned is not necessarily equal to this attribute, and is related to the range
     * @param range The range value between the point to be obtained and the center anchor point, between 0~1
     * @returns egret.Point [];
     */
    function createBezierPoints(pointsData: number[], pointsAmount: number): egret.Point[] {
        let points = [];
        for (let i = 0; i < pointsAmount; i++) {
            const point = getBezierPointByFactor(pointsData, i / pointsAmount);
            if (point)
                points.push(point);
        }
        return points;
    }

    /**
     * @private
     * Obtain a point on the Bezier curve according to the anchor point group and the value coefficient
     * @param pointsData Anchor point group, save the x and y coordinates of all control points, the format is [x0, y0, x1, y1, x2, y2 ...]
     * @param t value coefficient
     * @returns egret.Point
     */
    function getBezierPointByFactor(pointsData: number[], t: number): egret.Point {
        let i = 0;
        let x = 0, y = 0;
        const len = pointsData.length;
        // According to the amount of incoming data to determine whether it is a second Bessel or a third Bessel.
        if (len / 2 == 3) {
            // Twice
            const x0 = pointsData[i++];
            const y0 = pointsData[i++];
            const x1 = pointsData[i++];
            const y1 = pointsData[i++];
            const x2 = pointsData[i++];
            const y2 = pointsData[i++];
            x = getCurvePoint(x0, x1, x2, t);
            y = getCurvePoint(y0, y1, y2, t);
        }
        else if (len / 2 == 4) {
            // Three times
            const x0 = pointsData[i++];
            const y0 = pointsData[i++];
            const x1 = pointsData[i++];
            const y1 = pointsData[i++];
            const x2 = pointsData[i++];
            const y2 = pointsData[i++];
            const x3 = pointsData[i++];
            const y3 = pointsData[i++];
            x = getCubicCurvePoint(x0, x1, x2, x3, t);
            y = getCubicCurvePoint(y0, y1, y2, y3, t);
        }
        return egret.Point.create(x, y);
    }

    /**
     * Get the position on the quadratic Bezier curve through the factor parameter.
     * Formula is: B (t) = (1-t) ^ 2 * P0 + 2t (1-t) * P1 + t ^ 2 * P2
     * @param value0 P0
     * @param value1 P1
     * @param value2 P2
     * @param factor T, closed interval from 0 to 1.
     */
    function getCurvePoint(value0: number, value1: number, value2: number, factor: number): number {
        const result = Math.pow((1 - factor), 2) * value0 + 2 * factor * (1 - factor) * value1 + Math.pow(factor, 2) * value2;
        return result;
    }

    /**
     * Get the position on the cubic Bezier curve through the factor parameter.
     * The formula is: B (t) = (1-t) ^ 3 * P0 + 3t (1-t) ^ 2 * P1 + 3t ^ 2 * (1-t) t ^ 2 * P2 + t ^ 3 * P3
     * @param value0 P0
     * @param value1 P1
     * @param value2 P2
     * @param value3 P3
     * @param factor T, closed interval from 0 to 1.
     */
    function getCubicCurvePoint(value0: number, value1: number, value2: number, value3: number, factor: number): number {
        const result = Math.pow((1 - factor), 3) * value0 + 3 * factor * Math.pow((1 - factor), 2) * value1 + 3 * (1 - factor) * Math.pow(factor, 2) * value2 + Math.pow(factor, 3) * value3;
        return result;
    }

    /**
     * The Graphics class contains a set of methods for creating vector shape.
     * Display objects that support drawing include Sprite and Shape objects.
     * Each class in these classes includes the graphics attribute that is a Graphics object.
     * The following auxiliary functions are provided for ease of use: drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
     * @see http://edn.egret.com/cn/docs/page/136 Draw Rectangle
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    export class Graphics extends HashObject
    {
        /**
         * Initializes a Graphics object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$renderNode = new sys.GraphicsNode();
        }

        /**
         * @private
         */
        $renderNode: sys.GraphicsNode;

        /**
         * The target display object bound to.
         */
        public $targetDisplay: DisplayObject;
        $targetIsSprite: boolean;

        /**
         * @private
         * Set the target display object bound to.
         */
        $setTarget(target: DisplayObject): void {
            if (this.$targetDisplay) {
                this.$targetDisplay.$renderNode = null;
            }
            target.$renderNode = this.$renderNode;
            this.$targetDisplay = target;
            this.$targetIsSprite = target instanceof Sprite;
        }

        /**
         * The current coordinate X.
         */
        private lastX: number = 0;

        /**
         * The current coordinate Y.
         */
        private lastY: number = 0;

        /**
         * The fill currently being drawn.
         */
        private fillPath: sys.Path2D = null;

        /**
         * The line currently being drawn.
         */
        private strokePath: sys.StrokePath = null;

        /**
         * The upper left width of the line.
         */
        private topLeftStrokeWidth = 0;

        /**
         * The lower right width of the line.
         */
        private bottomRightStrokeWidth = 0;

        /**
         * Special treatment for 1 pixel and 3 pixels, offset by 0.5 pixels to the lower right corner to show clear and sharp lines.
         */
        private setStrokeWidth(width: number) {
            switch (width) {
                case 1:
                    this.topLeftStrokeWidth = 0;
                    this.bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.topLeftStrokeWidth = 1;
                    this.bottomRightStrokeWidth = 2;
                    break;
                default:
                    let half = Math.ceil(width * 0.5) | 0;
                    this.topLeftStrokeWidth = half;
                    this.bottomRightStrokeWidth = half;
                    break;
            }
        }

        /**
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         * @version Egret 2.4
         * @platform Web,Native
         */
        public beginFill(color: number, alpha: number = 1): void {
            color = +color || 0;
            alpha = +alpha || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setBeginFill(color, alpha);
            }
            this.fillPath = this.$renderNode.beginFill(color, alpha, this.strokePath);
            if (this.$renderNode.drawData.length > 1) {
                this.fillPath.moveTo(this.lastX, this.lastY);
            }
        }

        /**
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
         * Calling the clear() method clears the fill.
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array;
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the egret.Matrix class. The egret.Matrix class includes a createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill() method.
         * @platform Web,Native
         * @version Egret 2.4
         */
        public beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix: egret.Matrix = null): void {
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setBeginGradientFill(type, colors, alphas, ratios, matrix);
            }

            this.fillPath = this.$renderNode.beginGradientFill(type, colors, alphas, ratios, matrix, this.strokePath);
            if (this.$renderNode.drawData.length > 1) {
                this.fillPath.moveTo(this.lastX, this.lastY);
            }
        }

        /**
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public endFill(): void {
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setEndFill();
            }
            this.fillPath = null;
        }

        /**
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode Specifies the scale mode to be used
         * @param caps Specifies the value of the CapsStyle class of the endpoint type at the end of the line. (default = CapsStyle.ROUND)
         * @param joints Specifies the type of joint appearance of corner.  (default = JointStyle.ROUND)
         * @param miterLimit Indicates the limit number of cut miter.
         * @param lineDash set the line dash.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineStyle(thickness: number = NaN, color: number = 0, alpha: number = 1.0, pixelHinting: boolean = false,
            scaleMode: string = "normal", caps: string = null, joints: CanvasLineJoin = null, miterLimit: number = 3, lineDash?: number[]): void {
            thickness = +thickness || 0;
            color = +color || 0;
            alpha = +alpha || 0;
            miterLimit = +miterLimit || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setLineStyle(thickness, color,
                    alpha, pixelHinting, scaleMode, caps, joints, miterLimit);
            }
            if (thickness <= 0) {
                this.strokePath = null;
                this.setStrokeWidth(0);
            }
            else {
                this.setStrokeWidth(thickness);
                this.strokePath = this.$renderNode.lineStyle(thickness, color, alpha, caps, joints, miterLimit, lineDash);
                if (this.$renderNode.drawData.length > 1) {
                    this.strokePath.moveTo(this.lastX, this.lastY);
                }
            }
        }

        /**
         * Draw a rectangle.
         * @param x X Position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y Y Position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawRect(x: number, y: number, width: number, height: number): void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawRect(x, y, width, height);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.drawRect(x, y, width, height);
            strokePath && strokePath.drawRect(x, y, width, height);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(x, y);
            this.dirty();
        }

        /**
         * Draw a rectangle with rounded corners.
         * @param x X Position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y Y Position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @param ellipseWidth Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            ellipseWidth = +ellipseWidth || 0;
            ellipseHeight = +ellipseHeight || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            strokePath && strokePath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);

            let radiusX = (ellipseWidth * 0.5) | 0;
            let radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
            let right = x + width;
            let bottom = y + height;
            let ybw = bottom - radiusY;
            this.extendBoundsByPoint(x, y);
            this.extendBoundsByPoint(right, bottom);
            this.updatePosition(right, ybw);
            this.dirty();
        }

        /**
         * Draw a circle.
         * @param x X Position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y Y Position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r Radius of the circle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawCircle(x: number, y: number, radius: number): void {
            x = +x || 0;
            y = +y || 0;
            radius = +radius || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawCircle(x, y, radius);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.drawCircle(x, y, radius);
            strokePath && strokePath.drawCircle(x, y, radius);
            //-1 +2 Solve WebGL cutting problems.
            this.extendBoundsByPoint(x - radius - 1, y - radius - 1);
            this.extendBoundsByPoint(x + radius + 2, y + radius + 2);
            this.updatePosition(x + radius, y);
            this.dirty();
        }

        /**
         * Draw an ellipse.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawEllipse(x: number, y: number, width: number, height: number): void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;

            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawEllipse(x, y, width, height);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.drawEllipse(x, y, width, height);
            strokePath && strokePath.drawEllipse(x, y, width, height);
            //-1 +2 Solve WebGL cutting problems.
            this.extendBoundsByPoint(x - 1, y - 1);
            this.extendBoundsByPoint(x + width + 2, y + height + 2);
            this.updatePosition(x + width, y + height * 0.5);
            this.dirty();
        }

        /**
         * Move the current drawing position to (x, y).
         * If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public moveTo(x: number, y: number): void {
            x = +x || 0;
            y = +y || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setMoveTo(x, y);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.moveTo(x, y);
            strokePath && strokePath.moveTo(x, y);
            this.includeLastPosition = false;
            this.lastX = x;
            this.lastY = y;
            this.dirty();
        }

        /**
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineTo(x: number, y: number): void {
            x = +x || 0;
            y = +y || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setLineTo(x, y);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.lineTo(x, y);
            strokePath && strokePath.lineTo(x, y);
            this.updatePosition(x, y);
            this.dirty();
        }

        /**
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void {
            controlX = +controlX || 0;
            controlY = +controlY || 0;
            anchorX = +anchorX || 0;
            anchorY = +anchorY || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setCurveTo(controlX, controlY,
                    anchorX, anchorY);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);

            let lastX = this.lastX || 0;
            let lastY = this.lastY || 0;
            let bezierPoints = createBezierPoints([lastX, lastY, controlX, controlY, anchorX, anchorY], 50);
            for (let i = 0; i < bezierPoints.length; i++) {
                let point = bezierPoints[i];
                this.extendBoundsByPoint(point.x, point.y);
                egret.Point.release(point);
            }

            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
            this.dirty();
        }

        /**
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor.
         * Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number,
            controlY2: number, anchorX: number, anchorY: number): void {
            controlX1 = +controlX1 || 0;
            controlY1 = +controlY1 || 0;
            controlX2 = +controlX2 || 0;
            controlY2 = +controlY2 || 0;
            anchorX = +anchorX || 0;
            anchorY = +anchorY || 0;
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setCubicCurveTo(controlX1,
                    controlY1, controlX2, controlY2, anchorX, anchorY);
            }
            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);

            let lastX = this.lastX || 0;
            let lastY = this.lastY || 0;
            let bezierPoints = createBezierPoints([lastX, lastY, controlX1, controlY1, controlX2, controlY2, anchorX, anchorY], 50);
            for (let i = 0; i < bezierPoints.length; i++) {
                let point = bezierPoints[i];
                this.extendBoundsByPoint(point.x, point.y);
                egret.Point.release(point);
            }

            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
            this.dirty();
        }

        /**
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
            if (radius < 0 || startAngle === endAngle) {
                return;
            }
            x = +x || 0;
            y = +y || 0;
            radius = +radius || 0;
            startAngle = +startAngle || 0;
            endAngle = +endAngle || 0;
            anticlockwise = !!anticlockwise;
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setDrawArc(x, y, radius,
                    startAngle, endAngle, anticlockwise);
            }

            let fillPath = this.fillPath;
            let strokePath = this.strokePath;
            if (fillPath) {
                fillPath.$lastX = this.lastX;
                fillPath.$lastY = this.lastY;
                fillPath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            if (strokePath) {
                strokePath.$lastX = this.lastX;
                strokePath.$lastY = this.lastY;
                strokePath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            }
            if (anticlockwise) {
                this.arcBounds(x, y, radius, endAngle, startAngle);
            }
            else {
                this.arcBounds(x, y, radius, startAngle, endAngle);
            }
            let endX = x + Math.cos(endAngle) * radius;
            let endY = y + Math.sin(endAngle) * radius;
            this.updatePosition(endX, endY);
            this.dirty();
        }

        private dirty(): void {
            let self = this;
            self.$renderNode.dirtyRender = true;
            if (!egret.nativeRender) {
                const target = self.$targetDisplay;
                target.$cacheDirty = true;
                let p = target.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = target.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * Measuring the rectangle size of an arc.
         */
        private arcBounds(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
            let PI = Math.PI;
            if (Math.abs(startAngle - endAngle) < 0.01) {
                this.extendBoundsByPoint(x - radius, y - radius);
                this.extendBoundsByPoint(x + radius, y + radius);
                return;
            }
            if (startAngle > endAngle) {
                endAngle += PI * 2;
            }
            let startX = Math.cos(startAngle) * radius;
            let endX = Math.cos(endAngle) * radius;
            let xMin = Math.min(startX, endX);
            let xMax = Math.max(startX, endX);

            let startY = Math.sin(startAngle) * radius;
            let endY = Math.sin(endAngle) * radius;
            let yMin = Math.min(startY, endY);
            let yMax = Math.max(startY, endY);

            let startRange = startAngle / (PI * 0.5);
            let endRange = endAngle / (PI * 0.5);
            for (let i = Math.ceil(startRange); i <= endRange; i++) {
                switch (i % 4) {
                    case 0:
                        xMax = radius;
                        break;
                    case 1:
                        yMax = radius;
                        break;
                    case 2:
                        xMin = -radius;
                        break;
                    case 3:
                        yMin = -radius;
                        break;
                }
            }
            xMin = Math.floor(xMin);
            yMin = Math.floor(yMin);
            xMax = Math.ceil(xMax);
            yMax = Math.ceil(yMax);
            this.extendBoundsByPoint(xMin + x, yMin + y);
            this.extendBoundsByPoint(xMax + x, yMax + y);
        }

        /**
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clear(): void {
            if (egret.nativeRender) {
                this.$targetDisplay.$nativeDisplayObject.setGraphicsClear();
            }
            this.$renderNode.clear();
            this.updatePosition(0, 0);
            this.minX = Infinity;
            this.minY = Infinity;
            this.maxX = -Infinity;
            this.maxY = -Infinity;
            this.dirty();
        }

        /**
         * @private
         */
        private minX: number = Infinity;

        /**
         * @private
         */
        private minY: number = Infinity;

        /**
         * @private
         */
        private maxX: number = -Infinity;

        /**
         * @private
         */
        private maxY: number = -Infinity;

        /**
         * @private
         */
        private extendBoundsByPoint(x: number, y: number): void {
            this.extendBoundsByX(x);
            this.extendBoundsByY(y);
        }

        /**
         * @private
         */
        private extendBoundsByX(x: number): void {
            this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
            this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        }

        /**
         * @private
         */
        private extendBoundsByY(y: number): void {
            this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
            this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        }

        /**
         * @private
         */
        private updateNodeBounds(): void {
            let node = this.$renderNode;
            node.x = this.minX;
            node.y = this.minY;
            node.width = Math.ceil(this.maxX - this.minX);
            node.height = Math.ceil(this.maxY - this.minY);
        }

        /**
         * Whether it already contains the coordinates of the last moveTo.
         */
        private includeLastPosition: boolean = true;

        /**
         * Update the current lineX and lineY values and mark the size as invalid.
         * @private
         */
        private updatePosition(x: number, y: number): void {
            if (!this.includeLastPosition) {
                this.extendBoundsByPoint(this.lastX, this.lastY);
                this.includeLastPosition = true;
            }
            this.lastX = x;
            this.lastY = y;
            this.extendBoundsByPoint(x, y);
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this.minX === Infinity) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
            }
        }

        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            let target = this.$targetDisplay;
            let m = target.$getInvertedConcatenatedMatrix();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            let buffer = sys.canvasHitTestBuffer;
            buffer.resize(3, 3);
            let node = this.$renderNode;
            let matrix = Matrix.create();
            matrix.identity();
            matrix.translate(1 - localX, 1 - localY);
            sys.canvasRenderer.drawNodeToBuffer(node, buffer, matrix, true);
            Matrix.release(matrix);

            try {
                let data = buffer.getPixels(1, 1);
                if (data[3] === 0) {
                    return null;
                }
            }
            catch (e) {
                throw new Error(sys.tr(1039));
            }
            return target;
        }

        /**
         * @private
         */
        public $onRemoveFromStage(): void {
            if (this.$renderNode) {
                this.$renderNode.clean();
            }
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.disposeGraphicData(this);
            }
        }
    }
}