const noButton = document.getElementById('no-button');
const yesButton = document.getElementById('yes-button');
const container = document.querySelector('.container');
const envelopeScreen = document.getElementById('envelope-screen');
const waxSeal = document.getElementById('wax-seal');
const transitionScreen = document.getElementById('transition-screen');
const landingScreen = document.getElementById('landing-screen');
const successScreen = document.getElementById('success-screen');
const danceScreen = document.getElementById('dance-screen');
const seriousMessage = document.getElementById('serious-message');
const letterScreen = document.getElementById('letter-screen');
const teasingMessage = document.getElementById('teasing-message');
const yesSound = document.getElementById('yes-sound');
const letsgoSound = document.getElementById('letsgo-sound');
const catDance = document.getElementById('cat-dance');
const susSound = document.getElementById('sus-sound');
const susCat = document.getElementById('sus-cat');
const boomSound = document.getElementById('boom-sound');
const angryCat = document.getElementById('angry-cat');
const boomBoostedSound = document.getElementById('boom-boosted-sound');
const catStare = document.getElementById('cat-stare');
const catFlashbang = document.getElementById('cat-flashbang');
const catTweaker = document.getElementById('cat-tweaker');
const wackCat = document.getElementById('wack-cat');
const twinkleSound = document.getElementById('twinkle-sound');
const letterSound = document.getElementById('letter-sound');
const mailSound = document.getElementById('mail-sound');
const flashbangSound = document.getElementById('flashbang-sound');
const uBetterStopSound = document.getElementById('u-better-stop-sound');
const undertakerSound = document.getElementById('undertaker-sound');

// Initialize audio on first user interaction to unlock audio context
let audioInitialized = false;
function initAudio() {
    if (!audioInitialized) {
        audioInitialized = true;
        // Play and immediately pause to unlock audio context
        [yesSound, letsgoSound, susSound, boomSound, boomBoostedSound, twinkleSound, letterSound, mailSound, flashbangSound, uBetterStopSound, undertakerSound].forEach(audio => {
            audio.play().then(() => audio.pause()).catch(() => {});
            audio.currentTime = 0;
        });
    }
}

// Stop the muted autoplay and set up mail sound
if (mailSound) {
    mailSound.pause();
    mailSound.currentTime = 0;
}

// Play mail sound when envelope lands (1.2s = animation duration)
setTimeout(() => {
    if (mailSound) {
        mailSound.muted = false;
        mailSound.currentTime = 0;
        mailSound.volume = 1.0;
        mailSound.play().catch(err => console.error('Mail sound play failed:', err));
    }
}, 1200);

// Handle wax seal click on envelope
waxSeal.addEventListener('click', () => {
    initAudio();
    
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.envelope-flap');
    
    // Add break animation to seal
    waxSeal.classList.add('seal-breaking');
    
    // Play letter sound immediately on click
    if (letterSound) {
        letterSound.currentTime = 0;
        letterSound.volume = 1.0;
        letterSound.playbackRate = 2.0;
        letterSound.play().catch(err => {
            console.error('Letter sound play failed:', err);
            // Try again after a brief delay
            setTimeout(() => {
                letterSound.play().catch(e => console.error('Retry failed:', e));
            }, 50);
        });
    } else {
        console.error('Letter sound element not found');
    }
    
    // Start envelope opening animation
    setTimeout(() => {
        envelope.classList.add('opening');
        envelopeFlap.classList.add('opening');
    }, 300);
    
    // After envelope opens (1.5s), show heart-zoom transition
    setTimeout(() => {
        envelopeScreen.classList.add('hidden');
        transitionScreen.classList.remove('hidden');
        
        // After heart-zoom plays (2.5s), show yes/no page with fade
        setTimeout(() => {
            initAudio();
            transitionScreen.classList.add('hidden');
            container.classList.remove('hidden');
            container.classList.add('fade-in');
            
            // Play twinkle sound when yes/no page appears (with slight delay for audio context)
            setTimeout(() => {
                if (twinkleSound) {
                    twinkleSound.currentTime = 0;
                    twinkleSound.volume = 1.0;
                    twinkleSound.play().catch(err => {
                        console.error('Twinkle sound play failed:', err);
                        console.log('Audio element:', twinkleSound);
                        console.log('Audio src:', twinkleSound.src);
                    });
                } else {
                    console.error('Twinkle sound element not found');
                }
            }, 100);
            
            // Reset No button completely - remove all inline styles
            noButton.removeAttribute('style');
            isMoving = false;
            hasMovedOnce = false;
            justDodged = false;
            noButtonDodgeCount = 0;
            gameActive = true;
        }, 2500);
    }, 1500);
});


