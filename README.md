## Setup Instructions

### Prerequisites

- Go (Golang) installed on your machine
- Node.js and npm (for managing frontend dependencies)

### Installation

1. Clone the repository:

`sh`\
`git clone https://github.com/nedimorta/multiTV.git`\
`cd multi-tv`\

2. Install Go dependencies:

`sh`\
`go mod tidy`\

3. Install frontend dependencies:

`sh`\
`npm install`\

### Running the Application

1. Start the Go server:

`sh`\
`go run main.go`\

2. Open your web browser and navigate to `http://localhost:8080`.

## Usage

1. Use the "Grid Layout" dropdown menu to select the desired grid layout (2x2, 3x3, 3x4, 4x4).
2. Add YouTube channels by entering the URL in the input field and clicking the "+" button.
3. Drag and drop channels to rearrange them.
4. Click the "X" button to reset a channel.
## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [HTMX](https://htmx.org/)
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)