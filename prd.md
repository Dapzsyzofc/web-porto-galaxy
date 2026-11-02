# Product Requirements Document (PRD) & System Design
## Cosmic Scrollytelling Portfolio — "The Singularity & Tesseract Experience"

**Versi Dokumen:** 1.0  
**Target Produk:** Website Portofolio Pribadi Interaktif (6-Act Cosmic Scrollytelling)  
**Core Animation Engine:** Anime.js + HTML5 Canvas / WebGL (Three.js)  
**Referensi Visual:** Konsep *Interstellar* (Gargantua Black Hole, 4D Tesseract Library, Planetary Horizon, Circumpolar Star Trails, Spiral Galaxy & Hyperspace Warp)

---

## 1. Ringkasan Eksekutif & Visi Produk

Website portofolio ini dirancang sebagai pengalaman *scrollytelling* sinematik berbasis web yang membawa pengunjung melakukan perjalanan melintasi ruang dan waktu untuk menjelajahi profil, karya proyek, pengalaman profesional, dan kontak pemilik portofolio. 

Alih-alih menggunakan tata letak halaman statis konvensional, seluruh halaman bekerja sebagai **satu kanvas kontinum ruang-waktu** (*continuous spacetime viewport*). Pergerakan *scroll* pengguna diterjemahkan langsung menjadi pergerakan kamera melintasi enam adegan kosmik utama, dengan **Anime.js** bertindak sebagai konduktor utama (*Master Timeline & State Choreographer*) yang menyinkronkan animasi tipografi DOM, antarmuka telemetri HUD, serta parameter *rendering* kanvas 2D/3D secara *real-time*.

### Tujuan Utama Produk
1. **Dampak Visual Sinematik:** Menghadirkan kualitas transisi setara situs pemenang penghargaan (*Awwwards-grade*) melalui perpaduan *shader/canvas rendering* dan koreografi mikro-interaksi Anime.js.
2. **Arsitektur Data Terpisah (*Data-Driven Portfolio*):** Memisahkan seluruh data profil, daftar proyek, dan riwayat pekerjaan ke dalam satu skema konfigurasi terpusat sehingga isi portofolio mudah diperbarui kapan saja tanpa mengubah kode animasi.
3. **Performa Tinggi (60 FPS):** Menjaga kelancaran animasi pada perangkat *desktop* maupun *mobile* dengan membatasi manipulasi DOM hanya pada properti yang diakselerasi GPU (`transform`, `opacity`) dan menyinkronkan *render loop* kanvas dengan `anime.timeline()`.

---

## 2. Arsitektur Sistem (*System Design*)

### 2.1 Arsitektur Berlapis (*Layered Architecture*)

Sistem dirancang menggunakan empat lapisan independen yang berkomunikasi melalui objek *state* reaktif tunggal (`WorldState`):

| Lapisan Sistem | Komponen Utama | Tanggung Jawab Teknis |
| :--- | :--- | :--- |
| **1. Data & Configuration Layer** | `portfolioData.js` | Menyimpan informasi profil pribadi, daftar proyek (ruangan *Tesseract*), riwayat pengalaman kerja, keahlian, dan tautan kontak. |
| **2. Scroll & Input Normalization Layer** | `VirtualScrollController` | Menangkap input `wheel`, `touchmove`, dan klik navigasi; menerapkan *lerp smoothing* (interpolasi halus) untuk menghasilkan nilai progres normalisasi (`0.0000` hingga `1.0000`). |
| **3. Animation Core Layer (Anime.js)** | `MasterChoreographer` | Mengelola `anime.timeline({ autoplay: false })` utama, *sub-timeline* tiap adegan, animasi *stagger* tipografi, dan mutasi nilai numerik pada objek `WorldState`. |
| **4. Dual-Render Presentation Layer** | `CosmicCanvasEngine` + `DOMOverlayView` | Merender latar kosmik pada `<canvas>` (partikel, lubang hitam, kisi Tesseract, jejak bintang, galaksi) sekaligus menampilkan kartu proyek dan HUD HTML/CSS di atasnya. |

### 2.2 Alur Sinkronisasi Scroll & Anime.js (*Scroll-Seek Pipeline*)

Agar animasi kanvas dan elemen HTML selalu bergerak serempak tanpa *lag* atau patah-patah, sistem menggunakan pola **Timeline Scrubbing berbasis Proxy State**:

1. **Input Pengguna:** Pengguna melakukan *scroll* menggunakan *mouse wheel*, *trackpad*, atau usapan layar sentuh (*touch swipe*).
2. **Virtual Scroll Dampening:** Nilai target scroll (`targetScroll`) dihaluskan menuju nilai aktual (`currentScroll`) pada setiap *frame* menggunakan rumus *linear interpolation*:
   `currentScroll += (targetScroll - currentScroll) * 0.08`
