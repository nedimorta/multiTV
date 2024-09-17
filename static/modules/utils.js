function extractVideoId(url) {
  console.log(`Attempting to extract video ID from URL: ${url}`);
  const regexes = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
    /(?:https?:\/\/)?(?:www\.)?(?:youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/  // New regex for embed URLs
  ];
  
  for (let regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      console.log(`Video ID extracted: ${match[1]}`);
      return match[1];
    }
  }
  
  console.warn(`Failed to extract video ID from URL: ${url}`);
  return null;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export { extractVideoId, debounce };