// iOS picker example (filestack-ios)
// Install: pod 'Filestack', '~> 3.0.1'

import UIKit
import Filestack
import FilestackSDK

class ViewController: UIViewController {

    let apiKey = "YOUR_API_KEY" // Replace with your Filestack API key

    override func viewDidLoad() {
        super.viewDidLoad()

        let button = UIButton(type: .system)
        button.setTitle("Upload File", for: .normal)
        button.addTarget(self, action: #selector(openPicker), for: .touchUpInside)
        button.frame = CGRect(x: 0, y: 0, width: 200, height: 44)
        button.center = view.center
        view.addSubview(button)
    }

    @objc func openPicker() {
        // Build config with available sources
        let config = Filestack.Config.builder
            .with(appUrlScheme: "YOUR-APP-URL-SCHEME") // e.g. "myapp"
            .with(availableCloudSources: [.dropbox, .googledrive, .googlephotos])
            .with(availableLocalSources: [.camera, .photoLibrary, .documents])
            .build()

        // Create the client
        let client = Filestack.Client(apiKey: apiKey, config: config)

        // Set storage options
        let storeOptions = StorageOptions(location: .s3, access: .public)

        // Launch picker
        let picker = client.picker(storeOptions: storeOptions)
        picker.pickerDelegate = self
        present(picker, animated: true)
    }
}

// MARK: - PickerNavigationControllerDelegate

extension ViewController: PickerNavigationControllerDelegate {
    func pickerStoredFile(picker: PickerNavigationController, response: StoreResponse) {
        if let fileLink = response.fileLink {
            print("Uploaded handle: \(fileLink.handle)")
            print("Uploaded URL: \(fileLink.url?.absoluteString ?? "N/A")")
        } else if let error = response.error {
            print("Upload error: \(error)")
        }
    }
}
