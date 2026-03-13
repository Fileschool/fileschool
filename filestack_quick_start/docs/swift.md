# Swift SDK (filestack-swift)

**GitHub:** [filestack/filestack-swift](https://github.com/filestack/filestack-swift)
**Requires:** iOS 14+ / Swift 4.2+

The lower-level Swift SDK (`FilestackSDK`) provides programmatic upload and transformation APIs **without** the picker UI. Use this when you want to build a fully custom upload interface.

---

## Installation

### CocoaPods

```ruby
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '14.0'
use_frameworks!

target '<Your Target Name>' do
  pod 'FilestackSDK', '~> 3.0.0'
end
```

### Swift Package Manager

```swift
// Package.swift
dependencies: [
  .package(url: "https://github.com/filestack/filestack-swift.git",
           .upToNextMajor(from: "3.0.0"))
]
```

---

## Programmatic Upload

> Full example: [`examples/swift/upload.swift`](../examples/swift/upload.swift)

```swift
import FilestackSDK

let client = Client(apiKey: "YOUR_API_KEY")
let localURL = URL(fileURLWithPath: "/path/to/file")

let uploader = client.upload(
  using: localURL,
  uploadProgress: { progress in
    print("Progress: \(progress.fractionCompleted * 100)%")
  }
) { response in
  if let json = response?.json, let handle = json["handle"] as? String {
    print("Uploaded handle: \(handle)")
  } else if let error = response?.error {
    print("Error: \(error)")
  }
}
```

---

## When to use this vs. the iOS SDK

| | `filestack-ios` | `filestack-swift` |
|--|--|--|
| Picker UI | Yes (full UI) | No |
| Custom UI | No | Yes |
| Cloud sources | Yes | Manual |
| Use case | Fastest integration | Full control |

---

## Back to main guide

[← README](../README.md)
