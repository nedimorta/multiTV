# Multi-TV

Multi-TV is a web application that allows users to watch multiple video streams simultaneously in a customizable grid layout. It supports YouTube videos, Twitch streams, and Kick streams.

## Features

- Watch multiple video streams in a single view
- Supports YouTube videos, Twitch streams, and Kick streams
- Customizable grid layout (1x2, 2x2, 3x2, 3x3, 4x3, 4x4)
- Drag and drop functionality to rearrange video positions
- Save and load configurations
- Responsive design that adapts to different screen sizes

## Recent Updates

- Added support for Kick streams
- Improved video sizing to ensure videos fit within their containers while maintaining aspect ratio
- Updated placeholder text to be more inclusive of different video platforms

## Usage

1. Enter a video URL (YouTube, Twitch, or Kick) in any of the input boxes.
2. Click the '+' button or press Enter to add the video to the grid.
3. Use the 'Grid View' dropdown in the navbar to change the grid layout.
4. Drag and drop videos to rearrange their positions.
5. Use the 'Save' and 'Load' options in the navbar to save or load your configurations.

## Development

To set up the project for development:

1. Clone the repository
2. Install dependencies (if any)
3. Run the Go server:
   ```go run main.go```
4. Open a web browser and navigate to `http://localhost:8080`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)