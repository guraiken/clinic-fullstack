import React from 'react'

export const InputHandler = ({ type, label, id, value, setValue, placeholder= null, required = false, min = 0, labelClass = "",fieldsetClass = "", onChangeFunc = false , ...rest}) => {
    
    return (
        <fieldset className={!fieldsetClass ? `flex flex-col gap-2 mb-2` : `${fieldsetClass}`}>
            <label htmlFor={id} className={labelClass ? `${labelClass}` : "block text-sm font-medium mb-1"}>{label}</label>
            <input type={type} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => setValue(e.target.value)} 
                placeholder={placeholder}
                id={id}
                required
                minLength={min}
                {...rest}
            />
        </fieldset>
    )
}
