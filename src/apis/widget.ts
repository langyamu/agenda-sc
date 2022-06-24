import { querySQL } from '.';

export { getWidgetDom, getWidgetDomData, getWidgetBlockData };

// | DOMStringMap = isDev()
// ? JSON.parse(import.meta.env.VITE_WIDGET_DATASET)
// : window.frameElement?.parentElement?.parentElement?.dataset || {};

function getWidgetDom() {
    return window.frameElement?.parentElement?.parentElement || null;
}

function getWidgetDomData():
    | {
          nodeId: string;
          type: string;
          subtype: string;
          nodeIndex?: string;
      }
    | DOMStringMap {
    return window.frameElement?.parentElement?.parentElement?.dataset || {};
}

async function getWidgetBlockData(nodeId: string) {
    return await querySQL(`SELECT * FROM blocks WHERE id = '${nodeId}'`);
}