3. **Anime.js Master Timeline Seek:** Nilai `currentScroll` (rentang `0` hingga `1`) dikirim ke *master timeline* Anime.js melalui pemanggilan:
   `masterTimeline.seek(currentScroll * masterTimeline.duration)`
4. **Mutasi Proxy State & DOM:** Saat `seek()` dieksekusi, Anime.js secara otomatis:
   - Memperbarui properti CSS (`translate3d`, `scale`, `opacity`, `filter`) pada elemen-elemen teks dan kartu di DOM.
   - Menginterpolasi nilai-nilai numerik di dalam objek JavaScript `WorldState` (misalnya `cameraZ`, `blackHoleScale`, `tesseractRoomIndex`, `starTrailRotation`, `warpSpeed`).
5. **Canvas Render Tick:** Fungsi `requestAnimationFrame` membaca nilai terbaru dari `WorldState` dan menggambar ulang adegan kosmik pada `<canvas>` untuk *frame* tersebut.

### 2.3 Struktur Lapisan Viewport (*Z-Index Stacking Context*)

Seluruh aplikasi berjalan di dalam kontainer `position: fixed; inset: 0; overflow: hidden;` dengan pembagian lapisan (`z-index`) sebagai berikut:

| Z-Index | Nama Lapisan | Elemen di Dalamnya | Sifat Interaksi |
| :--- | :--- | :--- | :--- |
| **`z-0`** | `CanvasBackgroundLayer` | `<canvas id="cosmic-stage">` untuk merender bintang, lubang hitam Gargantua, lorong 3D Tesseract, Bumi & komet, *star trails*, dan galaksi spiral. | `pointer-events: none` (kecuali pembacaan koordinat kursor untuk efek paralaks). |
| **`z-10`** | `SceneContentLayer` | Kontainer tiap babak (`#scene-hero`, `#scene-works`, `#scene-about`, `#scene-experience`, `#scene-contact`) yang berisi tipografi, kartu proyek, dan tombol aksi. | `pointer-events: auto` hanya pada adegan yang sedang aktif. |
| **`z-20`** | `TelemetryHUDLayer` | Header navigasi atas, tombol pengatur suara (*Sound Toggle*), indikator waktu lokal *real-time*, koordinat adegan, dan *Timeline Scrubber* di bagian bawah. | `pointer-events: auto` pada tombol navigasi dan *timeline scrubber*. |
| **`z-30`** | `WarpAndPreloaderOverlay` | Layar pembuka *Supernova Preloader* (`000`–`100`) dan lapisan transisi *Hyperspace Warp* beserta tombol `Skip [ESC]`. | Aktif hanya saat pemuatan awal atau saat *warp* berlangsung. |

---

## 3. Spesifikasi Detail 6 Adegan & Koreografi Anime.js

Berikut adalah rincian desain visual, elemen antarmuka, dan implementasi teknis Anime.js untuk keenam adegan sesuai referensi video:

### Adegan 0: Preloader — "Supernova Singularity Ignition" (Durasi: 2.5 Detik Awal)

* **Tampilan Visual:**
  - Diawali dengan bola energi plasma berwarna merah muda dan putih terang di tengah layar yang berdenyut hebat.
  - Di pojok kiri bawah terdapat angka penghitung besar (`000` hingga `100`) dengan font *sans-serif* tipis bergaya teknis dan teks status kecil `IGNITING SINGULARITY` di bawah garis horizontal.
  - Saat angka mendekati `070`–`100`, bola plasma meledak dan menyebar menjadi jaringan filamen kosmik (*cosmic web*) ungu-merah muda di tengah hamparan bintang gelap, lalu menyusut masuk membentuk lubang hitam Gargantua.
* **Implementasi Anime.js:**
  ```javascript
  const preloaderState = { progress: 0, plasmaScale: 1, webSpread: 0 };

  const preloaderTimeline = anime.timeline({
    easing: 'easeInOutExpo',
    complete: () => initHeroEntrance()
  });

  preloaderTimeline
    .add({
      targets: preloaderState,
      progress: [0, 100],
      plasmaScale: [0.8, 2.4, 0.0],
      webSpread: [0, 1],
      duration: 2400,
      round: 1,
      update: () => {
        counterEl.textContent = String(preloaderState.progress).padStart(3, '0');
      }
    })
    .add({
      targets: '#preloader-overlay',
      opacity: [1, 0],
      duration: 600,
      easing: 'easeOutQuad'
    }, '-=300');
  ```

---

### Adegan 1: Hero — "The Singularity (Gargantua)" (Rentang Scroll: `0%` – `15%`)

