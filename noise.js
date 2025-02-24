// Fungsi untuk menghitung jarak Euclidean antara dua warna RGB
function hitungJarak(warna1, warna2) {
  const r1 = parseInt(warna1.slice(1, 3), 16);
  const g1 = parseInt(warna1.slice(3, 5), 16);
  const b1 = parseInt(warna1.slice(5, 7), 16);

  const r2 = parseInt(warna2.slice(1, 3), 16);
  const g2 = parseInt(warna2.slice(3, 5), 16);
  const b2 = parseInt(warna2.slice(5, 7), 16);

  // Jarak Euclidean
  return Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );
}

// Fungsi untuk mencari warna yang paling dekat
function cariWarnaTerdekat(warnaPiksel, warna) {
  let warnaTerdekat = warna[0];
  let jarakTerdekat = hitungJarak(warnaPiksel, warna[0]);

  for (let i = 1; i < warna.length; i++) {
    const jarak = hitungJarak(warnaPiksel, warna[i]);
    if (jarak < jarakTerdekat) {
      warnaTerdekat = warna[i];
      jarakTerdekat = jarak;
    }
  }

  return warnaTerdekat;
}

// Fungsi untuk membersihkan gambar dari noise (mengembalikan ImageData yang telah diproses)
function hapusNoise(imgData, warna) {
  // const data = imgData.data;

  // Proses setiap piksel
  for (let i = 0; i < imgData.length; i += 4) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];

    const warnaPikselHex =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    const warnaTerdekat = cariWarnaTerdekat(warnaPikselHex, warna);

    const hexR = parseInt(warnaTerdekat.slice(1, 3), 16);
    const hexG = parseInt(warnaTerdekat.slice(3, 5), 16);
    const hexB = parseInt(warnaTerdekat.slice(5, 7), 16);

    imgData[i] = hexR; // R
    imgData[i + 1] = hexG; // G
    imgData[i + 2] = hexB; // B
  }

  // Kembalikan imgData yang sudah diproses
  return imgData;
}
