import catalyst from "zcatalyst-sdk-node";

const sender = "rhingcayog@fullscale.ph";
const projectName = "FS-IMS-Mailer";
const projectID = "21297000000007075";

export interface FSIMSMailType {
    recipient: string[];
    subject: string;
    htmlMessage: string;
    cc?: string[];
    bcc?: string[];
}
export const sendMail = async (req: any, config: FSIMSMailType) => {
    const app = catalyst.initialize(req,  { scope: "admin"});

    const mailer = app.email();

    const finalConfig = {
        isAsync: false,
        project_details: { project_name: projectName, id: projectID },
        from_email: sender,
        to_email: config['recipient'],
        cc: config['cc'] ? config['cc'] : [],
        bcc: config['bcc'] ? config['bcc'] : [],
        reply_to: [],
        html_mode: true,
        subject: config['subject'],
        content: config['htmlMessage']
    }

    const result = await mailer.sendMail(finalConfig);
    console.log(result)
    return
}