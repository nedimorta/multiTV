package businesslogic

import (
	"net/http"
	"strconv"
)

// GetUserPreferences extracts user preferences from the request.
func GetUserPreferences(r *http.Request) (autoplay bool, autoplayParam string, channelCount int, err error) {
	autoplay, _ = strconv.ParseBool(r.URL.Query().Get("autoplayEnabled"))
	autoplayParam = "0"
	if autoplay {
		autoplayParam = "1"
	}

	channelCount, err = strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil {
		return false, "0", 9, err // Default to 9 channels on error
	}

	return autoplay, autoplayParam, channelCount, nil
}
