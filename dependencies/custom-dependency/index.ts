export class CustomDependency {
    constructor(protected sampleAttribute: string) {
        this.sampleAttribute = sampleAttribute
    }

    public sampleMethod(): void {
        console.log(`Sample method from CustomDependency with attribute: ${this.sampleAttribute}`)
    }
}
