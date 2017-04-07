

// Load the IFrame Player API code asynchronously.

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
	player = new YT.Player('YT-video', {
	    height: '100%',
	    width: '100%',
	    videoId: 'oJY5GVJgYhs',
		playerVars: {
	        autoplay: 1,
	        rel: 0,
	        loop: 1,
	        controls: 0,
	        showinfo: 0,
	        autohide: 1,
	        modestbranding: 1,
	        playlist: 'oJY5GVJgYhs',
	        vq: 'hd1080'},
	    events: {
	        'onReady': onPlayerReady,
	        'onStateChange': onPlayerStateChange
	    }
	});
}
function onPlayerReady(event) {
	event.target.playVideo();
	player.mute();
}

function onPlayerStateChange(event) {

}
function stopVideo() {
	player.stopVideo();
}