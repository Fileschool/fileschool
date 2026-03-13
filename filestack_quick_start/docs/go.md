# Go SDK (filestack-go)

**GitHub:** [filestack/filestack-go](https://github.com/filestack/filestack-go)
**Requires:** Go 1.13+

Official Go SDK for file uploads, transformations, and file link operations.

---

## Installation

```bash
go get github.com/filestack/filestack-go
```

```go
import "github.com/filestack/filestack-go"
```

---

## Initialize a Client

> Full example: [`examples/go/main.go`](../examples/go/main.go)

```go
package main

import (
  "fmt"
  "log"
  "github.com/filestack/filestack-go/client"
)

func main() {
  cli, err := client.NewClient("YOUR_API_KEY")
  if err != nil {
    log.Fatalf("failed to initialize client: %v", err)
  }

  // Reference an existing file
  fileLink := cli.MustNewFileLink("YOUR_FILE_HANDLE")
  fmt.Println(fileLink.AsString())
}
```

---

## Upload a File

```go
package main

import (
  "fmt"
  "log"
  "os"
  "github.com/filestack/filestack-go/client"
)

func main() {
  cli, err := client.NewClient("YOUR_API_KEY")
  if err != nil {
    log.Fatal(err)
  }

  f, err := os.Open("/path/to/file.jpg")
  if err != nil {
    log.Fatal(err)
  }
  defer f.Close()

  fileLink, err := cli.Upload(f, nil)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("Uploaded:", fileLink.AsString())
}
```

---

## Back to main guide

[← README](../README.md)
