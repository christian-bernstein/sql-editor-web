export class FormDataHub {

    private data: Array<{key: string, value: any}> = new Array<{key: string; value: any}>();

    private readonly id: string;

    constructor(id: string) {
        this.id = id;
    }

    private key(): string {
        return `fdh-${this.id}`;
    }

    public saveToLocalStore(): FormDataHub {
        window.localStorage.setItem(this.key(), JSON.stringify(this.data));
        return this;
    }

    public loadFromLocalStore(): FormDataHub {
        const item = window.localStorage.getItem(this.key());
        if (item === null) {
            this.data = new Array<{key: string; value: any}>();
        } else {
            this.data = JSON.parse(item);
        }
        return this;
    }

    public set(key: string, value: any, save: boolean = false) {

        let updated = false;
        this.data.forEach((kv) => {
            if (kv.key === key) {
                kv.value = value;
                updated = true;
            }
        });
        if (!updated) {
            this.data.push({
                key: key,
                value: value
            });
        }
        if (save) {
            this.saveToLocalStore();
        }
    }

    public get(key: string, def?: any): any {
        const filtered = this.data.filter(kv => kv.key === key);

        console.log("get", key, "result", filtered);

        if (filtered.length === 0) {
            return def;
        } else {
            return filtered[0].value;
        }
    }

    // TODO: merge with .get()
    public getOrSave(key: string, def?: any): any {
        const filtered = this.data.filter(kv => kv.key === key);
        if (filtered.length === 0) {
            // No data found, save data
            this.set(key, def, true);
            return def;
        } else {
            return filtered[0].value;
        }
    }
}
