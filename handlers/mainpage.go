package handlers

import (
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

	data := initializeGrid(channelCount)

	component := views.Index(data)
	component.Render(r.Context(), w)
}

func HandleUpdate(w http.ResponseWriter, r *http.Request) {
	channelCount, err := strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil || channelCount == 0 {
		channelCount = 9 // Default to 9 channels
	}

	data := initializeGrid(channelCount)

	component := components.Grid(data)
	component.Render(r.Context(), w)
}

func initializeGrid(channelCount int) []int {
	grid := make([]int, channelCount)
	for i := 0; i < channelCount; i++ {
		grid[i] = i + 1
	}
	return grid
}
