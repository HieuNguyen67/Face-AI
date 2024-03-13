const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
// -----------------------------------------------
const app = express();

let imageCounter = 1; // Biến đếm để theo dõi thứ tự ảnh

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.folderName;
    const folderPath = path.join(__dirname, "../public/images", folderName);
    fs.ensureDirSync(folderPath);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${imageCounter++}${ext}`); // Sử dụng biến đếm để gán tên tệp
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("images", 10), (req, res) => {
  imageCounter = 1; // Reset biến đếm sau mỗi lần tải lên
  res.send("Tải lên ảnh thành công");
});

const dataFilePath = path.join(__dirname, "../src/components/FaceRecognition/images.json");

app.post("/addName", (req, res) => {
  const { folderName } = req.body;

  if (!folderName) {
    return res.status(400).json({ message: "Vui lòng nhập tên." });
  }

  try {
    let data = [];
    if (fs.existsSync(dataFilePath)) {
      data = fs.readJsonSync(dataFilePath);
    }

    const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    data.push({ id, folderName });

    fs.writeJsonSync(dataFilePath, data);

    res.status(201).json({ message: "Thêm tên thành công." });
  } catch (error) {
    console.error("Lỗi khi thêm tên:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thêm tên." });
  }
});


module.exports = app;
