// ==================== MUSIC PLAYER ====================
const songs = [
    {
        title: 'Streaming Radio',
        artist: 'I-Radio',
        url: 'http://n03.radiojar.com/4ywdgup3bnzuv'
    },
    {
        title: 'Lagu Kedua',
        artist: 'Cerita Kita',
        url: 'https://drive.google.com/uc?export=download&id=1-77-QFy9IzjMnVvjasz5OSlxmyj9jccL'
    },
    {
        title: 'Lagu Ketiga',
        artist: 'Cinta Selamanya',
        url: 'GANTI_DENGAN_LINK_GOOGLE_DRIVE_LAGU_3'
    }
];

let currentSongIndex = -1;
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const volumeSlider = document.getElementById('volumeSlider');
const volumePercent = document.getElementById('volumePercent');
const currentSongTitle = document.querySelector('.current-song-title');
const currentSongArtist = document.querySelector('.current-song-artist');
const timeDisplay = document.querySelector('.time-display');

// Set initial volume
audioPlayer.volume = 0.7;

// Play/Pause toggle
playPauseBtn.addEventListener('click', () => {
    if (currentSongIndex === -1) return;
    
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
    }
});

// Play song function
function playSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    currentSongIndex = index;
    const song = songs[index];
    
    // Update player info
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    
    // Set audio source
    audioPlayer.src = song.url;
    
    // Try to play
    audioPlayer.play().catch(() => {
        currentSongTitle.textContent = '⚠️ Lagu tidak bisa diputar';
        currentSongArtist.textContent = 'Periksa link Google Drive';
        console.log('URL lagu:', song.url);
    });
    
    playPauseBtn.textContent = '⏸';
    
    // Highlight active card
    document.querySelectorAll('.music-card').forEach((card, i) => {
        if (i === index) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.opacity = '0.6';
        }
    });
}

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = percent + '%';
        
        const currentMin = Math.floor(audioPlayer.currentTime / 60);
        const currentSec = Math.floor(audioPlayer.currentTime % 60);
        const durationMin = Math.floor(audioPlayer.duration / 60);
        const durationSec = Math.floor(audioPlayer.duration % 60);
        
        timeDisplay.textContent = `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${durationMin}:${durationSec.toString().padStart(2, '0')}`;
    }
});

// Click on progress bar to seek
progressBar.addEventListener('click', (e) => {
    if (!audioPlayer.duration) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;
    volumePercent.textContent = e.target.value + '%';
});

// Song ended - play next song
audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        playSong(currentSongIndex + 1);
    } else {
        playPauseBtn.textContent = '▶';
        currentSongTitle.textContent = 'Semua lagu sudah selesai';
    }
});

// ==================== DATE COUNTER ====================
function updateDateCounter() {
    const startDate = new Date('2021-05-16');
    const now = new Date();
    
    const years = now.getFullYear() - startDate.getFullYear();
    const months = now.getMonth() - startDate.getMonth();
    const days = now.getDate() - startDate.getDate();
    
    let displayMonths = months;
    let displayDays = days;
    
    if (displayDays < 0) {
        displayMonths--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        displayDays += prevMonth.getDate();
    }
    
    if (displayMonths < 0) {
        displayMonths += 12;
    }
    
    const totalDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    
    const counterText = `
        <strong>${years} tahun, ${displayMonths} bulan, ${displayDays} hari</strong><br>
        <span style="font-size: 0.9em;">Total ${totalDays} hari indah bersama 💕</span>
    `;
    
    document.getElementById('counter').innerHTML = counterText;
}

// Update counter on page load and every day
updateDateCounter();
setInterval(updateDateCounter, 86400000); // Update every 24 hours

// ==================== MEMORY CARDS ====================
document.querySelectorAll('.memory-card').forEach((card, index) => {
    card.addEventListener('click', function(e) {
        const cardInner = this.querySelector('.card-inner');
        cardInner.style.transform = 
            cardInner.style.transform === 'rotateY(180deg)' 
                ? 'rotateY(0deg)' 
                : 'rotateY(180deg)';
    });
});

// ==================== BALLOON GAME ====================
let gameActive = false;
let score = 0;
let timeLeft = 30;
let gameTimer = null;
let balloons = [];

const gameArea = document.getElementById('gameArea');
const startGameBtn = document.getElementById('startGameBtn');
const gameContainer = document.getElementById('gameContainer');
const gameMessage = document.getElementById('gameMessage');