// Relationship Timer Calculation
function updateRelationshipTimer() {
    const startDate = new Date('2024-03-15');
    const now = new Date();
    
    // Calculate years, months, days
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Update the text
    const timerElement = document.getElementById('timer-text');
    if (timerElement) {
        timerElement.textContent = `You've been my valentine for ${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}, and ${days} ${days === 1 ? 'day' : 'days'}...`;
    }
}

// Update timer when letter screen is shown
const originalLetsgoEndHandler = () => {
    danceScreen.classList.add('hidden');
    seriousMessage.classList.remove('hidden');
    
    // Show serious message for 3 seconds, then show letter
    setTimeout(() => {
        seriousMessage.classList.add('hidden');
        letterScreen.classList.remove('hidden');
        updateRelationshipTimer();
    }, 3000);
};

// Wait for button to be rendered, then switch to fixed positioning
let isMoving = false;
let noButtonDodgeCount = 0;
let messageTimeout;
let hasMovedOnce = false;
let justDodged = false; // Track if we just counted this dodge
let gameActive = false; // Start false, will be enabled after envelope opens

// Teasing messages array
const messages = [
    "You know you want to say yes! 💕",
    "Come on, just click yes already! 😊",
    "The No button is scared of commitment! 😂",
    "Yes is right there... so easy! 💖",
    "I see you trying! Just say yes! 🥰",
    "You can't resist forever! 💗",
    "The Yes button is lonely! 💕",
    "Pretty please? 🥺💖"
];

// Create rose petals continuously
setInterval(() => {
    createRosePetal();
}, 300);

function createRosePetal() {
    const petal = document.createElement('div');
    petal.className = 'rose-petal';
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.top = '-20px';
    petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
    petal.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(petal);
    
    setTimeout(() => petal.remove(), 8000);
}

// Cursor sparkles
let lastSparkleTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime > 50) {
        createSparkle(e.clientX, e.clientY);
        lastSparkleTime = now;
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
    sparkle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

function showTeasingMessage() {
    const message = messages[Math.floor(Math.random() * messages.length)];
    teasingMessage.textContent = message;
    
    // Position relative to viewport - safe visible area
    teasingMessage.style.position = 'fixed';
    teasingMessage.style.left = '50%';
    teasingMessage.style.top = '100px';
    teasingMessage.style.transform = 'translateX(-50%)';
    
    teasingMessage.classList.remove('hidden');
    
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        teasingMessage.classList.add('hidden');
    }, 2500);
}

