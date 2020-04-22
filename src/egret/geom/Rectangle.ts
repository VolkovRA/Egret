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
    let rectanglePool:Rectangle[] = [];

    /**
     * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.
     * 
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    export class Rectangle extends HashObject
    {
        /**
         * Releases a rectangle instance to the object pool.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(rect:Rectangle):void {
            if (!rect) {
                return;
            }
            rectanglePool.push(rect);
        }

        /**
         * Get a rectangle instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create():Rectangle {
            let rect = rectanglePool.pop();
            if (!rect) {
                rect = new Rectangle();
            }
            return rect;
        }

        /**
         * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified
         * width and height parameters.
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
            super();
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /**
         * The x coordinate of the top-left corner of the rectangle.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public x:number;

        /**
         * The y coordinate of the top-left corner of the rectangle.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public y:number;

        /**
         * The width of the rectangle, in pixels.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public width:number;

        /**
         * The height of the rectangle, in pixels.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public height:number;

        /**
         * The sum of the x and width properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get right():number {
            return this.x + this.width;
        }

        public set right(value:number) {
            this.width = value - this.x;
        }

        /**
         * The sum of the y and height properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bottom():number {
            return this.y + this.height;
        }

        public set bottom(value:number) {
            this.height = value - this.y;
        }

        /**
         * The x coordinate of the top-left corner of the rectangle.
         * Changing the left property of a Rectangle object has no effect on the y and height properties.
         * However it does affect the width property, whereas changing the x value does not affect the width property.
         * The value of the left property is equal to the value of the x property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get left():number {
            return this.x;
        }

        public set left(value:number) {
            this.width += this.x - value;
            this.x = value;
        }

        /**
         * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has
         * no effect on the x and width properties. However it does affect the height property, whereas changing the y
         * value does not affect the height property.
         * 
         * The value of the top property is equal to the value of the y property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get top():number {
            return this.y;
        }

        public set top(value:number) {
            this.height += this.y - value;
            this.y = value;
        }

        /**
         * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get topLeft():Point {
            return new Point(this.left, this.top);
        }

        public set topLeft(value:Point) {
            this.top = value.y;
            this.left = value.x;
        }

        /**
         * The location of the Rectangle object's bottom-right corner, determined by the values of the right and bottom properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bottomRight():Point {
            return new Point(this.right, this.bottom);
        }

        public set bottomRight(value:Point) {
            this.bottom = value.y;
            this.right = value.x;
        }

        /**
         * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
         * @param sourceRect The Rectangle object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public copyFrom(sourceRect:Rectangle):Rectangle {
            this.x = sourceRect.x;
            this.y = sourceRect.y;
            this.width = sourceRect.width;
            this.height = sourceRect.height;
            return this;
        }

        /**
         * Sets the members of Rectangle to the specified values.
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setTo(x:number, y:number, width:number, height:number):Rectangle {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        }

        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * @param x The x coordinate (horizontal position) of the point.
         * @param y The y coordinate (vertical position) of the point.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public contains(x:number, y:number):boolean {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        }

        /**
         * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns
         * the area of intersection as a Rectangle object. If the rectangles do not intersect, this method returns an empty
         * Rectangle object with its properties set to 0.
         * @param toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
         * @returns A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method
         * returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public intersection(toIntersect: Rectangle): Rectangle {
            return this.clone().$intersectInPlace(toIntersect);
        }

        /**
         * Increases the size of the Rectangle object by the specified amounts, in pixels.
         * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
         * @param dx The value to be added to the left and the right of the Rectangle object.
         * @param dy The value to be added to the top and the bottom of the Rectangle.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public inflate(dx:number, dy:number):void {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        }

        /**
         * @private
         */
        $intersectInPlace(clipRect: Rectangle): Rectangle {
            let x0 = this.x;
            let y0 = this.y;
            let x1 = clipRect.x;
            let y1 = clipRect.y;
            let l = Math.max(x0, x1);
            let r = Math.min(x0 + this.width, x1 + clipRect.width);
            if (l <= r) {
                let t = Math.max(y0, y1);
                let b = Math.min(y0 + this.height, y1 + clipRect.height);
                if (t <= b) {
                    this.setTo(l, t, r - l, b - t);
                    return this;
                }
            }
            this.setEmpty();
            return this;
        }

        /**
         * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
         * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it
         * intersects with this Rectangle object.
         * @param toIntersect The Rectangle object to compare against this Rectangle object.
         * @returns A value of true if the specified object intersects with this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public intersects(toIntersect:Rectangle):boolean {
            return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
                && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
        }

        /**
         * Determines whether or not this Rectangle object is empty.
         * @returns A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public isEmpty():boolean {
            return this.width <= 0 || this.height <= 0;
        }

        /**
         * Sets all of the Rectangle object's properties to 0.
         * A Rectangle object is empty if its width or height is less than or equal to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setEmpty():void {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }

        /**
         * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @returns A new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clone():Rectangle {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
         * @param point The point, as represented by its x and y coordinates.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public containsPoint(point:Point):boolean {
            if (this.x <= point.x
                && this.x + this.width >= point.x
                && this.y <= point.y
                && this.y + this.height >= point.y) {
                return true;
            }
            return false;
        }

        /**
         * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
         * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
         * @param rect The Rectangle object being checked.
         * @returns A value of true if the Rectangle object that you specify is contained by this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public containsRect(rect:egret.Rectangle):boolean {
            let r1 = rect.x + rect.width;
            let b1 = rect.y + rect.height;
            let r2 = this.x + this.width;
            let b2 = this.y + this.height;
            return (rect.x >= this.x) && (rect.x < r2) && (rect.y >= this.y) && (rect.y < b2) && (r1 > this.x) && (r1 <= r2) && (b1 > this.y) && (b1 <= b2);
        }

        /**
         * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
         * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
         * @param toCompare The rectangle to compare to this Rectangle object.
         * @returns A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public equals(toCompare:Rectangle):boolean {
            if (this === toCompare) {
                return true;
            }
            return this.x === toCompare.x && this.y === toCompare.y
                && this.width === toCompare.width && this.height === toCompare.height;
        }

        /**
         * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
         * @param point
         * * The x property of this Point object is used to increase the horizontal size of the Rectangle object.
         * * The y property is used to increase the vertical size of the Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public inflatePoint(point:Point):void {
            this.inflate(point.x, point.y);
        }

        /**
         * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
         * @param dx Moves the x value of the Rectangle object by this amount.
         * @param dy Moves the y value of the Rectangle object by this amount.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public offset(dx:number, dy:number):void {
            this.x += dx;
            this.y += dy;
        }

        /**
         * Adjusts the location of the Rectangle object using a Point object as a parameter.
         * This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
         * @param point A Point object to use to offset this Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public offsetPoint(point:Point):void {
            this.offset(point.x, point.y);
        }

        /**
         * Builds and returns a string that lists the horizontal and vertical positions and the width and height of the Rectangle object.
         * @returns A string listing the value of each of the following properties of the Rectangle object: x, y, width, and height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString():string {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        }

        /**
         * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
         * @param toUnion A Rectangle object to add to this Rectangle object.
         * @returns A new Rectangle object that is the union of the two rectangles.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public union(toUnion:Rectangle):Rectangle {
            let result = this.clone();
            if (toUnion.isEmpty()) {
                return result;
            }
            if (result.isEmpty()) {
                result.copyFrom(toUnion);
                return result;
            }
            let l: number = Math.min(result.x, toUnion.x);
            let t: number = Math.min(result.y, toUnion.y);
            result.setTo(l, t,
                Math.max(result.right, toUnion.right) - l,
                Math.max(result.bottom, toUnion.bottom) - t);
            return result;
        }

        /**
         * @private
         */
        $getBaseWidth(angle:number):number {
            let u = Math.abs(Math.cos(angle));
            let v = Math.abs(Math.sin(angle));
            return u * this.width + v * this.height;
        }

        /**
         * @private
         */
        $getBaseHeight(angle:number):number {
            let u = Math.abs(Math.cos(angle));
            let v = Math.abs(Math.sin(angle));
            return v * this.width + u * this.height;
        }
    }

    /**
     * @private
     * Only for reuse within the framework, to prevent exposure to external references.
     */
    export let $TempRectangle = new Rectangle();
}