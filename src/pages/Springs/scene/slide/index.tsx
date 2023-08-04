import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import styles from './index.module.scss';

const left = {
    bg: `linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)`,
    justifySelf: 'end',
};
const right = {
    bg: `linear-gradient(120deg, #96fbc4 0%, #f9f586 100%)`,
    justifySelf: 'start',
};

export default function Slide() {
    const [{ x, bg, scale, justifySelf }, api] = useSpring(() => ({
        x: 0,
        scale: 1,
        ...left,
    }));
    const bind = useDrag(({ active, movement: [x] }) => {
        debugger
        api.start({
            x: active ? x : 0,
            scale: active ? 1.1 : 1,
            ...(x < 0 ? left : right),
            immediate: (name) => active && name === 'x',
        });
    });

    const avSize = x.to({
        map: Math.abs,
        range: [30, 300],
        output: [0.5, 1],
        extrapolate: 'clamp',
    });

    return (
        <div className={styles.container}>
            <animated.div
                {...bind()}
                className={styles.item}
                style={{ background: bg }}
            >
                <animated.div
                    className={styles.av}
                    style={{ scale: avSize, justifySelf }}
                ></animated.div>
                <animated.div className={styles.fg} style={{ x, scale }}>
                    Slide.
                </animated.div>
            </animated.div>
        </div>
    );
}

