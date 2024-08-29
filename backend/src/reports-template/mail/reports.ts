import Handlebars from 'handlebars';
import Asset from '../../models/asset.schema';
import AssetCounter from '../../models/asset-counter.schema';
import Option from '../../models/options.schema';
import AutoMail from '../../models/automail.schema';
import { getFile } from '../../utils/common';

export const inventoryReportHtml = async (mailMeta?: any) => {
  const templatePath = `/src/reports-template/mail/report.hbs`
  const templateContent = await getFile(templatePath);
  const template = Handlebars.compile(templateContent?.toString());

  let option = await Option.findOne();
  const statuses = option?.get('status').map((status) => status.value) || [];
  const categories =
    option?.get('category').map((category) => category.value) || [];

  const hardwareAssets: any = {};
  for (const category of categories) {
    const data = await Asset.aggregate()
      .match({
        type: 'Hardware',
        category: category,
      })
      .group({
        _id: '$status',
        count: {
          $count: {},
        },
      });

    hardwareAssets[category] = data.reduce((acc, obj) => {
      acc[obj._id] = obj.count;
      return acc;
    }, {});

    // Total per Category
    let sum = 0;
    for (const status of statuses) {
      if (!hardwareAssets[category][status])
        hardwareAssets[category][status] = 0;
      sum += hardwareAssets[category][status];
    }
    hardwareAssets[category]['Total'] = sum;
  }

  // Total per Status
  for (const status of [...statuses, 'Total']) {
    if (!hardwareAssets['Total per Status'])
      hardwareAssets['Total per Status'] = {};
    let sum = 0;
    for (const category of categories) {
      sum += hardwareAssets[category][status];
    }
    hardwareAssets['Total per Status'][status] = sum;
  }

  const autoMailSettings = await AutoMail.findOne();
  let filter = {};
  let limit = 5;
  if (autoMailSettings?.lastRollOut) {
    filter = {
      created: {
        $gt: new Date(autoMailSettings.lastRollOut),
      },
    };
    limit = 0;
  }

  // Get latest assets
  const latestAssets = (
    await Asset.find(filter).sort({ created: -1 }).limit(limit)
  ).map((asset) => {
    const temp = asset.toObject();
    return {
      ...temp,
      date: new Date(temp.created).toLocaleDateString(),
      time: new Date(temp.created).toLocaleTimeString(),
    };
  });

  const assetCounters = (
    await AssetCounter.find({
      status: 'Depleting',
    })
  ).map((asset) => asset.toObject());

  let data = {
    statuses,
    categories,
    hardwareAssets,
    latestAssets,
    assetCounters,
    contact: mailMeta?.contact || 'admin@fullscale.ph',
  };

  const htmlMessage = template(data);

  return htmlMessage.toString();
};