const balloonEmojis = ['❤️', '💕', '💖', '💗', '💝', '🎀'];

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    balloons = [];
    
    document.getElementById('score').textContent = '0';
    document.getElementById('timer').textContent = '30';
    
    gameContainer.style.display = 'block';
    startGameBtn.textContent = 'Permainan Sedang Berlangsung...';
    startGameBtn.disabled = true;
    gameMessage.textContent = '';
    gameArea.innerHTML = '';
    
    // Create balloons every 300ms
    const createBalloonInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(createBalloonInterval);
            return;
        }
        createBalloon();
    }, 300);
    
    // Timer
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame(createBalloonInterval);
        }
    }, 1000);
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // Random emoji dari array
    const randomEmoji = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    balloon.textContent = randomEmoji;
    
    // Random position
    const startX = Math.random() * (gameArea.clientWidth - 50);
    const startY = gameArea.clientHeight;
    
    balloon.style.left = startX + 'px';
    balloon.style.top = startY + 'px';
    
    // Random duration untuk animasi (3-6 detik)
    const duration = Math.random() * 3 + 3;
    balloon.style.animation = `floatUp ${duration}s linear forwards`;
    
    gameArea.appendChild(balloon);
    
    // Click to pop
    balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        popBalloon(balloon);
    });
    
    // Remove balloon when animation ends
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    }, duration * 1000);
}

function popBalloon(balloon) {
    if (!gameActive) return;
    
    score++;
    document.getElementById('score').textContent = score;
    
    // Pop effect
    balloon.style.animation = 'none';
    balloon.style.opacity = '0';
    balloon.style.transform = 'scale(0)';
    
    // Sound effect (using Web Audio API)
    playPopSound();
    
    // Floating text
    const floatingText = document.createElement('div');
    floatingText.textContent = '+1 💕';
    floatingText.style.position = 'absolute';
    floatingText.style.left = balloon.style.left;
    floatingText.style.top = balloon.style.top;
    floatingText.style.color = '#ff4d7d';
    floatingText.style.fontSize = '1.5em';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.animation = 'floatUp 1s ease-out forwards';
    
    gameArea.appendChild(floatingText);
    
    setTimeout(() => {
        balloon.remove();
        floatingText.remove();
    }, 1000);
}

function playPopSound() {
    // Create simple pop sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function endGame(createBalloonInterval) {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(createBalloonInterval);
    
    startGameBtn.textContent = 'Mainkan Lagi';
    startGameBtn.disabled = false;
    
    // Clear remaining balloons
    document.querySelectorAll('.balloon').forEach(b => b.remove());
    
    // Show result message
    let message = '';
    if (score >= 30) {
        message = `🎉 WOW! Luar biasa sekali! ${score} balon pecah! Cinta mu sangat eksplosif! 💥💕`;
    } else if (score >= 20) {
        message = `😍 Bagus banget! ${score} balon pecah! Cinta mu begitu kuat! 💪❤️`;
    } else if (score >= 10) {
        message = `🥰 Lumayan! ${score} balon pecah! Cinta mu terus bertumbuh! 📈💖`;
    } else if (score > 0) {
        message = `😊 Keren! ${score} balon pecah! Cinta dimulai dari sini 🌱💕`;
    } else {
        message = `😭 Huh? Tidak ada balon yang pecah? Tenang, cinta mu sudah cukup untuk aku! 💕`;
    }
    
    gameMessage.textContent = message;
}

startGameBtn.addEventListener('click', startGame);

// ==================== PAGE ANIMATIONS ====================
// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.message-section, .gallery-section, .game-section, .final-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ==================== CONFETTI EFFECT (Bonus!) ====================
function createConfetti() {
    const confetti = document.createElement('div');
    const colors = ['#ff4d7d', '#ff85a2', '#ffe0eb', '#ff69b4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = randomColor;
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.animation = `floatUp ${Math.random() * 3 + 3}s linear forwards`;
    confetti.style.zIndex = '9999';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
}

// Trigger confetti when page fully loads
window.addEventListener('load', () => {
    // Create a few confetti when page loads
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createConfetti(), i * 200);
    }
});

// Also create confetti when score increases significantly in game
const originalPopBalloon = popBalloon;
let lastConfettiScore = 0;

// Custom popBalloon dengan confetti bonus
const originalScore = { value: 0 };

// ==================== EASTER EGG ====================
let heartClicks = 0;
document.addEventListener('click', (e) => {
    if (e.target.textContent.includes('💕') || e.target.textContent.includes('❤️') || e.target.textContent.includes('💖')) {
        heartClicks++;
        if (heartClicks >= 5) {
            createMultipleConfetti();
            heartClicks = 0;
        }
    }
});

function createMultipleConfetti() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 50);
    }
}

// ==================== MOBILE OPTIMIZATION ====================
// Improve touch responsiveness
document.addEventListener('touchstart', function() {}, false);

console.log('✨ Halaman Kenangan telah dimuat dengan sempurna! ✨');
