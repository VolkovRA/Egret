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

/// <reference path="WebGLRenderBuffer.ts" />
/// <reference path="WebGLUtils.ts" />

namespace egret.web
{
    /**
     * @private
     * Vertex array management objects.
     * Used to maintain vertex array.
     */
    export class WebGLVertexArrayObject
    {
        /**
         * Define vertex format:
         * (x: 8 * 4 = 32) + (y: 8 * 4 = 32) + (u: 8 * 4 = 32) + (v: 8 * 4 = 32) + (tintcolor: 8 * 4 = 32) = (8 * 4 = 32) * (x + y + u + v + tintcolor: 5);
         */
        private readonly vertSize: number = 5;

        private readonly vertByteSize = this.vertSize * 4;

        /**
         * At most single submission maxQuadsCount so many quad.
         */
        private readonly maxQuadsCount: number = 2048;

        /**
         * Quad = 4 Vertex.
         */
        private readonly maxVertexCount: number = this.maxQuadsCount * 4;

        /**
         * Supporting Indices = quad * 6.
         */
        private readonly maxIndicesCount: number = this.maxQuadsCount * 6;

        private vertices: Float32Array = null;
        private indices: Uint16Array = null;
        private indicesForMesh: Uint16Array = null;

        private vertexIndex: number = 0;
        private indexIndex: number = 0;

        private hasMesh: boolean = false;

        /**
         * Refactor: 
         */
        private _vertices: ArrayBuffer = null;
        private _verticesFloat32View: Float32Array = null;
        private _verticesUint32View: Uint32Array = null;

        constructor() {
            //old
            const numVerts = this.maxVertexCount * this.vertSize;
            this.vertices = new Float32Array(numVerts);
            ///
            this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
            this._verticesFloat32View = new Float32Array(this._vertices);
            this._verticesUint32View = new Uint32Array(this._vertices);
            this.vertices = this._verticesFloat32View;
            // Index buffer, maximum index number
            /*
            0-------1
            |       |
            |       |
            3-------2  
            0->1->2
            0->2->3 
            Two triangles
            */
            const maxIndicesCount = this.maxIndicesCount;
            this.indices = new Uint16Array(maxIndicesCount);
            this.indicesForMesh = new Uint16Array(maxIndicesCount);
            for (let i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                this.indices[i + 0] = j + 0;
                this.indices[i + 1] = j + 1;
                this.indices[i + 2] = j + 2;
                this.indices[i + 3] = j + 0;
                this.indices[i + 4] = j + 2;
                this.indices[i + 5] = j + 3;
            }
        }

        /**
         * Whether the maximum number of caches is reached.
         */
        public reachMaxSize(vertexCount: number = 4, indexCount: number = 6): boolean {
            return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
        }

        /**
         * Get the cached vertex array.
         */
        public getVertices(): any {
            let view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
            return view;
        }

        /**
         * Get the cached index array.
         */
        public getIndices(): any {
            return this.indices;
        }

        /**
         * Get the cached mesh index array.
         */
        public getMeshIndices(): any {
            return this.indicesForMesh;
        }

        /**
         * Switch to mesh index cache.
         */
        public changeToMeshIndices(): void {
            if (!this.hasMesh) {
                // Copy the default index information to for mesh.
                for (let i = 0, l = this.indexIndex; i < l; ++i) {
                    this.indicesForMesh[i] = this.indices[i];
                }

                this.hasMesh = true;
            }
        }

        public isMesh(): boolean {
            return this.hasMesh;
        }

        /**
         * The default constitutes a rectangle.
         */
        // private defaultMeshVertices = [0, 0, 1, 0, 1, 1, 0, 1];
        // private defaultMeshUvs = [
        //     0, 0,
        //     1, 0,
        //     1, 1,
        //     0, 1
        // ];
        // private defaultMeshIndices = [0, 1, 2, 0, 2, 3];

