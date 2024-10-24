### Short Description
[Ticket (be sure to just copy the ticket title from Zoho)](insert-link-to-ticket-here).
<!-- Briefly describe what the PR solves or aims to do. -->

### Type of Change
- [x] Bug fix
- [ ] New Feature
- [ ] Breaking Feature/Fix

### This PR includes changes in
- [ ] Backend
- [x] Frontend
- [ ] Environment variables 

### Checklist
- [ ] Follows the coding standards for this project
- [ ] Linted before submission of PR
- [ ] Includes comments to explain specific functionality and/or possible blockers/TODO
- [ ] Generates no new warnings/errors
- [ ] Version bump where necessary
- [ ] Recorded a demo video (do not check if not applicable)

### Testing
#### Demo Video
<!-- Provide a link to the demo video for this PR. Make sure this is also in the ticket for QA to see. -->
Link to [demo video](insert-link-to-demo-video-here).
#### Steps to replicate
<!-- Provide steps for testers to follow and verify your code works as intended. -->
<!-- This is an example
1. Log in to the application using an account with `ADMIN` permissions.
2. Navigate to the inventory page using the `Inventory` button.
3. Click on `Add Asset`, found on the upper right portion of the inventory table.
4. Click on the `Category` dropdown.
5. Edit an existing category by clicking on the `pencil` icon. If there are no existing categories, follow the procedure for creating a new category.
6. Input the new prefix code in the provided field. Click on `Save` when done. A toast should show indicating the status of the request, but the button will keep showing a spinner. Wait for this to finish and the `Popover` should automatically close once the operation is complete.
7. If there are assets with the edited category, their codes should also be updated. If they are not updated, try refreshing the page or navigating to another page and going back to the inventory page.
-->

### Files Changed
<!-- List the changed files in a file tree structure  -->
#### Backend
<!-- Here are examples you can follow -->
<!-- Changes are only in the /src/routes directory
- /src/routes
  - /asset-counter.ts
    - Removed check for asset counters having existing prefix codes
      - This removal enables editing prefix codes for categories
  - /assets.ts
    - Added code block and regex for updating prefix code
-->
<!-- Changes are in the /src directory and the /src/routes directory
- /src
  - /routes
    - /asset-counter.ts
      - Removed check for asset counters having existing prefix codes
        - This removal enables editing prefix codes for categories
    - /assets.ts
      - Added code block and regex for updating prefix code
  - /index.ts
    - Created this awesome app
-->
#### Frontend
<!-- Changes include a new file
- /src/components/inventory-ui
  - /useAssetCounter.tsx - ***NEW***
    - Created to be able to load asset counters conditionally without breaking the site
  - /EditOption.tsx
    - Added field for editing Prefix Code
    - Added optional parameter `updatedAssetCounter` to `onUpdate` prop
  - /Options.tsx
    - Added control flow for editing Prefix Code
-->
#### Root
<!-- Include changes in the root directory as well. -->