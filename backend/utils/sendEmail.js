import { Resend } from "resend";

const resend = new Resend(
    process.env.RESEND_API_KEY
);

const sendEmail = async (email,subject,message) => {

    try {

        const { data, error } =
            await resend.emails.send({

                from:
                    "EventHub <onboarding@resend.dev>",

                to: [email],

                subject,

                html: message

            });

        if (error) {

            console.error(
                "Resend Email Error:",
                error
            );

            throw new Error(
                error.message ||
                "Unable to send email"
            );
        }

        console.log(
            "Email sent successfully:",
            data?.id
        );

        return data;

    } catch (error) {

        console.error(
            "Email Sending Error:",
            error
        );

        throw error;
    }
};

export default sendEmail;