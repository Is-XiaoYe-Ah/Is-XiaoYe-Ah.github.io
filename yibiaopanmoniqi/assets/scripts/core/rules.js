const FlightRules = {
    maxFuel: 5000, // 最大燃油量 (公斤)
    minFuel: 0, // 最小燃油量
    maxPitch: 15, // 最大俯仰角 (度)
    minPitch: -15, // 最小俯仰角 (度)
    maxRoll: 45, // 最大滚转角 (度)
    minRoll: -45, // 最小滚转角 (度)
    validateFuel(fuel) {
        return Math.max(this.minFuel, Math.min(this.maxFuel, fuel)); // 确保燃油量在范围内
    }
};
