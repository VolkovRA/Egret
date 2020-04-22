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
    let PI = Math.PI;
    let TwoPI = PI * 2;
    let DEG_TO_RAD: number = PI / 180;

    let matrixPool: Matrix[] = [];

    /**
     * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to another.
     * You can perform various graphical transformations on a display object by setting the properties of a Matrix object,
     * applying that Matrix object to the matrix property of a display object, These transformation functions include
     * translation (x and y repositioning), rotation, scaling, and skewing.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Matrix.ts
     */
    export class Matrix extends HashObject
    {
        /**
         * Releases a matrix instance to the object pool.
         * @param matrix Matrix that Needs to be recycled.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(matrix: Matrix): void {
            if (!matrix) {
                return;
            }
            matrixPool.push(matrix);
        }

        /**
         * get a matrix instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create(): Matrix {
            let matrix = matrixPool.pop();
            if (!matrix) {
                matrix = new Matrix();
            }
            return matrix;
        }

        /**
         * Creates a new Matrix object with the specified parameters.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
            super();
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public a: number;

        /**
         * The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public b: number;

        /**
         * The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public c: number;

        /**
         * The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public d: number;

        /**
         * The distance by which to translate each point along the x axis.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public tx: number;

        /**
         * The distance by which to translate each point along the y axis.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public ty: number;

        /**
         * Returns a new Matrix object that is a clone of this matrix, with an exact copy of the contained object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clone(): Matrix {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        }

        /**
         * Concatenates a matrix with the current matrix, effectively combining the geometric effects of the two. In mathematical terms,
         * concatenating two matrixes is the same as combining them using matrix multiplication.
         * @param other The matrix to be concatenated to the source matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public concat(other: Matrix): void {
            let a = this.a * other.a;
            let b = 0.0;
            let c = 0.0;
            let d = this.d * other.d;
            let tx = this.tx * other.a + other.tx;
            let ty = this.ty * other.d + other.ty;

            if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
                a += this.b * other.c;
                d += this.c * other.b;
                b += this.a * other.b + this.b * other.d;
                c += this.c * other.a + this.d * other.c;
                tx += this.ty * other.c;
                ty += this.tx * other.b;
            }

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * Copies all of the matrix data from the source Point object into the calling Matrix object.
         * @param other The Matrix object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public copyFrom(other: Matrix): Matrix {
            this.a = other.a;
            this.b = other.b;
            this.c = other.c;
            this.d = other.d;
            this.tx = other.tx;
            this.ty = other.ty;
            return this;
        }

        /**
         * Sets each matrix property to a value that causes a null transformation.
         * An object transformed by applying an identity matrix will be identical to the original.
         * After calling the identity() method, the resulting matrix has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public identity(): void {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
        }

        /**
         * Performs the opposite transformation of the original matrix.
         * You can apply an inverted matrix to an object to undo the transformation performed when applying the original matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public invert(): void {
            this.$invertInto(this);
        }

        /**
         * @private
         */
        $invertInto(target: Matrix): void {
            let a = this.a;
            let b = this.b;
            let c = this.c;
            let d = this.d;
            let tx = this.tx;
            let ty = this.ty;
            if (b == 0 && c == 0) {
                target.b = target.c = 0;
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                }
                else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }

                return;
            }
            let determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return;
            }
            determinant = 1 / determinant;
            let k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
        }

        /**
         * Applies a rotation transformation to the Matrix object.
         * The rotate() method alters the a, b, c, and d properties of the Matrix object.
         * @param angle The rotation angle in radians.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public rotate(angle: number): void {
            angle = +angle;
            if (angle !== 0) {
                angle = angle / DEG_TO_RAD;
                let u = egret.NumberUtils.cos(angle);
                let v = egret.NumberUtils.sin(angle);
                let ta = this.a;
                let tb = this.b;
                let tc = this.c;
                let td = this.d;
                let ttx = this.tx;
                let tty = this.ty;
                this.a = ta * u - tb * v;
                this.b = ta * v + tb * u;
                this.c = tc * u - td * v;
                this.d = tc * v + td * u;
                this.tx = ttx * u - tty * v;
                this.ty = ttx * v + tty * u;
            }
        }

        /**
         * Applies a scaling transformation to the matrix.
         * The x axis is multiplied by sx, and the y axis it is multiplied by sy.
         * The scale() method alters the a and d properties of the Matrix object.
         * @param sx A multiplier used to scale the object along the x axis.
         * @param sy A multiplier used to scale the object along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public scale(sx: number, sy: number): void {
            if (sx !== 1) {
                this.a *= sx;
                this.c *= sx;
                this.tx *= sx;
            }
            if (sy !== 1) {
                this.b *= sy;
                this.d *= sy;
                this.ty *= sy;
            }
        }

        /**
         * Sets the members of Matrix to the specified values.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        }

        /**
         * Returns the result of applying the geometric transformation represented by the Matrix object to the specified point.
         * @param pointX The x coordinate for which you want to get the result of the Matrix transformation.
         * @param pointY The y coordinate for which you want to get the result of the Matrix transformation.
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns The point resulting from applying the Matrix transformation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public transformPoint(pointX: number, pointY: number, resultPoint?: Point): Point {
            let x = this.a * pointX + this.c * pointY + this.tx;
            let y = this.b * pointX + this.d * pointY + this.ty;
            if (resultPoint) {
                resultPoint.setTo(x, y);
                return resultPoint;
            }
            return new Point(x, y);
        }

        /**
         * Translates the matrix along the x and y axes, as specified by the dx and dy parameters.
         * @param dx The amount of movement along the x axis to the right, in pixels.
         * @param dy The amount of movement down along the y axis, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public translate(dx: number, dy: number): void {
            this.tx += dx;
            this.ty += dy;
        }

        /**
         * Determines whether two matrixes are equal.
         * @param other The matrix to be compared.
         * @returns A value of true if the object is equal to this Matrix object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public equals(other: Matrix): boolean {
            return this.a == other.a && this.b == other.b &&
                this.c == other.c && this.d == other.d &&
                this.tx == other.tx && this.ty == other.ty;
        }

        /**
         * Prepend matrix.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @returns Matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            let tx1 = this.tx;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                let a1 = this.a;
                let c1 = this.c;
                this.a = a1 * a + this.b * c;
                this.b = a1 * b + this.b * d;
                this.c = c1 * a + this.d * c;
                this.d = c1 * b + this.d * d;
            }
            this.tx = tx1 * a + this.ty * c + tx;
            this.ty = tx1 * b + this.ty * d + ty;
            return this;
        }

        /**
         * Append matrix.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @returns Matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
            let a1 = this.a;
            let b1 = this.b;
            let c1 = this.c;
            let d1 = this.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = a * a1 + b * c1;
                this.b = a * b1 + b * d1;
                this.c = c * a1 + d * c1;
                this.d = c * b1 + d * d1;
            }
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        }

        /**
         * Given a point in the pretransform coordinate space, returns the coordinates of that point after the transformation occurs.
         * Unlike the standard transformation applied using the transformPoint() method, the deltaTransformPoint() method's transformation does not consider the translation parameters tx and ty.
         * @param point The point for which you want to get the result of the matrix transformation.
         * @returns The point resulting from applying the matrix transformation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public deltaTransformPoint(point: Point): Point {
            let self = this;
            let x = self.a * point.x + self.c * point.y;
            let y = self.b * point.x + self.d * point.y;
            return new egret.Point(x, y);
        }

        /**
         * Returns a text value listing the properties of the Matrix object.
         * @returns A string containing the values of the properties of the Matrix object: a, b, c, d, tx, and ty.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString(): string {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        }

        /**
         * Includes parameters for scaling, rotation, and translation.
         * When applied to a matrix it sets the matrix's values based on those parameters.
         * @param scaleX The factor by which to scale horizontally.
         * @param scaleY The factor by which scale vertically.
         * @param rotation The amount to rotate, in radians.
         * @param tx The number of pixels to translate (move) to the right along the x axis.
         * @param ty The number of pixels to translate (move) down along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public createBox(scaleX: number, scaleY: number, rotation: number = 0, tx: number = 0, ty: number = 0): void {
            let self = this;
            if (rotation !== 0) {
                rotation = rotation / DEG_TO_RAD;
                let u = egret.NumberUtils.cos(rotation);
                let v = egret.NumberUtils.sin(rotation);
                self.a = u * scaleX;
                self.b = v * scaleY;
                self.c = -v * scaleX;
                self.d = u * scaleY;
            } else {
                self.a = scaleX;
                self.b = 0;
                self.c = 0;
                self.d = scaleY;
            }
            self.tx = tx;
            self.ty = ty;
        }

        /**
         * Creates the specific style of matrix expected by the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
         * Width and height are scaled to a scaleX/scaleY pair and the tx/ty values are offset by half the width and height.
         * @param width The width of the gradient box.
         * @param height The height of the gradient box.
         * @param rotation The amount to rotate, in radians.
         * @param tx The distance, in pixels, to translate to the right along the x axis. This value is offset by half of the width parameter.
         * @param ty The distance, in pixels, to translate down along the y axis. This value is offset by half of the height parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public createGradientBox(width: number, height: number, rotation: number = 0, tx: number = 0, ty: number = 0): void {
            this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
        }

        /**
         * @private
         */
        $transformBounds(bounds: Rectangle): void {
            let a = this.a;
            let b = this.b;
            let c = this.c;
            let d = this.d;
            let tx = this.tx;
            let ty = this.ty;

            let x = bounds.x;
            let y = bounds.y;
            let xMax = x + bounds.width;
            let yMax = y + bounds.height;

            let x0 = a * x + c * y + tx;
            let y0 = b * x + d * y + ty;
            let x1 = a * xMax + c * y + tx;
            let y1 = b * xMax + d * y + ty;
            let x2 = a * xMax + c * yMax + tx;
            let y2 = b * xMax + d * yMax + ty;
            let x3 = a * x + c * yMax + tx;
            let y3 = b * x + d * yMax + ty;

            let tmp = 0;

            if (x0 > x1) {
                tmp = x0;
                x0 = x1;
                x1 = tmp;
            }
            if (x2 > x3) {
                tmp = x2;
                x2 = x3;
                x3 = tmp;
            }

            bounds.x = Math.floor(x0 < x2 ? x0 : x2);
            bounds.width = Math.ceil((x1 > x3 ? x1 : x3) - bounds.x);

            if (y0 > y1) {
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            if (y2 > y3) {
                tmp = y2;
                y2 = y3;
                y3 = tmp;
            }

            bounds.y = Math.floor(y0 < y2 ? y0 : y2);
            bounds.height = Math.ceil((y1 > y3 ? y1 : y3) - bounds.y);
        }

        /**
         * @private
         */
        private getDeterminant() {
            return this.a * this.d - this.b * this.c;
        }

        /**
         * @private
         */
        $getScaleX(): number {
            let m = this;
            if (m.b == 0) {
                return m.a;
            }
            let result = Math.sqrt(m.a * m.a + m.b * m.b);
            return this.getDeterminant() < 0 ? -result : result;
        }

        /**
         * @private
         */
        $getScaleY(): number {
            let m = this;
            if (m.c == 0) {
                return m.d;
            }
            let result = Math.sqrt(m.c * m.c + m.d * m.d);
            return this.getDeterminant() < 0 ? -result : result;
        }

        /**
         * @private
         */
        $getSkewX(): number {
            if (this.d < 0) {
                return Math.atan2(this.d, this.c) + (PI / 2);
            }
            else {
                return Math.atan2(this.d, this.c) - (PI / 2);
            }
        }

        /**
         * @private
         */
        $getSkewY(): number {
            if(this.a < 0) {
                return Math.atan2(this.b, this.a) - PI;
            }
            else {
                return Math.atan2(this.b, this.a);
            }
        }

        /**
         * @private
         */
        $updateScaleAndRotation(scaleX: number, scaleY: number, skewX: number, skewY: number) {
            if ((skewX == 0 || skewX == TwoPI) && (skewY == 0 || skewY == TwoPI)) {
                this.a = scaleX;
                this.b = this.c = 0;
                this.d = scaleY;
                return;
            }
            skewX = skewX / DEG_TO_RAD;
            skewY = skewY / DEG_TO_RAD;
            let u = egret.NumberUtils.cos(skewX);
            let v = egret.NumberUtils.sin(skewX);
            if (skewX == skewY) {
                this.a = u * scaleX;
                this.b = v * scaleX;
            } else {
                this.a = egret.NumberUtils.cos(skewY) * scaleX;
                this.b = egret.NumberUtils.sin(skewY) * scaleX;
            }
            this.c = -v * scaleY;
            this.d = u * scaleY;
        }

        /**
         * @private
         * target = other * this
         */
        $preMultiplyInto(other: Matrix, target: Matrix): void {
            let a = other.a * this.a;
            let b = 0.0;
            let c = 0.0;
            let d = other.d * this.d;
            let tx = other.tx * this.a + this.tx;
            let ty = other.ty * this.d + this.ty;

            if (other.b !== 0.0 || other.c !== 0.0 || this.b !== 0.0 || this.c !== 0.0) {
                a += other.b * this.c;
                d += other.c * this.b;
                b += other.a * this.b + other.b * this.d;
                c += other.c * this.a + other.d * this.c;
                tx += other.ty * this.c;
                ty += other.tx * this.b;
            }

            target.a = a;
            target.b = b;
            target.c = c;
            target.d = d;
            target.tx = tx;
            target.ty = ty;
        }

    }
    
    /**
     * @private
     * Only for reuse within the framework, to prevent exposure to external references.
     */
    export let $TempMatrix = new Matrix();
}