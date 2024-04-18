import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "mukulsingh2276@gmail.com",
        pass: process.env.SMTP_PASS,
    },
});


export const sendOtp = async (email:string) => {
    const otp = Math.ceil(Math.random() * 10000);
    const mailOtptions = {
        from: "mukulsingh2276@gmail.com",
        to: email,
        subject: "Verfify your email",
        html: `<h1>Enter the otp ${otp} to verify your email</h1>`,
    };
    await transporter.sendMail(mailOtptions);
    return otp;
};