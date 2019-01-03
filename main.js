var CLIENT_ID = '<YOURE-CLIENT-ID>';
var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

var authorizeButton = document.getElementById('autohorize-button');
var signoutButton = document.getElementById('signout-button');

var searchButton = document.getElementById('serach-button');
var serachBar = document.getElementById('serach-bar');
var randomButton = document.getElementById('random-button');

var videoWindow = document.getElementById('video');

var creatorAvatar = document.getElementById('creator-avatar');
var creatorName = document.getElementById('creator-name');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
      searchButton.onclick = handleSearchClick;
      randomButton.onclick = handleRandomSearchClick;
    });
  }

  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      serachBar.style.display = 'block';
      searchButton.style.display = 'block';
      randomButton.style.display = 'block';
      getChannel();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
      serachBar.style.display = 'none';
      searchButton.style.display = 'none';
      randomButton.style.display = 'none';
    }
  }

  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    img.src = "src/img/logo cirkle.png";
  }

  function handleSearchClick(event){
    SearchVideo();
  }

  function handleRandomSearchClick(event){
    SearchRandomVideo();
  }

  function getChannel() {
    gapi.client.youtube.channels.list({
        'part': 'snippet,contentDetails,statistics',
        'mine': 'true'
    }).then(function(response) {
        var channel = response.result.items[0];
        var img = document.getElementById('img');
        img.src = channel.snippet.thumbnails.default.url;
    });
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