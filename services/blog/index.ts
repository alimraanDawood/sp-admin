import Pocketbase from 'pocketbase';
import { useServerUrl } from '@/composables/server';
import CreateAuthor from '~/components/Widgets/Blog/Authors/CreateAuthor/CreateAuthor.vue';

const pocketbase  = new Pocketbase(useServerUrl());

export async function getArticlesPreview(page : number, numPerPage : number, filter : string = '') {
    try {
        const results = await pocketbase.collection('ArticlesPreview').getList(page, numPerPage, { filter: filter, expand: 'categories' });

        return results;
    } catch(e) {
        throw(e);
    }
}

export async function getArticle(articleId : string) {
    try {
        const results = await pocketbase.collection('Articles').getOne(articleId, { expand: 'categories' });

        return results;
    } catch(e) {
        throw(e);
    }
}

export async function updateArticle(articleId: string, data: any) {
    try {
        const result = await pocketbase.collection('Articles').update(articleId, data, { expand: 'categories' });

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

export async function createAuthor(data : any) {
    try {
        const result = await pocketbase.collection('Authors').create(data);

        return result;
    } catch(e) {
        throw(e);
    }
}

export async function getAuthors(page : number, numPerPage : number, filter = '') {
    try {
        const authors = await pocketbase.collection('Authors').getList(page, numPerPage, { filter: filter });

        return authors;
    } catch(e) {
        throw(e);
    }
}

export async function createCategory(data : any) {
    try {
        const result = await pocketbase.collection('ArticleCategories').create(data);

        return result;
    } catch(e) {
        throw(e);
    }
}

export async function getCategories(page : number, numPerPage : number, filter: string = '') {
    try {
        const categories = await pocketbase.collection('ArticleCategories').getList(page, numPerPage, { filter: filter });

        return categories;
    } catch(e) {
        throw(e);
    }
}

export async function getFullCategories() {
    try {
        const categories = await pocketbase.collection('ArticleCategories').getFullList();

        return categories;
    } catch(e) {
        throw(e);
    }
}

export async function getFullAuthors() {
    try {
        const authors = await pocketbase.collection('Authors').getFullList();

        return authors;
    } catch(e) {
        throw(e);
    }
}