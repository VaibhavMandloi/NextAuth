import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({email , emailType, userId}:any)=>{
    try{
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                { $set: 
                {verifyToken: hashedToken, 
                    verifyTokenExpiry: Date.now() + 3600000}
                });
        } else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                { $set:
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
                });
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.Email,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: 'NextAuth@auth.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;
    }
    catch(error:any){
        console.error(`Error sending email: ${error.message}`);
    }
}