import React, { useState, useCallback } from 'react'
import { calculateResults } from './utils/calculations'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'female',
    race: 'non-black',
    creatinine: '',
    units: 'SI',
    cystatinC: ''
  })
  const [results, setResults] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCalculate = useCallback(() => {
    if (!formData.age) {
      setResults({
        error: 'Please enter age first'
      })
      return
    }

    if (Number(formData.age) < 18) {
      setResults({
        error: 'Patient under 18'
      })
      return
    }

    const results = calculateResults(formData)
    setResults(results)
  }, [formData])

  const copyResults = async () => {
    if (!results) return

    const resultText = `eGFR Calculator Results
------------------------
Input Parameters:
Serum Creatinine: ${formData.creatinine} ${formData.units === 'SI' ? 'μmol/L' : 'mg/dL'}
Serum Cystatin C: ${formData.cystatinC || 'Not provided'}
Age: ${formData.age}
Gender: ${formData.gender}
Race: ${formData.race === 'black' ? 'Black' : 'Not specified'}

Results:
${results.ckdEpi2009 ? `• CKD-EPI Creatinine (2009): ${results.ckdEpi2009} mL/min/1.73m²\n` : ''}
${results.mdrd ? `• MDRD: ${results.mdrd} mL/min/1.73m²\n` : ''}
${results.ckdEpiCombined ? `• CKD-EPI Creatinine-Cystatin C (2012): ${results.ckdEpiCombined} mL/min/1.73m²\n` : ''}
${results.ckdEpiCystatinC ? `• CKD-EPI Cystatin C (2012): ${results.ckdEpiCystatinC} mL/min/1.73m²` : ''}

Generated on: ${new Date().toLocaleString()}`

    try {
      await navigator.clipboard.writeText(resultText)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="calculator">
      <h1>eGFR Calculator</h1>
      
      <div className="grid-3">
        <div className="input-group">
          <label>Age (years)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleCalculate}
            min="18"
            max="120"
          />
        </div>

        <div className="input-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div className="input-group">
          <label>Race</label>
          <select name="race" value={formData.race} onChange={handleChange}>
            <option value="non-black">Not specified</option>
            <option value="black">Black</option>
          </select>
        </div>
      </div>

      <div className="grid-3">
        <div className="input-group">
          <label>Creatinine</label>
          <input
            type="number"
            name="creatinine"
            value={formData.creatinine}
            onChange={handleChange}
            onBlur={handleCalculate}
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label>Units</label>
          <select name="units" value={formData.units} onChange={handleChange}>
            <option value="SI">μmol/L</option>
            <option value="conventional">mg/dL</option>
          </select>
        </div>

        <div className="input-group">
          <label>Cystatin C (mg/L)</label>
          <input
            type="number"
            name="cystatinC"
            value={formData.cystatinC}
            onChange={handleChange}
            onBlur={handleCalculate}
            min="0"
            step="0.01"
            placeholder="Optional"
          />
        </div>
      </div>

      {results && (
        <div className="results-section">
          <div className="results-header">
            <h3>eGFR Results</h3>
            {!results.error && (
              <button onClick={copyResults} className="copy-button">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Results
              </button>
            )}
          </div>

          <div className="grid-2">
            <div className="result-box">
              <div className="result-label">CKD-EPI Creatinine (2009)</div>
              <div className="result-value">
                {results.error || results.ckdEpi2009 || 'Creatinine required'}
              </div>
            </div>

            <div className="result-box">
              <div className="result-label">MDRD</div>
              <div className="result-value">
                {results.error || results.mdrd || 'Creatinine required'}
              </div>
            </div>

            <div className="result-box">
              <div className="result-label">CKD-EPI Creatinine-Cystatin C (2012)</div>
              <div className="result-value">
                {results.error || results.ckdEpiCombined || 'Both values required'}
              </div>
            </div>

            <div className="result-box">
              <div className="result-label">CKD-EPI Cystatin C (2012)</div>
              <div className="result-value">
                {results.error || results.ckdEpiCystatinC || 'Cystatin C required'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
