class ExportOption extends React.Component {
    constructor(props) {
        super(props);
        this.mimeType = 'image/png';
        this.imageName = 'image';
        evenBus.$on('EventShowExportOption', (function () {
            document.getElementById("btn_choose_type").hidden = false;
            document.getElementById("btn_save_file").hidden = true;
            $("#export_image_modal").modal("show");
        }).bind(this));
        evenBus.$on('EventImageNameChanged', (function (name) {
            this.imageName = name.split('.').slice(0, -1).join('.');
        }).bind(this));
    }

    render() {
        return (
            <div>
                <div className="modal" id="export_image_modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" style={{color: 'black'}}>Export Image</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-footer">
                                <div id="btn_choose_type">
                                    <button id='btn_export_png' className="float-left btn-success">PNG</button>
                                    <button id='btn_export_jpg' className="float-right btn-success">JPG</button>
                                </div>
                                <div id="btn_save_file" hidden>
                                    <button id='btn_save_device' className="float-left btn-success">Device</button>
                                    <button id='btn_save_ggdrive' className="float-left btn-success">Google Drive
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.getElementById("btn_export_png").onclick = this.onExportPngClick.bind(this);
        document.getElementById("btn_export_jpg").onclick = this.onExportJpgClick.bind(this);
        document.getElementById("btn_save_device").onclick = this.onSaveDeviceClick.bind(this);
        document.getElementById("btn_save_ggdrive").onclick = this.onSaveGoogleDriveClick.bind(this);
    }

    onExportPngClick() {
        this.mimeType = 'image/png';
        this.onExportImage();
    }

    onExportJpgClick() {
        this.mimeType = 'image/jpeg';
        this.onExportImage();
    }

    onSaveDeviceClick() {
        let link = document.createElement('a');
        link.download = this.imageName + this.mimeType.replace('image/', '');
        let canvas = document.getElementById("canvas_src");
        link.href = canvas.toDataURL(this.mimeType);
        link.click();
    }

    onSaveGoogleDriveClick() {
        let canvas = document.getElementById("canvas_src");
        canvas.toBlob(this.renderSaveToDrive.bind(this), this.mimeType, 1);
    }

    onExportImage() {
        document.getElementById("btn_choose_type").hidden = true;
        document.getElementById("btn_save_file").hidden = false;

    }

    renderSaveToDrive(blob) {
        $("#export_image_modal").modal("hide");
        uploadFile(blob, this.imageName + '.' + this.mimeType.replace('image/', ''), this.mimeType);
        // let url = URL.createObjectURL(blob);
        // console.log('savetodrive', url);
        // gapi.savetodrive.render('savetodrive-div', {
        //     src: url,
        //     filename: this.imageName+'.'+this.mimeType.replace('image/', ''),
        //     sitename: 'OIE'
        // });
    }
}