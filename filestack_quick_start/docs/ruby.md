# Ruby SDK (filestack-ruby)

**GitHub:** [filestack/filestack-ruby](https://github.com/filestack/filestack-ruby)
**Requires:** Ruby 2.5+

Server-side uploads, transformations, and file management for Ruby applications.

---

## Installation

**Via Gemfile:**

```ruby
gem 'filestack'
```

```bash
bundle install
```

**Or install directly:**

```bash
gem install filestack
```

---

## Upload a File

> Full example: [`examples/ruby/upload.rb`](../examples/ruby/upload.rb)

```ruby
require 'filestack'

client = FilestackClient.new('YOUR_API_KEY')

# Upload a local file
filelink = client.upload(filepath: '/path/to/file')
puts filelink.upload_response
puts filelink.handle

# Upload from an external URL
filelink = client.upload(external_url: 'http://example.com/image.png')
```

---

## Transformations

```ruby
transform = filelink.transform.resize(width: 100, height: 100).flip.enhance
transform.store  # returns a new Filelink with transformed content
```

---

## Back to main guide

[← README](../README.md)
