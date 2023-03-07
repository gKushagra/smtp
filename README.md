# Email Microservice

- Send emails using SendGrid or Nodemailer (SMTP)
- All emails sent are appended to Sent folder on email server.


## Requirements

- SendGrid API Key and a verified sender
- Personal email account SMTP and IMAP connection details


## Usage

Create a .env in the root of the project with following environment variables:

- `PORT` Node.js app port
- `SG_API_KEY` SendGrid API key
- `SG_VERIFIED_SENDER` SendGrid verified sender 
- `SMTP_HOST` SMTP host
- `SMTP_PORT` SMTP port
- `SMTP_USER` SMTP user email
- `SMTP_PASS` SMTP user password
- `IMAP_HOST` IMAP host
- `IMAP_PORT` IMAP port
- `IMAP_USER` IMAP user email
- `IMAP_PASS` IMAP user password


[View API Documentation on Postman](https://documenter.getpostman.com/view/10989329/UVeGrRW8)


## License

MIT