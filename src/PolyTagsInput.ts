export default class PolyTagsInput {
  private tags: string[];

  private onValueChangedCallback: (value: string[]) => void = () => null;

  private onTypeaheadCallback: (suggestions: string[] | null) => void = () => null;

  private distinctFlag = false;

  private typeaheads: string[] = [];

  private strictFlag = false;

  public readonly element: HTMLInputElement;

  public set strict(value: boolean) {
    this.strictFlag = value;
    this.onValueChangedCallback(this.value);
  }

  public set distinct(value: boolean) {
    this.distinctFlag = value;
    this.onValueChangedCallback(this.value);
  }

  public set onValueChanged(callback: (value: string[]) => void) {
    this.onValueChangedCallback = callback;
  }

  public set typeahead(callback: (suggestions: string[] | null) => void) {
    this.onTypeaheadCallback = callback;
  }

  public get size(): number {
    return this.value.length;
  }

  public get value(): string[] {
    let ret = [...this.tags];

    if (this.distinctFlag) {
      ret = ret.filter((tag, index, self) => index === self.indexOf(tag));
    }

    if (this.strictFlag) {
      ret = ret.filter((tag: string) => this.typeaheads.indexOf(tag) > -1);
    }

    return ret;
  }

  constructor(element: HTMLInputElement) {
    this.element = element;
    this.tags = [];
    this.element.addEventListener('keydown', this.onKeyDown.bind(this));
    this.element.oninput = this.checkForTypeaheads.bind(this);
  }

  public add(...tags: string[]): void {
    this.tags.push(...tags);
    this.onTypeaheadCallback(null);
    this.onValueChangedCallback(this.value);
  }

  public remove(index: number): void {
    if (index < 0 || index + 1 > this.tags.length) {
      return;
    }
    this.tags.splice(index, 1);
    this.onValueChangedCallback(this.value);
  }

  public setTypeaheads(...typeahead: string[]): void {
    this.typeaheads = typeahead;
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const { value } = this.element;
      this.element.value = '';
      this.add(value);
    } else if (event.key === 'Backspace' && this.element.value.length === 0) {
      event.preventDefault();
      this.remove(this.size - 1);
    }
  }

  private checkForTypeaheads() {
    const val = this.element.value;
    const matches = this.typeaheads.filter(
      (suggestion) => suggestion.toLowerCase().startsWith(val.toLowerCase()),
    );
    if (val.length > 0 && matches.length > 0) {
      this.onTypeaheadCallback(matches);
    } else {
      this.onTypeaheadCallback(null);
    }
  }
}
