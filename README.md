# Email Microservice

- Send emails using SendGrid or Nodemailer (SMTP)
- All emails sent are appended to Sent folder on email server and logged in MongoDB.


## Requirements

- SendGrid API Key and a verified sender
- Personal email account SMTP and IMAP connection details


## Usage

Create a .env in the root of the project with following environment variables:

- `PORT` Port on which node.js server runs
- `API_KEY` SendGrid API key
- `VRF_SENDER` SendGrid verified sender 
- `PE_HOST_1` Your email SMTP host e.g. smtp.your-domain.com
- `PE_PORT_1` Your email SMTP port
- `PE_HOST_2` Your email IMAP host e.g. imap.your-domain.com
- `PE_PORT_2` Your email IMAP port
- `PE_DOMAIN` Your email
- `PE_SECURE` SSL/TLS active for your email?
- `PE_KEY` Your email password
- `MONGO_URI` MongoDB URI
- `MONGO_DB` MongoDB database for email microservice
- `MONGO_COLL` collection in `MongoDB` database for storing email logs



[View API Documentation on Postman](https://documenter.getpostman.com/view/10989329/UVeGrRW8)


## License

Apache License 2.0
