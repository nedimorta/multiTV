package handlers

import (
	"encoding/json"
	"multi-tv/businesslogic"
	"multi-tv/views"
	"multi-tv/views/components"
	"net/http"
	"strconv"
)

func HandleMainPage(w http.ResponseWriter, r *http.Request) {
	channelCount, err := strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil || channelCount == 0 {
		channelCount = 9 // Default to 9 channels
	}

	columns, rows := getGridDimensions(channelCount)
	data := initializeGrid(channelCount)

	component := views.Index(data, columns, rows)
	component.Render(r.Context(), w)
}

func HandleUpdate(w http.ResponseWriter, r *http.Request) {
	channelCount, err := strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil || channelCount == 0 {
		channelCount = 9 // Default to 9 channels
	}

	columns, rows := getGridDimensions(channelCount)
	data := initializeGrid(channelCount)

	component := components.Grid(data, columns, rows)
	component.Render(r.Context(), w)
}

func getGridDimensions(channelCount int) (int, int) {
	switch {
	case channelCount <= 2:
		return 1, 2
	case channelCount <= 4:
		return 2, 2
	case channelCount <= 6:
		return 3, 2
	case channelCount <= 9:
		return 3, 3
	case channelCount <= 12:
		return 4, 3
	default:
		return 4, 4
	}
}

func initializeGrid(channelCount int) []int {
	grid := make([]int, channelCount)
	for i := 0; i < channelCount; i++ {
		grid[i] = i + 1
	}
	return grid
}

func HandleVideoInfo(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Query().Get("url")
	if url == "" {
		http.Error(w, "URL parameter is required", http.StatusBadRequest)
		return
	}

	videoId, videoType := businesslogic.ExtractVideoInfo(url)

	if videoId == "" || videoType == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Unable to extract video information from the provided URL",
		})
		return
	}

	response := struct {
		VideoID   string `json:"videoId"`
		VideoType string `json:"videoType"`
	}{
		VideoID:   videoId,
		VideoType: videoType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Add this new function
func HandleMultipleVideoInfo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var urls []string
	err := json.NewDecoder(r.Body).Decode(&urls)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	results := make([]struct {
		URL       string `json:"url"`
		VideoID   string `json:"videoId"`
		VideoType string `json:"videoType"`
		Error     string `json:"error,omitempty"`
	}, len(urls))

	for i, url := range urls {
		videoId, videoType := businesslogic.ExtractVideoInfo(url)
		results[i] = struct {
			URL       string `json:"url"`
			VideoID   string `json:"videoId"`
			VideoType string `json:"videoType"`
			Error     string `json:"error,omitempty"`
		}{
			URL:       url,
			VideoID:   videoId,
			VideoType: videoType,
		}
		if videoId == "" || videoType == "" {
			results[i].Error = "Unable to extract video information"
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
