# PHP SDK (filestack-php)

**GitHub:** [filestack/filestack-php](https://github.com/filestack/filestack-php)
**Requires:** PHP 7+

`FilestackClient` for uploads, and `Filelink` for transformations and file management.

---

## Installation

```bash
composer require filestack/filestack-php
```

---

## Upload a File

> Full example: [`examples/php/upload.php`](../examples/php/upload.php)

```php
use Filestack\FilestackClient;

$client = new FilestackClient("YOUR_API_KEY");
$filelink = $client->upload("/path/to/file");

echo $filelink->url;
```

---

## Work with Uploaded Files

```php
use Filestack\Filelink;

$filelink = new Filelink("YOUR_FILE_HANDLE", "YOUR_API_KEY");

// Get metadata
$metadata = $client->getMetaData($filelink->handle, ["filename", "size"]);

// Download
$client->download($filelink->handle, "/local/save/path");

// Transform: circle crop then blur
$transformed = $filelink->circle()->blur(["amount" => 10])->store();
```

---

## Intelligent Ingestion

> Must be enabled for your API key — contact [support@filestack.com](mailto:support@filestack.com).

```php
$filelink = $client->upload("/path/to/file", ["intelligent" => true]);
```

---

## Back to main guide

[← README](../README.md)
