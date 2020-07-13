class FlexibleWidget extends React.Component {
    constructor(props) {
        super(props);
        this.enable = true;
        this.id = 'FlexibleWidget' + props.id;
        this.state = {
            width: parseFloat(props.width),
            height: parseFloat(props.height),
            x: parseFloat(props.x),
            y: parseFloat(props.y),
            offsetX: parseFloat(props.offsetX),
            offsetY: parseFloat(props.offsetY),
            scale: parseFloat(props.scale),
            rotate: 0,
            isDeleted: false
        };
        let minWidth = parseFloat(props.minWidth);
        this.minWidth = minWidth ? minWidth : 1;
        let minHeight = parseFloat(props.minHeight);
        this.minHeight = minHeight ? minHeight : 1;
        // evenBus.$on('EventOpenTool', (function (tool) {
        //     this.enable = tool === 'tool_text';
        // }).bind(this));
        evenBus.$on('EventImageRedraw', this.onImageRedraw.bind(this));
    }

    redraw() {

    }

    onImageRedraw(state) {
        let x = state.offsetX + state.scale * (this.state.x - this.state.offsetX) / this.state.scale;
        let y = state.offsetY + state.scale * (this.state.y - this.state.offsetY) / this.state.scale;
        this.setState({
            scale: state.scale,
            x: x,
            y: y,
            offsetX: state.offsetX,
            offsetY: state.offsetY
        });
    }

    render() {
        if (!this.state.isDeleted) {
            return (
                <div id={this.id + "root"} className="positioned" style={{
                    width: 0,
                    height: 0,
                    left: this.state.x,
                    top: this.state.y,
                    transform: 'scale(' + this.state.scale + ',' + this.state.scale + ')' + 'rotate(' + this.state.rotate + 'deg)'
                }}>
                    <img src="image/rotate.png" id={this.id + "rotate"} className="positioned" alt=" "
                         style={{
                        left: -20,
                        top: -73,
                    }}/>
                    <div id={this.id + "left_resize"} className="positioned mouse-w-resize bg-black" style={{
                        width: 3,
                        height: this.state.height + 6,
                        left: -3 - this.state.width * 0.5,
                        top: -3,
                    }}/>
                    <div id={this.id + "top_resize"} className="positioned mouse-h-resize bg-black" style={{
                        width: this.state.width,
                        height: 3,
                        left: 0 - this.state.width * 0.5,
                        top: -3
                    }}/>
                    <div id={this.id + "flexible_container"} className="positioned" style={{
                        width: this.state.width,
                        height: this.state.height,
                        left: 0 - this.state.width * 0.5,
                        top: 0,
                    }}>
                        {this.child}
                    </div>
                    <div id={this.id + "bottom_resize"} className="positioned mouse-h-resize bg-black" style={{
                        width: this.state.width + 6,
                        height: 3,
                        left: -3 - this.state.width * 0.5,
                        top: this.state.height
                    }}/>
                    <div id={this.id + "right_resize"} className="positioned mouse-w-resize bg-black" style={{
                        width: 3,
                        height: this.state.height + 6,
                        left: this.state.width - this.state.width * 0.5,
                        top: -3
                    }}/>
                    <div className="input-row positioned" style={{
                        width: this.state.width + 6,
                        left: -3 - this.state.width * 0.5,
                        top: this.state.height + 3
                    }}>
                        <button id={this.id + "btn_delete"} className="float-left btn-danger">Delete</button>
                        <button id={this.id + "btn_apply"} className="float-right btn-success">Apply</button>
                    </div>
                </div>
            );
        } else return null;
    }

    componentDidMount() {
        let flexibleContainer = document.getElementById(this.id + "flexible_container");
        flexibleContainer.onmousedown = this.onFlexibleContainerMouseDown.bind(this);
        flexibleContainer.onmousemove = this.onFlexibleContainerMouseMove.bind(this);
        flexibleContainer.onmouseup = this.onFlexibleContainerMouseUp.bind(this);
        flexibleContainer.onmouseleave = this.onFlexibleContainerMouseUp.bind(this);
        document.getElementById(this.id + "rotate").onmousedown = this.onRotateMouseDown.bind(this);
        let left = document.getElementById(this.id + "left_resize");
        left.onmousedown = this.onLeftMouseDown.bind(this);
        let top = document.getElementById(this.id + "top_resize");
        top.onmousedown = this.onTopMouseDown.bind(this);
        let bottom = document.getElementById(this.id + "bottom_resize");
        bottom.onmousedown = this.onBottomMouseDown.bind(this);
        let right = document.getElementById(this.id + "right_resize");
        right.onmousedown = this.onRightMouseDown.bind(this);
        document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        document.getElementById(this.id + "btn_apply").onclick = this.onApplyClick.bind(this);
        document.getElementById(this.id + "btn_delete").onclick = this.onDeleteClick.bind(this);
    }

    onMouseUp(e) {
        this.isResizingRight = false;
        this.isResizingLeft = false;
        this.isResizingTop = false;
        this.isResizingBottom = false;
        this.isRotating = false;
    }

    onApplyClick() {
        this.redraw();
        let x = (this.state.x - this.state.offsetX) / this.state.scale;
        let y = (this.state.y - this.state.offsetY) / this.state.scale;
        let canvas = document.getElementById(this.id + "canvas");
        let url = canvas.toDataURL('image/png');
        console.log(url);
        evenBus.$emit('EventApplyCanvas', {
            url: url,
            rotate: this.state.rotate,
            x: x,
            y: y,
            width: this.state.width,

        });
        this.state.isDeleted = true;
    }

    onDeleteClick() {
        this.setState({isDeleted: true});
    }

    onMouseMove(e) {
        if (this.state.isDeleted) {
            return;
        }
        if (this.isRotating) {
            e.preventDefault();
            let dy = e.pageY - this.state.y;
            let dx = e.pageX - 300 - this.state.x;
            let alpha = 180 - Math.atan2(dx, dy) * 180 / Math.PI;
            this.setState({
                rotate: alpha
            })
        } else if (this.isResizingBottom || this.isResizingTop || this.isResizingLeft || this.isResizingRight) {
            let w = this.state.width;
            let h = this.state.height;
            let x = this.state.x;
            let y = this.state.y;
            if (this.isResizingRight) {
                const dx = e.pageX - this.oldPositionX;
                this.oldPositionX = e.pageX;
                w += dx;
                if (w < this.minWidth) {
                    w = this.minWidth;
                }
            }
            if (this.isResizingLeft) {
                const dx = e.pageX - this.oldPositionX;
                this.oldPositionX = e.pageX;
                w -= dx;
                if (w < this.minWidth) {
                    w = this.minWidth;
                }
                x += dx;
            }
            if (this.isResizingTop) {
                const dy = e.pageY - this.oldPositionY;
                this.oldPositionY = e.pageY;
                h -= dy;
                if (h < this.minHeight) {
                    h = this.minHeight;
                }
                y += dy;
            }
            if (this.isResizingBottom) {
                const dy = e.pageY - this.oldPositionY;
                this.oldPositionY = e.pageY;
                h += dy;
                if (h < this.minHeight) {
                    h = this.minHeight;
                }
            }
            this.setState({
                width: w,
                height: h,
                x: x,
                y: y,
            });
            this.redraw();
        }
    }

    onRotateMouseDown(e) {
        if (!this.enable)
            return;
        this.isRotating = true;
        this.oldPositionX = e.pageX;
    }

    onFlexibleContainerMouseDown(e) {
        if (!this.enable)
            return;
        e.preventDefault();
        this.isMoving = true;
        this.oldPosition = {x: e.pageX, y: e.pageY};
    }

    onFlexibleContainerMouseMove(e) {
        if (!this.enable)
            return;
        if (this.isMoving) {
            e.preventDefault();
            let position = {x: e.pageX, y: e.pageY};
            let x = this.state.x + position.x - this.oldPosition.x;
            let y = this.state.y + position.y - this.oldPosition.y;
            this.setState({
                x: x,
                y: y
            });
            this.oldPosition = position;
        }
    }

    onFlexibleContainerMouseUp(e) {
        this.isMoving = false;
    }

    onLeftMouseDown(e) {
        if (!this.enable)
            return;
        this.isResizingLeft = true;
        this.oldPositionX = e.pageX;
    }

    onRightMouseDown(e) {
        if (!this.enable)
            return;
        this.isResizingRight = true;
        this.oldPositionX = e.pageX;
    }

    onTopMouseDown(e) {
        if (!this.enable)
            return;
        this.isResizingTop = true;
        this.oldPositionY = e.pageY;
    }

    onBottomMouseDown(e) {
        if (!this.enable)
            return;
        this.isResizingBottom = true;
        this.oldPositionY = e.pageY;
    }
}

