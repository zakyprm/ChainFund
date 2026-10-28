# ChainFund — Plan Project

Aplikasi donasi berbasis blockchain Ethereum. Pengguna membuat kampanye donasi,
mengirim donasi lewat wallet MetaMask memakai ETH uji, dan memeriksa riwayat
transaksi yang tercatat permanen di blockchain.

> Status: **PERENCANAAN**. Dokumen ini adalah rencana, belum ada eksekusi
> (belum install dependency, belum compile, belum deploy).

---

## 1. Tujuan

Project belajar + portofolio. Target utama tahap awal:

- Lingkungan Hardhat berjalan
- Memahami satu smart contract sederhana
- Punya test pertama yang jalan

Sehingga project ini bukan sekadar untuk CV, tapi juga bisa dijelaskan cara
kerjanya ketika ditanya.

---

## 2. Tech Stack

| Bagian             | Teknologi                                      |
| ------------------ | ---------------------------------------------- |
| Smart contract     | Solidity + Hardhat                             |
| Frontend           | React + Vite                                   |
| Koneksi blockchain | ethers.js                                      |
| Wallet             | MetaMask                                       |
| Jaringan           | Local Hardhat node -> lalu Sepolia (opsional)  |

---

## 3. Keputusan Desain yang Sudah Disepakati

- **Withdraw: Opsi A** — pemilik hanya bisa menarik dana **setelah target tercapai**.
- **Deadline kampanye: di-skip** untuk versi pertama (bisa ditambah nanti).
- Fokus dulu ke: Hardhat jalan, satu contract sederhana, test pertama.

---

## 4. Struktur Project

```
chainfund/
├── contracts/
│   └── ChainFund.sol          # smart contract
├── test/
│   └── ChainFund.test.js      # pengujian
├── scripts/
│   └── deploy.js              # script deploy
├── frontend/                  # (tahap berikutnya)
│   └── src/
│       ├── App.jsx
│       ├── components/
│       └── contract/          # ABI + alamat contract
├── hardhat.config.js
├── .gitignore
├── .env.example
├── PLAN.md
└── README.md
```

---

## 5. Desain Smart Contract (ChainFund.sol)

### Data per kampanye

- `owner` — alamat pembuat kampanye
- `title` — judul
- `description` — deskripsi
- `goal` — target donasi (dalam wei)
- `totalRaised` — total terkumpul
- `withdrawn` — status apakah dana sudah ditarik
- daftar donasi: `{ donor, amount, timestamp }`

### Fungsi utama

- `createCampaign(title, description, goal)` — buat kampanye baru
- `donate(campaignId)` — kirim ETH (payable); tolak kalau 0 ETH
- `withdraw(campaignId)` — hanya owner, hanya kalau `totalRaised >= goal`
- Getter: lihat detail kampanye, jumlah kampanye, riwayat donasi

### Aturan (Opsi A)

- Donasi harus > 0
- Withdraw hanya oleh `owner` kampanye
- Withdraw hanya kalau target sudah tercapai (`totalRaised >= goal`)
- Tidak bisa withdraw dua kali

### Events (penting untuk riwayat & frontend)

- `CampaignCreated`
- `DonationReceived`
- `FundsWithdrawn`

---

## 6. Rencana Test Pertama (ChainFund.test.js)

Skenario yang akan diuji:

1. Buat kampanye -> data tersimpan benar
2. Donasi berhasil -> `totalRaised` bertambah, donatur tercatat
3. Donasi 0 ETH -> harus **gagal (revert)**
4. Withdraw oleh non-owner -> harus **gagal**
5. Withdraw sebelum target tercapai -> harus **gagal**
6. Withdraw oleh owner setelah target tercapai -> **berhasil**, saldo owner bertambah
7. Withdraw dua kali -> yang kedua harus **gagal**

---

## 7. Urutan Pengerjaan (saat nanti dieksekusi)

1. **Setup Hardhat** — `npm init`, install Hardhat, inisialisasi project
2. **Tulis ChainFund.sol** — contract sesuai desain di atas
3. **Compile** — `npx hardhat compile`
4. **Tulis & jalankan test** — `npx hardhat test` sampai semua hijau
5. **Script deploy + local node** — `npx hardhat node` lalu deploy
6. **Frontend React** — connect MetaMask, daftar kampanye, donasi, riwayat
7. **Integrasi** frontend <-> contract (ABI + alamat)
8. **Deploy ke Sepolia** (opsional)
9. **README / dokumentasi**

---

## 8. Catatan Konsep (biar gampang dijelaskan saat ditanya)

- **Gas fee**: menulis ke blockchain (create, donate, withdraw) kena biaya;
  membaca data gratis.
- **payable**: keyword Solidity untuk fungsi yang bisa menerima ETH.
- **require**: cara contract menolak kondisi yang tidak valid; jadi dasar dari
  test "kondisi gagal".
- **wei vs ETH**: 1 ETH = 10^18 wei; contract bekerja dalam wei.
- **Testnet (Sepolia)**: pakai ETH palsu gratis, aman buat latihan.
- **ABI**: "kontrak komunikasi" antara frontend dan smart contract; dihasilkan
  saat compile dan dipakai ethers.js untuk memanggil fungsi contract.
