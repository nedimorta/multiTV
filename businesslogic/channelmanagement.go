package businesslogic

import (
	"regexp"
	"strings"
)

// Channels stores user-provided channels.
var Channels = make(map[string]string)

// AddChannel allows adding a new user-provided channel.
func AddChannel(name string, url string) {
	videoId, videoType := ExtractVideoInfo(url)
	if videoId != "" {
		Channels[name] = videoId + "|" + videoType
	}
}

// ExtractVideoInfo extracts the video ID and type from a URL.
func ExtractVideoInfo(url string) (string, string) {
	regexes := map[string]string{
		"youtube-video": `(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})`,
		"youtube-live":  `(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|c\/|user\/|@)([^\/\n\s]+)`,
		"twitch-video":  `(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)`,
		"twitch-stream": `(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)`,
		"kick-video":    `(?:https?:\/\/)?(?:www\.)?kick\.com\/([^\/]+)\/videos\/([a-zA-Z0-9-]+)`,
		"kick-stream":   `(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]+)`,
	}

	for videoType, regex := range regexes {
		re := regexp.MustCompile(regex)
		match := re.FindStringSubmatch(url)
		if len(match) > 1 {
			switch videoType {
			case "kick-video":
				if len(match) > 2 {
					return "videos/" + match[2], videoType // Return "video/" + video ID
				}
			case "kick-stream":
				return match[1], videoType // Return just the username for streams
			case "twitch-stream":
				if !strings.Contains(url, "/videos/") {
					return match[1], videoType // Return username for Twitch streams
				}
			default:
				return match[1], videoType
			}
		}
	}

	return "", ""
}

// PrepareChannels prepares the channel map based on user inputs.
func PrepareChannels(channelCount int) map[string]string {
	result := make(map[string]string)
	i := 0
	for k, v := range Channels {
		if i >= channelCount {
			break
		}
		result[k] = v
		i++
	}
	return result
}
