package main

import (
	"log"
	"multi-tv/handlers"
	"net/http"
)

func main() {
	http.HandleFunc("/", handlers.HandleMainPage)
	http.HandleFunc("/update", handlers.HandleUpdate)
	http.HandleFunc("/api/video-info", handlers.HandleVideoInfo)
	http.HandleFunc("/api/multiple-video-info", handlers.HandleMultipleVideoInfo)
	// Remove these two lines:
	// http.HandleFunc("/api/save-config", handlers.HandleSaveConfiguration)
	// http.HandleFunc("/api/load-config", handlers.HandleLoadConfiguration)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
