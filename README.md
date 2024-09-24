# FS Inventory System

## Local setup using Docker
1. Clone this repository, checkout `staging` branch, install dependencies
```sh
git clone https://github.com/FSInventoryOrg/FSInventory.git
git checkout staging
cd backend
npm ci
cd ../frontend
npm ci
```
2. Create `backend/.env` config file. Ask teammate for updated values.
3. Create `frontend/.env` config file. Add this value:
```sh
VITE_API_BASE_URL=http://localhost:8080
```
4. Add server entry in `frontend/vite.config.ts`
```ts
export default defineConfig({
  server: {
    port: 3000,
  },
 // other config
})
```

### Setup MongoDB
5. Install docker, if haven't yet. https://docs.docker.com/engine/install/
6. Download the backup zip from this [zoho drive](https://workdrive.zoho.com/folder/1ue723c141a8c57c64317a9025efae6a89d26?layout=list). Unzip somewhere.
7. Add the path to the `inventory` folder to `backend/.env`
```sh
DUMP_DIRECTORY=<path to inventory folder>
```
8. Due to running a replicat set, we need to make sure that the `host.docker.internal` hostname can be resolved to the host machine's IP address. 

On Windows, there is a [setting](https://docs.docker.com/desktop/settings/) to automatically add the `*.docker.internal` hostnames in the hosts file. 

If `host.docker.internal` cannot be resolved on Linux, you must add a line in your /etc/hosts file to map `host.docker.internal` to the IP address 127.17.0.1.

9. Run mongodb replica set and automatically restores the dump files.
```sh
cd backend
docker compose up
```

10. Install mongodb compass (or any mongodb client/gui that you like). Connect using this connecting string: `mongodb://127.0.0.1:27017?replicaSet=rs0`. Test that you can connect and the inventory database was populated.
11. Add/modify your mongodb connection string in `backend/.env`:
```sh
MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:27017/inventory?replicaSet=rs0
```
### Running/Debugging
12. Add `.vscode/launch.json` config for running always with debugging enabled:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "command": "npm run dev",
            "name": "Run backend",
            "request": "launch",
            "type": "node-terminal",
            "cwd": "${workspaceFolder}/backend",
            "envFile": "${workspaceFolder}/backend/.env"
        },
        {
            "command": "npm run dev",
            "name": "Run frontend",
            "request": "launch",
            "type": "node-terminal",
            "cwd": "${workspaceFolder}/frontend",
            "envFile": "${workspaceFolder}/frontend/.env"
        }
    ]
}
```
13. Go to `Run and Debug`, CTRL+SHIFT+D, Run both `Run backend` and `Run frontend`. Add breakpoints and debug.

![running](docs/images/debugging.png)

14. Visit `http://localhost:3000`

![running](docs/images/running.png)