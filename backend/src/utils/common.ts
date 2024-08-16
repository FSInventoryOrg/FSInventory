import path from "path";
import { execSync } from 'child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync, chmodSync, copyFileSync } from 'fs';
import AssetCounter from "../models/asset-counter.schema";
import Asset from "../models/asset.schema";
import Notification, { NotificationType } from "../models/notification.schema";
import User from "../models/user.schema";
import mongoose from "mongoose";
import OTPTransaction from "../models/otptransactions.schema";
import bcrypt from 'bcryptjs'
import Option from "../models/options.schema";
import excel from 'exceljs'

const directory = path.join(path.resolve(), '../');

export const saveFile = async (folder: string, filename: string, src: any, fullDirectory?: boolean) => {
    const splitFolder = folder.split('/').filter(f => { return f });

    let tmpFolder = `${directory}`;
    splitFolder.forEach(split => {
        tmpFolder += `/${split}`;

        if (!existsSync(tmpFolder)) mkdirSync(tmpFolder, 0o777);
    })

    tmpFolder += `/${filename}`;
    if(src instanceof String) writeFileSync(tmpFolder, `${src}`, 'base64');
    else writeFileSync(tmpFolder, src);

    chmodSync(tmpFolder, 0o777)

    return fullDirectory ? tmpFolder.replace(/\/\//g,'/') : tmpFolder.replace(directory, '');
}

export const getFile = async (filepath: string) => {
    const tmpFolder = `${directory}${filepath}`.replace(/\/\//g, '/');

    try {
        return readFileSync(tmpFolder)
    } catch (err) {
        return null
    }
}

export const getParentDirectory = () => {
    return path.join(directory, '../')
}

export const setFSEnvironment = async (data: any) => {
    const location = '/.fsenv';

    let environment: any = {};

    try {
        let tmp: any = readFileSync(location).toString().split('\n');

        environment = tmp.reduce((accum: any, value: any, index: number) => {
            let splitVal = value.split('=');

            accum[splitVal[0].trim()] = splitVal[1].trim();

            return accum
        }, {})
    } catch (err) { }

    let keys = Object.keys(data);

    keys.forEach(key => {
        environment[key.toUpperCase()] = data[key]
    })

    let fsKeys = Object.keys(environment);
    let newEnvriment = '';
    fsKeys.forEach(key => {
        newEnvriment += `${key}=${environment[key]}\n`
    })

    writeFileSync(location, newEnvriment);
    chmodSync(location, 0o777);
}

export const setGitlabCreds = async (user: string, token: string) => {
    const location = `${getParentDirectory()}/.git/config`;
    const cloneFolder = `/home/clonefsims`;

    if (existsSync(cloneFolder)) {
        try {
            execSync(`rm -rf ${cloneFolder}`)
        } catch (errDelete) {
            execSync(`sudo rm -rf ${cloneFolder}`)
        }
    }

    mkdirSync(cloneFolder, 0o777);

    try {
        let copyConfig = readFileSync(`${location}_copy`).toString()
        if (!copyConfig) copyFileSync(location, `${location}_copy`)
    } catch (errCopy) {
        copyFileSync(location, `${location}_copy`)
    }

    let config: string[] = [];
    try {
        config = readFileSync(location).toString().split('\n');

        let mainSplit = `url = https://`;
        let lastSplit = `gitlab.com/`;
        let findIndex = config.findIndex((f: string) => { return f.includes(mainSplit) });

        if (findIndex > -1) {
            let splitIndex = config[findIndex].split(mainSplit);
            let splitLast = splitIndex[1].split(lastSplit);

            config[findIndex] = `${splitIndex[0]}${mainSplit}${encodeURIComponent(user)}:${encodeURIComponent(token)}@${lastSplit}${splitLast[1]}`
        }

        let cloneURL = config[findIndex].split('url =')[1].trim();

        try {
            try {
                execSync(`git clone ${cloneURL} ${cloneFolder}`);
            } catch (errExec) {
                execSync(`sudo git clone ${cloneURL} ${cloneFolder}`);
            }

            let readme = readFileSync(`${cloneFolder}/README.md`).toString();

            if (!readme) return null

            try {
                execSync(`rm -rf ${cloneFolder}`)
            } catch (errDelete) {
                execSync(`sudo rm -rf ${cloneFolder}`)
            }
        } catch (errFetch) {
            return null
        }

        writeFileSync(location, config.join('\n'));
        return true;
    } catch (err) {
        return null;
    }
}

export const auditAssets = async () => {
    const assetIndex = await AssetCounter.find({});
    const adminUsers = await User.find({ role: 'ADMIN' });
    const optionsTrack: any = await Option.findOne({});

    let tracks = [];

    if (optionsTrack) tracks = optionsTrack['status'] ? optionsTrack['status'].filter((f: any) => f['tracked']).map((f: any) => f['value']) : []

    const assetStatueses = tracks.length > 0 ? tracks : ["Shelved", "IT Storage", "ITS Storage", ""];
    const categories = assetIndex.map(f => { return f['category'] }).filter(f => { return f })

    if (!categories) return;

    const assets = await Asset.aggregate().match({
        $expr: {
            $and: [
                { $eq: ['$type', 'Hardware'] },
                { $in: ['$category', categories] },
                { $in: ['$status', assetStatueses] }
            ]
        }
    }).group({
        _id: {
            category: '$category',
            type: '$type'
        },
        count: { $sum: 1 }
    })

    const admins = adminUsers.map(f => { return f._id.toString() });

    assetIndex.forEach(async (value) => {
        const findIndex = assets.find((f: any) => { return f._id.category === value['category'] && f._id.type === value['type'] });

        if (findIndex) {
            let newValue = {
                totalCount: findIndex['count'],
                status: findIndex['count'] < value['threshold'] ? 'Depleting' : 'In Stock'
            }

            let notifValue: any = {
                url: '/settings/assetcontrol',
                openTab: false,
                message: `Asset ${value['type']} - ${value['category']} is ${newValue['status']}`,
                target_users: admins,
                uniqueLabel: `AssetCounter-${value['_id']}`
            };

            if (newValue['status'] === 'Depleting') {
                notifValue['message_html'] = `<p>Asset <strong>${value['type']} - ${value['category']}</strong> is <strong style="color: red">${newValue['status']}</strong></p>`,
                notifValue['updated'] = new Date();
                notifValue['seen_users'] = [];
                notifValue['countType'] = 'Remaining';
                notifValue['table'] =  'assetcounters';
                notifValue['query'] =  { prefixCode: value['prefixCode'] }

                await triggerNotif(notifValue);
            } else if (newValue['status'] === 'In Stock' && value['status'] === 'Depleting') {
                notifValue['message_html'] = `<p>Asset <strong>${value['type']} - ${value['category']}</strong> is <strong style="color: green">${newValue['status']}</strong></p>`
                notifValue['seen_users'] = admins;
                notifValue['countType'] = '';
                notifValue['table'] =  '';
                notifValue['query'] =  {}
                
                await triggerNotif(notifValue)
            }

            await AssetCounter.updateOne({ _id: value['_id'] }, newValue)
        }
    })
}

export const triggerNotif = async (data: NotificationType) => {
    if (!data['uniqueLabel']) return
    if (!data['url']) {
        data['url'] = '#';
        data['openTab'] = false;
    }
    await Notification.updateMany({ uniqueLabel: data['uniqueLabel'] }, data, { upsert: true })
}

export const deleteNotif = async (uniqueLabel: string) => {
    if (!uniqueLabel) return
    await Notification.deleteMany({ uniqueLabel: uniqueLabel })
}

export const generateOTP = async (email: string, purpose: string, code?: string) => {
    const MSExpiration = 600000;
    const newID = new mongoose.Types.ObjectId();
    const codeToUse = code ? code : newID;

    const newOTPTransDoc = {
        _id: newID,
        email: email,
        expirationDate: new Date(new Date().getTime() + MSExpiration),
        purpose: purpose,
        otp: codeToUse.toString(),
        status: "NOT TAKEN"
    }

    const newOTPTransaction = new OTPTransaction(newOTPTransDoc);
    await newOTPTransaction.save();

    return {
        otp: codeToUse.toString(),
        expiration: newOTPTransDoc.expirationDate
    }
}

export const generateRandom6Digits = () => { return Math.floor(100000 + Math.random() * 900000).toString() }

export const generateHash = async (value: string) => {
    return await bcrypt.hash(value, 8)
}

export const compareHash = async (hashed: string, unhashed: string) => {
    return await bcrypt.compare(unhashed, hashed)
}

export const fetchExternalSource = async (url: string, headers: any) => {
    return await new Promise((resolve, reject) => {
        fetch(url, headers).then(response => response.json()).then(data => resolve(data)).catch(err => reject())
    })
}

export const createExcelTable = async (source: any, reportTemplate: any) => {
    return await new Promise((resolve, reject) => {
        try {
            const viewDetails = reportTemplate;

            const filename: any = viewDetails['filename'];
            const base_font: any = viewDetails['font'];
            const base_fill: any = viewDetails['fill'];
            const header_font: any = viewDetails['header_font'];
            const header_fill: any = viewDetails['header_fill'];
            const creator: any = viewDetails['creator'];
            const columnDef: any = viewDetails['columnDef']

            let Workbook = new excel.Workbook()
            Workbook.title = filename;
            Workbook.creator = `${creator}`;
            Workbook.lastModifiedBy = `${creator}`;
            Workbook.created = new Date();
            Workbook.modified = new Date();
            Workbook.lastPrinted = new Date();
            Workbook.calcProperties.fullCalcOnLoad = true;
            Workbook.addWorksheet(filename);

            const Worksheet: any = Workbook.getWorksheet(filename);
            Worksheet.views = [
                {
                    state: 'frozen',
                    ySplit: 1
                }
            ]
            Worksheet.autoFilter = {
                from: {
                    row: 1,
                    column: 1
                },
                to: {
                    row: 1,
                    column: columnDef.length
                }
            }
            Worksheet.columns = columnDef.map((f: any) => { return f['definition'] })

            const orderHeader = columnDef.map((f: any) => { return f['definition'] }).map((f: any) => { return f['key'] });

            source.forEach((data: any) => {
                let values: any = [];

                orderHeader.forEach((key: any) => { values.push(data[key] ? data[key] : '') })

                Worksheet.addRow(values)
            })

            Worksheet.columns.forEach((col: any, colIndex: number) => {
                const header = col.key

                const settings: any = columnDef[colIndex]['settings']
                const type = settings.type;
                const format = settings.format;
                const width = settings.width;
                const fill = settings.fill;
                const font = settings.font;

                let maxColumnWidth = 10;

                col.font = font ? font : base_font;
                col.fill = fill ? fill : base_fill;

                col.eachCell((cell: any, i: number) => {
                    if (i === 1) {
                        cell.font = header_font
                        cell.fill = header_fill

                        if (format) Worksheet.getColumn(header).numFmt = format
                    } else {
                        if (type === 'date' && cell.value) cell.value = new Date(cell.value)
                        else if (type === 'number') cell.value = +cell.value
                    }

                    cell.style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                    if (!width) {
                        if (cell.value) maxColumnWidth = cell.value.toString().length > maxColumnWidth ? cell.value.toString().length : maxColumnWidth
                    } else maxColumnWidth = width
                })

                col.width = maxColumnWidth + 5;
            })

            Workbook.xlsx.writeBuffer().then((buffer: any) => {
                resolve(buffer)
            })
        } catch (err) {
            reject(null)
        }
    })
}