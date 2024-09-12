package handlers

import (
	"html/template"
	"log"
	"net/http"
	"strconv"
)

var tmpl = template.Must(template.New("main").ParseFiles("templates/index.tmpl", "templates/iframes.tmpl"))

func HandleMainPage(w http.ResponseWriter, r *http.Request) {
	channelCount, err := strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil || channelCount == 0 {
		channelCount = 9 // Default to 9 channels
	}

	data := struct {
		InitialGrid []int
	}{
		InitialGrid: initializeGrid(channelCount),
	}

	if err := tmpl.ExecuteTemplate(w, "index.tmpl", data); err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

func HandleUpdate(w http.ResponseWriter, r *http.Request) {
	channelCount, err := strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil || channelCount == 0 {
		channelCount = 9 // Default to 9 channels
	}

	log.Printf("Updating grid with %d channels", channelCount)

	data := struct {
		InitialGrid []int
	}{
		InitialGrid: initializeGrid(channelCount),
	}

	if err := tmpl.ExecuteTemplate(w, "content", data); err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

func initializeGrid(channelCount int) []int {
	grid := make([]int, channelCount)
	for i := 0; i < channelCount; i++ {
		grid[i] = i + 1
	}
	return grid
}
