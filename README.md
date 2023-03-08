# SMTP

- Send emails using Nodemailer using SMTP.
- All emails sent are appended to Sent using IMAP folder on email server.
- Use Sendgrid as fallback to send emails.


## Requirements

- Personal email account SMTP and IMAP connection details


## Usage

Create a .env in the root of the project with following environment variables:

- `PORT` Node.js app port
- `SMTP_HOST` SMTP host
- `SMTP_PORT` SMTP port
- `SMTP_USER` SMTP user email
- `SMTP_PASS` SMTP user password
- `IMAP_HOST` IMAP host
- `IMAP_PORT` IMAP port
- `IMAP_USER` IMAP user email
- `IMAP_PASS` IMAP user password
- `SG_API_KEY` SENDGRID API Key


[View API Documentation on Postman](https://documenter.getpostman.com/view/10989329/UVeGrRW8)


## License

MIT