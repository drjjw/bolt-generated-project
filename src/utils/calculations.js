export function calculateResults(formData) {
  const { age, gender, race, creatinine, units, cystatinC } = formData
  
  if (!age) return { error: 'Please enter age first' }
  if (Number(age) < 18) return { error: 'Patient under 18' }

  // Convert creatinine to mg/dL if in SI units
  const scr = units === 'SI' ? Number(creatinine) / 88.42 : Number(creatinine)
  const results = {}

  if (creatinine) {
    // CKD-EPI Creatinine (2009)
    let k = gender === 'female' ? 0.7 : 0.9
    let a = gender === 'female' ? -0.329 : -0.411
    let genderFactor = gender === 'female' ? 1.018 : 1
    let raceFactor = race === 'black' ? 1.159 : 1

    let result = 141 *
      Math.pow(Math.min(scr / k, 1), a) *
      Math.pow(Math.max(scr / k, 1), -1.209) *
      Math.pow(0.993, age) *
      genderFactor *
      raceFactor

    results.ckdEpi2009 = Math.round(result) + " mL/min/1.73m²"

    // MDRD
    result = 175 *
      Math.pow(scr, -1.154) *
      Math.pow(age, -0.203)
    
    if (gender === 'female') result *= 0.742
    if (race === 'black') result *= 1.210

    results.mdrd = Math.round(result) + " mL/min/1.73m²"
  }

  if (cystatinC) {
    // CKD-EPI Cystatin C (2012)
    const cys = Number(cystatinC)
    let genderFactor = gender === 'female' ? 0.932 : 1

    let result = 133 *
      Math.pow(Math.min(cys / 0.8, 1), -0.499) *
      Math.pow(Math.max(cys / 0.8, 1), -1.328) *
      Math.pow(0.996, age) *
      genderFactor

    results.ckdEpiCystatinC = Math.round(result) + " mL/min/1.73m²"
  }

  if (creatinine && cystatinC) {
    // CKD-EPI Creatinine-Cystatin C (2012)
    const cys = Number(cystatinC)
    let k = gender === 'female' ? 0.7 : 0.9
    let a = gender === 'female' ? -0.248 : -0.207
    let genderFactor = gender === 'female' ? 0.969 : 1
    let raceFactor = race === 'black' ? 1.08 : 1

    let result = 135 *
      Math.pow(Math.min(scr / k, 1), a) *
      Math.pow(Math.max(scr / k, 1), -0.601) *
      Math.pow(Math.min(cys / 0.8, 1), -0.375) *
      Math.pow(Math.max(cys / 0.8, 1), -0.711) *
      Math.pow(0.995, age) *
      genderFactor *
      raceFactor

    results.ckdEpiCombined = Math.round(result) + " mL/min/1.73m²"
  }

  return results
}
