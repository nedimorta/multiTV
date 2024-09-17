## Setup Instructions

### Prerequisites

- Go (Golang) installed on your machine
- Node.js and npm (for managing frontend dependencies)

### Installation

1. Clone the repository:

`sh`\
`git clone https://github.com/nedimorta/multiTV.git`\
`cd multi-tv`

2. Install Go dependencies:

`sh`\
`go mod tidy`

3. Install frontend dependencies:

`sh`\
`npm install`

### Running the Application

1. Start the Go server:

`sh`\
`go run main.go`

2. Open your web browser and navigate to `http://localhost:8080`.

## Usage

1. Select a grid layout from the "Grid Layout" dropdown menu.
2. Enter YouTube video URLs in the input fields and click the "+" button to add videos to the grid.
3. Drag and drop videos to rearrange them within the grid.
4. Use the "X" button on each video to remove it from the grid which works as a reset button.

### Saving and Loading Configurations

You can save your current grid layout and video selections, and load them later:

1. To save your current configuration:
   - Click on the "Save/Load" dropdown in the navigation bar.
   - Select "Save" from the dropdown menu.
   - Choose a location on your computer to save the configuration file.

2. To load a previously saved configuration:
   - Click on the "Save/Load" dropdown in the navigation bar.
   - Select "Load" from the dropdown menu.
   - Choose the configuration file you want to load.

The application will then update the grid layout and load the saved videos into their respective positions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)