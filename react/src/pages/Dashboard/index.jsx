import { useOutletContext } from "react-router"
import { ConsultsCounter } from "../../components/counters/ConsultsCounter"
import { ExamCounter } from "../../components/counters/ExamCounter"
import { PatientCounter } from "../../components/counters/PatientCounter"
import { PatientsList } from "../../components/PatientsList"

const Dashboard = () => {
  const { isDarkMode } = useOutletContext()

  return (
    <div>
      <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-cyan-800'}`}>Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <PatientCounter isDarkMode={isDarkMode} />
        <ConsultsCounter isDarkMode={isDarkMode} />
        <ExamCounter isDarkMode={isDarkMode} />
      </div>

      {/* Lista de pacientes */}
      <PatientsList isDarkMode={isDarkMode} />
    </div>
  )
}

export default Dashboard