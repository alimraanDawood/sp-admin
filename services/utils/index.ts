import Pocketbase from 'pocketbase';

const pb = new Pocketbase("https://sports-palace.pockethost.io");


export function getFileUrl(record : any, url : string, options : any) {
    return pb.files.getUrl(record, url, options);
}