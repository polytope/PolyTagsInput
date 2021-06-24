# PolyTagsInput

A simple Javascript package for creating tags-input fields. 
This package contains only the behaviour of a tags-input field, all UI/UX is up to you to create.

![Example of a Tags Input](https://i.imgur.com/ORVaon0.gif)

## Install
```npm
npm install @polytope/poly-tags-input
```

## Usage
```typescript
const field = document.querySelector<HTMLInputElement>('#textField')!
const wrapper = document.querySelector<HTMLDivElement>('#wrapper')!

const tagLine = new PolyTagsInput(field)
tagLine.add('Polytope', 'Tagable', 'InputField');
tagLine.onValueChanged = setTags;

setTags(tagLine.value)

function setTags(tags: string[]): void {
    while (wrapper.lastChild != fieldWrapper) {
        wrapper.removeChild(wrapper.lastChild!!)
    }
    tags.forEach((tag: string, index: number) => {
        const aTag = document.createElement('span');
        const text = document.createElement('span')
        text.innerText = tag
        const button = document.createElement('button')
        button.innerText = "x"
        button.onclick = () => tagLine.remove(index);
        aTag.append(text, button)
        wrapper.appendChild(aTag);
    })
}
```

For more in-depth example go to [the example project on github repository](https://github.com/polytope/PolyTagsInput/tree/master/example)

## API
| Command | Type | Description |
| --- | --- | --- |
| <code>element: HTMLInputElement</code> | GETTER | The HTML Input Element that the instance is attached to. |
| <code>size: number</code> | GETTER | Get the number of tags currently added. This respect settings of both distinct and strict. |
| <code>value: string[]</code> | GETTER | Return the current added tags. It respects the settings of both distinct and strict. |
| <code>onValueChanged = (value: string[]) => void</code> | SETTER | The callback function the library should call when any changes to the value of the input field has been made. |
| <code>onSuggestions = (suggestions: string[] &#124; null) => void</code> | SETTER | The callback function the library should call with the suggestions for the inputted value. The callback can receive two types of values: string[]: When there are matching suggestions, the callback will be invoked with an array of the matching suggestions. null: When there are no matching suggestions, the callback will be invoked with a null value. |
| <code>strict = true &#124; false</code> | SETTER | Set whether the Tag-Input should be strict or not. Default is non-strict. One can switch between strict and non-strict without any data-loss. When strict is enabled, only tags from the suggestions array can be added.  When strict is disabled, all free-text tags are allowed. |
| <code>distinct = true &#124; false</code> | SETTER | Set whether the Tag-Input should be distinct or not. Default is non-distinct. The Tag-Input will behave as a Set if set to distinct. One can switch between distinct and non-distinct without any data-loss. When distinct is enabled, any tag can only be part of the value once. When distinct is disabled, tags can be repeated in the value. |
| <code>suggestions = string[]</code> | SETTER | Set the array of suggestions to search within. |
| <code>add(... tags; string[]): void</code> | METHOD | Add one or more tags to the input. This can be used to specify pre-defined tags or to programmatically add a tag. Use in the form <code>add('tag1', 'tag2', ... 'tagN')</code> or <code>add(... arrayOfTags)</code> |
| <code>remove(index: number): void</code> | METHOD | Remove a tag on a specific index. |
