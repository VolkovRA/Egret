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
    let pointPool:Point[] = [];
    let DEG_TO_RAD:number = Math.PI / 180;

    /**
     * The Point object represents a location in a two-dimensional coordinate system,
     * where x represents the horizontal axis and y represents the vertical axis.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    export class Point extends HashObject
    {
        /**
         * Releases a point instance to the object pool.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(point:Point):void {
            if(!point){
                return;
            }
            pointPool.push(point);
        }

        /**
         * Get a point instance from the object pool or create a new one.
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create(x:number,y:number):Point {
            let point = pointPool.pop();
            if (!point) {
                point = new Point();
            }
            return point.setTo(x,y);
        }

        /**
         * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(x:number = 0, y:number = 0) {
            super();

            this.x = x;
            this.y = y;
        }

        /**
         * The horizontal coordinate.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public x:number;

        /**
         * The vertical coordinate.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public y:number;

        /**
         * The length of the line segment from (0,0) to this point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get length():number{
            return Math.sqrt(this.x*this.x+this.y*this.y);
        }

        /**
         * Sets the members of Point to the specified values.
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setTo(x:number, y:number):Point {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
         * Creates a copy of this Point object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clone():Point {
            return new Point(this.x, this.y);
        }

        /**
         * Determines whether two points are equal.
         * Two points are equal if they have the same x and y values.
         * @param toCompare The point to be compared.
         * @returns A value of true if the object is equal to this Point object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public equals(toCompare:Point):boolean {
            return this.x == toCompare.x && this.y == toCompare.y;
        }

        /**
         * Returns the distance between pt1 and pt2.
         * @param p1 The first point.
         * @param p2 The second point.
         * @returns The distance between the first and second points.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static distance(p1:Point, p2:Point):number {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        }

        /**
         * Copies all of the point data from the source Point object into the calling Point object.
         * @param sourcePoint The Point object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public copyFrom(sourcePoint:Point):void {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        }

        /**
         * Adds the coordinates of another point to the coordinates of this point to create a new point.
         * @param v The point to be added.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public add(v:Point):Point {
            return new Point(this.x + v.x, this.y + v.y);
        }

        /**
         * Determines a point between two specified points.
         * The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
         * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1).
         * The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
         * @param pt1 The first point.
         * @param pt2 The second point.
         * @param f The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
         * @returns The new interpolated point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static interpolate(pt1:Point, pt2:Point, f:number):Point {
            let f1:number = 1 - f;
            return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
        }

        /**
         * Scales the line segment between (0,0) and the current point to a set length.
         * @param thickness The scaling value. For example, if the current point is (0,5), and you normalize it to 1, the point returned is at (0,1).
         * @version Egret 2.4
         * @platform Web,Native
         */
        public normalize(thickness:number):void {
            if (this.x != 0 || this.y != 0) {
                let relativeThickness:number = thickness / this.length;
                this.x *= relativeThickness;
                this.y *= relativeThickness;
            }
        }

        /**
         * Offsets the Point object by the specified amount.
         * The value of dx is added to the original value of x to create the new x value.
         * The value of dy is added to the original value of y to create the new y value.
         * @param dx The amount by which to offset the horizontal coordinate, x.
         * @param dy The amount by which to offset the vertical coordinate, y.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public offset(dx:number, dy:number):void {
            this.x += dx;
            this.y += dy;
        }

        /**
         * Converts a pair of polar coordinates to a Cartesian point coordinate.
         * @param len The length coordinate of the polar pair.
         * @param angle The angle, in radians, of the polar pair.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static polar(len:number, angle:number):Point {
            return new Point(len * NumberUtils.cos(angle / DEG_TO_RAD), len * NumberUtils.sin(angle / DEG_TO_RAD));
        }

        /**
         * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
         * @param v The point to be subtracted.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public subtract(v:Point):Point {
            return new Point(this.x - v.x, this.y - v.y);
        }

        /**
         * Returns a string that contains the values of the x and y coordinates.
         * The string has the form "(x=x, y=y)", so calling the toString() method for a point at 23,17 would return "(x=23, y=17)".
         * @returns The string representation of the coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString():string {
            return "(x=" + this.x + ", y=" + this.y + ")";
        }
    }
    
    /**
     * @private
     * Only for reuse within the framework, to prevent exposure to external references.
     */
    export let $TempPoint = new Point();
}