// Track mouse position globally and move "No" button away
document.addEventListener('mousemove', (e) => {
    // Don't track if game is not active
    if (!gameActive) return;
    
    const buttonRect = noButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Use smaller detection range for first attempt, then increase
    const detectionRange = hasMovedOnce ? 200 : 80;
    
    // If cursor is within detection range, move the button away
    if (distance < detectionRange) {
        hasMovedOnce = true;
        // Switch to fixed positioning on first movement (relative to viewport)
        if (!isMoving) {
            isMoving = true;
            noButton.style.position = 'fixed';
            noButton.style.left = `${buttonRect.left}px`;
            noButton.style.top = `${buttonRect.top}px`;
        }
        
        // Add shake effect
        noButton.classList.add('shake');
        setTimeout(() => noButton.classList.remove('shake'), 300);
        
        // Only count this dodge once until cursor moves away
        if (!justDodged) {
            justDodged = true;
            noButtonDodgeCount++;
            
            // Sus easter egg on 10th attempt
            if (noButtonDodgeCount === 10) {
                susSound.currentTime = 0;
                susSound.play()
                    .then(() => console.log('Sus sound playing'))
                    .catch(e => {
                        console.error('Sus audio failed:', e);
                        alert('Audio failed to play. Please check that sus.mp3 exists in assets folder.');
                    });
                susCat.classList.remove('hidden');
                setTimeout(() => {
                    susCat.classList.add('hidden');
                }, 3000);
            }
            
            // Angry cat easter egg on 15th attempt
            if (noButtonDodgeCount === 15) {
                boomSound.currentTime = 0;
                boomSound.play()
                    .then(() => console.log('Boom sound playing'))
                    .catch(e => {
                        console.error('Boom audio failed:', e);
                        alert('Audio failed to play. Please check that boom.mp3 exists in assets folder.');
                    });
                angryCat.classList.remove('hidden');
                setTimeout(() => {
                    angryCat.classList.add('hidden');
                }, 3000);
            }
            
            // Cat stare easter egg on 20th attempt
            if (noButtonDodgeCount === 20) {
                boomBoostedSound.currentTime = 0;
                boomBoostedSound.play()
                    .then(() => console.log('Boom boosted sound playing'))
                    .catch(e => {
                        console.error('Boom boosted audio failed:', e);
                        alert('Audio failed to play. Please check that boom_boosted.mp3 exists in assets folder.');
                    });
                catStare.classList.remove('hidden');
                setTimeout(() => {
                    catStare.classList.add('hidden');
                }, 3000);
            }
            
            // Cat flashbang easter egg on 25th attempt
            if (noButtonDodgeCount === 25) {
                flashbangSound.currentTime = 0;
                flashbangSound.play()
                    .then(() => console.log('Flashbang sound playing'))
                    .catch(e => {
                        console.error('Flashbang audio failed:', e);
                        alert('Audio failed to play. Please check that flashbang.mp3 exists in assets folder.');
                    });
                catFlashbang.classList.remove('hidden');
                setTimeout(() => {
                    catFlashbang.classList.add('hidden');
                }, 3000);
            }
            
            // Cat tweaker easter egg on 30th attempt
            if (noButtonDodgeCount === 30) {
                catTweaker.classList.remove('hidden');
                uBetterStopSound.currentTime = 0;
                uBetterStopSound.play()
                    .then(() => console.log('U better stop sound playing'))
                    .catch(e => {
                        console.error('U better stop audio failed:', e);
                        alert('Audio failed to play. Please check that u-better-stop.mp3 exists in assets folder.');
                    });
                // Hide gif when audio ends
                uBetterStopSound.onended = () => {
                    catTweaker.classList.add('hidden');
                };
            }
            
            // Wack cat easter egg on 35th attempt
            if (noButtonDodgeCount === 35) {
                wackCat.classList.remove('hidden');
                undertakerSound.currentTime = 0;
                undertakerSound.play()
                    .then(() => console.log('Undertaker sound playing'))
                    .catch(e => {
                        console.error('Undertaker audio failed:', e);
                        alert('Audio failed to play. Please check that undertaker.mp3 exists in assets folder.');
                    });
                // Hide gif when audio ends
                undertakerSound.onended = () => {
                    wackCat.classList.add('hidden');
                };
            }
            
            if (noButtonDodgeCount % 3 === 0) {
                showTeasingMessage();
            }
        }
        
        // Make Yes button grow bigger
        yesButton.classList.add('grow');
        
        // Get current position
        const currentLeft = parseFloat(noButton.style.left);
        const currentTop = parseFloat(noButton.style.top);
        
        // Calculate angle away from cursor
        const angle = Math.atan2(distanceY, distanceX);
        const moveDistance = 100;
        
        // Calculate new position - move away from cursor
        let newX = currentLeft - Math.cos(angle) * moveDistance;
        let newY = currentTop - Math.sin(angle) * moveDistance;
        
        // Keep within viewport bounds only
        const topPadding = 10;
        const leftPadding = (window.innerWidth - 2000) / 2 - 150;  
        const rightPadding = (window.innerWidth - 500) / 2;
        const bottomPadding = window.innerHeight - 650;

        const maxX = window.innerWidth - 120 - rightPadding - 30;
        const maxY = window.innerHeight - 60 - bottomPadding;

        // Clamp to bounds
        newX = Math.max(leftPadding, Math.min(newX, maxX));
        newY = Math.max(topPadding, Math.min(newY, maxY));
        
        // If stuck at a boundary, add escape logic - move toward center
        const isAtRightEdge = newX >= maxX - 5;
        const isAtBottomEdge = newY >= maxY - 5;
        const isAtLeftEdge = newX <= leftPadding + 5;
        const isAtTopEdge = newY <= topPadding + 5;
        
        if (isAtRightEdge || isAtBottomEdge || isAtLeftEdge || isAtTopEdge) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const pullStrength = 0.3;
            
            newX = newX + (centerX - newX) * pullStrength;
            newY = newY + (centerY - newY) * pullStrength;
        }
        
        noButton.style.left = `${newX}px`;
        noButton.style.top = `${newY}px`;
    } else {
        // Reset dodge flag when cursor moves away
        justDodged = false;
    }
});

