/**
 * Immersive 3D Neural Network Background
 * Powered by Three.js WebGL and Additive Particle Shading
 */

class NeuralNetwork3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        // Configuration Parameters
        this.config = {
            nodeCount: 160,
            connectionDistance: 135,
            maxConnections: 1200,
            baseSpeed: 0.12,
            colors: {
                ruby: new THREE.Color('#00d2ff'),
                crimson: new THREE.Color('#0066ff'),
                dark: new THREE.Color('#001144'),
                white: new THREE.Color('#ffffff')
            },
            decayRate: 0.97,
            signalFrequency: 0.03 // Random signals per frame
        };

        this.nodes = [];
        this.signals = [];
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
        this.clickRequest = null;
        
        // Raycasting for click interactions
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Flat interaction plane at z=0

        this.initThree();
        this.createNetwork();
        this.setupEventListeners();
        this.animate();
    }

    initThree() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        // 1. Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 2. Scene
        this.scene = new THREE.Scene();

        // 3. Camera
        this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
        this.camera.position.z = 450;

        // 4. Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00d2ff, 0.9, 800);
        pointLight.position.set(0, 0, 300);
        this.scene.add(pointLight);
        this.pointLight = pointLight;
    }

    createNodeTexture() {
        // Render a high-quality radial gradient texture for soft glowing particles
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(0, 210, 255, 0.9)');
        grad.addColorStop(0.5, 'rgba(0, 102, 255, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        return new THREE.CanvasTexture(canvas);
    }

    createNetwork() {
        // --- 1. Nodes (Particles) Creation ---
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.config.nodeCount * 3);
        const sizes = new Float32Array(this.config.nodeCount);
        const alphas = new Float32Array(this.config.nodeCount);

        const boundingWidth = 650;
        const boundingHeight = 450;
        const boundingDepth = 400;

        for (let i = 0; i < this.config.nodeCount; i++) {
            // Generate node data
            const node = {
                pos: new THREE.Vector3(
                    (Math.random() - 0.5) * boundingWidth,
                    (Math.random() - 0.5) * boundingHeight,
                    (Math.random() - 0.5) * boundingDepth
                ),
                vel: new THREE.Vector3(
                    (Math.random() - 0.5) * this.config.baseSpeed,
                    (Math.random() - 0.5) * this.config.baseSpeed,
                    (Math.random() - 0.5) * this.config.baseSpeed
                ),
                baseSize: Math.random() * 5 + 3,
                size: 0,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.01 + Math.random() * 0.02,
                
                activation: 0, // Click activation glow
                twinkle: Math.random(),
                twinkleSpeed: 0.03 + Math.random() * 0.05
            };

            this.nodes.push(node);

            positions[i * 3] = node.pos.x;
            positions[i * 3 + 1] = node.pos.y;
            positions[i * 3 + 2] = node.pos.z;
            sizes[i] = node.baseSize;
            alphas[i] = 0.5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Custom points shader material or styled PointsMaterial
        // Custom shaders are beautiful, but custom sizes per point is best with raw ShaderMaterial.
        // For portability, we can use a custom ShaderMaterial.
        const vertexShader = `
            attribute float size;
            attribute float customAlpha;
            varying float vAlpha;
            void main() {
                vAlpha = customAlpha;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            uniform sampler2D pointTexture;
            uniform vec3 color;
            varying float vAlpha;
            void main() {
                gl_FragColor = vec4(color, vAlpha) * texture2D(pointTexture, gl_PointCoord);
            }
        `;

        this.particleTexture = this.createNodeTexture();
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.particleTexture },
                color: { value: new THREE.Color(0x00d2ff) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Set custom attribute buffers
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        particleGeometry.setAttribute('customAlpha', new THREE.BufferAttribute(alphas, 1));

        this.particleSystem = new THREE.Points(particleGeometry, this.particleMaterial);
        this.scene.add(this.particleSystem);


        // --- 2. Connections (Lines) Creation ---
        // Pre-allocate buffer arrays to avoid garbage collection spikes
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array(this.config.maxConnections * 2 * 3); // 2 vertices per line, 3 coordinates each
        this.lineColors = new Float32Array(this.config.maxConnections * 2 * 3);    // 2 colors per line, RGB

        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
        this.lineGeometry.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3));

        this.lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.lineSystem = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
        this.scene.add(this.lineSystem);


        // --- 3. Dynamic Signal Points (impulse animations) ---
        this.signalGeometry = new THREE.BufferGeometry();
        this.signalPositions = new Float32Array(150 * 3); // Max 150 parallel signals
        this.signalSizes = new Float32Array(150);
        this.signalAlphas = new Float32Array(150);

        this.signalGeometry.setAttribute('position', new THREE.BufferAttribute(this.signalPositions, 3));
        this.signalGeometry.setAttribute('size', new THREE.BufferAttribute(this.signalSizes, 1));
        this.signalGeometry.setAttribute('customAlpha', new THREE.BufferAttribute(this.signalAlphas, 1));

        this.signalMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.particleTexture },
                color: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.signalSystem = new THREE.Points(this.signalGeometry, this.signalMaterial);
        this.scene.add(this.signalSystem);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', (e) => this.onClick(e));
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height, false);
    }

    onMouseMove(e) {
        // Normalize mouse coordinates in range [-1, 1]
        this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        this.mouse.active = true;
    }

    onClick(e) {
        // Convert screen coordinates to normalized device coordinates (NDC)
        const mouseNDC = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );

        // Store details for click integration in the animation loop
        this.clickRequest = mouseNDC;
    }

    triggerClickImpulse(ndcCoordinates) {
        // Project a ray from camera to z = 0 interact plane
        this.raycaster.setFromCamera(ndcCoordinates, this.camera);
        const intersectPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.plane, intersectPoint);

        // Radial trigger impulse
        const triggerRadius = 200;
        this.nodes.forEach(node => {
            const dist = node.pos.distanceTo(intersectPoint);
            if (dist < triggerRadius) {
                // Boost node
                node.activation = 1.0;
                
                // Fire signals to nearby connections after stagger delay
                setTimeout(() => {
                    this.fireSignals(node);
                }, dist * 0.9);
            }
        });
    }

    fireSignals(sourceNode) {
        // Locate neighbors within connection distance and dispatch signal elements
        let count = 0;
        this.nodes.forEach(target => {
            if (sourceNode === target || count > 4) return; // Limit branching factor
            
            const dist = sourceNode.pos.distanceTo(target.pos);
            if (dist < this.config.connectionDistance) {
                this.signals.push({
                    from: sourceNode,
                    to: target,
                    progress: 0,
                    speed: 0.012 + Math.random() * 0.015
                });
                count++;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updatePhysics();
        this.updateBuffers();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    updatePhysics() {
        // 1. Camera Parallax Drift
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

        // Camera looks at center but shifts position slightly
        this.camera.position.x = this.mouse.x * 160;
        this.camera.position.y = this.mouse.y * 120;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Follow mouse cursor with point light
        if (this.mouse.active) {
            this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.x, this.mouse.y), this.camera);
            const lightTarget = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(this.plane, lightTarget);
            this.pointLight.position.x += (lightTarget.x - this.pointLight.position.x) * 0.1;
            this.pointLight.position.y += (lightTarget.y - this.pointLight.position.y) * 0.1;
        }

        // 2. Handle pending clicks
        if (this.clickRequest) {
            this.triggerClickImpulse(this.clickRequest);
            this.clickRequest = null;
        }

        // 3. Update nodes positions & animation states
        const boxW = 650, boxH = 450, boxD = 400;
        this.nodes.forEach(node => {
            // Constant node velocity drift
            node.pos.add(node.vel);

            // Wrap coordinates inside virtual box boundary
            if (Math.abs(node.pos.x) > boxW / 2) node.vel.x *= -1;
            if (Math.abs(node.pos.y) > boxH / 2) node.vel.y *= -1;
            if (Math.abs(node.pos.z) > boxD / 2) node.vel.z *= -1;

            // Twinkling scale (glitter)
            node.pulsePhase += node.pulseSpeed;
            node.size = node.baseSize + Math.sin(node.pulsePhase) * 2;

            // Brightness flickering
            node.twinkle += (Math.random() - 0.5) * node.twinkleSpeed;
            node.twinkle = Math.max(0.1, Math.min(1.0, node.twinkle));

            // Decay impulse state
            node.activation *= this.config.decayRate;
        });

        // 4. Update Signals positions
        for (let i = this.signals.length - 1; i >= 0; i--) {
            const sig = this.signals[i];
            sig.progress += sig.speed;
            
            if (sig.progress >= 1.0) {
                // Arrive! Ignite target
                sig.to.activation = Math.min(1.0, sig.to.activation + 0.35);
                this.signals.splice(i, 1);
            }
        }

        // 5. Inject occasional random impulses to keep network active
        if (Math.random() < this.config.signalFrequency && this.signals.length < 20) {
            const randomSource = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            this.fireSignals(randomSource);
        }
    }

    updateBuffers() {
        // Update Nodes Attributes
        const positionAttr = this.particleSystem.geometry.getAttribute('position');
        const sizeAttr = this.particleSystem.geometry.getAttribute('size');
        const alphaAttr = this.particleSystem.geometry.getAttribute('customAlpha');

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            positionAttr.setXYZ(i, node.pos.x, node.pos.y, node.pos.z);
            
            // Scaled size based on click/signal excitement
            const finalSize = node.size * (1.0 + node.activation * 1.5);
            sizeAttr.setX(i, finalSize);

            // Opacity combines base twilight twinkling and click bursts
            const finalAlpha = 0.3 + (node.twinkle * 0.4) + (node.activation * 0.3);
            alphaAttr.setX(i, finalAlpha);
        }

        positionAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
        alphaAttr.needsUpdate = true;

        // Update Connections (Line Segment vertices)
        let lineVertexIndex = 0;
        const linePosArr = this.lineGeometry.getAttribute('position').array;
        const lineColorArr = this.lineGeometry.getAttribute('color').array;
        
        for (let i = 0; i < this.nodes.length; i++) {
            const nodeA = this.nodes[i];
            
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeB = this.nodes[j];
                
                const dist = nodeA.pos.distanceTo(nodeB.pos);
                if (dist < this.config.connectionDistance && lineVertexIndex < this.config.maxConnections) {
                    const ratio = 1.0 - (dist / this.config.connectionDistance);
                    
                    // Vertex A
                    linePosArr[lineVertexIndex * 6] = nodeA.pos.x;
                    linePosArr[lineVertexIndex * 6 + 1] = nodeA.pos.y;
                    linePosArr[lineVertexIndex * 6 + 2] = nodeA.pos.z;
                    
                    // Vertex B
                    linePosArr[lineVertexIndex * 6 + 3] = nodeB.pos.x;
                    linePosArr[lineVertexIndex * 6 + 4] = nodeB.pos.y;
                    linePosArr[lineVertexIndex * 6 + 5] = nodeB.pos.z;

                    // Compute connector colors based on nodes activation
                    const activeRatio = (nodeA.activation + nodeB.activation) / 2;
                    
                    // Fade color from Ruby to Dark Red based on distance ratio, brightening with activity
                    const baseColor = this.config.colors.ruby.clone().lerp(this.config.colors.dark, 1.0 - ratio);
                    const finalColor = baseColor.lerp(this.config.colors.white, activeRatio);
                    
                    // Vertex A color (RGB multiplied by proximity opacity)
                    const opacity = ratio * (0.08 + activeRatio * 0.7);
                    lineColorArr[lineVertexIndex * 6] = finalColor.r * opacity;
                    lineColorArr[lineVertexIndex * 6 + 1] = finalColor.g * opacity;
                    lineColorArr[lineVertexIndex * 6 + 2] = finalColor.b * opacity;

                    // Vertex B color
                    lineColorArr[lineVertexIndex * 6 + 3] = finalColor.r * opacity;
                    lineColorArr[lineVertexIndex * 6 + 4] = finalColor.g * opacity;
                    lineColorArr[lineVertexIndex * 6 + 5] = finalColor.b * opacity;

                    lineVertexIndex++;
                }
            }
        }

        // Draw only active connections
        this.lineGeometry.setDrawRange(0, lineVertexIndex * 2);
        this.lineGeometry.getAttribute('position').needsUpdate = true;
        this.lineGeometry.getAttribute('color').needsUpdate = true;

        // Update Impulse Signals
        const sigPosAttr = this.signalSystem.geometry.getAttribute('position');
        const sigSizeAttr = this.signalSystem.geometry.getAttribute('size');
        const sigAlphaAttr = this.signalSystem.geometry.getAttribute('customAlpha');

        let activeSignals = 0;
        this.signals.forEach((sig, idx) => {
            if (activeSignals >= 150) return;
            
            const x = sig.from.pos.x + (sig.to.pos.x - sig.from.pos.x) * sig.progress;
            const y = sig.from.pos.y + (sig.to.pos.y - sig.from.pos.y) * sig.progress;
            const z = sig.from.pos.z + (sig.to.pos.z - sig.from.pos.z) * sig.progress;

            sigPosAttr.setXYZ(activeSignals, x, y, z);
            sigSizeAttr.setX(activeSignals, 7.0); // signal dot size
            
            // Glow peaks in the middle of travel
            const alphaRatio = Math.sin(sig.progress * Math.PI);
            sigAlphaAttr.setX(activeSignals, alphaRatio * 0.95);

            activeSignals++;
        });

        this.signalGeometry.setDrawRange(0, activeSignals);
        sigPosAttr.needsUpdate = true;
        sigSizeAttr.needsUpdate = true;
        sigAlphaAttr.needsUpdate = true;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.neuralNet3D = new NeuralNetwork3D('network-canvas');
});
