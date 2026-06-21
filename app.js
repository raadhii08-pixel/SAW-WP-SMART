// =========================================
// STATE (data dummy default, semua editable)
// =========================================
const DEFAULT_KRITERIA = [
  { kode: "C1", nama: "Harga (Rp)",    bobot: 0.30, jenis: "Cost" },
  { kode: "C2", nama: "RAM (GB)",      bobot: 0.25, jenis: "Benefit" },
  { kode: "C3", nama: "Baterai (mAh)", bobot: 0.20, jenis: "Benefit" },
  { kode: "C4", nama: "Kamera (skor)", bobot: 0.15, jenis: "Benefit" },
  { kode: "C5", nama: "Berat (gram)",  bobot: 0.10, jenis: "Cost" },
];

const DEFAULT_ALTERNATIF = [
  { nama: "S1 - Phantom X", nilai: [3500000, 6, 5000, 85, 190] },
  { nama: "S2 - Velora 5G", nilai: [4200000, 8, 4500, 90, 175] },
  { nama: "S3 - Nexora Pro", nilai: [2800000, 4, 5000, 75, 200] },
  { nama: "S4 - Astra Lite", nilai: [3100000, 6, 4000, 80, 165] },
];

let kriteria = [];
let alternatif = [];
let kriteriaCounter = 0;
let metodeAktif = "saw";

function cloneDefault() {
  kriteria = JSON.parse(JSON.stringify(DEFAULT_KRITERIA));
  alternatif = JSON.parse(JSON.stringify(DEFAULT_ALTERNATIF));
  kriteriaCounter = kriteria.length;
}

