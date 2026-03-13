# iOS SDK (filestack-ios)

**GitHub:** [filestack/filestack-ios](https://github.com/filestack/filestack-ios)
**Requires:** Xcode 11+, Swift 4.2+, iOS 14.0+

Full Filestack Picker UI and programmatic upload capabilities for Swift and Objective-C.

---

## Installation

### CocoaPods (recommended)

**Step 1 — Install CocoaPods (if needed)**

```bash
gem install cocoapods
```

**Step 2 — Add to your Podfile**

```ruby
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '14.0'
use_frameworks!

target '<Your Target Name>' do
  pod 'Filestack', '~> 3.0.1'
end
```

**Step 3 — Run pod install**

```bash
pod install
```

> **Important:** Open the generated `.xcworkspace` file — not `.xcodeproj` — after running `pod install`.

---

### Swift Package Manager

```swift
// Package.swift
dependencies: [
  .package(name: "Filestack",
           url: "https://github.com/filestack/filestack-ios.git",
           .upToNextMajor(from: "3.0.1"))
]
```

---

## Launch the Picker

> Full example: [`examples/ios/ViewController.swift`](../examples/ios/ViewController.swift)

```swift
import Filestack

// Build config with available sources
let config = Filestack.Config.builder
  .with(appUrlScheme: "YOUR-APP-URL-SCHEME")
  .with(availableCloudSources: [.dropbox, .googledrive, .googlephotos])
  .with(availableLocalSources: [.camera, .photoLibrary, .documents])
  .build()

// Create the client
let client = Filestack.Client(apiKey: "YOUR_API_KEY", config: config)

// Set storage options
let storeOptions = StorageOptions(location: .s3, access: .public)

// Launch picker from a view controller
let picker = client.picker(storeOptions: storeOptions)
picker.pickerDelegate = self
present(picker, animated: true)
```

---

## Back to main guide

[← README](../README.md)
