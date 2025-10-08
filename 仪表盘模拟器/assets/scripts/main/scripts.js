function drawAttitudeIndicator(pitch = 0, roll = 0) {
    const canvas = document.getElementById('attitude-indicator');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 保存上下文状态
    ctx.save();

    // 平移到中心并旋转
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((roll * Math.PI) / 180);

    // 绘制地平线
    const horizonOffset = pitch * 2; // 根据俯仰角调整地平线位置
    ctx.fillStyle = '#0077be'; // 天空蓝
    ctx.fillRect(-canvas.width * 4, -canvas.height / 2 + horizonOffset, canvas.width * 8, canvas.height); // 扩大绘制区域，避免边界问题
    ctx.fillStyle = '#8b4513'; // 棕色地面
    ctx.fillRect(-canvas.width * 4, horizonOffset, canvas.width * 8, canvas.height); // 扩大绘制区域

    // 绘制中心线
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-canvas.width * 4, 0 + horizonOffset);
    ctx.lineTo(canvas.width * 4, 0 + horizonOffset);
    ctx.stroke();

    // 恢复上下文状态
    ctx.restore();

    // 绘制固定的飞机符号
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - 10);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 + 10);
    ctx.stroke();
}

function drawHeadingIndicator(heading = 0) {
    const canvas = document.getElementById('heading-indicator');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    ctx.fillStyle = '#1e1e2f';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // 绘制航向刻度
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 360; i += 30) {
        const angle = ((i - heading) * Math.PI) / 180;
        const x1 = canvas.width / 2 + Math.cos(angle) * (canvas.width / 2 - 10);
        const y1 = canvas.height / 2 + Math.sin(angle) * (canvas.height / 2 - 10);
        const x2 = canvas.width / 2 + Math.cos(angle) * (canvas.width / 2 - 20);
        const y2 = canvas.height / 2 + Math.sin(angle) * (canvas.height / 2 - 20);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // 绘制刻度数字
        if (i % 90 === 0) {
            const textX = canvas.width / 2 + Math.cos(angle) * (canvas.width / 2 - 30);
            const textY = canvas.height / 2 + Math.sin(angle) * (canvas.height / 2 - 30);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i, textX, textY);
        }
    }

    // 绘制航向指针
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - 5);
    ctx.lineTo(canvas.width / 2 - 10, canvas.height / 2 + 20);
    ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 + 20);
    ctx.closePath();
    ctx.fill();

    // 绘制当前航向数值
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`航向: ${Math.round(heading)}°`, canvas.width / 2, canvas.height - 10);
}

function updateHeading(newHeading) {
    drawHeadingIndicator(newHeading);
}

function updateSpeed(newSpeed) {
    document.getElementById('speed-display').textContent = newSpeed;
}

function updateAltitude(newAltitude) {
    document.getElementById('altitude-display').textContent = newAltitude;
}

function updateVerticalSpeed(newVSpeed) {
    document.getElementById('vspeed-display').textContent = newVSpeed;
}

function updateFuel(newFuel) {
    document.getElementById('fuel-display').textContent = newFuel;
}

function updateAttitude(newPitch, newRoll) {
    drawAttitudeIndicator(newPitch, newRoll);
}

function updateEngineRPM(engine1RPM, engine2RPM) {
    document.getElementById('engine1-rpm-display').textContent = engine1RPM;
    document.getElementById('engine2-rpm-display').textContent = engine2RPM;
}

function updateAllData(newHeading, newSpeed, newAltitude, newFuel, newPitch, newRoll, engine1RPM, engine2RPM) {
    // 更新航向指示器
    updateHeading(newHeading);

    // 更新速度显示
    updateSpeed(newSpeed);

    // 更新高度显示
    updateAltitude(newAltitude);

    // 更新垂直速度显示
    updateVerticalSpeed(currentVerticalSpeed); // 使用 physics.js 中计算的垂直速度

    // 更新燃油量显示
    updateFuel(newFuel);

    // 更新姿态指示器
    updateAttitude(newPitch, newRoll);

    // 更新发动机转速显示
    updateEngineRPM(engine1RPM, engine2RPM);
}

// 初始化仪表
drawAttitudeIndicator();
drawHeadingIndicator();

// 模拟数据变化
let currentHeading = 0;
let currentSpeed = 250;
let currentAltitude = 35000;
let currentFuel = 5000;
let currentPitch = 0;
let currentRoll = 0;
let engine1RPM = 85;
let engine2RPM = 85;

let velocity = 0; // 飞机的前进速度
let acceleration = 0; // 加速度
let pitchRate = 0; // 俯仰角变化率
let rollRate = 0; // 滚转角变化率

function handleInput() {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w': // 增加俯仰角（向上）
                pitchRate = -0.1; // 修正为负值
                break;
            case 's': // 减少俯仰角（向下）
                pitchRate = 0.1; // 修正为正值
                break;
            case 'a': // 增加滚转角（向左）
                rollRate = -0.1;
                break;
            case 'd': // 减少滚转角（向右）
                rollRate = 0.1;
                break;
            case 'r': // 加速
                acceleration = 1; // 增加加速度
                break;
            case 'f': // 减速
                acceleration = -1; // 减少加速度
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
            case 's':
                pitchRate = 0;
                break;
            case 'a':
            case 'd':
                rollRate = 0;
                break;
            case 'r':
            case 'f':
                acceleration = 0; // 停止加速或减速
                break;
        }
    });
}

function simulateData() {
    // 调用物理模拟逻辑（从 physics.js 中引入）
    try {
        simulatePhysics(); // 确保 simulatePhysics 函数内处理未定义变量
    } catch (error) {
        console.error('Error in simulatePhysics:', error);
    }

    // 更新所有仪表数据
    updateAllData(
        currentHeading,
        Math.round(velocity),
        Math.round(currentAltitude),
        Math.round(currentFuel),
        Math.round(currentPitch),
        Math.round(currentRoll),
        Math.round(engine1RPM),
        Math.round(engine2RPM)
    );

    // 使用 requestAnimationFrame 提高性能
    requestAnimationFrame(simulateData);
}

// 初始化输入控制
handleInput();

// 开始模拟数据
simulateData();