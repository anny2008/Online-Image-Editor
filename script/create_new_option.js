class CreateNewOption extends React.Component {
    constructor(props) {
        super(props);
        evenBus.$on('EventShowCreateNewOption', (function () {
            $("#create_image_modal").modal("show");
        }).bind(this));
        this.futureW = 1920;
        this.futureH = 1080;
    }

    render() {
        return (
            <div className="modal" id="create_image_modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Create new</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="input-row">
                                <p className="float-left input-label">width</p>
                                <input id="create_new_width_text" type="number" className=""/>
                            </div>
                            <div className="input-row">
                                <p className="float-left input-label">height</p>
                                <input id="create_new_height_text" type="number" className=""/>
                            </div>
                            <div className="input-row">
                                <p id="create_new_error_message" className="error-message"/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button id='btn_create_new' className="btn-success">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.getElementById("create_new_width_text").onchange = this.validateFutureSize.bind(this);
        document.getElementById("create_new_height_text").onchange = this.validateFutureSize.bind(this);
        document.getElementById("btn_create_new").onclick = this.onCreateNewClick.bind(this);
        document.getElementById("create_new_width_text").value = this.futureW.toString();
        document.getElementById("create_new_height_text").value = this.futureH.toString();
    }

    validateFutureSize() {
        let widthText = document.getElementById("create_new_width_text").value;
        let heightText = document.getElementById("create_new_height_text").value;
        let futureW = parseInt(widthText);
        let futureH = parseInt(heightText);
        if (futureW && futureH) {
            if (futureW < 1 || futureW > 9999 || futureH < 1 || futureH > 9999) {
                this.setErrorMessage('width and height must be in range (1, 9999)');
            } else if (futureW * futureH > 3000000) {
                this.setErrorMessage('this image is too big');
            } else {
                this.futureW = futureW;
                this.futureH = futureH;
                this.setErrorMessage('');
                return true;
            }
        } else {
            this.setErrorMessage('width and height must be number');
        }
        return false;
    }

    setErrorMessage(message) {
        document.getElementById("create_new_error_message").innerText = message;
    }

    onCreateNewClick(){
        if(this.validateFutureSize()){
            $("#create_image_modal").modal("hide");
            let editor = document.getElementById('editor');
            let menu = document.getElementById('main_menu');
            menu.hidden = true;
            editor.hidden = false;
            evenBus.$emit('EventImageCreated', {
                width: this.futureW,
                height: this.futureH
            });
        }
    }

}