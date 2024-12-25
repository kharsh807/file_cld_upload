import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]); // List of files from Cloudinary

  const CLOUD_NAME = 'dhalyhx7c'; // Replace with your Cloudinary cloud name
  const UPLOAD_PRESET = 'aryan123'; // Replace with your upload preset

  // Fetch all files from Cloudinary
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to fetch files from the server.');
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    // Validate file size and type
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB.');
      return;
    }
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, PNG, and PDF files are allowed.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  // Handle file upload to Cloudinary
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        formData
      );
      setUploadedUrl(response.data.secure_url);
      alert('File uploaded successfully!');
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file to Cloudinary.');
    }
  };

  // Handle file deletion
  const handleDelete = async (publicId) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${publicId}`);
      alert('File deleted successfully!');
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file from the server.');
    }
  };

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>File Upload and Management with Cloudinary</h1>

      {/* File input */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
        Upload to Cloudinary
      </button>

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display uploaded file URL */}
      {uploadedUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded File</h3>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded File
          </a>
        </div>
      )}

      {/* Display all files */}
      <div style={{ marginTop: '50px' }}>
        <h2>All Files in Cloudinary</h2>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file.public_id} style={{ marginBottom: '20px' }}>
                <p><strong>File Name:</strong> {file.public_id}</p>
                {file.format === 'pdf' ? (
                  <a href={file.secure_url} target="_blank" rel="noopener noreferrer" download>
                    Download PDF
                  </a>
                ) : (
                  <a href={file.secure_url} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                )}
                <button
                  onClick={() => handleDelete(file.public_id)}
                  style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                >
                  Delete File
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
