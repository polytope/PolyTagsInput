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
});
