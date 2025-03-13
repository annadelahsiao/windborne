document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const turbulence = document.querySelector('#water-filter');
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Handle mouse movement
    document.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        frame += 0.5;

        // Calculate mouse movement
        const moveX = (mouseX - prevMouseX) * 0.1;
        const moveY = (mouseY - prevMouseY) * 0.1;
        prevMouseX += moveX;
        prevMouseY += moveY;

        // Update turbulence
        const baseFrequencyX = 0.02 + Math.abs(moveX) * 0.1;
        const baseFrequencyY = 0.05 + Math.abs(moveY) * 0.1;
        turbulence.setAttributeNS(null, 'baseFrequency', `${baseFrequencyX} ${baseFrequencyY}`);
        turbulence.setAttributeNS(null, 'seed', frame);
    }
    animate();

    // 简化的平滑鼠标跟踪
    const cursor = document.querySelector('.custom-cursor');
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // 增加 smoothing 值使跟踪稍快一些（0.05 -> 0.08）
        const smoothing = 0.1;

        // 平滑跟踪计算
        cursorX += (mouseX - cursorX) * smoothing;
        cursorY += (mouseY - cursorY) * smoothing;

        // 应用位置
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Initialize tower segments
    const tower = document.querySelector('.launch-tower');
    for (let i = 0; i < 20; i++) {
        const segment = document.createElement('div');
        segment.className = 'tower-segment';
        tower.appendChild(segment);
    }

    // Initialize booster components
    const boosterBody = document.querySelector('.booster-body');
    
    // Add grid fins
    const finPositions = [
        { top: '20%', left: '-60px', rotation: 0 },
        { top: '20%', right: '-60px', rotation: 0 },
        { top: '40%', left: '-60px', rotation: 0 },
        { top: '40%', right: '-60px', rotation: 0 }
    ];

    finPositions.forEach(pos => {
        const fin = document.createElement('div');
        fin.className = 'grid-fin';
        Object.assign(fin.style, pos);
        
        const finDetail = document.createElement('div');
        finDetail.className = 'grid-fin-detail';
        fin.appendChild(finDetail);
        
        boosterBody.appendChild(fin);
    });

    // Add engine section
    const engineSection = document.createElement('div');
    engineSection.className = 'engine-section';
    
    // Create 33 engines in a circular pattern
    for (let i = 0; i < 33; i++) {
        const engine = document.createElement('div');
        engine.className = 'engine';
        engineSection.appendChild(engine);
    }
    
    boosterBody.appendChild(engineSection);
});

let isAnimating = false;

function toggleSequence() {
    const btn = document.querySelector('[data-action="start"]');
    if (!isAnimating) {
        // Start sequence
        isAnimating = true;
        btn.textContent = 'Stop Recovery';
        startRecoverySequence();
    } else {
        // Stop and reset sequence
        resetSequence();
    }
}

function startRecoverySequence() {
    const booster = document.querySelector('.booster');
    const armPair = document.querySelector('.arm-pair');
    const engines = document.querySelectorAll('.engine');
    
    // Step 1: Initial descent with tilt
    updateStatus('DESCENT STARTED', '50000', '-100', '0');
    document.querySelector('.phase-step:nth-child(1)').classList.add('active');
    booster.style.bottom = '150%';
    booster.style.transform = 'translateX(-50%) rotate(15deg)';  // Initial tilt 15 degrees
    armPair.style.width = '300px';
    
    setTimeout(() => {
        if (!isAnimating) return;
        // Step 2: Grid fins deploy, start correcting tilt
        updateStatus('GRID FINS DEPLOYED', '30000', '-80', '10');
        document.querySelector('.phase-step:nth-child(2)').classList.add('active');
        booster.style.bottom = '100%';
        booster.style.transform = 'translateX(-50%) rotate(10deg)';  // Reduce to 10 degrees
        engines.forEach(e => e.classList.add('active'));
        
        setTimeout(() => {
            if (!isAnimating) return;
            // Step 3: Engine ignition, further correction
            updateStatus('LANDING BURN', '15000', '-50', '40');
            document.querySelector('.phase-step:nth-child(3)').classList.add('active');
            booster.style.bottom = '70%';
            booster.style.transform = 'translateX(-50%) rotate(5deg)';  // Reduce to 5 degrees
            
            setTimeout(() => {
                if (!isAnimating) return;
                // Step 4: Final approach, almost vertical
                updateStatus('FINAL APPROACH', '5000', '-20', '30');
                document.querySelector('.phase-step:nth-child(4)').classList.add('active');
                booster.style.bottom = '50%';
                booster.style.transform = 'translateX(-50%) rotate(2deg)';  // Almost vertical
                armPair.style.width = '240px';
                
                setTimeout(() => {
                    if (!isAnimating) return;
                    // Step 5: Hover for catch, completely vertical
                    updateStatus('HOVER FOR CATCH', '1000', '-5', '20');
                    document.querySelector('.phase-step:nth-child(5)').classList.add('active');
                    booster.style.bottom = '35%';
                    booster.style.transform = 'translateX(-50%) rotate(0deg)';  // Fully vertical
                    armPair.style.width = '200px';
                    armPair.classList.add('catching');
                    
                    setTimeout(() => {
                        if (!isAnimating) return;
                        // Step 6: Catch complete
                        updateStatus('CATCH SECURED', '700', '0', '0');
                        armPair.style.width = '160px';
                        engines.forEach(e => e.classList.remove('active'));
                    }, 2000);
                }, 1500);
            }, 1500);
        }, 1500);
    }, 1500);
}

function resetSequence() {
    const booster = document.querySelector('.booster');
    const armPair = document.querySelector('.arm-pair');
    const engines = document.querySelectorAll('.engine');
    
    // Reset animations with initial tilt
    booster.style.bottom = '200%';
    booster.style.transform = 'translateX(-50%) rotate(15deg)';  // Reset with initial tilt
    armPair.style.width = '300px';
    armPair.classList.remove('catching');
    engines.forEach(e => e.classList.remove('active'));
    
    // Reset play state
    isAnimating = false;
    document.querySelector('[data-action="start"]').textContent = 'Start Recovery';
    
    // Reset status
    updateStatus('STANDBY', '---', '---', '---');
    
    // Remove active states from phase steps
    document.querySelectorAll('.phase-step').forEach(step => {
        step.classList.remove('active');
    });
}

function updateStatus(status, altitude, velocity, power) {
    document.getElementById('status').textContent = status;
    document.getElementById('altitude').textContent = altitude;
    document.getElementById('velocity').textContent = velocity;
    document.getElementById('power').textContent = power;
}

// Make functions globally accessible
window.toggleSequence = toggleSequence;
window.resetSequence = resetSequence; 