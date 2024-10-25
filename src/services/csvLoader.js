import Papa from 'papaparse';

export const loadCSV = async (url) => {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csvData = decoder.decode(result.value);
    return Papa.parse(csvData, {header: true}).data;

}