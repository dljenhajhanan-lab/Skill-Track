import admin from "../config/firebase.js";

export async function sendNotification({
  senderId,
  receiverId,
  receiverFcmToken,
  title,
  body,
  data = {},
}) {
  if (!receiverFcmToken) return;

  const message = {
    token: receiverFcmToken,
    notification: { title, body },
    data: {
      ...data,
      senderId: String(senderId),
      receiverId: String(receiverId),
    },
  };

  await admin.messaging().send(message);
}
