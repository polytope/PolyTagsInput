export class PolyTagsInput {
    private tags: string[];
    private onValueChangedCallback: (value: string[]) => void = (_) => {};
    private onTypeaheadCallback: (suggestions: string[] | null) => void = (_) => {};
    private distinct = false;
    private typeaheads: string[] = [];

    public readonly element: HTMLInputElement;

    public strict = false;

    public set setDistinct(value: boolean) {
        this.distinct = value;
        this.onValueChangedCallback(this.value);
    }

    public set onValueChanged(callback: (value: string[]) => void) {
        this.onValueChangedCallback = callback
    }

    public set typeahead(callback: (suggestions: string[] | null) => void ) {
        this.onTypeaheadCallback = callback;
    }

    public get size() {
        return this.value.length;
    }

    public get value() {
        let ret = [... this.tags];

        if (this.distinct) {
            ret = ret.filter((tag, index, self) => {
                return index === self.indexOf(tag);
            })
        }

        return ret
    }

    constructor(element: HTMLInputElement) {
        this.element = element;
        this.tags = [];
        this.element.addEventListener("keydown", this.onKeyDown.bind(this))
        this.element.oninput = this.checkForTypeaheads.bind(this)
    }

    public add(... tags: string[]): void {
        if (this.strict) {
           this.strictAdd(tags);
        } else {
           this.normalAdd(tags);
        }
        this.onTypeaheadCallback(null);
        this.onValueChangedCallback(this.value)
    }

    public remove(index: number): void {
        if (index < 0 || index + 1 > this.tags.length) {
            return;
        }
        this.tags.splice(index, 1)
        this.onValueChangedCallback(this.value)
    }

    public setTypeaheads(... typeahead: string[]): void {
        this.typeaheads = typeahead;
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault()
            const value = this.element.value;
            this.element.value = ''
            this.add(value)
        } else if (event.key === 'Backspace' && this.element.value.length === 0) {
            event.preventDefault()
            this.remove(this.size - 1)
        }
    }

    private checkForTypeaheads() {
        const val = this.element.value;
        const matches = this.typeaheads.filter(suggestion => suggestion.toLowerCase().startsWith(val.toLowerCase()));
        if (val.length > 0 && matches.length > 0) {
            this.onTypeaheadCallback(matches);
        } else {
            this.onTypeaheadCallback(null);
        }
    }

    private strictAdd(tags: string[]): void {
        tags.forEach(tag => {
           if (this.typeaheads.indexOf(tag) > -1) {
               this.add(tag)
           }
        });
    }

    private normalAdd(tags: string[]) {
        this.tags.push(...tags);
    }
}