* **Tampilan Visual:**
  - **Visual Utama:** Lubang hitam raksasa bergaya *Gargantua* dengan cincin akresi (*accretion disk*) bercahaya keemasan dan efek pembelokan cahaya gravitasi (*gravitational lensing*) di bagian atas dan bawah bayangan hitam.
  - **Tipografi & CTA (Kiri Bawah):** Nama lengkap pemilik portofolio berukuran sangat besar (2 baris, huruf kapital), diikuti subjudul singkat (*"Building scalable web applications & exploring the frontier of AI, Web3, and Blockchain"*), tombol kapsul putih `Get in touch` dengan lingkaran panah oranye, serta tautan `GitHub ↗` dan `LinkedIn ↗`.
  - **Elemen Telemetri HUD:** Label penunjuk `LOC. 00 / The singularity / Full Stack Developer, Indonesia` yang terhubung dengan garis tipis ke cincin lubang hitam; petunjuk `Scroll to fall into the singularity` di kiri bawah; dan jam digital *real-time* di kanan bawah.
* **Implementasi Anime.js:**
  - **Entrance Animation:** Menggunakan `anime.stagger(35)` untuk memunculkan setiap karakter nama dari bawah (`translateY: ['110%', '0%']`, `easing: 'easeOutExpo'`).
  - **Scroll-Linked Fall into Singularity (`10%` – `15%` Scroll):** Saat pengguna men-scroll ke bawah, Anime.js memperbesar skala lubang hitam (`gargantua.scale: 1 -> 6.5`), meningkatkan distorsi tepi, dan menarik teks nama melengkung ke arah pusat lubang hitam (`scale: [1, 0.3]`, `opacity: [1, 0]`, `filter: ['blur(0px)', 'blur(12px)']`) seolah melewati *event horizon*.

---

### Adegan 2: `01 / WORKS` — "Inside the Tesseract" (Rentang Scroll: `15%` – `50%`)

* **Tampilan Visual:**
  - **Transisi Masuk (`15%` – `20%`):** Begitu melewati *event horizon*, layar langsung berada di dalam **Tesseract** — struktur kisi-kisi 3D tak berujung berwarna perunggu/emas berisi deretan rak buku bercahaya hangat. Tampil judul pengantar besar `INSIDE THE TESSERACT` dengan kutipan *"Past the horizon, time is a direction you can walk. Every project is a room in the lattice, lit at the moment it was built"* beserta ringkasan metrik (`ROOMS: 05`, `SPAN: 2023.10 — 2026.02`, `DIRECTION: Scroll to travel back`).
  - **Ruangan Proyek (`20%` – `50%`):** Terdapat 5 ruangan proyek berurutan (contoh di video: `01 ROCKY`, `02 VIBING FARMER`, `03 OPENVOTE`, `04 MSME MANAGEMENT SYSTEM`, `05 FINANCIAL REPORTING SYSTEM`).
  - **Tata Letak Bergantian (*Alternating Split Layout*):**
    - Pada ruangan ganjil (`01`, `03`, `05`), pratinjau visual proyek berada di dalam bingkai rak buku di sisi **kiri** (dengan label `ROOM 01 — SIDE PROJECT` dan `CLICK TO ENTER` di sudut bingkai), sedangkan detail teks proyek berada di sisi **kanan**.
    - Pada ruangan genap (`02`, `04`), detail teks proyek berada di sisi **kiri**, sedangkan bingkai rak buku berisi pratinjau aplikasi berada di sisi **kanan**.
  - **Komponen Kartu Detail Proyek:** Nomor & kategori proyek, judul besar proyek, 3 kolom metadata (`PERIOD`, `STATUS` dengan titik indikator hijau menyala, `GOAL`), deskripsi singkat, deretan *badge* teknologi (`TYPESCRIPT`, `NODE.JS`, `LARAVEL`, dll.), serta tombol `Enter room ↗`, `Code ↗`, dan `Live App ↗`.
  - **Tesseract Timeline Scrubber (Bagian Bawah):** Garis waktu horizontal interaktif yang menampilkan titik-titik tahun/bulan (`2026.02`, `2025.10`, `2025.07`, `2024.07`, `2023.10`) beserta nama proyek yang sedang aktif.
* **Implementasi Anime.js:**
  - **Pergerakan Kamera Kisi 3D:** Setiap perpindahan ruangan menggerakkan koordinat kamera di dalam kisi rak buku secara diagonal dan mendalam (`tesseractCamera.z`, `tesseractCamera.x`, `tesseractCamera.rotY`) menggunakan `easing: 'easeInOutCubic'`.
  - **Koreografi Pergantian Ruangan:**
    ```javascript
    // Potongan timeline Anime.js untuk transisi antar-ruangan di dalam Tesseract
    worksSubTimeline.add({
      targets: tesseractCamera,
      z: roomIndex * -1200,
      x: (roomIndex % 2 === 0) ? -180 : 180,
      duration: 1000,
      easing: 'easeInOutQuad'
    }).add({
      targets: `.project-room-${roomIndex} .stagger-item`,
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger(60),
      duration: 600,
      easing: 'easeOutCubic'
    }, '-=500');
    ```

---

