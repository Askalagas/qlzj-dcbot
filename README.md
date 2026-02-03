# 🏮 The Temple of Kirin Sage (qlzj-dcbot)

> *"Mortals ask for wisdom, but they cannot bear the weight of truth."*

The **Kirin Sage (麒麟真君)** is an AI-powered Discord entity designed to judge mortals, track karmic merit, and dispense esoteric wisdom (or insults) based on the user's spiritual standing.

Running on the **Google Cloud Astral Plane**, this bot utilizes **GPT-4o-mini** for dynamic roleplay, ensuring that every interaction is unique, arrogant, and technically omniscient.

---

## ☯️ Features

### 1. The Merit System (Karma)
The Sage judges every soul. Your rank determines how the bot treats you.
* **Supreme Pontiff (教主):** The Creator. Absolute obedience.
* **Exalted Saint (圣人):** Highly revered. Addressed as "Exalted One" (尊驾).
* **Virtuous Sage (真人):** Respected equal. Addressed as "Fellow Daoist" (道友).
* **Mortal (凡人):** The default state. Treated with arrogance and disdain.
* **Ignorant Fool (愚徒):** Low merit. Mocked openly.
* **Abyssal Heretic (魔道孽障):** The lowest of the low. Spat upon.

### 2. Omniscient AI Chat
* **Bilingual Core:** Automatically switches between English and Chinese based on input.
* **Math & Logic:** Solves complex problems instantly (while insulting your intelligence for asking).
* **Blasphemy Filter:** Automatically rebukes any mention of the "Grave" or the Pope's "Death." The Pope has Ascended.

### 3. Esoteric Tools
* **Divination:** Tarot and I Ching readings (via `/divine`).
* **Karma Tracking:** Persistent storage of user merit via JSON database.

---

## 🛠️ Technical Architecture

* **Runtime:** Node.js
* **Brain:** OpenAI GPT-4o-mini
* **Interface:** Discord.js v14
* **Hosting:** Google Cloud VM (Ubuntu)
* **Process Manager:** PM2 (with Log Rotation)

---

## ⚡ Deployment & Setup

### Prerequisites
* Node.js v18+
* Discord Bot Token
* OpenAI API Key

### 1. Installation
```bash
git clone git@github.com:Askalagas/qlzj-dcbot.git
cd qlzj-dcbot
npm install