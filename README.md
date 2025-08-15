# 🚀 BRDZ Ramp XRPL – Test Frontend

**BRDZ Ramp XRPL** is a Web3 application that enables users to perform **Onramp** (Fiat → USDC on XRPL) and **Offramp** (USDC on XRPL → Fiat / BRDZ Wallet) seamlessly and securely.  
Designed with a modern UX, professional yet user-friendly, tailored for the **XRPL** ecosystem.

---

## 🌟 Key Features
- **Onramp** – Convert Fiat (USD, IDR, VND) to USDC on the XRPL network.
- **Offramp** – Withdraw USDC from XRPL into:
  - Transfer to **BRDZ Wallet** (IDR, USD, VND)
  - Transfer to bank accounts.
- **One-Flow Mode** – Process onramp & offramp in a single step.
- **Visa Sandbox Integration** – Simulate payments via Visa card.
- **Live FX Conversion** – Automatic conversion with real-time exchange rates.
- **XRPL Trustline & Issued Payment** – Manage trustlines & payments on the XRPL testnet.

---

## 🛠 Tech Stack
- **Frontend:** Next.js + TypeScript + TailwindCSS
- **Backend:** Node.js (BRDZ Core API)
- **Blockchain:** XRP Ledger (Testnet)
- **Payment Integration:** Visa Checkout (Sandbox Mode)

---

## 📦 Installation & Local Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/AnantlaTechVentures/Brdz-XRPL-Test.git
cd Brdz-XRPL-Test
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Configuration
Create a `.env.local` file and add:
```env
NEXT_PUBLIC_API_BASE=https://api.brdz.link/api
```

### 4️⃣ Run the Application
```bash
npm run dev
```
Access it at: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Usage Flow

1. **Login** with your BRDZ account.
2. Select the **XRPL Onramp/Offramp** menu.
3. Choose **currency & amount**.
4. If **Onramp**:
   - Select Visa Checkout or directly top up via Fiat → USDC.
5. If **Offramp**:
   - Select target **Fiat** & payout method (**BRDZ Wallet** or **Bank**).
6. Confirm & process the transaction.

---

## 👥 Development Team
**By:** Hendri RH & Rahul Sharma  
BRDZ Tech Ventures

---

## 📹 Demo Apps & Video

[![Watch the video](https://img.youtube.com/vi/VIDEO_ID/0.jpg)]([[https://link-to-demo-video](https://youtu.be/APHzpURSffM)](https://youtu.be/APHzpURSffM))

[Demo Apps](https://bxr-three.vercel.app/)

---

## 📜 License
This project is for **internal testing** purposes and is not yet released to the public.
