export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.exames)) return payload.data.exames
  if (Array.isArray(payload?.data?.consultas)) return payload.data.consultas
  if (Array.isArray(payload?.exames)) return payload.exames
  if (Array.isArray(payload?.consultas)) return payload.consultas

  return []
}