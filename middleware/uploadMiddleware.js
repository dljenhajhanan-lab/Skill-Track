import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    if (file.fieldname === "avatar" || file.fieldname === "coverImage") {
      folder += "users/";
    } 
    else if (file.fieldname === "image" || file.fieldname === "imageUrl") {
      folder += "posts/";
    } 
    else if (file.fieldname === "questionImage") {
      folder += "questions/";
    }
    else if (file.fieldname === "certificate") {
      folder += "achievements/";
    }
    else if (file.fieldname === "certificate") {
      folder += "achievements/";
    }
    else if (file.fieldname === "licenseImage") {
      folder += "companies/";
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

const upload = multer({ storage });

export const uploadUserFiles = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]);

export const uploadPostFiles = upload.fields([
  { name: "image", maxCount: 1 }
]);

export const uploadQuestionFiles = upload.fields([
  { name: "questionImage", maxCount: 1 }
]);

export const uploadAchievementFiles = upload.fields([
  { name: "certificate", maxCount: 1 }
]);

export const uploadProfessorFiles = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "certificate", maxCount: 1 }
]);

export const uploadCompanyFiles = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "licenseImage", maxCount: 1 }
]);


export default upload;
