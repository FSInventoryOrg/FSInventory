import { AssetFormData } from "./schemas/AddAssetSchema";
import { AssetFormData as DeployAssetFormData } from "./schemas/DeployAssetSchema";
import { AssetFormData as RetrieveAssetFormData } from "./schemas/RetrieveAssetSchema";
import { EmployeeFormData } from "./schemas/AddEmployeeSchema";
import { AssetsHistory } from "./types/employee";
import { Defaults } from "./types/options";
import { UserData } from "./schemas/UserSchema";
import { UploadImage } from "./types/user";
import { AutoMailType } from "@/types/automail";
import { AssetCounterFormData } from "./schemas/AssetCounterSchema";
import { MongoResult } from "./types/backup";
import { NotificationSettingType } from "./types/notification-setting";
import { RequestFormData } from "./schemas/RequestFormSchema";
import { capitalize, format } from "./lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* ASSETS */

export const addAsset = async (asset: AssetFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/assets`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asset),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

export const updateAsset = async ({
  code,
  updatedAsset,
}: {
  code: string;
  updatedAsset: AssetFormData;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/${code}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedAsset),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update asset");
  }

  return true;
};

export const deployAsset = async ({
  code,
  deployedAsset,
}: {
  code: string;
  deployedAsset: DeployAssetFormData;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/deploy/${code}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deployedAsset),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update asset");
  }

  return true;
};

export const retrieveAsset = async ({
  code,
  retrievedAsset,
}: {
  code: string;
  retrievedAsset: RetrieveAssetFormData;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/retrieve/${code}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(retrievedAsset),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update asset");
  }

  return true;
};

export const removeDeploymentHistoryEntry = async (
  code: string,
  index: number
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets/history/${code}/${index}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(
      responseBody.message || "Failed to remove entry from deployment history"
    );
  }

  return true;
};

export const updateAssetsByProperty = async ({
  property,
  value,
  newValue,
}: {
  property: string;
  value: string;
  newValue: string;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets/${property}/${value}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [property]: newValue }),
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update asset");
  }

  return true;
};

export const fetchAllAssets = async (type?: string) => {
  let url = `${API_BASE_URL}/api/assets`;
  if (type) {
    url += `?type=${type}`;
  }

  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching assets");
  }

  return response.json();
};

export const fetchAllAssetsByStatusAndCategory = async (
  type: string,
  status: string,
  category: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets?type=${type}&status=${status}&category=${category}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching assets");
  }

  return response.json();
};

export const fetchAssetsByFilter = async (filter: {
  [key: string]: string;
}) => {
  const queryString = new URLSearchParams(filter).toString();
  const response = await fetch(`${API_BASE_URL}/api/assets?${queryString}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching assets");
  }

  return response.json();
};

export const fetchAssetByCode = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/${code}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching asset by code");
  }

  return response.json();
};

export const fetchAssetCount = async (property: string, value: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets/count/${property}/${encodeURIComponent(value)}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching assets");
  }

  return response.json();
};

export const fetchAssetsByProperty = async (
  property: string,
  value: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets/${property}/${value}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching assets");
  }

  return response.json();
};

export const fetchAssetUniqueValuesByProperty = async (property: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets/uniqueValues/${property}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching unique values");
  }

  return response.json();
};

export const deleteAssetsByProperty = async (
  property: string,
  value: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assets/${property}/${value}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete assets");
  }

  return true;
};

export const deleteAssetByCode = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/${code}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete asset");
  }

  return true;
};

/* OPTIONS */

export const addOptionValue = async ({
  property,
  value,
  prefixCode,
  type,
}: {
  property: string;
  value: string | object;
  prefixCode?: string;
  type?: "Hardware" | "Software";
}) => {
  if (!value) throw new Error(`Value for ${property} is required.`);

  const propertyBeingChangedIsCategory: boolean = property === "category";
  if (propertyBeingChangedIsCategory) {
    if (!prefixCode) throw new Error("Prefix code is required.");
    const { status } = await fetch(
      `${API_BASE_URL}/api/assetcounter/${prefixCode}`
    );
    if (status !== 404)
      throw new Error(
        `${capitalize(format(property))} with prefix code ${prefixCode} already exists.`
      );
  }

  let url = `${API_BASE_URL}/api/options/${property}/`;
  if (type) {
    url += `?type=${type}`;
  }
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(
      responseBody.message || `Failed to add ${format(property)}`
    );
  }
  if (propertyBeingChangedIsCategory) {
    await postAssetCounter({
      category: value as string,
      prefixCode: prefixCode as string,
      threshold: 1,
      counter: 0,
      type: type ?? "Hardware",
    });
  }

  return response.json();
};

