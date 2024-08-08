import { MongoClient } from "mongodb";
import Hardware from "../models/hardware.schema";
import Option from "../models/options.schema";
import OAuth from "../models/oauth.schema";

export const rotateLogs = async () => {
    const conn = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING as string);
    const db = conn.db('admin');
    await db.admin().command({ logRotate: 1 });
    conn.close();

    console.log('System logs has been rotated');
    setTimeout(() => { rotateLogs() }, 3600000)
}

export const convertStatusToStorage = async () => {
    const statusToChange = ['ITS Storage']

    await Hardware.updateMany({ status: { $in: statusToChange } }, { status: 'IT Storage' })
}

export const convertStatusToUnaccounted = async () => {
    const statusToChange = ['', ' ']

    await Hardware.updateMany({ status: { $in: statusToChange } }, { status: 'Unaccounted' })
}

export const setDefaults = async () => {
    const optionStatus = ['IT Storage', 'Shelved'];
    const options: any = await Option.findOne({});
    const updateStatus = options['status'].reduce((accum: any[], value: any, index: number) => {
        if (optionStatus.includes(value.value)) value.tracked = true;
        accum.push(value)
        return accum;
    }, [])
    await Option.updateOne({ _id: options['_id'] }, { status: updateStatus })

    const newCreds: any = {
        "created": "2024-08-02T12:05:49.192Z",
        "createdBy": "Reynand Hingcayog",
        "updated":"2024-08-02T12:05:49.192Z",
        "updatedBy": "Reynand Hingcayog",
        "clientID": "1000.L6RTKSI39I26CYYC165MV9GZI6NRRP",
        "clientSecret": "92679d735a7c47d06bd443776a1759d066ecb922af",
        "url": "http://192.168.50.220:3000/",
        "scopes": [
            "aaaserver.profile.READ"
        ],
        "__v": 0
    }

    const findOAuth = await OAuth.findOne({url: newCreds.url})

    if(!findOAuth) {
        const newOAuth = new OAuth(newCreds);
        await newOAuth.save();
    }
}