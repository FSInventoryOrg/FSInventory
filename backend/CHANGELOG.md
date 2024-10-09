# Backend Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.15.0](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000615263) 2024-09-16 
### Added
- Backend support for system backup file

## [2.14.0](https://connect.zoho.com/portal/intranet/task/623367000000718019) 2024-09-27
### Added
- default software and hardware category in options schema

## [2.13.0](https://connect.zoho.com/portal/intranet/task/623367000000728119) 2024-09-27 
### Added
- 'notifyRemarks' boolean in asset collection

## [2.12.2](https://connect.zoho.com/portal/intranet/task/623367000000281173) 2024-09-12 
### Added
- Inventory page: Software Asset Type

## [2.12.1](https://connect.zoho.com/portal/intranet/task/623367000000597066) 2024-09-12 
### Fixed
- Automated email reports sending email function and append update function for last email report sent date

## [2.12.0](https://connect.zoho.com/portal/intranet/task/623367000000658393) 2024-09-10 
### Fixed
- Deployed asset status is selected by default in Settings: Tracked status

## [2.5.6](https://connect.zoho.com/portal/intranet/task/623367000000590081) 2024-08-29 
### Changed
- update latest assets added table in automated email report

## [2.5.6](https://gitlab.com/full-scale-internship/stockpilot/-/commit/9ab62005be3ee96414616235fb39d70bb09a62a8) 2024-08-29 
### Added
- updating mailing protocol to official mailer

## [2.5.5](https://connect.zoho.com/portal/intranet/task/623367000000615263) 2024-08-29 
### Added
- Backend processing when loading system backup file

## [2.5.4](https://connect.zoho.com/portal/intranet/task/623367000000601111) 2024-08-28 
### Changed
- Removing 'Shelved' status in the system

## [2.5.3](https://connect.zoho.com/portal/intranet/task/623367000000599090) 2024-08-28 
### Changed
- Adjusting the automail backend side for frontend usage

## [2.5.2](https://connect.zoho.com/portal/intranet/task/623367000000590081) 2024-08-27 
### Added
- Automated Email Report: Email content (html format only)
- integration with excel and backup

## [2.5.1](https://connect.zoho.com/portal/intranet/task/623367000000597034) 2024-08-27 
### Added
- Added backup feature

## [2.5.0](https://connect.zoho.com/portal/intranet/task/623367000000601111) 2024-08-16 
### Added
- changing shelved to it storage and part of backup db

## [2.4.9](https://connect.zoho.com/portal/intranet/task/623367000000597248) 2024-08-16 
### Added
- Automated Email Report feature

## [2.4.8](https://connect.zoho.com/portal/intranet/task/623367000000584055) 2024-08-16 
### Fixed
- Enable Multiple status to be selected in Settings: retrievable/deployable status ( changing the schema affected on this feature)

## [2.4.7](https://connect.zoho.com/portal/intranet/task/623367000000570055) 2024-08-14 
### Added
- Notification when a Software license is about to expire

## [2.4.6](https://connect.zoho.com/portal/intranet/task/623367000000584121) 2024-08-13 
### Added
- Adding employee snap data for `/api/assets/:property/:value` endpoint

## [2.4.5](https://connect.zoho.com/portal/intranet/task/623367000000573043) 2024-08-12 
### Fixed
- Changing the method requirement of bulkDelete to `patch` cause the `delete` method won't accept request body