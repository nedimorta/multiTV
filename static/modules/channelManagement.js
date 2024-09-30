import { adjustIframeSizes } from './layout.js';
import { extractVideoInfo } from './utils.js';

// This is where we keep track of video states.
let videoStates = {};

async function storeVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  videoStates = {}; // Clear out the old stuff
  const promises = [];

  for (const box of iframeBoxes) {
    const iframe = box.querySelector('iframe');
    if (iframe) {
      const videoType = box.querySelector('.video-container').className.split(' ')[1];
      videoStates[box.id] = {
        src: iframe.src,
        type: videoType
      };

      if (videoType.includes('youtube')) {
        storeYouTubeState(box.id, iframe);
      } else if (videoType.includes('twitch')) {
        promises.push(storeTwitchState(box.id, iframe));
      } else if (videoType.includes('kick')) {
        storeKickState(box.id, iframe);
      }
    }
  }

  await Promise.all(promises);
  console.log('All video states stored:', videoStates);
}

function storeYouTubeState(boxId, iframe) {
  if (window.YT && window.YT.Player) {
    const player = YT.get(iframe.id);
    if (player && player.getCurrentTime) {
      videoStates[boxId].currentTime = player.getCurrentTime();
      videoStates[boxId].volume = player.getVolume();
      videoStates[boxId].muted = player.isMuted();
    }
  }
}

async function storeTwitchState(boxId, iframe) {
  if (videoStates[boxId] && videoStates[boxId].twitchPlayer) {
    const player = videoStates[boxId].twitchPlayer;
    const videoType = videoStates[boxId].type;
    videoStates[boxId].videoId = videoStates[boxId].videoId || iframe.src.split('?')[0].split('/').pop();
    if (videoType === 'twitch-clip') {
      videoStates[boxId].clipId = iframe.src.match(/clip=([^&]+)/)[1];
    } else {
      try {
        // Ensure the player is ready
        if (!player.isPaused()) {
          const currentTime = await player.getCurrentTime();
          const volume = player.getVolume();
          const quality = player.getQuality();
          const playbackStats = player.getPlaybackStats();

          videoStates[boxId] = {
            ...videoStates[boxId],
            currentTime,
            volume,
            quality,
            playbackStats
          };

          console.log(`Stored Twitch state for ${boxId}:`, videoStates[boxId]);
        } else {
          console.log(`Twitch player for ${boxId} is paused, skipping state storage`);
        }
      } catch (error) {
        console.error('Error storing Twitch state:', error);
      }
    }
  } else {
    console.warn(`Unable to store Twitch state for ${boxId}: Player not initialized`);
  }
}

function storeKickState(boxId, iframe) {
  // Kick doesn't provide an API for getting current time
  // We'll just store the URL for now
  videoStates[boxId].src = iframe.src;
}

function restoreVideoStates() {
  const iframeBoxes = document.querySelectorAll('.iframe-box');
  iframeBoxes.forEach(box => {
    if (videoStates[box.id]) {
      const state = videoStates[box.id];
      // Rebuild the box with the saved video
      box.innerHTML = `
        <div class="video-container ${state.type}">
          <iframe id="iframe-${box.id}" src="${state.src}" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="button-container">
          <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
          <button class="reset-button">X</button>
        </div>
      `;
      const iframe = box.querySelector('iframe');
      iframe.onload = () => {
        if (state.type.includes('youtube')) {
          restoreYouTubeState(box.id, state);
        } else if (state.type.includes('twitch')) {
          restoreTwitchState(box.id, state);
        } else if (state.type.includes('kick')) {
          restoreKickState(box.id, state);
        }
      };
    }
  });
}

function restoreYouTubeState(boxId, state) {
  new YT.Player(`iframe-${boxId}`, {
    events: {
      'onReady': (event) => {
        event.target.seekTo(state.currentTime);
        event.target.setVolume(state.volume);
        if (state.muted) {
          event.target.mute();
        } else {
          event.target.unMute();
        }
      }
    }
  });
}

