function simulatePhysics() {
    // 常量定义
    const GRAVITY = 9.81; // 重力加速度 (m/s²)
    const MAX_ALTITUDE = 40000; // 最大高度 (英尺)
    const MIN_ALTITUDE = 0; // 最小高度 (英尺)
    const MAX_SPEED = 300; // 最大速度 (节)
    const MIN_SPEED = 200; // 最小速度 (节)
    const DRAG_COEFFICIENT = 0.015; // 空气阻力系数
    const FUEL_CONSUMPTION_BASE = 0.002; // 燃油消耗基础速率
    const CLIMB_EFFICIENCY = 0.7; // 爬升效率系数
    const DESCENT_EFFICIENCY = 0.9; // 下降效率系数

    // 确保 velocity 和 acceleration 已定义
    if (typeof velocity === 'undefined') {
        console.error('Error: velocity is not defined.');
        return;
    }
    if (typeof acceleration === 'undefined') {
        console.error('Error: acceleration is not defined.');
        return;
    }

    // 模拟空气阻力对速度的影响
    const drag = velocity * DRAG_COEFFICIENT; // 阻力与速度成正比
    velocity = Math.max(MIN_SPEED, Math.min(MAX_SPEED, velocity + acceleration - drag)); // 速度受加速度和阻力影响

    // 更新俯仰角和滚转角，添加惯性效果
    currentPitch += pitchRate * 0.4; // 俯仰角变化更平滑
    currentPitch = Math.max(-15, Math.min(15, currentPitch)); // 限制俯仰角范围

    currentRoll += rollRate * 0.4; // 滚转角变化更平滑
    currentRoll = Math.max(-45, Math.min(45, currentRoll)); // 限制滚转角范围

    // 根据俯仰角和速度更新高度，添加高度限制
    const climbRate = currentPitch > 0
        ? currentPitch * (velocity / 250) * CLIMB_EFFICIENCY
        : currentPitch * (velocity / 250) * DESCENT_EFFICIENCY; // 爬升和下降效率不同
    currentAltitude = Math.max(MIN_ALTITUDE, Math.min(MAX_ALTITUDE, currentAltitude + climbRate));

    // 计算垂直速度（英尺/分钟）
    const verticalSpeed = Math.round(climbRate * 600); // 将爬升速率转换为每分钟的英尺

    // 燃油消耗与速度、爬升速率和发动机效率相关
    const fuelConsumption = velocity * FUEL_CONSUMPTION_BASE + Math.abs(climbRate) * 0.0015; // 燃油消耗公式
    currentFuel = Math.max(0, currentFuel - fuelConsumption);

    // 模拟航向变化，滚转角影响航向
    currentHeading = (currentHeading + currentRoll * 0.15) % 360;

    // 模拟发动机转速变化
    engine1RPM = Math.max(70, Math.min(100, (velocity - MIN_SPEED) / (MAX_SPEED - MIN_SPEED) * 100)); // 发动机转速与速度线性相关
    engine2RPM = engine1RPM; // 同步发动机 2 转速

    // 更新垂直速度
    currentVerticalSpeed = verticalSpeed;
}