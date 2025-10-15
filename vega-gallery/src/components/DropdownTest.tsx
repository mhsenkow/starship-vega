import React, { useState } from 'react';

const DropdownTest: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setDebugLog(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    addLog('SELECT FOCUSED');
    document.body.classList.add('dropdown-open');
    e.stopPropagation();
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    addLog('SELECT BLURRED');
    setTimeout(() => {
      document.body.classList.remove('dropdown-open');
    }, 150);
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    addLog(`SELECT CHANGED to: ${e.target.value}`);
    setSelectedValue(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLSelectElement>) => {
    addLog('SELECT CLICKED');
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLSelectElement>) => {
    addLog('SELECT MOUSE DOWN');
    e.stopPropagation();
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid red',
      background: 'white',
      position: 'relative',
      zIndex: 1000000
    }}>
      <h3>Dropdown Test Component</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Test Dropdown:
        </label>
        <select
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '2px solid #000',
            borderRadius: '4px',
            fontSize: '16px',
            background: 'white',
            color: 'black',
            position: 'relative',
            zIndex: 999999,
            cursor: 'pointer'
          }}
          value={selectedValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
        >
          <option value="">Select an option</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
          <option value="option4">Option 4</option>
          <option value="option5">Option 5</option>
        </select>
      </div>

      <div>
        <strong>Selected:</strong> {selectedValue || 'None'}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Debug Log:</h4>
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {debugLog.map((log, index) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownTest; 