# Multi-TV

Multi-TV is a web application that allows users to watch multiple YouTube videos simultaneously in a customizable grid layout. It provides features such as drag-and-drop video rearrangement, various grid layouts, and the ability to save and load configurations.

## Features

- Watch multiple YouTube videos in a single view
- Customizable grid layouts (1x2, 2x2, 2x3, 3x3, 4x3, 4x4)
- Drag-and-drop functionality to rearrange videos
- Save and load grid configurations
- Responsive design for various screen sizes

## Setup Instructions

### Prerequisites

- Go (1.16 or later)
- Node.js and npm (for managing frontend dependencies)

### Installation

1. Clone the repository:

`git clone https://github.com/yourusername/multi-tv.git`\
`cd multi-tv`

2. Install Go dependencies:

`go mod tidy`

3. Install frontend dependencies:

`npm install`

### Running the Application

1. Start the Go server:

`go run main.go`

2. Open your web browser and navigate to `http://localhost:8080`.

## Usage

1. Select a grid layout from the "Grid View" dropdown menu in the navigation bar.
2. Enter YouTube video URLs in the input fields and click the "+" button to add videos to the grid.
3. Drag and drop videos using the "☰" button to rearrange them within the grid.
4. Use the "X" button on each video to remove it from the grid.

### Saving and Loading Configurations

- To save your current configuration:
  1. Click on the "Save" button in the navigation bar.
  2. Choose a location on your computer to save the configuration file.

- To load a previously saved configuration:
  1. Click on the "Load" button in the navigation bar.
  2. Select the configuration file you want to load.

## Project Structure

- `main.go`: Entry point of the application
- `handlers/`: HTTP request handlers
- `views/`: HTML templates and components
- `static/`: CSS, JavaScript, and other static assets
- `businesslogic/`: Business logic layer
- `dataaccess/`: Data access layer (currently not in use)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [Bootstrap](https://getbootstrap.com/)
- [templ](https://github.com/a-h/templ)