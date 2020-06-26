class ToolBlur extends React.Component {

    constructor(props) {
        super(props);
        this.kernelSize = 5;
        this.sigma = 0;
    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Resize</h3>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">kernel size</p>
                    <input id="blur_kernel_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">sigma</p>
                    <input id="blur_sigma_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <p id="blur_error_message" className="error-message"/>
                </div>
                <div className="input-row">
                    <button id='blur_btn_apply' className="float-right btn-success">Apply</button>
                </div>
            </div>
        );
    }

    onApplyClick() {
        if (document.getElementById("blur_error_message").innerText === '') {
            evenBus.$emit('EventBlurImage', {
                kernelSize: this.kernelSize,
                sigma: this.sigma,
            });
        }
    }

    componentDidMount() {
        document.getElementById("blur_kernel_text").value = this.kernelSize.toString();
        document.getElementById("blur_sigma_text").value = this.sigma.toString();
        document.getElementById("blur_kernel_text").onchange = this.onTextKernelChange.bind(this);
        document.getElementById("blur_sigma_text").onchange = this.onTexSigmaChange.bind(this);
        document.getElementById("blur_btn_apply").onclick = this.onApplyClick.bind(this);
    }

    onTextKernelChange() {
        let kernelText = document.getElementById("blur_kernel_text").value;
        let kernelSize = parseInt(kernelText);
        if (kernelSize) {
            if (kernelSize < 1) {
                this.setErrorMessage('kernel size must greater than 0');
            } else if (kernelSize % 2 === 0) {
                this.setErrorMessage('kernel size must be an odd number');
            } else {
                this.kernelSize = kernelSize;
                this.setErrorMessage('');
            }
        } else {
            this.setErrorMessage('kernel size must be a number');
        }
    }

    onTexSigmaChange() {
        let sigmaText = document.getElementById("blur_sigma_text").value;
        let sigma = parseInt(sigmaText);
        if (sigma) {
            this.sigma = sigma;
        } else {
            this.setErrorMessage('sigma must be a number');
        }
    }

    setErrorMessage(message) {
        document.getElementById("blur_error_message").innerText = message;
    }
}