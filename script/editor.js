class Editor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="height-fluid width-fluid padding-none margin-none">
                <ExportOption/>
                <div id="tool_box_container" className="padding-none margin-none height-fluid "
                     style={{width: 300}}>
                    <ToolBox/>
                </div>
                <div className="bg-black height-fluid overflow-hidden margin-none"
                     id="canvas_container">
                    <OieCanvas/>
                </div>
            </div>
        );
    }

}

ReactDOM.render(
    <Editor/>,
    document.getElementById('editor')
);