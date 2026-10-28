# ChainFund

Aplikasi donasi terdesentralisasi (dApp) di atas Ethereum. Pengguna membuat
kampanye donasi, mengirim donasi lewat wallet MetaMask memakai ETH uji, dan
memeriksa riwayat transaksi yang tercatat permanen di blockchain.

> **Status:** dalam perencanaan. Lihat [PLAN.md](./PLAN.md) untuk rencana lengkap.
> Project ini dibuat untuk tujuan belajar & portofolio.

---

## Fitur

- **Buat kampanye** — pemilik menentukan judul, deskripsi, dan target donasi.
- **Donasi** — siapa pun bisa mengirim ETH ke kampanye lewat MetaMask.
- **Transparansi** — total terkumpul, progres target, alamat donatur, dan riwayat donasi.
- **Penarikan dana** — pemilik hanya bisa menarik **setelah target tercapai** (Opsi A).

---

## Tech Stack

- **Smart contract:** Solidity + Hardhat
- **Frontend:** React + Vite
- **Koneksi blockchain:** ethers.js
- **Wallet:** MetaMask
- **Jaringan:** Local Hardhat node, lalu Sepolia testnet (opsional)

---

## Prasyarat

- [Node.js](https://nodejs.org/) (LTS)
- [MetaMask](https://metamask.io/) (ekstensi browser)
- ETH uji Sepolia (gratis dari faucet) — hanya jika deploy ke testnet

---

## Cara Menjalankan (akan diisi saat implementasi)

```bash
# 1. Install dependency
npm install

# 2. Compile smart contract
npx hardhat compile

# 3. Jalankan test
npx hardhat test

# 4. Jalankan blockchain lokal
npx hardhat node

# 5. Deploy ke jaringan lokal (terminal baru)
npx hardhat run scripts/deploy.js --network localhost

# 6. Jalankan frontend
cd frontend
npm install
npm run dev
```

---

## Konfigurasi Environment

Salin `.env.example` menjadi `.env` lalu isi nilainya. Lihat komentar di dalam
file tersebut. **Jangan pernah commit file `.env`** (sudah di-ignore oleh Git).

---

## Struktur Project

```
chainfund/
├── contracts/        # smart contract Solidity
├── test/             # pengujian contract
├── scripts/          # script deploy
├── frontend/         # aplikasi React
├── hardhat.config.js
├── PLAN.md           # rencana lengkap project
└── README.md
```

---

## Lisensi

MIT — bebas dipakai untuk belajar.
