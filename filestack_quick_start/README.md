# Filestack File Uploader - Quick Start Guide

> All official SDK quick starts in one place. Compiled March 2026 from [github.com/filestack](https://github.com/filestack).

[![Discord](https://img.shields.io/discord/1?label=Join%20the%20Discord&logo=discord&color=5865F2)](https://discord.com/invite/58TRKSRPxD)

**[Join the community on Discord](https://discord.com/invite/58TRKSRPxD)**

---

Filestack is a file upload and content management API that powers file handling for thousands of applications. The **File Uploader** (also called the Picker) is an embeddable widget that lets users upload from their device, cloud drives (Google Drive, Dropbox, Box, OneDrive, and more), or via URL - with no backend infrastructure required.

**Get your free API key:** [dev.filestack.com/signup/free](https://dev.filestack.com/signup/free)

---

## SDK Quick Reference

| SDK | Install | Min Version |
|-----|---------|-------------|
| [JavaScript (Web)](#1-javascript) | `npm install filestack-js` | Browser + Node.js |
| [React](#2-react) | `npm install filestack-react` | React 18+ |
| [Angular](#3-angular) | `npm i @filestack/angular filestack-js` | Angular 12+ |
| [Python](#4-python) | `pip install filestack-python` | Python 3+ |
| [PHP](#5-php) | `composer require filestack/filestack-php` | PHP 7+ |
| [Ruby](#6-ruby) | `gem install filestack` | Ruby 2.5+ |
| [Ruby on Rails](#7-ruby-on-rails) | `gem "filestack-rails"` | Rails 4+ |
| [Java](#8-java) | `implementation "org.filestack:filestack-java:1.0.1"` | Java 8+ |
| [Android](#9-android) | `implementation "com.filestack:filestack-android:6.0.0"` | Android (Kotlin/Java) |
| [iOS (Swift)](#10-ios) | `pod "Filestack", "~> 3.0.1"` | iOS 14+ / Swift 4.2+ |
| [Swift (low-level)](#11-swift-sdk) | `pod "FilestackSDK", "~> 3.0.0"` | iOS 14+ / Swift 4.2+ |
| [Go](#12-go) | `go get github.com/filestack/filestack-go` | Go 1.13+ |

---

## Table of Contents

1. [JavaScript](#1-javascript)
2. [React](#2-react)
3. [Angular](#3-angular)
4. [Python](#4-python)
5. [PHP](#5-php)
6. [Ruby](#6-ruby)
7. [Ruby on Rails](#7-ruby-on-rails)
8. [Java](#8-java)
9. [Android](#9-android)
10. [iOS](#10-ios)
11. [Swift SDK](#11-swift-sdk)
12. [Go](#12-go)
13. [Next Steps & Resources](#next-steps--resources)

---

## 1. JavaScript

**GitHub:** [filestack/filestack-js](https://github.com/filestack/filestack-js)
**Full guide:** [docs/javascript.md](docs/javascript.md)
**Examples:** [examples/javascript/](examples/javascript/)

The core JavaScript SDK supports both browser and Node.js environments. It powers the Filestack Picker widget and the full processing/upload API.

```bash
npm install filestack-js
```

**Quickest start - CDN (no build step):**

```html
<script src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
<button id="picker">Upload File</button>
<script>
  const client = filestack.init("YOUR_API_KEY");
  client.picker({ onUploadDone: (res) => console.log(res) }).open();
  document.getElementById("picker").addEventListener("click", () => picker.open());
</script>
```

[See full guide](docs/javascript.md)

---

## 2. React

**GitHub:** [filestack/filestack-react](https://github.com/filestack/filestack-react)
**Full guide:** [docs/react.md](docs/react.md)
**Examples:** [examples/react/](examples/react/)

A wrapper around `filestack-js` with ready-to-use React components: `PickerOverlay`, `PickerInline`, and `PickerDropPane`.

```bash
npm install filestack-react filestack-js
```

```jsx
import { PickerOverlay } from "filestack-react";

function App() {
  return (
    <PickerOverlay
      apikey="YOUR_API_KEY"
      onUploadDone={(res) => console.log("Uploaded:", res.filesUploaded[0].url)}
    />
  );
}
```

[See full guide](docs/react.md)

---

## 3. Angular

**GitHub:** [filestack/filestack-angular](https://github.com/filestack/filestack-angular)
**Full guide:** [docs/angular.md](docs/angular.md)
**Examples:** [examples/angular/](examples/angular/)

Official Angular library wrapping `filestack-js` with picker components and a `FilestackService` for Observables.

```bash
npm i @filestack/angular filestack-js
```

[See full guide](docs/angular.md)

---

## 4. Python

**GitHub:** [filestack/filestack-python](https://github.com/filestack/filestack-python)
**Full guide:** [docs/python.md](docs/python.md)
**Examples:** [examples/python/](examples/python/)

Server-side SDK with `Client` for uploading and `Filelink` for managing already-uploaded files.

```bash
pip install filestack-python
```

```python
from filestack import Client

client = Client("YOUR_API_KEY")
filelink = client.upload(filepath="path/to/file")
print(filelink.url)
```

[See full guide](docs/python.md)

---

## 5. PHP

**GitHub:** [filestack/filestack-php](https://github.com/filestack/filestack-php)
**Full guide:** [docs/php.md](docs/php.md)
**Examples:** [examples/php/](examples/php/)

`FilestackClient` for uploads and `Filelink` for transformations and file management.

```bash
composer require filestack/filestack-php
```

[See full guide](docs/php.md)

---

## 6. Ruby

**GitHub:** [filestack/filestack-ruby](https://github.com/filestack/filestack-ruby)
**Full guide:** [docs/ruby.md](docs/ruby.md)
**Examples:** [examples/ruby/](examples/ruby/)

Server-side uploads, transformations, and file management for Ruby apps.

```bash
gem install filestack
```

[See full guide](docs/ruby.md)

---

## 7. Ruby on Rails

**GitHub:** [filestack/filestack-rails](https://github.com/filestack/filestack-rails)
**Full guide:** [docs/ruby-on-rails.md](docs/ruby-on-rails.md)

Rails plugin that injects the Filestack Picker into views via form helpers and layout tags.

```ruby
# Gemfile
gem 'filestack-rails'
```

[See full guide](docs/ruby-on-rails.md)

---

## 8. Java

**GitHub:** [filestack/filestack-java](https://github.com/filestack/filestack-java)
**Full guide:** [docs/java.md](docs/java.md)
**Examples:** [examples/java/](examples/java/)

Upload, transformation, cloud, and file management APIs. Also the underlying engine for the Android SDK.

```groovy
// build.gradle
implementation 'org.filestack:filestack-java:1.0.1'
```

[See full guide](docs/java.md)

---

## 9. Android

**GitHub:** [filestack/filestack-android](https://github.com/filestack/filestack-android)
**Full guide:** [docs/android.md](docs/android.md)
**Examples:** [examples/android/](examples/android/)

Full-featured picker UI (`FsActivity`) supporting local files, camera, and 10+ cloud sources.

```groovy
// app/build.gradle
implementation 'com.filestack:filestack-android:6.0.0'
```

[See full guide](docs/android.md)

---

## 10. iOS

**GitHub:** [filestack/filestack-ios](https://github.com/filestack/filestack-ios)
**Full guide:** [docs/ios.md](docs/ios.md)
**Examples:** [examples/ios/](examples/ios/)

Full Filestack Picker UI and programmatic upload for Swift and Objective-C. Requires Xcode 11+, Swift 4.2+, iOS 14+.

```ruby
# Podfile
pod 'Filestack', '~> 3.0.1'
```

[See full guide](docs/ios.md)

---

## 11. Swift SDK

**GitHub:** [filestack/filestack-swift](https://github.com/filestack/filestack-swift)
**Full guide:** [docs/swift.md](docs/swift.md)
**Examples:** [examples/swift/](examples/swift/)

Lower-level Swift SDK (`FilestackSDK`) for programmatic uploads without the picker UI. Use this to build a fully custom upload UI.

```ruby
# Podfile
pod 'FilestackSDK', '~> 3.0.0'
```

[See full guide](docs/swift.md)

---

## 12. Go

**GitHub:** [filestack/filestack-go](https://github.com/filestack/filestack-go)
**Full guide:** [docs/go.md](docs/go.md)
**Examples:** [examples/go/](examples/go/)

Official Go SDK for file uploads, transformations, and file link operations.

```bash
go get github.com/filestack/filestack-go
```

[See full guide](docs/go.md)

---

## Next Steps & Resources

Once you've uploaded your first file, explore these Filestack capabilities:

| Feature | Description |
|---------|-------------|
| **Image & Video Transformations** | Resize, crop, convert formats, add watermarks, and apply AI-powered enhancements via URL parameters |
| **Security (Policy + Signature)** | Restrict access, add expiry, and protect uploads with a `Security` object at client initialization |
| **Workflows** | Trigger automated processing (virus scanning, content moderation, document conversion) on every upload |
| **Storage Backends** | Connect your own S3, GCS, Azure Blob, Dropbox, or Rackspace bucket as the upload destination |

### Links

| | |
|--|--|
| Developer Portal | [dev.filestack.com](https://dev.filestack.com) |
| Documentation | [filestack.com/docs](https://www.filestack.com/docs) |
| API Reference | [filestack.github.io/filestack-js](https://filestack.github.io/filestack-js) |
| GitHub | [github.com/filestack](https://github.com/filestack) |
| Support | [support.filestack.com](https://support.filestack.com) |
| Discord | [discord.com/invite/58TRKSRPxD](https://discord.com/invite/58TRKSRPxD) |
| Quick Start (official) | [filestack.com/docs/getting-started/quick-start](https://www.filestack.com/docs/getting-started/quick-start/) |

---

*Compiled March 2026 from official Filestack SDK repositories.*
