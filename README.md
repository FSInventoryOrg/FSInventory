# FS Inventory System

## Setup Dev Environment
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

### Setup MongoDB
4. Install docker, if haven't yet. https://docs.docker.com/engine/install/
5. Download the backup zip from this [zoho drive](https://workdrive.zoho.com/folder/1ue723c141a8c57c64317a9025efae6a89d26?layout=list). Unzip somewhere.
6. Add the path to the `inventory` folder to `backend/.env`
```sh
DUMP_DIRECTORY=<path to inventory folder>
```
7. Due to running a replicat set, we need to make sure that the `host.docker.internal` hostname can be resolved to the host machine's IP address. 
> On Windows, there is a [setting](https://docs.docker.com/desktop/settings/) to automatically add the `*.docker.internal` hostnames in the hosts file. 

> If `host.docker.internal` cannot be resolved on Linux, you must add a line in your /etc/hosts file to map `host.docker.internal` to the IP address 127.17.0.1.

8. Run mongodb replica set. This automatically restores the dump files.
```sh
cd backend
docker compose up
```

9. Install mongodb compass (or any mongodb client/gui that you like). Connect using this connecting string: `mongodb://127.0.0.1:27017?replicaSet=rs0`. Test that you can connect and the inventory database was populated.
10. Add/modify your mongodb connection string in `backend/.env`:
```sh
MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:27017/inventory?replicaSet=rs0
```
### Running/Debugging
11. Add `.vscode/launch.json` config for running always with debugging enabled:
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
12. Go to `Run and Debug`, CTRL+SHIFT+D, Run both `Run backend` and `Run frontend`. Add breakpoints and debug.

![running](docs/images/debugging.png)

13. Visit `http://localhost:3000`

![running](docs/images/running.png)

## Contributing

### Create a feature/fix branch
Branch off `staging`. Prefix the name of the branch with either `feature/` or `fix/`
```sh
git checkout staging
git pull #make sure you have the latest code
git checkout -b feature/my-nice-feature
#or
git checkout -b fix/my-nice-fix
```

### Create a PR
After you done your work and committed your changes, create a PR and target `staging`. Add a brief description of what you have done.

The PR should also include the following:

### Version Bump
Do a version bump to backend and/or frontend project. Follow [Semantic Versioning](https://semver.org/).

Given a version number MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes
```sh
npm version major
```
2. MINOR version when you add functionality in a backward compatible manner (feature branches/tickets)
```sh
npm version minor
```
3. PATCH version when you make backward compatible bug fixes (fix branches/tickets)
```sh
npm version patch
```

### Changelog

Add a changelog entry to backend and/or frontend project. Follow [Keep a Changelog](https://keepachangelog.com/) to be consistent. The entries should be brief and mostly the same with the PR description.

```md
## [1.2.1](zoho link) - 2023-03-05

### Fixed

- Italian translation (#332).
- Indonesian translation (#336).

## [1.2.0](zoho link) - 2023-02-15

### Added

- v1.1 Brazilian Portuguese translation.

### Changed

- Use frontmatter title & description in each language version template
- Replace broken OpenGraph image

## [1.1.0](zoho link) - 2023-02-01

### Removed

- Trademark sign previously shown after the project description
```