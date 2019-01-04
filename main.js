var API_ID = '<YOURE-API-HERE>';
var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

var searchButton = document.getElementById('serach-button');
var serachBar = document.getElementById('serach-bar');
var randomButton = document.getElementById('random-button');

var videoWindow = document.getElementById('video');

var creatorAvatar = document.getElementById('creator-avatar');
var creatorName = document.getElementById('creator-name');

function handleClientLoad() {
    gapi.load('client', initClient);
}

function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        apiKey: API_ID,
        scope: SCOPES
    }).then(function () {
        searchButton.onclick = handleSearchClick;
        randomButton.onclick = handleRandomSearchClick;
    });
}

function handleSearchClick(event){
    SearchVideo();
}

function handleRandomSearchClick(event){
    SearchRandomVideo();
}

// Returns random number between 0 and max-1
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

function SearchRandomVideo(){
    var json = (function(){
        var json = null;
        $.ajax({
            'async': false,
            'global':false,
            'url':"/src/wordlist.json",
            'dataType': "json",
            'success': function(data) {
                json = data;
            }
        });
        return json;
    })();

    var randomwordint = getRandomInt(json.words.length);
    var search = json.words[randomwordint];

    gapi.client.youtube.search.list({
        'maxResults': '50',
        'part': 'snippet',
        'q': search,
        'type': 'video'
    }).then(function(response) {
        var a = getRandomInt(response.result.items.length);
        var creatorid = response.result.items[a].snippet.channelId;
        gapi.client.youtube.channels.list({
            'part': 'snippet,contentDetails,statistics',
            'id': creatorid
        }).then(function(response) {
            var channel = response.result.items[0];
            creatorAvatar.src = channel.snippet.thumbnails.default.url;
        });
        creatorName.innerText = response.result.items[a].snippet.channelTitle.toString();
        videoWindow.src = 'https://www.youtube.com/embed/' + response.result.items[a].id.videoId;
        videoWindow.style.border = "1px black solid";
    });
}

function SearchVideo(){
    var search = serachBar.value;
    serachBar.value = '';
    gapi.client.youtube.search.list({
        'maxResults': '50',
        'part': 'snippet',
        'q': search,
        'type': 'video'
    }).then(function(response) {
        var a = getRandomInt(response.result.items.length);
        var creatorid = response.result.items[a].snippet.channelId;
        gapi.client.youtube.channels.list({
            'part': 'snippet,contentDetails,statistics',
            'id': creatorid
        }).then(function(response) {
            var channel = response.result.items[0];
            creatorAvatar.src = channel.snippet.thumbnails.default.url;
        });
        creatorName.innerText = response.result.items[a].snippet.channelTitle.toString();
        videoWindow.src = 'https://www.youtube.com/embed/' + response.result.items[a].id.videoId;
        videoWindow.style.border = "1px black solid";
    });
}
