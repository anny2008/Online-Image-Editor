class ToolText extends React.Component {
    constructor(props) {
        super(props);
        this.size = 80;
        this.colorCode = '#000000';
        this.fontList = ["Tangerine", "Lato", "Pangolin"];
        this.font = this.fontList[0];

    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Insert text</h3>
                </div>
                <div className="input-row">
                    <button id='btn_insert_new_text' className="center btn-success">Insert New Text</button>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">size</p>
                    <input id="text_size_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">color</p>
                    <input id="text_color_code_text" type="text"  className="float-right"/>
                    <input type="color" id="text_chosen_color" className="center margin-5" style={{width: 30}}/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">Font</p>

                    <select id="select_font" className="select-font">
                        {this.fontList.map(function (d, idx) {
                            return (<option value={d}>{d}</option>);
                        })}
                    </select>
                </div>
                <div className="input-row">
                    <p id="text_error_message" className="error-message"/>
                </div>
            </div>
        );
    }

    onTextSizeChange() {
        let sizeText = document.getElementById("text_size_text").value;
        let size = parseInt(sizeText);
        if (size) {
            this.size = size;
        } else {
            this.setErrorMessage('size must be a number');
        }
    }

    onTextColorCodeChange() {
        let colorCode = document.getElementById("text_color_code_text").value;
        if (/^#[0-9A-F]{6}$/i.test(colorCode)) {
            this.colorCode = colorCode;
            this.setErrorMessage('');
        } else {
            document.getElementById("text_color_code_text").value = this.colorCode;
            this.setErrorMessage('invalid color code');
        }
        document.getElementById("text_chosen_color").value = this.colorCode;
    }

    onTextColorChosenChanged(t) {
        let colorCode = document.getElementById("text_chosen_color").value;
        this.colorCode = colorCode;
        document.getElementById("text_color_code_text").value = this.colorCode;
    }

    onSelectFont() {
        this.font = document.getElementById("select_font").value;
        console.log('font = ' + this.font);
    }

    onInsertNewText() {
        evenBus.$emit('EventAddNewText', {
            color: this.colorCode,
            size: this.size,
            font: this.font,
        })
    }

    componentDidMount() {
        document.getElementById("text_size_text").value = this.size.toString();
        document.getElementById("text_color_code_text").value = this.colorCode;
        document.getElementById("text_chosen_color").value = this.colorCode;
        document.getElementById("text_chosen_color").onchange = this.onTextColorChosenChanged.bind(this);
        document.getElementById("text_size_text").onchange = this.onTextSizeChange.bind(this);
        document.getElementById("text_color_code_text").onchange = this.onTextColorCodeChange.bind(this);
        document.getElementById("select_font").onchange = this.onSelectFont.bind(this);
        document.getElementById("btn_insert_new_text").onclick = this.onInsertNewText.bind(this);
    }

    setErrorMessage(message) {
        document.getElementById("text_error_message").innerText = message;
    }
}

