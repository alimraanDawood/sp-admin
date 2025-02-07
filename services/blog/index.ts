import Pocketbase from 'pocketbase';

const pocketbase = new Pocketbase('https://skether.pockethost.io');

export async function getArticlesPreview(page : number, numPerPage : number) {
    try {
        const results = await pocketbase.collection('ArticlesPreview').getList(page, numPerPage);

        return results;
    } catch(e) {
        throw(e);
    }
}

export async function getArticle(articleId : string) {
    try {
        const results = await pocketbase.collection('Articles').getOne(articleId);

        return results;
    } catch(e) {
        throw(e);
    }
}

export async function updateArticle(articleId: string, data: any) {
    try {
        const result = await pocketbase.collection('Articles').update(articleId, data);

        return result;
    } catch(e) {
        throw(e);
    }
}

export async function deleteArticle(articleId: string) {
    try {
        const result = await pocketbase.collection('Articles').delete(articleId);

        return result;
    } catch(e) {
        throw(e);
    }
}

export async function createArticle(data: any) {
    try {
        const result = await pocketbase.collection('Articles').create(data);

        return result;
    } catch(e) {
        throw(e);
    }
}