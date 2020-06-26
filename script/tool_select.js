class ToolSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Crop Image</h3>
                </div>
                <div className="input-row">
                    <button id='btn_apply_crop' className="center btn-success">Apply</button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.getElementById("btn_apply_crop").onclick = this.onApplyClick.bind(this);
    }

    onApplyClick() {
        evenBus.$emit('EventToApplyCrop');
    }
}

class CropRect extends React.Component {
    constructor(props) {
        super(props);
        this.id = 'crop_rect';
        this.state = {
            enable: false,
            width: 0,
            height: 0,
            parentW: 0,
            parentH: 0,
            x: 0,
            y: 0,
        };
        this.imageW = 0;
        this.imageH = 0;
        evenBus.$on('EventEnableCrop', (function (image) {
            this.onEnableCrop(image);
        }).bind(this));
        evenBus.$on('EventOpenTool', (function (tool) {
            if (!(tool === 'tool_crop')) {
                this.setState({
                    enable: false,
                    width: 0,
                    height: 0,
                    parentW: 0,
                    parentH: 0,
                    x: 0,
                    y: 0,
                });
                this.imageW = 0;
                this.imageH = 0;
            }
        }).bind(this));
        evenBus.$on('EventToApplyCrop', (function (tool) {
            evenBus.$emit('EventApplyCrop', {
                startX: this.state.x,
                startY: this.state.y,
                width: this.state.width,
                height: this.state.height
            })
        }).bind(this));
    }

    render() {
        // if(this.state.enable){
        return (
            <div className="width-fluid height-fluid">

                <div className="width-fluid height-fluid bg-black positioned" style={{
                    // width: this.state.parentW,
                    // height: this.state.parentH,
                    opacity: 0.5,
                    clipPath: 'url(#clipping)'
                }}/>
                <div id={this.id + "root"} className="positioned" style={{
                    width: 0,
                    height: 0,
                    left: this.state.x,
                    top: this.state.y
                }}>
                    <div id={this.id + "left_resize"} className="positioned mouse-w-resize bg-white" style={{
                        width: 3,
                        height: this.state.height + 6,
                        left: -3,
                        top: -3,
                    }}/>
                    <div id={this.id + "top_resize"} className="positioned mouse-h-resize bg-white" style={{
                        width: this.state.width,
                        height: 3,
                        left: 0,
                        top: -3
                    }}/>
                    <div id={this.id + "crop_rect"} className='crop-rect' style={{
                        cursor: 'move',
                        width: this.state.width,
                        height: this.state.height,
                    }}>

                    </div>
                    <div id={this.id + "bottom_resize"} className="positioned mouse-h-resize bg-white" style={{
                        width: this.state.width + 6,
                        height: 3,
                        left: -3,
                        top: this.state.height
                    }}/>
                    <div id={this.id + "right_resize"} className="positioned mouse-w-resize bg-white" style={{
                        width: 3,
                        height: this.state.height + 6,
                        left: this.state.width,
                        top: -3
                    }}/>
                </div>
                <svg>
                    <defs>
                        <clipPath id="clipping">
                            <rect x="0" y="0" width={this.state.parentW} height={this.state.y}/>
                            <rect x="0" y={this.state.y} width={this.state.x} height={this.state.height}/>
                            <rect x="0" y={this.state.y + this.state.height} width={this.state.parentW}
                                  height={this.state.parentH}/>
                            <rect x={this.state.x + this.state.width} y={this.state.y} width={this.state.parentW}
                                  height={this.state.height}/>
                        </clipPath>
                    </defs>
                </svg>

            </div>
        );
        // }
        // else return null;
    }

    componentDidMount() {
        let cropRect = document.getElementById(this.id + "crop_rect");
        cropRect.onmousedown = this.onCropRectMouseDown.bind(this);
        // cropRect.onmousemove = this.onCropRectMouseMove.bind(this);
        // cropRect.onmouseup = this.onCropRectMouseUp.bind(this);
        cropRect.onmouseleave = this.onCropRectMouseUp.bind(this);
        let left = document.getElementById(this.id + "left_resize");
        left.onmousedown = this.onLeftMouseDown.bind(this);
        // left.onmousemove = this.onLeftMouseMove.bind(this);
        // left.onmouseup = this.onLeftMouseUp.bind(this);
        let top = document.getElementById(this.id + "top_resize");
        top.onmousedown = this.onTopMouseDown.bind(this);
        // top.onmousemove = this.onTopMouseMove.bind(this);
        // top.onmouseup = this.onTopMouseUp.bind(this);
        let bottom = document.getElementById(this.id + "bottom_resize");
        bottom.onmousedown = this.onBottomMouseDown.bind(this);
        // bottom.onmousemove = this.onBottomMouseMove.bind(this);
        // bottom.onmouseup = this.onBottomMouseUp.bind(this);
        let right = document.getElementById(this.id + "right_resize");
        right.onmousedown = this.onRightMouseDown.bind(this);
        // right.onmousemove = this.onRightMouseMove.bind(this);
        // right.onmouseup = this.onRightMouseUp.bind(this);
        // right.onmouseleave = this.onRightMouseUp.bind(this);
        document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    }

