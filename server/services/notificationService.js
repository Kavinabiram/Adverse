const sendPushNotification = async (driverId, message) => {
    // This is a mock function. You should use a push notification service like Firebase Cloud Messaging (FCM).
    console.log(`Sending push notification to driver ${driverId}: ${message}`);
    return Promise.resolve({ message: 'Push notification sent successfully' });
};

module.exports = { sendPushNotification };
