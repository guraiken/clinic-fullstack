export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload
  
  const target = payload?.data ?? payload

  if (Array.isArray(target?.exames)) return target.exames
  if (Array.isArray(target?.consultas)) return target.consultas
  if (Array.isArray(target?.data)) return target.data // se data for o array final

  return []
}