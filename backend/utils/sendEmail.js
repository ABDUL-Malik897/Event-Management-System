import nodemailer from "nodemailer";

const sendEmail = async (email, subject, message) => {

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: `"EventHub" <${process.env.EMAIL_ADMIN}>`,
            to: email,
            subject: subject,
            html: message
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.log("Email Sending Error:", error);
        throw error;
    }
};

export default sendEmail;