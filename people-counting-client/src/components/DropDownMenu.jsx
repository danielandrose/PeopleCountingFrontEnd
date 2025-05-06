import React from 'react'
import "../cssFiles/drop-down.css"

export default function DropDownMenu() {
    const dropdownOptions = [
        { label: 'Hall 1', value: 'option1' },
        { label: 'Hall 2', value: 'option2' },
        { label: 'Hall 3', value: 'option3' },
      ];
  return (
    <div className="drop-down-container">
      <select>
      {dropdownOptions.map((option) => (
        <option className="hoverable-option" key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    </div>
  )
}
