import jwt from "jsonwebtoken";
import {
  IAssetRequestTicket,
  IIssueReportTicket,
} from "../../models/support-ticket.schema";
import { ApprovalQueryParams, TicketType } from "../../types/support-ticket";
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
  Handlebars.registerHelper("getInitial", (text: string) => {
    const splittedText = text.split(" ");
    if (splittedText.length <= 1) {
      return splittedText[0].charAt(0).toUpperCase();
    }
    const firstWord = splittedText[0];
    const lastWord = splittedText[splittedText.length - 1];
    return firstWord.charAt(0).toUpperCase() + lastWord.charAt(0).toUpperCase();
  });

  const template = Handlebars.compile(templateContent?.toString());
  const urls = generateRejectApproveUrl({
    ticketId: data.ticketId ?? "",
    managerEmail: data.managerEmail,
  });

  const commonData = {
    ticketId: data.ticketId,
    employeeName: data.employeeName,
    employeeEmail: data.employeeEmail,
    employeeRole: data.employeeRole || "Full Scale Employee (Default)",
    employeeProfile: data.employeeProfile,
    supportingFiles: data.supportingFiles,
    status: data.status,
    approveUrl: urls.approveUrl || "",
    rejectUrl: urls.rejectUrl || "",
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
      type: arg.type,
      issueCategory: data.issueCategory,
      assetAffected: data.assetAffected,
      issueDescription: data.issueDescription,
    };
  } else if (arg.type === TicketType.AssetRequest) {
    const data = arg as IAssetRequestTicket;
    const dateObject = new Date(data.requestedDate ?? "");
    let requestedDate = undefined;
    if (!isNaN(dateObject.getTime())) {
      requestedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(requestedDate);
    }

    return {
      type: arg.type,
      assetType: data.assetType,
      assetSpecsModel: data.assetSpecsModel,
      justification: data.justification,
      requestedDate: requestedDate,
    };
  } else {
    return {};
  }
};

const generateRejectApproveUrl = ({
  ticketId,
  managerEmail,
}: ApprovalQueryParams) => {
  const baseUrl = process.env.BACKEND_URL || "http:localhost:8080";
  const token = jwt.sign(
    { ticketId, managerEmail },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "7d" }
  );

  return {
    rejectUrl: "", // TODO
    approveUrl: `${baseUrl}/api/support_ticket/${ticketId}/approve?token=${token}`,
  };
};
