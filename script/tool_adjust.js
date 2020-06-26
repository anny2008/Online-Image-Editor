class ToolAdjust extends React.Component {
    constructor(props) {
        super(props);
        this.brightness = 0;
        evenBus.$on('EventImageChanged', (function (image) {
            this.brightness = 0;
            document.getElementById("adjust_brightness").value = 0;
        }).bind(this));
        evenBus.$on('EventOpenTool', (function (tool) {
            if (tool === 'tool_adjust') {
                evenBus.$emit('EventBrightnessAdjust', this.brightness);
            } else {
                evenBus.$emit('EventBrightnessAdjust', 0);
            }
        }).bind(this));
    }

    render() {
        return (
            <div>
                <div className="input-row">
                    <h3>Adjustment</h3>
                </div>
                <div className="input-row">
                    <p className="float-left input-label">Brightness</p>
                    <input id="adjust_brightness_text" type="number" className=""/>
                </div>
                <div className="input-row">
                    <input id="adjust_brightness" type="range" min="-100" max="100" className="slider"/>
                </div>
                <div className="input-row">
                    <button id='adjust_btn_apply' className="float-right btn-success">Apply</button>
                </div>
            </div>
        );
    }

    onApplyClick() {
        if (this.brightness !== 0) {
            evenBus.$emit('EventBrightnessChanged', this.brightness);
            this.brightness = 0;
            document.getElementById("adjust_brightness").value = 0;
            document.getElementById("adjust_brightness_text").value = 0;
        }
    }

    componentDidMount() {
        document.getElementById("adjust_brightness").addEventListener('change', this.onBrightnessChanged.bind(this), false);
        document.getElementById("adjust_brightness_text").onchange = this.onTextBrightnessChange.bind(this);
        document.getElementById("adjust_btn_apply").onclick = this.onApplyClick.bind(this);
        document.getElementById("adjust_brightness").value = 0;
        document.getElementById("adjust_brightness_text").value = 0;
    }

    onBrightnessChanged() {
        this.brightness = parseFloat(document.getElementById("adjust_brightness").value);
        document.getElementById("adjust_brightness_text").value = this.brightness;
        evenBus.$emit('EventBrightnessAdjust', this.brightness);
    }

    onTextBrightnessChange(){
        let brightnessText = document.getElementById("adjust_brightness_text").value;
        let brightness = parseFloat(brightnessText);
        if(brightness){
            this.brightness = parseFloat(document.getElementById("adjust_brightness_text").value);
            document.getElementById("adjust_brightness").value = this.brightness;
            evenBus.$emit('EventBrightnessAdjust', this.brightness);
        }
    }
}