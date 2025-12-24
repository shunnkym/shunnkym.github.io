/* ============================================
   NAKAYAMA LABORATORY - JavaScript
   Swiss Minimal Design + Cyberpunk Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initTypingEffect();
    initCounterAnimation();
    initPublicationFilter();
    initSmoothScroll();
    initTextShuffleEffect();
    initGlitchIntervals();
});

/* === Geometric Animation === */
function initGeometricAnimation() {
    const canvas = document.getElementById('geo-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    let time = 0;
    
    // Particles for the geometric patterns
    const particles = [];
    const connections = [];
    const shapes = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
        initParticles();
        initShapes();
    }
    
    function initParticles() {
        particles.length = 0;
        const count = Math.floor((width * height) / 15000);
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    function initShapes() {
        shapes.length = 0;
        
        // Central rotating polygon
        shapes.push({
            type: 'polygon',
            x: centerX,
            y: centerY,
            radius: Math.min(width, height) * 0.15,
            sides: 6,
            rotation: 0,
            rotationSpeed: 0.002,
            opacity: 0.3
        });
        
        // Orbiting circles
        for (let i = 0; i < 3; i++) {
            shapes.push({
                type: 'orbit',
                centerX: centerX,
                centerY: centerY,
                orbitRadius: Math.min(width, height) * (0.2 + i * 0.1),
                radius: 4 + i * 2,
                angle: (Math.PI * 2 / 3) * i,
                speed: 0.01 - i * 0.002,
                opacity: 0.6 - i * 0.15
            });
        }
        
        // Expanding rings
        for (let i = 0; i < 5; i++) {
            shapes.push({
                type: 'ring',
                x: centerX,
                y: centerY,
                radius: 0,
                maxRadius: Math.min(width, height) * 0.5,
                speed: 1 + i * 0.5,
                delay: i * 60,
                opacity: 0
            });
        }
        
        // Floating triangles
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const dist = Math.min(width, height) * 0.25;
            shapes.push({
                type: 'triangle',
                x: centerX + Math.cos(angle) * dist,
                y: centerY + Math.sin(angle) * dist,
                size: 20 + Math.random() * 20,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatOffset: Math.random() * Math.PI * 2,
                opacity: 0.2
            });
        }
    }
    
    function drawPolygon(x, y, radius, sides, rotation) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = rotation + (Math.PI * 2 / sides) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    }
    
    function drawTriangle(x, y, size, rotation) {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = rotation + (Math.PI * 2 / 3) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    }
    
    function draw() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        time++;
        
        // Update and draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        });
        
        // Draw connections between nearby particles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.globalAlpha = (1 - dist / 100) * 0.3;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        // Draw shapes
        shapes.forEach(shape => {
            if (shape.type === 'polygon') {
                shape.rotation += shape.rotationSpeed;
                
                // Draw multiple nested polygons
                for (let i = 0; i < 4; i++) {
                    const r = shape.radius * (1 - i * 0.2);
                    const rot = shape.rotation * (i % 2 === 0 ? 1 : -1);
                    
                    ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity * (1 - i * 0.2)})`;
                    ctx.lineWidth = 1;
                    drawPolygon(shape.x, shape.y, r, shape.sides, rot);
                    ctx.stroke();
                }
            }
            
            if (shape.type === 'orbit') {
                shape.angle += shape.speed;
                const x = shape.centerX + Math.cos(shape.angle) * shape.orbitRadius;
                const y = shape.centerY + Math.sin(shape.angle) * shape.orbitRadius;
                
                // Draw orbit path
                ctx.beginPath();
                ctx.arc(shape.centerX, shape.centerY, shape.orbitRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Draw orbiting circle
                ctx.beginPath();
                ctx.arc(x, y, shape.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${shape.opacity})`;
                ctx.fill();
                
                // Trail effect
                for (let i = 1; i < 10; i++) {
                    const trailAngle = shape.angle - shape.speed * i * 3;
                    const tx = shape.centerX + Math.cos(trailAngle) * shape.orbitRadius;
                    const ty = shape.centerY + Math.sin(trailAngle) * shape.orbitRadius;
                    ctx.beginPath();
                    ctx.arc(tx, ty, shape.radius * (1 - i * 0.1), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${shape.opacity * (1 - i * 0.1) * 0.3})`;
                    ctx.fill();
                }
            }
            
            if (shape.type === 'ring') {
                if (time > shape.delay) {
                    shape.radius += shape.speed;
                    shape.opacity = Math.sin((shape.radius / shape.maxRadius) * Math.PI) * 0.3;
                    
                    if (shape.radius > shape.maxRadius) {
                        shape.radius = 0;
                        shape.delay = time + 60;
                    }
                    
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
            
            if (shape.type === 'triangle') {
                shape.rotation += shape.rotationSpeed;
                const floatY = Math.sin(time * 0.02 + shape.floatOffset) * 10;
                
                ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity})`;
                ctx.lineWidth = 1;
                drawTriangle(shape.x, shape.y + floatY, shape.size, shape.rotation);
                ctx.stroke();
            }
        });
        
        // Draw grid lines emanating from center
        const gridOpacity = 0.05 + Math.sin(time * 0.01) * 0.02;
        ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i + time * 0.001;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * Math.max(width, height),
                centerY + Math.sin(angle) * Math.max(width, height)
            );
            ctx.stroke();
        }
        
        requestAnimationFrame(draw);
    }
    
    resize();
    window.addEventListener('resize', resize);
    draw();
}

