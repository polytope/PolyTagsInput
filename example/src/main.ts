import './style.css'
import PolyTagsInput from "../../dist";

const field = document.querySelector<HTMLInputElement>('#textField')!
const fieldWrapper = document.querySelector<HTMLInputElement>('#textFieldWrapper')!
const wrapper = document.querySelector<HTMLDivElement>('#wrapper')!
const typeAheadBox = document.querySelector<HTMLDivElement>('#typeahead')!;

const tagLine = new PolyTagsInput(field)
tagLine.add('Polytope', 'Tagable', 'InputField');
tagLine.suggestions = ['Polytope', 'PolyTag', 'Tagable', 'InputField'];
tagLine.onValueChanged = setTags;
tagLine.onSuggestions = onSuggestions;
tagLine.distinct = false;
tagLine.strict = false;

setTags(tagLine.value)

let currentHoveredSelection: number | null = null;

field.addEventListener('keydown', (e: KeyboardEvent) => {
    if (typeAheadBox.classList.contains('hidden')) return;

    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
       handleTypeaheadNavigation(e);
    }

})

function onSuggestions(suggestions: string[] | null) {
    console.log(suggestions)
    if (suggestions == null) {
        removeSuggestions()
    } else {
        showSuggestions(suggestions);
    }
}

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

function removeSuggestions() {
    typeAheadBox.classList.add('hidden');
    typeAheadBox.innerHTML = '';
    currentHoveredSelection = null;
}

function showSuggestions(suggestions: string[]) {
    typeAheadBox.innerHTML = '';
    typeAheadBox.classList.remove('hidden')
    suggestions.forEach(suggestion => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('suggestion')
        newDiv.onclick = () => {
            tagLine.add(suggestion);
            field.value = '';
            removeSuggestions();
        }
        newDiv.innerText = suggestion;
        typeAheadBox.appendChild(newDiv);
    })
}

function handleTypeaheadNavigation(e: KeyboardEvent) {
    e.preventDefault()

    currentHoveredSelection = setCurrentHoveredIndex(e.key);

    removeTypeaheadHoverState();
    selectTypeaheadSelection(currentHoveredSelection);
}

function setCurrentHoveredIndex(key: string): number {
    let currentIndex = currentHoveredSelection;
    if (currentIndex != null) {
        if (key == 'ArrowUp') {
            currentIndex--;
        } else if (key == 'ArrowDown') {
            currentIndex++;
        }
    } else {
        currentIndex = 0;
    }

    currentIndex = ensureWrapAround(currentIndex);

    return currentIndex;
}

function ensureWrapAround(currentIndex: number): number {
    if (currentIndex + 1 > typeAheadBox.children.length) {
        return 0;
    } else if (currentIndex < 0) {
        return typeAheadBox.children.length - 1
    } else {
        return currentIndex;
    }
}

function removeTypeaheadHoverState() {
    Array.from(typeAheadBox.children).forEach(child => child.classList.remove('hover'))
}

function selectTypeaheadSelection(currentHoveredSelection: number) {
    const item = typeAheadBox.children.item(currentHoveredSelection)!;
    item.classList.add('hover')
    field.value = item.innerHTML;
}