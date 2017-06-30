import ko = require("knockout");

class GlControlsViewModel {

    private x: KnockoutObservable<number> = ko.observable(0);
    private y: KnockoutObservable<number> = ko.observable(0);
    private z: KnockoutObservable<number> = ko.observable(0);
    private ax: KnockoutObservable<number> = ko.observable(0);
    private ay: KnockoutObservable<number> = ko.observable(0);
    private az: KnockoutObservable<number> = ko.observable(0);
    private sx: KnockoutObservable<number> = ko.observable(100);
    private sy: KnockoutObservable<number> = ko.observable(100);
    private sz: KnockoutObservable<number> = ko.observable(100);

    /**
     * Creates a new view model for GL controls
     * @param dim The dimensions controlled by the controls ui. z and phi are hidden when dim == 2.
     */
    constructor(private dim: number = 2){
    }

    public onChanged(changed: (GlControlsChangedEvent)=>void): void {
        const callback = _ => changed({
            x: this.x()/100, 
            y: this.y()/100,
            z: this.z()/100, 
            ax: this.ax(),
            ay: this.ay(),
            az: this.az(), 
            sx: this.sx() / 100, 
            sy: this.sy() / 100,
            sz: this.sz() / 100
        });
        this.x.subscribe(callback);
        this.y.subscribe(callback);
        if (this.dim == 3) this.z.subscribe(callback);
        if (this.dim == 3) this.ax.subscribe(callback);
        if (this.dim == 3) this.ay.subscribe(callback);
        this.az.subscribe(callback);
        this.sx.subscribe(callback);
        this.sy.subscribe(callback);
        if (this.dim == 3) this.sz.subscribe(callback);
    }
}

/**
 * The state of the controls after the change in at least one of its props.
 */
interface GlControlsChangedEvent {
    x: number;
    y: number;
    z: number;
    ax: number;
    ay: number;
    az: number;
    sx: number;
    sy: number;
    sz: number
}

export {GlControlsViewModel, GlControlsChangedEvent};