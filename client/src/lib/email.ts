import emailjs from '@emailjs/browser'

export const sendEmail = async ({ fromName, fromEmail, orderUrl }: { fromName: string, fromEmail: string, orderUrl: string }) => {
    const templateParams = {
        from_name: fromName,
        from_email: fromEmail,
        order_url: orderUrl,
    }
    emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, templateParams, process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
        .then(() => {
            return { message: "Send email success", success: true }
        })
        .catch((err) => {
            return { message: err.message, success: false }
        })
}