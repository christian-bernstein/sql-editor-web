import {RecipeSession} from "./RecipeSession";
import {Recipe} from "./Recipe";
import {UnitOfMeasure} from "./UnitOfMeasure";
import {Unit} from "./Unit";
import {Filter} from "./pages/Filter";

export const filter: <T>(filter: Filter<T>) => Filter<T> = (filter) => {
    return filter;
}

export class EpicureAPI {

    get filters(): Array<Filter<any>> {
        return this._filters;
    }

    private static instance?: EpicureAPI = undefined;

    private _filters: Array<Filter<any>> = new Array<Filter<any>>();

    public static api(supplier?: () => EpicureAPI): EpicureAPI {
        if (EpicureAPI.instance === undefined) {
            if (supplier === undefined) {
                throw new Error("API & supplier are undefined, cannot create an api instance");
            } else {
                EpicureAPI.instance = supplier();
            }
        }
        return EpicureAPI.instance;
    }

    constructor() {
        this.re.forEach(recipe => this.saveRecipe(recipe));
    }

    public toSessionKey(id: string): string {
        return `epicure-session-${id}`;
    }

    public addFilter(filter: Filter<any>): EpicureAPI {
        const filtered = this._filters.filter(f => f.id === filter.id);
        if (filtered.length > 0) {
            this._filters.splice(this._filters.indexOf(filtered[0], 1));
        }
        this._filters.push(filter);
        return this;
    }

    public removeFilter(id: string): EpicureAPI {
        const filtered = this._filters.filter(f => f.id === id);
        if (filtered.length > 0) {
            this._filters.splice(this._filters.indexOf(filtered[0], 1));
        }
        return this;
    }

    public getFilter<T>(id: string): Filter<T> {
        const filtered = this._filters.filter(f => f.id === id);
        let filter = undefined
        if (filtered.length > 0) {
            filter = filtered[0];
        }
        return filter as Filter<T>;
    }

    public updateFilter<T>(id: string, operator: (filter: Filter<T>) => Filter<T>) {
        operator(this.getFilter(id))
    }

    public loadFilteredRecipes(): Array<Recipe> {
        return this.loadAllRecipes().filter(recipe => {
            let show = true;
            this._filters.forEach(filter => {
                if (!filter.filter(recipe, filter, this)) {
                    show = false;
                }
            });
            return show;
        });
    }

    public loadRecipeSession(id: string): RecipeSession {
        const key = this.toSessionKey(id);
        const item = window.localStorage.getItem(key);
        if (item === null) {
            let session: RecipeSession | undefined;
            session = {
                currentStep: 0,
                ingredientChecked: []
            };
            this.saveRecipeSession(key, session);
            return session;
        } else {
            return JSON.parse(item);
        }
    }

    public saveRecipeSession(id: string, session: RecipeSession) {
        window.localStorage.setItem(this.toSessionKey(id), JSON.stringify(session));
    }

    public removeRecipeSession(id: string) {
        window.localStorage.removeItem(this.toSessionKey(id))
    }

    public isIngredientChecked(ingredient: string, ingredientChecked: Array<{ name: string, checked: boolean }>): boolean {
        let checked = false;
        ingredientChecked.forEach(value => {
            if (ingredient === value.name) {
                checked = value.checked;
            }
        });
        return checked;
    }

    public setIngredientChecked(ingredient: string, checked: boolean, ingredientChecked: Array<{ name: string, checked: boolean }>): Array<{ name: string, checked: boolean }> {
        let updated = false;
        ingredientChecked.forEach(value => {
            if (ingredient === value.name) {
                value.checked = checked;
                updated = true;
            }
        });
        if (!updated) {
            ingredientChecked.push({
                name: ingredient,
                checked: checked
            });
        }
        return ingredientChecked;
    }

    public saveRecipe(recipe: Recipe) {
        const recipes = this.loadAllRecipes();

        let exist = false;
        recipes.forEach(rec => {
            if (rec.id === recipe.id) {
                exist = true;
            }
        });

        if (exist) {
            return;
        }

        recipes.push(recipe);
        const stringify = JSON.stringify(recipes);
        window.localStorage.setItem("epicure-recipes", stringify);
    }

    public loadAllRecipes(): Array<Recipe> {
        const item = window.localStorage.getItem("epicure-recipes");
        if (item === null) {
            return [];
        } else {
            return JSON.parse(item);
        }
    }

    public deleteRecipe(id: string) {

        const recipes = this.loadAllRecipes();
        let index = -1;
        recipes.forEach((recipe, i) => {
            if (recipe.id === id) {
                index = i;
            }
        });
        if (index !== -1) {
            recipes.splice(index, 1);
        }
        const stringify = JSON.stringify(recipes);
        window.localStorage.setItem("epicure-recipes", stringify);
    }

