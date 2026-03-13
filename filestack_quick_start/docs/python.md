# Python SDK (filestack-python)

**GitHub:** [filestack/filestack-python](https://github.com/filestack/filestack-python)
**Requires:** Python 3+

Server-side SDK with two main classes: `Client` for uploading, and `Filelink` for working with already-uploaded handles.

---

## Installation

```bash
pip install filestack-python
```

---

## Upload a File

> Full example: [`examples/python/upload.py`](../examples/python/upload.py)

```python
from filestack import Client

client = Client("YOUR_API_KEY")
filelink = client.upload(filepath="path/to/file")
print(filelink.url)
```

---

## Intelligent Ingestion (large files)

Best for files over 100 MB. Splits files into chunks and retries on network issues.

```python
filelink = client.upload(filepath="path/to/largefile.mp4", intelligent=True)
```

---

## Work with Uploaded Files

```python
from filestack import Filelink

# Reference a file that is already uploaded
filelink = Filelink("FILE_HANDLE")

# Download it
filelink.download("/path/to/save/file")

# Get raw content
content = filelink.get_content()

# Apply transformations
filelink.resize(width=400).flip()

# Delete
filelink.delete()
```

---

## Back to main guide

[← README](../README.md)
