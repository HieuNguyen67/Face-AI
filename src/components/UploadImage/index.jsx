import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Form } from "react-bootstrap";

function UploadImage() {
 
    const [message, setMessage] = useState("");

    



  const [folderName, setFolderName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
   if (!folderName) {
     setMessage("Vui lòng nhập tên.");
     return;
   }

   try {
     await axios.post("http://localhost:5020/v1/api/admin/addName", { folderName });
     setMessage("Thêm khuôn mặt thành công.");
     setFolderName("");
   } catch (error) {
     console.error("Lỗi khi thêm tên:", error);
     setMessage("Đã xảy ra lỗi khi thêm tên.");
   }


    if (!folderName || selectedFiles.length === 0) {
      alert("Vui lòng điền tên thư mục và chọn ít nhất một ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("folderName", folderName);
    selectedFiles.forEach((file) => {
      formData.append(`images`, file);
    });

    try {
      await axios.post("http://localhost:5020/v1/api/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Upload thành công!");
      setFolderName("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      alert("Đã xảy ra lỗi khi tải lên.");
    }
  };

  return (
    <div>
      <h4 className="mt-5">Training Khuôn Mặt Người Dùng</h4>
      <Col className="col-12">
        <Form.Group>
          <Form.Label>
            Tên người dùng <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Tên người dùng"
            required
            value={folderName}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Col>
      <div>
        <Col className="col-12">
          <Form.Group>
            <Form.Label>
              Chọn ảnh: <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control type="file" onChange={handleFileChange} multiple />
          </Form.Group>
        </Col>
      </div>
      <Button variant="warning" onClick={handleUpload} className="mt-3 col-12">
        Tải lên
      </Button>
      {message && <h5 className="mt-2">{message}</h5>}
    </div>
  );
}

export default UploadImage;
