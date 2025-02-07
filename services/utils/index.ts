import Pocketbase from 'pocketbase';

const pb = new Pocketbase("http://localhost:8090");


export function getFileUrl(record : any, url : string, options : any) {
    return pb.files.getUrl(record, url, options);
}