const selectEvent = document.getElementById("pilih-event");
const labelHargaReg = document.getElementById("label-harga-reg");
const labelHargaVip = document.getElementById("label-harga-vip");
const teksJumlah = document.getElementById("teks-jumlah");
const totalHargaEl = document.getElementById("total-harga");
const wadahEticket = document.getElementById("wadah-eticket");
const jumlahRiwayatEl = document.getElementById("jumlah-riwayat");

let jumlahTiket = 1;

// Isi dropdown acara dari dataEvent (js/data.js)
dataEvent.forEach((item) => {
  const opsi = document.createElement("option");
  opsi.value = item.id;
  opsi.textContent = `${item.judul} (${item.tanggal})`;
  selectEvent.appendChild(opsi);
});

// Cek jika ada parameter ?id= di URL (dari halaman detail/katalog)
const urlParams = new URLSearchParams(window.location.search);
const idDariUrl = urlParams.get("id");
if (idDariUrl && dataEvent.some((e) => e.id == idDariUrl)) {
  selectEvent.value = idDariUrl;
}

function ambilEventTerpilih() {
  return dataEvent.find((e) => e.id == selectEvent.value) || dataEvent[0];
}

function hitungTotal() {
  const acara = ambilEventTerpilih();
  const kelasDipilih = document.querySelector(
    'input[name="kelas"]:checked',
  ).value;

  labelHargaReg.textContent = formatRupiah(acara.hargaRegular);
  labelHargaVip.textContent = formatRupiah(acara.hargaVip);

  const hargaSatuan =
    kelasDipilih === "VIP" ? acara.hargaVip : acara.hargaRegular;
  totalHargaEl.textContent = formatRupiah(hargaSatuan * jumlahTiket);
}

// Tombol tambah & kurang jumlah tiket
document.getElementById("btn-tambah").addEventListener("click", () => {
  if (jumlahTiket < 5) {
    jumlahTiket++;
    teksJumlah.textContent = jumlahTiket;
    hitungTotal();
  }
});

document.getElementById("btn-kurang").addEventListener("click", () => {
  if (jumlahTiket > 1) {
    jumlahTiket--;
    teksJumlah.textContent = jumlahTiket;
    hitungTotal();
  }
});

selectEvent.addEventListener("change", hitungTotal);
document.querySelectorAll('input[name="kelas"]').forEach((radio) => {
  radio.addEventListener("change", hitungTotal);
});

// Simpan & render E-Ticket dari localStorage
function ambilDaftarTiket() {
  return JSON.parse(localStorage.getItem(KEY_TIKET)) || [];
}

function hapusTiket(kodeBooking) {
  const sisa = ambilDaftarTiket().filter((t) => t.kode !== kodeBooking);
  localStorage.setItem(KEY_TIKET, JSON.stringify(sisa));
  tampilkanEticket();
}

function tampilkanEticket() {
  const daftar = ambilDaftarTiket();
  jumlahRiwayatEl.textContent = `${daftar.length} Tiket`;

  if (daftar.length === 0) {
    wadahEticket.innerHTML = `
      <div class="p-6 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-sm text-zinc-500">
        Belum ada tiket yang dipesan. Silakan isi form di samping.
      </div>`;
    return;
  }

  wadahEticket.innerHTML = daftar
    .map(
      (t) => `
    <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
      <div class="flex items-center justify-between mb-3">
        <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-lime-400 text-zinc-950">${t.kelas} • ${t.jumlah}x</span>
        <span class="font-mono text-xs font-bold text-zinc-400">#${t.kode}</span>
      </div>
      <h3 class="font-display font-bold text-lg leading-snug">${t.judulEvent}</h3>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">${t.tanggal} • ${t.lokasi}</p>
      <div class="mt-4 pt-3 border-t border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-between text-xs">
        <div>
          <span class="text-zinc-400 block">Pemesan</span>
          <span class="font-semibold">${t.pemesan}</span>
        </div>
        <div class="text-right">
          <span class="font-bold text-lime-500 dark:text-lime-400 block">${formatRupiah(t.total)}</span>
          <button onclick="hapusTiket('${t.kode}')" class="text-rose-500 hover:underline mt-0.5">Batalkan</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

document.getElementById("form-tiket").addEventListener("submit", (e) => {
  e.preventDefault();
  const acara = ambilEventTerpilih();
  const namaPemesan = document.getElementById("input-nama").value.trim();
  const kelasDipilih = document.querySelector(
    'input[name="kelas"]:checked',
  ).value;
  const hargaSatuan =
    kelasDipilih === "VIP" ? acara.hargaVip : acara.hargaRegular;

  const tiketBaru = {
    kode: "PK-" + Math.floor(1000 + Math.random() * 9000),
    pemesan: namaPemesan,
    judulEvent: acara.judul,
    tanggal: acara.tanggal,
    lokasi: acara.lokasi,
    kelas: kelasDipilih,
    jumlah: jumlahTiket,
    total: hargaSatuan * jumlahTiket,
  };

  const daftarLama = ambilDaftarTiket();
  daftarLama.unshift(tiketBaru);
  localStorage.setItem(KEY_TIKET, JSON.stringify(daftarLama));

  document.getElementById("form-tiket").reset();
  jumlahTiket = 1;
  teksJumlah.textContent = "1";
  hitungTotal();
  tampilkanEticket();
});

hitungTotal();
tampilkanEticket();
