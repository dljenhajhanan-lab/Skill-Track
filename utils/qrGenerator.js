import QRCode from "qrcode";

export const generateQR = async (data) => {
  return await QRCode.toDataURL(data, {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 2,
    width: 300,
  });
};