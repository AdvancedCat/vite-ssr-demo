import { useState } from 'react';
import { animated, useSprings, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import styles from './Deck.module.css';

const cards = [
    '//img14.360buyimg.com/mobilecms/s360x360_jfs/t1/118103/1/40095/116412/64acc5c6F6d4f9341/afad3d8fb564359b.jpg!q70.dpg.webp',
    '//img14.360buyimg.com/mobilecms/s360x360_jfs/t1/185496/4/34796/82590/64b27804F630b5c0d/22fbad340365822b.jpg!q70.dpg.webp',
    '//img14.360buyimg.com/mobilecms/s360x360_jfs/t1/170764/27/38003/147531/64a7d6acFe16d1c5f/14c46180bf45b343.png.webp',
    '//img14.360buyimg.com/mobilecms/s360x360_jfs/t1/125183/17/37492/54212/64a54078F32b290a2/546c557dbd4978a6.jpg!q70.dpg.webp',
    '//img14.360buyimg.com/mobilecms/s360x360_jfs/t1/121985/23/37177/124186/64a23886F25bb7547/84781ed2694fa424.png.webp',
];

const to = (i: number) => ({
    x: 0,
    y: i * -4,
    scale: 1,
    rot: -10 + Math.random() * 20,
    delay: i * 100,
});
const from = (_: number) => ({ x: 0, rot: 0, scale: 0.5, y: -1000 });
const trans = (r: number, s: number) =>
    `perspective(1500px) rotateX(30deg) rotateY(${
        r / 10
    }deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
    const [gone] = useState(() => new Set());
    const [props, api] = useSprings(cards.length, (i) => ({
        ...to(i),
        from: from(i),
    }));
    const bind = useDrag(
        ({
            args: [index],
            down,
            movement: [mx],
            direction: [xDir],
            velocity,
        }) => {
            const [xVel] = velocity;
            const trigger = xVel > 0.2;
            const dir = xDir < 0 ? -1 : 1;
            if (!down && trigger) gone.add(index);
            api.start((i) => {
                if (index !== i) return;
                const isGone = gone.has(index);
                const x = isGone
                    ? (200 + window.innerWidth) * dir
                    : down
                    ? mx
                    : 0;
                const rot = mx / 100 + (isGone ? dir * 10 * xVel : 0);
                const scale = down ? 1.1 : 1;
                return {
                    x,
                    rot,
                    scale,
                    delay: undefined,
                    config: {
                        friction: 50,
                        tension: down ? 800 : isGone ? 200 : 500,
                    },
                };
            });

            if (!down && gone.size === cards.length) {
                setTimeout(() => {
                    gone.clear();
                    api.start((i) => to(i));
                }, 600);
            }
        }
    );

    return (
        <>
            {props.map(({ x, y, rot, scale }, i) => {
                return (
                    <animated.div
                        className={styles.deck}
                        key={i}
                        style={{ x, y }}
                    >
                        <animated.div
                            {...bind(i)}
                            style={{
                                transform: interpolate([rot, scale], trans),
                                backgroundImage: `url(${cards[i]})`,
                            }}
                        ></animated.div>
                    </animated.div>
                );
            })}
        </>
    );
}

function App() {
    return (
        <div className={styles.container}>
            <Deck />
        </div>
    );
}

export default App;
