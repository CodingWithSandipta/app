// Global state
let currentSection = 0;
const sections = ['intro', 'proposal', 'messages', 'photos', 'music', 'game', 'calendar', 'surprise'];
let audioPlayer = null;
let isPlaying = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFloatingHearts();
    initializeEventListeners();
    audioPlayer = document.getElementById('audioPlayer');
});

// Create floating hearts background
function initializeFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    const heartEmojis = ['💗', '💕', '💖', '💝', '❤️', '💓'];
    
    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        createFloatingHeart(heartsContainer, heartEmojis);
    }
    
    // Continuously create new hearts
    setInterval(() => {
        createFloatingHeart(heartsContainer, heartEmojis);
    }, 2000);
}

function createFloatingHeart(container, emojis) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (5 + Math.random() * 5) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// Initialize all event listeners
function initializeEventListeners() {
    // Section 1: Start button
    document.getElementById('startBtn').addEventListener('click', () => {
        goToSection('proposal');
    });
    
    // Section 2: Proposal buttons
    document.getElementById('yesBtn').addEventListener('click', handleYesClick);
    document.getElementById('noBtn').addEventListener('mouseenter', dodgeNoButton);
    document.getElementById('noBtn').addEventListener('touchstart', dodgeNoButton);
    document.getElementById('noBtn').addEventListener('click', dodgeNoButton);
    
    // Section 3: Message cards
    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
    
    document.getElementById('nextToPhotos').addEventListener('click', () => {
        goToSection('photos');
    });
    
    // Section 4: Photos
    document.getElementById('nextToMusic').addEventListener('click', () => {
        goToSection('music');
    });
    
    // Section 5: Music player
    document.getElementById('playBtn').addEventListener('click', toggleMusic);
    document.getElementById('nextToGame').addEventListener('click', () => {
        goToSection('game');
    });
    
    // Section 6: Game options
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', handleGameAnswer);
    });
    
    document.getElementById('nextToCalendar').addEventListener('click', () => {
        goToSection('calendar');
    });
    
    // Section 7: Calendar
    document.getElementById('nextToSurprise').addEventListener('click', () => {
        goToSection('surprise');
        triggerHeartBurst();
    });
    
    // Section 8: Restart button
    document.getElementById('restartBtn').addEventListener('click', () => {
        location.reload();
    });
}

// Navigation function
function goToSection(sectionId) {
    // Hide current section
    const currentSectionElement = document.querySelector('.section.active');
    if (currentSectionElement) {
        currentSectionElement.classList.remove('active');
    }
    
    // Show next section
    const nextSection = document.getElementById(sectionId);
    nextSection.classList.add('active');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle YES button click with confetti
function handleYesClick() {
    triggerConfetti();
    setTimeout(() => {
        goToSection('messages');
    }, 2000);
}

// Make NO button dodge the user
function dodgeNoButton(e) {
    e.preventDefault();
    const btn = document.getElementById('noBtn');
    const container = btn.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate random position
    const maxX = containerRect.width - btn.offsetWidth - 40;
    const maxY = containerRect.height - btn.offsetHeight - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btn.style.position = 'absolute';
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    btn.style.transition = 'all 0.3s ease';
}

// Confetti animation
function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#ff6b9d', '#e91e63', '#ff9a9e', '#fecfef', '#ffd4e8'];
    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360
        });
    }
    
    // Animate confetti
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((piece, index) => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();
            
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += 5;
            
            if (piece.y > canvas.height) {
                confettiPieces.splice(index, 1);
            }
        });
        
        if (confettiPieces.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            canvas.style.display = 'none';
        }
    }
    
    animateConfetti();
}

// Music player controls
function toggleMusic() {
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const vinyl = document.getElementById('vinylRecord');
    
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.textContent = '▶';
        vinyl.classList.remove('spinning');
        isPlaying = false;
    } else {
        // Try to play, handle if audio file doesn't exist
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playIcon.textContent = '⏸';
                vinyl.classList.add('spinning');
                isPlaying = true;
            }).catch(error => {
                console.log('Audio file not found or error playing:', error);
                // Still show visual feedback even if audio doesn't play
                playIcon.textContent = '⏸';
                vinyl.classList.add('spinning');
                isPlaying = true;
                
                // Simulate playing by stopping after a few seconds
                setTimeout(() => {
                    playIcon.textContent = '▶';
                    vinyl.classList.remove('spinning');
                    isPlaying = false;
                }, 5000);
            });
        }
    }
}

// Handle game answer selection
function handleGameAnswer(e) {
    const selectedBtn = e.target;
    const allBtns = document.querySelectorAll('.option-btn');
    
    // Remove previous selection
    allBtns.forEach(btn => btn.classList.remove('selected'));
    
    // Add selection to clicked button
    selectedBtn.classList.add('selected');
    
    // Show result
    const resultText = document.getElementById('gameResult');
    const responses = [
        "That's so sweet! I love that about us too! 💕",
        "You always know how to make me smile! 😊",
        "Aww, that's one of my favorite things too! ❤️",
        "Perfect answer! You know me so well! 💖"
    ];
    
    resultText.textContent = responses[Math.floor(Math.random() * responses.length)];
    
    // Show continue button
    setTimeout(() => {
        document.getElementById('nextToCalendar').classList.remove('hidden');
    }, 500);
}

// Heart burst animation for final section
function triggerHeartBurst() {
    const burstContainer = document.getElementById('heartBurst');
    const heartEmojis = ['💗', '💕', '💖', '💝', '❤️', '💓'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            heart.style.left = '50%';
            heart.style.top = '50%';
            
            burstContainer.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }, i * 100);
    }
}

// Handle audio end event
if (audioPlayer) {
    audioPlayer.addEventListener('ended', () => {
        document.getElementById('playIcon').textContent = '▶';
        document.getElementById('vinylRecord').classList.remove('spinning');
        isPlaying = false;
    });
}

// Prevent scroll bounce on iOS
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.section')) {
        // Allow scrolling within sections
        return;
    }
}, { passive: true });
