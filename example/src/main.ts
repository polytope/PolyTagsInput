import './style.css'
import {PolyTagsInput} from "../../dist/PolyTagsInput";

const field = document.querySelector<HTMLInputElement>('#textField')!
const wrapper = document.querySelector<HTMLUListElement>('#wrapper')!


const tagLine = new PolyTagsInput(field)
tagLine.add('Polytope', 'Tagable', 'InputField');
tagLine.onValueChanged = setTags;

setTags(tagLine.value)

function setTags(tags: string[]): void {
    while (wrapper.lastChild != field) {
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

