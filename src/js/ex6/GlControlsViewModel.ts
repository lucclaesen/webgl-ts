import ko = require("knockout");

export default class GlControlsViewModel {

    private x: KnockoutObservable<number> = ko.observable(0);
    private y: KnockoutObservable<number> = ko.observable(0);
    private angle: KnockoutObservable<number> = ko.observable(0);
    private sx: KnockoutObservable<number> = ko.observable(100);
    private sy: KnockoutObservable<number> = ko.observable(100);

    constructor(){
    }

    public onChanged(changed: (x, y, angle, sx, sy)=>void): void {
        const callback = _ => changed(this.x()/100, this.y()/100, this.angle(), this.sx() / 100, this.sy() / 100);
        this.x.subscribe(callback);
        this.y.subscribe(callback);
        this.angle.subscribe(callback);
        this.sx.subscribe(callback);
        this.sy.subscribe(callback);
    }
}