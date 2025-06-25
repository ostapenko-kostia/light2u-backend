import { ContactUsDto } from '@/dtos/email.dto'
import { transporter } from '@/lib/nodemailer'

class EmailService {
	async sendContactUsEmail(dto: ContactUsDto) {
		const { name, email, message } = dto
		await transporter.sendMail({
			from: `"${name}" <${email}>`,
			to: `${process.env.GOOGLE_EMAIL}`,
			subject: `Light2U Вебсайт - Повідомлення від користувача ${name}`,
			text: message,
			html: `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body {
						font-family: Arial, sans-serif;
						margin: 0;
						padding: 20px;
						color: #333;
					}
					.container {
						max-width: 600px;
						margin: 0 auto;
						border: 1px solid #ddd;
						border-radius: 5px;
						overflow: hidden;
					}
					.header {
						background-color: #f8f9fa;
						padding: 15px;
						border-bottom: 1px solid #ddd;
					}
					.content {
						padding: 20px;
					}
					.footer {
						background-color: #f8f9fa;
						padding: 15px;
						border-top: 1px solid #ddd;
						font-size: 12px;
						color: #777;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h2>Нове повідомлення з форми контакту</h2>
					</div>
					<div class="content">
						<p><strong>Ім'я:</strong> ${name}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Повідомлення:</strong></p>
						<p>${message}</p>
					</div>
					<div class="footer">
						<p>Light2U - Повідомлення з вебсайту</p>
					</div>
				</div>
			</body>
			</html>
		`
		})
	}
}

export const emailService = new EmailService()
