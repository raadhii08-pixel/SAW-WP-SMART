// =========================================
// METODE WP (Weighted Product)
// =========================================
function hitungWP() {
  const n = alternatif.length;
  const m = kriteria.length;
  const X = alternatif.map(a => a.nilai);

  // --- Step 1: Matriks keputusan ---
  document.getElementById("wp-head-x").innerHTML =
    "<th>Alternatif</th>" + kriteria.map(k => `<th>${k.kode}<br><small>${k.nama}</small></th>`).join("");
  const bodyX = document.getElementById("wp-body-x");
  bodyX.innerHTML = "";
  X.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      row.map(v => `<td>${v}</td>`).join("");
    bodyX.appendChild(tr);
  });

  // --- Step 2: Perbaikan bobot (Wj = Wj / Sigma Wj) ---
  const totalBobot = kriteria.reduce((s, k) => s + k.bobot, 0);
  const W = kriteria.map(k => k.bobot / totalBobot);

  document.getElementById("wp-head-w").innerHTML =
    kriteria.map(k => `<th>${k.kode}</th>`).join("");
  document.getElementById("wp-body-w").innerHTML =
    "<tr>" + W.map(w => `<td>${w.toFixed(4)}</td>`).join("") + "</tr>";

  // --- Step 3: Vektor S ---
  // Sij = Xij^Wj (benefit) atau Xij^-Wj (cost). Si = product of Sij.
  document.getElementById("wp-head-s").innerHTML =
    "<th>Alternatif</th>" + kriteria.map((k, j) => {
      const pangkat = k.jenis === "Benefit" ? `+${W[j].toFixed(4)}` : `-${W[j].toFixed(4)}`;
      return `<th>${k.kode}<br><small>Pangkat ${pangkat}</small></th>`;
    }).join("") + "<th>Si</th>";

  const bodyS = document.getElementById("wp-body-s");
  bodyS.innerHTML = "";
  const Si = [];

  X.forEach((row, i) => {
    const Sij = row.map((v, j) => {
      const w = kriteria[j].jenis === "Benefit" ? W[j] : -W[j];
      return Math.pow(v, w);
    });
    const total = Sij.reduce((acc, v) => acc * v, 1);
    Si.push(total);

    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      Sij.map(v => `<td>${v.toFixed(6)}</td>`).join("") +
      `<td class="fw-bold">${total.toFixed(6)}</td>`;
    bodyS.appendChild(tr);
  });

  // --- Step 4: Vektor V ---
  const totalSi = Si.reduce((s, v) => s + v, 0);
  const Vi = Si.map(s => totalSi === 0 ? 0 : s / totalSi);

  const bodyV = document.getElementById("wp-body-v");
  bodyV.innerHTML = "";
  alternatif.forEach((a, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${a.nama}</td>
                     <td>${Si[i].toFixed(6)}</td>
                     <td class="fw-bold">${Vi[i].toFixed(4)}</td>`;
    bodyV.appendChild(tr);
  });

  // --- Step 5: Ranking ---
  const ranking = alternatif.map((a, i) => ({ nama: a.nama, vi: Vi[i] }))
    .sort((a, b) => b.vi - a.vi);

  const bodyRank = document.getElementById("wp-body-rank");
  bodyRank.innerHTML = "";
  ranking.forEach((item, idx) => {
    const tr = document.createElement("tr");
    if (idx === 0) tr.classList.add("best-row");
    tr.innerHTML = `<td>${idx + 1}</td><td class="text-start">${item.nama}</td><td>${item.vi.toFixed(4)}</td>`;
    bodyRank.appendChild(tr);
  });

  document.getElementById("rekom-wp").textContent =
    `${ranking[0].nama} (Vi = ${ranking[0].vi.toFixed(4)})`;
  document.getElementById("rekom-wp-area").classList.remove("d-none");

  if (window.simpanHistorySpk) {
    window.simpanHistorySpk({
      metode: "wp",
      jumlahAlternatif: alternatif.length,
      jumlahKriteria: kriteria.length,
      rekomendasiNama: ranking[0].nama,
      rekomendasiVi: ranking[0].vi
    });
  }
}
