function random(max, min) {
    if (!min) { min = 0; }
    return Math.round(Math.random() * (max - min) + min);
}


Array.prototype.randomElement = function () {
    return this[random(this.length - 1)];
}