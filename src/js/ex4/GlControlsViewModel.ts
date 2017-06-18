import ko = require("knockout");

export default class GlControlsViewModel {

    private x: KnockoutObservable<number> = ko.observable(0);
    private y: KnockoutObservable<number> = ko.observable(0);
    constructor(){
      
    }

    public subscribe(onPositionChanged: (x, y)=>void): void {
        this.x.subscribe(_ => onPositionChanged(this.x(), this.y()));
        this.y.subscribe(_ => onPositionChanged(this.x(), this.y()));
    }
}