export const updateOptionDefaults = async (defaults: Defaults) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/options/defaults`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(defaults),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(responseBody.error || "Failed to update defaults");
    }

    return responseBody;
  } catch (error) {
    console.error("Error updating defaults:", error);
    throw error;
  }
};

export const updateOptionValue = async ({
  property,
  value,
  index,
}: {
  property: string;
  value: string | object;
  index?: number;
}) => {
  const url = `${API_BASE_URL}/api/options/${property}`;
  const queryString = index !== undefined ? `?index=${index}` : "";

  const response = await fetch(url + queryString, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update option");
  }

  return true;
};

export const deleteOption = async (property: string, value: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/options/${property}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(responseBody.message || `Failed to delete ${property}`);
    }

    return responseBody;
  } catch (error) {
    console.error("Error deleting option:", error);
    throw error;
  }
};

export const fetchOptionValues = async (property: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/options/${property}`, {
      credentials: "include",
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(responseBody.message || `Failed to fetch ${property}`);
    }

    if (property === "defaults") {
      if (responseBody.value) {
        responseBody.value.retrievableStatus = "Deployed";
        if (
          !(responseBody.value.deployableStatus || []).includes("IT Storage")
        ) {
          responseBody.value.deployableStatus = [
            ...(responseBody.value.deployableStatus || []),
            "IT Storage",
          ];
        }
      }
    }

    return responseBody.value;
  } catch (error) {
    console.error("Error fetching option value:", error);
    throw error;
  }
};

/* EMPLOYEES */

export const addEmployee = async (asset: EmployeeFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asset),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

export const removeAssetHistoryEntry = async (code: string, index: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/employees/history/${code}/${index}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(
      responseBody.message || "Failed to remove entry from asset history"
    );
  }

  return true;
};

export const updateEmployeeAssetHistory = async ({
  code,
  assetHistory,
}: {
  code: string;
  assetHistory: AssetsHistory;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/employees/history/${code}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetHistory),
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(
      responseBody.message || "Failed to update employee asset history"
    );
  }

  return true;
};

export const updateEmployee = async ({
  code,
  updatedEmployee,
}: {
  code: string;
  updatedEmployee: EmployeeFormData;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/${code}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEmployee),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update employee");
  }

  return true;
};

export const fetchAllEmployees = async (includeUnregistered?: string) => {
  const APPEND_URL = !includeUnregistered ? "" : "/includeUnregistered";
  const response = await fetch(`${API_BASE_URL}/api/employees${APPEND_URL}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching employees");
  }

  return response.json();
};

export const fetchEmployeeByCode = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/${code}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching employee by code");
  }

  return response.json();
};

export const fetchEmployeeUniqueValuesByProperty = async (property: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/employees/uniqueValues/${property}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching unique values");
  }

  return response.json();
};

export const deleteEmployeeByCode = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/${code}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(
      responseBody.message || "Failed to delete employee by code"
    );
  }

  return true;
};

/* USER PROFILE */
export const fetchUserData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user");
  }

  return response.json();
};

export const updateUserData = async (user: UserData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update profile");
  }
  return true;
};

export const uploadUserPicture = async (form: UploadImage) => {
  const response = await fetch(`${API_BASE_URL}/api/upload/user`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Asset counters
export const fetchAssetCounters = async () => {
  const response = await fetch(`${API_BASE_URL}/api/assetcounter`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user");
  }

  return response.json();
};

export const postAssetCounter = async (data: AssetCounterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/assetcounter/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message);
  }

  return response.json();
};

export const updateAssetCounter = async ({
  prefixCode,
  updatedAssetCounter,
}: {
  prefixCode?: string;
  updatedAssetCounter: AssetCounterFormData & { _id?: string };
}) => {
  if (!updatedAssetCounter._id) {
    return postAssetCounter({ ...updatedAssetCounter, threshold: 1 });
  }
  // Validate if existing category is not assigned a prefix code
  if (!prefixCode) throw new Error("Prefix code is required.");
  const response = await fetch(
    `${API_BASE_URL}/api/assetcounter/${prefixCode}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAssetCounter),
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update asset counter");
  }

  return response.status;
};

