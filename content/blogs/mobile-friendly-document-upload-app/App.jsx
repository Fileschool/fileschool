import { useState } from "react";
import * as filestack from "filestack-js";
import { Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";

// Replace with your actual Filestack API key
const API_KEY = "YOUR_FILESTACK_API_KEY"; 
const client = filestack.init(API_KEY);

export default function MobileUploadApp() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    
    client.picker({
      accept: [".pdf", ".jpg", ".png", ".docx"],
      maxFiles: 1,
      uploadInBackground: false,  // Ensures synchronous upload process
      storeTo: {
        location: "s3",  // Example: adjust based on your storage settings
        workflows: ["image_compression"], // Enable image compression workflow in Filestack settings
      },
      // Tracks real-time upload progress and updates UI
      onFileUploadProgress: (file, progress) => {
        setUploadProgress(progress.totalPercent);
      },
      // Handles successful file upload and retrieves uploaded file URL
      onUploadDone: (result) => {
        setFileUrl(result.filesUploaded[0].url);
        setUploading(false);
      },
    }).open();
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh", // Full screen height
      width: "100vw",  // Full screen width
      textAlign: "center",
      background: "linear-gradient(135deg, #667eea, #764ba2)", // Gradient background
      color: "#ffffff" // Ensures text visibility on dark background
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        style={{ textAlign: "center", width: "100%" }} 
      >
        Mobile File Upload
      </Typography>
      <Card 
        style={{
          maxWidth: 400, 
          padding: 20, 
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.2)", // Glassmorphism effect
          backdropFilter: "blur(10px)", // Blurred background
          borderRadius: "12px" // Smooth rounded corners
        }}
      >
        <CardContent>
          <Button 
            variant="contained" 
            style={{ 
              backgroundColor: "#ffffff", 
              color: "#764ba2" 
            }} 
            onClick={handleUpload} 
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
          {uploading && <CircularProgress style={{ marginTop: "15px" }} />}
          {fileUrl && (
            <Typography variant="body2" style={{ marginTop: "15px" }}>
              Upload successful! <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#fff" }}>View File</a>
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );    
}
