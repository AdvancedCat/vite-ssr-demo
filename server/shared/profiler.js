import { EventEmitter } from "events";
import { performance, PerformanceObserver } from 'perf_hooks';
export default class Profiler extends EventEmitter {
    
}

// 初始化监听器逻辑，用于性能监控
const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        console.log(
            '[performance]',
            entry.name,
            entry.duration.toFixed(2),
            'ms'
        );
    });
    performance.clearMarks();
});
perfObserver.observe({ entryTypes: ['measure'] });