class Element {
    constructor(index, { color, empty, still, liquid, probability, disperse, velocity, acceleration, maxVelocity, falling, behaviours } = {}) {
        this.color = color ?? [255, 255, 255];
        this.empty = empty ?? false;
        this.still = still ?? false;
        this.liquid = liquid ?? false;
        this.falling = falling ?? false;
        this.probability = probability ?? 1;
        this.disperse = disperse ?? 0;
        this.velocity = velocity ?? 0;
        this.acceleration = acceleration ?? 0;
        this.maxVelocity = maxVelocity ?? 0;
        this.behaviours = behaviours ?? [];
        this.behavioursLookup = Object.fromEntries(
            this.behaviours.map(
                (b) => [b.constructor.name, b]
            )
        );
    }

    update(grid, params) {
        this.behaviours.forEach(
            (b) => b.update(this, grid, params)
        );
    }

    getBehaviour(type) {
        return this.behavioursLookup[type.name];
    }
}
export default Element;