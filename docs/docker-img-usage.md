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
- [x] `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot naneydon/fsims:staging sh start.sh` for staging server
- [x] `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot naneydon/fsims:prod sh start.sh` for production server
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

## Updating the Gitlab Credentials
- Since the gitlab token expires every year, click this **[link](https://gitlab.com/rhnaney/fs-ims/-/settings/access_tokens)** to create new one
- Add new token by filling the information **Token Name**, **Role** - *Developer*, **Scopes** - *read_repository*
- After creation, copy and save the token located above the list. **Note** *This will only appear once, be sure not to missed this event*
- Open Postman API Application and create new **PATCH** request
- URL must be `http://localhost:3000/config/environment` or `http://<HOST_IP>:3000/config/environment`
- In request body, choose **raw** with **type** of *JSON* and use this format `{ "gitlab_user": `*< Token Name >*`, "gitlab_token": `*< Token >*` }`
- Then send the request