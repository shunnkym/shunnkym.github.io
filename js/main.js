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
    initHeroSlideshow();
    initLabStatsCounter();
});

/* === Lab Stats Counter Animation === */
function initLabStatsCounter() {
    const statNumbers = document.querySelectorAll('.lab-stat-number[data-count]');
    
    if (statNumbers.length === 0) return;
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 1500; // 1.5 seconds
        const startTime = Date.now();
        const startValue = 0;
        
        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        update();
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

/* === Hero Slideshow === */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const indicators = document.querySelectorAll('.slide-indicators .indicator');
    const cards = document.querySelectorAll('.hero-card');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    
    function goToSlide(index) {
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
            if (i === index) {
                indicator.classList.add('active');
            }
        });
        
        // Update cards
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 6000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Click on indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(index);
            startAutoplay();
        });
    });
    
    // Hover on cards changes slide
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            stopAutoplay();
            goToSlide(index);
        });
        
        card.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    });
    
    // Start autoplay
    startAutoplay();
    
    // Initial state
    goToSlide(0);
}

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

/* === Hero Geometric Canvas Animation - Rotating Earth Globe === */
function initHeroGeometricCanvas() {
    const canvas = document.getElementById('hero-geo-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let rotationY = 0; // Horizontal rotation
    let rotationX = 0.3; // Tilt angle
    
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
    
    // World cities with lat/lng coordinates (approximate)
    const cities = [
        { name: 'Tokyo', lat: 35.68, lng: 139.69, size: 1.0, pulse: true },
        { name: 'New York', lat: 40.71, lng: -74.00, size: 0.9, pulse: true },
        { name: 'London', lat: 51.51, lng: -0.13, size: 0.85, pulse: true },
        { name: 'Paris', lat: 48.86, lng: 2.35, size: 0.75 },
        { name: 'Sydney', lat: -33.87, lng: 151.21, size: 0.7 },
        { name: 'Singapore', lat: 1.35, lng: 103.82, size: 0.75 },
        { name: 'Dubai', lat: 25.20, lng: 55.27, size: 0.65 },
        { name: 'Shanghai', lat: 31.23, lng: 121.47, size: 0.85 },
        { name: 'São Paulo', lat: -23.55, lng: -46.63, size: 0.7 },
        { name: 'Mumbai', lat: 19.08, lng: 72.88, size: 0.7 },
        { name: 'Beijing', lat: 39.90, lng: 116.41, size: 0.8 },
        { name: 'Los Angeles', lat: 34.05, lng: -118.24, size: 0.7 },
        { name: 'Berlin', lat: 52.52, lng: 13.41, size: 0.6 },
        { name: 'Moscow', lat: 55.76, lng: 37.62, size: 0.7 },
        { name: 'Seoul', lat: 37.57, lng: 126.98, size: 0.75 },
        { name: 'Cairo', lat: 30.04, lng: 31.24, size: 0.6 },
        { name: 'Cape Town', lat: -33.93, lng: 18.42, size: 0.5 },
        { name: 'Toronto', lat: 43.65, lng: -79.38, size: 0.55 },
        { name: 'Hong Kong', lat: 22.32, lng: 114.17, size: 0.7 },
        { name: 'Bangkok', lat: 13.76, lng: 100.50, size: 0.6 }
    ];
    
    // Connections between cities (flight routes)
    const connections = [
        { from: 0, to: 1 }, // Tokyo - New York
        { from: 0, to: 7 }, // Tokyo - Shanghai
        { from: 0, to: 14 }, // Tokyo - Seoul
        { from: 1, to: 2 }, // New York - London
        { from: 1, to: 11 }, // New York - LA
        { from: 2, to: 3 }, // London - Paris
        { from: 2, to: 12 }, // London - Berlin
        { from: 3, to: 6 }, // Paris - Dubai
        { from: 5, to: 18 }, // Singapore - Hong Kong
        { from: 5, to: 4 }, // Singapore - Sydney
        { from: 7, to: 18 }, // Shanghai - Hong Kong
        { from: 9, to: 6 }, // Mumbai - Dubai
        { from: 10, to: 7 }, // Beijing - Shanghai
        { from: 13, to: 12 }, // Moscow - Berlin
        { from: 8, to: 1 }, // São Paulo - New York
    ];
    
    // Satellites orbiting
    const satellites = [];
    for (let i = 0; i < 8; i++) {
        satellites.push({
            orbitRadius: 0.52 + Math.random() * 0.15,
            orbitTilt: (Math.random() - 0.5) * Math.PI * 0.6,
            speed: 0.3 + Math.random() * 0.4,
            angle: Math.random() * Math.PI * 2,
            size: 2 + Math.random() * 2
        });
    }
    
    // Data particles flying between cities
    const dataParticles = [];
    
    // Convert lat/lng to 3D coordinates
    function latLngTo3D(lat, lng, radius) {
        const latRad = lat * Math.PI / 180;
        const lngRad = lng * Math.PI / 180;
        return {
            x: radius * Math.cos(latRad) * Math.sin(lngRad),
            y: radius * Math.sin(latRad),
            z: radius * Math.cos(latRad) * Math.cos(lngRad)
        };
    }
    
    // Rotate point around Y axis (horizontal rotation)
    function rotateY(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: point.x * cos - point.z * sin,
            y: point.y,
            z: point.x * sin + point.z * cos
        };
    }
    
    // Rotate point around X axis (tilt)
    function rotateX(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: point.x,
            y: point.y * cos - point.z * sin,
            z: point.y * sin + point.z * cos
        };
    }
    
    // Project 3D to 2D
    function project(point, w, h) {
        const scale = Math.min(w, h) * 0.35;
        const perspective = 600;
        const z = point.z + perspective;
        return {
            x: centerX + (point.x * perspective / z) * scale / perspective * 1.5,
            y: centerY - (point.y * perspective / z) * scale / perspective * 1.5,
            z: point.z,
            scale: perspective / z
        };
    }
    
    // Draw wireframe globe
    function drawGlobe(radius, w, h) {
        // Draw latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            ctx.beginPath();
            let firstPoint = true;
            for (let lng = 0; lng <= 360; lng += 5) {
                const point3D = latLngTo3D(lat, lng, radius);
                const rotated = rotateX(rotateY(point3D, rotationY), rotationX);
                const projected = project(rotated, w, h);
                
                // Only draw visible part (front of globe)
                if (rotated.z > -radius * 0.1) {
                    if (firstPoint) {
                        ctx.moveTo(projected.x, projected.y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(projected.x, projected.y);
                    }
                } else {
                    firstPoint = true;
                }
            }
            ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
        
        // Draw longitude lines
        for (let lng = 0; lng < 360; lng += 30) {
            ctx.beginPath();
            let firstPoint = true;
            for (let lat = -90; lat <= 90; lat += 5) {
                const point3D = latLngTo3D(lat, lng, radius);
                const rotated = rotateX(rotateY(point3D, rotationY), rotationX);
                const projected = project(rotated, w, h);
                
                if (rotated.z > -radius * 0.1) {
                    if (firstPoint) {
                        ctx.moveTo(projected.x, projected.y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(projected.x, projected.y);
                    }
                } else {
                    firstPoint = true;
                }
            }
            ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
        
        // Draw equator with more prominence
        ctx.beginPath();
        let firstPoint = true;
        for (let lng = 0; lng <= 360; lng += 3) {
            const point3D = latLngTo3D(0, lng, radius);
            const rotated = rotateX(rotateY(point3D, rotationY), rotationX);
            const projected = project(rotated, w, h);
            
            if (rotated.z > -radius * 0.1) {
                if (firstPoint) {
                    ctx.moveTo(projected.x, projected.y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(projected.x, projected.y);
                }
            } else {
                firstPoint = true;
            }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw globe outline
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.02, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Draw city on globe
    function drawCity(city, radius, w, h) {
        const point3D = latLngTo3D(city.lat, city.lng, radius);
        const rotated = rotateX(rotateY(point3D, rotationY), rotationX);
        const projected = project(rotated, w, h);
        
        // Only draw if on visible side of globe
        if (rotated.z < -radius * 0.1) return null;
        
        const citySize = 3 * city.size * projected.scale;
        const opacity = 0.5 + 0.5 * (rotated.z / radius);
        
        // Pulsing effect for major cities
        if (city.pulse) {
            const pulseSize = citySize * (2 + Math.sin(time * 3) * 0.5);
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
            ctx.fill();
        }
        
        // City dot
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, citySize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        return { x: projected.x, y: projected.y, z: rotated.z, opacity };
    }
    
    // Draw connection arc between cities
    function drawConnection(from, to, radius, w, h) {
        const fromCity = cities[from];
        const toCity = cities[to];
        
        const from3D = latLngTo3D(fromCity.lat, fromCity.lng, radius);
        const to3D = latLngTo3D(toCity.lat, toCity.lng, radius);
        
        const fromRotated = rotateX(rotateY(from3D, rotationY), rotationX);
        const toRotated = rotateX(rotateY(to3D, rotationY), rotationX);
        
        // Only draw if at least one city is visible
        if (fromRotated.z < -radius * 0.3 && toRotated.z < -radius * 0.3) return;
        
        const fromProj = project(fromRotated, w, h);
        const toProj = project(toRotated, w, h);
        
        // Draw curved arc
        const midX = (fromProj.x + toProj.x) / 2;
        const midY = (fromProj.y + toProj.y) / 2;
        const dist = Math.hypot(toProj.x - fromProj.x, toProj.y - fromProj.y);
        const arcHeight = dist * 0.3;
        
        // Control point above the midpoint
        const ctrlX = midX;
        const ctrlY = midY - arcHeight;
        
        const opacity = Math.max(0, Math.min(0.3, 
            0.3 * (fromRotated.z + radius) / (2 * radius) * (toRotated.z + radius) / (2 * radius)));
        
        ctx.beginPath();
        ctx.moveTo(fromProj.x, fromProj.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, toProj.x, toProj.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        return { fromProj, toProj, ctrlX, ctrlY, opacity };
    }
    
    // Draw satellite
    function drawSatellite(sat, radius, w, h) {
        sat.angle += sat.speed * 0.01;
        
        // Calculate orbital position
        const x = Math.cos(sat.angle) * sat.orbitRadius * radius;
        const y = Math.sin(sat.angle) * Math.sin(sat.orbitTilt) * sat.orbitRadius * radius;
        const z = Math.sin(sat.angle) * Math.cos(sat.orbitTilt) * sat.orbitRadius * radius;
        
        const point = { x, y, z };
        const rotated = rotateX(rotateY(point, rotationY * 0.3), rotationX);
        const projected = project(rotated, w, h);
        
        if (rotated.z < 0) return; // Behind globe
        
        const opacity = 0.3 + 0.4 * (rotated.z / (sat.orbitRadius * radius));
        
        // Satellite dot
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, sat.size * projected.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        // Trail
        for (let i = 1; i < 6; i++) {
            const trailAngle = sat.angle - i * 0.08;
            const tx = Math.cos(trailAngle) * sat.orbitRadius * radius;
            const ty = Math.sin(trailAngle) * Math.sin(sat.orbitTilt) * sat.orbitRadius * radius;
            const tz = Math.sin(trailAngle) * Math.cos(sat.orbitTilt) * sat.orbitRadius * radius;
            const tRotated = rotateX(rotateY({ x: tx, y: ty, z: tz }, rotationY * 0.3), rotationX);
            if (tRotated.z < 0) continue;
            const tProj = project(tRotated, w, h);
            ctx.beginPath();
            ctx.arc(tProj.x, tProj.y, sat.size * tProj.scale * (1 - i * 0.15), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * (1 - i * 0.18)})`;
            ctx.fill();
        }
    }
    
    // Create data particle
    function createDataParticle() {
        const conn = connections[Math.floor(Math.random() * connections.length)];
        dataParticles.push({
            from: conn.from,
            to: conn.to,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01
        });
    }
    
    // Draw data particle on connection arc
    function drawDataParticle(particle, radius, w, h) {
        const fromCity = cities[particle.from];
        const toCity = cities[particle.to];
        
        const from3D = latLngTo3D(fromCity.lat, fromCity.lng, radius);
        const to3D = latLngTo3D(toCity.lat, toCity.lng, radius);
        
        const fromRotated = rotateX(rotateY(from3D, rotationY), rotationX);
        const toRotated = rotateX(rotateY(to3D, rotationY), rotationX);
        
        const fromProj = project(fromRotated, w, h);
        const toProj = project(toRotated, w, h);
        
        const midX = (fromProj.x + toProj.x) / 2;
        const midY = (fromProj.y + toProj.y) / 2;
        const dist = Math.hypot(toProj.x - fromProj.x, toProj.y - fromProj.y);
        const arcHeight = dist * 0.3;
        const ctrlX = midX;
        const ctrlY = midY - arcHeight;
        
        // Quadratic bezier position
        const t = particle.progress;
        const x = (1-t)*(1-t)*fromProj.x + 2*(1-t)*t*ctrlX + t*t*toProj.x;
        const y = (1-t)*(1-t)*fromProj.y + 2*(1-t)*t*ctrlY + t*t*toProj.y;
        
        const visible = fromRotated.z > -radius * 0.3 || toRotated.z > -radius * 0.3;
        if (!visible) return;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    }
    
    function draw() {
        const w = canvas.getBoundingClientRect().width;
        const h = canvas.getBoundingClientRect().height;
        const radius = Math.min(w, h) * 0.35;
        
        // Clear
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, w, h);
        
        time += 0.016;
        
        // Slow rotation + mouse influence
        rotationY += 0.003;
        rotationY += (mouseX - 0.5) * 0.01;
        rotationX = 0.3 + (mouseY - 0.5) * 0.3;
        
        // Draw background stars
        if (Math.random() > 0.95) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * w,
                Math.random() * h,
                Math.random() * 1.5,
                0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`;
            ctx.fill();
        }
        
        // Draw globe wireframe
        drawGlobe(radius, w, h);
        
        // Draw connections (back layer)
        connections.forEach(conn => {
            drawConnection(conn.from, conn.to, radius, w, h);
        });
        
        // Draw cities
        cities.forEach(city => {
            drawCity(city, radius, w, h);
        });
        
        // Draw satellites
        satellites.forEach(sat => {
            drawSatellite(sat, radius, w, h);
        });
        
        // Create new data particles
        if (Math.random() > 0.97) {
            createDataParticle();
        }
        
        // Update and draw data particles
        for (let i = dataParticles.length - 1; i >= 0; i--) {
            const particle = dataParticles[i];
            particle.progress += particle.speed;
            
            if (particle.progress > 1) {
                dataParticles.splice(i, 1);
                continue;
            }
            
            drawDataParticle(particle, radius, w, h);
        }
        
        // Draw orbital rings
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.3, rotationX * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([5, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 1.25, radius * 0.4, -rotationX * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.stroke();
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

/* === Text Shuffle Effect === */
function initTextShuffleEffect() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    
    // Apply to news-link, card-link, and shuffle-text elements
    const shuffleTargets = document.querySelectorAll('.news-link, .card-link, .shuffle-text');
    
    shuffleTargets.forEach(element => {
        const originalText = element.textContent.trim();
        let isAnimating = false;
        let shuffleInterval = null;
        
        const parentLink = element.closest('a');
        const targetElement = parentLink || element;
        
        targetElement.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            let iterations = 0;
            const maxIterations = originalText.length;
            
            shuffleInterval = setInterval(() => {
                element.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        // Keep spaces, hyphens, and already revealed characters
                        if (char === ' ' || char === '-' || char === '/') return char;
                        if (index < iterations) return originalText[index];
                        // Random character
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                iterations += 1/3;
                
                if (iterations >= maxIterations) {
                    clearInterval(shuffleInterval);
                    element.textContent = originalText;
                    isAnimating = false;
                }
            }, 25);
        });
        
        // Ensure original text is restored on mouse leave
        targetElement.addEventListener('mouseleave', () => {
            if (shuffleInterval) {
                clearInterval(shuffleInterval);
            }
            element.textContent = originalText;
            isAnimating = false;
        });
    });
    
    // Red ball animation for lineage items
    initLineageRedBall();
}

/* === Lineage Red Ball Effect === */
function initLineageRedBall() {
    const timeline = document.querySelector('.lineage-timeline');
    if (!timeline) return;
    
    // Create red ball element
    const redBall = document.createElement('div');
    redBall.className = 'red-ball-mover';
    timeline.appendChild(redBall);
    
    const lineageItems = document.querySelectorAll('.lineage-item');
    const branchItems = document.querySelectorAll('.lineage-branch-item');
    
    // Handle main lineage items
    lineageItems.forEach((item) => {
        const shuffleText = item.querySelector('.shuffle-text');
        
        item.addEventListener('mouseenter', () => {
            // Calculate position - node is at top: 35px relative to item, on the line between year and project name
            const itemRect = item.getBoundingClientRect();
            const timelineRect = timeline.getBoundingClientRect();
            const ballTop = itemRect.top - timelineRect.top + 35;
            
            // Move red ball to the line between year and project name
            redBall.style.left = '140px'; // Position on the timeline line (100px padding + 40px node position)
            redBall.style.top = `${ballTop}px`;
            redBall.style.opacity = '1';
            redBall.style.transform = 'scale(1)';
            
            // Trigger shuffle effect
            if (shuffleText) {
                triggerShuffle(shuffleText, item);
            }
        });
        
        item.addEventListener('mouseleave', () => {
            redBall.style.opacity = '0';
            redBall.style.transform = 'scale(0)';
            
            if (item._shuffleInterval) {
                clearInterval(item._shuffleInterval);
                const shuffleText = item.querySelector('.shuffle-text');
                if (shuffleText) {
                    const originalText = shuffleText.getAttribute('data-original') || shuffleText.textContent.trim();
                    shuffleText.textContent = originalText;
                }
                item._shuffleInterval = null;
            }
        });
    });
    
    // Handle branch items
    branchItems.forEach((item) => {
        const shuffleText = item.querySelector('.shuffle-text');
        
        item.addEventListener('mouseenter', () => {
            // Calculate position for branch item
            const itemRect = item.getBoundingClientRect();
            const timelineRect = timeline.getBoundingClientRect();
            const ballTop = itemRect.top - timelineRect.top + 28; // Branch node position
            
            // Get branch position to calculate left offset
            const branch = item.closest('.lineage-branch');
            if (branch) {
                const branchRect = branch.getBoundingClientRect();
                // Branch line is at the left border of .lineage-branch
                const ballLeft = branchRect.left - timelineRect.left - 1; // -1 for border-left position
                redBall.style.left = `${ballLeft}px`;
            }
            
            redBall.style.top = `${ballTop}px`;
            redBall.style.opacity = '1';
            redBall.style.transform = 'scale(1)';
            
            // Trigger shuffle effect
            if (shuffleText) {
                triggerShuffle(shuffleText, item);
            }
        });
        
        item.addEventListener('mouseleave', () => {
            redBall.style.opacity = '0';
            redBall.style.transform = 'scale(0)';
            redBall.style.left = '140px'; // Reset to main timeline position
            
            if (item._shuffleInterval) {
                clearInterval(item._shuffleInterval);
                const shuffleText = item.querySelector('.shuffle-text');
                if (shuffleText) {
                    const originalText = shuffleText.getAttribute('data-original') || shuffleText.textContent.trim();
                    shuffleText.textContent = originalText;
                }
                item._shuffleInterval = null;
            }
        });
    });
}

function triggerShuffle(element, container) {
    if (container._shuffleInterval) return; // Already animating
    
    const originalText = element.textContent.trim();
    element.setAttribute('data-original', originalText);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let iterations = 0;
    const maxIterations = originalText.length;
    
    container._shuffleInterval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (char === ' ' || char === '-' || char === '/') return char;
                if (index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += 1/3;
        
        if (iterations >= maxIterations) {
            clearInterval(container._shuffleInterval);
            element.textContent = originalText;
            container._shuffleInterval = null;
        }
    }, 25);
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
'color: #2dd4bf; font-weight: bold;',
'color: #2dd4bf;',
'color: #000; font-weight: bold;',
'color: #2dd4bf;',
'color: #2dd4bf;',
'color: #2dd4bf; font-weight: bold;'
);