### Adegan 3: `02 / ABOUT` — "Deep Space Comet & Planetary Horizon" (Rentang Scroll: `50%` – `68%`)

* **Tampilan Visual:**
  - **Latar Kosmik:** Kisi-kisi Tesseract memudar ke atas, menyingkap ruang angkasa dalam yang tenang. Di sisi kanan melintas komet bercahaya hijau-kebiruan (*cyan comet*) dengan ekor debu kosmik yang memanjang, sementara di bagian bawah perlahan muncul lengkungan cakrawala planet Bumi yang disinari matahari terbit dari orbit.
  - **Konten Utama (Atas):** Pernyataan profil berukuran besar yang teksnya menyala putih secara bertahap seiring *scroll* (*"I build web apps that actually get used, not just demo projects..."*).
  - **Konten Kolom Ganda (Tengah):**
    - **Kiri:** Tiga paragraf narasi latar belakang pendidikan, fokus rekayasa perangkat lunak, dan filosofi pemecahan masalah.
    - **Kanan (Tabel `PROFILE`):** Daftar terstruktur dengan garis pemisah horizontal tipis yang memuat `EDUCATION`, `CURRENT`, `FOCUS`, `ACHIEVEMENT`, `LANGUAGES`, dan `LOCATION`, ditambah kutipan kosmik kecil di bawah komet.
  - **Konten Keahlian (Bawah):**
    - **Kiri (`CAPABILITIES`):** Daftar 6 keahlian utama bernomor `01`–`06` dalam dua kolom (`Full-Stack Development`, `Web3 & Blockchain`, `AI & Machine Learning`, `Database & Backend`, `DevOps & Deployment`, `System Analysis`).
    - **Kanan (`STACK`):** Kumpulan *pill badges* teknologi (`Laravel`, `Vue.js`, `React`, `TypeScript`, `PHP`, `Stellar`, `Web3`, `DevOps`).
* **Implementasi Anime.js:**
  - **Progressive Text Highlight:** Setiap kata dalam kalimat utama dibungkus `<span class="word">` dan dianimasikan menggunakan `anime.stagger()` dari `opacity: 0.25` menjadi `opacity: 1.0` seiring guliran halaman.
  - **Orbit Komet & Horizon Bumi:** Anime.js menginterpolasi posisi komet sepanjang kurva Bezier (`cometX`, `cometY`, `tailLength`) dan menaikkan posisi vertikal lengkungan planet Bumi (`earthHorizonY: ['60%', '10%']`) saat transisi menuju adegan berikutnya.

---

### Adegan 4: `03 / EXPERIENCE` — "Circumpolar Star Trails & Lunar Orbit" (Rentang Scroll: `68%` – `88%`)

* **Tampilan Visual:**
  - **Latar Kosmik:** Kamera bergerak turun melewati atmosfer Bumi menuju siluet punggung bukit gelap di malam hari. Langit di atasnya menampilkan efek fotografi *long-exposure* berupa ratusan busur jejak bintang konsentris (*star trails*) yang mengelilingi kutub langit, dengan cincin fase-fase bulan (*lunar phases*) di titik pusatnya.
  - **Judul Pembuka Adegan:** `PROFESSIONAL EXPERIENCE` berukuran besar di atas siluet bukit, disertai subjudul puitis (*"A long exposure since Oct 2023, shutter still open. The sky turns once a year here; each moon is a month, each trail a role."*).
  - **Dial Indikator Pusat Langit:** Di sekeliling lingkaran fase bulan terdapat penanda indeks pengalaman (`01`, `02`, `03`, `04`) dan tahun (`'24`, `'25`, `'26`). Busur cahaya putih terang menyorot segmen yang sesuai dengan pengalaman kerja yang sedang dibaca.
  - **Kartu Pengalaman Kerja (Di Atas Siluet Bukit):** Berganti secara berurutan untuk setiap peran kerja:
    - Badge status & masa kerja (`01 • CURRENT — DEC 2024 – PRESENT`), judul jabatan besar (`Full Stack Developer`), nama perusahaan & lokasi (`PT Juriya Ritel Indonesia — Retail Group...`), daftar tanggung jawab utama dalam 2 kolom (4–6 poin), dan deretan *tag* keahlian di bagian paling bawah.
* **Implementasi Anime.js:**
  - **Rotasi Langit Berbasis Peran:** Setiap kali pengguna bergeser dari pengalaman `01` ke `02`, `03`, dan `04`, Anime.js memutar sudut `starTrailAngle` sebesar `90deg` per peran dan menggerakkan `strokeDashoffset` pada SVG busur indikator di pusat lingkaran bulan.
  - **Transisi Kartu Pengalaman:** Kartu pengalaman lama bergerak naik dan memudar (`translateY: [0, -40]`, `opacity: [1, 0]`), sementara kartu pengalaman berikutnya muncul dari bawah (`translateY: [40, 0]`, `opacity: [0, 1]`) dengan jeda *stagger* pada poin-poin pekerjaan.

