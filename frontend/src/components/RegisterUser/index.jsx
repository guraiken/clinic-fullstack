import { useState } from "react"
import { InputHandler } from "../LoginForm/InputHandler"
import { toast } from "react-toastify"
import apiClient from "../../api/api"

const RegisterUser = ({ onClose }) => {

    //usestates dos campos
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('')

    //validações e o loading
    const [isSaving, setIsSaving] = useState(false)
    const [isPasswordMatch, setIsPasswordMatch] = useState(true)

    const isPasswordValid = () => password.length >= 8 && password === confirmPassword

    const cleanForm = () => {
        setNome("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setIsPasswordMatch(true)
        setRole('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isPasswordValid()) {
            setIsPasswordMatch(false)
            return
        }

        setIsSaving(true)

        try {
            await apiClient.post("/cadastro", {
                email,
                senha: password,
                nome,
                role
            })

            cleanForm()
            toast.success("Usuário registrado com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true,
            })
            onClose()
        } catch (error) {
            const backendError = error?.response?.data?.error
            toast.error(backendError || "Erro ao registrar usuário. Tente novamente.", {
                autoClose: 3000,
                hideProgressBar: true,
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div onSubmit={(e) => handleSubmit(e)} className="w-full max-w-md p-6 bg-white rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Criar Usuário</h2>
            <form>
                <fieldset>
                    <InputHandler
                        labelClass="block text-sm font-medium mb-1"
                        label={"Nome:"}
                        type={"nome"}
                        id={"nome"}
                        value={nome}
                        setValue={setNome}
                        required
                        className={"w-full p-2 border rounded-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"}
                    />
                </fieldset>
                <fieldset>
                    <InputHandler
                        labelClass="block text-sm font-medium mb-1"
                        label={"Email:"}
                        type={"email"}
                        id={"email"}
                        value={email}
                        setValue={setEmail}
                        required
                        className={"w-full p-2 border rounded-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"}
                    />
                </fieldset>
                <fieldset>
                    <InputHandler
                        labelClass="block text-sm font-medium mb-1"
                        label={"Senha:"}
                        type={"password"}
                        id={"password"}
                        value={password}
                        setValue={setPassword}
                        required
                        min={8}
                        className={"w-full p-2 border rounded-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"}
                    />
                </fieldset>
                <fieldset>
                    <InputHandler
                        label={"Confirmar Senha:"}
                        type={"password"}
                        id={"confirmPassword"}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        required
                        min={8}
                        className={"w-full p-2 border rounded-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"}
                    />

                    {!isPasswordMatch && (
                        <p className="text-red-500 text-sm mt-1">As senhas não correspondem</p>
                    )}
                </fieldset>

                <fieldset>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="">Selecione um cargo</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="USER">Usuário</option>
                    </select>
                </fieldset>

                <div>
                    <button
                        type="submit"
                        className={`w-full p-2 rounded-lg text-white mt-4 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                            } transition-colors`}
                        disabled={isSaving}
                    >
                        {isSaving ? "Salvando..." : "Criar Usuário"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RegisterUser