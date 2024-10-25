export const smoothData = (data, windowSize) => {
  return data.map((row, index, arr) => {
    const start = Math.max(0, index - windowSize);
    const end = Math.min(arr.length, index + windowSize + 1);
    const window = arr.slice(start, end);
    const smoothedRow = { ...row };

    Object.keys(row).forEach((key) => {
      if (key !== "Timestamp") {
        const sum = window.reduce((acc, val) => acc + parseFloat(val[key]), 0);
        smoothedRow[key] = sum / window.length;
      }
    });

    return smoothedRow;
  });
};


// src/services/smoothing.js
export const smoothAndDownSampleData = (data, windowSize, downsampleFactor) => {
  const smoothedData = data.map((row, index, arr) => {
    const start = Math.max(0, index - windowSize);
    const end = Math.min(arr.length, index + windowSize + 1);
    const window = arr.slice(start, end);
    const smoothedRow = { ...row };

    Object.keys(row).forEach((key) => {
      if (key !== "Timestamp") {
        const sum = window.reduce((acc, val) => acc + parseFloat(val[key]), 0);
        smoothedRow[key] = sum / window.length;
      }
    });

    return smoothedRow;
  });

  // Downsample the data
  const downsampledData = smoothedData.filter((_, index) => index % downsampleFactor === 0);

  return downsampledData;
};