class FlexibleShape extends FlexibleWidget {
    constructor(props) {
        super(props);
        this.id = 'FlexibleShape' + props.id;
        this.state.strokeWidth = parseFloat(props.strokeWidth);
        this.state.color = props.color;
        this.state.isFill = props.isFill;
        this.state.shape = props.shape;
        this.child = (
            <div>
                <canvas id={this.id + "canvas"} hidden/>
                <img id={this.id + "image"} hidden/>
            </div>
        );
    }

    redraw() {
        super.redraw();
        let canvas = document.getElementById(this.id + "canvas");
        canvas.width = this.state.width;
        canvas.height = this.state.height;
        let context = canvas.getContext('2d');
        if (this.state.isFill) {
            context.fillStyle = this.state.color;
            if (this.state.shape === 'rect') {
                context.fillRect(this.state.strokeWidth, this.state.strokeWidth, this.state.width - this.state.strokeWidth * 2, this.state.height - this.state.strokeWidth * 2);
            } else {
                context.ellipse(this.state.width * 0.5, this.state.height * 0.5, this.state.width * 0.5 - this.state.strokeWidth, this.state.height * 0.5 - this.state.strokeWidth, 0, 0, 2 * Math.PI);
                context.fill();
            }
        } else {
            context.strokeStyle = this.state.color;
            context.lineWidth = this.state.strokeWidth;
            if (this.state.shape === 'rect') {
                context.strokeRect(this.state.strokeWidth, this.state.strokeWidth, this.state.width - this.state.strokeWidth * 2, this.state.height - this.state.strokeWidth * 2);
            } else {
                context.ellipse(this.state.width * 0.5, this.state.height * 0.5, this.state.width * 0.5 - this.state.strokeWidth, this.state.height * 0.5 - this.state.strokeWidth, 0, 0, 2 * Math.PI);
                context.stroke();
            }
        }
        let url = canvas.toDataURL('image/png');
        let image = document.getElementById(this.id + "image");
        image.hidden = false;
        image.src = url;
    }