---

### Adegan 5: `04 / CONTACT` — "Spiral Galaxy & Hyperspace Warp to Origin" (Rentang Scroll: `88%` – `100%`)

* **Tampilan Visual:**
  - **Latar Kosmik:** Siluet bukit menghilang, memperlihatkan galaksi spiral keemasan yang berputar anggun di sisi kanan layar dengan label kecil `RETURN TO ORIGIN` di dekat intinya.
  - **Konten Kiri:** Label `04 — CONTACT`, judul raksasa dua baris `LET'S CONNECT`, kalimat ajakan kolaborasi singkat, dan 3 baris tautan kontak interaktif dengan garis pembatas tipis:
    - `EMAIL` — alamat email aktif
    - `GITHUB` — *handle* GitHub
    - `LINKEDIN` — nama profil LinkedIn
  - **Transisi Klimaks — Hyperspace Warp Return (`96%` – `100%` atau Klik Galaksi):**
    - Ketika pengguna terus men-scroll melewati bagian akhir halaman (atau mengklik inti galaksi `RETURN TO ORIGIN`), kamera tersedot masuk ke inti galaksi spiral.
    - Bintang-bintang di sekeliling merentang menjadi garis-garis cahaya biru-putih berkecepatan tinggi (*hyperspace warp tunnel*).
    - Tampil indikator `TRANSIT — RETURNING TO ORIGIN` di kiri bawah dan tombol `Skip [ESC]` di kanan atas.
    - Di ujung terowongan cahaya, lubang hitam *Gargantua* muncul kembali dari kejauhan dan membesar ke ukuran semula, mengembalikan pengguna secara mulus ke **Adegan 1 (Hero)** dalam satu siklus tak berujung (*infinite cosmic loop*).
* **Implementasi Anime.js:**
  ```javascript
  function triggerHyperspaceReturn() {
    if (worldState.isWarping) return;
    worldState.isWarping = true;

    const warpTimeline = anime.timeline({
      complete: () => {
        virtualScroll.resetTo(0.02); // Kembali ke posisi Hero Gargantua
        worldState.isWarping = false;
      }
    });

    warpTimeline
      // 1. Sedot kamera ke inti galaksi & sembunyikan teks Contact
      .add({
        targets: '#scene-contact .contact-content',
        opacity: [1, 0],
        scale: [1, 0.85],
        duration: 500,
        easing: 'easeInQuad'
      })
      // 2. Akselerasi garis bintang Hyperspace Warp
      .add({
        targets: worldState,
        galaxyZoom: [1, 15],
        warpStreakLength: [0, 450, 0],
        warpFlashOpacity: [0, 1, 0],
        duration: 2200,
        easing: 'easeInOutExpo'
      }, '-=200')
      // 3. Kembalikan skala Gargantua dari titik jauh ke ukuran normal Hero
      .add({
        targets: worldState,
        blackHoleScale: [0.05, 1.0],
        duration: 900,
        easing: 'easeOutCubic'
      }, '-=700');
  }
  ```

---

## 4. Desain Sistem Animasi dengan Anime.js (*Deep Dive*)

Untuk mencapai kualitas visual seperti di video tanpa membebani CPU/GPU, pembagian tugas antara **Anime.js** dan **Canvas/WebGL** diatur dengan pola berikut:

### 4.1 Peran Spesifik Anime.js dalam Sistem

| Kategori Animasi | Fitur Anime.js yang Digunakan | Target Elemen / Objek | Detail Parameter & Easing |
| :--- | :--- | :--- | :--- |
| **1. Master Scroll Timeline** | `anime.timeline({ autoplay: false })` | Objek `WorldState` & Kontainer DOM `#scene-*` | Dikendalikan via `.seek(ms)` berdasarkan progres scroll virtual (`0` s/d `10000ms`). |
| **2. Tipografi & Stagger Reveal** | `anime.stagger(40, { start: 100 })` | Karakter judul `.char`, kata `.word`, dan *badge* teknologi `.pill` | `translateY: ['100%', '0%']`, `opacity: [0, 1]`, `easing: 'easeOutExpo'`. |
| **3. Kamera & Shader Uniforms** | Animasi *Plain JS Object* (`targets: worldState`) | `cameraZ`, `lensingStrength`, `tesseractX`, `starRotation`, `warpSpeed` | Mengubah angka *floating-point* secara halus yang langsung dibaca oleh `<canvas>` pada setiap *frame*. |
| **4. Elemen SVG & Telemetri HUD** | `anime.setDashoffset` | Garis penunjuk lokasi, busur aktif fase bulan, dan *progress line* | `strokeDashoffset: [anime.setDashoffset, 0]`, `easing: 'easeInOutSine'`. |
| **5. Mikro-interaksi Tombol (Hover)** | `anime({ targets: btn, ... })` | Tombol `Get in touch`, `Enter room`, `Skip ESC`, dan ikon panah | Efek magnetik ringan mengikuti kursor (`translateX`, `translateY`) dengan `easing: 'easeOutElastic(1, .6)'`. |

