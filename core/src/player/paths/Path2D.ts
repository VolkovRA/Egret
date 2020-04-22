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

namespace egret.sys
{
    /**
     * @private
     * Path type.
     */
    export const enum PathType
    {
        /**
         * Solid color fill path.
         */
        Fill = 1,

        /**
         * Gradient fill path.
         */
        GradientFill,

        /**
         * Line path.
         */
        Stroke
    }

    /**
     * @private
     * 2D path command.
     */
    export const enum PathCommand {
        MoveTo = 1,
        LineTo,
        CurveTo,
        CubicCurveTo
    }

    /**
     * @private
     * 2D path.
     */
    export class Path2D
    {
        /**
         * Path type.
         */
        public type: number = 0;

        $commands: number[] = [];
        $data: number | number[][] = [];

        protected commandPosition: number = 0;
        protected dataPosition: number = 0;

        /**
         * The current coordinate X.
         * Note: Currently only drawArc will be assigned before.
         */
        public $lastX:number = 0;

        /**
         * The current coordinate Y.
         * Note: Currently only drawArc will be assigned before.
         */
        public $lastY:number = 0;

        /**
         * Move the current drawing position to (x, y).
         * If any of the parameters are missing, this method will fail and the current drawing position will not change.
         * @param x A number indicating the horizontal position (in pixels) relative to the registration point of the parent display object.
         * @param y A number indicating the vertical position (in pixels) relative to the registration point of the parent display object.
         */
        public moveTo(x: number, y: number) {
            this.$commands[this.commandPosition++] = PathCommand.MoveTo;
            let pos = this.dataPosition;
            this.$data[pos++] = x;
            this.$data[pos++] = y;
            this.dataPosition = pos;
        }

        /**
         * Use the current line style to draw a line from the current drawing position to (x, y).
         * The current drawing position will then be set to (x, y).
         * @param x A number indicating the horizontal position (in pixels) relative to the registration point of the parent display object.
         * @param y A number indicating the vertical position (in pixels) relative to the registration point of the parent display object.
         */
        public lineTo(x: number, y: number) {
            this.$commands[this.commandPosition++] = PathCommand.LineTo;
            let pos = this.dataPosition;
            this.$data[pos++] = x;
            this.$data[pos++] = y;
            this.dataPosition = pos;
        }

        /**
         * Use the current line style and the control points specified by (controlX, controlY) to draw a quadratic Bezier
         * curve from the current drawing position to the end of (anchorX, anchorY).
         * The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo () method is called before the moveTo () method is called, the default value of the current drawing position is (0, 0).
         * If any of the parameters are missing, this method will fail and the current drawing position will not change.
         * The curve drawn is a quadratic Bezier curve. The quadratic Bezier curve contains two anchor points and one control point.
         * The curve interpolates the two anchor points and bends toward the control point.
         * @param controlX A number that specifies the horizontal position of the control point relative to the registration point of the parent display object.
         * @param controlY A number that specifies the vertical position of the control point relative to the registration point of the parent display object.
         * @param anchorX A number that specifies the horizontal position of the next anchor point relative to the registration point of the parent display object.
         * @param anchorY A number that specifies the vertical position of the next anchor point relative to the registration point of the parent display object.
         */
        public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number) {
            this.$commands[this.commandPosition++] = PathCommand.CurveTo;
            let pos = this.dataPosition;
            this.$data[pos++] = controlX;
            this.$data[pos++] = controlY;
            this.$data[pos++] = anchorX;
            this.$data[pos++] = anchorY;
            this.dataPosition = pos;
        }