function restoreTwitchState(boxId, state) {
  const options = {
    width: '100%',
    height: '100%',
    parent: [window.location.hostname],
    autoplay: true,
    muted: false
  };

  if (state.type === 'twitch-stream') {
    options.channel = state.videoId;
  } else if (state.type === 'twitch-video') {
    options.video = state.videoId;
  } else if (state.type === 'twitch-clip') {
    // Clips use a different embed URL
    const iframe = document.getElementById(`iframe-${boxId}`);
    iframe.src = `https://clips.twitch.tv/embed?clip=${state.videoId}&parent=${window.location.hostname}`;
    return; // Exit early as we don't need to create a Twitch.Player for clips
  }

  if (!options.channel && !options.video) {
    console.error('Missing channel or video ID for Twitch player', state);
    return;
  }

  try {
    const player = new Twitch.Player(`iframe-${boxId}`, options);
    
    player.addEventListener(Twitch.Player.READY, () => {
      console.log('Twitch player is ready');
      videoStates[boxId] = videoStates[boxId] || {};
      videoStates[boxId].twitchPlayer = player;
      
      if (state.type !== 'twitch-clip') {
        player.setVolume(state.volume || 0.5);
        if (state.quality) {
          player.setQuality(state.quality);
        }
        if (state.type === 'twitch-video' && state.currentTime) {
          player.seek(state.currentTime);
        }
      }
      console.log(`Restored Twitch state for ${boxId}:`, state);
    });
  } catch (error) {
    console.error('Error restoring Twitch state:', error);
  }
}

function restoreKickState(boxId, state) {
  // Kick doesn't require special initialization
  // The iframe src should be enough to restore the state
}

function resetChannel(boxId) {
  // Back to square one for this box
  const box = document.getElementById(boxId);
  box.innerHTML = `
    <div class="input-container">
      <input type="text" id="url${boxId.replace('box', '')}" placeholder="Enter video URL" class="form-control">
      <button class="btn btn-primary add-button">+</button>
    </div>
  `;
  delete videoStates[boxId];
  adjustIframeSizes();
}

async function addChannel(boxId, url) {
  console.log(`Trying to add a video to ${boxId}. Let's see if this URL works: ${url}`);
  
  const box = document.getElementById(boxId);
  const input = box.querySelector('input');
  const addButton = box.querySelector('.add-button');

  // Show loading indicator
  addButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  addButton.disabled = true;

  try {
    const { videoId, videoType } = await extractVideoInfo(url);
    console.log(`Alright, we got a video ID: ${videoId} and type: ${videoType}`);

    let embedSrc, videoClass;

    if (videoType.includes('youtube')) {
      ({ embedSrc, videoClass } = addYouTubeChannel(videoId, videoType));
    } else if (videoType.includes('twitch')) {
      ({ embedSrc, videoClass } = addTwitchChannel(videoId, videoType));
    } else if (videoType.includes('kick')) {
      ({ embedSrc, videoClass } = addKickChannel(videoId, videoType));
    } else {
      throw new Error(`Unsupported video type: ${videoType}`);
    }

    box.innerHTML = `
      <div class="video-container ${videoClass}">
        <iframe id="iframe-${boxId}" src="${embedSrc}" frameborder="0" allowfullscreen scrolling="no"></iframe>
      </div>
      <div class="button-container">
        <button class="drag-button" onmousedown="event.preventDefault()">☰</button>
        <button class="reset-button">X</button>
      </div>
    `;
    videoStates[boxId] = {
      src: embedSrc,
      currentTime: 0,
      type: videoType,
      videoId: videoId
    };

    initializePlayer(boxId, videoId, videoType);

    adjustIframeSizes();
    console.log(`Boom! Video added to ${boxId}. Looking good!`);
  } catch (error) {
    console.error(`Error adding video to ${boxId}:`, error);
    input.style.color = 'red';
    alert(`Uh oh, that URL didn't work out:\n${error.message}`);
  } finally {
    // Reset button state
    addButton.innerHTML = '+';
    addButton.disabled = false;
  }
}

function addYouTubeChannel(videoId, videoType) {
  let embedSrc, videoClass;
  if (videoType === 'youtube-video') {
    embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&enablejsapi=1`;
    videoClass = 'youtube-video';
  } else if (videoType === 'youtube-live') {
    embedSrc = `https://www.youtube.com/embed/live_stream?channel=${videoId}&autoplay=1&mute=1&controls=1&enablejsapi=1`;
    videoClass = 'youtube-live';
  }
  return { embedSrc, videoClass };
}

function addTwitchChannel(videoId, videoType) {
  let embedSrc, videoClass;
  const parentDomain = window.location.hostname;
  
  if (videoType === 'twitch-video') {
    embedSrc = `https://player.twitch.tv/?video=${videoId}&parent=${parentDomain}&autoplay=true&muted=false`;
    videoClass = 'twitch-video';
  } else if (videoType === 'twitch-stream') {
    embedSrc = `https://player.twitch.tv/?channel=${videoId}&parent=${parentDomain}&autoplay=true&muted=false`;
    videoClass = 'twitch-stream';
  } else if (videoType === 'twitch-clip') {
    embedSrc = `https://clips.twitch.tv/embed?clip=${videoId}&parent=${parentDomain}&autoplay=false&muted=false`;
    videoClass = 'twitch-clip';
  }
  
  return { embedSrc, videoClass, videoId };
}


