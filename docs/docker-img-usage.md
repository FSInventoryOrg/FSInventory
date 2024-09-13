# FS IMS Docker Deployment Image Usage

## System Requirements
- **Operating System** - *you can choose either Windows, MacOS or Linux*
- **Docker Application** - *please select the correct version based on your OS [here](https://www.docker.com/)*
- **10GB minimum local storage**
- **2GB recommended RAM space**

## First time setup
- Install the docker application on your OS
- Make sure to free up these ports in your host OS `3000` and `27020`
- Open terminal or command prompt
- Copy and paste either of the command 
- [x] `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot cvillaflor/fsinventory:staging sh start.sh` for staging server
- [x] `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot cvillaflor/fsinventory:prod sh start.sh` for production server
- Then wait until the repository is pulled. **Note** *initially the container will automatically run after the pull*
- Wait for about 2 minutes to properly execute the startup script. **Note** *This will occur everytime you start the container*
- To access the page, open a browser and go to either of the following 
- [x] `http://localhost:3000` for local access in server itself
- [x] `http://<HOST_IP_OR_DOMAIN>:3000` for intranet or domain access
- To access the mongodb via compass, use this `mongodb://fullscale:fullscale@localhost:27020/inventory?authSource=admin`

## Docker command and control scripts
- Be sure to follow the **`First time setup`**
- To start the container type - `docker start stockpilot`
- To stop the container type - `docker stop stockpilot`

## Setup MongoDB Command Line DB Tools
- First you'll need to download it, click this **[link](https://www.mongodb.com/try/download/database-tools)** select a platform and download the .exe/msi file
- Then, please open the downloaded .exe/msi file by double clicking on it and follow as instructed until the finish button to install it completely
- Next, you'll have to setup system env PATH variables
- Locate the PATH env variable instructed from **[here](https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14)#to-add-a-path-to-the-path-environment-variable)** 
- Follow the instructions and when you will be on the no. 8 step **Copy** this value [x] `C:\Program Files\MongoDB\Tools\100\bin` and **Paste** it to be its new value

## MongoDB Backup Procedure
- Make sure to follow and execute the **`Setup MongoDB Command Line DB Tools`**
- Start your currently using docker container (old one), instructed on **`Docker command and control scripts`** above
- Open a command prompt or on Gitbash (Open CMD/Gitbash in C:\Users\documents)
- To generate a backup, run this command `mongodump --uri "mongodb://fullscale:fullscale@localhost:27020/inventory?authSource=admin" --out ./data/backup`

## MongoDB Restore Procedure
- Stop your currently running docker container, instructed on **`Docker command and control scripts`** above
- To run the new docker image, please use this command as follow below **Note** *You'll only need to rename your container name and don't delete or remove the existing one*
- [x] `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot_staging cvillaflor/fsinventory:staging sh start.sh` for staging server
- [x] `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot_production cvillaflor/fsinventory:prod sh start.sh` for production server
- Open a command prompt or on Gitbash (Open CMD/Gitbash in C:\Users\documents\data\backup)
- Load and restore the mongodb dump file (the Back up file) using this command `mongorestore --uri "mongodb://fullscale:fullscale@localhost:27020/inventory?authSource=admin" --db inventory --drop ./data/backup/inventory`

## Updating the Gitlab Credentials
- Since the gitlab token expires every year, click this **[link](https://gitlab.com/rhnaney/fs-ims/-/settings/access_tokens)** to create new one
- Add new token by filling the information **Token Name**, **Role** - *Developer*, **Scopes** - *read_repository*
- After creation, copy and save the token located above the list. **Note** *This will only appear once, be sure not to missed this event*
- Open Postman API Application and create new **PATCH** request
- URL must be `http://localhost:3000/config/environment` or `http://<HOST_IP>:3000/config/environment`
- In request body, choose **raw** with **type** of *JSON* and use this format `{ "gitlab_user": `*< Token Name >*`, "gitlab_token": `*< Token >*` }`
- Then send the request