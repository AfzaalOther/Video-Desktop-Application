async function sendVideoToAPI(videoFilePath) {
    // Dummy implementation for sending video to the Volvo API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('API response received!');
      }, 3000);
    });
  }
  
  module.exports = { sendVideoToAPI };
  