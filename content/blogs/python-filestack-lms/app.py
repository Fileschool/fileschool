from flask import Flask, render_template, jsonify, request
import filestack

app = Flask(__name__)

# Initialize Filestack client with your API key
client = filestack.Client("YOUR_FILESTACK_API_KEY")  # Replace with your actual key 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    # Receive the file uploaded from the Filestack picker
    file = request.files['file']
    # Upload file to Filestack
    result = client.upload(file_obj=file)
    file_url = result.url
    return jsonify({'file_url': file_url})

if __name__ == '__main__':
    app.run(debug=True)