        /**
         * Cache a set of vertices.
         */
        public cacheArrays(buffer: WebGLRenderBuffer, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number, textureSourceWidth: number, textureSourceHeight: number,
            meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], rotated?: boolean): void {
            let alpha = buffer.globalAlpha;
            /**
             * Mix in tintcolor => alpha.
             */
            alpha = Math.min(alpha, 1.0);
            const globalTintColor = buffer.globalTintColor || 0xFFFFFF;
            const currentTexture = buffer.currentTexture;
            alpha = ( (alpha < 1.0 && currentTexture && currentTexture[UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                 WebGLUtils.premultiplyTint(globalTintColor, alpha) 
                 : globalTintColor + (alpha * 255 << 24));
            /*
            Interim test
            */
            // Calculate the drawing matrix, and then restore the matrix back to the previous
            let locWorldTransform = buffer.globalMatrix;

            let a = locWorldTransform.a;
            let b = locWorldTransform.b;
            let c = locWorldTransform.c;
            let d = locWorldTransform.d;
            let tx = locWorldTransform.tx;
            let ty = locWorldTransform.ty;

            let offsetX = buffer.$offsetX;
            let offsetY = buffer.$offsetY;
            if (offsetX != 0 || offsetY != 0) {
                tx = offsetX * a + offsetY * c + tx;
                ty = offsetX * b + offsetY * d + ty;
            }

            if (!meshVertices) {
                if (destX != 0 || destY != 0) {
                    tx = destX * a + destY * c + tx;
                    ty = destX * b + destY * d + ty;
                }

                let a1 = destWidth / sourceWidth;
                if (a1 != 1) {
                    a = a1 * a;
                    b = a1 * b;
                }
                
                let d1 = destHeight / sourceHeight;
                if (d1 != 1) {
                    c = d1 * c;
                    d = d1 * d;
                }
            }

            if (meshVertices) {
                // Calculate index position and assignment
                const vertices = this.vertices;
                const verticesUint32View = this._verticesUint32View;
                let index = this.vertexIndex * this.vertSize;
                // Cache vertex array
                let i = 0, iD = 0, l = 0;
                let u = 0, v = 0, x = 0, y = 0;
                for (i = 0, l = meshUVs.length; i < l; i += 2) {
                    iD = index + i * 5 / 2;
                    x = meshVertices[i];
                    y = meshVertices[i + 1];
                    u = meshUVs[i];
                    v = meshUVs[i + 1];
                    // xy
                    vertices[iD + 0] = a * x + c * y + tx;
                    vertices[iD + 1] = b * x + d * y + ty;
                    // uv
                    if (rotated) {
                        vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                        vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                    }
                    else {
                        vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                        vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                    }
                    // alpha
                    verticesUint32View[iD + 4] = alpha;
                }
                // Cache index array
                if (this.hasMesh) {
                    for (let i = 0, l = meshIndices.length; i < l; ++i) {
                        this.indicesForMesh[this.indexIndex + i] = meshIndices[i] + this.vertexIndex;
                    }
                }

                this.vertexIndex += meshUVs.length / 2;
                this.indexIndex += meshIndices.length;
            }
            else {
                let width = textureSourceWidth;
                let height = textureSourceHeight;
                let w = sourceWidth;
                let h = sourceHeight;
                sourceX = sourceX / width;
                sourceY = sourceY / height;
                let vertices = this.vertices;
                const verticesUint32View = this._verticesUint32View;
                let index = this.vertexIndex * this.vertSize;
                if (rotated) {
                    let temp = sourceWidth;
                    sourceWidth = sourceHeight / width;
                    sourceHeight = temp / height;
                    // xy
                    vertices[index++] = tx;
                    vertices[index++] = ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + tx;
                    vertices[index++] = b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + c * h + tx;
                    vertices[index++] = d * h + b * w + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = c * h + tx;
                    vertices[index++] = d * h + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                }
                else {
                    sourceWidth = sourceWidth / width;
                    sourceHeight = sourceHeight / height;
                    // xy
                    vertices[index++] = tx;
                    vertices[index++] = ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + tx;
                    vertices[index++] = b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + c * h + tx;
                    vertices[index++] = d * h + b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = c * h + tx;
                    vertices[index++] = d * h + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                }
                // Cache index array
                if (this.hasMesh) {
                    let indicesForMesh = this.indicesForMesh;
                    indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                }

                this.vertexIndex += 4;
                this.indexIndex += 6;
            }
        }

        public clear(): void {
            this.hasMesh = false;
            this.vertexIndex = 0;
            this.indexIndex = 0;
        }
    }
}