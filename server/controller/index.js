import Scene from './Scene.js';

export async function registerController(app) {
    const controller = app.controller = app.controller || {};

    // 各个 controller 
    controller.scene = await new Scene(app).init();

    return controller;
}
