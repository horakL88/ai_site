class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 150;
        this.connectionDistance = 180;
        this.nodeSpeed = 0.3;
        this.connectionOpacity = 0.25;
        this.isResizing = false;
        this.resizeTimeout = null;
        this.mouseX = null;
        this.mouseY = null;
        this.mouseRadius = 150; // Radius of mouse influence
        this.mouseForce = 0.5; // Strength of mouse repulsion
        
        this.init();
        this.animate();
    }

    init() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => {
            // Clear any existing timeout
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            
            // Set resizing flag
            this.isResizing = true;
            
            // Debounce the resize event
            this.resizeTimeout = setTimeout(() => {
                this.resize();
                this.redistributeNodes();
                this.isResizing = false;
            }, 150); // Wait for resize to finish
        });

        // Add mouse event listeners
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });

        // Create nodes
        this.createNodes();
    }

    createNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.nodeSpeed,
                vy: (Math.random() - 0.5) * this.nodeSpeed,
                radius: Math.random() * 2 + 1.5,
                targetX: null,
                targetY: null
            });
        }
    }

    redistributeNodes() {
        // Calculate new positions and velocities
        this.nodes.forEach(node => {
            // Set target positions
            node.targetX = Math.random() * this.canvas.width;
            node.targetY = Math.random() * this.canvas.height;
            
            // Adjust velocity based on new canvas size
            const speedFactor = Math.min(this.canvas.width, this.canvas.height) / 1000;
            node.vx = (Math.random() - 0.5) * this.nodeSpeed * speedFactor;
            node.vy = (Math.random() - 0.5) * this.nodeSpeed * speedFactor;
        });
    }

    resize() {
        // Get the parent container's dimensions
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size to match container
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Adjust connection distance based on canvas size
        this.connectionDistance = Math.min(rect.width, rect.height) * 0.2;
    }

    applyMouseForce(node) {
        if (this.mouseX === null || this.mouseY === null) {
            return { vx: 0, vy: 0 };
        }

        const dx = node.x - this.mouseX;
        const dy = node.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouseRadius) {
            const force = (1 - distance / this.mouseRadius) * this.mouseForce;
            const angle = Math.atan2(dy, dx);
            
            return {
                vx: Math.cos(angle) * force,
                vy: Math.sin(angle) * force
            };
        }
        
        return { vx: 0, vy: 0 };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            if (this.isResizing && node.targetX !== null && node.targetY !== null) {
                // Smoothly move to target position during resize
                node.x += (node.targetX - node.x) * 0.1;
                node.y += (node.targetY - node.y) * 0.1;
                
                // Clear target when close enough
                if (Math.abs(node.x - node.targetX) < 0.1 && Math.abs(node.y - node.targetY) < 0.1) {
                    node.targetX = null;
                    node.targetY = null;
                }
            } else {
                // Get mouse force
                const mouseForce = this.applyMouseForce(node);
                
                // Update position with both base velocity and mouse force
                node.x += node.vx + mouseForce.vx;
                node.y += node.vy + mouseForce.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            }

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(107, 72, 255, 0.6)';
            this.ctx.fill();
        });

        // Draw connections
        this.nodes.forEach((node1, i) => {
            this.nodes.slice(i + 1).forEach(node2 => {
                const dx = node1.x - node2.x;
                const dy = node1.y - node2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    const opacity = (1 - distance / this.connectionDistance) * this.connectionOpacity;
                    this.ctx.strokeStyle = `rgba(107, 72, 255, ${opacity})`;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        new NeuralNetwork(canvas);
    }
});