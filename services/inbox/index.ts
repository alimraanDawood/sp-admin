import Pocketbase from 'pocketbase';
import { useServerUrl } from '@/composables/server';


class InboxManager {
    constructor(private pocketbase : Pocketbase) {
        this.pocketbase = pocketbase;
    }

    async getInboxMessages() {
        try {
            const results = await this.pocketbase.collection('messages').getList(1, 30, { sort: '-created' });

            return results.items;
        } catch(e) {
            throw(e);
        }
    }

    async deleteInboxMessage(messageId : string) {
        return await this.pocketbase.collection('messages').delete(messageId);
    }

    async subscribeToMessageChange(callback : (message : any) => void) {
        this.pocketbase.collection('messages').subscribe('*', (message : any) => {
            callback(message);
        });
    }
}

const pb = new Pocketbase(useServerUrl());
export const inboxManager = new InboxManager(pb);