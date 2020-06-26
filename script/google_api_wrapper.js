const developerKey = 'AIzaSyCckGQaJx5nxQkguNpQJre159tt6rJhv7o';
const clientId = "429095127428-c9v83i2ofg8o9r5vkojl51fdb76losmk.apps.googleusercontent.com";
const appId = "429095127428";

const scope = ['https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile'];

let authApiLoaded = false;
let pickerApiLoaded = false;
let oauthToken;

function loadPickerApi() {
    gapi.load('auth', {'callback': onAuthApiLoad});
    gapi.load('picker', {'callback': onPickerApiLoad});
    gapi.load('savetodrive', function () {
    });
    gapi.load('client', function () {
        gapi.client.load('drive', 'v2', function () {
        });
    });
}

function onAuthApiLoad() {
    authApiLoaded = true;
    evenBus.$emit('EventOnAuthApiLoad');
}

function authorizeUser(callback) {
    if (!authApiLoaded)
        return;
    window.gapi.auth.authorize(
        {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        },
        function (authResult) {
            handleAuthResult(authResult);
            callback();
        });
}

function openPicker() {
    if (pickerApiLoaded && authApiLoaded) {
        if (!oauthToken) {
            authorizeUser(createPicker);
            createPicker();
        }
    }
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        console.log(oauthToken);
        let url = ' https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + oauthToken;
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false); // false for synchronous request
        xmlHttp.send(null);
        let result = JSON.parse(xmlHttp.responseText);
        console.log(result.name);
        evenBus.$emit('EventOnUserLogin', result);
    }
}

function onPickerApiLoad() {
    evenBus.$emit('EventOnPickerApiLoad');
    pickerApiLoaded = true;
}

function createPicker() {
    if (pickerApiLoaded && oauthToken) {
        let view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("image/png,image/jpeg,image/jpg");
        let picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    }
}

function pickerCallback(data) {
    if (data.action === google.picker.Action.PICKED) {
        let file = data.docs[0];
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.googleapis.com/drive/v3/files/" + file.id + '?alt=media', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            evenBus.$emit('EventOnImageDownloaded', xhr.response, file.name);
        };
        xhr.onerror = function () {
            alert('Can not get your file, please retry!');
        };
        xhr.send();
    }
}

function openPickerFolder(callback) {
    if (!oauthToken) {
        authorizeUser(function () {
            openPickerFolder(callback);
        });
        return;
    }
    var docsView = new google.picker.DocsView().setIncludeFolders(true).setSelectFolderEnabled(true);
    let picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(appId)
        .setOAuthToken(oauthToken)
        .addView(docsView)
        .setDeveloperKey(developerKey)
        .setCallback(function (data) {
            let folderId = pickerFolderCallback(data);
            callback(folderId);
        })
        .build();
    picker.setVisible(true);

}

function uploadFile(file, name, mimeType) {
    openPickerFolder(function (folderId) {
        let metadata = {
            title: name,
            mimeType: mimeType,
            parents: [{"id": folderId}],
        };

        let form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);

        let xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
            console.log(xhr.response.id); // Retrieve uploaded file ID.
            if (xhr.response.id)
                alert('Your image has been saved');
        };
        xhr.send(form);
    })
}


function pickerFolderCallback(data) {
    if (data.action === google.picker.Action.PICKED) {
        let folder = data.docs[0].id;
        console.log('pickerFolderCallback', folder);
        return folder;
    }
}
