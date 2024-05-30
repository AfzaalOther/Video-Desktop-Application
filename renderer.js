document.addEventListener('DOMContentLoaded', function () {
  const videoFile = document.getElementById('video-file');
  const videoPlayer = document.getElementById('video-player');
  const processedVideoPlayer = document.getElementById('processed-video-player');
  const detectVideoButton = document.getElementById('detect-video');
  const playBothVideosButton = document.getElementById('play-both-videos');

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
          document.getElementById('api-response').innerText = (`Detection complete. Playing detected video : ${response}`);

          // Update the processed video player source to the detected video path
          processedVideoPlayer.querySelector('source').src = response;
          processedVideoPlayer.load(); // Load the video for playback
      } catch (error) {
          document.getElementById('api-response').innerText = `Error: ${error.message}`;
          console.error(error); // log the error to the console
      }
  });

  playBothVideosButton.addEventListener('click', () => {
      videoPlayer.play();
      processedVideoPlayer.play();
  });

  function updateVideo() {
      const file = videoFile.files[0];
      if (file) {
          const videoURL = URL.createObjectURL(file);
          videoPlayer.querySelector('source').src = videoURL;
          console.log("Video URL:", videoPlayer.querySelector('source').src);
          videoPlayer.load(); // Load the video for playback
      }
  }
});
