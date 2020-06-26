class ToolPaint extends React.Component {
    constructor(props) {
        super(props);
        this.size = 1;
        this.colorCode = '#000000';
    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Paint</h3>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">size</p>
                    <input id="paint_size_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">color code</p>
                    <input id="paint_color_code_text" type="text" className=""/>
                    <div className="chosen-color" id="paint_chosen_color"/>
                </div>
                <div className="input-row">
                    <p id="paint_error_message" className="error-message"/>
                </div>
            </div>
        );
    }

    onTextSizeChange() {
        let sizeText = document.getElementById("paint_size_text").value;
        let size = parseInt(sizeText);
        if (size) {
            this.size = size;
            this.setFreePaintStyle();
        } else {
            this.setErrorMessage('size must be a number');
        }
    }

    onTextColorCodeChange() {
        let colorCode = document.getElementById("paint_color_code_text").value;
        if (/^#[0-9A-F]{6}$/i.test(colorCode)) {
            this.colorCode = colorCode;
            this.setFreePaintStyle();
            this.setErrorMessage('');
        } else {
            document.getElementById("paint_color_code_text").value = this.colorCode;
            this.setErrorMessage('invalid color code');
        }
        document.getElementById("paint_chosen_color").style.backgroundColor = this.colorCode;
    }

    componentDidMount() {
        document.getElementById("paint_chosen_color").style.backgroundColor = this.colorCode;
        document.getElementById("paint_size_text").value = this.size.toString();
        document.getElementById("paint_color_code_text").value = this.colorCode;
        document.getElementById("paint_size_text").onchange = this.onTextSizeChange.bind(this);
        document.getElementById("paint_color_code_text").onchange = this.onTextColorCodeChange.bind(this);
    }

    hasError() {
        let errorMsg = document.getElementById("paint_error_message").value;
        return errorMsg === '';
    }

    setErrorMessage(message) {
        document.getElementById("paint_error_message").innerText = message;
    }

    setFreePaintStyle(){
        evenBus.$emit('EventSetFreePaintStyle', {
            color: this.colorCode,
            size: this.size
        })
    }
}