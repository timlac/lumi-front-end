import React, { useEffect } from 'react';
import { loadCSV } from "../services/csvLoader";
import { smoothAndDownSampleData } from "../services/smoothing";

const DataLoader = ({ path, setData }) => {
  useEffect(() => {
    const fetchData = async () => {
      const parsedData = await loadCSV(path);
      const smoothData = smoothAndDownSampleData(parsedData, 1, 10);
      setData(smoothData);
    };

    fetchData();
  }, [path, setData]);

  return null;  // This component only handles data processing, no rendering needed
};

export default DataLoader;
