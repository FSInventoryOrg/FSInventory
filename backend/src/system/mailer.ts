var ACCESS_TOKEN = "";
const sender = process.env.CATALYST_CS_DEFAULT_SENDER;
const senderName = process.env.CATALYST_CS_DEFAULT_SENDER_NAME;
const projectID = process.env.CATALYST_CS_PROJECT_ID;

export interface FSIMSMailType {
    recipient: string[];
    subject: string;
    htmlMessage: string;
    cc?: string[];
    bcc?: string[];
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
    }
}

export const sendMail = async (config: FSIMSMailType) => {
    try{
        await checkToken();

        if(!ACCESS_TOKEN) {
            console.log('Could not generate a new token')
            return false;
        }
        const finalConfig = {
            from_email: sender,
            to_email: config['recipient'],
            subject: config['subject'],
            content: config['htmlMessage'],
            html_mode: true,
            display_name: senderName
        }

        return await new Promise((resolve, reject) => {
            const urlToUsed = `https://api.catalyst.zoho.com/baas/v1/project/${projectID}/email/send`;
            
            fetch(urlToUsed, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}`
                }, 
                body: JSON.stringify(finalConfig),
            }).then(response => response.json())
            .then(data => {
                console.log('Email has been sent')
                resolve(true)
            }).catch(err => {
                console.log('Cannot send the email')
                reject(false)
            })
    
        })
    } catch(err) {
        console.log('Error while sending the mail')
    }
}
