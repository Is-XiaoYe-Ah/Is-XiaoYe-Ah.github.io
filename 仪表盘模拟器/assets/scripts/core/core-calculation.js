const CoreCalculation = {
    constants: {
        GRAVITY: 9.81, // 重力加速度 (m/s²)
        MAX_ALTITUDE: 40000, // 最大高度 (英尺)
        MIN_ALTITUDE: 0, // 最小高度 (英尺)
        MAX_SPEED: 300, // 最大速度 (节)
        MIN_SPEED: 200, // 最小速度 (节)
        DRAG_COEFFICIENT: 0.015, // 空气阻力系数
        FUEL_CONSUMPTION_BASE: 0.002, // 燃油消耗基础速率
        CLIMB_EFFICIENCY: 0.7, // 爬升效率系数
        DESCENT_EFFICIENCY: 0.9 // 下降效率系数
    },

    calculateVelocity(velocity, acceleration) {
        const drag = velocity * this.constants.DRAG_COEFFICIENT;
        return Math.max(
            this.constants.MIN_SPEED,
            Math.min(this.constants.MAX_SPEED, velocity + acceleration - drag)
        );
    },

    calculateAltitude(currentAltitude, pitch, velocity) {
        const climbRate = pitch > 0
            ? pitch * (velocity / 250) * this.constants.CLIMB_EFFICIENCY
            : pitch * (velocity / 250) * this.constants.DESCENT_EFFICIENCY;
        return Math.max(
            this.constants.MIN_ALTITUDE,
            Math.min(this.constants.MAX_ALTITUDE, currentAltitude + climbRate)
        );
    },

    calculateFuel(currentFuel, velocity, climbRate) {
        const fuelConsumption = velocity * this.constants.FUEL_CONSUMPTION_BASE + Math.abs(climbRate) * 0.0015;
        return Math.max(0, currentFuel - fuelConsumption);
    },

    calculateVerticalSpeed(pitch, velocity) {
        const climbRate = pitch * (velocity / 250);
        return Math.round(climbRate * 600); // 转换为英尺/分钟
    },

    calculateHeading(currentHeading, roll) {
        const newHeading = (currentHeading + roll * 0.15) % 360;
        return newHeading < 0 ? newHeading + 360 : newHeading; // 确保航向为正值
    },

    calculateEngineRPM(velocity) {
        return Math.max(
            70,
            Math.min(100, (velocity - this.constants.MIN_SPEED) / (this.constants.MAX_SPEED - this.constants.MIN_SPEED) * 100)
        );
    }
};