export const deleteAssetCounter = async (prefixCode: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/assetcounter/${prefixCode}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete asset counter");
  }
  return true;
};

export const fetchNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notification`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching notifications");
  }

  return response.json();
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/notification`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([notificationId]),
  });

  if (!response.ok) {
    throw new Error("Error marking notification as read");
  }

  return true;
};

export const oauthLogin = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/oauthLogin`);

  if (!response.ok) {
    throw new Error("Error signing in to OAuth provider");
  }

  const responseBody = await response.json();

  window.location.href = responseBody["url"];
};

export const verifyOAuthCode = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verifyOAuthCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code: code }),
  });

  if (!response.ok) {
    throw new Error("Error verifying the OAuth code");
  }

  const responseBody = await response.json();

  return responseBody;
};

export const getCookieUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/cookie-user`, {
    credentials: "include",
  });

  const responseBody = await response.json();

  return responseBody;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  return response.ok;
};

export const bulkDeleteAssets = async (assetCodes: string[]) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/bulkDelete`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assetCodes),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete assets");
  }

  return true;
};

export const fetchAutoMailSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/autoMail`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching notifications");
  }

  return response.json();
};

export const postAutoMailSettings = async (data: AutoMailType) => {
  const response = await fetch(`${API_BASE_URL}/autoMail`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message);
  }

  return response.json();
};

export const sendAutoMailNow = async () => {
  const response = await fetch(`${API_BASE_URL}/autoMail/activateNow`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message);
  }

  return response.json();
};

/* BACKUP FILE IMPORT/EXPORT */
export const validateBackupFile = async (fileAsBase64: { src: string }) => {
  const response = await fetch(`${API_BASE_URL}/backup/validate`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileAsBase64),
  });

  return response.json();
};

export const importBackupFile = async (
  changes: { [index: string]: MongoResult[] } | undefined = undefined
) => {
  const response = await fetch(`${API_BASE_URL}/backup/import`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  return response.json();
};

export const updateSoftwareNotif = async (data: NotificationSettingType) => {
  const response = await fetch(`${API_BASE_URL}/api/notification_settings`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message);
  }

  return response.json();
};

export const fetchSoftwareNotif = async () => {
  const response = await fetch(`${API_BASE_URL}/api/notification_settings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching notification settings");
  }

  return response.json();
};

export const fetchAppVersions = async () => {
  const response = await fetch(`${API_BASE_URL}/version`, {
    credentials: "include",
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message);
  }

  return response.json();
};

export const submitTicket = async (data: RequestFormData) => {
  return data;
  const response = await fetch(`${API_BASE_URL}/api/support_ticket`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const updateTicket = async ({
  ticketId,
  updatedTicket,
}: {
  ticketId: string;
  updatedTicket: RequestFormData;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/support_ticket/${ticketId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTicket),
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to update asset");
  }

  return true;
};

export const getTickets = async (type?: string) => {
  let url = `${API_BASE_URL}/api/support_ticket`;
  if (type) {
    url += `?type=${type}`;
  }

  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching tickets");
  }

  return response.json();
};

export const getTicketById = async (ticketId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/support_ticket/${ticketId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching ticket by Id");
  }

  return response.json();
};

export const fetchTicketsByFilter = async (filter: {
  [key: string]: string;
}) => {
  const queryString = new URLSearchParams(filter).toString();
  const response = await fetch(
    `${API_BASE_URL}/api/support_ticket?${queryString}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching tickets");
  }

  return response.json();
};

export const deleteTicketById = async (ticketId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/support_ticket/${ticketId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete ticket");
  }

  return true;
};

export const bulkDeleteTickets = async (ticketIds: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/support_ticket/bulkDelete`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketIds),
    }
  );

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete ticket");
  }

  return true;
};