        /**
         * Draw a cubic Bezier curve from the current drawing position to the specified anchor point.
         * The cubic Bezier curve is composed of two anchor points and two control points.
         * The curve interpolates the two anchor points and bends toward the two control points.
         * @param controlX1 Specifies the horizontal position of the first control point relative to the registration point of the parent display object.
         * @param controlY1 Specifies the vertical position of the first control point relative to the registration point of the parent display object.
         * @param controlX2 Specifies the horizontal position of the second control point relative to the registration point of the parent display object.
         * @param controlY2 Specifies the vertical position of the second control point relative to the registration point of the parent display object.
         * @param anchorX Specifies the horizontal position of the anchor point relative to the registration point of the parent display object.
         * @param anchorY Specifies the vertical position of the anchor point relative to the registration point of the parent display object.
         */
        public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number,
            controlY2: number, anchorX: number, anchorY: number) {
            this.$commands[this.commandPosition++] = PathCommand.CubicCurveTo;
            let pos = this.dataPosition;
            this.$data[pos++] = controlX1;
            this.$data[pos++] = controlY1;
            this.$data[pos++] = controlX2;
            this.$data[pos++] = controlY2;
            this.$data[pos++] = anchorX;
            this.$data[pos++] = anchorY;
            this.dataPosition = pos;
        }

        /**
         * Draw a rectangle.
         * @param x The x position of the circle center relative to the registration point of the parent display object (in pixels).
         * @param y The y position (in pixels) relative to the center of the registration point of the parent display object.
         * @param width The width of the rectangle (in pixels).
         * @param height The height of the rectangle (in pixels).
         */
        public drawRect(x: number, y: number, width: number, height: number) {
            let x2 = x + width;
            let y2 = y + height;
            this.moveTo(x, y);
            this.lineTo(x2, y);
            this.lineTo(x2, y2);
            this.lineTo(x, y2);
            this.lineTo(x, y);
        }

        /**
         * Draw a rounded rectangle.
         * @param x The x position of the circle center relative to the registration point of the parent display object (in pixels).
         * @param y The y position (in pixels) relative to the center of the registration point of the parent display object.
         * @param width The width of the rectangle (in pixels).
         * @param height The height of the rectangle (in pixels).
         * @param ellipseWidth The width of the ellipse used to draw rounded corners (in pixels).
         * @param ellipseHeight Is used to draw the height of ellipse with rounded corners (in pixels). (Optional)
         * If no value is specified, the default value matches the value provided for the ellipseWidth parameter.
         */
        public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void {
            let radiusX = (ellipseWidth * 0.5) | 0;
            let radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;

            if (!radiusX || !radiusY) {
                this.drawRect(x, y, width, height);
                return;
            }

            let hw = width * 0.5;
            let hh = height * 0.5;
            if (radiusX > hw) {
                radiusX = hw;
            }
            if (radiusY > hh) {
                radiusY = hh;
            }
            if (hw === radiusX && hh === radiusY) {
                if (radiusX === radiusY) {
                    this.drawCircle(x + radiusX, y + radiusY, radiusX);
                } else {
                    this.drawEllipse(x, y, radiusX * 2, radiusY * 2);
                }
                return;
            }

            //    A-----B
            //  H         C
            //  G         D
            //    F-----E
            // Start at point D and end at point D
            let right = x + width;
            let bottom = y + height;
            let xlw = x + radiusX;
            let xrw = right - radiusX;
            let ytw = y + radiusY;
            let ybw = bottom - radiusY;
            this.moveTo(right, ybw);
            this.curveTo(right, bottom, xrw, bottom);
            this.lineTo(xlw, bottom);
            this.curveTo(x, bottom, x, ybw);
            this.lineTo(x, ytw);
            this.curveTo(x, y, xlw, y);
            this.lineTo(xrw, y);
            this.curveTo(right, y, right, ytw);
            this.lineTo(right, ybw);
        }

        /**
         * Draw a circle.
         * @param x The x position of the circle center relative to the registration point of the parent display object (in pixels).
         * @param y The y position (in pixels) relative to the center of the registration point of the parent display object.
         * @param radius The radius of the circle (in pixels).
         */
        public drawCircle(x: number, y: number, radius: number): void {
            this.arcToBezier(x, y, radius, radius, 0, Math.PI * 2);
        }

        /**
         * Draw an ellipse.
         * @param x A number indicating the horizontal position (in pixels) relative to the registration point of the parent display object.
         * @param y A number indicating the vertical position (in pixels) relative to the registration point of the parent display object.
         * @param width The width of the rectangle (in pixels).
         * @param height The height of the rectangle (in pixels).
         */
        public drawEllipse(x: number, y: number, width: number, height: number): void {
            let radiusX = width * 0.5;
            let radiusY = height * 0.5;
            // Move x and y to the center of the ellipse.
            x += radiusX;
            y += radiusY;
            this.arcToBezier(x, y, radiusX, radiusY, 0, Math.PI * 2);
        }

        /**
         * Draw a circular path. The center of the arc path is at position (x, y), the radius is r, and it is drawn from startAngle
         * to the endAngle according to the direction specified by anticlockwise (default is clockwise).
         * @param x The x coordinate of the arc center (circle center).
         * @param y The y coordinate of the arc center (center).
         * @param radius The radius of the arc.
         * @param startAngle The starting point of the arc, calculated from the x-axis direction, expressed in radians. Note that it must be between 0 ~ 2π.
         * @param endAngle The end point of the arc, expressed in radians. Note that it must be between 0 ~ 2π.
         * @param anticlockwise If true, draw the arc counterclockwise, otherwise, draw clockwise.
         */
        public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
            if (anticlockwise) {
                if (endAngle >= startAngle) {
                    endAngle -= Math.PI * 2;
                }
            }
            else {
                if (endAngle <= startAngle) {
                    endAngle += Math.PI * 2;
                }
            }
            this.arcToBezier(x, y, radius, radius, startAngle, endAngle, anticlockwise);
        }

        /**
         * Draw a circular path.
         * @param x The x coordinate of the arc center (circle center).
         * @param y The y coordinate of the arc center (center).
         * @param radiusX The radius x of the arc.
         * @param radiusY The radius y of the arc.
         * @param startAngle The starting point of the arc, calculated from the x-axis direction, expressed in radians. Note: Must be a positive number.
         * @param endAngle The end point of the arc, expressed in radians. Note: The difference from startAngle must be between 0 ~ 2π.
         * @param anticlockwise If true, draw the arc counterclockwise, otherwise, draw clockwise. Note: If true, endAngle must be less than startAngle, otherwise it must be greater.
         */
        private arcToBezier(x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
            let halfPI = Math.PI * 0.5;
            let start = startAngle;
            let end = start;
            if (anticlockwise) {
                end += -halfPI - (start % halfPI);
                if (end < endAngle) {
                    end = endAngle;
                }
            }
            else {
                end += halfPI - (start % halfPI);
                if (end > endAngle) {
                    end = endAngle;
                }
            }
            let currentX = x + Math.cos(start) * radiusX;
            let currentY = y + Math.sin(start) * radiusY;
            if(this.$lastX != currentX || this.$lastY != currentY) {
                this.moveTo(currentX, currentY);
            }
            let u = Math.cos(start);
            let v = Math.sin(start);
            for (let i = 0; i < 4; i++) {
                let addAngle = end - start;
                let a = 4 * Math.tan(addAngle / 4) / 3;
                let x1 = currentX - v * a * radiusX;
                let y1 = currentY + u * a * radiusY;
                u = Math.cos(end);
                v = Math.sin(end);
                currentX = x + u * radiusX;
                currentY = y + v * radiusY;
                let x2 = currentX + v * a * radiusX;
                let y2 = currentY - u * a * radiusY;
                this.cubicCurveTo(x1, y1, x2, y2, currentX, currentY);
                if (end === endAngle) {
                    break;
                }
                start = end;
                if (anticlockwise) {
                    end = start - halfPI;
                    if (end < endAngle) {
                        end = endAngle;
                    }
                }
                else {
                    end = start + halfPI;
                    if (end > endAngle) {
                        end = endAngle;
                    }
                }
            }
        }
    }
}