import Asset, { AssetType } from '../models/asset.schema';
import { HardwareType } from '../models/hardware.schema';
import { SoftwareType } from '../models/software.schema';
import Option from '../models/options.schema';

export const startChangeStream = async () => {
  try {
    const changeStream = Asset.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', async (change) => {
      if (change.operationType === 'insert' || change.operationType === 'update') {
        const newAsset = change.fullDocument;
        console.log('New Asset Added:', newAsset);
        await updateOptions(newAsset)
      }
    });

    console.log('Listening for changes to Assets collection...');
  } catch (error) {
    console.error('Error starting change stream:', error);
  }
};

async function updateOptions(asset: AssetType | HardwareType | SoftwareType) {
  try {
    let option = await Option.findOne();
    if (!option) {
      option = new Option({});
    }

    if (asset.type === 'Hardware') {
      const hardwareAsset = asset as HardwareType;

      // Update category
      if (hardwareAsset.category) {
        const existingCategory = option.category.find((category) => category.value === hardwareAsset.category);
        if (!existingCategory) {
          option.category.push({ value: hardwareAsset.category }); // Add the new category with empty properties
        }
      }

      // Update equipmentType
      if (hardwareAsset.equipmentType) {
        option.equipmentType = Array.from(new Set([...option.equipmentType, hardwareAsset.equipmentType]));
      }

      // Update status
      if (hardwareAsset.status) {
        const existingStatus = option.status.find((status) => status.value === hardwareAsset.status);
        if (!existingStatus) {
          option.status.push({ value: hardwareAsset.status }); // Add the new status with empty color
        }
      }
    }
    
    // Save the unique values
    await option.save();
    console.log("Options updated successfully")
  } catch (error) {
    console.error('Error updating Options document:', error);
  }
}
