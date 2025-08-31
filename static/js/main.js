
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const submitBtn = form.querySelector('.submit-btn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Form Enhancement
    enhanceFormInteractions();
    
    // Form Submission Handler
    form.addEventListener('submit', function(e) {
        if (validateForm()) {
            showLoading();
            // Form will submit normally to Flask backend
        } else {
            e.preventDefault();
        }
    });
    
    // Real-time Validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Animate result if present
    animateResult();
});

function enhanceFormInteractions() {
    const selects = document.querySelectorAll('select.form-control');
    const inputs = document.querySelectorAll('input.form-control');
    
    // Add focus/blur effects
    [...selects, ...inputs].forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            addFocusGlow(this);
        });
        
        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            removeFocusGlow(this);
        });
    });
    
    // Score input enhancements
    inputs.forEach(input => {
        if (input.type === 'number') {
            input.addEventListener('input', function() {
                const value = parseInt(this.value);
                if (value > 100) this.value = 100;
                if (value < 0) this.value = 0;
                
                // Visual feedback for score ranges
                updateScoreIndicator(this, value);
            });
        }
    });
}

function addFocusGlow(element) {
    element.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    element.style.transform = 'translateY(-1px)';
}

function removeFocusGlow(element) {
    if (!element.matches(':focus')) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }
}

function updateScoreIndicator(input, value) {
    // Remove existing indicators
    const existingIndicator = input.parentElement.querySelector('.score-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    if (value >= 0 && value <= 100) {
        const indicator = document.createElement('div');
        indicator.className = 'score-indicator';
        indicator.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 4px;
            pointer-events: none;
        `;
        
        if (value >= 90) {
            indicator.textContent = 'Excellent';
            indicator.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            indicator.style.color = '#059669';
        } else if (value >= 75) {
            indicator.textContent = 'Good';
            indicator.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            indicator.style.color = '#2563eb';
        } else if (value >= 50) {
            indicator.textContent = 'Average';
            indicator.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
            indicator.style.color = '#f59e0b';
        } else if (value > 0) {
            indicator.textContent = 'Below Avg';
            indicator.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            indicator.style.color = '#dc2626';
        }
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(indicator);
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value || field.value === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate score ranges
    const scoreInputs = document.querySelectorAll('input[type="number"]');
    scoreInputs.forEach(input => {
        if (input.value) {
            const value = parseInt(input.value);
            if (value < 0 || value > 100) {
                showFieldError(input, 'Score must be between 0 and 100');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function validateField(event) {
    const field = event.target;
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !field.value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'number') {
        const value = parseInt(field.value);
        if (field.value && (value < 0 || value > 100)) {
            showFieldError(field, 'Score must be between 0 and 100');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        display: flex;
        align-items: center;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.classList.remove('error');
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) errorDiv.remove();
}

function showLoading() {
    const form = document.getElementById('predictionForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    form.classList.add('form-loading');
    
    // Add subtle animation to form
    const formContainer = form.closest('.bg-white');
    if (formContainer) {
        formContainer.style.opacity = '0.8';
        formContainer.style.transform = 'scale(0.99)';
        formContainer.style.transition = 'all 0.3s ease';
    }
}

function animateResult() {
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        // Animate the progress bar
        const progressFill = resultCard.querySelector('.progress-fill');
        if (progressFill) {
            const targetWidth = progressFill.style.width;
            progressFill.style.width = '0%';
            
            setTimeout(() => {
                progressFill.style.width = targetWidth;
            }, 300);
        }
        
        // Add entrance animation
        resultCard.style.opacity = '0';
        resultCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultCard.style.opacity = '1';
            resultCard.style.transform = 'translateY(0)';
            resultCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 100);
        
        // Animate score number
        const scoreDisplay = resultCard.querySelector('.text-6xl');
        if (scoreDisplay) {
            animateNumber(scoreDisplay, parseInt(scoreDisplay.textContent));
        }
    }
}

function animateNumber(element, targetNumber) {
    let currentNumber = 0;
    const increment = targetNumber / 30; // Animation duration control
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentNumber);
    }, 50);
}

// Smooth scrolling for better UX
function scrollToResult() {
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        setTimeout(() => {
            resultCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 500);
    }
}

// Add floating animation to cards
function addFloatingAnimation() {
    const cards = document.querySelectorAll('.info-card, .stats-card');
    cards.forEach((card, index) => {
        card.style.animation = `float 6s ease-in-out ${index * 0.5}s infinite`;
    });
}

// CSS for floating animation
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
`;
document.head.appendChild(floatingStyle);

// Initialize floating animation
setTimeout(addFloatingAnimation, 1000);