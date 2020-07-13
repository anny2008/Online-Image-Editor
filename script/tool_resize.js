class ToolResize extends React.Component {
    constrainProportion;
    image;

    constructor(props) {
        super(props);
        this.constrainProportion = true;
        evenBus.$on('EventImageChanged', (function (image) {
            console.log('EventImageChanged');
            this.onImageChanged(image);
        }).bind(this));
    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Resize</h3>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">width</p>
                    <input id="resize_width_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">height</p>
                    <input id="resize_height_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p id="resize_error_message" className="error-message"/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">Constrain Proportion</p>
                    <input id="resize_constrain_proportion" type="checkbox" className="float-right form-check-input"/>
                </div>
                <div className="input-row">
                    <button id='resize_btn_apply' className="float-right btn-success">Apply</button>
                </div>
            </div>
        );
    }

    onApplyClick() {
        if (this.hasError() || !this.validateFutureSize())
            return;

        let widthText = document.getElementById("resize_width_text").value;
        let heightText = document.getElementById("resize_height_text").value;
        let futureW = parseInt(widthText);
        let futureH = parseInt(heightText);
        evenBus.$emit('EventResizeImage', {
            futureWidth: futureW,
            futureHeight: futureH
        });
    }

    onContrainProportionChanged() {
        this.constrainProportion = document.getElementById("resize_constrain_proportion").checked;
    }

    onTextWidthChange() {
        if (this.constrainProportion) {
            let widthText = document.getElementById("resize_width_text").value;
            let futureW = parseInt(widthText);
            if (futureW) {
                console.log(futureW, this.image.height, this.image.width);
                let futureH = Math.round(futureW * this.image.height / this.image.width);
                document.getElementById("resize_height_text").value = futureH;
            }
        }
        this.validateFutureSize();
    }

    onTextHeightChange() {
        if (this.constrainProportion) {
            let heightText = document.getElementById("resize_height_text").value;
            let futureH = parseInt(heightText);
            if (futureH) {
                let futureW = Math.round(futureH * this.image.width / this.image.height);
                document.getElementById("resize_width_text").value = futureW;
            }
        }
        this.validateFutureSize();
    }sn

    componentDidMount() {
        document.getElementById("resize_width_text").onchange = this.onTextWidthChange.bind(this);
        document.getElementById("resize_height_text").onchange = this.onTextHeightChange.bind(this);
        document.getElementById("resize_btn_apply").onclick = this.onApplyClick.bind(this);
        document.getElementById("resize_constrain_proportion").checked = true;
        document.getElementById("resize_constrain_proportion").onclick = this.onContrainProportionChanged.bind(this);
    }

    validateFutureSize() {
        console.log('validateFutureSize');
        let widthText = document.getElementById("resize_width_text").value;
        let heightText = document.getElementById("resize_height_text").value;
        let futureW = parseInt(widthText);
        let futureH = parseInt(heightText);
        if (futureW && futureH) {
            if (futureW < 1 || futureW > 9999 || futureH < 1 || futureH > 9999) {
                this.setErrorMessage('width and height must be in range (1, 9999)');
            } else if (futureW * futureH > 3000000) {
                this.setErrorMessage('this image is too big');
            } else {
                this.setErrorMessage('');
                return true;
            }
        } else {
            this.setErrorMessage('width and height must be number');
        }
        return false;
    }

    hasError() {
        let errorMsg = document.getElementById("resize_error_message").value;
        return errorMsg === '';
    }

    setErrorMessage(message) {
        document.getElementById("resize_error_message").innerText = message;
    }

    onImageChanged(image) {
        console.log('onImageChanged');
        this.image = image;
        document.getElementById("resize_width_text").value = '' + image.width;
        document.getElementById("resize_height_text").value = '' + image.height;
    }
}