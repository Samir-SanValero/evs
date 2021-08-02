export class EmbryoImage {

    id : number;
    fullName : string;
    zIndex: number;
    digitalizationTimeFromEpoch: number;
    path: string;
    image;
    width: number;
    height: number;
    transformedImage;
//    widthTransformed:number;
//    heightTransformed:number;

    constructor () {}

    static createFromResponse(responseItem) : EmbryoImage {
        var result : EmbryoImage = new EmbryoImage ();
        result.id = responseItem.id;
        result.fullName = responseItem.fullName;
        result.image = responseItem.transformedImage;
        result.width = responseItem.widthTransformed;
        result.height = responseItem.heightTransformed;
        result.digitalizationTimeFromEpoch = responseItem.digitalizationTimeFromEpoch;
        result.zIndex = responseItem.zIndex;
        return result;
    }
}