    // onMouseDown(e) {
    //     this.isResizing = true;
    //     this.oldPositionX = e.pageX;
    // }

    onMouseMove(e) {
        e.preventDefault();
        if (this.isMoving) {
            let position = {x: e.pageX, y: e.pageY};
            let dx = position.x - this.oldPosition.x;
            let dy = position.y - this.oldPosition.y;
            let x = this.state.x + dx;
            let y = this.state.y + dy;
            if (dx < 0 && x < this.x0) {
                x = this.x0;
            } else if (dx > 0 && x + this.state.width > this.imageW) {
                x = this.imageW - this.state.width + this.x0;
            }
            if (dy < 0 && y < this.y0) {
                y = this.y0;
            } else if (dy > 0 && y + this.state.height > this.imageH) {
                y = this.imageH - this.state.height + this.y0;
            }
            this.setState({
                x: x,
                y: y
            });
            this.oldPosition = position;
        } else {
            this.resize(e);
        }
    }

    onMouseUp(e) {
        this.isResizingRight = false;
        this.isResizingLeft = false;
        this.isResizingTop = false;
        this.isResizingBottom = false;
        this.isMoving = false;
        document.removeEventListener("mousemove", this.onMouseMove.bind(this), false);
    }

    resize(e) {
        let w = this.state.width;
        let h = this.state.height;
        let x = this.state.x;
        let y = this.state.y;
        if (this.isResizingRight) {
            const dx = e.pageX - this.oldPositionX;
            this.oldPositionX = e.pageX;
            w += dx;
            if (dx < 0 && w < 0) {
                w = 0;
            } else if (dx > 0 && w + x > this.x0 + this.imageW) {
                w = this.x0 + this.imageW - x;
            }
        }
        if (this.isResizingLeft) {
            const dx = e.pageX - this.oldPositionX;
            this.oldPositionX = e.pageX;
            let wi = w - dx;
            if (dx > 0 && wi < 0) {
                x += w;
                w = 0;
            } else if (dx < 0 && x + dx < this.x0) {
                w += (x - this.x0) ;
                x = this.x0;
            } else {
                w = wi;
                x += dx;
            }
        }
        if (this.isResizingTop) {
            const dy = e.pageY - this.oldPositionY;
            this.oldPositionY = e.pageY;
            let hi = h - dy;
            if (dy > 0 && hi < 0) {
                y += h;
                h = 0;
            } else if (dy < 0 && y + dy < this.y0) {
                h += (y - this.y0) ;
                y = this.y0;
            } else {
                h -= dy;
                y += dy;
            }
        }
        if (this.isResizingBottom) {
            const dy = e.pageY - this.oldPositionY;
            this.oldPositionY = e.pageY;
            h += dy;
            if (dy < 0 && h < 0) {
                h = 0;
            }
            if (dy > 0 && h + y > this.y0 + this.imageH) {
                h = this.y0 + this.imageH - y;
            }
        }
        this.setState({
            width: w,
            height: h,
            x: x,
            y: y,
        });
    }

    onCropRectMouseDown(e) {
        if (!this.state.enable)
            return;
        this.isMoving = true;
        this.oldPosition = {x: e.pageX, y: e.pageY};
    }

    onCropRectMouseMove(e) {
    }

    onCropRectMouseUp(e) {
    }

    onLeftMouseDown(e) {
        if (!this.state.enable)
            return;
        this.isResizingLeft = true;
        this.oldPositionX = e.pageX;
    }

    onRightMouseDown(e) {
        if (!this.state.enable)
            return;
        this.isResizingRight = true;
        this.oldPositionX = e.pageX;
    }

    onTopMouseDown(e) {
        if (!this.state.enable)
            return;
        this.isResizingTop = true;
        this.oldPositionY = e.pageY;
    }

    onBottomMouseDown(e) {
        if (!this.state.enable)
            return;
        this.isResizingBottom = true;
        this.oldPositionY = e.pageY;
    }

    onEnableCrop(image) {
        this.setState({
            width: image.width,
            height: image.height,
            x: image.x,
            y: image.y,
            enable: true,
            parentW: image.parentW,
            parentH: image.parentH,
        });
        this.x0 = image.x;
        this.y0 = image.y;
        this.imageW = image.width;
        this.imageH = image.height;
    }
}