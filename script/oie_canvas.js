class OieCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            textFields: [],
            shapes: [],
            positionX: 0,
            positionY: 0,
            rightBarPos: 0,
            bottomBarPos: 0,
            rightBarHeight: 0,
            bottomBarWidth: 0
        }
        this.textFieldId = 0;
        this.scale = 1;
        this.drawPoints = [];
        this.imageStack = [];
        this.currentImageIndex = -1;
        this.freePaintStyle = {color: "#000000", size: 1};
        this.allowZooming = true;

        evenBus.$on('EventImageLoaded', this.onImageLoaded.bind(this));
        evenBus.$on('EventImageCreated', this.onImageCreated.bind(this));
        evenBus.$on('EventResizeImage', this.onResizeImage.bind(this));
        evenBus.$on('EventSetFreePaintStyle', this.onSetFreePaintStyle.bind(this));
        evenBus.$on('EventAddNewText', this.addNewText.bind(this));
        evenBus.$on('EventAddNewShape', this.addNewShape.bind(this));
        evenBus.$on('EventApplyCanvas', this.applyCanvas.bind(this));
        evenBus.$on('EventOpenTool', (function (tool) {
            if (tool === 'tool_crop') {
                this.enableCrop();
            } else if (this.tool === 'tool_crop') {
                this.disableCrop();
            }
            this.tool = tool;
        }).bind(this));
        evenBus.$on('EventApplyCrop', this.applyCrop.bind(this));
        evenBus.$on('EventRotateLeft', this.rotateLeft.bind(this));
        evenBus.$on('EventRotateRight', this.rotateRight.bind(this));
        evenBus.$on('EventExportImage', this.exportImage.bind(this));
        evenBus.$on('EventBlurImage', this.blurImage.bind(this));
        evenBus.$on('EventBrightnessChanged', this.changeBrightness.bind(this));
        evenBus.$on('EventBrightnessAdjust', this.adjustBrightness.bind(this));
    }

    enableCrop() {
        this.allowZooming = false;
        this.scale = Math.min((this.state.width - 50) / this.image.width, (this.state.height - 50) / this.image.height, 1);
        let barParentH = document.getElementById("right_scroll_bar").offsetHeight;
        let barParentW = document.getElementById("bottom_scroll_bar").offsetWidth;
        let posX= (this.state.width - this.image.width * this.scale) * 0.5;
        let posY= (this.state.height - this.image.height * this.scale) * 0.5;

        this.setState({
            positionX: posX,
            positionY: posY,
            rightBarHeight: barParentH,
            rightBarPos: 0,
            bottomBarPos: 0,
            bottomBarWidth: barParentW,
        });
        this.redraw();

        evenBus.$emit('EventEnableCrop', {
            x: posX,
            y: posY,
            width: this.image.width * this.scale,
            height: this.image.height * this.scale,
            parentW: this.state.width,
            parentH: this.state.height
        });
    }

    disableCrop() {
        this.allowZooming = true;
        this.updateScrollbar();
    }

    onImageLoaded() {
        let output = cv.imread(this.src);
        this.flushImage(output);
        this.scale = 1;
        evenBus.$emit('EventImageChanged', this.image);
        this.src.onload = (function () {
            this.updateScrollbar();
        }).bind(this);
    }

    onImageCreated(info) {
        this.scale = 1;
        let output = new cv.Mat(info.height, info.width, cv.CV_8UC4);
        this.flushImage(output);
        evenBus.$emit('EventImageChanged', this.image);
        this.src.onload = (function () {
            this.updateScrollbar();
        }).bind(this);
    }

    render() {
        return (
            <div className="padding-none center bg-grey-900 positioned" style={{
                width: this.state.width, height: this.state.height, left: 300, top: 0
            }}>
                <div id="relative_container" style={{
                    position: 'relative', width: this.state.width, height: this.state.height, overflow: 'hidden'
                }}>
                    <canvas id="canvas" className="positioned" style={{
                        left: this.state.positionX,
                        top: this.state.positionY
                    }}/>
                    <div id="all_text_field_container">
                        {
                            this.state.textFields.map((style) => style ? (
                                <FlexibleTextField id={style.id}
                                                   x={this.state.width * 0.5}
                                                   y={this.state.height * 0.5 - Math.min(this.state.height * 0.5, 70) * 0.5}
                                                   width={this.state.width * 0.5}
                                                   height={Math.min(this.state.height * 0.5, 70)}
                                                   scale={this.scale}
                                                   offsetX={this.state.positionX}
                                                   offsetY={this.state.positionY}
                                                   fontSize={style.size}
                                                   font={style.font} color={style.color}/>
                            ) : (<div/>))
                        }
                    </div>
                    <div id="all_shape_container">
                        {
                            this.state.shapes.map((style) => style ? (
                                <FlexibleShape id={style.id}
                                               x={this.state.width * 0.5}
                                               y={this.state.height * 0.5 - Math.min(this.state.height * 0.5, 70) * 0.5}
                                               width={this.state.width * 0.5}
                                               height={Math.min(this.state.height * 0.5, 70)}
                                               scale={this.scale}
                                               offsetX={this.state.positionX}
                                               offsetY={this.state.positionY}
                                               isFill={style.isFill}
                                               strokeWidth={style.lineWidth}
                                               color={style.color}
                                               shape={style.shape}
                                />
                            ) : (<div/>))
                        }
                    </div>
                    <CropRect/>
                    <div id="right_scroll_bar">
                        <div id="right_scroll" className="bg-grey-100 positioned" style={{
                            height: this.state.rightBarHeight,
                            top: this.state.rightBarPos
                        }}/>
                    </div>
                    <div id="bottom_scroll_bar">
                        <div id="bottom_scroll" className="bg-grey-100 positioned" style={{
                            width: this.state.bottomBarWidth,
                            left: this.state.bottomBarPos
                        }}/>
                    </div>
                </div>
                <div className="margin-none width-fluid padding-5">
                    <p className="float-left center bg-grey-800 padding-5" id="image_info_text">2000 x 1000 @ 100%</p>
                    <div className="float-right">
                        <button id='btn_undo' className="btn btn-dark margin-5">Undo</button>
                        <button id='btn_redo' className="btn btn-dark margin-5">Redo</button>
                        <button id='btn_close' className="btn btn-dark margin-5">Close</button>
                        <button id='btn_save' className="btn btn-success margin-5">Save</button>
                    </div>
                </div>
                <canvas id="canvas_src" hidden/>
                <img id="text_image" hidden/>
            </div>
        );
    }

    updateScrollbar() {
        let w = this.image.width * this.scale;
        let h = this.image.height * this.scale;
        let parentW = this.state.width;
        let parentH = this.state.height;
        let x = (parentW - w) * 0.5;
        let y = (parentH - h) * 0.5;
        this.setState({
            positionX: x,
            positionY: y
        });
        this.redraw();
        let rightBarHeight = this.state.rightBarHeight;
        let rightBarPos = this.state.rightBarPos;
        let bottomBarWidth = this.state.bottomBarWidth;
        let bottomBarPos = this.state.bottomBarPos;
        let bottomBar = document.getElementById("bottom_scroll");
        if (h > parentH) {
            let barParentH = document.getElementById("right_scroll_bar").offsetHeight;
            let barH = parentH / h;
            // rightBar.style.height = '' + barH + '%';
            rightBarHeight = barH * barParentH;
            rightBarPos = (barParentH - rightBarHeight) * 0.5;
            // rightBar.style.top = '' + (barParentH - barH * barParentH * 0.01) * 0.5;
        } else {
            // rightBar.style.height = '100%';
            // rightBar.style.top = '0';
            rightBarHeight = parentH;
            rightBarPos = 0;
        }
        if (w > parentW) {
            let barW = parentW / w;
            let barParentW = document.getElementById("bottom_scroll_bar").offsetWidth;
            // bottomBar.style.width = '' + barW + '%';
            // bottomBar.style.left = '' + (barParentW - barW * barParentW * 0.01) * 0.5;
            bottomBarWidth = barW * barParentW;
            bottomBarPos = (barParentW - bottomBarWidth) * 0.5;
        } else {
            // bottomBar.style.width = '100%';
            // bottomBar.style.left = '0';
            bottomBarWidth = parentW;
            bottomBarPos = 0;
        }
        this.setState({
            rightBarHeight: rightBarHeight,
            rightBarPos: rightBarPos,
            bottomBarWidth: bottomBarWidth,
            bottomBarPos: bottomBarPos,
        });
        this.updateImageInfo();
    }

    redraw() {
        let w = this.image.width * this.scale;
        let h = this.image.height * this.scale;
        let parentW = this.state.width;
        let parentH = this.state.height;
        let x = this.state.positionX;
        let y = this.state.positionY;
        this.offsetX = (w > parentW) ? -x : 0;
        this.offsetY = (h > parentH) ? -y : 0;
        let canvas = document.getElementById("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.style.left = "" + x;
        canvas.style.top = "" + y;
        this.canvasContext = canvas.getContext('2d');
        this.canvasContext.drawImage(this.src, 0, 0, this.image.width, this.image.height, 0, 0, w, h);
        this.freeDraw(this.canvasContext, this.scale);
        evenBus.$emit('EventImageRedraw', {
            offsetX: this.state.positionX,
            offsetY: this.state.positionY,
            scale: this.scale,
        })
    }

    addNewText(style) {
        style.id = this.textFieldId;
        console.log('addNewText font', style.font);
        this.textFieldId += 1;
        this.state.textFields.push(style);
        this.setState({
            textFields: this.state.textFields
        });
    }

    addNewShape(style) {
        style.id = this.textFieldId;
        this.textFieldId += 1;
        this.state.shapes.push(style);
        this.setState({
            shapes: this.state.shapes
        });
    }

    applyCanvas(style) {
        let text_image = document.getElementById("text_image");
        text_image.onload = (function () {
            this.canvasSrc.width = this.image.width;
            this.canvasSrc.height = this.image.height;
            let context = this.canvasSrc.getContext('2d');
            context.drawImage(this.src, 0, 0);
            this.freeDraw(context, 1);
            this.drawPoints = [];
            context.translate(style.x, style.y);
            context.rotate(style.rotate / 180 * Math.PI);
            context.drawImage(document.getElementById("text_image"), -style.width * 0.5, 0);
            this.backUpImage();
        }).bind(this);
        text_image.src = style.url;
    }

    freeDraw(context, scale) {
        for (let i = 0; i < this.drawPoints.length - 1; i++) {
            let beginPoint = this.drawPoints[i];
            let endPoint = this.drawPoints[i + 1];
            if (endPoint && beginPoint) {
                this.drawLine(context, scale, beginPoint, endPoint);
            } else if (beginPoint) {
                this.drawPoint(context, scale, beginPoint);
            }
        }
    }

    drawLine(context, scale, begin, end) {
        let beginX = begin.x * scale;
        let beginY = begin.y * scale;
        let endX = end.x * scale;
        let endY = end.y * scale;
        context.lineCap = 'round';
        context.strokeStyle = begin.color;
        context.lineWidth = begin.size * scale;
        context.beginPath();
        context.moveTo(beginX, beginY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    drawPoint(context, scale, point) {
        let x = point.x * scale;
        let y = point.y * scale;
        context.fillStyle = point.color;
        context.beginPath();
        context.arc(x, y, point.size * scale * 0.5, 0, 2 * Math.PI);
        context.fill();
    }

    wheel(e) {
        if (!this.allowZooming)
            return;
        this.scale -= e.deltaY * 0.001;
        if (this.scale < 0.1) {
            this.scale = 0.1;
        } else if (this.scale > 50) {
            this.scale = 50;
        }
        this.updateScrollbar();
    }

    onRightScrollBarMouseDown(e) {
        if (!this.allowZooming)
            return;
        e.preventDefault();
        this.isScrollRight = true;
        this.oldMousePos = e.pageY;
    }

    onRightScrollBarMouseMove(e) {
        if (!this.allowZooming)
            return;
        e.preventDefault();
        if (!this.isScrollRight)
            return;
        let delta = e.pageY - this.oldMousePos;
        let parentH = document.getElementById('right_scroll_bar').offsetHeight;
        let newPos = this.state.rightBarPos + delta;
        if (newPos < 0)
            newPos = 0;
        else if (newPos > parentH - this.state.rightBarHeight)
            newPos = parentH - this.state.rightBarHeight;
        this.setState({
            positionY: -newPos,
            rightBarPos: newPos,
        });
        this.oldMousePos = e.pageY;
        this.redraw();
    }

    onRightScrollBarMouseUp(e) {
        if (!this.allowZooming)
            return;
        e.preventDefault();
        this.isScrollRight = false;
    }

    onBottomScrollBarMouseDown(e) {
        if (!this.allowZooming)
            return;
        e.preventDefault();
        this.isScrollBottom = true;
        this.oldMousePos = e.screenX;
    }

    onBottomScrollBarMouseMove(e) {
        if (!this.allowZooming)
            return;
        e.preventDefault();
        if (!this.isScrollBottom)
            return;
        let delta = e.pageX - this.oldMousePos;
        let parentW = document.getElementById('bottom_scroll_bar').offsetWidth;
        let newPos = this.state.bottomBarPos + delta;
        if (newPos < 0)
            newPos = 0;
        else if (newPos > parentW - this.state.bottomBarWidth)
            newPos = parentW - this.state.bottomBarWidth;
        this.setState({
            positionX: -newPos,
            bottomBarPos: newPos,
        });
        this.oldMousePos = e.pageX;
        this.redraw();
    }

    onBottomScrollBarMouseUp(e) {
        if (!this.allowZooming)
            return;
        e.preventDefault();
        this.isScrollBottom = false;
    }

    onCanvasMouseDown(e) {
        if (this.tool === 'tool_brush_draw') {
            this.isFreePainting = true;
            this.insertDrawPoint(e);
            this.redraw();
        }
    }

    onCanvasMouseMove(e) {
        if (this.tool === 'tool_brush_draw' && this.isFreePainting) {
            this.insertDrawPoint(e);
            this.redraw();
        }
    }

    onCanvasMouseUp(e) {
        if (this.tool === 'tool_brush_draw' && this.isFreePainting) {
            this.isFreePainting = false;
            this.drawPoints.push(null);
            this.flushFreePaint();
        }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        this.canvasSrc = document.getElementById("canvas_src");
        this.src = document.getElementById('image_src');
        window.addEventListener('resize', this.updateWindowDimensions.bind(this));
        document.getElementById("canvas").onwheel = this.wheel.bind(this);
        document.getElementById("canvas").onmousedown = this.onCanvasMouseDown.bind(this);
        document.getElementById("canvas").onmousemove = this.onCanvasMouseMove.bind(this);
        document.getElementById("canvas").onmouseup = this.onCanvasMouseUp.bind(this);
        document.getElementById("canvas").onmouseleave = this.onCanvasMouseUp.bind(this);
        document.getElementById("right_scroll_bar").onmousedown = this.onRightScrollBarMouseDown.bind(this);
        document.getElementById("right_scroll_bar").onmousemove = this.onRightScrollBarMouseMove.bind(this);
        document.getElementById("right_scroll_bar").onmouseup = this.onRightScrollBarMouseUp.bind(this);
        document.getElementById("right_scroll_bar").onmouseleave = this.onRightScrollBarMouseUp.bind(this);
        document.getElementById("bottom_scroll_bar").onmousedown = this.onBottomScrollBarMouseDown.bind(this);
        document.getElementById("bottom_scroll_bar").onmousemove = this.onBottomScrollBarMouseMove.bind(this);
        document.getElementById("bottom_scroll_bar").onmouseup = this.onBottomScrollBarMouseUp.bind(this);
        document.getElementById("bottom_scroll_bar").onmouseleave = this.onBottomScrollBarMouseUp.bind(this);
        document.getElementById("btn_save").onclick = this.onSaveClicked.bind(this);
        document.getElementById("btn_undo").onclick = this.undo.bind(this);
        document.getElementById("btn_redo").onclick = this.redo.bind(this);
    }

    onSaveClicked() {
        evenBus.$emit('EventShowExportOption');
    }

    exportImage(type) {
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: (window.innerWidth - 300), height: (window.innerHeight - 70)});
    }

    updateImageInfo() {
        document.getElementById("image_info_text").innerText = "" + this.image.width + "x" + this.image.height + "@" + Math.round(this.scale * 100) + "%";
    }

    onSetFreePaintStyle(info) {
        this.freePaintStyle = info;
    }

    insertDrawPoint(e) {
        let canvas = document.getElementById("canvas");
        let x = (e.pageX - canvas.offsetLeft - 300) / this.scale;
        let y = (e.pageY - canvas.offsetTop) / this.scale;
        this.drawPoints.push({
            x: x,
            y: y,
            color: this.freePaintStyle.color,
            size: this.freePaintStyle.size
        });
    }

    onResizeImage(futureSize) {
        let output = new cv.Mat();
        let input = cv.imread(this.src);
        this.scale = 1;
        cv.resize(input, output, new cv.Size(futureSize.futureWidth, futureSize.futureHeight), 0, 0, cv.INTER_NEAREST);
        this.flushImage(output);
        this.scale = 1;
    }

    applyCrop(info) {
        let input = cv.imread(this.src);
        let ROI = new cv.Rect((info.startX - this.state.positionX) / this.scale, (info.startY - this.state.positionY) / this.scale, info.width / this.scale, info.height / this.scale);
        let output = input.roi(ROI);
        this.flushImage(output);
        this.scale = 1;
        input.delete();
        evenBus.$emit('EventCloseAllTool');
    }

    rotateLeft() {
        this.rotate(cv.ROTATE_90_COUNTERCLOCKWISE);
    }

    rotateRight() {
        this.rotate(cv.ROTATE_90_CLOCKWISE);
    }

    rotate(degree) {
        let input = cv.imread(this.src);
        let output = new cv.Mat();
        cv.rotate(input, output, degree);
        this.flushImage(output);
        this.scale = 1;
        input.delete();
    }

    blurImage(info) {
        let input = cv.imread(this.src);
        let output = new cv.Mat();
        console.log(info.sigma, info.kernelSize);
        cv.GaussianBlur(input, output, new cv.Size(info.kernelSize, info.kernelSize), info.sigma, cv.BORDER_DEFAULT);
        this.flushImage(output);
        input.delete();
    }

    adjustBrightness(brightness) {
        this.canvasContext.filter = 'brightness(' + brightness + ')';
        this.redraw();
    }

    changeBrightness(brightness) {
        let input = cv.imread(this.src);
        let output = new cv.Mat();
        cv.convertScaleAbs(input, output, 1, brightness);
        this.flushImage(output);
        input.delete();
    }

    flushFreePaint() {
        this.canvasSrc.width = this.image.width;
        this.canvasSrc.height = this.image.height;
        let context = this.canvasSrc.getContext('2d');
        context.drawImage(this.src, 0, 0);
        this.freeDraw(context, 1);
        this.drawPoints = [];
        this.backUpImage();
    }

    flushImage(output) {
        this.canvasSrc.style.width = output.size().width;
        this.canvasSrc.style.height = output.size().height;
        cv.imshow(this.canvasSrc, output);
        this.image = {
            width: output.size().width,
            height: output.size().height
        };
        output.delete();
        this.backUpImage();
    }

    undo() {
        if (this.currentImageIndex > 0 && this.currentImageIndex < this.imageStack.length) {
            this.currentImageIndex -= 1;
            this.displayCurrentImage();
        }
    }

    redo() {

        if (this.currentImageIndex >= 0 && this.currentImageIndex < this.imageStack.length - 1) {
            this.currentImageIndex += 1;
            this.displayCurrentImage();
        }
    }

    displayCurrentImage() {
        let record = this.imageStack[this.currentImageIndex];
        this.image = {
            width: record.w,
            height: record.h
        }
        this.src.src = record.url;
    }

    backUpImage() {
        let url = this.canvasSrc.toDataURL("image/png");
        let amount = this.imageStack.length - 1 - this.currentImageIndex;
        console.log('amount =', amount);
        if (amount > 0) {
            this.imageStack = this.imageStack.slice(0, this.currentImageIndex + 1);
        }
        console.log('stack length', this.imageStack.length);
        this.imageStack.push({
            url: url,
            w: this.image.width,
            h: this.image.height
        });
        this.currentImageIndex += 1;
        this.src.src = url;
    }
}
