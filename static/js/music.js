// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupAudioVisualizer(audioElementId, canvasElementId) {
    var audio = document.getElementById(audioElementId);
    var canvas = document.getElementById(canvasElementId);
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    var ctx = canvas.getContext('2d');
    var source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    var minBarHeight = 3;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        var barWidth = (canvas.width / bufferLength) * 1.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 3;
            // Ensure the bar height is at least the minimum height
            barHeight = Math.max(barHeight, minBarHeight); // Set minimum bar height

            // Set the fillStyle to the selected color
            ctx.fillStyle = selectedColor; // Use the hard-coded color
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
        requestAnimationFrame(draw);
    }

    draw(); // Start the visualizer loop
}

function getFileName(url) {
    // Decode the URL-encoded string
    const decodedUrl = decodeURIComponent(url);
    
    // Get the last part of the path (the file name with extension)
    const fileNameWithExtension = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
    
    // Remove the file extension
    const fileName = fileNameWithExtension.split('.')[0];
    
    return fileName;
}

window.onload = function () {
    var audio = document.getElementById('visualizer-sound');
    setupAudioVisualizer('visualizer-sound', 'visualizer');
    audio.volume = 0.3;

    // Shuffle the playlist
    var shuffledPlaylist = shuffle(music);
    var currentTrackIndex = 0;

    // Function to play the next track
    function playNextTrack() {
        if (currentTrackIndex < shuffledPlaylist.length) {
            audio.src = shuffledPlaylist[currentTrackIndex];
            console.log("Now playing:", getFileName(shuffledPlaylist[currentTrackIndex]))
            visualizer_text = document.getElementById('visualizer-text')
            visualizer_text.textContent = getFileName(shuffledPlaylist[currentTrackIndex]) // Set the song name header 
            audio.play();
            currentTrackIndex++;
        } else {
            // Reset and shuffle again if all tracks have been played
            currentTrackIndex = 0;
            shuffledPlaylist = shuffle(playlist);
            playNextTrack();
        }
    }

    // Start playing the first track
    playNextTrack();

    // Add an event listener to play the next track when the current one ends
    audio.addEventListener('ended', playNextTrack);
};