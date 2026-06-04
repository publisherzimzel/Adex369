/**
 * Animated chart visualizations for AI section
 */
(function () {
  function drawLineChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const points = 24;
    const data = Array.from({ length: points }, (_, i) => 40 + Math.sin(i * 0.5) * 25 + Math.random() * 10);

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const pad = 20;
      const chartW = w - pad * 2;
      const chartH = h - pad * 2;
      const offset = (frame * 0.3) % (chartW / (points - 1));

      // Gradient fill
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = pad + (i / (points - 1)) * chartW - offset;
        const y = pad + chartH - (v / 100) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      const lastX = pad + chartW - offset;
      ctx.lineTo(lastX, pad + chartH);
      ctx.lineTo(pad - offset, pad + chartH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad, 0, h);
      grad.addColorStop(0, 'rgba(38, 198, 178, 0.35)');
      grad.addColorStop(1, 'rgba(38, 198, 178, 0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = pad + (i / (points - 1)) * chartW - offset;
        const y = pad + chartH - (v / 100) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#26c6b2';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bars mini
      for (let i = 0; i < 6; i++) {
        const bx = w - pad - (6 - i) * 18;
        const bh = 15 + Math.sin(frame * 0.05 + i) * 20;
        ctx.fillStyle = i % 2 ? '#8b5cf6' : '#c9a43c';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(bx, h - pad - bh, 12, bh);
      }
      ctx.globalAlpha = 1;

      frame++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function drawDonut(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const segments = [
      { value: 0.42, color: '#26c6b2', label: 'ROI' },
      { value: 0.28, color: '#8b5cf6', label: 'Fill' },
      { value: 0.18, color: '#c9a43c', label: 'Quality' },
      { value: 0.12, color: '#3b82f6', label: 'Scale' },
    ];

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, rect.height);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2 - 16;
      const inner = r * 0.62;
      let start = -Math.PI / 2 + frame * 0.008;

      segments.forEach((seg) => {
        const sweep = seg.value * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, start, start + sweep);
        ctx.arc(cx, cy, inner, start + sweep, start, true);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        start += sweep;
      });

      ctx.fillStyle = '#0a0f1a';
      ctx.beginPath();
      ctx.arc(cx, cy, inner - 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e8edf5';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('37%', cx, cy + 2);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('ROI Lift', cx, cy + 18);

      frame++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  drawLineChart('ai-chart-line');
  drawDonut('ai-chart-donut');
})();
