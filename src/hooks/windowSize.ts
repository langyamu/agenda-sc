import { once } from '@/utils';
import { useWindowSize } from '@vueuse/core';

export function useAppSize() {
    const { width, height } = useWindowSize();

    once(() => {
        window.onresize = function () {
            width.value = useWindowSize().width.value;
            height.value = useWindowSize().height.value;
            console.log('width::', width.value);
            console.log('height::', height.value);
        };

        console.log('once--windowSize');
    });

    return {
        width,
        height,
    };
}
