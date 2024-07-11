import path from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';

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