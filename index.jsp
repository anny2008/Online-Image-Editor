<%--
  Created by IntelliJ IDEA.
  User: antran
  Date: 6/18/20
  Time: 5:10 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<html class=" height-fluid">
<head>
  <meta charset="utf-8">
  <title>Online Image Editor</title><!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">

  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

  <!-- Popper JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

  <!-- Latest compiled JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css">
  <link rel="stylesheet" href="css/style.css">
  <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

  <script src="script/opencv.js" type="text/javascript"></script>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Tangerine" rel="stylesheet">
  <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet'>
  <link href="https://fonts.googleapis.com/css2?family=Pangolin&display=swap" rel="stylesheet">
</head>
<body class="bg-black height-fluid width-fluid overflow-hidden">
<script src="script/event_bus.js" type="text/javascript"></script>
<script type="text/javascript">
  const evenBus = new EvenBus();
</script>
<div id="editor" class="bg-black height-fluid" hidden>
</div>
<div id="main_menu" class="bg-black">
</div>
<script src="script/color_picker/color_picker.js" type="text/babel"></script>
<script src="script/oie_canvas.js" type="text/babel"></script>
<script src="script/flexible_widget.js" type="text/babel"></script>
<script src="script/tool_crop.js" type="text/babel"></script>
<script src="script/tool_rotate.js" type="text/babel"></script>
<script src="script/tool_text.js" type="text/babel"></script>
<script src="script/tool_resize.js" type="text/babel"></script>
<script src="script/tool_paint.js" type="text/babel"></script>
<script src="script/tool_blur.js" type="text/babel"></script>
<script src="script/tool_adjust.js" type="text/babel"></script>
<script src="script/tool_shape.js" type="text/babel"></script>
<script src="script/tool_box.js" type="text/babel"></script>
<script src="script/export_option.js" type="text/babel"></script>
<script src="script/create_new_option.js" type="text/babel"></script>
<script src="script/main_menu.js" type="text/babel"></script>
<script src="script/editor.js" type="text/babel"></script>
<!-- The Google API Loader script. -->
<script type="text/javascript" src="script/google_api_wrapper.js"></script>
<script type="text/javascript" src="https://apis.google.com/js/api.js?onload=loadPickerApi" async defer></script>
<script src="https://apis.google.com/js/platform.js">
  {parsetags: 'explicit'}
</script>

</body>
</html>

