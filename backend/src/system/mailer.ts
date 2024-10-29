import { exec } from "child_process";
import nodemailer from "nodemailer";
import { encryptionProtocol, getFile } from "../utils/common";

let ACCESS_TOKEN = "";
let ACCOUNTID = "";
const sender = process.env.CATALYST_CS_DEFAULT_SENDER;
const senderName = process.env.CATALYST_CS_DEFAULT_SENDER_NAME;
const projectID = process.env.CATALYST_CS_PROJECT_ID;

export interface FSIMSMailType {
  recipient: string[];
  subject: string;
  htmlMessage: string;
  cc?: string[];
  bcc?: string[];
  attachments?: any[];
}

const checkToken = async () => {
  try {
    return await new Promise((resolve, reject) => {
      const urlToUsed = `https://api.catalyst.zoho.com/baas/v1/project/${projectID}/project-user/current`;

      fetch(urlToUsed, {
        headers: {
          Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
        },
      })
        .then((response) => response.json())
        .then(async (data: any) => {
          if (data["status"] === "success") resolve(true);
          else {
            const genToken = await generateToken();
            if (genToken) {
              resolve(true);
            } else {
              reject(false);
            }
          }
        })
        .catch(async () => {
          const genToken = await generateToken();
          if (genToken) {
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  } catch (err) {
    return err;
  }
};

const checkAccount = async () => {
  try {
    return await new Promise((resolve, reject) => {
      const urlToUsed = "https://mail.zoho.com/api/accounts";

      fetch(urlToUsed, {
        headers: {
          Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
        },
      })
        .then((response) => response.json())
        .then(async (data: any) => {
          if (data?.status?.description === "success")
            ACCOUNTID = data?.data?.at(0)?.accountId;
          resolve(true);
        })
        .catch(async () => {
          reject(false);
        });
    });
  } catch (err) {
    return err;
  }
};

const generateToken = async () => {
  try {
    return await new Promise((resolve, reject) => {
      let urlToUsed = `${process.env.CATALYST_GEN_TOKEN_URL}?client_id=${process.env.CATALYST_SELF_CLIENT_ID}&client_secret=${process.env.CATALYST_SELF_CLIENT_SECRET}`;
      urlToUsed += `&grant_type=client_credentials&scope=${process.env.CATALYST_SELF_CLIENT_SCOPES}&soid=ZohoCatalyst.${projectID}`;

      fetch(urlToUsed, { method: "POST" })
        .then((response) => response.json())
        .then((data: any) => {
          ACCESS_TOKEN = data["access_token"];
          resolve(true);
        })
        .catch(() => {
          ACCESS_TOKEN = "";
          reject(false);
        });
    });
  } catch (err) {
    console.log("Unable to generate Token");
    return err;
  }
};

const sendAttachment = async (path: any) => {
  try {
    return await new Promise((resolve, reject) => {
      let curlCMD = `curl -X POST --location 'https://mail.zoho.com/api/accounts/${ACCOUNTID}/messages/attachments?uploadType=multipart'`;

      curlCMD += ` -H 'Authorization: Zoho-oauthtoken ${ACCESS_TOKEN}'`;
      curlCMD += ` --form 'attach=@${path}'`;

      exec(curlCMD, (error, stdout) => {
        if (!error && stdout) {
          try {
            const res = JSON.parse(stdout);

            if (res?.status?.description === "success")
              resolve(res?.data?.at(0));
            else reject(null);
          } catch (err) {
            reject(err);
          }
        } else reject(null);
        resolve(true);
      });
    });
  } catch (err) {
    return err;
  }
};

export const sendMail = async (config: any) => {
  const officialProtocol = await sendMailOfficialProtocol(config);

  if (officialProtocol) return true;

  console.log(
    "Please contact admin to allow this server's IP or domain address to send email. Please follow the instructions here https://support.google.com/a/answer/2956491"
  );
  console.log("System will be using the default Zoho mailer");

  try {
    await checkToken();
    await checkAccount();

    if (!ACCESS_TOKEN) {
      console.log("Could not generate a new token");
      return false;
    }
    const finalConfig: any = {
      from_email: sender,
      to_email: config["recipient"],
      subject: config["subject"],
      content: config["htmlMessage"],
      html_mode: true,
      display_name: senderName,
    };

    const sendingMails = async (mailData: any) => {
      return await new Promise((resolve, reject) => {
        let curlCMD = `curl -X POST https://mail.zoho.com/api/accounts/${ACCOUNTID}/messages`;
        curlCMD += ' -H "Accept: application/json"';
        curlCMD += ' -H "Content-Type: application/json"';
        curlCMD += ` -H 'Authorization: Zoho-oauthtoken ${ACCESS_TOKEN}'`;
        curlCMD += ` -d '${mailData}'`;

        exec(curlCMD, (error, stdout) => {
          if (!error && stdout) {
            try {
              const res = JSON.parse(stdout);

              if (res?.status?.description === "success") resolve(true);
              else reject(null);
            } catch (err) {
              reject(err);
            }
          } else reject(null);
        });
      });
    };

    for (let i = 0; i < finalConfig["to_email"].length; i++) {
      const newSet: any = {
        fromAddress: finalConfig["from_email"],
        toAddress: finalConfig["to_email"][i],
        subject: finalConfig["subject"],
        mailFormat: "html",
        content: finalConfig["content"],
      };

      if (Array.isArray(config?.attachments)) {
        newSet["attachments"] = [];
        for (let x = 0; x < config.attachments.length; x++) {
          const attachmentData = await sendAttachment(config.attachments[x]);

          if (attachmentData) newSet["attachments"].push(attachmentData);
        }
      }

      await sendingMails(JSON.stringify(newSet));
    }

    return true;
  } catch (err) {
    console.log("Error while sending the mail", err);
  }
};

export const sendMailOfficialProtocol = async (config: any) => {
  // const mailsender = encryptionProtocol('decrypt', 'M2QzYzVjYjBlZDI4NWYyYzYyZDEyNDIwNWI4ZDllMzI2YmZjNDE0ZmU0ZjZlNDJmYTIxZDA0MDgzZWFmODI4ZQ==')
  const mailOptions: any = {
    from: sender,
    to: config["recipient"],
    subject: config["subject"],
    html: config["htmlMessage"],
  };

  if (Array.isArray(config?.attachments)) {
    const attachments = [];

    for (let x = 0; x < config.attachments.length; x++) {
      const attached = config.attachments[x];
      const attachmentData = await getFile(attached, true);
      const splitName = attached.split("/");
      const fileName = splitName[splitName.length - 1];

      attachments.push({
        filename: fileName,
        content: attachmentData,
      });
    }

    if (attachments.length > 0) mailOptions.attachments = attachments;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.gmail.com",
      port: 587,
      requireTLS: true,
      auth: {
        user: sender,
        pass: encryptionProtocol(
          "decrypt",
          "NTVlMmRmOTBmMjBkYjdlMzI1ZDg4ODI0NjI4YmU1YTY="
        ),
      },
    });

    return await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(null);
        } else {
          console.log("Email has been sent");
          resolve(true);
        }
      });
    });
  } catch (error) {
    return error;
  }
};
