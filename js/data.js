const KEY_STORAGE = 'data_sakukampus_v1';

const dataAwal = {
  transaksi: [
    { id: 1, judul: 'Uang Saku Bulanan', kategori: 'Pemasukan', tipe: 'masuk', nominal: 1500000, tanggal: '2026-11-01' },
    { id: 2, judul: 'Bayar Kos November', kategori: 'Kos & Tagihan', tipe: 'keluar', nominal: 650000, tanggal: '2026-11-02' },
    { id: 3, judul: 'Makan Siang Warteg', kategori: 'Makan & Minum', tipe: 'keluar', nominal: 18000, tanggal: '2026-11-03' },
    { id: 4, judul: 'Print & Jilid Makalah', kategori: 'Akademik', tipe: 'keluar', nominal: 25000, tanggal: '2026-11-04' },
    { id: 5, judul: 'Isi Bensin Motor', kategori: 'Transportasi', tipe: 'keluar', nominal: 30000, tanggal: '2026-11-05' }
  ],
  tabungan: [
    { id: 1, nama: 'Upgrade RAM Laptop', target: 800000, terkumpul: 450000 },
    { id: 2, nama: 'Dana Darurat Semester', target: 1500000, terkumpul: 900000 },
    { id: 3, nama: 'Tiket Pulang Kampung', target: 600000, terkumpul: 600000 }
  ]
};

function ambilData() {
  const tersimpan = localStorage.getItem(KEY_STORAGE);
  if (!tersimpan) {
    localStorage.setItem(KEY_STORAGE, JSON.stringify(dataAwal));
    return dataAwal;
  }
  return JSON.parse(tersimpan);
}

function simpanData(dataBaru) {
  localStorage.setItem(KEY_STORAGE, JSON.stringify(dataBaru));
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}