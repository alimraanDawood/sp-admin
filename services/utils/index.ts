import Pocketbase from 'pocketbase';

export const SERVER_URL = "https://skether.pockethost.io"
const pb = new Pocketbase(SERVER_URL);


export function getFileUrl(record : any, url : string, options : any) {
    return pb.files.getUrl(record, url, options);
}
