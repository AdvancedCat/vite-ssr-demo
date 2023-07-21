import { create } from 'zustand';
import { State, initialState } from './initialState';

/**
 * Action 可分为 「原子action」 与 「复合action」
 * 原子action 仅能操作一个state 或 有关联关系的一组state，但尽量保持最小集合化
 * 复合action 则调用若干个 原子action
 *
 * 如果要深层次更新state，则应使用 immer
 */
interface Actions {
    /* 复合 action */
    /* 原子 action */
    toggleVisible: (visible: boolean) => void;
}

export type Store = State & Actions;

export const useStore = create<Store>((set, get) => ({
    ...initialState,
    /* 复合 action */
    /* 原子 action */
    toggleVisible: (visible: boolean) => {
        set({ visible });
    },
}));
