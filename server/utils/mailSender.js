// const nodemailer = require("nodemailer");
// const http = require("http");

// const mailSender = async (email, title, body) => {
//     try{
//             let transporter = nodemailer.createTransport({
//                 host:process.env.MAIL_HOST,
//                 auth:{
//                     user: process.env.MAIL_USER,
//                     pass: process.env.MAIL_PASS,
//                 }
//             })


//             let info = await transporter.sendMail({
//                 from: 'StudyNotion || CodeHelp - by Babbar',
//                 to:`${email}`,
//                 subject: `${title}`,
//                 html: `${body}`,
//             })
//             console.log(info);
//             return info;
//     }
//     catch(error) {
//         console.log(error.message);
//     }
// }


// module.exports = mailSender;


// ---------------------------------------------------------------------------------


// utils/mailSender.js
const nodemailer = require("nodemailer");

/**
 * Sends an email with the given title and body to the specified recipient.
 * @param {string} email - Recipient's email address.
 * @param {string} title - Email subject.
 * @param {string} body - HTML content of the email.
 * @returns {Promise<Object>} - Information about the sent email.
 */
const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465, // Secure port for SMTP
            secure: true, // Use SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"StudyNotion || CodingHelp - by Vaibhav" <no-reply@studynotion.com>',
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email.");
    }
};

module.exports = mailSender;

