# Python upload example
# Run after: pip install filestack-python

from filestack import Client, Filelink

API_KEY = "YOUR_API_KEY"  # Replace with your Filestack API key


def upload_file(filepath: str) -> None:
    client = Client(API_KEY)
    filelink = client.upload(filepath=filepath)
    print("Uploaded URL:", filelink.url)
    return filelink


def upload_large_file(filepath: str) -> None:
    """Use Intelligent Ingestion for files > 100 MB."""
    client = Client(API_KEY)
    filelink = client.upload(filepath=filepath, intelligent=True)
    print("Uploaded URL:", filelink.url)
    return filelink


def work_with_filelink(handle: str) -> None:
    filelink = Filelink(handle)

    # Download
    filelink.download("/tmp/downloaded_file")

    # Get raw content
    content = filelink.get_content()
    print("Content length:", len(content))

    # Apply transformations
    filelink.resize(width=400).flip()

    # Delete
    filelink.delete()


if __name__ == "__main__":
    # Example: upload a local file
    # upload_file("path/to/your/file.jpg")
    print("Replace API_KEY and call upload_file('path/to/file') to get started.")
