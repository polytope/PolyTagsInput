import {PolyTagsInput} from "../src/PolyTagsInput";
import DoneCallback = jest.DoneCallback;

describe('PolyTagsInput', () => {
    let element: HTMLInputElement;
    let polyTag: PolyTagsInput;

    beforeEach(() => {
        element = document.createElement("input")
        polyTag = new PolyTagsInput(element)
    })

    it('should take an html element as input', () => {
        expect(polyTag.element).toBe(element);
    });

    it('should return 0, when asking for size on an empty input', () => {
        expect(polyTag.size).toBe(0)
    })

    it('should allow for adding an tag to the input', () => {
        polyTag.add("Some Tag");

        expect(polyTag.size).toBe(1)
    })

    it('should allow to adding multiple tags for the input', () => {
        polyTag.add("Some Tag", "Some Other Tag")

        expect(polyTag.size).toBe(2)
    });


    it('should return an array of tags when calling value', () => {
        polyTag.add("Some Tag", "Some Other Tag", "Third Tag")

        expect(polyTag.value).toEqual(["Some Tag", "Some Other Tag", "Third Tag"])
    });

    it('should return values as values and not references', () => {
        polyTag.add("Some Tag", "Some Other Tag", "Third Tag")

        expect(polyTag.value).not.toBe(polyTag.value)
        expect(polyTag.value).toEqual(polyTag.value)
    });

    it('should allow for deleting specific index in array', () => {
        polyTag.add("some tag", "some other tag")
        polyTag.remove(1)
        expect(polyTag.value).toEqual(['some tag'])
        polyTag.add('third tag')
        polyTag.remove(0)
        expect(polyTag.value).toEqual(['third tag'])
    });


    it('should do nothing when trying to delete index < 0', () => {
        polyTag.add('tag')
        polyTag.onValueChanged = (_) => {
            fail("Should not emit a new value, since nothing should happen")
        }
        polyTag.remove(-1)
        expect(polyTag.value).toEqual(['tag'])
    });

    it('should do nothing when trying to delete index > length of tags', () => {
        polyTag.add('tag')
        polyTag.onValueChanged = (_) => {
            fail("Should not emit a new value, since nothing should happen")
        }
        polyTag.remove(2)
        expect(polyTag.value).toEqual(['tag'])
    });

    it('should do nothing when trying to delete an index on an empty list of tags', function () {
        polyTag.onValueChanged = (_) => {
            fail("Should not emit a new value, since nothing should happen")
        }
        polyTag.remove(1)
        expect(polyTag.value).toEqual([])
    });

    it('should allow for registering callbacks for listening to changes to the tags array', (done: DoneCallback) => {
        polyTag.onValueChanged = (value: string[]) => {
            expect(value).toEqual(['some tag'])
            done()
        }

        polyTag.add('some tag')
    });


    it('should continue to notify changes on callback', (done: DoneCallback) => {
        let count = 0;
        polyTag.onValueChanged = (value: string[]) => {
            switch (count) {
                case 0:
                    expect(value).toEqual(['some tag'])
                    break;
                case 1:
                    expect(value).toEqual(['some tag', 'Some Other Tag'])
                    break;
                case 2:
                    expect(value).toEqual(['some tag'])
                    break;
                case 3:
                    expect(value).toEqual(['some tag', 'Third Tag'])
                    done()
                    break;
                default:
                    fail()
            }
            count++;
        }

        polyTag.add('some tag')
        polyTag.add('Some Other Tag')
        polyTag.remove(1)
        polyTag.add('Third Tag')
    });

    it('should add content of input field when hitting enter', () => {
        element.value = "some tag typed in field"
        hitEnter(element)
        expect(polyTag.value).toEqual(["some tag typed in field"])
    });

    it('should clear input field after hitting enter', () => {
        element.value = "some tag typed in field"
        hitEnter(element)
        expect(element.value).toBe('')
    })

    it('should add contet of input field when hitting tab', () => {
        element.value = "some tag typed in field using tab"
        hitTab(element)
        expect(polyTag.value).toEqual(["some tag typed in field using tab"])
    })

    it('should clear input field after hitting tab', () => {
        element.value = "some tag typed in field using tab"
        hitTab(element)
        expect(element.value).toBe('')
    })

    it('should delete last item when hitting backspace on empty input field', () => {
        polyTag.add('something', 'something else');

        hitBackspace(element)

        expect(polyTag.value).toEqual(['something'])
    });

    it('should not delete anything if hitting backspace while input field is non empty', () => {
        polyTag.add('something', 'something else');

        element.value = "Hello World!"
        hitBackspace(element)

        expect(polyTag.value).toEqual(['something', 'something else'])
    });

    it('should show typeaheads when typing in input field', (done: DoneCallback) => {
        polyTag.setTypeaheads('John', 'Jane', 'Doe');

        polyTag.typeahead = (suggestions: string[] | null) => {
            expect(suggestions).toEqual(['John', 'Jane'])
            done();
        }
        sendKey(element, 'J')
    });

   it('should send null for typeaheads if inputField is emptied', (done: DoneCallback) => {
        polyTag.setTypeaheads('John', 'Jane', 'Doe');
        let count = 0;
        polyTag.typeahead = (suggestions: string[] | null) => {
            if (count == 1) {
                expect(element.value).toEqual('')
                expect(suggestions).toEqual(null)
                done();
            }
            count++;
        }
        sendKey(element, 'J')
        hitBackspace(element);
    });

   it('should allow for setting tags to be distinct', () => {
       polyTag.setDistinct = true;

       polyTag.add('Polytope', 'is', 'awesome', 'Polytope')

       expect(polyTag.value).toEqual(['Polytope', 'is', 'awesome'])
   })

    it('should count distinct items when set to distinct', () => {
        polyTag.setDistinct = true;

        polyTag.add('Polytope', 'is', 'awesome', 'Polytope')

        expect(polyTag.size).toEqual(3)
    })

    it('should not add the duplicated tags to the onValueChanged callback, when set to distinct', (done: DoneCallback) => {
        let count = 0;
        polyTag.onValueChanged = (value: string[]) => {
            if (count == 0) {
                expect(value).toEqual(['some tag'])
            } else if (count == 1) {
                expect(value).toEqual(['some tag'])
            } else {
                expect(value).toEqual(['some tag', 'some other tag'])
                done();
            }
            count++;
        }
        polyTag.setDistinct = true;

        polyTag.add('some tag')
        polyTag.add('some tag')
        polyTag.add('some other tag')
    })

    it('should restream on onValueChanged callback, when changing the state of distinct', function (done: DoneCallback) {
        let count = 0;
        polyTag.onValueChanged = (value: string[]) => {
            if (count == 0) {
                expect(value).toEqual(['some tag'])
            } else if (count == 1) {
                expect(value).toEqual(['some tag', 'some tag'])
            } else if (count == 2)  {
                expect(value).toEqual(['some tag', 'some tag', 'some other tag'])
            } else if (count == 3)  {
                expect(value).toEqual(['some tag', 'some other tag'])
            } else if (count == 4)  {
                expect(value).toEqual(['some tag', 'some other tag'])
            } else if (count == 5)  {
                expect(value).toEqual(['some tag', 'some tag', 'some other tag', 'some other tag'])
                done();
            }
            count++;
        }
        polyTag.add('some tag')
        polyTag.add('some tag')
        polyTag.add('some other tag')
        polyTag.setDistinct = true
        polyTag.add('some other tag')
        polyTag.setDistinct = false
    });

   it("should disregard character case when looking for typeaheads", (done: DoneCallback) => {
       polyTag.setTypeaheads('Polytope', 'poLyTag')
       polyTag.typeahead = (value: string[] | null) => {
           expect(value).toEqual(['Polytope', 'poLyTag']);
           done();
       }
       sendKey(element, 'poly')
   })

    it('should do nothing when strict-mode is activated, and trying to add a tag not part of the typeaheads', () => {
        polyTag.setTypeaheads('Polytope', 'poLyTag')
        polyTag.strict = true
        element.value = "some tag typed in field using tab"
        hitTab(element)

        expect(polyTag.value).toEqual([])
    })

    function hitEnter(element: HTMLInputElement) {
        sendKey(element, 'Enter', false);
    }

    function hitTab(element: HTMLInputElement) {
        sendKey(element, 'Tab', false);
    }

    function hitBackspace(element: HTMLInputElement) {
        if (element.value.length > 0) {
            element.value = element.value.slice(0, -1)
        }

        sendKey(element, 'Backspace', false);
    }

    function sendKey(element: HTMLInputElement, key: string, sendAsInput = true) {
        const keydownEvent = new KeyboardEvent('keydown', {
            key: key
        })

        element.dispatchEvent(keydownEvent);

        if (sendAsInput) {
            element.value += key;
            const inputEvent = new InputEvent('insertText', {
                data: key
            })

            element.dispatchEvent(inputEvent);
        }

        element.dispatchEvent(new Event("change"))
        element.dispatchEvent(new Event("input"))
    }
});
