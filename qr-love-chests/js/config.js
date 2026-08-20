/**
 * =========================================================================
 * 💖 ROMANTIC 3-CHEST QR GAME - CONFIGURATION
 * =========================================================================
 * You can edit all the text, names, passcode, milestones, photos, and coupons
 * below to personalize the entire experience for your girlfriend!
 */

window.GAME_CONFIG = {
  // ─── 1. Basic Info ───
  herName: "Bug", // Personalized nickname
  yourName: "Your Boyfriend", // Change to your name or nickname
  occasionTitle: "A Special Surprise For You ✨",
  subtitle: "3 mystery chests await... Tap each one to unlock what's inside! 💌",

  // ─── 2. Passcode Screen (Optional Lock) ───
  passcode: {
    enabled: true, // Set to false if you want to skip the lock screen
    code: "271225", // The 6-digit code
    title: "Enter the Secret Code 🔒",
    hint: "Hint: 27/12/25 💕",
    welcomeMessage: "Access Granted! Welcome to your special world, my love 🌸"
  },

  // ─── 3. Background Music ───
  music: {
    enabled: true,
    title: "Pluto Projector (Lo-Fi Acoustic)",
    src: "" // Optional MP3 file in assets/ or leave blank for sweet synthesized melody
  },

  // ─── 4. Chest #1: The Walking Path (Memory Lane) ───
  memoryPath: {
    title: "🌸 Walk Down Memory Lane",
    description: "Tap or hold the screen to walk down our journey together!",
    endMessage: "Every step with you has been my favorite adventure ❤️",
    milestones: [
      {
        id: 1,
        title: "My Favourite Photo 📸✨",
        date: "My Absolute Favourite",
        description: "Out of all the pictures we have together, this one will always have a special place in my heart. You look so gorgeous.",
        image: "assets/photos/milestone1.svg",
        sticker: "💫"
      },
      {
        id: 2,
        title: "Our First Concert 🎶✨",
        date: "First Concert",
        description: "Singing our hearts out together, the loud music, the lights, and having you right by my side. One of the best nights ever.",
        image: "assets/photos/milestone2.svg",
        sticker: "🎵"
      },
      {
        id: 3,
        title: "Our Cheeky Hangouts 🤫✨",
        date: "Cheeky Hangouts",
        description: "Sneaking around, late night shenanigans, laughing uncontrollably, and all our private inside jokes. Those moments with you are the best.",
        image: "assets/photos/milestone3.svg",
        sticker: "🤫"
      },
      {
        id: 4,
        title: "All The Little Things 🧸",
        date: "Every Single Day",
        description: "Your cute smile, your morning texts, how you laugh at my silly jokes, and the way you hold my hand.",
        image: "assets/photos/milestone4.svg",
        sticker: "💖"
      },
      {
        id: 5,
        title: "To Our Future Together 💍",
        date: "Forever & Always",
        description: "No matter where life takes us, I choose you every single day. Here's to a million more memories!",
        image: "assets/photos/milestone5.svg",
        sticker: "🏰"
      }
    ]
  },

  // ─── 5. Chest #2: 'Catch My Heart' Mini-Game ───
  miniGame: {
    title: "🎮 Catch My Love Arcade",
    instructions: "Slide your basket to catch 15 floating hearts & sweet treats! Avoid the storm clouds ⚡",
    targetScore: 15,
    items: [
      { emoji: "💖", points: 1, name: "Heart" },
      { emoji: "🍓", points: 2, name: "Strawberry" },
      { emoji: "🧋", points: 2, name: "Boba Milk Tea" },
      { emoji: "🧸", points: 3, name: "Teddy Bear" },
      { emoji: "✨", points: 1, name: "Sparkle" }
    ],
    obstacleEmoji: "⛈️",
    winTitle: "You Won My Heart! 🏆",
    winMessage: "You scored all the love points! You've unlocked the Golden Key to Chest 3! 🗝️✨"
  },

  // ─── 6. Chest #3: The Secret Vault & Love Letter ───
  vault: {
    title: "🎁 The Secret Love Vault",
    lockedMessage: "Earn the Golden Key from the mini-game, or unlock it now with love!",
    
    // The Wax-Sealed Letter
    letter: {
      heading: "To My Dearest Love 💌",
      date: "Today & Forever",
      body: [
        "If you're reading this, it means you unlocked my special surprise for you.",
        "I wanted to build something unique just for you—because you bring so much joy, warmth, and magic into my life every single day.",
        "Thank you for being my best friend, my favorite person, and my biggest smile. I love you more than words, code, or anything in this world can say.",
        "Now go scratch off your special love coupons below! 😉💕"
      ],
      signoff: "Forever Yours,\nWith all my love ❤️"
    },

    // Scratch-Off Love Coupons
    coupons: [
      {
        id: "c1",
        title: "💆‍♀️ 30-Min Relaxation Massage",
        subtitle: "Redeemable anytime! Full shoulder & back massage on demand.",
        icon: "💆‍♀️",
        code: "COUPON-MASSAGE-01"
      },
      {
        id: "c2",
        title: "🍽️ Dinner Date Anywhere",
        subtitle: "You pick the restaurant, whatever you're craving is on me!",
        icon: "🍣",
        code: "COUPON-DINNER-02"
      },
      {
        id: "c3",
        title: "🍦 Sweet Treat / Late Night Run",
        subtitle: "Ice cream, boba, or midnight snacks delivered right to you.",
        icon: "🍨",
        code: "COUPON-TREAT-03"
      },
      {
        id: "c4",
        title: "👑 You Win Any Argument Pass",
        subtitle: "Play this card and I will immediately admit you were 100% right.",
        icon: "✨",
        code: "COUPON-QUEEN-04"
      }
    ]
  }
};
