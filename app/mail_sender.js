const nodemailer = require("nodemailer");
const RESOURCE = require("./resources");
const SETTINGS = require("./settings");
const fs = require("fs");
const formidable = require("formidable");

const transporter = nodemailer.createTransport({
  host: SETTINGS.mail_server, //smtp
  port: SETTINGS.mail_port.smtp[SETTINGS.mail_port.smtp.length - 1],
  secure: false,
  auth: {
    user: SETTINGS.mail_user,
    pass: SETTINGS.mail_password,
  },
});

const MAILER = {
  send: async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const sender = fields.email;
      const subject = fields.subject;
      const content = fields.content;
      const filename = files.file.originalFilename;
      const filepath = files.file.filepath;
      fs.readFile(filepath, async function (error, data) {
        if (error) {
          console.log(error);
          await RESOURCE.sendFileWithHeader(
            res,
            null,
            "/views/mail_failed.html",
            null
          );
        } else {
          const message = {
            from: SETTINGS.mail_user,
            to: SETTINGS.admin_contact,
            subject: subject,
            text: content + `\n${sender}`,
            attachments: [
              {
                filename: filename,
                content: data,
              },
            ],
          };

          transporter.sendMail(message, async function (error, info) {
            if (error) {
              await RESOURCE.sendFileWithHeader(
                res,
                null,
                "/views/mail_failed.html",
                null
              );
            } else {
              await RESOURCE.sendFileWithHeader(
                res,
                null,
                "/views/mail_sended.html",
                null
              );
            }
          });
        }
      });
    });
  },
};

module.exports = MAILER;
