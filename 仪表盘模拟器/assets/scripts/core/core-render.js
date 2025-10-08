const CoreRender = {
    drawAttitudeIndicator(ctx, pitch, roll) {
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((roll * Math.PI) / 180);

        const horizonOffset = pitch * 2;
        ctx.fillStyle = '#0077be'; // 天空蓝
        ctx.fillRect(-canvas.width * 4, -canvas.height / 2 + horizonOffset, canvas.width * 8, canvas.height);
        ctx.fillStyle = '#8b4513'; // 棕色地面
        ctx.fillRect(-canvas.width * 4, horizonOffset, canvas.width * 8, canvas.height);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-canvas.width * 4, 0 + horizonOffset);
        ctx.lineTo(canvas.width * 4, 0 + horizonOffset);
        ctx.stroke();

        ctx.restore();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2);
        ctx.moveTo(canvas.width / 2, canvas.height / 2 - 10);
        ctx.lineTo(canvas.width / 2, canvas.height / 2 + 10);
        ctx.stroke();
    },

    drawHeadingIndicator(ctx, heading) {
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#1e1e2f';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.fill();

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

        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2 - 5);
        ctx.lineTo(canvas.width / 2 - 10, canvas.height / 2 + 20);
        ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`航向: ${Math.round(heading)}°`, canvas.width / 2, canvas.height - 10);
    }
};
