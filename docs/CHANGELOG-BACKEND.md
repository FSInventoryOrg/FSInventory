# BACKEND CHANGELOG

### 2024-09-12 [v2.12.2](https://connect.zoho.com/portal/intranet/task/623367000000281173)
- *New* - Inventory page: Software Asset Type

### 2024-09-12 [v2.12.1](https://connect.zoho.com/portal/intranet/task/623367000000597066)
- *Fix* - Automated email reports sending email function and append update function for last email report sent date

### 2024-09-10 [v2.12.0](https://connect.zoho.com/portal/intranet/task/623367000000658393)
- *Bug* - Deployed asset status is selected by default in Settings: Tracked status

### 2024-08-29 [v2.5.6](https://connect.zoho.com/portal/intranet/task/623367000000590081)
- *Change* - update latest assets added table in automated email report

### 2024-08-29 [v2.5.6](https://gitlab.com/full-scale-internship/stockpilot/-/commit/9ab62005be3ee96414616235fb39d70bb09a62a8)
- *New* - updating mailing protocol to official mailer

### 2024-08-29 [v2.5.5](https://connect.zoho.com/portal/intranet/task/623367000000615263)
- *New* - Backend processing when loading system backup file

### 2024-08-28 [v2.5.4](https://connect.zoho.com/portal/intranet/task/623367000000601111)
- *Change* - Removing 'Shelved' status in the system

### 2024-08-28 [v2.5.3](https://connect.zoho.com/portal/intranet/task/623367000000599090)
- *Change* - Adjusting the automail backend side for frontend usage

### 2024-08-27 [v2.5.2](https://connect.zoho.com/portal/intranet/task/623367000000590081)
- *New* - Automated Email Report: Email content (html format only)
- *New* - integration with excel and backup

### 2024-08-27 [v2.5.1](https://connect.zoho.com/portal/intranet/task/623367000000597034)
- *New* - adding backup feature

### 2024-08-16 [v2.5.0](https://connect.zoho.com/portal/intranet/task/623367000000601111)
- *New* - changing shelved to it storage and part of backup db

### 2024-08-16 [v2.4.9](https://connect.zoho.com/portal/intranet/task/623367000000597248)
- *New* - Automated Email Report feature

### 2024-08-16 [v2.4.8](https://connect.zoho.com/portal/intranet/task/623367000000584055)
- *Fix* - Enable Multiple status to be selected in Settings: retrievable/deployable status ( changing the schema affected on this feature)

### 2024-08-14 [v2.4.7](https://connect.zoho.com/portal/intranet/task/623367000000570055)
- *New* - Notification when a Software license is about to expire

### 2024-08-13 [v2.4.6](https://connect.zoho.com/portal/intranet/task/623367000000584121)
- *New* - Adding employee snap data for `/api/assets/:property/:value` endpoint

### 2024-08-12 [v2.4.5](https://connect.zoho.com/portal/intranet/task/623367000000573043)
- *Fix* - Changing the method requirement of bulkDelete to `patch` cause the `delete` method won't accept request body