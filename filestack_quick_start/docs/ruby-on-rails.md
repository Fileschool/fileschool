# Ruby on Rails SDK (filestack-rails)

**GitHub:** [filestack/filestack-rails](https://github.com/filestack/filestack-rails)
**Requires:** Rails 4+

An official Rails plugin that injects the Filestack Picker into your views via form helpers and layout tags.

---

## Installation

```ruby
# Gemfile
gem 'filestack-rails'
```

```bash
bundle install
```

---

## Configuration

### Set your API key in `config/application.rb`

```ruby
# config/application.rb
config.filestack_rails.api_key = "YOUR_API_KEY"

# Optional: customize the JS client variable name
config.filestack_rails.client_name = "filestack_client"
```

---

## Add Picker Scripts to Layout

Add these tags to `<head>` **before** any custom JavaScript:

```erb
<%# app/views/layouts/application.html.erb %>
<head>
  ...
  <%= filestack_js_include_tag %>
  <%= filestack_js_init_tag %>
  ...
</head>
```

---

## Form Helper

```erb
<%= form_for @user do |f| %>
  <%= f.label :avatar_url, "Upload Your Avatar:" %>
  <%= f.filestack_field :avatar_url, "Pick File" %>
  <%= f.submit %>
<% end %>
```

> **Note:** `filestack_field` stores the Filestack CDN URL as a plain string in the corresponding model column.

---

## Back to main guide

[← README](../README.md)
