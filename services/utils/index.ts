import Pocketbase from 'pocketbase';

const pb = new Pocketbase("https://skether.pockethost.io");


export function getFileUrl(record : any, url : string, options : any) {
    return pb.files.getUrl(record, url, options);
}