import styles from '../index.module.scss';
import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd';

export interface ICard {
    id: string
    name: string
}

export default function TplCard({ id, name }: ICard) {
    const [{ opacity }, dragRef, dragPreview] = useDrag(
        () => ({
            type: 'card',
            item: { id, name },
            collect: (monitor: DragSourceMonitor) => {
                return { opacity: monitor.isDragging() ? 0.5 : 1 };
            },
            end(item, monitor){
                console.log('拖拽结束', item);
            },
            canDrag(monitor) {
                return id !== 'tpl_2'
            },
        })
    );

    return (
        <div
            className={styles.view_tpl_card}
            ref={dragRef}
            style={{ opacity }}
        >
            <DragPreviewImage src="//m11.360buyimg.com/babel/s165x165_jfs/t1/98338/19/32332/15952/64b2c368Fba633c6e/45d3da36a4f433bf.jpg!q70.dpg" connect={dragPreview} />
            <div className={styles.tpl_card}>{id}</div>
            <div>{name}</div>
        </div>
    );
}
