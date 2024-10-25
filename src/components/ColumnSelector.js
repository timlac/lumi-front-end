import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ColumnSelector = ({ availableColumns, selectedColumns, setSelectedColumns }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Select Properties to Visualize:</label>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select columns to visualize"
        defaultValue={selectedColumns}
        onChange={(value) => setSelectedColumns(value)}
      >
        {availableColumns.map((column) => (
          <Option key={column} value={column}>
            {column}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ColumnSelector;
