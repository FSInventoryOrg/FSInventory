import path from "path";
import { execSync } from 'child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync, chmodSync, rmdirSync, copyFileSync } from 'fs';

const directory = path.join(path.resolve(), '../');

export const saveFile = async (folder: string, filename: string, src: string) => {
    const splitFolder = folder.split('/').filter(f => { return f});

    let tmpFolder = `${directory}`;
    splitFolder.forEach(split => {
        tmpFolder += `/${split}`;

        if(!existsSync(tmpFolder)) mkdirSync(tmpFolder, 0o777);
    })

    tmpFolder += `/${filename}`;
    writeFileSync(tmpFolder, src, 'base64');

    return tmpFolder.replace(directory, '');
}

export const getFile = async (filepath: string) => {
    const tmpFolder = `${directory}${filepath}`.replace(/\/\//g, '/');

    try {
        return readFileSync(tmpFolder)
    } catch(err) {
        return null
    }
}

export const getParentDirectory = () => {
    return path.join(directory, '../')
}

export const setFSEnvironment = async(data: any) => {
    const location = '/.fsenv';

    let environment: any = {};

    try {
        let tmp: any = readFileSync(location).toString().split('\n');

        environment = tmp.reduce((accum: any, value: any, index: number) => {
            let splitVal = value.split('=');

            accum[splitVal[0].trim()] = splitVal[1].trim();

            return accum
        }, {})
    } catch(err) {}

    let keys = Object.keys(data);

    keys.forEach(key => {
        environment[key.toUpperCase()] = data[key]
    })

    let fsKeys = Object.keys(environment);
    let newEnvriment = '';
    fsKeys.forEach(key => {
        newEnvriment +=`${key}=${environment[key]}\n`
    })

    writeFileSync(location, newEnvriment);
    chmodSync(location, 0o777);
}

export const setGitlabCreds = async(user: string, token: string) => {
    const location = `${getParentDirectory()}/.git/config`;
    const cloneFolder = `/home/clonefsims`;

    if (existsSync(cloneFolder)) {
        try {
            execSync(`rm -rf ${cloneFolder}`)
        } catch(errDelete) {
            execSync(`sudo rm -rf ${cloneFolder}`)
        }
    }

    mkdirSync(cloneFolder, 0o777);

    try {
        let copyConfig = readFileSync(`${location}_copy`).toString()
        if(!copyConfig) copyFileSync(location, `${location}_copy`)  
    } catch(errCopy) {
        copyFileSync(location, `${location}_copy`)
    }

    let config: string[] = [];
    try {
        config = readFileSync(location).toString().split('\n');

        let mainSplit = `url = https://`;
        let lastSplit = `gitlab.com/`;
        let findIndex = config.findIndex((f: string) => { return f.includes(mainSplit)});

        if(findIndex > -1) {
            let splitIndex = config[findIndex].split(mainSplit);
            let splitLast = splitIndex[1].split(lastSplit);
            
            config[findIndex] = `${splitIndex[0]}${mainSplit}${encodeURIComponent(user)}:${encodeURIComponent(token)}@${lastSplit}${splitLast[1]}`
        }

        let cloneURL = config[findIndex].split('url =')[1].trim();

        try {
            try {
                execSync(`git clone ${cloneURL} ${cloneFolder}`);
            } catch(errExec) {
                execSync(`sudo git clone ${cloneURL} ${cloneFolder}`);
            }

            let readme = readFileSync(`${cloneFolder}/README.md`).toString();

            if(!readme) return null

            try {
                execSync(`rm -rf ${cloneFolder}`)
            } catch(errDelete) {
                execSync(`sudo rm -rf ${cloneFolder}`)
            }
        } catch(errFetch) {
            return null
        }
        
        writeFileSync(location, config.join('\n'));
        return true;
    } catch(err) {
        return null;
    }
}