// =========================================
// RENDER: TABEL KRITERIA
// =========================================
function renderKriteria() {
  const tbody = document.getElementById("tabel-kriteria");
  tbody.innerHTML = "";
  kriteria.forEach((k, j) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-semibold">${k.kode}</td>
      <td><input type="text" class="form-control form-control-sm nama-input" value="${k.nama}"
            onchange="updateKriteriaNama(${j}, this.value)"></td>
      <td><input type="number" step="0.01" min="0" max="1" class="form-control form-control-sm" value="${k.bobot}"
            onchange="updateKriteriaBobot(${j}, this.value)"></td>
      <td>
        <select class="form-select form-select-sm" onchange="updateKriteriaJenis(${j}, this.value)">
          <option value="Benefit" ${k.jenis === "Benefit" ? "selected" : ""}>Benefit</option>
          <option value="Cost" ${k.jenis === "Cost" ? "selected" : ""}>Cost</option>
        </select>
      </td>
      <td><button class="btn btn-sm btn-outline-danger btn-hapus" onclick="hapusKriteria(${j})"
            ${kriteria.length <= 1 ? "disabled" : ""}>&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  updateTotalBobot();
}

function updateKriteriaNama(j, val) {
  kriteria[j].nama = val;
}
function updateKriteriaBobot(j, val) {
  kriteria[j].bobot = parseFloat(val) || 0;
  updateTotalBobot();
}

function updateTotalBobot() {
  const total = kriteria.reduce((s, k) => s + parseFloat(k.bobot || 0), 0);
  const totalEl = document.getElementById("total-bobot");
  totalEl.textContent = total.toFixed(2);
  totalEl.className = Math.abs(total - 1) < 0.001 ? "bobot-ok" : "bobot-warning";
}
function updateKriteriaJenis(j, val) {
  kriteria[j].jenis = val;
}
function hapusKriteria(j) {
  if (kriteria.length <= 1) return;
  kriteria.splice(j, 1);
  alternatif.forEach(a => a.nilai.splice(j, 1));
  renderKriteria();
  renderDataAlternatif();
}
function tambahKriteria() {
  kriteriaCounter++;
  kriteria.push({ kode: "C" + kriteriaCounter, nama: "Kriteria Baru", bobot: 0, jenis: "Benefit" });
  alternatif.forEach(a => a.nilai.push(0));
  renderKriteria();
  renderDataAlternatif();
}

// =========================================
// RENDER: TABEL DATA ALTERNATIF
// =========================================
function renderDataAlternatif() {
  const head = document.getElementById("head-data-alternatif");
  head.innerHTML = "<tr><th>Alternatif</th>" +
    kriteria.map(k => `<th>${k.kode}<br><small>${k.nama}</small></th>`).join("") +
    "<th></th></tr>";

  const tbody = document.getElementById("tabel-data-alternatif");
  tbody.innerHTML = "";
  alternatif.forEach((a, i) => {
    const tr = document.createElement("tr");
    let row = `<td><input type="text" class="form-control form-control-sm nama-input" value="${a.nama}"
                  onchange="updateAlternatifNama(${i}, this.value)"></td>`;
    kriteria.forEach((k, j) => {
      row += `<td><input type="number" step="any" class="form-control form-control-sm" value="${a.nilai[j]}"
                onchange="updateAlternatifNilai(${i}, ${j}, this.value)"></td>`;
    });
    row += `<td><button class="btn btn-sm btn-outline-danger btn-hapus" onclick="hapusAlternatif(${i})"
              ${alternatif.length <= 1 ? "disabled" : ""}>&times;</button></td>`;
    tr.innerHTML = row;
    tbody.appendChild(tr);
  });
}

function updateAlternatifNama(i, val) {
  alternatif[i].nama = val;
}
function updateAlternatifNilai(i, j, val) {
  alternatif[i].nilai[j] = parseFloat(val) || 0;
}
function hapusAlternatif(i) {
  if (alternatif.length <= 1) return;
  alternatif.splice(i, 1);
  renderDataAlternatif();
}
function tambahAlternatif() {
  const nilaiBaru = kriteria.map(() => 0);
  alternatif.push({ nama: "Alternatif Baru", nilai: nilaiBaru });
  renderDataAlternatif();
}

function resetData() {
  cloneDefault();
  renderKriteria();
  renderDataAlternatif();
  document.getElementById("error-area").classList.add("d-none");
  document.querySelectorAll('[id^="rekom-"][id$="-area"]').forEach(el => el.classList.add("d-none"));
}

// =========================================
// TAB METODE
// =========================================
function pilihMetode(metode) {
  metodeAktif = metode;
  document.querySelectorAll(".method-tabs .nav-link").forEach(el => el.classList.remove("active"));
  document.getElementById("tab-" + metode).classList.add("active");
  document.querySelectorAll(".method-section").forEach(el => el.classList.remove("active"));
  document.getElementById("hasil-" + metode).classList.add("active");
}

// =========================================
// VALIDASI & DISPATCH HITUNG
// =========================================
function showError(msg) {
  const el = document.getElementById("error-area");
  el.textContent = msg;
  el.classList.remove("d-none");
}

function hitung() {
  document.getElementById("error-area").classList.add("d-none");

  const totalBobot = kriteria.reduce((s, k) => s + parseFloat(k.bobot || 0), 0);
  if (Math.abs(totalBobot - 1) > 0.001) {
    showError(`Total bobot kriteria harus = 1.00 (saat ini = ${totalBobot.toFixed(2)}). Perbaiki bobot sebelum menghitung.`);
    return;
  }
  if (alternatif.length < 1 || kriteria.length < 1) {
    showError("Minimal harus ada 1 alternatif dan 1 kriteria.");
    return;
  }

  // Cek nilai 0 pada kriteria cost (akan menyebabkan div by zero pada SAW/WP)
  for (let j = 0; j < kriteria.length; j++) {
    if (kriteria[j].jenis === "Cost") {
      for (let i = 0; i < alternatif.length; i++) {
        if (alternatif[i].nilai[j] === 0) {
          showError(`Nilai kriteria Cost (${kriteria[j].kode}) pada "${alternatif[i].nama}" tidak boleh 0, karena akan menyebabkan pembagian oleh nol.`);
          return;
        }
      }
    }
  }

  hitungSAW();
  hitungWP();
  hitungSMART();
}

// init
cloneDefault();
renderKriteria();
renderDataAlternatif();