    componentDidMount() {
        super.componentDidMount();
        this.redraw();
    }
}

class FlexibleTextField extends FlexibleWidget {
    constructor(props) {
        super(props);
        this.id = 'FlexibleTextField' + props.id;
        this.state.fontSize = parseFloat(props.fontSize);
        this.state.textColor = props.color;
        this.state.font = props.font;
        this.child = (
            <div id={this.id + "text_field_container"} className="positioned" style={{
                width: this.state.width,
                height: this.state.height,
                left: 0,
                top: 0,
            }}>
                <textarea id={this.id + "text_field"} className="positioned" disabled hidden
                          style={{
                              width: this.state.width,
                              height: this.state.height,
                              left: 0,
                              top: 0,
                              background: 'none',
                              resize: 'none',
                              overflow: 'hidden',
                              border: 'none',
                              alignContent: 'start',
                              padding: '0',
                              color: this.state.textColor,
                              fontSize: this.state.fontSize,
                              fontFamily: this.state.font,
                          }}/>
                <canvas id={this.id + "canvas"} hidden/>
                <img id={this.id + "image"} hidden/>
            </div>
        );
    }

    componentDidMount() {
        super.componentDidMount();
        let textFieldContainer = document.getElementById(this.id + "text_field_container");
        textFieldContainer.ondblclick = this.onTextFieldDoubleClicked.bind(this);
    }

    onTextFieldDoubleClicked(e) {
        let textfieldContainer = document.getElementById(this.id + "text_field_container");
        textfieldContainer.style.cursor = 'pointer';
        let text = document.getElementById(this.id + "image");
        text.hidden = true;
        let textfield = document.getElementById(this.id + "text_field");
        textfield.disabled = false;
        textfield.hidden = false;
        textfield.style.width = this.state.width;
        textfield.style.height = this.state.height;
        textfield.focus();
        textfield.onblur = this.onLoseFocus.bind(this);
        console.log('double clicked');
    }

    onLoseFocus(e) {
        let textfield = document.getElementById(this.id + "text_field");
        textfield.disabled = true;
        textfield.hidden = true;
        let text = document.getElementById(this.id + "image");
        text.hidden = false;
        // text.innerText = textfield.value;
        let textfieldContainer = document.getElementById(this.id + "text_field_container");
        textfieldContainer.style.cursor = 'move';

        this.redraw();
    }

    redraw() {
        let canvas = document.getElementById(this.id + "canvas");
        canvas.width = this.state.width;
        canvas.height = this.state.height;
        let context = canvas.getContext('2d');
        context.textAlign = "start";
        context.textBaseline = "top";
        context.fillStyle = this.state.textColor;
        context.font = this.state.fontSize.toString() + 'px ' + this.state.font;
        let text = document.getElementById(this.id + "text_field").value;
        let lines = text.split('\n');
        for (let j = 0; j < lines.length; j++) {
            context.fillText(lines[j], 0, j * (this.state.fontSize + 3));
        }
        let url = canvas.toDataURL('image/png');
        console.log('url =', url);
        let image = document.getElementById(this.id + "image");
        image.src = url;
    }

}