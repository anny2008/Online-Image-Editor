class ToolBox extends React.Component {
    constructor(props) {
        super(props);
        evenBus.$on('EventCloseAllTool', (function () {
            this.closeAllTool();
        }).bind(this));
    }

    render() {
        return (
            <div>
                <div className="tab height-fluid">
                    <button id="home_button"><i id='icon_home' className="material-icons"
                                                onClick={this.onHomeClicked}>home</i></button>
                    <div className="height-fluid">
                        <div className="tool-container">
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_resize')}><i
                                id='icon_resize' className="material-icons">photo_size_select_large</i>
                            </button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_crop')}><i
                                id='icon_crop' className="material-icons">crop</i></button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_rotate')}><i
                                id='icon_rotate' className="material-icons">rotate_90_degrees_ccw</i></button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_text')}><i
                                id='icon_text' className="material-icons">text_fields</i></button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_brush_draw')}><i
                                id='icon_draw' className="material-icons">brush</i></button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_blur')}><i
                                id='icon_blur' className="material-icons">blur_on</i></button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_adjust')}><i
                                id='icon_adjust' className="material-icons">adjust</i></button>
                            <button className="tab-link" onClick={(e) => this.openTab(e, 'tool_shape')}><i
                                id='icon_shape' className="material-icons">crop_square</i></button>
                        </div>
                    </div>
                </div>
                <div className="tab-content-container bg-grey-700">
                    <div id="tool_resize" className="tab-content">
                        <ToolResize/>
                    </div>

                    <div id="tool_crop" className="tab-content">
                        <ToolCrop/>
                    </div>
                    <div id="tool_rotate" className="tab-content">
                        <ToolRotate/>
                    </div>

                    <div id="tool_text" className="tab-content">
                        <ToolText/>
                    </div>
                    <div id="tool_brush_draw" className="tab-content">
                        <ToolPaint/>
                    </div>
                    <div id="tool_blur" className="tab-content">
                        <ToolBlur/>
                    </div>
                    <div id="tool_adjust" className="tab-content">
                        <ToolAdjust/>
                    </div>
                    <div id="tool_shape" className="tab-content">
                        <ToolShape/>
                    </div>
                </div>
            </div>
        );
    }


    openTab(event, tabName) {
        let tabLinks = document.getElementsByClassName("tab-link");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" tab-link-active", "");
        }
        let tabContent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " tab-link-active";
        evenBus.$emit('EventOpenTool', tabName);
    }

    closeAllTool() {
        let tabLinks = document.getElementsByClassName("tab-link");
        for (let i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" tab-link-active", "");
        }
        let tabContent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }
        evenBus.$emit('EventOpenTool', '');
    }

    onHomeClicked() {
        evenBus.$emit('EventOnHomeClicked');
    }
}

// ReactDOM.render(
//     <ToolBox/>,
//     document.getElementById('tool_box_container')
// );