function addKickChannel(videoId, videoType) {
  let embedSrc, videoClass;
  if (videoType === 'kick-video') {
    embedSrc = `https://player.kick.com/${videoId}`; // videoId already includes "videos/" prefix
    videoClass = 'kick-video';
  } else if (videoType === 'kick-stream') {
    embedSrc = `https://player.kick.com/${videoId}`; // videoId already includes "channel/" prefix
    videoClass = 'kick-stream';
  }
  return { embedSrc, videoClass };
}

function initializePlayer(boxId, videoId, videoType) {
  if (videoType.includes('youtube')) {
    initializeYouTubePlayer(boxId);
  } else if (videoType.includes('twitch')) {
    initializeTwitchPlayer(boxId, videoId, videoType);
  }
  // Kick doesn't require special initialization
}


function initializeYouTubePlayer(boxId) {
  new YT.Player(`iframe-${boxId}`, {
    events: {
      'onReady': (event) => {
        // The player is ready
      }
    }
  });
}

function initializeTwitchPlayer(boxId, videoId, videoType) {
  if (videoType === 'twitch-clip') {
    // Clips don't support the interactive player, so we don't need to initialize anything
    return;
  }

  const options = {
    width: '100%',
    height: '100%',
    [videoType === 'twitch-stream' ? 'channel' : 'video']: videoId,
    parent: [window.location.hostname],
    autoplay: true,
    muted: false
  };
  
  try {
    const player = new Twitch.Player(`iframe-${boxId}`, options);
    
    player.addEventListener(Twitch.Player.READY, () => {
      console.log('Twitch player is ready');
      videoStates[boxId] = videoStates[boxId] || {};
      videoStates[boxId].twitchPlayer = player;
      
      // Set initial volume
      player.setVolume(0.5);
    });

    player.addEventListener(Twitch.Player.CAPTIONS, (captions) => {
      console.log(`Captions for ${boxId}:`, captions);
      // You can handle captions here if needed
    });

    player.addEventListener(Twitch.Player.ENDED, () => {
      console.log(`Video in ${boxId} has ended`);
      // You can handle video end here, e.g., show a replay button
    });

    player.addEventListener(Twitch.Player.PAUSE, () => {
      console.log(`Video in ${boxId} is paused`);
      videoStates[boxId].isPaused = true;
    });

    player.addEventListener(Twitch.Player.PLAY, () => {
      console.log(`Video in ${boxId} is about to play`);
    });

    player.addEventListener(Twitch.Player.PLAYBACK_BLOCKED, () => {
      console.log(`Playback blocked for ${boxId}`);
      // You might want to show a message to the user here
    });

    player.addEventListener(Twitch.Player.PLAYING, () => {
      console.log(`Video in ${boxId} is playing`);
      videoStates[boxId].isPaused = false;
    });

    player.addEventListener(Twitch.Player.OFFLINE, () => {
      console.log(`Channel in ${boxId} went offline`);
      // You might want to update the UI to show the channel is offline
    });

    player.addEventListener(Twitch.Player.ONLINE, () => {
      console.log(`Channel in ${boxId} came online`);
      // You might want to update the UI to show the channel is online
    });

    player.addEventListener(Twitch.Player.SEEK, () => {
      console.log(`Seek occurred in ${boxId}`);
      // You might want to update some UI element showing the current time
    });

  } catch (error) {
    console.error('Error initializing Twitch player:', error);
  }
}

function twitchPlayerControl(boxId, action, ...args) {
  const player = videoStates[boxId].twitchPlayer;
  if (player && typeof player[action] === 'function') {
    return player[action](...args);
  }
}

function displayTwitchPlaybackStats(boxId) {
  const stats = twitchPlayerControl(boxId, 'getPlaybackStats');
  if (stats) {
    console.log(`Playback stats for ${boxId}:`, stats);
    // You could update a UI element here with the stats
  }
}

export { 
  storeVideoStates, restoreVideoStates, resetChannel, addChannel,
  storeYouTubeState, storeTwitchState, storeKickState,
  restoreYouTubeState, restoreTwitchState, restoreKickState,
  videoStates // Export videoStates here
};