# 🎁 The 3-Chest Interactive Love Game (QR Code Experience)

An aesthetic, mobile-first web game inspired by viral digital surprise cards (like @cattpine's Canva virtual gift style). When your girlfriend scans your physical QR code with her phone, this interactive world opens up!

---

## 🌟 What's Inside:

1. 🔒 **Secret Passcode Lock (Optional)**
   - Enter your 4-digit anniversary or birthday PIN to unlock.
2. 🏰 **The 3 Mystery Chests Hub**
   - Floating, glowing chests with bouncy animations and romantic sound effects.
3. 🌸 **Chest #1: The Memory Path**
   - An interactive walking trail where a cute avatar walks down a scenic road passing your relationship milestones and tapping Polaroid photo popups with sweet notes.
4. 🎮 **Chest #2: Catch My Love Arcade**
   - Touch/swipe mini-game to catch floating hearts, strawberries, boba, and teddy bears to win the **Golden Vault Key**.
5. 💌 **Chest #3: The Secret Vault & Love Letter**
   - Wax-sealed romantic love letter that breaks open with confetti fireworks + **interactive scratch-off love coupons** she can scratch with her finger!
6. 🖨️ **Printable QR Code Card Generator (`qr-card.html`)**
   - Built-in generator to customize and print/save a cute card with the live QR code.

---

## 🚀 How to Run & Test It Locally

### Option 1: Quick Local Server (Recommended)
In PowerShell inside this folder (`C:\Users\Renji\.gemini\antigravity\scratch\qr-love-chests`):

```powershell
# Using Python:
python -m http.server 3000

# OR using npx:
npx serve .
```

Then open `http://localhost:3000` in your browser (or your local IP `http://192.168.x.x:3000` on your phone connected to the same Wi-Fi!).

---

## ✏️ How to Customize:

All settings, text, photos, and coupons are conveniently located in **`js/config.js`**:

- **Her & Your Names:** `herName: "Her Name"`, `yourName: "Your Name"`
- **Passcode:** `code: "0524"` (or change `enabled: false` to skip passcode)
- **Milestones & Photos:** Edit the milestones in `memoryPath.milestones` and drop your photos into `assets/photos/`.
- **Love Letter:** Edit the paragraphs in `vault.letter.body`.
- **Love Coupons:** Add or edit coupons in `vault.coupons`.

---

## 🌐 Free 1-Minute Online Hosting (So the QR Code Works Anywhere):

To make the QR code work anywhere (on cellular data and from any phone):
1. **GitHub Pages (100% Free):** Push this folder to a GitHub repo and enable *Settings -> Pages*.
2. **Vercel / Netlify (Drag & Drop):** Drag and drop this folder onto [Netlify Drop](https://app.netlify.com/drop) or Vercel. You will get a free permanent URL like `https://our-surprise-quest.vercel.app`.
3. Open `qr-card.html`, paste that URL, and print your cute QR card!
