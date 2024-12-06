# UI Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [2.28.2](https://connect.zoho.com/portal/intranet/task/623367000001000135) 2024-12-4
### Fixed
- Fixed Sorting issues on Inventory Table with date columns (Purchase Date, Deployment Date, Recovery Date).

## [2.28.1](https://connect.zoho.com/portal/intranet/task/623367000000943123) 2024-11-13
### Fixed
- Fix the edit issue on Status and Equipment Type

## [2.28.0](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000860293) 2024-11-12
## Added
- Prefix Code is now editable when editing a category in the Settings/Inventory page
## [2.27.0](https://connect.zoho.com/portal/intranet/task/623367000000892241) 2024-11-21
### Added
- UI design to IT services request form and no tickets page

## [2.26.1](https://connect.zoho.com/portal/intranet/task/623367000000968011) 2024-11-21
### Fixed
- Fixed Assets list of Unregistered Employee not refreshing / up to date when an asset is recovered.

## [2.26.0](https://connect.zoho.com/portal/intranet/task/623367000000853258) 2024-11-22
### Changed
- Updated functionality of filter logic on tracker page, also updated view all text and onClickOutside filter functionality

## [2.25.4](https://connect.zoho.com/portal/intranet/task/623367000000942387) 2024-11-20
### Fixed
- Fixed delete issue on options, added reset state when changes are detected on edit

## [2.25.3](https://connect.zoho.com/portal/intranet/task/623367000000943123) 2024-11-13
### Fixed
- Fix the edit issue on Status and Equipment Type for Inventory Page

## [2.25.2](https://connect.zoho.com/portal/intranet/task/623367000000992150) 2024-11-20
### Fixed
- Fixed Total Assets Count whenever the Type is changed which carried over the previous status, category, processor, memory and storage filters causing the bug

## [2.25.1](https://connect.zoho.com/portal/intranet/task/623367000000940439) 2024-11-11
### Fixed
- Formatted all keys containing the word "date" in the assets to MM/DD/YYYY format before exporting

## [2.25.0](https://connect.zoho.com/portal/intranet/task/623367000000878039) 2024-11-12
### Added
- Reimplemented UI on Asset Counts on tracker page, adjusted layout of As of date information

## [2.24.1](https://connect.zoho.com/portal/intranet/task/623367000000878021) 2024-11-04
### Removed
-  Logic in asset counter setting to call delete asset counter endpoint since this is already done in the backend 

### Fixed
-  Previously deleted category may be re-added

## [2.24.0](https://connect.zoho.com/portal/intranet/task/623367000000860085) 2024-11-11
### Added
- Added a tooltip for the remarks indicator

## [2.23.7](https://connect.zoho.com/portal/intranet/task/623367000000878039) 2024-10-29
### Fixed
- Display error message from response if request to add option fails

## [2.23.6](https://connect.zoho.com/portal/intranet/task/623367000000853258) 2024-11-7 
### Added
-  Reimplemented UI on Employee Filters on tracker page, used checkboxes, added search box, added clear filters

## [2.23.5](https://connect.zoho.com/portal/intranet/task/623367000000888079) 2024-11-5 
### Fixed
-  Redesigned Tracker UI for active / inactive / unregistered employees

## [2.23.4](https://connect.zoho.com/portal/intranet/task/623367000000718041) 2024-11-04
### Fixed
- Fixed downloading of assets to accommodate software assets
- Fixed service in years calculations for invalid date formats when downloading assets

## [2.23.3](https://connect.zoho.com/portal/intranet/task/623367000000910167) 2024-11-06
### Fixed
- Using the searchbar in add/edit asset form's category, status, and equipment type is now only for searching. It will no longer update the value of the dropdown, respectively.

## [2.23.2](https://connect.zoho.com/portal/intranet/task/623367000000860057) 2024-10-29 
### Fixed
-  Fixed export bug where the persisted column visibility options are not visibile upon export.

## [2.23.1](https://connect.zoho.com/portal/intranet/task/623367000000860057) 2024-10-29 
### Fixed
-  Column Visibility resetting everytime category is changed / browser is resized.

## [2.23.0](https://connect.zoho.com/portal/intranet/task/623367000000701233) 2024-10-25
### Added
- IT services request form with validations (UI design to follow)

