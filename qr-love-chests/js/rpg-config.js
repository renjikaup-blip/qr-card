/**
 * 🎮 ROMANTIC 2D RPG CONFIGURATION
 * Easily customize your names, dialogue, memory path milestones, and love letter!
 */
window.RPG_CONFIG = {
  // Couple Info
  herName: "Bug",
  yourName: "Your Boyfriend",
  characterEmoji: "👧🏻", // Or cute avatar sprite
  boyEmoji: "👦🏻",

  // Music Settings
  music: {
    enabled: true,
    title: "Pluto Projector Lo-Fi"
  },

  // 1. Dialogue & Storylines in the Main Garden
  introDialogue: [
    "Welcome to your special world, my love! 🌸",
    "Use the joystick or arrow keys to walk around and explore.",
    "There are 3 Mystery Chests in this garden... Go open Chest 1 to begin our journey! ✨"
  ],

  // 2. Chest #1: The Memory Road (Controllable Walking Journey)
  memoryRoad: {
    title: "🌸 Memory Lane Trail",
    stops: [
      {
        x: 400,
        y: 1200,
        title: "My Favourite Photo 📸✨",
        date: "My Absolute Favourite",
        text: "i love all the goofy pictures i take but this one is my favourite, it makes me smile.",
        image: "assets/photos/milestone1.svg",
        icon: "📸"
      },
      {
        x: 800,
        y: 1000,
        title: "Our First Concert 🎶✨",
        date: "First Concert",
        text: "Bruno Mars with you was the best experience of my life.",
        image: "assets/photos/milestone2.svg",
        icon: "🎵"
      },
      {
        x: 1200,
        y: 1250,
        title: "Our Cheeky Hangouts 🤫✨",
        date: "Cheeky Hangouts",
        text: "that week i was at your house every day, 8 days in a row, was amazing and im glad i get to see you so often.",
        image: "assets/photos/milestone3.svg",
        icon: "🤫"
      },
      {
        x: 1650,
        y: 950,
        title: "Stop 4: All The Little Things 🧸",
        date: "Every Single Day",
        text: "i love everything about you, especially our naps.",
        image: "assets/photos/milestone4.svg",
        icon: "🍯"
      },
      {
        x: 2100,
        y: 1150,
        title: "Stop 5: Gazebo of Tomorrow 💍",
        date: "Forever & Always",
        text: "i cant wait to spend the rest of my life with you.",
        image: "assets/photos/milestone5.svg",
        icon: "🏰"
      }
    ]
  },

  // 3. Chest #2: "How Well Do You Know Us?" Love Quiz
  quiz: {
    title: "🎮 Our Love Trivia",
    description: "Answer these 4 questions to unlock the Golden Vault Key! ✨"
  },
  quizQuestions: [
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
  ],

  // 4. Chest #3: The Secret Vault & Love Letter
  vault: {
    letter: {
      heading: "To My Dearest Love 💌",
      date: "Forever & Always",
      paragraphs: [
        "If you're reading this, it means you've explored our little world and unlocked all the treasures.",
        "I wanted to build something completely unique just for you—because you bring so much joy, love, and magic into my life every single day.",
        "Thank you for being my favorite person, my best friend, and my whole world. I love you more than words, code, or anything can ever express.",
        "Scratch off your special love coupons below! 😉💕"
      ],
      signoff: "Forever & Always Yours,\nWith all my love ❤️"
    },
    coupons: [
      {
        title: "💆‍♀️ 30-Min Relaxation Massage",
        desc: "Redeemable anytime! Full back & shoulder massage on demand.",
        icon: "💆‍♀️"
      },
      {
        title: "🍽️ Dinner Date of Your Choice",
        desc: "You pick the restaurant, whatever you crave is on me!",
        icon: "🍣"
      },
      {
        title: "🍦 Sweet Treat / Midnight Snack Run",
        desc: "Ice cream, boba, or snacks delivered right to you.",
        icon: "🍨"
      },
      {
        title: "👑 You Win Any Argument Pass",
        desc: "Play this card and I will immediately admit you were 100% right!",
        icon: "✨"
      }
    ]
  }
};