// Easter egg: if somehow No button is clicked (impossible!)
noButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show funny message
    alert("Nice try! But that button doesn't work here! 😂💕\n\nYou know you want to click YES! 💖");
    
    // Make Yes button even bigger
    yesButton.style.transform = 'scale(1.5)';
    yesButton.style.animation = 'pulse-glow 0.5s ease-in-out infinite';
    
    return false;
});

// Handle "Yes" button click
yesButton.addEventListener('click', () => {
    // Disable game to prevent easter eggs during success screens
    gameActive = false;
    
    // Play yay sound immediately
    yesSound.currentTime = 0;
    yesSound.play()
        .then(() => console.log('Yay sound playing'))
        .catch(e => {
            console.error('Yay audio failed:', e);
            alert('Audio failed to play. Please check that yay_sound.mp3 exists in assets folder.');
        });
    
    // Hide main container and show success screen
    container.classList.add('hidden');
    successScreen.classList.remove('hidden');
    
    // Create confetti effect
    createConfetti();
    
    // Create heart explosion
    createHeartExplosion();
    
    // Wait for yay sound to finish, then show dance screen
    yesSound.addEventListener('ended', () => {
        successScreen.classList.add('hidden');
        danceScreen.classList.remove('hidden');
        
        // Play letsgo music
        letsgoSound.currentTime = 0;
        letsgoSound.play()
            .then(() => console.log('Letsgo sound playing'))
            .catch(e => {
                console.error('Letsgo audio failed:', e);
                alert('Audio failed to play. Please check that letsgo.mp3 exists in assets folder.');
            });
        
        // When letsgo music ends, hide dance screen
        letsgoSound.addEventListener('ended', originalLetsgoEndHandler, { once: true });
    }, { once: true });
});

function createHeartExplosion() {
    const hearts = ['💕', '💖', '💗', '💓', '💝'];
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10000';
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 200 + Math.random() * 100;
        
        document.body.appendChild(heart);
        
        const animation = heart.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
            },
            { 
                transform: `translate(calc(-50% + ${Math.cos(angle) * velocity}px), calc(-50% + ${Math.sin(angle) * velocity}px)) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => heart.remove();
    }
}

function createConfetti() {
    const colors = ['#ff1493', '#ff69b4', '#ff6b9d', '#ffc0cb'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.transition = 'all 3s ease-out';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.top = window.innerHeight + 'px';
            confetti.style.opacity = '0';
            confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
        }, 100);
        
        setTimeout(() => {
            confetti.remove();
        }, 3100);
    }
}