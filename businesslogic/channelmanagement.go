package businesslogic

import (
	"regexp"
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
	if id, typ := extractYouTubeInfo(url); id != "" {
		return id, typ
	}
	if id, typ := extractTwitchInfo(url); id != "" {
		return id, typ
	}
	if id, typ := extractKickInfo(url); id != "" {
		return id, typ
	}
	return "", ""
}

func extractYouTubeInfo(url string) (string, string) {
	regexes := map[string]string{
		"youtube-video": `(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})`,
		"youtube-live":  `(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|c\/|user\/|@)([^\/\n\s]+)`,
	}

	for videoType, regex := range regexes {
		re := regexp.MustCompile(regex)
		match := re.FindStringSubmatch(url)
		if len(match) > 1 {
			return match[1], videoType
		}
	}
	return "", ""
}

func extractTwitchInfo(url string) (string, string) {
	regexes := map[string]string{
		"twitch-video":  `(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)`,
		"twitch-stream": `(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)`,
		"twitch-clip":   `(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv\/\w+\/clip\/|clips\.twitch\.tv\/)([A-Za-z0-9_-]+)`,
	}

	for videoType, regex := range regexes {
		re := regexp.MustCompile(regex)
		match := re.FindStringSubmatch(url)
		if len(match) > 1 {
			return match[1], videoType
		}
	}
	return "", ""
}

func extractKickInfo(url string) (string, string) {
	regexes := map[string]string{
		"kick-video":  `(?:https?:\/\/)?(?:www\.)?kick\.com\/([^\/]+)\/videos\/([a-zA-Z0-9-]+)`,
		"kick-stream": `(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]+)`,
	}

	for videoType, regex := range regexes {
		re := regexp.MustCompile(regex)
		match := re.FindStringSubmatch(url)
		if len(match) > 1 {
			switch videoType {
			case "kick-video":
				if len(match) > 2 {
					return "videos/" + match[2], videoType
				}
			case "kick-stream":
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
