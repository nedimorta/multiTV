package businesslogic

import "regexp"

// Channels stores user-provided channels.
var Channels = make(map[string]string)

// AddChannel allows adding a new user-provided channel.
func AddChannel(name string, url string) {
	videoId := extractVideoId(url)
	if videoId != "" {
		Channels[name] = videoId
	}
}

// extractVideoId extracts the video ID from a YouTube URL.
func extractVideoId(url string) string {
	const regex = `(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})`
	re := regexp.MustCompile(regex)
	match := re.FindStringSubmatch(url)
	if len(match) > 1 {
		return match[1]
	}
	return ""
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