### 4.2 Struktur Objek `WorldState` (Jembatan Anime.js ke Canvas)

Objek ini menjadi satu-satunya penghubung antara logika timeline Anime.js dan *renderer* kanvas 2D/WebGL:

```javascript
export const worldState = {
  // Progres global & status navigasi
  scrollProgress: 0,        // 0.000 -> 1.000
  activeSceneIndex: 0,      // 0: Preloader, 1: Hero, 2: Works, 3: About, 4: Exp, 5: Contact
  isWarping: false,

  // Parameter Adegan 1: Gargantua Black Hole
  bhScale: 1.0,             // Membesar hingga 6.5 saat masuk ke Tesseract
  bhDiskRotation: 0.0,      // Rotasi kontinu cincin akresi
  bhLensingIntensity: 1.0,  // Kekuatan pembelokan cahaya di sekitar lubang hitam
  bhOffsetX: 0.18,          // Posisi horizontal relatif terhadap layar

  // Parameter Adegan 2: Inside the Tesseract (3D Lattice)
  tesseractOpacity: 0.0,    // 0 -> 1 saat berada di bagian Works
  tesseractCamX: 0.0,       // Bergeser kiri/kanan mengikuti tata letak ruangan ganjil/genap
  tesseractCamZ: 0.0,       // Bergerak maju dari Room 01 hingga Room 05 (0 -> -4800)
  activeRoomIndex: 0,       // Indeks proyek aktif (0 s/d 4)

  // Parameter Adegan 3: About (Comet & Earth Horizon)
  cometProgress: 0.0,       // Posisi komet di sepanjang lintasan orbitnya (0 -> 1)
  earthHorizonY: 1.2,       // Posisi vertikal lengkungan Bumi di bagian bawah layar

  // Parameter Adegan 4: Experience (Star Trails & Moon Phases)
  starTrailOpacity: 0.0,    // Kemunculan jejak bintang
  starTrailRotation: 0.0,   // Sudut putaran langit (bertambah tiap pindah pengalaman kerja)
  activeExpIndex: 0,        // Indeks pengalaman kerja aktif (0 s/d 3)

  // Parameter Adegan 5: Contact (Spiral Galaxy & Warp)
  galaxyOpacity: 0.0,
  galaxyRotation: 0.0,
  galaxyScale: 1.0,
  warpStreakLength: 0.0,    // Panjang garis bintang saat Hyperspace Warp (0 -> 450)
  warpFlashOpacity: 0.0     // Kilatan cahaya saat keluar dari terowongan warp
};
```

---

## 5. Desain Visual, Tipografi & Sistem Audio

### 5.1 Palet Warna Semantik (*Cosmic Dark Palette*)

| Token Warna | Nilai Hex / RGBA | Penggunaan pada Antarmuka |
| :--- | :--- | :--- |
| `--bg-void` | `#030305` | Latar belakang utama ruang angkasa hampa. |
| `--text-primary` | `#F5F5F7` | Judul utama, nama pemilik portofolio, dan sorotan kalimat aktif. |
| `--text-secondary` | `rgba(245, 245, 247, 0.62)` | Paragraf deskripsi, tanggung jawab pekerjaan, dan subjudul. |
| `--text-muted` | `rgba(245, 245, 247, 0.36)` | Label telemetri HUD (`LOC. 00`, `PERIOD`, `STATUS`), nomor indeks, dan teks non-aktif. |
| `--accent-accretion` | `#F59E0B` / `#FDE68A` | Cahaya cincin lubang hitam Gargantua, kisi rak buku Tesseract, dan lingkaran panah CTA. |
| `--accent-comet` | `#38BDF8` / `#A5F3FC` | Inti dan ekor komet pada bagian *About* serta kilatan biru *Hyperspace Warp*. |
| `--status-active` | `#22C55E` | Titik indikator proyek/pekerjaan yang berstatus aktif. |
| `--border-hairline` | `rgba(255, 255, 255, 0.12)` | Garis pemisah tabel profil, bingkai proyek Tesseract, dan *pill badges*. |

### 5.2 Sistem Tipografi

1. **Display / Heading Font (`Space Grotesk` atau `Syne` / `Monument Extended`):**
   - Digunakan untuk judul besar berskala poster (`MUHAMMAD FAIQ`, `INSIDE THE TESSERACT`, `PROFESSIONAL EXPERIENCE`, `LET'S CONNECT`).
   - Pengaturan: `font-weight: 700`, `letter-spacing: -0.03em`, `line-height: 0.95`, `text-transform: uppercase`.
