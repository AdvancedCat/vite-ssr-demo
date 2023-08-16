import {
    useCallback,
    useState,
    useRef,
} from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { produce } from 'immer';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import styles from './index.module.scss';
import TplCard from './components/TplCard';
import ViewportCard from './components/ViewportCard';
import { useWhyDidYouUpdate } from 'ahooks';

import type { ICard } from './components/TplCard';

type TplListItem = { id: string; name: string };

export default function EditorPage() {
    
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.main}>
                <LeftPanel key="left-panel"></LeftPanel>
                <ViewportWrap key="viewport-wrap"></ViewportWrap>
            </div>
        </DndProvider>
    );
}

function LeftPanel() {
    const data = useLoaderData() as { tplList: TplListItem[] };
    
    return (
        <div className={styles.leftpanel}>
            {data.tplList.map((item) => {
                return <TplCard {...item} key={item.id}></TplCard>;
            })}
        </div>
    );
}

function ViewportWrap() {
    return (
        <div className={styles.viewport_wrap}>
            <Viewport></Viewport>
        </div>
    );
}

function Viewport() {
    const domRef = useRef<HTMLDivElement>(null);
    const [cards, setCards] = useState<ICard[]>([]);

    // console.log(cards.map((card) => card.id).join(','));
    // console.log(cards)
    // useWhyDidYouUpdate('Viewport', cards)

    const [, dropRef] = useDrop(() => {
        return {
            accept: 'card',
            drop(item: ICard) {
                console.log('我收到啦', item);
                setCards((state) => [...state, item]);
            },
        };
    }, []);
    dropRef(domRef);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        setCards((prevCards) => {
            return produce(prevCards, (draft) => {
                const dragItem = draft[dragIndex];
                const hoverItem = draft[hoverIndex];
                draft[dragIndex] = hoverItem;
                draft[hoverIndex] = dragItem;
            });
        });
    }, []);

    const renderCard = useCallback((card: ICard, index: number) => {
        return (
            <ViewportCard
                key={card.id}
                {...card}
                index={index}
                moveCard={moveCard}
            ></ViewportCard>
        );
    }, []);

    return (
        <div className={styles.viewport} ref={domRef}>
            {cards.map((card, i) => renderCard(card, i))}
        </div>
    );
}

export const route = {
    path: '/editor',
    async loader() {
        const tplList = Array(40)
            .fill(0)
            .map((_, index) => ({
                id: `tpl_${index}`,
                name: `模板${index}`,
            }));
        return json({ tplList });
    },
    element: <EditorPage></EditorPage>,
};
