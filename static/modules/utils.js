async function extractVideoInfo(url) {
  try {
    const response = await fetch(`/api/video-info?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch video info');
    }
    return { videoId: data.videoId, videoType: data.videoType };
  } catch (error) {
    console.error('Error extracting video info:', error);
    throw error;
  }
}

async function extractMultipleVideoInfo(urls) {
  try {
    const response = await fetch('/api/multiple-video-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urls),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch multiple video info');
    }
    return data.map(info => {
      if (info.error) {
        console.warn(`Error for URL ${info.url}: ${info.error}`);
      }
      return info;
    });
  } catch (error) {
    console.error('Error extracting multiple video info:', error);
    throw error;
  }
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

// Add this function
function extractVideoId(url) {
  const videoInfo = extractVideoInfo(url);
  return videoInfo.videoId;
}

export { extractVideoInfo, extractMultipleVideoInfo, debounce, extractVideoId };