// class InsertTextField extends React.Component {
//     constructor(props) {
//         super(props);
//         this.enable = true;
//         this.id = 'InsertTextField' + props.id;
//         this.isDeleted = false;
//         this.state = {
//             width: parseFloat(props.width),
//             height: parseFloat(props.height),
//             x: parseFloat(props.x),
//             y: parseFloat(props.y),
//             offsetX: parseFloat(props.offsetX),
//             offsetY: parseFloat(props.offsetY),
//             scale: parseFloat(props.scale),
//             fontSize: parseFloat(props.fontSize),
//             textColor: props.color,
//             font: props.font,
//             rotate: 0,
//         }
//         evenBus.$on('EventOpenTool', (function (tool) {
//             this.enable = tool === 'tool_text';
//         }).bind(this));
//         evenBus.$on('EventImageRedraw', this.onImageRedraw.bind(this));
//     }
//
//     onImageRedraw(state) {
//         let x = state.offsetX + state.scale * (this.state.x - this.state.offsetX) / this.state.scale;
//         let y = state.offsetY + state.scale * (this.state.y - this.state.offsetY) / this.state.scale;
//         this.setState({
//             scale: state.scale,
//             x: x,
//             y: y,
//             offsetX: state.offsetX,
//             offsetY: state.offsetY
//         });
//     }
//
//     render() {
//         if (!this.isDeleted) {
//             return (
//                 <div id={this.id + "root"} className="positioned" style={{
//                     width: 0,
//                     height: 0,
//                     left: this.state.x,
//                     top: this.state.y,
//                     transform: 'scale(' + this.state.scale + ',' + this.state.scale + ')' + 'rotate(' + this.state.rotate + 'deg)'
//                 }}>
//                     <img src="image/rotate.png" id={this.id + "rotate"} className="positioned" style={{
//                         left: -20,
//                         top: -73,
//                     }}/>
//                     <div id={this.id + "left_resize"} className="positioned mouse-w-resize bg-black" style={{
//                         width: 3,
//                         height: this.state.height + 6,
//                         left: -3 - this.state.width * 0.5,
//                         top: -3,
//                     }}/>
//                     <div id={this.id + "top_resize"} className="positioned mouse-h-resize bg-black" style={{
//                         width: this.state.width,
//                         height: 3,
//                         left: 0 - this.state.width * 0.5,
//                         top: -3
//                     }}/>
//                     <div id={this.id + "text_field_container"} className="positioned" style={{
//                         width: this.state.width,
//                         height: this.state.height,
//                         left: 0 - this.state.width * 0.5,
//                         top: 0,
//                     }}>
//                         <textarea id={this.id + "text_field"} className="positioned" type="text" disabled hidden
//                                   style={{
//                                       width: this.state.width,
//                                       height: this.state.height,
//                                       left: 0,
//                                       top: 0,
//                                       background: 'none',
//                                       resize: 'none',
//                                       overflow: 'hidden',
//                                       border: 'none',
//                                       alignContent: 'start',
//                                       padding: '0',
//                                       color: this.state.textColor,
//                                       fontSize: this.state.fontSize,
//                                       fontFamily: this.state.font,
//                                   }}/>
//                         {/*<p id={this.id + "text"} className="positioned"*/}
//                         {/*   style={{*/}
//                         {/*       width: this.state.width,*/}
//                         {/*       height: this.state.height,*/}
//                         {/*       left: -this.state.width * 0.5,*/}
//                         {/*       top: 0,*/}
//                         {/*       background: 'none',*/}
//                         {/*       resize: 'none',*/}
//                         {/*       border: 'none',*/}
//                         {/*       alignContent: 'start',*/}
//                         {/*       padding: '0',*/}
//                         {/*       color: this.state.textColor,*/}
//                         {/*       fontSize: this.state.fontSize,*/}
//                         {/*       lineHeight: '' + ((this.state.fontSize + 3)) + 'px',*/}
//                         {/*       overflow: 'hidden',*/}
//                         {/*       fontFamily: this.state.font,*/}
//                         {/*   }}/>*/}
//
//                         <canvas id={this.id + "canvas_text"} style={{
//                             width: this.state.width,
//                             height: this.state.height,
//                             left: 0,
//                             top: 0,
//                         }}/>
//                     </div>
//                     <div id={this.id + "bottom_resize"} className="positioned mouse-h-resize bg-black" style={{
//                         width: this.state.width + 6,
//                         height: 3,
//                         left: -3 - this.state.width * 0.5,
//                         top: this.state.height
//                     }}/>
//                     <div id={this.id + "right_resize"} className="positioned mouse-w-resize bg-black" style={{
//                         width: 3,
//                         height: this.state.height + 6,
//                         left: this.state.width - this.state.width * 0.5,
//                         top: -3
//                     }}/>
//                     <div className="input-row positioned" style={{
//                         width: this.state.width + 6,
//                         left: -3 - this.state.width * 0.5,
//                         top: this.state.height + 3
//                     }}>
//                         <button id={this.id + "btn_delete"} className="float-left btn-danger">Delete</button>
//                         <button id={this.id + "btn_apply"} className="float-right btn-success">Apply</button>
//                     </div>
//                 </div>
//             );
//         } else return null;
//     }
//
//     componentDidMount() {
//         let textfield = document.getElementById(this.id + "text_field_container");
//         textfield.onmousedown = this.onTextFieldMouseDown.bind(this);
//         textfield.onmousemove = this.onTextFieldMouseMove.bind(this);
//         textfield.onmouseup = this.onTextFieldMouseUp.bind(this);
//         textfield.onmouseleave = this.onTextFieldMouseUp.bind(this);
//         textfield.ondblclick = this.onTextFieldDoubleClicked.bind(this);
//         document.getElementById(this.id + "rotate").onmousedown = this.onRotateMouseDown.bind(this);
//         let left = document.getElementById(this.id + "left_resize");
//         left.onmousedown = this.onLeftMouseDown.bind(this);
//         // left.onmousemove = this.onLeftMouseMove.bind(this);
//         // left.onmouseup = this.onLeftMouseUp.bind(this);
//         let top = document.getElementById(this.id + "top_resize");
//         top.onmousedown = this.onTopMouseDown.bind(this);
//         // top.onmousemove = this.onTopMouseMove.bind(this);
//         // top.onmouseup = this.onTopMouseUp.bind(this);
//         let bottom = document.getElementById(this.id + "bottom_resize");
//         bottom.onmousedown = this.onBottomMouseDown.bind(this);
//         // bottom.onmousemove = this.onBottomMouseMove.bind(this);
//         // bottom.onmouseup = this.onBottomMouseUp.bind(this);
//         let right = document.getElementById(this.id + "right_resize");
//         right.onmousedown = this.onRightMouseDown.bind(this);
//         // right.onmousemove = this.onRightMouseMove.bind(this);
//         // right.onmouseup = this.onRightMouseUp.bind(this);
//         // right.onmouseleave = this.onRightMouseUp.bind(this);
//         document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
//         document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
//         document.getElementById(this.id + "btn_apply").onclick = this.onApplyClick.bind(this);
//         document.getElementById(this.id + "btn_delete").onclick = this.onDeleteClick.bind(this);
//     }
//
//     onMouseUp(e) {
//         this.isResizingRight = false;
//         this.isResizingLeft = false;
//         this.isResizingTop = false;
//         this.isResizingBottom = false;
//         this.isRotating = false;
//     }
//
//     redraw() {
//         let canvas = document.getElementById(this.id + "canvas_text");
//         canvas.width = this.state.width;
//         canvas.height = this.state.height;
//         let context = canvas.getContext('2d');
//         context.textAlign = "start";
//         context.textBaseline = "top";
//         context.fillStyle = this.state.textColor;
//         context.font = this.state.fontSize.toString() + 'px ' + this.state.font;
//         let text = document.getElementById(this.id + "text_field").value;
//         let lines = text.split('\n');
//         for (let j = 0; j < lines.length; j++) {
//             context.fillText(lines[j], 0, j * (this.state.fontSize + 3));
//         }
//     }
//
//     onApplyClick() {
//         this.redraw();
//         let x = (this.state.x - this.state.offsetX) / this.state.scale;
//         let y = (this.state.y - this.state.offsetY) / this.state.scale;
//         let canvas = document.getElementById(this.id + "canvas_text");
//         let url = canvas.toDataURL('image/png');
//         console.log(url);
//         evenBus.$emit('EventApplyTextField', {
//             url: url,
//             rotate: this.state.rotate,
//             x: x,
//             y: y,
//             width: this.state.width,
//
//         });
//         // evenBus.$emit('EventApplyTextField', {
//         //     x: x,
//         //     y: y,
//         //     size: this.state.fontSize,
//         //     color: this.state.textColor,
//         //     font: this.state.font,
//         //     lineHeight: this.state.fontSize + 3,
//         //     text: document.getElementById(this.id + "text_field").value,
//         //     rotate: this.state.rotate,
//         // });
//         this.isDeleted = true;
//     }
//
//     onDeleteClick() {
//         this.isDeleted = true;
//     }
//
//     onMouseMove(e) {
//         if (this.isRotating) {
//             e.preventDefault();
//             let dy = e.pageY - this.state.y;
//             let dx = e.pageX - 300 - this.state.x;
//             let alpha = 180 - Math.atan2(dx, dy) * 180 / Math.PI;
//             this.setState({
//                 rotate: alpha
//             })
//         } else {
//             let w = this.state.width;
//             let h = this.state.height;
//             let x = this.state.x;
//             let y = this.state.y;
//             if (this.isResizingRight) {
//                 const dx = e.pageX - this.oldPositionX;
//                 this.oldPositionX = e.pageX;
//                 w += dx;
//                 if (w < 200) {
//                     w = 200;
//                 }
//             }
//             if (this.isResizingLeft) {
//                 const dx = e.pageX - this.oldPositionX;
//                 this.oldPositionX = e.pageX;
//                 w -= dx;
//                 if (w < 200) {
//                     w = 200;
//                 }
//                 x += dx;
//             }
//             if (this.isResizingTop) {
//                 const dy = e.pageY - this.oldPositionY;
//                 this.oldPositionY = e.pageY;
//                 h -= dy;
//                 if (h < 70) {
//                     h = 70;
//                 }
//                 y += dy;
//             }
//             if (this.isResizingBottom) {
//                 const dy = e.pageY - this.oldPositionY;
//                 this.oldPositionY = e.pageY;
//                 h += dy;
//                 if (h < 70) {
//                     h = 70;
//                 }
//             }
//             this.setState({
//                 width: w,
//                 height: h,
//                 x: x,
//                 y: y,
//             });
//         }
//         this.redraw();
//     }
//
//     onTextFieldDoubleClicked(e) {
//         let textfieldContainer = document.getElementById(this.id + "text_field_container");
//         textfieldContainer.style.cursor = 'pointer';
//         let text = document.getElementById(this.id + "canvas_text");
//         text.hidden = true;
//         let textfield = document.getElementById(this.id + "text_field");
//         textfield.disabled = false;
//         textfield.hidden = false;
//         textfield.focus();
//         textfield.onblur = this.onLoseFocus.bind(this);
//         console.log('double clicked');
//     }
//
//     onLoseFocus(e) {
//         let textfield = document.getElementById(this.id + "text_field");
//         textfield.disabled = true;
//         textfield.hidden = true;
//         let text = document.getElementById(this.id + "canvas_text");
//         text.hidden = false;
//         // text.innerText = textfield.value;
//         let textfieldContainer = document.getElementById(this.id + "text_field_container");
//         textfieldContainer.style.cursor = 'move';
//
//         this.redraw();
//     }
//
//     onRotateMouseDown(e) {
//         if (!this.enable)
//             return;
//         this.isRotating = true;
//         this.oldPositionX = e.pageX;
//     }
//
//     onTextFieldMouseDown(e) {
//         if (!this.enable)
//             return;
//         this.isMoving = true;
//         this.oldPosition = {x: e.pageX, y: e.pageY};
//     }
//
//     onTextFieldMouseMove(e) {
//         if (!this.enable)
//             return;
//         if (this.isMoving) {
//             let position = {x: e.pageX, y: e.pageY};
//             let x = this.state.x + position.x - this.oldPosition.x;
//             let y = this.state.y + position.y - this.oldPosition.y;
//             this.setState({
//                 x: x,
//                 y: y
//             });
//             this.oldPosition = position;
//         }
//     }
//
//     onTextFieldMouseUp(e) {
//         this.isMoving = false;
//     }
//
//     onLeftMouseDown(e) {
//         if (!this.enable)
//             return;
//         this.isResizingLeft = true;
//         this.oldPositionX = e.pageX;
//     }
//
//     onRightMouseDown(e) {
//         if (!this.enable)
//             return;
//         this.isResizingRight = true;
//         this.oldPositionX = e.pageX;
//     }
//
//     onTopMouseDown(e) {
//         if (!this.enable)
//             return;
//         this.isResizingTop = true;
//         this.oldPositionY = e.pageY;
//     }
//
//     onBottomMouseDown(e) {
//         if (!this.enable)
//             return;
//         this.isResizingBottom = true;
//         this.oldPositionY = e.pageY;
//     }
//
// }