// =========================================
// METODE SMART (Simple Multi Attribute Rating Technique)
// =========================================
function hitungSMART() {
  const n = alternatif.length;
  const m = kriteria.length;
  const X = alternatif.map(a => a.nilai);

  // --- Step 1: Matriks keputusan ---
  document.getElementById("smart-head-x").innerHTML =
    "<th>Alternatif</th>" + kriteria.map(k => `<th>${k.kode}<br><small>${k.nama}</small></th>`).join("");
  const bodyX = document.getElementById("smart-body-x");
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
  document.getElementById("smart-head-maxmin").innerHTML =
    "<th></th>" + kriteria.map(k => `<th>${k.kode}</th>`).join("");
  const bodyMaxMin = document.getElementById("smart-body-maxmin");
  bodyMaxMin.innerHTML = "";
  const trMax = document.createElement("tr");
  trMax.innerHTML = "<td class='fw-semibold text-start'>Max</td>" + maxj.map(v => `<td>${v}</td>`).join("");
  bodyMaxMin.appendChild(trMax);
  const trMin = document.createElement("tr");
  trMin.innerHTML = "<td class='fw-semibold text-start'>Min</td>" + minj.map(v => `<td>${v}</td>`).join("");
  bodyMaxMin.appendChild(trMin);

  // --- Step 2b: Nilai utility ui ---
  const U = X.map(row => row.map((v, j) => {
    const range = maxj[j] - minj[j];
    if (range === 0) return 100; // semua alternatif sama -> dianggap maksimal
    if (kriteria[j].jenis === "Benefit") {
      return (v - minj[j]) / range * 100;
    } else {
      return (maxj[j] - v) / range * 100;
    }
  }));

  document.getElementById("smart-head-u").innerHTML =
    "<th>Alternatif</th>" + kriteria.map(k => `<th>${k.kode}</th>`).join("");
  const bodyU = document.getElementById("smart-body-u");
  bodyU.innerHTML = "";
  U.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      row.map(v => `<td>${v.toFixed(2)}</td>`).join("");
    bodyU.appendChild(tr);
  });

  // --- Step 3: Nilai akhir Vi ---
  document.getElementById("smart-head-v").innerHTML = "<th>Alternatif</th>" +
    kriteria.map(k => `<th>${k.kode}<br><small>(Wj=${k.bobot})</small></th>`).join("") + "<th>Vi</th>";

  const bodyV = document.getElementById("smart-body-v");
  bodyV.innerHTML = "";
  const Vi = [];

  U.forEach((row, i) => {
    const kontribusi = row.map((u, j) => kriteria[j].bobot * u);
    const total = kontribusi.reduce((s, v) => s + v, 0);
    Vi.push(total);

    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="fw-semibold text-start">${alternatif[i].nama}</td>` +
      kontribusi.map(v => `<td>${v.toFixed(2)}</td>`).join("") +
      `<td class="fw-bold">${total.toFixed(2)}</td>`;
    bodyV.appendChild(tr);
  });

  // --- Step 4: Ranking ---
  const ranking = alternatif.map((a, i) => ({ nama: a.nama, vi: Vi[i] }))
    .sort((a, b) => b.vi - a.vi);

  const bodyRank = document.getElementById("smart-body-rank");
  bodyRank.innerHTML = "";
  ranking.forEach((item, idx) => {
    const tr = document.createElement("tr");
    if (idx === 0) tr.classList.add("best-row");
    tr.innerHTML = `<td>${idx + 1}</td><td class="text-start">${item.nama}</td><td>${item.vi.toFixed(2)}</td>`;
    bodyRank.appendChild(tr);
  });

  document.getElementById("rekom-smart").textContent =
    `${ranking[0].nama} (Vi = ${ranking[0].vi.toFixed(2)})`;
  document.getElementById("rekom-smart-area").classList.remove("d-none");

  if (window.simpanHistorySpk) {
    window.simpanHistorySpk({
      metode: "smart",
      jumlahAlternatif: alternatif.length,
      jumlahKriteria: kriteria.length,
      rekomendasiNama: ranking[0].nama,
      rekomendasiVi: ranking[0].vi
    });
  }
}
