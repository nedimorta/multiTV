package businesslogic

func DetermineRowClassCSS(channelCount int) string {
	switch {
	case channelCount <= 4:
		return "row row-cols-1 row-cols-sm-2 justify-content-center align-items-center m-0"
	case channelCount <= 9:
		return "row row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center align-items-center m-0"
	case channelCount <= 12:
		return "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 justify-content-center align-items-center m-0"
	case channelCount <= 16:
		return "row row-cols-1 row-cols-sm-2 row-cols-xl-4 justify-content-center align-items-center m-0"
	default:
		return "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 justify-content-center align-items-center m-0"
	}
}
