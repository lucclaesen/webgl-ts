import ko = require("knockout");

export default class GlControlsViewModel {

    private x: KnockoutObservable<number> = ko.observable(0);
    private y: KnockoutObservable<number> = ko.observable(0);
    private angle: KnockoutObservable<number> = ko.observable(0);

    constructor(){
    }

    public onChanged(changed: (x, y, angle)=>void): void {
        this.x.subscribe(_ => changed(this.x(), this.y(), this.angle()));
        this.y.subscribe(_ => changed(this.x(), this.y(), this.angle()));
        this.angle.subscribe(_ => changed(this.x(), this.y(), this.angle()));
    }
}