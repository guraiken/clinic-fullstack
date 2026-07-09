import { useState, useEffect } from 'react'

import { useParams } from 'react-router'
import apiClient from '../../api/api'


const ExamsList = () => {
    const [page, setPage] = useState(1)
    const [exams, setExams] = useState()
    const [total, setTotal] = useState()
    const [totalPagina, setTotalPagina] = useState()
    const limite = 10
    useEffect(() => {
        const fethExames = async () => {
            try {
                const response = await apiClient.get(`/exames?pagina=${page}&limite=${limite}`)
                if (response.data) {
                    setExams(response.data.data.exames)
                    setTotal(response.data.data.total)
                    setTotalPagina(response.data.totalPaginas)
                }
            } catch (error) {
                console.error("Erro ao listar exames", error)
            }
        }
        fethExames()
    }, [page])

    return (
        <div className="bg-white shadow rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                Lista de Exames
            </h2>

            {
                exams?.length ? (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-cyan-50 text-cyan-800 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Tipo de Exame</th>
                                        <th className="px-4 py-3 font-semibold">Descrição</th>
                                        <th className="px-4 py-3 font-semibold">Data do Exame</th>
                                        <th className="px-4 py-3 font-semibold">Valor</th>
                                        <th className="px-4 py-3 font-semibold">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {exams.map((exame) => (
                                        <tr key={exame.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 text-gray-800 font-medium">{exame.id}</td>
                                            <td className="px-4 py-3 text-gray-700">{exame.tipo_exame}</td>
                                            <td className="px-4 py-3 text-gray-700">{exame.descricao}</td>
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                                {new Date(exame.data_exame).toLocaleDateString("pt-BR", {
                                                    timeZone: "UTC",
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                                {Number(exame.valor).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 italic">{exame.resultado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                            <span className="w-full text-center text-sm text-gray-600 mb-1">
                                Resultado {limite * page} de {total}
                            </span>

                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Anterior
                            </button>

                            {Array.from(Array(totalPagina)).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                                        i + 1 === page
                                            ? "bg-cyan-700 text-white border-cyan-700"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.min(totalPagina || prev, prev + 1))}
                                disabled={page === totalPagina}
                                className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-6">Sem dados!</p>
                )
            }
        </div>
    )
}

export default ExamsList
