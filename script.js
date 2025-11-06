const PLANK_LENGTH = 400;
const PLANK_WIDTH = 20;
const PIVOT_RADIUS = 15;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PIVOT_X = CANVAS_WIDTH / 2;
const PIVOT_Y = CANVAS_HEIGHT / 2;
const MAX_ANGLE = 30;
const ANIMATION_SPEED = 0.1;

let objects = [];
let currentAngle = 0;
let targetAngle = 0;

const canvas = document.getElementById('seesaw-canvas');
const ctx = canvas.getContext('2d');

function loadState() {
    const saved = localStorage.getItem('seesawState');
    if (saved) {
        const state = JSON.parse(saved);
        if (state.objects) {
            objects = state.objects;
        } else {
            objects = [];
        }
        if (state.angle) {
            targetAngle = state.angle;
        } else {
            targetAngle = 0;
        }
        currentAngle = targetAngle;
        updateWeightDisplay();
        render();
    }
}

function saveState() {
    const state = {
        objects: objects,
        angle: targetAngle
    };
    const stateString = JSON.stringify(state);
    localStorage.setItem('seesawState', stateString);
}

function calculateTorque() {
    let leftTorque = 0;
    let rightTorque = 0;
    
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const distance = obj.distance;
        const torque = obj.weight * distance;
        
        if (distance < 0) {
            const absTorque = Math.abs(torque);
            leftTorque = leftTorque + absTorque;
        } else {
            const absTorque = Math.abs(torque);
            rightTorque = rightTorque + absTorque;
        }
    }
    
    const result = {
        leftTorque: leftTorque,
        rightTorque: rightTorque
    };
    return result;
}

function calculateAngle() {
    const torqueResult = calculateTorque();
    const leftTorque = torqueResult.leftTorque;
    const rightTorque = torqueResult.rightTorque;
    const torqueDifference = rightTorque - leftTorque;
    const rawAngle = torqueDifference / 10;
    
    const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, rawAngle));
    
    return angle;
}

function isClickOnPlank(x, y) {
    const dx = x - PIVOT_X;
    const dy = y - PIVOT_Y;
    
    const angleInRadians = currentAngle * Math.PI / 180;
    const negativeAngle = -angleInRadians;
    const cos = Math.cos(negativeAngle);
    const sin = Math.sin(negativeAngle);
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;
    
    const halfLength = PLANK_LENGTH / 2;
    const halfWidth = PLANK_WIDTH / 2;
    
    const absX = Math.abs(rotatedX);
    const absY = Math.abs(rotatedY);
    
    if (absX <= halfLength && absY <= halfWidth) {
        return true;
    } else {
        return false;
    }
}

function addObject(x, y) {
    const dx = x - PIVOT_X;
    const dy = y - PIVOT_Y;
    
    const angleInRadians = currentAngle * Math.PI / 180;
    const negativeAngle = -angleInRadians;
    const cos = Math.cos(negativeAngle);
    const sin = Math.sin(negativeAngle);
    const rotatedX = dx * cos - dy * sin;
    
    const halfLength = PLANK_LENGTH / 2;
    const distance = Math.max(-halfLength, Math.min(halfLength, rotatedX));
    
    const randomNumber = Math.random();
    const randomWeight = Math.floor(randomNumber * 10) + 1;
    
    const newObject = {
        distance: distance,
        weight: randomWeight,
        id: Date.now() + Math.random()
    };
    
    objects.push(newObject);
    
    targetAngle = calculateAngle();
    
    updateWeightDisplay();
    saveState();
}

function updateWeightDisplay() {
    let leftWeight = 0;
    let rightWeight = 0;
    
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (obj.distance < 0) {
            leftWeight = leftWeight + obj.weight;
        } else {
            rightWeight = rightWeight + obj.weight;
        }
    }
    
    const leftWeightText = leftWeight + ' kg';
    const rightWeightText = rightWeight + ' kg';
    document.getElementById('left-weight').textContent = leftWeightText;
    document.getElementById('right-weight').textContent = rightWeightText;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    
    ctx.translate(PIVOT_X, PIVOT_Y);
    
    const angleInRadians = currentAngle * Math.PI / 180;
    ctx.rotate(angleInRadians);
    
    ctx.fillStyle = '#8B4513';
    const plankX = -PLANK_LENGTH / 2;
    const plankY = -PLANK_WIDTH / 2;
    ctx.fillRect(plankX, plankY, PLANK_LENGTH, PLANK_WIDTH);
    
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(plankX, plankY, PLANK_LENGTH, PLANK_WIDTH);
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = -4; i <= 4; i++) {
        if (i === 0) {
            continue;
        }
        const gridX = (PLANK_LENGTH / 8) * i;
        ctx.beginPath();
        ctx.moveTo(gridX, -PLANK_WIDTH / 2 - 10);
        ctx.lineTo(gridX, PLANK_WIDTH / 2 + 10);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    ctx.restore();
    
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(PIVOT_X, PIVOT_Y, PIVOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#555';
    const standX = PIVOT_X - 5;
    const standY = PIVOT_Y + PIVOT_RADIUS;
    ctx.fillRect(standX, standY, 10, 50);
    
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        
        const angleInRadians = currentAngle * Math.PI / 180;
        const cos = Math.cos(angleInRadians);
        const sin = Math.sin(angleInRadians);
        
        const objX = PIVOT_X + obj.distance * cos;
        const objY = PIVOT_Y + obj.distance * sin;
        
        const size = 10 + obj.weight * 2;
        const intensity = 100 + (obj.weight * 15);
        const colorString = 'rgb(' + intensity + ', 100, 150)';
        ctx.fillStyle = colorString;
        ctx.beginPath();
        ctx.arc(objX, objY, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const text = obj.weight + 'kg';
        const textWidth = ctx.measureText(text).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        const labelX = objX - textWidth / 2 - 3;
        const labelY = objY + size + 8;
        ctx.fillRect(labelX, labelY, textWidth + 6, 14);
        ctx.fillStyle = '#000';
        ctx.fillText(text, objX, objY + size + 10);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function animate() {
    const angleDifference = Math.abs(currentAngle - targetAngle);
    if (angleDifference > 0.1) {
        const angleChange = (targetAngle - currentAngle) * ANIMATION_SPEED;
        currentAngle = currentAngle + angleChange;
    } else {
        currentAngle = targetAngle;
    }
    
    render();
    
    requestAnimationFrame(animate);
}

canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = clickX * scaleX;
    const canvasY = clickY * scaleY;
    
    if (isClickOnPlank(canvasX, canvasY)) {
        addObject(canvasX, canvasY);
    }
});

const resetButton = document.getElementById('reset-btn');
resetButton.addEventListener('click', function() {
    objects = [];
    currentAngle = 0;
    targetAngle = 0;
    updateWeightDisplay();
    saveState();
    render();
});

loadState();

animate();
