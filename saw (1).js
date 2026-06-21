// =========================================
// METODE SAW (Simple Additive Weighting)
// =========================================
function hitungSAW() {
  const n = alternatif.length;
  const m = kriteria.length;
  const X = alternatif.map(a => a.nilai);

  // --- Step 1: Matriks keputusan ---
  document.getElementById("saw-head-x").innerHTML =
    "<th>Alternatif</th>" + kriteria.map(k => `<th>${k.kode}<br><small>${k.nama}</small></th>`).join("");
  const bodyX = document.getElementById("saw-body-x");
  bodyX.innerHTML = "";
  X.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      row.map(v => `<td>${v}</td>`).join("");
    bodyX.appendChild(tr);
  });

  // --- Step 2a: Max & Min per kriteria ---
  const maxj = [], minj = [];
  for (let j = 0; j < m; j++) {
    let col = X.map(row => row[j]);
    maxj.push(Math.max(...col));
    minj.push(Math.min(...col));
  }
  document.getElementById("saw-head-maxmin").innerHTML =
    "<th></th>" + kriteria.map(k => `<th>${k.kode}</th>`).join("");
  const bodyMaxMin = document.getElementById("saw-body-maxmin");
  bodyMaxMin.innerHTML = "";
  const trMax = document.createElement("tr");
  trMax.innerHTML = "<td class='fw-semibold text-start'>Max</td>" + maxj.map(v => `<td>${v}</td>`).join("");
  bodyMaxMin.appendChild(trMax);
  const trMin = document.createElement("tr");
  trMin.innerHTML = "<td class='fw-semibold text-start'>Min</td>" + minj.map(v => `<td>${v}</td>`).join("");
  bodyMaxMin.appendChild(trMin);

  // --- Step 2b: Normalisasi ---
  const R = X.map(row => row.map((v, j) => {
    if (kriteria[j].jenis === "Benefit") {
      return maxj[j] === 0 ? 0 : v / maxj[j];
    } else {
      return v === 0 ? 0 : minj[j] / v;
    }
  }));

  document.getElementById("saw-head-norm").innerHTML =
    "<th>Alternatif</th>" + kriteria.map(k => `<th>${k.kode}</th>`).join("");
  const bodyNorm = document.getElementById("saw-body-norm");
  bodyNorm.innerHTML = "";
  R.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      row.map(v => `<td>${v.toFixed(4)}</td>`).join("");
    bodyNorm.appendChild(tr);
  });

  // --- Step 3: Nilai preferensi Vi ---
  document.getElementById("saw-head-v").innerHTML = "<th>Alternatif</th>" +
    kriteria.map(k => `<th>${k.kode}<br><small>(Wj=${k.bobot})</small></th>`).join("") + "<th>Vi</th>";

  const bodyV = document.getElementById("saw-body-v");
  bodyV.innerHTML = "";
  const Vi = [];

  R.forEach((row, i) => {
    const kontribusi = row.map((rij, j) => kriteria[j].bobot * rij);
    const total = kontribusi.reduce((s, v) => s + v, 0);
    Vi.push(total);

    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      kontribusi.map(v => `<td>${v.toFixed(4)}</td>`).join("") +
      `<td class="fw-bold">${total.toFixed(4)}</td>`;
    bodyV.appendChild(tr);
  });

  // --- Step 4: Ranking ---
  const ranking = alternatif.map((a, i) => ({ nama: a.nama, vi: Vi[i] }))
    .sort((a, b) => b.vi - a.vi);

  const bodyRank = document.getElementById("saw-body-rank");
  bodyRank.innerHTML = "";
  ranking.forEach((item, idx) => {
    const tr = document.createElement("tr");
    if (idx === 0) tr.classList.add("best-row");
    tr.innerHTML = `<td>${idx + 1}</td><td class="text-start">${item.nama}</td><td>${item.vi.toFixed(4)}</td>`;
    bodyRank.appendChild(tr);
  });

  document.getElementById("rekom-saw").textContent =
    `${ranking[0].nama} (Vi = ${ranking[0].vi.toFixed(4)})`;
  document.getElementById("rekom-saw-area").classList.remove("d-none");

  if (window.simpanHistorySpk) {
    window.simpanHistorySpk({
      metode: "saw",
      jumlahAlternatif: alternatif.length,
      jumlahKriteria: kriteria.length,
      rekomendasiNama: ranking[0].nama,
      rekomendasiVi: ranking[0].vi
    });
  }
}
