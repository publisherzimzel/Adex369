/**
 * Animated RTB bidding visualization
 */
(function () {
  const canvas = document.getElementById('rtb-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, nodes, packets, frame = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    nodes = [
      { id: 'DSP', x: w * 0.12, y: h * 0.35, color: '#26c6b2' },
      { id: 'ADX', x: w * 0.5, y: h * 0.5, color: '#c9a43c' },
      { id: 'SSP', x: w * 0.88, y: h * 0.35, color: '#8b5cf6' },
      { id: 'DMP', x: w * 0.35, y: h * 0.78, color: '#3b82f6' },
      { id: 'PUB', x: w * 0.72, y: h * 0.78, color: '#26c6b2' },
    ];
    packets = [];
  }

  function spawnPacket() {
    const routes = [
      [0, 1], [1, 2], [0, 1, 2], [3, 0], [1, 4], [2, 4],
    ];
    const route = routes[Math.floor(Math.random() * routes.length)];
    packets.push({
      route,
      seg: 0,
      t: 0,
      speed: 0.012 + Math.random() * 0.018,
      bid: (Math.random() * 4 + 0.5).toFixed(2),
    });
  }

  function drawNode(n) {
    const pulse = Math.sin(frame * 0.04 + n.x) * 3;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 22 + pulse * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(12, 18, 32, 0.9)';
    ctx.fill();
    ctx.strokeStyle = n.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = n.color;
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.id, n.x, n.y + 4);
  }

  function drawConnections() {
    const pairs = [[0,1],[1,2],[3,0],[1,4],[2,4],[3,1]];
    ctx.setLineDash([4, 6]);
    pairs.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
      grad.addColorStop(0, na.color + '44');
      grad.addColorStop(1, nb.color + '44');
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function drawPacket(p) {
    const from = nodes[p.route[p.seg]];
    const to = nodes[p.route[p.seg + 1]];
    if (!from || !to) return false;

    const x = from.x + (to.x - from.x) * p.t;
    const y = from.y + (to.y - from.y) * p.t;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#26c6b2';
    ctx.shadowColor = '#26c6b2';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (p.t > 0.45 && p.t < 0.55) {
      ctx.fillStyle = 'rgba(201, 164, 60, 0.9)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('$' + p.bid, x, y - 12);
    }
    return true;
  }

  function loop() {
    frame++;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(38, 198, 178, 0.06)';
    for (let i = 0; i < w; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let j = 0; j < h; j += 24) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }

    drawConnections();
    nodes.forEach(drawNode);

    if (frame % 35 === 0 && packets.length < 12) spawnPacket();

    packets = packets.filter((p) => {
      p.t += p.speed;
      if (p.t >= 1) {
        p.seg++;
        p.t = 0;
      }
      if (p.seg >= p.route.length - 1) return false;
      return drawPacket(p);
    });

    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.fillText('OpenRTB 2.6 · Live Bidstream', 12, 16);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#26c6b2';
    ctx.fillText('QPS: ' + (1200 + Math.floor(Math.sin(frame * 0.02) * 200)), w - 12, h - 12);

    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  loop();
})();
