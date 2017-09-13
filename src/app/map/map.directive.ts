import {Directive, Output, EventEmitter, OnInit} from '@angular/core';
import {GoogleMapsAPIWrapper} from '@agm/core';

@Directive({
    selector: 'map-extension'
})
export class MapExtension implements OnInit{
    map:any;
    @Output() mapReady = new EventEmitter();
    constructor(private _wrapper: GoogleMapsAPIWrapper) {}

    ngOnInit() {
        this._wrapper.getNativeMap().then((map) => {
            this.mapReady.emit(map);
            this.map = map;
        }, error =>{
            console.log('error', error);
        })
    }

}
