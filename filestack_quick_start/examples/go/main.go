// Go upload example
// Run after: go get github.com/filestack/filestack-go

package main

import (
	"fmt"
	"log"
	"os"

	"github.com/filestack/filestack-go/client"
)

const apiKey = "YOUR_API_KEY" // Replace with your Filestack API key

func main() {
	cli, err := client.NewClient(apiKey)
	if err != nil {
		log.Fatalf("failed to initialize client: %v", err)
	}

	// Upload a file
	uploadFile(cli, "/path/to/file.jpg")

	// Reference an existing file by handle
	fileLink := cli.MustNewFileLink("YOUR_FILE_HANDLE")
	fmt.Println("Existing file link:", fileLink.AsString())
}

func uploadFile(cli *client.Client, path string) {
	f, err := os.Open(path)
	if err != nil {
		log.Fatalf("failed to open file: %v", err)
	}
	defer f.Close()

	fileLink, err := cli.Upload(f, nil)
	if err != nil {
		log.Fatalf("upload failed: %v", err)
	}

	fmt.Println("Uploaded:", fileLink.AsString())
}