## [2.22.2](https://connect.zoho.com/portal/intranet/task/623367000000878101) 2024-10-29
### Fixed
- Updated width of the Inventory Page's section to be independent of the parent component

## [2.22.1](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000893151) 2024-10-28
### Fixed
- After finishing creating/editing a category, the user is now shown the list of avilable categories instead of staying in the creation spopover (in the case of creating) or closing the popover (in the case of editing).

## [2.22.0](https://connect.zoho.com/portal/intranet/task/623367000000860349) 2024-10-29
### Added
- Empty State Notification display when there are no notifications present

## [2.21.0](https://connect.zoho.com/portal/intranet/task/623367000000817053) 2024-10-28
### Added
- Updated the user profile dropdown to match latest UI, and removed the profile page and its components

## [2.20.0](https://connect.zoho.com/portal/intranet/task/623367000000718057) 2024-10-25 
### Added
-  Software notification setting to allow users to configure the number of days before they are notified of an upcoming software license expiration

## [2.19.3](https://connect.zoho.com/portal/intranet/task/623367000000853206) 2024-10-25
### Fixed
- Renamed "Create Employee" to "Add Employee" on Tracker add modal

## [2.19.2](https://connect.zoho.com/portal/intranet/task/623367000000795169) 2024-10-25
### Fixed
- Category default value to trigger required error when add asset form is submitted

## [2.19.1](https://connect.zoho.com/portal/intranet/task/623367000000795191) 2024-10-25
### Fixed
- Category to properly reset when switching tabs

## [2.19.0](https://connect.zoho.com/portal/intranet/task/623367000000739043) 2024-10-25
### Added
- Badge to reflect frontend and backend versions when in non-production mode

## [2.18.0](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000745177) 2024-10-18
### Added
- Added field for Prefix Code when editing a category in the New Asset screen

## [2.17.2](https://connect.zoho.com/portal/intranet/task/623367000000745059) 2024-10-17
### Fixed
- Highlight color of Hardware and Software tabs to be more emphasized in Light Mode
- Improved readability of warning alert by changing colors

## [2.17.1](https://connect.zoho.com/portal/intranet/task/623367000000795111) 2024-10-09
### Fixed
- Calendar modals in Add and Edit asset dialogs to display correctly

## [2.17.0](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000597050) 2024-10-03
### Added
- Frontend UI and workflow for loading system backup files

## [2.16.0](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000745289) 2024-10-03
### Removed
- Removed "+" button in the forms for adding and editing a Category; IT say it's no longer needed

## [2.15.1](https://connect.zoho.com/portal/intranet/task/623367000000698093)  2024-09-19
### Fixed 
- Asset recovery with missing deployment details

### Added
- Prompt to continue recovering asset with missing deployment details 

## [2.15.0](https://connect.zoho.com/portal/intranet/task/623367000000718019) 2024-09-27
### Added
- Settings for default software and hardware category
- Separate dropdowns for software and hardware categories
- Toggle in Asset Index setting to switch between hardware and software 

## [2.14.1](https://connect.zoho.com/portal/intranet/task/623367000000701175) 2024-09-24
### Fixed
- Asset details to only show fields related to the asset type 

## [2.15.0](https://connect.zoho.com/portal/intranet/task/623367000000718019) 2024-09-27
### Added
- Settings for default software and hardware category
- Separate dropdowns for software and hardware categories
- Toggle in Asset Index setting to switch between hardware and software 

## [2.14.1](https://connect.zoho.com/portal/intranet/task/623367000000701175) 2024-09-24
### Fixed
- Asset details to only show fields related to the asset type 

## [2.14.0](https://connect.zoho.com/portal/intranet/task/623367000000728119) 2024-09-27 
### Added
- Indicator if an asset has remarks
- Toggle in Add/Edit Asset form to disable the indicator

## [2.13.3](https://connect.zoho.com/portal/intranet/task/623367000000281173/623367000000745247) 2024-09-27
### Fixed
- Unable to add new software asset. Used the asset type in post request for Asset counter instead of a string literal

## [2.13.2](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000701197) 2024-09-24 
### Fixed
- Make Prefix Code a required field when creating new Category in Add Asset form

## [2.13.1](https://workplace.zoho.com/#connect_app/portal/intranet/task/623367000000672055) 2024-09-18
### Fixed
- Settings: Fix currently selected sidebar item not visible in light mode

