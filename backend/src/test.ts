import mongoose from "mongoose";
import Asset from "./models/asset.schema";
import Employee from "./models/employee.schema";
import { AutoMailReportTemplate } from "./reports-template/mail/auto-mail-report";
import { createExcelTable, saveFile } from "./utils/common";
import { sendMail } from "./system/mailer";
import { extractDocuments } from "./system/backup";
import { inventoryReportHtml } from "./reports-template/mail/reports";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

const activateAutoMailing = async () => {
    const allEmployees = await Employee.aggregate().match({});
    const allHardwareAssets = await Asset.aggregate().match({ type: 'Hardware'});
    
    const source = allHardwareAssets.reduce((accum: any, value: any) => {
        if (value.assignee) {
            const findEmployee = allEmployees.find(f => f['code'] === value.assignee);

            if(findEmployee) value['assignee'] = `${findEmployee['firstName']} ${findEmployee['lastName']}`
        }
        if (value.recoveredFrom) {
            const findEmployee = allEmployees.find(f => f['code'] === value.recoveredFrom);

            if(findEmployee) value['recoveredFrom'] = `${findEmployee['firstName']} ${findEmployee['lastName']}`
        }

        value['purchaseDate'] = new Date(value['purchaseDate']).toString() !== 'Invalid Date' ? new Date(value['purchaseDate']).toISOString() : '';
        value['deploymentDate'] = new Date(value['deploymentDate']).toString() !== 'Invalid Date' ? new Date(value['deploymentDate']).toISOString() : '';
        value['recoveryDate'] = new Date(value['recoveryDate']).toString() !== 'Invalid Date' ? new Date(value['recoveryDate']).toISOString() : '';

        value['isRGE'] = value['isRGE'] ? 'TRUE' : 'FALSE';

        accum.push(value)
        return accum;
    }, [])
    
    let excelTable = await createExcelTable(source, AutoMailReportTemplate)

    const filePath = await saveFile('/public/attachments', 'Assets.xlsx', excelTable, true);
    const backupFile = await extractDocuments();
    const htmlMessage = await inventoryReportHtml();
    const dateReference = new Date();
    // const emails = ['rhnaney@gmail.com', 'cbandalan@fullscale.ph', 'apacada@fullscale.ph', 'kquieta@fullscale.ph']
    const emails = ['rhnaney@gmail.com']
    await sendMail({
        subject: `Full Scale Stockpilot: Inventory Report (Date Generated ${dateReference.toLocaleDateString()})`, 
        htmlMessage: htmlMessage, 
        recipient: emails,
        attachments: [filePath, backupFile]
      })
      
    console.log('Done processsing')
}

activateAutoMailing();