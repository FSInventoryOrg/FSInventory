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
- Copy and paste the command `docker run -itd -p 3000:3000 -p 27020:27020 --name stockpilot naneydon/fsims:prod sh start.sh`
- Then wait until the repository is pulled. **Note** *initially the container will automatically run after the pull*
- Wait for about 2 minutes to properly execute the startup script. **Note** *This will occur everytime you start the container*
- To access the page go to `http://localhost:3000`
- To access the mongodb via compass, use this `mongodb://fullscale:fullscale@localhost:27020/inventory?authSource=admin`

## Docker command and control scripts
- Be sure to follow the **`First time setup`**
- To start the container type - `docker start stockpilot`
- To stop the container type - `docker stop stockpilot`