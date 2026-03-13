// Swift programmatic upload example (filestack-swift / FilestackSDK)
// Install: pod 'FilestackSDK', '~> 3.0.0'

import FilestackSDK

let apiKey = "YOUR_API_KEY" // Replace with your Filestack API key
let client = Client(apiKey: apiKey)

guard let localURL = URL(string: "file:///path/to/file.jpg") else {
    fatalError("Invalid file path")
}

let uploader = client.upload(
    using: localURL,
    uploadProgress: { progress in
        let pct = Int(progress.fractionCompleted * 100)
        print("Upload progress: \(pct)%")
    }
) { response in
    if let json = response?.json, let handle = json["handle"] as? String {
        print("Uploaded handle: \(handle)")
        print("CDN URL: https://cdn.filestackcontent.com/\(handle)")
    } else if let error = response?.error {
        print("Upload error: \(error)")
    }
}

// Keep the uploader reference to cancel if needed:
// uploader.cancel()
