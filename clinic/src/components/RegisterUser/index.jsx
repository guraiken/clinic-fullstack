import { useState, useRef, useEffect } from "react"
import { InputHandler } from "../LoginForm/InputHandler"
import { toast } from "react-toastify"
import axios from "axios"
import apiClient from "../../api/api"

const RegisterUser = ({onClose}) => {

    //usestates dos campos
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    //validações e o loading
    const [isSaving, setIsSaving] = useState(false)
    const [isPasswordMatch, setIsPasswordMatch] = useState(true)

    //validação do match

    const isPasswordValid = () => password.length >= 8 && password === confirmPassword 

    const cleanForm = () => {
        setNome("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setIsPasswordMatch(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!isPasswordValid()){
            setIsPasswordMatch(false)
            return
        }

        setIsSaving(true)
        onClose()

        try {
            await apiClient.post("/cadastro", {
                email, senha: password, nome
            })

            setIsSaving(false)
            cleanForm()
            toast.success("Usuário Registrado com Sucesso!", {
                autoClose:2000,
                hideProgressBar: true  
            })
            
        } catch (error) {
            console.log("Erro ao criar usuário", error)
            toast.error(error.response.data.error, {
                autoClose: 2000,
                hideProgressBar: true
            })
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

            <div>
                <button
                type="submit"
                className={`w-full p-2 rounded-lg text-white mt-4 ${
                    isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
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