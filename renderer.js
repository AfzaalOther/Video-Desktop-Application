const videoFile = document.getElementById('video-file');
const videoPlayer = document.getElementById('video-player');
const detectVideoButton = document.getElementById('detect-video');

videoFile.addEventListener('change', updateVideo);


detectVideoButton.addEventListener('click', async () => {
  if (videoFile.files.length === 0) {
    alert('Please select a video file first!');
    return;
  }
  const file = videoFile.files[0];
  const videoPath = file.path; // This will work in Electron, not in a regular browser
  console.log('Video path:', videoPath);

  try {
    const response = await window.electron.detectVideo(videoPath);
    console.log('response:', response);
    document.getElementById('api-response').innerText = "Detection complete. Playing detected video.";

    // Update the video player source to the detected video path
    videoPlayer.querySelector('source').src = response;
    videoPlayer.load(); // Load the video for playback
  } catch (error) {
    document.getElementById('api-response').innerText = `Error: ${error.message}`;
  }
});

function updateVideo() {
  const file = videoFile.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    console.log("Video URL:", videoURL);
    videoPlayer.querySelector('source').src = videoURL;
    videoPlayer.load(); // Load the video for playback
  }
}
