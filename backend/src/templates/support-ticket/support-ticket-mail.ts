import Handlebars from "handlebars";
import { getAppRootDir, getFile } from "../../utils/common";

export const supportTicketHtml = async () => {
  const rootDir = getAppRootDir();
  const templatePath = `${rootDir}\\/src/templates/support-ticket/support-ticket.hbs`;
  const templateContent = await getFile(templatePath, true);
  const template = Handlebars.compile(templateContent?.toString());

  const issueReportData = {
    ticketId: "IR-0123",
    employeeName: "",
    employeeRole: "",
    employeeProfile: "",
    issueCategory: "Hardware",
    assetAffected: "Macbook Pro",
    issueDescription: "I broke my laptop",
    supportingFiles: [],
  };

  //   const assetRequestData = {
  //     ticketId: "AR-0123",
  //     employeeName: "",
  //     employeeRole: "",
  //     employeeProfile: "",
  //     assetType: "Hardware",
  //     assetSpecsModel: "Apple Macbook Pro M3",
  //     justification: "Need a new machine",
  //     requestedDate: new Date("11-29-2024"),
  //   };

  const htmlMessage = template(issueReportData);
  return htmlMessage.toString();
};
