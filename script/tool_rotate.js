class ToolRotate extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Rotate Image</h3>
                </div>
                <div className="input-row">
                    <button id='btn_rotate_left' className="rotate-button float-left">
                        <i className="material-icons">rotate_left</i>
                    </button>
                    <button id='btn_rotate_right' className="rotate-button float-right">
                        <i className="material-icons">rotate_right</i>
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.getElementById("btn_rotate_left").onclick = this.onRotateLeftClick.bind(this);
        document.getElementById("btn_rotate_right").onclick = this.onRotateRightClick.bind(this);
    }

    onRotateLeftClick() {
        evenBus.$emit('EventRotateLeft');
    }

    onRotateRightClick() {
        evenBus.$emit('EventRotateRight');
    }
}