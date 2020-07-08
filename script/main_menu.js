class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        evenBus.$on('EventOnAuthApiLoad', this.onAuthApiLoaded.bind(this));
        evenBus.$on('EventOnPickerApiLoad', this.onPickerApiLoaded.bind(this));
        evenBus.$on('EventOnUserLogin', this.onUserLogin.bind(this));
        evenBus.$on('EventOnImageDownloaded', this.onImageDownloaded.bind(this));
        evenBus.$on('EventOnHomeClicked', this.onHomeClicked.bind(this));
    }

    render() {
        return (
            <div className="bg-black">
                <div className="header">
                    <h1 className="float-left">Online Image Editor</h1>
                    <button id='btn_login' className="btn btn-success float-right" hidden>Login</button>
                    <button id='btn_logout' className="btn btn-success float-right" hidden>Logout</button>
                    <p id="username" className="float-right padding-5 center" hidden/>
                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="jumbotron bg-grey-700 margin-20 padding-20">
                            <button type="button" className="btn btn-primary width-fluid margin-ver-5"
                                    data-toggle="modal"
                                    data-target="#open-image-modal">Open Image
                            </button>
                            <button type="button"
                                    data-toggle="modal"
                                    data-target="#create_image_modal"
                                    className="btn btn-dark width-fluid margin-ver-5">Create New
                            </button>
                        </div>
                    </div>
                    <div className="col-9 container-fluid">

                        <div className="jumbotron bg-grey-700 margin-20">
                        </div>
                    </div>
                </div>
                <div className="modal" id="open-image-modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="row margin-20">
                                <div className="col-4">
                                    <label className="btn btn-outline-dark width-fluid height-fluid text-center">
                                        <input type="file" id="image_input" hidden/>
                                        From Device
                                    </label>
                                </div>
                                <div className="col-4">
                                    <button type="button"
                                            className="btn btn-outline-dark width-fluid height-fluid">From Link
                                    </button>
                                </div>
                                <div className="col-4">
                                    <button id="btn_gg_drive" type="button"
                                            className="btn btn-outline-dark width-fluid height-fluid" hidden>From Google
                                        Drive
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CreateNewOption/>
                <img id="image_src" alt="No Image" hidden/>
            </div>
        );
    }


    componentDidMount() {
        // document.getElementById("btn_rotate_left").onclick = this.onRotateLeftClick.bind(this);
        // document.getElementById("btn_rotate_right").onclick = this.onRotateRightClick.bind(this);
        this.imageSrc = document.getElementById('image_src');
        document.getElementById('image_input').addEventListener('change', this.onLoadImage.bind(this), false);
        this.imageSrc.onload = function () {
            evenBus.$emit('EventImageLoaded', 'image_src');
        };
        document.getElementById('btn_login').addEventListener('click', authorizeUser, false);
        document.getElementById('btn_gg_drive').addEventListener('click', this.onGGDriveClick, false);
        document.getElementById('btn_logout').addEventListener('click', this.onLogout.bind(this), false);
    }

    onLoadImage(e) {
        $("#open-image-modal").modal("hide");
        let editor = document.getElementById('editor');
        let menu = document.getElementById('main_menu');
        menu.hidden = true;
        editor.hidden = false;
        let file = e.target.files[0];
        evenBus.$emit('EventImageNameChanged', file.name);
        this.imageSrc.src = URL.createObjectURL(file);
    }

    onAuthApiLoaded() {
        document.getElementById('btn_login').hidden = false;
    }

    onPickerApiLoaded() {
        document.getElementById('btn_gg_drive').hidden = false;
    }

    onUserLogin(authResult) {
        document.getElementById('btn_login').hidden = true;
        document.getElementById('btn_logout').hidden = false;
        let userNameText = document.getElementById('username');
        userNameText.innerText = authResult.name;
        userNameText.hidden = false;
    }

    onGGDriveClick() {
        $("#open-image-modal").modal("hide");
        openPicker();
    }

    onLogout() {

        document.getElementById('btn_login').hidden = false;
        document.getElementById('btn_logout').hidden = true;
        document.getElementById('username').hidden = true;
    }

    onImageDownloaded(file, name) {
        let editor = document.getElementById('editor');
        let menu = document.getElementById('main_menu');
        menu.hidden = true;
        editor.hidden = false;
        let url = URL.createObjectURL(file);
        console.log(name);
        evenBus.$emit('EventImageNameChanged', name);
        this.imageSrc.src = url;
        console.log(url)
    }

    onHomeClicked() {
        let editor = document.getElementById('editor');
        let menu = document.getElementById('main_menu');
        menu.hidden = false;
        editor.hidden = true;
    }
}

ReactDOM.render(
    <MainMenu/>,
    document.getElementById('main_menu')
);