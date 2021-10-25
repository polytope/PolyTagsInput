export default class PolyTagsInput {
  private tags: string[];

  private onValueChangedCallback: (value: string[]) => void = () => null;

  private onSuggestionsCallback: (suggestions: string[] | null) => void = () => null;

  private distinctFlag = false;

  private suggestionsArray: string[] = [];

  private strictFlag = false;

  /**
   * The HTML Input Element that the instance is attached to.
   */
  public readonly element: HTMLInputElement;

  /**
   * Set whether the Tag-Input should be strict or not. Default is non-strict.
   * One can switch between strict and non-strict without any data-loss.
   *  - When strict is enabled, only tags from the suggestions array can be added.
   *  - When strict is disabled, all free-text tags are allowed.
   * @param value boolean value for strict-mode, true for enable, false for disable
   */
  public set strict(value: boolean) {
    this.strictFlag = value;
    this.onValueChangedCallback(this.value);
  }

  /**
   * Set whether the Tag-Input should be distinct or not. Default is non-distinct.
   * The Tag-Input will behave as a Set if set to distinct.
   * One can switch between distinct and non-distinct without any data-loss.
   *  - When distinct is enabled, any tag can only be part of the value once.
   *  - When distinct is disabled, tags can be repeated in the value.
   * @param value boolean value for distinct-mode, true for enable, false for disable
   */
  public set distinct(value: boolean) {
    this.distinctFlag = value;
    this.onValueChangedCallback(this.value);
  }

  /**
   * The callback function the library should call when any changes to the value of the input field has been made.
   *
   * @param callback - (v: string[]) => void: The callback that will be called on every change to the value.
   */
  public set onValueChanged(callback: (value: string[]) => void) {
    this.onValueChangedCallback = callback;
  }

  /**
   * The callback function the library should call with the suggestions for the inputted value.
   * The callback can receive two types of values:
   *  - string[]: When there are matching suggestions, the callback will be invoked with an array of
   *  the matching suggestions.
   *  - null: When there are no matching suggestions, the callback will be invoked with a null value.
   * @param callback - (v: string[]) => void: The callback that will be called on every change to the value.
   */
  public set onSuggestions(callback: (suggestions: string[] | null) => void) {
    this.onSuggestionsCallback = callback;
  }

  /**
   * Set the array of suggestions to search within.
   * @param suggestions - The array of strings to search within
   */
  public set suggestions(suggestions: string[]) {
    this.suggestionsArray = suggestions;
  }

  /**
   * Get the number of tags currently added.
   * This respect settings of both distinct and strict.
   */
  public get size(): number {
    return this.value.length;
  }

  /**
   * Return the current added tags.
   * It respects the settings of both distinct and strict.
   */
  public get value(): string[] {
    let ret = [...this.tags];

    if (this.distinctFlag) {
      ret = ret.filter((tag, index, self) => index === self.indexOf(tag));
    }

    if (this.strictFlag) {
      ret = ret.filter((tag: string) => this.suggestionsArray.indexOf(tag) > -1);
    }

    return ret;
  }

  constructor(element: HTMLInputElement) {
    this.element = element;
    this.tags = [];
    this.element.addEventListener('keydown', this.onKeyDown.bind(this));
    this.element.oninput = this.checkForSuggestions.bind(this);
  }

  /**
   * Add one or more tags to the input.
   * This can be used to specify pre-defined tags or to programmatically add a tag.
   * @param tags: The list of tags to apply in the form .add('tag1', 'tag2', ... 'tagN') or .add(... arrayOfTags)
   */
  public add(...tags: string[]): void {
    this.tags.push(...tags);
    this.onSuggestionsCallback(null);
    this.onValueChangedCallback(this.value);
  }

  /**
   * Remove a tag on a specific index.
   * @param index: Index of the tag to be removed
   */
  public remove(index: number): void {
    if (index < 0 || index + 1 > this.tags.length) {
      return;
    }
    this.tags.splice(index, 1);
    this.onValueChangedCallback(this.value);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Tab') {
      if (this.element.value === '' || this.element.value == null) {
        return;
      }
      event.preventDefault();
      const { value } = this.element;
      this.element.value = '';
      this.add(value);
    } else if (event.key === 'Backspace' && this.element.value.length === 0) {
      event.preventDefault();
      this.remove(this.size - 1);
    }
  }

  private checkForSuggestions(): void {
    const val = this.element.value;
    const matches = this.suggestionsArray.filter(
      (suggestion) => suggestion.toLowerCase().startsWith(val.toLowerCase()),
    );
    if (val.length > 0 && matches.length > 0) {
      this.onSuggestionsCallback(matches);
    } else {
      this.onSuggestionsCallback(null);
    }
  }
}
