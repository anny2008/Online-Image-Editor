// $(document).ready(function(){
//     let imageSrc = document.getElementById('image_src');
//     let imageInput = document.getElementById('image_input');
//     imageInput.addEventListener('change', (e) => {
//         console.log('imageInput changed');
// 		$("#open-image-modal").modal("hide");
//         let editor = document.getElementById('editor');
//         let menu = document.getElementById('main_menu');
//         menu.hidden = true;
//         editor.hidden = false;
//         // cv.imshow('canvas', mat);
//         // mat.delete();
//         // evenBus.$emit('EventImageLoaded', 'image_src');
//         let url = URL.createObjectURL(e.target.files[0]);
//         imageSrc.src = url;
//         // evenBus.$emit('EventImageChoosen', url);
//     }, false);
//     imageSrc.onload = function () {
//         // let mat = cv.imread(imageSrc);
//         $("#open-image-modal").modal("hide");
//         let editor = document.getElementById('editor');
//         let menu = document.getElementById('main_menu');
//         menu.hidden = true;
//         editor.hidden = false;
//         // cv.imshow('canvas', mat);
//         // mat.delete();
//         evenBus.$emit('EventImageLoaded', 'image_src');
//     };
//
//     $("#btn_create_new").click(function(){
//         $("#open-image-modal").modal("hide");
//         let editor = document.getElementById('editor');
//         let menu = document.getElementById('main_menu');
//         menu.hidden = true;
//         editor.hidden = false;
//         evenBus.$emit('EventImageCreated', {
//             width: 200,
//             height: 100
//         });
//     });
// });
// class ImageLoader {
//     async loadImageFromDevice(){
//
//     }
// }