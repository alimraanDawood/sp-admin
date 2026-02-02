import Pocketbase from 'pocketbase';
import {getFileUrl, SERVER_URL} from '@/services/utils';

const pocketbase  = new Pocketbase(SERVER_URL);
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZ8owCf90w1haP8VS0lBmwe2P2AClr2hlpYLukEub5HY-G7mp1eGhWW6zw5nVZ05vjxA/exec"

function stripHtml(html, maxLength = 200) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    let text = (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();

    // Truncate if too long
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '... Read more at Ether Aerospace';
    }

    return text;
}

export async function postLinkedInPost(article : any) {

    // Add to Google Sheet
    if(!article) {
        throw new Error("Provide a valid Article!");
    }
    await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: article?.title,
            excerpt: stripHtml(article?.content),
            url: `https://www.etheraerospace.com/blog/${article.id}`,
            thumbnail: article?.cover ? getFileUrl(article, article?.cover, {}) : ''
        })
    });
}

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