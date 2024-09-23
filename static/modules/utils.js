function extractVideoId(url) {
  console.log(`Attempting to extract video ID from URL: ${url}`);
  const regexes = [
    // YouTube
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
    /(?:https?:\/\/)?(?:www\.)?(?:youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Twitch
    /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)/,
    /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/,
    /(?:https?:\/\/)?player\.twitch\.tv\/\?video=v?(\d+)/,
    /(?:https?:\/\/)?player\.twitch\.tv\/\?channel=([a-zA-Z0-9_]+)/,
    // Kick
    /(?:https?:\/\/)?(?:www\.)?kick\.com\/video\/([a-zA-Z0-9-]+)/,
    /(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]+)/,
    /(?:https?:\/\/)?player\.kick\.com\/([a-zA-Z0-9_]+)/
  ];
  
  for (let regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      console.log(`Video ID extracted: ${match[1]}`);
      return match[1];
    }
  }
  
  // If no match found, try to extract from query parameters
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    if (videoId) {
      console.log(`Video ID extracted from query parameter: ${videoId}`);
      return videoId;
    }
  } catch (error) {
    console.warn('Failed to parse URL:', error);
  }
  
  console.warn(`Failed to extract video ID from URL: ${url}`);
  return null;
}

function getVideoType(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('twitch.tv')) {
    return url.includes('/videos/') ? 'twitch-video' : 'twitch-stream';
  } else if (url.includes('kick.com')) {
    return url.includes('/video/') ? 'kick-video' : 'kick-stream';
  }
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

export { extractVideoId, getVideoType, debounce };