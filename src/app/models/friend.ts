export class Friend {
    public name: string;
    public id: number;
    public invited: Boolean;
    public picture: string;
    public preferences: Array<Object>

    constructor() {
        this.name = null;
        this.id = null;
        this.invited = false;
        this.picture = null;
        this.preferences = [];
    }
}