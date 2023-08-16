// 应对后续复杂应用状态膨胀的问题
// initialState.ts：负责 State —— 添加状态类型与初始化状态值；
// createStore.ts：负责书写创建 Store 的方法与 Action 方法；
// selectors.ts：负责 Selector ——派生类选择器逻辑；

export { useStore } from './createStore';
export type { State } from './initialState';
export type { Store } from './createStore';
export * from './selectors';
