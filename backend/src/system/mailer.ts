import { exec } from "child_process";
import { createReadStream } from "fs";

var ACCESS_TOKEN = "";
var ACCOUNTID = "";
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

const checkToken = async() => {
    try {
        return await new Promise((resolve, reject) => {
            let urlToUsed = `https://api.catalyst.zoho.com/baas/v1/project/${projectID}/project-user/current`;

            fetch(urlToUsed, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}`
                }
            }).then(response => response.json()).then(async(data: any) => {
                if (data['status'] === 'success') resolve(true);
                else {
                    const genToken = await generateToken();
                    genToken ? resolve(true) : reject(false);
                }
            }).catch(async(err) => {
                const genToken = await generateToken();
                genToken ? resolve(true) : reject(false);
            })
        })
    } catch(err) {
        return false;
    }
}

const checkAccount = async() => {
    try {
        return await new Promise((resolve, reject) => {
            let urlToUsed = `https://mail.zoho.com/api/accounts`;

            fetch(urlToUsed, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}`
                }
            }).then(response => response.json()).then(async(data: any) => {
                if (data?.status?.description === 'success') ACCOUNTID = data?.data?.at(0)?.accountId
                resolve(true)
            }).catch(async(err) => {
                reject(false);
            })
        })
    } catch(err) {
        return false;
    }
}

const updateAccount = async() => {
    try {
        return await new Promise((resolve, reject) => {
            let urlToUsed = `https://mail.zoho.com/api/accounts/${ACCOUNTID}`;

            fetch(urlToUsed, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}`
                },
                method: 'PUT',
                body: JSON.stringify({
                    "mode": 'displaynameemailupdate',
                        "emailAddress": sender,
                        "displayName": "FS IMS Mailer"
                })
            }).then(response => response.json()).then(async(data: any) => {
                console.log(data)
                resolve(true)
            }).catch(async(err) => {
                reject(false);
            })
        })
    } catch(err) {
        return false;
    }
}

const generateToken = async() => {
    try {
        return await new Promise((resolve, reject) => {
            let urlToUsed = `${process.env.CATALYST_GEN_TOKEN_URL}?client_id=${process.env.CATALYST_SELF_CLIENT_ID}&client_secret=${process.env.CATALYST_SELF_CLIENT_SECRET}`;
            urlToUsed += `&grant_type=client_credentials&scope=${process.env.CATALYST_SELF_CLIENT_SCOPES}&soid=ZohoCatalyst.${projectID}`;
            
            fetch(urlToUsed, { method: 'POST' })
            .then(response => response.json())
            .then((data: any) => {
                ACCESS_TOKEN = data['access_token'];
                resolve(true);
            }).catch(err => {
                ACCESS_TOKEN = "";
                reject(false)
            })
        })
    } catch(err) {
        console.log('Unable to generate Token')
        return false
    }
}

const sendAttachment = async (path: any) => {
    try {
        return await new Promise((resolve, reject) => {
            let curlCMD = `curl -X POST --location 'https://mail.zoho.com/api/accounts/${ACCOUNTID}/messages/attachments?uploadType=multipart'`

            curlCMD += ` -H 'Authorization: Zoho-oauthtoken ${ACCESS_TOKEN}'`
            curlCMD += ` --form 'attach=@${path}'`

            exec(curlCMD, (error, stdout, stderr) => {
                if (!error && stdout) {
                    try {
                        let res = JSON.parse(stdout);

                        if(res?.status?.description === 'success') resolve(res?.data?.at(0))
                        else reject(null)
                    } catch(errorHandling) { reject(null)}
                } else reject(null)
                resolve(true)
            })
        })
    } catch(err) { return null }
}

export const sendMail = async (config: any) => {
    try{
        await checkToken();
        await checkAccount();
        // return await updateAccount();

        if(!ACCESS_TOKEN) {
            console.log('Could not generate a new token')
            return false;
        }
        let finalConfig: any = {
            from_email: sender,
            to_email: config['recipient'],
            subject: config['subject'],
            content: config['htmlMessage'],
            html_mode: true,
            display_name: senderName
        }

        if (config.attachments) {
            let newAttachment: any = []

            for (let i = 0; i < config.attachments.length; i++) {
                const attachmentData = await sendAttachment(config.attachments[i]);

                if (attachmentData) newAttachment.push(attachmentData)
            }

            if (newAttachment.length > 0) finalConfig['attachments'] = newAttachment
        }

        const sendingMails = async (mailData: any) => {
            return await new Promise((resolve, reject) => {
                let curlCMD = `curl -X POST https://mail.zoho.com/api/accounts/${ACCOUNTID}/messages`;
                curlCMD += ` -H "Accept: application/json"`
                curlCMD += ` -H "Content-Type: application/json"`
                curlCMD += ` -H 'Authorization: Zoho-oauthtoken ${ACCESS_TOKEN}'`
                curlCMD += ` -d '${mailData}'`

                exec(curlCMD, (error, stdout, stderr) => {
                    if (!error && stdout) {
                        try {
                            let res = JSON.parse(stdout);
    
                            if(res?.status?.description === 'success') resolve(true)
                            else reject(null)
                        } catch(errorHandling) { reject(null)}
                    } else reject(null)
                    resolve(true)
                })
            })
        }

        for(let i=0; i<finalConfig['to_email'].length; i++) {
            let newSet: any = {
                fromAddress: finalConfig['from_email'],
                toAddress: finalConfig['to_email'][i],
                subject: finalConfig['subject'],
                mailFormat: 'html',
                content: finalConfig['content']
            }

            if(finalConfig.attachments) newSet['attachments'] = finalConfig.attachments;

            await sendingMails(JSON.stringify(newSet))
        }

        return true
    } catch(err) {
        console.log('Error while sending the mail')
    }
}
