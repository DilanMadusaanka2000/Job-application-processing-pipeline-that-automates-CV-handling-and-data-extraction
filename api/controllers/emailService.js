const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter with your email service
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or any service you prefer
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send the follow-up email
const sendFollowUpEmail = (applicantEmail, applicantName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: applicantEmail,
        subject: 'Update on Your CV Review',
        text: `Hi ${applicantName},\n\nThank you for submitting your CV! We wanted to let you know that your CV is under review. We'll get back to you shortly.\n\nBest,\nThe Recruitment Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Follow-up email sent:', info.response);
        }
    });
};

module.exports = { sendFollowUpEmail };
