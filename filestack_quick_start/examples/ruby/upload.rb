# Ruby upload example
# Run after: gem install filestack

require 'filestack'

API_KEY = 'YOUR_API_KEY' # Replace with your Filestack API key

client = FilestackClient.new(API_KEY)

# Upload a local file
filelink = client.upload(filepath: '/path/to/file.jpg')
puts "Handle: #{filelink.handle}"
puts "Response: #{filelink.upload_response}"

# Upload from an external URL
external_filelink = client.upload(external_url: 'http://example.com/image.png')
puts "External upload handle: #{external_filelink.handle}"

# Apply transformations and store
transform = filelink.transform.resize(width: 100, height: 100).flip.enhance
stored = transform.store
puts "Transformed URL: #{stored.url}"