2. **Body Font (`Inter` atau `Plus Jakarta Sans`):**
   - Digunakan untuk narasi profil, deskripsi proyek, dan rincian pengalaman kerja agar tetap nyaman dibaca di atas latar gelap.
   - Pengaturan: `font-weight: 400` & `500`, `line-height: 1.6`.
3. **Telemetry / Monospace Font (`JetBrains Mono`):**
   - Digunakan untuk seluruh elemen HUD, nomor urut (`01`, `02`), rentang tanggal (`2023.10 — 2026.02`), jam lokal (`UTC+7`), dan *tag* teknologi.
   - Pengaturan: `font-size: 11px–12px`, `letter-spacing: 0.08em`, `text-transform: uppercase`.

### 5.3 Sistem Audio Interaktif (*Web Audio API Synthesizer*)

Untuk menghidupkan suasana *Interstellar* tanpa bergantung pada file MP3 eksternal yang besar, sistem menyertakan modul `CosmicAudioEngine` berbasis **Web Audio API**:
- **Ambient Space Drone:** Dua *oscillator* gelombang sinus/segitiga berfrekuensi rendah (`55 Hz` A1 dan `82.4 Hz` E2) yang dilewatkan ke *Lowpass BiquadFilter* untuk menghasilkan dengungan ruang angkasa yang tenang.
- **Scroll Velocity Modulation:** Saat pengguna men-scroll lebih cepat atau saat memasuki *Hyperspace Warp*, Anime.js menaikkan frekuensi *filter cutoff* (`200 Hz` -> `1200 Hz`) sehingga terdengar efek *whoosh* gravitasi yang dinamis.
- **UI Click & Hover Chimes:** Ketukan nada pendek berfrekuensi tinggi (`880 Hz` dengan *exponential gain decay* `0.15s`) saat tombol atau titik *timeline* diklik.
- **Kontrol Pengguna:** Tombol `Sound` dengan visualizer gelombang mini di pojok kanan atas untuk menyalakan/mematikan audio kapan saja.

---

## 6. Skema Data Portofolio (`portfolioData.js`)

Seluruh isi website dikendalikan dari satu struktur data JSON/JS berikut agar Anda dapat menggantinya dengan data pribadi Anda secara langsung:

```javascript
export const PORTFOLIO_CONFIG = {
  identity: {
    shortBrand: "FAIQ",
    edition: "PORTFOLIO '26",
    fullNameLine1: "NAMA DEPAN",
    fullNameLine2: "NAMA BELAKANG",
    roleTitle: "Full Stack Developer",
    locationShort: "Indonesia",
    timezone: "UTC+7 — WIB",
    heroTagline: "Building scalable web applications & exploring the frontier of AI, Web3, and Blockchain.",
    ctaPrimary: { label: "Get in touch", targetScene: "contact" },
    socials: [
      { label: "GitHub", url: "https://github.com/username", handle: "@username" },
      { label: "LinkedIn", url: "https://linkedin.com/in/username", handle: "Nama Lengkap" }
    ],
    email: "hello@domainanda.com"
  },

  works: {
    sectionTitle: "INSIDE THE TESSERACT",
    sectionSubtitle: "Past the horizon, time is a direction you can walk. Every project is a room in the lattice, lit at the moment it was built.",
    rooms: [
      {
        id: "room-01",
        number: "01",
        category: "SIDE PROJECT",
        title: "NAMA PROYEK 1",
        period: "Feb 2026 — Present",
         timelineStamp: "2026.02",
        status: "Active",
        goal: "Tujuan atau dampak utama proyek",
        description: "Deskripsi singkat mengenai masalah yang diselesaikan dan arsitektur solusi yang dibangun.",
        stack: ["TYPESCRIPT", "NODE.JS", "SQLITE", "CLI"],
        links: {
          live: "https://link-demo.com",
          code: "https://github.com/username/repo"
        },
        previewType: "terminal-card",
        previewQuote: "Cuplikan antarmuka atau pesan utama dari aplikasi Anda."
      }
      // Tambahkan Room 02 hingga Room 05 dengan struktur yang sama
    ]
  },

  about: {
    headline: "I build web apps that actually get used, not just demo projects.",
    paragraphs: [
      "Paragraf 1: Latar belakang pendidikan dan peran profesional saat ini.",
      "Paragraf 2: Keahlian teknis utama (stack backend/frontend) dan jenis sistem yang pernah dirilis ke produksi.",
      "Paragraf 3: Minat eksplorasi teknologi (misalnya AI, Web3, Cloud Architecture, atau System Design)."
    ],
    profileTable: [
      { label: "EDUCATION", value: "Nama Universitas (Tahun)" },
      { label: "CURRENT", value: "Perusahaan Saat Ini — Posisi" },
      { label: "FOCUS", value: "Full-Stack, AI, System Architecture" },
      { label: "ACHIEVEMENT", value: "Pencapaian / Penghargaan / Sertifikasi" },
      { label: "LANGUAGES", value: "Bahasa Indonesia (Native), English (Professional)" },
      { label: "LOCATION", value: "Jakarta, Indonesia" }
    ],
    capabilities: [
      "Full-Stack Development",
      "Database & Backend Architecture",
      "Web3 & Blockchain",
      "DevOps & Cloud Deployment",
      "AI & Machine Learning Integration",
      "System Analysis & Design"
    ],
    stack: ["Laravel", "Vue.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"]
  },

  experience: {
    subtitle: "A long exposure since 2023, shutter still open. The sky turns once a year here; each moon is a month, each trail a role.",
    roles: [
      {
        index: "01",
        isCurrent: true,
        period: "DEC 2024 – PRESENT",
        yearMarker: "'26",
        title: "Full Stack Developer",
        company: "Nama Perusahaan 1",
        locationAndType: "JAKARTA, ID · CORE OPERATIONS SYSTEM",
        highlights: [
          "Merancang dan mengembangkan aplikasi web skala produksi untuk mendukung operasional bisnis.",
          "Menganalisis kebutuhan sistem dan menerjemahkannya ke dalam arsitektur teknis yang andal.",
          "Mengoptimalkan performa kueri basis data dan alur deployment CI/CD.",
          "Berkolaborasi lintas tim untuk menjaga stabilitas dan skalabilitas infrastruktur."
        ],
        tags: ["Web Development", "System Analysis", "DevOps", "Database Optimization"]
      }
      // Tambahkan peran 02, 03, 04 sesuai riwayat kerja Anda
    ]
  }
};
```

