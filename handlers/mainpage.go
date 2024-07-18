package handlers

import (
	"html/template"
	"log"
	"multi-tv/businesslogic"
	"net/http"
	"strconv"
)

var tmpl = template.Must(template.New("main").ParseFiles("templates/index.tmpl", "templates/iframes.tmpl"))

func HandleMainPage(w http.ResponseWriter, r *http.Request) {
	channelCount, err := strconv.Atoi(r.URL.Query().Get("channelCount"))
	if err != nil || channelCount == 0 {
		channelCount = 9 // Default to 9 channels
	}

	initialGrid := make([]int, channelCount)
	for i := 0; i < channelCount; i++ {
		initialGrid[i] = i + 1
	}

	data := struct {
		InitialGrid []int
	}{
		InitialGrid: initialGrid,
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

	initialGrid := make([]int, channelCount)
	for i := 0; i < channelCount; i++ {
		initialGrid[i] = i + 1
	}

	data := struct {
		InitialGrid []int
	}{
		InitialGrid: initialGrid,
	}

	if err := tmpl.ExecuteTemplate(w, "content", data); err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

func HandleAddChannel(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		name := r.FormValue("name")
		url := r.FormValue("url")
		businesslogic.AddChannel(name, url)
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
