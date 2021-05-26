export class PolyTagsInput {
    private tags: string[];
    private onValueChangedCallback: (value: string[]) => void = (_) => {};


    public readonly element: HTMLInputElement;

    public set onValueChanged(callback: (value: string[]) => void) {
        this.onValueChangedCallback = callback
    }

    public get size() {
        return this.tags.length;
    }

    public get value() {
        return [... this.tags]
    }

    constructor(element: HTMLInputElement) {
        this.element = element;
        this.tags = [];
    }

    public add(... tags: string[]): void {
        this.tags.push(...tags);
        this.onValueChangedCallback(this.value)
    }

    public remove(index: number): void {
        if (index < 0 || index + 1 > this.tags.length) {
            return;
        }
        this.tags.splice(index, 1)
        this.onValueChangedCallback(this.value)
    }
}