---

## 7. Struktur Direktori Proyek & Rencana Implementasi

Jika dikembangkan sebagai proyek modular maupun *single-file web app*, berikut adalah struktur modul yang direkomendasikan:

```text
cosmic-portfolio/
├── index.html                  # Struktur DOM semantik, HUD overlay, dan elemen <canvas>
├── src/
│   ├── config/
│   │   └── portfolioData.js    # Data profil, proyek Tesseract, pengalaman, dan kontak
│   ├── state/
│   │   └── worldState.js       # Objek state reaktif yang dimutasi oleh Anime.js
│   ├── engine/
│   │   ├── scrollController.js # Virtual scroll lerp, wheel/touch listener, & navigasi
│   │   ├── choreographer.js    # Master timeline Anime.js, sub-timelines, & warp sequence
│   │   ├── cosmicRenderer.js   # Render loop <canvas> (Gargantua, Tesseract, Star Trails, Galaxy)
│   │   └── audioSynthesizer.js # Web Audio API ambient space drone & sound effects
│   └── styles/
│       └── main.css            # Variabel CSS, layout HUD, tipografi, dan responsivitas
└── prd.md                      # Dokumen spesifikasi produk & desain sistem ini
```

---

## 8. Kebutuhan Non-Fungsional & Optimasi Performa

1. **Akselerasi GPU & Pipa Komposit CSS:**
   - Semua animasi DOM yang dijalankan oleh Anime.js wajib memanipulasi `transform: translate3d(x, y, z)`, `scale()`, dan `opacity`. Hindari menganimasikan properti pemicu *layout reflow* seperti `top`, `left`, `width`, atau `height`.
2. **Manajemen Siklus Render (*Scene Culling*):**
   - Pada `<canvas>`, fungsi *renderer* hanya menggambar adegan yang memiliki `opacity > 0.01` di dalam `worldState`. Misalnya, ketika pengguna sudah berada di bagian `03 / EXPERIENCE` (*Star Trails*), perhitungan matematis untuk kisi 3D *Tesseract* dan lubang hitam *Gargantua* dihentikan sementara (*skipped*) untuk menghemat penggunaan GPU.
3. **Adaptasi Layar Responsif (Desktop & Mobile):**
   - **Desktop (`>= 1024px`):** Tata letak *split-screen* dua kolom pada ruangan *Tesseract* dan bagian *About*; efek paralaks halus mengikuti posisi kursor.
   - **Tablet & Mobile (`< 1024px`):** Bingkai pratinjau proyek di *Tesseract* ditumpuk di atas kartu deskripsi proyek; ukuran lubang hitam dan galaksi disesuaikan secara proporsional dengan lebar layar; *scroll sensitivity* disesuaikan untuk ayunan jari (*touch momentum*).
4. **Aksesibilitas & Navigasi Keyboard:**
   - Mendukung navigasi tombol panah (`ArrowDown` / `ArrowUp` / `PageDown` / `PageUp`) untuk berpindah antar-ruangan dan antar-babak.
   - Tombol `ESC` langsung memotong animasi *Hyperspace Warp* dan menempatkan pengguna di adegan awal.
   - Menghormati pengaturan sistem `prefers-reduced-motion: reduce` dengan mempercepat transisi kamera dan mematikan efek *motion blur* berlebih bagi pengguna yang sensitif terhadap gerakan.
