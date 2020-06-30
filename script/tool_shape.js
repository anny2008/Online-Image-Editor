class ToolShape extends React.Component {
    constructor(props) {
        super(props);
        this.shapeList = ['rect', 'round'];
        this.shape = 'rect';
        this.lineWidth = 3;
        this.color = '#000000';
        this.isFill = false;

    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Insert text</h3>
                </div>
                <div className="input-row">
                    <button id='btn_insert_new_shape' className="center btn-success">Insert New Shape</button>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">Shape</p>

                    <select id="select_shape" className="select-font">
                        {this.shapeList.map(function (d, idx) {
                            return (<option value={d}>{d}</option>);
                        })}
                    </select>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">Fill?</p>
                    <input id="shape_is_fill" type="checkbox" className="float-right form-check-input"/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">line width</p>
                    <input id="shape_line_width_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">color</p>
                    <input id="shape_color_code_text" type="text" className="float-right"/>
                    <input type="color" id="shape_chosen_color" className="center margin-5" style={{width: 30}}/>
                </div>
                <div className="input-row">
                    <p id="shape_error_message" className="error-message"/>
                </div>
            </div>
        );
    }

    onLineWidthTextChange() {
        let sizeText = document.getElementById("shape_line_width_text").value;
        let size = parseInt(sizeText);
        if (size) {
            this.lineWidth = size;
        } else {
            this.setErrorMessage('line width must be a number');
        }
    }

    onTextColorCodeChange() {
        let colorCode = document.getElementById("shape_color_code_text").value;
        if (/^#[0-9A-F]{6}$/i.test(colorCode)) {
            this.color = colorCode;
            this.setErrorMessage('');
        } else {
            document.getElementById("shape_color_code_text").value = this.color;
            this.setErrorMessage('invalid color code');
        }
        document.getElementById("shape_chosen_color").value = this.color;
    }

    onShapeColorChosenChanged() {
        let colorCode = document.getElementById("shape_chosen_color").value;
        this.color = colorCode;
        document.getElementById("shape_color_code_text").value = this.color;
    }

    onSelectShape() {
        this.shape = document.getElementById("select_shape").value;
    }

    onInsertNewShape() {
        evenBus.$emit('EventAddNewShape', {
            color: this.color,
            lineWidth: this.lineWidth,
            isFill: this.isFill,
            shape: this.shape,
        })
    }

    onFillChanged() {
        this.isFill = document.getElementById("shape_is_fill").checked;
    }


    componentDidMount() {
        document.getElementById("shape_line_width_text").value = this.lineWidth;
        document.getElementById("shape_color_code_text").value = this.color;
        document.getElementById("shape_chosen_color").value = this.color;
        document.getElementById("shape_chosen_color").onchange = this.onShapeColorChosenChanged.bind(this);
        document.getElementById("shape_line_width_text").onchange = this.onLineWidthTextChange.bind(this);
        document.getElementById("shape_color_code_text").onchange = this.onTextColorCodeChange.bind(this);
        document.getElementById("select_shape").onchange = this.onSelectShape.bind(this);
        document.getElementById("btn_insert_new_shape").onclick = this.onInsertNewShape.bind(this);
        document.getElementById("shape_is_fill").onclick = this.onFillChanged.bind(this);
    }

    setErrorMessage(message) {
        document.getElementById("paint_error_message").innerText = message;
    }
}