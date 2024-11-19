import {
  IAssetRequestTicket,
  IIssueReportTicket,
} from "../../models/support-ticket.schema";
import { TicketType } from "../../types/support-ticket";
import { getAppRootDir, getFile } from "../../utils/common";
import Handlebars from "handlebars";

type T = (IAssetRequestTicket | IIssueReportTicket) & {
  employeeRole?: string;
  employeeProfile?: string;
};

export const generateSupportTicketHTML = async (data: T) => {
  const rootDir = getAppRootDir();
  const templatePath = `${rootDir}\\/src/templates/support-ticket/support-ticket.hbs`;
  const templateContent = await getFile(templatePath, true);

  Handlebars.registerHelper("isImage", (fileUrl) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => fileUrl.toLowerCase().endsWith(ext));
  });
  const template = Handlebars.compile(templateContent?.toString());

  const commonData: Partial<T> = {
    type: data.type,
    ticketId: data.ticketId,
    employeeName: data.employeeName,
    employeeEmail: data.employeeEmail,
    employeeRole: data.employeeRole || "Full Scale Employee (Default)",
    employeeProfile:
      data.employeeProfile ||
      "https://d1gvpl8cjqq6t6.cloudfront.net/overlays/_public/886b29e1-bf72-40eb-9873-3bb725a30688.jpg",
    supportingFiles: data.supportingFiles,
    status: data.status,
  };
  const typeSpecificData = getTypeSpecificData(data);
  const requiredData = { ...commonData, ...typeSpecificData };

  const htmlMessage = template(requiredData);
  return htmlMessage.toString();
};

const getTypeSpecificData = (arg: T) => {
  if (arg.type === TicketType.IssueReport) {
    const data = arg as IIssueReportTicket;
    return {
      issueCategory: data.issueCategory,
      assetAffected: data.assetAffected,
      issueDescription: data.issueDescription,
    };
  } else if (arg.type === TicketType.AssetRequest) {
    const data = arg as IAssetRequestTicket;
    return {
      assetType: data.assetType,
      assetSpecsModel: data.assetSpecsModel,
      justification: data.justification,
      requestedDate: data.requestedDate,
    };
  } else {
    return {};
  }
};
