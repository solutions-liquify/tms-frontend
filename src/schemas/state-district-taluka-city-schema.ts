export type ListDistrictsInput = {
  states?: string[]
}

export type ListTalukasInput = {
  states?: string[]
  districts?: string[]
}

export type ListCitiesInput = {
  states?: string[]
  districts?: string[]
  talukas?: string[]
}
