const sendEmail = async (to, subject, text) => {
    // This is a mock function. You should use a real email service provider like Nodemailer, SendGrid, or AWS SES.
    console.log(`Sending email to ${to}: ${subject}`);
    return Promise.resolve({ message: 'Email sent successfully' });
};

module.exports = { sendEmail };
