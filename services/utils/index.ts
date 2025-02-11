import Pocketbase from 'pocketbase';
import { useServerUrl } from '@/composables/server';

const pb = new Pocketbase(useServerUrl());


export function getFileUrl(record : any, url : string, options : any) {
    return pb.files.getUrl(record, url, options);
}
