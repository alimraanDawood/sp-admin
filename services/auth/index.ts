import Pocketbase from 'pocketbase';

const pocketbase  = new Pocketbase("http://localhost:8090");

export async function signUp(options : any) {
    try {
        const user = await pocketbase.collection('Admins').create(options);

        return user;
    } catch(e) {
        throw(e);
    }
}