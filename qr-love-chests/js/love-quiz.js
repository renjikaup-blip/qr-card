/**
 * 🎮 CHEST 2: "HOW WELL DO YOU KNOW US?" LOVE TRIVIA QUIZ
 */
class LoveQuizEngine {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.questions = [
      {
        question: "Whats my favourite thing about you? 💘",
        options: [
          "Your eyes",
          "Your smile",
          "Your BUM",
          "All of you"
        ],
        correct: 3,
        sweetComment: "im playing i love all of you"
      },
      {
        question: "Why was i scared to ask you out?",
        options: [
          "Your friends",
          "I was too leng for you",
          "I thought you was to good for me",
          "i just hated you"
        ],
        correct: 2,
        sweetComment: "Bad joke i thought you was wayy to good for me"
      },
      {
        question: "What is our ideal date night? 🍿",
        options: [
          "Late night drive & music",
          "Cozy movie night with snacks",
          "Going to a loud fun concert",
          "Anything as long as we're together"
        ],
        correct: 3,
        sweetComment: "anything i just wanna be with you"
      },
      {
        question: "whats the first thing i did for you that i was embarresed about",
        options: [
          "wrote a poem",
          "bought you flowers",
          "complimented you",
          "laughed at you dumb jokes"
        ],
        correct: 0,
        sweetComment: "cant believe i wrote a poem for you."
      }
    ];
  }

  init() {
    // Check if custom quiz questions are in config
    if (window.RPG_CONFIG && window.RPG_CONFIG.quizQuestions) {
      this.questions = window.RPG_CONFIG.quizQuestions;
    }
    this.currentQuestion = 0;
    this.score = 0;
    this.renderQuestion();
  }

  renderQuestion() {
    const qContainer = document.getElementById('quizContainer');
    if (!qContainer) return;

    if (this.currentQuestion >= this.questions.length) {
      this.completeQuiz();
      return;
    }

    const q = this.questions[this.currentQuestion];
    qContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="display:inline-block; background:#FFE3EC; color:#FF6B8B; font-family:'Press Start 2P', monospace; font-size:10px; padding:6px 12px; border-radius:12px; margin-bottom:12px;">
          QUESTION ${this.currentQuestion + 1} OF ${this.questions.length}
        </span>
        <h3 style="font-family:'Press Start 2P', monospace; font-size:13px; line-height:1.6; color:#2D1A3D; margin-bottom:16px;">
          ${q.question}
        </h3>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;" id="quizOptionsList">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn" data-index="${i}" style="
            background: white;
            border: 2px solid #FFD1DC;
            border-radius: 14px;
            padding: 14px 16px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #372844;
            text-align: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            transition: all 0.15s;
          ">
            <span style="width:24px; height:24px; border-radius:50%; background:#FFF0F3; color:#FF6B8B; font-weight:700; font-size:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${['A', 'B', 'C', 'D'][i]}
            </span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="quizFeedback" style="display:none; text-align:center; margin-top:16px; font-weight:700; font-size:13px; color:#059669; font-family:'Press Start 2P', monospace;"></div>
    `;

    // Attach click listeners
    const buttons = qContainer.querySelectorAll('.quiz-option-btn');
    buttons.forEach(btn => {
      btn.onclick = () => {
        const selectedIdx = parseInt(btn.dataset.index);
        this.handleAnswer(selectedIdx, btn);
      };
    });
  }

  handleAnswer(idx, btn) {
    const q = this.questions[this.currentQuestion];
    window.soundEngine.playCoin();
    window.particleEngine.burstAt(window.innerWidth / 2, window.innerHeight / 2, 8);

    // Disable all options so they can't be clicked multiple times
    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => {
      b.style.pointerEvents = 'none';
      b.style.opacity = '0.6';
    });

    btn.style.opacity = '1';
    btn.style.background = '#ECFDF5';
    btn.style.borderColor = '#10B981';
    btn.style.color = '#065F46';

    const feedback = document.getElementById('quizFeedback');
    let nextTimeout = null;

    const advance = () => {
      if (nextTimeout) clearTimeout(nextTimeout);
      this.currentQuestion++;
      this.renderQuestion();
    };

    if (feedback) {
      feedback.innerHTML = `
        <div style="background:#FFF5F7; border:1.5px solid #FFD1DC; border-radius:12px; padding:12px 14px; margin-top:14px; text-align:center;">
          <div style="font-family:'Plus Jakarta Sans', sans-serif; font-size:14px; font-weight:700; color:#831843; line-height:1.4; margin-bottom:8px;">
            💌 "${q.sweetComment || "Correct! 💕"}"
          </div>
          <button id="btnNextQuizQuestion" style="background:#FF6B8B; color:white; border:none; border-radius:18px; padding:6px 16px; font-family:'Press Start 2P', monospace; font-size:9px; cursor:pointer;">
            NEXT ➔
          </button>
        </div>
      `;
      feedback.style.display = 'block';

      const nextBtn = document.getElementById('btnNextQuizQuestion');
      if (nextBtn) {
        nextBtn.onclick = advance;
      }
    }

    // Auto advance after 2.8 seconds so she has plenty of time to read
    nextTimeout = setTimeout(advance, 2800);
  }

  completeQuiz() {
    window.soundEngine.playFanfare();
    window.particleEngine.confettiExplosion();

    // Unlock Key in LocalStorage
    localStorage.setItem('qr_game_key_unlocked', 'true');

    const qContainer = document.getElementById('quizContainer');
    if (qContainer) {
      qContainer.innerHTML = `
        <div style="text-align: center; padding: 20px 10px;">
          <div style="font-size: 56px; margin-bottom: 12px; animation: bounce 1s infinite;">🏆✨</div>
          <h2 style="font-family:'Press Start 2P', monospace; font-size: 14px; color:#2D1A3D; margin-bottom: 12px;">100% PERFECT SCORE!</h2>
          <p style="font-size: 13px; color: #6B7280; margin-bottom: 20px; line-height: 1.5;">
            You know our love story perfectly, Bug! You've unlocked the <b>Golden Vault Key</b>!
          </p>

          <div style="background: linear-gradient(135deg, #FEF3C7, #FFFBEB); border: 2px dashed #F59E0B; border-radius: 16px; padding: 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 14px; text-align: left;">
            <div style="font-size: 36px;">🗝️</div>
            <div>
              <div style="font-family:'Press Start 2P', monospace; font-size: 11px; color:#B45309; margin-bottom:4px;">GOLDEN KEY ACQUIRED</div>
              <div style="font-size: 12px; color:#92400E;">Chest #3 in Peach's Castle is now unlocked for you!</div>
            </div>
          </div>

          <button class="btn-romantic modal-close" style="width:100%;">Head to Chest 3 🏰</button>
        </div>
      `;

      // re-attach close handler to new modal-close button
      const newCloseBtn = qContainer.querySelector('.modal-close');
      if (newCloseBtn) {
        newCloseBtn.onclick = () => {
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
        };
      }
    }
  }
}

window.loveQuizEngine = new LoveQuizEngine();
