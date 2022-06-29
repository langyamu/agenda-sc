import { request } from '@/utils';
export { createDocWithMd, getDoc };
export type { IGetDocRes };

function createDocWithMd(notebookId: string, path: string, markdown = '') {
    return request<string>({
        method: 'post',
        url: '/api/filetree/createDocWithMd',
        data: {
            notebook: notebookId,
            path,
            markdown,
        },
    });
}

interface IGetDocRes {
    blockCount: number;
    box: string;
    content: string; // html str
    eof: boolean;
    id: string;
    parent2ID: string;
    parentID: string;
    path: string;
    rootID: string;
    type: string;
}

/**
 *
 * @param id
 * @param hasContent 是否带上下文
 * @param size
 * @returns
 */
function getDoc(id: string, hasContent = false, key = '', size = 36) {
    return request<IGetDocRes>({
        method: 'post',
        url: '/api/filetree/getDoc',
        data: {
            id,
            k: key,
            mode: hasContent ? 3 : 0,
            size,
        },
    });
}
