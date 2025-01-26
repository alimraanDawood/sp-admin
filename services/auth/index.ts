import Pocketbase from 'pocketbase';

const pocketbase  = new Pocketbase("https://sports-palace.pockethost.io");

export async function signUp(options : any) {
    try {
        const user = await pocketbase.collection('Admins').create(options);

        return user;
    } catch(e) {
        throw(e);
    }
}

export async function signIn(email: string, password: string) {
    try {
        const authData = await pocketbase.collection('Admins').authWithPassword(email, password);

        return authData;
    } catch(e) {
        throw(e);
    }
}

export async function signUpWithGoogle() {
    try {
        const authData = await pocketbase.collection('Admins').authWithOAuth2({ provider: 'google' });

        return authData;
    } catch(e) {
        throw(e);
    }
}