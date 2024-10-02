import { MongoClient } from "mongodb";
import Hardware from "../models/hardware.schema";
import Option from "../models/options.schema";
import OAuth from "../models/oauth.schema";
import Notification, { NotificationType } from "../models/notification.schema";
import User from "../models/user.schema";
import Employee from "../models/employee.schema";
import Software from "../models/software.schema";
import { triggerNotif } from "../utils/common";
import { renewAutoMailingActivation } from "./automail";
import { getVersion } from "./version";

const LICENSE_TYPES: string[] = [
    'Subscription',
    'Single-User (Named User)',
    'Multi-User (Site)',
    'OEM',
  ]

export const rotateLogs = async () => {
	const conn = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING as string);
	const db = conn.db('admin');
	await db.admin().command({ logRotate: 1 });
	conn.close();

	console.log('System logs has been rotated');
	setTimeout(() => { rotateLogs() }, 3600000)
}

export const convertStatusToStorage = async () => {
	const statusToChange = ['ITS Storage', 'Shelved']

	await Hardware.updateMany({ status: { $in: statusToChange } }, { status: 'IT Storage' })
}

export const convertStatusToUnaccounted = async () => {
	const statusToChange = ['', ' ']

	await Hardware.updateMany({ status: { $in: statusToChange } }, { status: 'Unaccounted' })
}

export const setDefaults = async () => {
    /**
	 * Notification options
	 * - added handlers for empty database
	 * */
	const optionStatus = ['IT Storage', 'Shelved'];
    const options: any = await Option.findOne({});
    if (options) {
      const updateStatus = options['status'].reduce(
        (accum: any[], value: any, index: number) => {
          if (optionStatus.includes(value.value)) value.tracked = true;
          accum.push(value);
  
          return accum;
        },
        []
      );
  
      const licenseType = options.licenseType?.length
        ? options.licenseType
        : LICENSE_TYPES;
      // If there is an existing default category, migrate it to hardwareCategory
      let defaults = options.defaults;
      if (defaults?.category) {
        defaults.hardwareCategory = defaults.category;
        defaults.category = undefined;
      }
  
      const updatedCategories = options['category'].reduce(
        (accum: any[], category: any) => {
          if (category?.type !== 'Software') {
            category.type = 'Hardware';
          }
          accum.push(category);
          return accum;
        },
        []
      );
      await Option.updateOne(
        { _id: options['_id'] },
        {
          status: updateStatus,
          category: updatedCategories,
          licenseType,
          defaults,
        }
      );
    }
  
    const newCreds: any = {
      created: '2024-08-02T12:05:49.192Z',
      createdBy: 'Reynand Hingcayog',
      updated: '2024-08-02T12:05:49.192Z',
      updatedBy: 'Reynand Hingcayog',
      clientID: '1000.L6RTKSI39I26CYYC165MV9GZI6NRRP',
      clientSecret: '92679d735a7c47d06bd443776a1759d066ecb922af',
      url: 'http://192.168.50.220:3000/',
      scopes: ['aaaserver.profile.READ'],
      __v: 0,
    };
  
    const findOAuth = await OAuth.findOne({ url: newCreds.url });
  
    if (!findOAuth) {
      const newOAuth = new OAuth(newCreds);
      await newOAuth.save();
    }
  };

export const softwareExpirationMonitoring = async () => {
	const repeatTime = 86400000; // 24-hour repeatation
	const bufferTime = 604800000; // 7-day buffer

	const bufferedDate = new Date(new Date().getTime() + bufferTime);
	const dateNow = new Date();

	const adminUsers = await User.find({ role: 'ADMIN' });
	const admins = adminUsers.map(f => { return f._id.toString() });
	const employees = await Employee.aggregate().match({});

	let notifRecords = await Notification.aggregate().match({
		$expr: {
			$and: [
				{
					$eq: ['$table', 'assets']
				}
			]
		}
	}).project({
		uniqueLabel: 1,
		_id: 0
	});

	notifRecords = notifRecords.map(d => d['uniqueLabel'])

    const assets = await Software.aggregate().match({
        $expr: {
            $and: [
                {
                    $lt: ['$licenseExpirationDate', bufferedDate]
                },
                {
                    $eq: ['$type', 'Software']
                },
                {
                    $not: [
                        {
                            $in: ['$status', ['Damaged', '', 'Unaccounted']]
                        }
                    ]
                }
            ]
        }
    })

	let notifDocs: any[] = [];

	if (assets.length > 0) {
		notifDocs = assets.reduce((accum: any[], value: any) => {
			let notifValue: any = {
				url: `/inventory?code=${value.code}`,
				openTab: false,
				target_users: admins,
				uniqueLabel: `Assets-${value['_id']}`,
				updated: new Date(),
				countType: 'Days',
				table: 'assets',
				query: { code: value.code }
			};

            const isExpired = dateNow > new Date(value.licenseExpirationDate)

			if (value?.assignee) {
				const findUser = employees.find(f => f['code'] === value.assignee);

				if (findUser) {
					notifValue['target_users'].push(findUser.email);
					value.assignee = `${findUser['firstName']} ${findUser['lastName']}`
				}

                notifValue['message'] = `Software Asset ${value.code} assigned to ${value.assignee} is ${isExpired ? 'expired' : 'expiring soon'}`
                notifValue['message_html'] = `<p>Software Asset <strong>${value.code}</strong> assigned to <strong>${value.assignee}</strong> is ${isExpired ? 'expired' : 'expiring soon'}`
            } else {
                notifValue['message'] = `Software Asset ${value.code} is ${isExpired ? 'expired' : 'expiring soon'}`
                notifValue['message_html'] = `<p>Software Asset <strong>${value.code}</strong> is ${isExpired ? 'expired' : 'expiring soon'}`
            }

			accum.push(notifValue);

			return accum;
		}, [])
	}

	const finalNotifIds = notifDocs.map(f => f['uniqueLabel'])
	const toDeleteNotifs = notifRecords.filter(f => !finalNotifIds.includes(f));

	if (toDeleteNotifs.length > 0) await Notification.deleteMany({ uniqueLabel: { $in: toDeleteNotifs } })
	if (finalNotifIds.length > 0) {
		notifDocs.forEach(async (element) => {
			await triggerNotif(element)
		})
	}

	console.log('Software Expiration Monitoring has been instantiated');
	setTimeout(() => { softwareExpirationMonitoring() }, repeatTime)
}

export const autoMail = async () => {
	await renewAutoMailingActivation()
}

export const removeStatus = async () => {
	const statusToDelete = ['Shelved'];
	let options: any = await Option.aggregate().match({});

	// Just added a handler, it creates an error when the database is empty
	if (options?.length > 0) {
		const option = options[0]
		if (option.status) {
			const idToUsed = option._id
			const stateLength = option.status.length
			delete option._id
	
			option.status = option.status.filter((f: any) => !statusToDelete.includes(f['value']));
	
			if (stateLength !== option.status.length) {
				await Option.updateOne({ _id: idToUsed }, option);
	
				console.log(`Status [${statusToDelete.toString()}] has been removed`)
			}
		}
	}
}

export const getVersions = async () => {
	const versions = await getVersion()

	if (versions) console.log(versions);
	else console.log('Could not display versions')
}