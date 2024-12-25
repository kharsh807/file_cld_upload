const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000; // Backend server port

// Allow requests from the frontend
app.use(cors());

// Cloudinary credentials
const CLOUD_NAME = 'dhalyhx7c'; // Replace with your Cloudinary cloud name
const API_KEY = '497398652866724'; // Replace with your Cloudinary API key
const API_SECRET = 'VE4sAZCZKiEgH5FqUXt4bl_rBko'; // Replace with your Cloudinary API secret

// Endpoint to fetch all files from Cloudinary
app.get('/api/files', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`,
            {
                auth: {
                    username: API_KEY,
                    password: API_SECRET,
                },
            }
        );
        res.json(response.data.resources); // Send file data to the frontend
    } catch (error) {
        console.error('Error fetching files:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch files from Cloudinary' });
    }
});

// Endpoint to delete a file from Cloudinary
app.delete('/api/files/:publicId', async (req, res) => {
    const { publicId } = req.params; // Extract the public ID from the request
    try {
        const response = await axios.delete(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`,
            {
                auth: {
                    username: API_KEY,
                    password: API_SECRET,
                },
                data: {
                    public_id: publicId, // Pass the public_id for the resource
                },
            }
        );
        console.log('Cloudinary response:', response.data); // Log Cloudinary's response
        res.json({ message: 'File deleted successfully', response: response.data });
    } catch (error) {
        console.error('Error deleting file:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to delete file from Cloudinary' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
