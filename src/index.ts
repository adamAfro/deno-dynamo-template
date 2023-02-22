export default class Index {

    root: Element

    constructor(root: Element) {

        this.root = root
        this.root.textContent = "hello world"
    }
}