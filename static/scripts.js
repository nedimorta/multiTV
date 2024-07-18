function adjustIframeSizes() {
  const iframeContainer = document.getElementById('iframeContainer');
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  const channelCount = iframeBoxes.length;

  let rows, cols;

  // Determine rows and columns based on channelCount
  if (channelCount <= 4) {
      rows = 2;
      cols = 2;
  } else if (channelCount <= 9) {
      rows = 3;
      cols = 3;
  } else if (channelCount <= 12) {
      rows = 3;
      cols = 4;
  } else if (channelCount <= 16) {
      rows = 4;
      cols = 4;
  } else if (channelCount <= 20) {
      rows = 4;
      cols = 5;
  } else if (channelCount <= 25) {
      rows = 5;
      cols = 5;
  } else {
      rows = Math.ceil(Math.sqrt(channelCount));
      cols = Math.ceil(channelCount / rows);
  }

  iframeContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  iframeContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

window.addEventListener('resize', adjustIframeSizes);
window.addEventListener('load', adjustIframeSizes);
document.addEventListener('htmx:afterSwap', adjustIframeSizes); // Adjust grid after htmx content swap

function addChannel(boxId, urlId) {
  const url = document.getElementById(urlId).value;
  const videoId = extractVideoId(url);
  if (videoId) {
      const box = document.getElementById(boxId);
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1" allowfullscreen></iframe>`;
      adjustIframeSizes();
  } else {
      alert('Invalid YouTube URL');
  }
}

function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
