# 🎓 QR Card Generator - Complete Tutorial

## 📚 Table of Contents
1. [Getting Started](#getting-started)
2. [Step-by-Step Usage](#step-by-step-usage)
3. [Customizing Your Card](#customizing-your-card)
4. [Printing Your Card](#printing-your-card)
5. [Troubleshooting](#troubleshooting)
6. [Tips & Tricks](#tips--tricks)

---

## Getting Started

### Option 1: Use it Right Now (Easiest! 🚀)

**Go to:** https://github.com/renjikaup-blip/qr-card

1. Click on `qr-card.html`
2. Click the **Raw** button (top right of the file)
3. Right-click → **Save as**
4. Name it `qr-card.html` and save to your computer
5. Double-click the file to open in your browser

### Option 2: Download from GitHub

1. Go to https://github.com/renjikaup-blip/qr-card
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the folder
5. Open `qr-card.html` with your browser

### Option 3: Online (No Download)

If you want to use it online without downloading, you can:
1. Save `qr-card.html` to a GitHub Pages site
2. Or upload to Netlify/Vercel (free hosting)

---

## Step-by-Step Usage

### Step 1: Open the File
- Double-click `qr-card.html` on your computer
- Your browser opens with the QR Card Generator

### Step 2: Enter Your URL
**Left side of the screen, top field:**

```
URL or Link: [Enter here]
```

**Examples of URLs:**
- `https://my-game.com`
- `http://localhost:3000` (if running locally)
- `https://github.com/yourname`
- `https://www.youtube.com/watch?v=...`
- Any link you want to share!

**How to enter:**
1. Click the text box that says "https://example.com"
2. Delete the placeholder text (if any)
3. Paste or type your URL
4. Press Tab or click outside the box
5. ✅ You'll see a success message: "✅ QR code generated!"

### Step 3: Customize the Card Text

**On the left panel, you'll see:**

| Field | What to change | Example |
|-------|---|---|
| **Recipient Name** | Who it's for | "For My Bug 💖" |
| **Card Title** | Main headline | "A Secret Surprise ✨" |
| **Instructions** | What they should do | "Scan with your phone 📱" |
| **Card Emoji** | The stamp/icon | "💌" or "🎮" or "🎁" |

**How to change each:**
1. Click on any field
2. Clear the current text
3. Type your new text
4. As you type, the preview on the RIGHT updates automatically! ✨

### Step 4: See Your Preview

**On the right side:**
- You'll see your card preview update in REAL-TIME
- Check colors, text, emoji placement
- Make sure the QR code is visible
- Test by taking a screenshot to see how it looks

---

## Customizing Your Card

### Adding Emojis
Every text field accepts emojis! To add them:

**On Windows:**
- Press `Win + .` (period key)
- Emoji picker opens
- Click any emoji

**On Mac:**
- Press `Cmd + Ctrl + Space`
- Emoji picker opens
- Click any emoji

**On Mobile:**
- Tap the emoji button on your keyboard

**Popular emojis for cards:**
```
💌 💖 ✨ 🎁 🎮 🎯 🎪 🌟 💝 🎊
```

### Changing Colors

The card comes with a pretty pink theme. To change it, you'd need to edit the HTML (advanced), but the current design matches the QR code colors perfectly!

### Text Length Limits

- **Recipient Name:** 30 characters
- **Card Title:** 40 characters
- **Instructions:** 50 characters
- **Card Emoji:** 1-2 emojis

If text is too long, it will wrap to fit the card nicely.

---

## Printing Your Card

### Method 1: Print to Physical Paper (Recommended!)

1. **Customize everything** on the screen first
2. Make sure your **URL is entered** and QR code is showing
3. Click **🖨️ Print / Save as PDF** button
4. A print dialog appears
5. Choose your printer or "Save as PDF"
6. Click **Print** or **Save**
7. If printing to paper:
   - Use color printer for best results
   - Print on cardstock or nice paper
   - Let ink dry
   - Cut out the card carefully

### Method 2: Save as PDF (Best!)

1. Click **🖨️ Print / Save as PDF**
2. In the print dialog, look for:
   - **Destination:** Click dropdown
   - Select **Save as PDF** (not a printer)
3. Click **Save**
4. Choose where to save it
5. Now you have a PDF file to:
   - Email to someone
   - Print later
   - Share digitally

### Method 3: Print Preview First

Before printing, preview it:
1. Click **🖨️ Print / Save as PDF**
2. Look for **Preview** or **Print Preview**
3. Make sure it looks good
4. Click **Print** or **Cancel** to go back

---

## Extra Buttons (Bottom of Left Panel)

### ⬇️ Download QR Button
- Saves JUST the QR code as a `.png` image
- Use this if you want the QR code by itself
- Perfect for adding to documents

**How to use:**
1. Enter your URL
2. Click **⬇️ Download QR**
3. A file called `qr-code.png` downloads
4. Use it anywhere you need!

### 📋 Copy URL Button
- Copies your URL to clipboard
- Paste it anywhere (email, chat, etc.)

**How to use:**
1. Enter your URL
2. Click **📋 Copy URL**
3. See message: "✅ URL copied to clipboard!"
4. Paste it anywhere with `Ctrl+V` (Windows) or `Cmd+V` (Mac)

### 🎮 Play Game Button
- This links to your game's main page
- (If your game is in the same folder)

---

## Troubleshooting

### ❌ "Invalid URL format" Error

**Problem:** You see red error message

**Solutions:**
1. Check your URL starts with `https://` or `http://`
2. Make sure there are no spaces before/after
3. Copy-paste carefully (no typos)

**Examples of GOOD URLs:**
```
✅ https://my-website.com
✅ http://localhost:3000
✅ https://github.com/username
```

**Examples of BAD URLs:**
```
❌ my-website.com (missing http://)
❌ https://my-website.com/ (too many trailing spaces)
❌ htp://... (typo)
```

### ❌ QR Code Not Showing

**Problem:** The QR code box is empty

**Solutions:**
1. Make sure you entered a valid URL
2. Press Tab to trigger the QR generation
3. Wait 2 seconds for it to generate
4. Check browser console for errors (F12)

### ❌ Can't See Preview Changes

**Problem:** Text doesn't update on right side

**Solutions:**
1. Make sure you're typing in the LEFT panel (controls)
2. Click outside the text box after typing
3. Refresh the page (F5) and try again

### ❌ Print Looks Bad

**Problem:** Card prints cut off or colors wrong

**Solutions:**
1. Before printing, click **Print Preview**
2. Check the preview looks good
3. Change printer settings:
   - Turn off "Fit to page"
   - Use "Normal" or "Standard" size
   - Set margins to Small/Minimal

### ❌ Can't Download File (First Time)

**Problem:** Windows/Mac asks where to save

**Solutions:**
1. Choose a location (Desktop is easiest)
2. Click **Save**
3. The file downloads to that folder
4. Find it and double-click to open

---

## Tips & Tricks

### 💡 Tip 1: Test on Your Phone First
Before printing:
1. Open your URL on your phone
2. Make sure it works
3. Then create the QR card

### 💡 Tip 2: Use QR Code Scanner Apps
Test if the QR code works:
1. Open Google Camera (on Android) or Camera app (iPhone)
2. Point at the QR code on screen
3. It should open your URL!

### 💡 Tip 3: Print Multiple Cards
1. Customize and print one card
2. Change the URL or recipient name
3. Print again
4. Each print creates a new card!

### 💡 Tip 4: Use Nice Paper
- Cardstock (thicker paper) looks better
- Watercolor paper for artistic look
- Matte finish looks modern
- Glossy finish for special occasions

### 💡 Tip 5: Add Personal Touches
- Print the card
- Write a handwritten message below
- Draw decorations around the edges
- Makes it extra special! 💕

### 💡 Tip 6: Different Emojis for Different Purposes

**For Games:**
```
Card Emoji: 🎮
Title: "Play My Game"
Instruction: "Scan to play now!"
```

**For Gifts:**
```
Card Emoji: 🎁
Title: "Open This Gift!"
Instruction: "Scan for your surprise"
```

**For Events:**
```
Card Emoji: 🎪
Title: "Join the Party!"
Instruction: "Scan for details"
```

**For Love:**
```
Card Emoji: 💌
Title: "A Message for You"
Instruction: "Scan to read my love note"
```

### 💡 Tip 7: Share Digitally Too
1. Download as PDF
2. Email it to someone
3. They can print it OR scan the QR from their screen!

---

## Quick Reference Cheat Sheet

| Task | Steps |
|------|-------|
| **Enter URL** | Click box → Paste/Type → Press Tab |
| **Change Text** | Click field → Delete → Type new text |
| **Add Emoji** | Win+. (Windows) or Cmd+Ctrl+Space (Mac) |
| **Print** | 🖨️ Click Print button → Choose printer → Print |
| **Save as PDF** | 🖨️ Click Print → Select "Save as PDF" → Save |
| **Download QR** | ⬇️ Click Download QR button → Saved to Downloads |
| **Copy URL** | 📋 Click Copy URL → Paste anywhere |
| **Test QR** | Phone camera → Point at QR → Opens URL |

---

## Still Having Issues?

**Try these steps in order:**

1. **Refresh the page** → Press F5
2. **Clear cache** → Ctrl+Shift+Delete (Chrome)
3. **Try a different browser** → Firefox, Safari, Edge
4. **Download the file fresh** from GitHub
5. **Check your internet connection**

---

## You're Ready! 🎉

Now you know how to:
✅ Enter a URL
✅ Customize your card
✅ Generate a QR code
✅ Print or save your card
✅ Download the QR code
✅ Copy your URL

**Happy card making!** 💌✨

Have fun creating beautiful QR cards for everyone! 🎁