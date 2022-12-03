import fs from 'fs'

const UPPER_CASE_CORRECTION = 38
const LOWER_CASE_CORRECTION = 96

const priorityChar = (char: string) => char.charCodeAt(0) - (char.toUpperCase() === char ? UPPER_CASE_CORRECTION : LOWER_CASE_CORRECTION)
