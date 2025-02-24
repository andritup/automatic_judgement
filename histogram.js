// Menghitung histogram warna berdasarkan warna target
async function getHistogram(imgData, warna) {
  const targetColors = warna.map(hexToRGB);
  let histogram = new Array(warna.length).fill(0);
  const totalPixels = imgData.length / 4;

  for (let i = 0; i < totalPixels; i++) {
    const r = imgData[i * 4];
    const g = imgData[i * 4 + 1];
    const b = imgData[i * 4 + 2];

    for (let j = 0; j < targetColors.length; j++) {
      if (
        r === targetColors[j][0] &&
        g === targetColors[j][1] &&
        b === targetColors[j][2]
      ) {
        histogram[j]++;
        break;
      }
    }
  }
  return histogram;
}

// Mengonversi warna HEX ke RGB
function hexToRGB(hex) {
  return [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ];
}

// Membandingkan dua histogram untuk menghitung kemiripan
function compareHistogram(hist1, hist2) {
  const distance = euclideanDistance(hist1, hist2);
  const maxDistance = calculateMaxDistance(hist1);
  return calculateSimilarityPercentage(distance, maxDistance);
}

// Menghitung jarak Euclidean antara dua histogram
function euclideanDistance(hist1, hist2) {
  return Math.sqrt(
    hist1.reduce((sum, val, i) => sum + (val - hist2[i]) ** 2, 0)
  );
}

// Menghitung jarak maksimum dari histogram
function calculateMaxDistance(hist) {
  return Math.sqrt(hist.reduce((sum, val) => sum + val ** 2, 0));
}

// Menghitung persentase kemiripan berdasarkan jarak histogram
function calculateSimilarityPercentage(distance, maxDistance) {
  return Math.max(0, Math.min((1 - distance / maxDistance) * 100, 100));
}

// Menghitung penalti untuk warna tidak berwarna
function calculateUncoloredPenalty(hist1, hist2) {
  hist1.length -= 2;
  hist2.length -= 2;
  const maxDistance = calculateMaxDistance(hist1);
  const sum = hist1.reduce(
    (acc, val, i) => acc + (val > hist2[i] ? (val - hist2[i]) ** 2 : 0),
    0
  );
  for (let i = 0; i < hist1.length; i++) {
    let element = 0;
    if (hist1[i] > hist2[i]) {
      element = hist1[i] - hist2[i];
    }
  }
  return sum > 0 ? (Math.sqrt(sum) / maxDistance) * 100 : 0;
}
