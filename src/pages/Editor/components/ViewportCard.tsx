import { useEffect, useLayoutEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useWhyDidYouUpdate } from 'ahooks';


const ItemType = 'viewport_card';

export default function ViewportCard({ id, name, index, moveCard }: any) {
    // useWhyDidYouUpdate(`ViewportCard ${id}`, {id, name, index})

    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, dropRef] = useDrop(() => {
        return {
            accept: ItemType,
            collect(monitor) {
                return {
                    handlerId: monitor.getHandlerId(),
                };
            },
            hover(item: any, monitor) {
                if (!ref.current) {
                    return;
                }
                const dragIndex = item.index;
                const hoverIndex = index;
                if (dragIndex === hoverIndex) {
                    return;
                }
                const hoverBoundingRect = ref.current?.getBoundingClientRect();
                const hoverMiddleY =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const clientOffset = monitor.getClientOffset() as { y: number };
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return;
                }
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return;
                }
                moveCard(dragIndex, hoverIndex);
                item.index = hoverIndex;
            },
        };
    }, [index]);

    const [{ isDragging }, dragRef] = useDrag(() => {
        return {
            type: ItemType,
            item: { id, name, index },
            collect(monitor) {
                return {
                    isDragging: monitor.isDragging(),
                };
            },
        };
    }, [index]);

    dragRef(dropRef(ref));

    return (
        <div
            ref={ref}
            style={{
                height: '100px',
                border: '2px solid lightcyan',
                opacity: isDragging ? 0 : 1,
                cursor: 'move',
                marginBottom: '5px',
            }}
            data-handler-id={handlerId}
        >
            {name}
        </div>
    );
}