    private re = [
        {
            id: "id-1",
            steps: [
                {
                    title: "Sauce vorbereiten",
                    text: "Zwiebeln schälen und fein würfeln. Butter erhitzen. Zwiebeln darin glasig dünsten. Zucker darüberstreuen und hell karamelisieren lassen. Curry darüberstäuben und anschwitzen. Tomaten zufügen, Brühe angießen. Aufkochen und unter mehrmaligem Rühren offen ca. 20 Minuten köcheln.",
                    optional: false
                },
                {
                    title: "Schnitzen kochen",
                    text: "Zu jeder guten Currywurst gehört auch ein Schnitzel!",
                    optional: true
                }
            ],
            title: "Currywurst",
            description: "Allein schon die Aussicht, stets eine Currywurst zur Hand zu haben, hellt die Stimmung der meisten Menschen beträchtlich auf",
            comment: "",
            kcal: 340,
            cookingTimeInMin: 120,
            categories: ["Fastfood", "Fleisch"],
            ingredients: [
                {name: "Zwiebel", unit: UnitOfMeasure.amount(2)},
                {name: "Butter", unit: new UnitOfMeasure(2, Unit.EL)},
                {name: "Brauner Zucker", unit: new UnitOfMeasure(1, Unit.EL)},
                {name: "Curry", unit: new UnitOfMeasure(4, Unit.EL)},
                {name: "Stückige Tomaten in Dose", unit: UnitOfMeasure.amount(2)},
                {name: "Gemüsebrühe", unit: new UnitOfMeasure(.15, Unit.LITER)},
                {name: "kleine Gewürzgurken", unit: UnitOfMeasure.amount(4)},
                {name: "Tomatenketchup", unit: UnitOfMeasure.gram(400)},
                {name: "Apfelessig", unit: new UnitOfMeasure(4, Unit.EL)},
                {name: "Salz", unit: UnitOfMeasure.amount(1)},
                {name: "Öl", unit: new UnitOfMeasure(4, Unit.EL)},
                {name: "Currywurst", unit: UnitOfMeasure.amount(12)},
            ]
        },
        {
            id: "id-2",
            steps: [
                {
                    title: "Hähnchenbrust kochen und Gemüse vorbereiten",
                    text: "Den Ingwer schälen und in Scheiben schneiden. In 2 Liter kochendes Wasser geben und dabei etwas salzen. Das Hähnchenbrustfilet auch zugeben und eine gute halbe Std. (je nach Größe des Fleisches) gar köcheln lassen.\n\nWährenddessen die Zwiebel schälen und klein hacken. Die Tomaten schälen und in kleine Würfel schneiden. Die Sojasprossen etwas zerkleinern. Die Karotten schälen und in Stifte schneiden. Die Mu-Err-Pilze in lauwarmem Wasser einlegen und quellen lassen, dabei mehrmals das Wasser wechseln.",
                    optional: false
                },
                {
                    title: "Hähnchenbrust aus Sud holen",
                    text: "Wenn dass Hähnchenbrustfilet fertig ist, aus dem Sud nehmen und auf einem Brett mit einer Gabel \"zerreißen\", also in kleine Stücke zerteilen (so klein wie möglich). Den Ingwer nun auch aus dem Sud entfernen.",
                    optional: false
                },
                {
                    title: "Im Wok kochen",
                    text: "In einem Wok (eine normale Pfanne geht auch) Öl erhitzen und die Zwiebeln darin anschwitzen. Dann die Sojasprossen und anschließend die Tomatenwürfel zugeben. Den Ketchup oder etwas Tomatenmark hinzu geben. Evtl. etwas Wasser beigeben, falls die Masse zu dick wird. Nun die Chilischoten oder Sambal Oelek (je nach gewünschter Schärfe zwischen 1 bis 2 TL – nachwürzen kann man immer noch) dazu geben und salzen. Die Masse etwas köcheln lassen und dann in den Ingwersud geben.\n\nNun das Fleisch, die Karottenstifte, die zerkleinerten Mu-Err Pilze und die Bambussprossen mit in die Brühe geben. Mit Sojasauce gut würzen. Den Essig und den Zucker auch zufügen. Es muss ein guter süß-sauer Geschmack entstehen - wer es intensiver will, muss noch mehr Essig und Zucker zugeben.",
                    optional: false
                },
                {
                    title: "Speisestärke, Ei & abschmecken",
                    text: "Die Speisestärke mit etwas Wasser anrühren. Die Suppe noch einmal aufkochen lassen und mit der Stärke abbinden. In einer Schale nun die Eier verquirlen und unter ständigem Rühren in die Suppe geben, dadurch entsteht der weiße Eierflaum. Am Schluss noch mit Sesamöl abschmecken - aber nicht mehr als 1 TL davon, da das Sesamöl einen starken Eigengeschmack hat.",
                    optional: false
                },
                {
                    title: "Garnieren & anrichten",
                    text: "Die Suppe in kleinen Schälchen mit etwas Frühlingszwiebeln garniert servieren. ![](https://img.chefkoch-cdn.de/rezepte/1038391208936958/bilder/863554/crop-960x640/pekingsuppe.jpg)",
                    optional: true
                }
            ],
            title: "Pekingsuppe",
            description: "Allein schon die Aussicht, stets eine Currywurst zur Hand zu haben, hellt die Stimmung der meisten Menschen beträchtlich auf",
            comment: "",
            kcal: 340,
            cookingTimeInMin: 120,
            categories: ["Fastfood", "Fleisch"],
            ingredients: [
                {name: "Zwiebel", unit: UnitOfMeasure.amount(2)},
                {name: "Butter", unit: new UnitOfMeasure(2, Unit.EL)},
                {name: "Brauner Zucker", unit: new UnitOfMeasure(1, Unit.EL)},
                {name: "Curry", unit: new UnitOfMeasure(4, Unit.EL)},
                {name: "Stückige Tomaten in Dose", unit: UnitOfMeasure.amount(2)},
                {name: "Gemüsebrühe", unit: new UnitOfMeasure(.15, Unit.LITER)},
                {name: "kleine Gewürzgurken", unit: UnitOfMeasure.amount(4)},
                {name: "Tomatenketchup", unit: UnitOfMeasure.gram(400)},
                {name: "Apfelessig", unit: new UnitOfMeasure(4, Unit.EL)},
                {name: "Salz", unit: UnitOfMeasure.amount(1)},
                {name: "Öl", unit: new UnitOfMeasure(4, Unit.EL)},
                {name: "Currywurst", unit: UnitOfMeasure.amount(12)},
            ]
        }
    ];
}
