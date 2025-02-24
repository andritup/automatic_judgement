/**
 * Function to calculate the Structural Similarity Index (SSIM) between two images
 * using a sliding window and SSIM formula.
 *
 * This JavaScript implementation is simplified and aims to mirror the provided MATLAB code.
 * Note: This assumes that img1 and img2 are grayscale 2D arrays of the same dimensions.
 *
 * @param {number[][]} image1 - The first image as a 2D array
 * @param {number[][]} image2 - The second image as a 2D array
 * @param {number[]} K - Constants for SSIM computation [K1, K2]
 * @param {number[][]} window - A 2D Gaussian window
 * @param {number} L - The dynamic range of the images (default 255)
 * @returns {Object} - Returns { meanSSIM, ssimMap }
 */
function calculateSSIM(image1, image2, K = [0.01, 0.03], L = 255) {
  if (
    !image1 ||
    !image2 ||
    image1.length !== image2.length ||
    image1[0].length !== image2[0].length
  ) {
    return { meanSSIM: -Infinity, ssimMap: -Infinity };
  }

  const window = getGaussianWindow(11, 1.5);
  // console.log(window);

  const mu1 = applyConvolution(image1, window);
  const mu2 = applyConvolution(image2, window);
  // console.log(mu1);

  const mu1Squared = mu1.map((row) => row.map((val) => val * val));
  const mu2Squared = mu2.map((row) => row.map((val) => val * val));
  const mu1Mu2 = mu1.map((row, i) => row.map((val, j) => val * mu2[i][j]));

  const sigma1Squared = applyConvolution(elementWiseSquare(image1), window).map(
    (row, i) => row.map((val, j) => val - mu1Squared[i][j])
  );

  const sigma2Squared = applyConvolution(elementWiseSquare(image2), window).map(
    (row, i) => row.map((val, j) => val - mu2Squared[i][j])
  );

  const sigma12 = applyConvolution(
    elementWiseMultiply(image1, image2),
    window
  ).map((row, i) => row.map((val, j) => val - mu1Mu2[i][j]));

  const C1 = Math.pow(K[0] * L, 2);
  const C2 = Math.pow(K[1] * L, 2);

  const numerator1 = sigma12.map((row, i) =>
    row.map((val, j) => (2 * mu1Mu2[i][j] + C1) * (2 * val + C2))
  );

  const denominator1 = mu1Squared.map((row, i) =>
    row.map((val, j) => val + mu2Squared[i][j] + C1)
  );

  const denominator2 = sigma1Squared.map((row, i) =>
    row.map((val, j) => val + sigma2Squared[i][j] + C2)
  );

  const ssimMap = numerator1.map((row, i) =>
    row.map((val, j) => val / (denominator1[i][j] * denominator2[i][j]))
  );

  // console.log(ssimMap);

  const meanSSIM = mean2D(ssimMap) * 100;

  return { meanSSIM, ssimMap };
}

//Utility function to create a Gaussian window for SSIM calculations
let gaussianWindowCache = {};

function getGaussianWindow(size, sigma) {
  const key = `${size}_${sigma}`;
  if (gaussianWindowCache[key]) {
    return gaussianWindowCache[key];
  }

  const window = [];
  const factor = 1 / (2 * Math.PI * sigma * sigma);
  const center = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    window.push([]);
    for (let j = 0; j < size; j++) {
      const distance = Math.pow(i - center, 2) + Math.pow(j - center, 2);
      window[i].push(factor * Math.exp(-distance / (2 * sigma * sigma)));
    }
  }

  gaussianWindowCache[key] = window;
  return window;
}

// Utility to compute the sum of all elements in a 2D array
function sum2D(matrix) {
  return matrix.reduce(
    (sum, row) => sum + row.reduce((rSum, val) => rSum + val, 0),
    0
  );
}

// Utility to apply a convolution-like operation with a window over an image
function applyConvolution(image, window) {
  const imageRows = image.length;
  const imageCols = image[0].length;
  const windowSize = window.length;
  const result = new Array(imageRows - windowSize + 1);
  for (let i = 0; i < imageRows - windowSize + 1; i++) {
    result[i] = new Float32Array(imageCols - windowSize + 1);
    for (let j = 0; j < imageCols - windowSize + 1; j++) {
      let sum = 0.0;
      for (let wi = 0; wi < windowSize; wi++) {
        for (let wj = 0; wj < windowSize; wj++) {
          sum += image[i + wi][j + wj] * window[wi][wj];
        }
      }
      // console.log(sum)
      result[i][j] = sum;
    }
  }
  return result;
}

// Calculate element-wise square for 2D arrays
function elementWiseSquare(matrix) {
  return matrix.map((row) => row.map((val) => val * val));
}

// Element-wise multiplication between two 2D arrays
function elementWiseMultiply(matrix1, matrix2) {
  return matrix1.map((row, i) => row.map((val, j) => val * matrix2[i][j]));
}

// Add a constant to each element of the 2D array
function elementWiseAdd(matrix, value) {
  return matrix.map((row) => row.map((val) => val + value));
}

// Compute the mean of all elements in a 2D array
function mean2D(matrix) {
  let total = 0;
  let numElements = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      total += matrix[i][j];
      numElements++;
    }
  }

  return total / numElements;
}
