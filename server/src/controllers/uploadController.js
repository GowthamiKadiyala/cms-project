const multer = require("multer");
const path = require("path");

// Configure storage (Simulating S3 bucket on local disk)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    // Rename file to "timestamp-filename.jpg" to avoid duplicates
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("file"); // 'file' is the form field name

const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // SDE 3 Concept: Return the PUBLIC URL, not the disk path
    // We assume the server is running on localhost:5001 for now
    const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });
};

module.exports = { uploadFile };
