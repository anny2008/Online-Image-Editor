// class OieImageView extends React.Component {
//     constructor(props) {
//         super(props);
//         this.scale = 1.0;
//         this.image = undefined;
//         this.oldMousePos = 0.0;
//         this.isScrollRight = false;
//         this.isScrollBottom = false;
//         this.freePaintStyle = {color: "#000000", size: 1};
//         this.state = {
//             width: 0,
//             height: 0
//         }
//         this.drawPoints = [];
//         evenBus.$on('EventImageLoaded', (function (src) {
//             console.log('onImageLoaded');
//             this.onImageLoaded(src);
//         }).bind(this));
//
//         evenBus.$on('EventResizeImage', (function (futureSize) {
//             this.onResizeImage(futureSize);
//         }).bind(this));
//         evenBus.$on('EventSetFreePaintStyle', (function (info) {
//             this.onSetFreePaintStyle(info);
//         }).bind(this));
//         evenBus.$on('EventOpenTool', (function (tool) {
//             this.tool = tool;
//         }).bind(this));
//         this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
//     }
//
//     onImageLoaded(src) {
//         this.src = src;
//         let image = cv.imread(src);
//         this.image = image.clone();
//         this.updateScrollbar();
//         let img = {
//             width: image.size().width, height: image.size().height,
//         };
//         this.redraw();
//         evenBus.$emit('EventImageChanged', img);
//     }
//
//     updateScrollbar() {
//         let w = this.image.size().width * this.scale;
//         let h = this.image.size().height * this.scale;
//         let parentW = this.state.width;
//         let parentH = this.state.height;
//         let x = (parentW - w) * 0.5;
//         let y = (parentH - h) * 0.5;
//         this.positionX = x;
//         this.positionY = y;
//         this.redraw();
//         let rightBar = document.getElementById("right_scroll");
//         let bottomBar = document.getElementById("bottom_scroll");
//         if (h > parentH) {
//             let barParentH = document.getElementById("right_scroll_bar").offsetHeight;
//             let barH = parentH / h * 100;
//             rightBar.style.height = '' + barH + '%';
//             rightBar.style.top = '' + (barParentH - barH * barParentH * 0.01) * 0.5;
//         } else {
//             rightBar.style.height = '100%';
//             rightBar.style.top = '0';
//         }
//         if (w > parentW) {
//             let barW = parentW / w * 100;
//             let barParentW = document.getElementById("bottom_scroll_bar").offsetWidth;
//             bottomBar.style.width = '' + barW + '%';
//             bottomBar.style.left = '' + (barParentW - barW * barParentW * 0.01) * 0.5;
//         } else {
//             bottomBar.style.width = '100%';
//             bottomBar.style.left = '0';
//         }
//         this.updateImageInfo();
//     }
//
//     render() {
//         return (
//             <div className="padding-none center bg-grey-900 positioned" style={{
//                 width: this.state.width, height: this.state.height, left: 300, top: 0
//             }}>
//                 <div>
//                     <div id="canvas_vi"
//                          className="height-fluid width-fluid  padding-none center bg-grey-900 overflow-hidden">
//                         <canvas id="canvas" className="positioned"/>
//                         <InsertTextField id="1092" x="100" y = "200" width="200" height="70"/>
//                     </div>
//                     <div id="right_scroll_bar">
//                         <div id="right_scroll" className="bg-grey-100"/>
//                     </div>
//                     <div id="bottom_scroll_bar">
//                         <div id="bottom_scroll" className="bg-grey-100"/>
//                     </div>
//                 </div>
//                 <div className="margin-none width-fluid padding-5">
//                     <p className="float-left center bg-grey-800 padding-5" id="image_info_text">2000 x 1000 @ 100%</p>
//                     <div className="float-right">
//                         <button id='btn_undo' className="btn btn-dark margin-5">Undo</button>
//                         <button id='btn_redo' className="btn btn-dark margin-5">Redo</button>
//                         <button id='btn_close' className="btn btn-dark margin-5">Close</button>
//                         <button id='btn_save' className="btn btn-success margin-5">Save</button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     updateImagePosition() {
//         let w = this.scaledImage.size().width;
//         let h = this.scaledImage.size().height;
//         let parentW = this.state.width;
//         let parentH = document.getElementById('canvas_vi').offsetHeight;
//         let x = this.positionX;
//         let y = this.positionY;
//         if (x < 0 || y < 0) {
//             let startX = 0;
//             let startY = 0;
//             if (x < 0) {
//                 startX = -x;
//                 x = 0;
//             }
//             if (y < 0) {
//                 startY = -y;
//                 y = 0;
//             }
//             // let ROI = new cv.Rect(startX, startY, endX, endY);
//             let ROI = new cv.Rect(Math.floor(startX), Math.floor(startY), Math.min(Math.floor(parentW), w), Math.min(Math.floor(parentH), h));
//             let output = this.scaledImage.roi(ROI);
//             cv.imshow('canvas', output);
//             output.delete();
//
//         } else {
//             cv.imshow('canvas', this.scaledImage);
//         }
//         document.getElementById("canvas").style.left = "" + x;
//         document.getElementById("canvas").style.top = "" + y;
//     }
//
//     redraw() {
//         let w = this.image.size().width * this.scale;
//         let h = this.image.size().height * this.scale;
//         let parentW = this.state.width;
//         let parentH = this.state.height;
//         let x = this.positionX;
//         let y = this.positionY;
//         let startX = 0;
//         let startY = 0;
//         if (x < 0 || y < 0) {
//             if (x < 0) {
//                 startX = -x;
//                 x = 0;
//             }
//             if (y < 0) {
//                 startY = -y;
//                 y = 0;
//             }
//         }
//         let canvasW = Math.min(w, parentW);
//         let canvasH = Math.min(h, parentH);
//         let visibleW = canvasW / this.scale;
//         let visibleH = canvasH / this.scale;
//         let canvas = document.getElementById("canvas");
//         canvas.width = canvasW;
//         canvas.height = canvasH;
//         if (w < parentW) {
//             canvas.style.left = "" + (parentW - w) * 0.5;
//         } else {
//             canvas.style.left = "" + x;
//         }
//         if (h < parentH) {
//             canvas.style.top = "" + (parentH - h) * 0.5;
//         } else {
//             canvas.style.top = "" + y;
//         }
//         this.offsetX = startX;
//         this.offsetY = startY;
//         this.canvasContext = canvas.getContext('2d');
//         this.canvasContext.drawImage(this.src, startX, startY, visibleW, visibleH, 0, 0, canvasW, canvasH);
//         for (let i = 0; i < this.drawPoints.length - 1; i++) {
//             let beginPoint = this.drawPoints[i];
//             let endPoint = this.drawPoints[i + 1];
//             if (endPoint && beginPoint) {
//                 this.drawLine(beginPoint, endPoint);
//             }
//             if (beginPoint) {
//                 this.drawPoint(beginPoint);
//             }
//         }
//     }
//
//     drawLine(begin, end) {
//         let beginX = (begin.x - this.offsetX) * this.scale;
//         let beginY = (begin.y - this.offsetY) * this.scale;
//         let endX = (end.x - this.offsetX) * this.scale;
//         let endY = (end.y - this.offsetY) * this.scale;
//         this.canvasContext.strokeStyle = begin.color;
//         this.canvasContext.lineWidth = begin.size * this.scale;
//         this.canvasContext.beginPath();
//         this.canvasContext.moveTo(beginX, beginY);
//         this.canvasContext.lineTo(endX, endY);
//         this.canvasContext.stroke();
//     }
//
//     drawPoint(point) {
//         let x = (point.x - this.offsetX) * this.scale;
//         let y = (point.y - this.offsetY) * this.scale;
//         this.canvasContext.strokeStyle = point.color;
//         this.canvasContext.beginPath();
//         this.canvasContext.arc(x, y, point.size * this.scale * 0.5, 0, 2 * Math.PI);
//         this.canvasContext.fill();
//     }
//
//     onRightScrollBarMouseDown(e) {
//         e.preventDefault();
//         this.isScrollRight = true;
//         this.oldMousePos = e.screenY;
//     }
//
//     onRightScrollBarMouseMove(e) {
//         e.preventDefault();
//         if (!this.isScrollRight)
//             return;
//         let bar = document.getElementById("right_scroll");
//         let h = bar.offsetHeight;
//         let parentH = document.getElementById('right_scroll_bar').offsetHeight;
//         let newPos = bar.offsetTop + e.screenY - this.oldMousePos;
//         if (newPos < 0)
//             newPos = 0;
//         else if (newPos > parentH - h)
//             newPos = parentH - h;
//
//         this.positionY = -newPos;
//         bar.style.top = '' + newPos;
//         this.oldMousePos = e.screenY;
//         this.redraw();
//     }
//
//     onRightScrollBarMouseUp(e) {
//         e.preventDefault();
//         this.isScrollRight = false;
//     }
//
//     onBottomScrollBarMouseDown(e) {
//         e.preventDefault();
//         this.isScrollBottom = true;
//         this.oldMousePos = e.screenX;
//     }
//
//     onBottomScrollBarMouseMove(e) {
//         e.preventDefault();
//         if (!this.isScrollBottom)
//             return;
//         let bar = document.getElementById("bottom_scroll");
//         let w = bar.offsetWidth;
//         let parentW = document.getElementById('bottom_scroll_bar').offsetWidth;
//         let newPos = bar.offsetLeft + e.screenX - this.oldMousePos;
//         if (newPos < 0)
//             newPos = 0;
//         else if (newPos > parentW - w)
//             newPos = parentW - w;
//         this.positionX = -newPos;
//         bar.style.left = '' + newPos;
//         this.oldMousePos = e.screenX;
//         this.redraw();
//     }
//
//     onBottomScrollBarMouseUp(e) {
//         e.preventDefault();
//         this.isScrollBottom = false;
//     }
//
//     onCanvasMouseDown(e) {
//         if (this.tool === 'tool_brush_draw') {
//             this.isFreePainting = true;
//             this.insertDrawPoint(e);
//             this.redraw();
//         }
//     }
//
//     onCanvasMouseMove(e) {
//         if (this.tool === 'tool_brush_draw' && this.isFreePainting) {
//             this.insertDrawPoint(e);
//             this.redraw();
//         }
//     }
//
//     onCanvasMouseUp(e) {
//         if (this.tool === 'tool_brush_draw') {
//             this.isFreePainting = false;
//             this.drawPoints.push(null);
//             this.redraw();
//         }
//     }
//
//     insertDrawPoint(e) {
//         let canvas = document.getElementById("canvas");
//         let x = (e.pageX - canvas.offsetLeft - 300) / this.scale + this.offsetX;
//         let y = (e.pageY - canvas.offsetTop) / this.scale + this.offsetY;
//         this.drawPoints.push({
//             x: x,
//             y: y,
//             color: this.freePaintStyle.color,
//             size: this.freePaintStyle.size
//         });
//     }
//
//     componentDidMount() {
//         this.updateWindowDimensions();
//         window.addEventListener('resize', this.updateWindowDimensions);
//         document.getElementById("canvas").onwheel = this.wheel.bind(this);
//         document.getElementById("canvas").onmousedown = this.onCanvasMouseDown.bind(this);
//         document.getElementById("canvas").onmousemove = this.onCanvasMouseMove.bind(this);
//         document.getElementById("canvas").onmouseup = this.onCanvasMouseUp.bind(this);
//         document.getElementById("canvas").onmouseleave = this.onCanvasMouseUp.bind(this);
//         document.getElementById("right_scroll_bar").onmousedown = this.onRightScrollBarMouseDown.bind(this);
//         document.getElementById("right_scroll_bar").onmousemove = this.onRightScrollBarMouseMove.bind(this);
//         document.getElementById("right_scroll_bar").onmouseup = this.onRightScrollBarMouseUp.bind(this);
//         document.getElementById("right_scroll_bar").onmouseleave = this.onRightScrollBarMouseUp.bind(this);
//         document.getElementById("bottom_scroll_bar").onmousedown = this.onBottomScrollBarMouseDown.bind(this);
//         document.getElementById("bottom_scroll_bar").onmousemove = this.onBottomScrollBarMouseMove.bind(this);
//         document.getElementById("bottom_scroll_bar").onmouseup = this.onBottomScrollBarMouseUp.bind(this);
//         document.getElementById("bottom_scroll_bar").onmouseleave = this.onBottomScrollBarMouseUp.bind(this);
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener('resize', this.updateWindowDimensions);
//     }
//
//     updateWindowDimensions() {
//         this.setState({width: (window.innerWidth - 300), height: (window.innerHeight - 70)});
//     }
//
//     onResizeImage(futureSize) {
//         let output = new cv.Mat();
//         this.scale = 1;
//         cv.resize(this.image, output, new cv.Size(futureSize.futureWidth, futureSize.futureHeight), 0, 0, cv.INTER_NEAREST);
//         this.image.delete();
//         this.image = output;
//         cv.imshow(this.src, output);
//         this.scale = 1;
//         this.updateScrollbar();
//     }
//
//     updateImageInfo() {
//         document.getElementById("image_info_text").innerText = "" + this.image.size().width + "x" + this.image.size().height + "@" + Math.round(this.scale * 100) + "%";
//     }
//
//     onSetFreePaintStyle(info) {
//         this.freePaintStyle = info;
//     }
//
// }
//
// // ReactDOM.render(
// //     <OieImageView/>,
// //     document.getElementById('canvas_container')
// // );
