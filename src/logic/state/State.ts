export const cs: <T extends object>(obj: T) => State<T> = state => {
    return new State(state);
}

export class State<T extends object> {

    private readonly listeners: ((state: T) => void)[] = [];

    private _state: T;

    constructor(state: T) {
        this._state = state;
    }

    public setState(state: Partial<T>) {
        this._state = {
            ...this._state,
            ...state
        };
        this.listeners.forEach(value => {
            try {
                value(this._state);
            } catch (e) {
                console.log(e);
            }
        })
    }

    public on(handler: (state: T) => void) {
        this.listeners.push(handler);
    }

    get state(): T {
        return this._state;
    }
}