/* === Initialize Geometric Animation === */
function initGlitchIntervals() {
    // Initialize background geometric animation
    initGeometricAnimation();
    // Initialize hero canvas animation
    initHeroGeometricCanvas();
}

/* === Hero Geometric Canvas Animation - Urban Railway Network === */
function initHeroGeometricCanvas() {
    const canvas = document.getElementById('hero-geo-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    
    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        width = rect.width * dpr;
        height = rect.height * dpr;
        canvas.width = width;
        canvas.height = height;
        ctx.scale(dpr, dpr);
        centerX = rect.width / 2;
        centerY = rect.height / 2;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Track mouse for interactivity
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
    });
    
    // Station data - positions relative to center (0-1 scale from center)
    // Complex metropolitan railway network
    const stations = [
        // Central area - main terminals
        { id: 'central', x: 0, y: 0, size: 1.0, density: 1.0 },
        { id: 'central_n', x: 0.05, y: -0.08, size: 0.6, density: 0.8 },
        { id: 'central_s', x: -0.04, y: 0.09, size: 0.55, density: 0.75 },
        
        // Main terminals (4 directions)
        { id: 'north', x: 0, y: -0.35, size: 0.8, density: 0.85 },
        { id: 'south', x: 0, y: 0.38, size: 0.75, density: 0.8 },
        { id: 'east', x: 0.38, y: 0, size: 0.7, density: 0.75 },
        { id: 'west', x: -0.40, y: 0, size: 0.7, density: 0.7 },
        
        // Secondary terminals (diagonal)
        { id: 'northeast', x: 0.28, y: -0.26, size: 0.6, density: 0.6 },
        { id: 'northwest', x: -0.30, y: -0.24, size: 0.55, density: 0.55 },
        { id: 'southeast', x: 0.26, y: 0.28, size: 0.55, density: 0.55 },
        { id: 'southwest', x: -0.28, y: 0.26, size: 0.5, density: 0.5 },
        
        // Outer ring stations
        { id: 'far_north', x: 0.02, y: -0.48, size: 0.45, density: 0.4 },
        { id: 'far_south', x: -0.02, y: 0.50, size: 0.45, density: 0.4 },
        { id: 'far_east', x: 0.50, y: 0.02, size: 0.4, density: 0.35 },
        { id: 'far_west', x: -0.52, y: -0.02, size: 0.4, density: 0.35 },
        
        // Intermediate stations on main lines
        { id: 'n_mid', x: 0.02, y: -0.20, size: 0.4, density: 0.5 },
        { id: 's_mid', x: -0.02, y: 0.22, size: 0.4, density: 0.5 },
        { id: 'e_mid', x: 0.20, y: 0.02, size: 0.4, density: 0.5 },
        { id: 'w_mid', x: -0.22, y: -0.02, size: 0.4, density: 0.45 },
        
        // Branch line stations
        { id: 'ne_branch1', x: 0.40, y: -0.18, size: 0.35, density: 0.35 },
        { id: 'ne_branch2', x: 0.45, y: -0.32, size: 0.3, density: 0.3 },
        { id: 'nw_branch1', x: -0.42, y: -0.16, size: 0.35, density: 0.35 },
        { id: 'nw_branch2', x: -0.48, y: -0.30, size: 0.3, density: 0.3 },
        { id: 'se_branch1', x: 0.38, y: 0.20, size: 0.35, density: 0.35 },
        { id: 'se_branch2', x: 0.46, y: 0.35, size: 0.3, density: 0.3 },
        { id: 'sw_branch1', x: -0.40, y: 0.18, size: 0.35, density: 0.35 },
        { id: 'sw_branch2', x: -0.50, y: 0.32, size: 0.3, density: 0.3 },
        
        // Loop line stations
        { id: 'loop_ne', x: 0.15, y: -0.15, size: 0.35, density: 0.45 },
        { id: 'loop_nw', x: -0.15, y: -0.14, size: 0.35, density: 0.45 },
        { id: 'loop_se', x: 0.14, y: 0.16, size: 0.35, density: 0.45 },
        { id: 'loop_sw', x: -0.14, y: 0.15, size: 0.35, density: 0.45 },
        
        // Express line stops
        { id: 'express_n', x: 0.12, y: -0.42, size: 0.35, density: 0.35 },
        { id: 'express_s', x: -0.10, y: 0.44, size: 0.35, density: 0.35 }
    ];
    
    // Railway lines connecting stations - complex network
    const railwayLines = [
        // Main North-South Line (red)
        { from: 'far_north', to: 'north', color: 1 },
        { from: 'north', to: 'n_mid', color: 1 },
        { from: 'n_mid', to: 'central_n', color: 1 },
        { from: 'central_n', to: 'central', color: 1 },
        { from: 'central', to: 'central_s', color: 1 },
        { from: 'central_s', to: 's_mid', color: 1 },
        { from: 's_mid', to: 'south', color: 1 },
        { from: 'south', to: 'far_south', color: 1 },
        
        // Main East-West Line (blue)
        { from: 'far_west', to: 'west', color: 2 },
        { from: 'west', to: 'w_mid', color: 2 },
        { from: 'w_mid', to: 'central', color: 2 },
        { from: 'central', to: 'e_mid', color: 2 },
        { from: 'e_mid', to: 'east', color: 2 },
        { from: 'east', to: 'far_east', color: 2 },
        
        // Loop Line (green) - inner circle
        { from: 'loop_ne', to: 'loop_nw', color: 3 },
        { from: 'loop_nw', to: 'loop_sw', color: 3 },
        { from: 'loop_sw', to: 'loop_se', color: 3 },
        { from: 'loop_se', to: 'loop_ne', color: 3 },
        { from: 'central', to: 'loop_ne', color: 3 },
        { from: 'central', to: 'loop_nw', color: 3 },
        { from: 'central', to: 'loop_se', color: 3 },
        { from: 'central', to: 'loop_sw', color: 3 },
        
        // Diagonal Line NE-SW
        { from: 'northeast', to: 'loop_ne', color: 4 },
        { from: 'loop_ne', to: 'central', color: 4 },
        { from: 'central', to: 'loop_sw', color: 4 },
        { from: 'loop_sw', to: 'southwest', color: 4 },
        
        // Diagonal Line NW-SE
        { from: 'northwest', to: 'loop_nw', color: 5 },
        { from: 'loop_nw', to: 'central', color: 5 },
        { from: 'central', to: 'loop_se', color: 5 },
        { from: 'loop_se', to: 'southeast', color: 5 },
        
        // NE Branch Lines
        { from: 'east', to: 'ne_branch1', color: 6 },
        { from: 'ne_branch1', to: 'ne_branch2', color: 6 },
        { from: 'northeast', to: 'ne_branch1', color: 6 },
        
        // NW Branch Lines
        { from: 'west', to: 'nw_branch1', color: 7 },
        { from: 'nw_branch1', to: 'nw_branch2', color: 7 },
        { from: 'northwest', to: 'nw_branch1', color: 7 },
        
        // SE Branch Lines
        { from: 'east', to: 'se_branch1', color: 8 },
        { from: 'se_branch1', to: 'se_branch2', color: 8 },
        { from: 'southeast', to: 'se_branch1', color: 8 },
        
        // SW Branch Lines
        { from: 'west', to: 'sw_branch1', color: 9 },
        { from: 'sw_branch1', to: 'sw_branch2', color: 9 },
        { from: 'southwest', to: 'sw_branch1', color: 9 },
        
        // Express Line
        { from: 'far_north', to: 'express_n', color: 10 },
        { from: 'express_n', to: 'north', color: 10 },
        { from: 'north', to: 'central', color: 10 },
        { from: 'central', to: 'south', color: 10 },
        { from: 'south', to: 'express_s', color: 10 },
        { from: 'express_s', to: 'far_south', color: 10 },
        
        // Outer connections
        { from: 'north', to: 'northeast', color: 11 },
        { from: 'north', to: 'northwest', color: 11 },
        { from: 'south', to: 'southeast', color: 12 },
        { from: 'south', to: 'southwest', color: 12 },
        { from: 'east', to: 'northeast', color: 13 },
        { from: 'east', to: 'southeast', color: 13 },
        { from: 'west', to: 'northwest', color: 14 },
        { from: 'west', to: 'southwest', color: 14 },
        
        // Ring connections between secondary terminals
        { from: 'northeast', to: 'northwest', color: 15 },
        { from: 'southeast', to: 'southwest', color: 15 },
        { from: 'northeast', to: 'southeast', color: 16 },
        { from: 'northwest', to: 'southwest', color: 16 }
    ];
    
    // Moving trains/particles on each line
    const trains = [];
    railwayLines.forEach((line, idx) => {
        // Add trains based on line importance
        const numTrains = line.color <= 2 ? 3 : (line.color <= 5 ? 2 : 1);
        for (let i = 0; i < numTrains; i++) {
            trains.push({
                lineIdx: idx,
                progress: Math.random(),
                speed: 0.004 + Math.random() * 0.006,
                direction: Math.random() > 0.5 ? 1 : -1,
                size: line.color <= 2 ? 3 : (line.color <= 5 ? 2.5 : 2)
            });
        }
    });
    
    // Pulse rings for density visualization
    const densityPulses = [];
    
    // Get station by ID
    function getStation(id) {
        return stations.find(s => s.id === id);
    }
    
    // Get screen position of station
    function getStationPos(station, w, h, minDim) {
        return {
            x: centerX + station.x * minDim * 0.9,
            y: centerY + station.y * minDim * 0.9
        };
    }
    
    // Draw density gradient around station
    function drawDensityGradient(x, y, radius, density) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${density * 0.25})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${density * 0.1})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Draw station
    function drawStation(station, w, h, minDim) {
        const pos = getStationPos(station, w, h, minDim);
        const baseSize = minDim * 0.018 * station.size;
        const isMajor = station.size >= 0.7;
        
        // Outer pulsing ring for major stations
        if (isMajor) {
            const pulseSize = baseSize * (1.8 + Math.sin(time * 2 + station.x * 10) * 0.4);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pulseSize, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + Math.sin(time * 2) * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Station circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, baseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${isMajor ? 0.9 : 0.6})`;
        ctx.lineWidth = isMajor ? 2 : 1.5;
        ctx.stroke();
        
        // Inner dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, baseSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${isMajor ? 1 : 0.7})`;
        ctx.fill();
        
        // Central station special effect
        if (station.id === 'central') {
            // Additional ring
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, baseSize * 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    
    // Draw railway line with curve
    function drawRailwayLine(line, w, h, minDim) {
        const fromStation = getStation(line.from);
        const toStation = getStation(line.to);
        if (!fromStation || !toStation) return null;
        
        const from = getStationPos(fromStation, w, h, minDim);
        const to = getStationPos(toStation, w, h, minDim);
        
        // Calculate control point for curve
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        
        // Vary curve amount based on line type
        const curveAmount = line.color <= 2 ? 0.08 : (line.color <= 5 ? 0.12 : 0.18);
        const perpX = -dy * curveAmount;
        const perpY = dx * curveAmount;
        const ctrlX = midX + perpX * (line.color % 2 === 0 ? 1 : -1);
        const ctrlY = midY + perpY * (line.color % 2 === 0 ? 1 : -1);
        
        // Line thickness based on importance
        const lineWidth = line.color <= 2 ? 2 : (line.color <= 5 ? 1.5 : 1);
        const opacity = line.color <= 2 ? 0.35 : (line.color <= 5 ? 0.25 : 0.18);
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, to.x, to.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        return { from, to, ctrlX, ctrlY };
    }
    
    // Draw train on line
    function drawTrain(train, w, h, minDim) {
        const line = railwayLines[train.lineIdx];
        const fromStation = getStation(line.from);
        const toStation = getStation(line.to);
        const from = getStationPos(fromStation, w, h, minDim);
        const to = getStationPos(toStation, w, h, minDim);
        
        // Control point
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const perpX = -dy * 0.15;
        const perpY = dx * 0.15;
        const ctrlX = midX + perpX * (line.color % 2 === 0 ? 1 : -1);
        const ctrlY = midY + perpY * (line.color % 2 === 0 ? 1 : -1);
        
        // Quadratic bezier position
        const t = train.progress;
        const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*ctrlX + t*t*to.x;
        const y = (1-t)*(1-t)*from.y + 2*(1-t)*t*ctrlY + t*t*to.y;
        
        // Draw train
        ctx.beginPath();
        ctx.arc(x, y, train.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Trail
        for (let i = 1; i < 4; i++) {
            const tt = train.progress - train.direction * train.speed * i * 8;
            if (tt >= 0 && tt <= 1) {
                const tx = (1-tt)*(1-tt)*from.x + 2*(1-tt)*tt*ctrlX + tt*tt*to.x;
                const ty = (1-tt)*(1-tt)*from.y + 2*(1-tt)*tt*ctrlY + tt*tt*to.y;
                ctx.beginPath();
                ctx.arc(tx, ty, train.size * (1 - i * 0.25), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * (1 - i * 0.25)})`;
                ctx.fill();
            }
        }
    }
    
    function draw() {
        const w = canvas.getBoundingClientRect().width;
        const h = canvas.getBoundingClientRect().height;
        const minDim = Math.min(w, h);
        
        // Clear with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, 0, w, h);
        
        time += 0.016;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        const gridSize = minDim / 10;
        for (let i = 0; i <= 10; i++) {
            const offset = i * gridSize;
            ctx.beginPath();
            ctx.moveTo(centerX - minDim/2 + offset, centerY - minDim/2);
            ctx.lineTo(centerX - minDim/2 + offset, centerY + minDim/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(centerX - minDim/2, centerY - minDim/2 + offset);
            ctx.lineTo(centerX + minDim/2, centerY - minDim/2 + offset);
            ctx.stroke();
        }
        
        // Draw density gradients first (background layer)
        stations.forEach(station => {
            const pos = getStationPos(station, w, h, minDim);
            const radius = minDim * 0.15 * station.density * (1 + Math.sin(time + station.x * 5) * 0.1);
            drawDensityGradient(pos.x, pos.y, radius, station.density);
        });
        
        // Draw concentric influence rings around central station
        for (let i = 1; i <= 5; i++) {
            const radius = minDim * 0.09 * i;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - i * 0.02})`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([3, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Draw outer ring line (like Yamanote Line)
        ctx.beginPath();
        ctx.arc(centerX, centerY, minDim * 0.32, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw railway lines
        railwayLines.forEach(line => {
            drawRailwayLine(line, w, h, minDim);
        });
        
        // Update and draw trains
        trains.forEach(train => {
            train.progress += train.speed * train.direction;
            if (train.progress > 1) {
                train.progress = 1;
                train.direction = -1;
            } else if (train.progress < 0) {
                train.progress = 0;
                train.direction = 1;
            }
            drawTrain(train, w, h, minDim);
        });
        
        // Draw stations on top
        stations.forEach(station => {
            drawStation(station, w, h, minDim);
        });
        
        // Generate density pulses from central station
        if (Math.random() > 0.97) {
            densityPulses.push({
                x: centerX,
                y: centerY,
                radius: minDim * 0.03,
                maxRadius: minDim * 0.45,
                opacity: 0.4
            });
        }
        
        // Random pulses from other stations
        if (Math.random() > 0.99) {
            const randomStation = stations[Math.floor(Math.random() * stations.length)];
            const pos = getStationPos(randomStation, w, h, minDim);
            densityPulses.push({
                x: pos.x,
                y: pos.y,
                radius: minDim * 0.02,
                maxRadius: minDim * 0.2 * randomStation.density,
                opacity: 0.3 * randomStation.density
            });
        }
        
        // Draw and update density pulses
        for (let i = densityPulses.length - 1; i >= 0; i--) {
            const pulse = densityPulses[i];
            pulse.radius += 1.5;
            pulse.opacity = 0.4 * (1 - pulse.radius / pulse.maxRadius);
            
            if (pulse.radius > pulse.maxRadius) {
                densityPulses.splice(i, 1);
                continue;
            }
            
            ctx.beginPath();
            ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${pulse.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Mouse interaction - highlight nearest station
        const mx = mouseX * w;
        const my = mouseY * h;
        let nearestStation = null;
        let nearestDist = Infinity;
        
        stations.forEach(station => {
            const pos = getStationPos(station, w, h, minDim);
            const dist = Math.hypot(mx - pos.x, my - pos.y);
            if (dist < nearestDist && dist < minDim * 0.1) {
                nearestDist = dist;
                nearestStation = station;
            }
        });
        
        if (nearestStation) {
            const pos = getStationPos(nearestStation, w, h, minDim);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, minDim * 0.05, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

/* === Text Shuffle Effect === */
function initTextShuffleEffect() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    
    // Apply only to "続きを読む" (news-link) and "詳細を見る" (card-link)
    const shuffleTargets = document.querySelectorAll('.news-link, .card-link');
    
    shuffleTargets.forEach(element => {
        // Find the span inside, or use the element itself
        const textElement = element.querySelector('span') || element;
        const originalText = textElement.textContent;
        let isAnimating = false;
        
        element.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            let iterations = 0;
            const maxIterations = originalText.length;
            
            const interval = setInterval(() => {
                textElement.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        // Keep spaces and already revealed characters
                        if (char === ' ') return ' ';
                        if (index < iterations) return originalText[index];
                        // Random character
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                iterations += 1/3;
                
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    textElement.textContent = originalText;
                    isAnimating = false;
                }
            }, 30);
        });
        
        // Ensure original text is restored on mouse leave
        element.addEventListener('mouseleave', () => {
            textElement.textContent = originalText;
        });
    });
}

/* === Navigation === */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
}

/* === Scroll Effects === */
function initScrollEffects() {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.section-header, .about-content, .about-image, .research-card, .member-card, .news-card, .publication-item, .professor-card, .award-item');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
}

/* === Typing Effect === */
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const phrases = [
        'Urban Analytics',
        'Human Flow',
        'AI & Machine Learning',
        'Data Science',
        'Smart Cities'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        typingText.textContent = currentText;
        
        let typeSpeed = isDeleting ? 30 : 80;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing after a delay
    setTimeout(type, 1500);
}

/* === Counter Animation === */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    }
    
    update();
}

/* === Publication Filter === */
function initPublicationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter publications
            publications.forEach(pub => {
                const type = pub.getAttribute('data-type');
                
                if (filter === 'all' || type === filter) {
                    pub.style.display = 'grid';
                    pub.style.opacity = '1';
                } else {
                    pub.style.opacity = '0';
                    setTimeout(() => {
                        pub.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* === Smooth Scroll === */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* === Console Easter Egg === */
console.log(`
%c┌─────────────────────────────────────┐
%c│                                     │
%c│   NAKAYAMA LABORATORY              │
%c│   Urban Analytics × Human Flow × AI │
%c│                                     │
%c└─────────────────────────────────────┘
`, 
'color: #bc002d; font-weight: bold;',
'color: #bc002d;',
'color: #000; font-weight: bold;',
'color: #bc002d;',
'color: #bc002d;',
'color: #bc002d; font-weight: bold;'
);