## [2.13.0](https://connect.zoho.com/portal/intranet/task/623367000000701215) 2024-09-17
### Fixed
- Deletion of asset counter 

## [2.12.1](https://connect.zoho.com/portal/intranet/task/623367000000281173) 2024-09-12
### Added
- Inventory page: Software Asset Type

## [2.12.0](https://connect.zoho.com/portal/intranet/task/623367000000670005) 2024-09-10 
### Added
- Dashboard: added serial number on latest asset table

## [2.5.7](https://connect.zoho.com/portal/intranet/task/623367000000597066) 2024-09-12
### Added
- Added lacking option for automated reports email frequency sending monthly and added invalidate query for auto refresh

## [2.5.5](https://connect.zoho.com/portal/intranet/task/623367000000597066) 2024-08-29 
### Added
- Settings: Frequency of email can be changeable by Admin

## [2.5.4](https://connect.zoho.com/portal/intranet/task/623367000000597079) 2024-08-28 
### Added
- Settings: Recipient of email report

## [2.5.3](https://connect.zoho.com/portal/intranet/task/623367000000599090) 2024-08-28 
### Added
- Settings: Contact person for email

## [2.5.2](https://connect.zoho.com/portal/intranet/task/623367000000595540) 2024-08-28
### Fixed 
- Changing status in Edit Asset doesn't update the asset history

## [2.5.1](https://connect.zoho.com/portal/intranet/task/623367000000601071) 2024-08-20
### Fixed 
- Loading screen when signing up with Zoho

## [2.5.0](https://connect.zoho.com/portal/intranet/task/623367000000510432) 2024-08-20
### Fixed 
- Datepicker dropdown not doing anything after selecting different month/year

## [2.4.23](https://connect.zoho.com/portal/intranet/task/623367000000584055) 2024-08-16
### Added
- Enable Multiple status to be selected in Settings: retrievable/deployable status

## [2.4.22](https://connect.zoho.com/portal/intranet/task/623367000000510432) 2024-08-16
### Fixed
- Need to manually press back button for previous Month and Year for Add new employee start date

## [2.4.21](https://connect.zoho.com/portal/intranet/task/623367000000595253) 2024-08-16
### Fixed
- deploy-recover action in inventory page

## [2.4.20](https://connect.zoho.com/portal/intranet/task/623367000000597204) 2024-08-14
### Fixed
- Name for assignee in columns does not match in filter (Correcting the labels to Title Case format)

## [2.4.19](https://connect.zoho.com/portal/intranet/task/623367000000554031/623367000000594253) 2024-08-14
### Fixed
- Remove dot in a message

## [2.4.18](https://connect.zoho.com/portal/intranet/task/623367000000579041) 2024-08-14
### Fixed
- Include view details from asset code in Tracker employee assets

## [2.4.17](https://connect.zoho.com/portal/intranet/task/623367000000510432) 2024-08-14
### Fixed
- Need to manually press back button for previous Month and Year for Add new employee start date

## [2.4.16](https://connect.zoho.com/portal/intranet/task/623367000000533577) 2024-08-13
### Fixed
- Tracker Filter

## [2.4.15](https://connect.zoho.com/portal/intranet/task/623367000000584121) 2024-08-13
### Added
- Change details displaying Employee ID to Employee full name instead
### Fixed
- Change "Retrieve" word to "Recover" (already committed the changes but was overidden by some new pulls)

## [2.4.14](https://connect.zoho.com/portal/intranet/task/623367000000584071) 2024-08-12
### Fixed
- Remove Small settings button in Inventory page

## [2.4.13](https://connect.zoho.com/portal/intranet/task/623367000000560167) 2024-08-12
### Added
- Bulk Delete for Items (frontend)

## [2.4.12](https://connect.zoho.com/portal/intranet/task/623367000000579041) 2024-08-12
### Added
- Clicking on Asset code will view Asset details

## [2.4.11](https://connect.zoho.com/portal/intranet/task/623367000000561013) 2024-08-12
### Fixed
- Enable future dates for start date

## [2.4.10](https://connect.zoho.com/portal/intranet/task/623367000000480155) 2024-08-12
### Fixed
- Adding 10+ columns in Inventory page will result to buttons (add asset, next page) being hidden

## [2.4.9](https://connect.zoho.com/portal/intranet/task/623367000000586865) 2024-08-12
### Added
- Enable searching any name in Tracker

