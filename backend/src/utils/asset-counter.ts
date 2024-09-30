import AssetCounter from "../models/asset-counter.schema"
import Option from "../models/options.schema";

export const getCodeAndIncrement = async(category: string, type: string) => {
    const query = {
        category: category,
        type: type
    };

    const assetCounter: any = await AssetCounter.findOneAndUpdate(query, { $inc: { counter: 1} });

    if(!assetCounter) return null;
    
    return `${assetCounter['prefixCode']}-${assetCounter['counter'] + 1}`;
}

export const getAssetIndexes = async() => {
    const options: any = await Option.findOne();
    const assetCounter: any[] = await AssetCounter.find();

    const categories: any[] = options['category'];
    const possibleIndices = categories.reduce((accum, value, index) => {
        const findCategory = assetCounter.find(f => f['category'] === value['value']);

        if(findCategory) accum.push(findCategory);
        else accum.push({type: value.type as 'Hardware' | 'Software', category: value['value']});

        return accum;
    }, [])

    return possibleIndices;
}