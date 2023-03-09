import { Employee } from "@/models/Employee";
import { UserInput } from "@/models/UserInput";
import validator from "validator";

function validateForm(data: Employee){
    let illegalChars = [',', '#', '-', '/', " ",  
    '!', '@', '$', "%",  '^', 
    '*', '(', ")", "{",  '}', 
    '|', '[', "]" , "\\"];
    const phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    try {
        let isEmail = validator.isEmail(data.email);
        let isName = validator.isAlpha(data.nombre, 'es-ES' , {ignore: '\s'});
        let isLastName = validator.isAlpha(data.apellido, 'es-ES', {ignore: '\s'});
        let isPhone = validator.matches(data.telefono, phoneReg);
        let isArea = validator.isAlphanumeric(data.area,  'es-ES' , {ignore: '\s'})
        let isEmployeeNumber = validator.isNumeric(data.num_empleado.toString());
        let isJob = validator.isAlphanumeric(data.puesto,  'es-ES' , {ignore: '\s'})
        if(!isEmail){
            throw Error('Email no valido')
        }
        if(!isPhone){
            throw Error('Número de telefono no valido')
        }
        if(!isName){
            throw Error('Nombre no valido');
        }
        if(!isLastName){
            throw Error('Apellido no valido');
        }
        if(!isArea){
            throw Error('Area no valida');
        }
        if(!isEmployeeNumber){
            throw Error('Número de empleado no valido')
        }
        if(!isJob){
            throw Error('Puesto de trabajo no valido')
        }
        return {status: true, message: 'Data is valid'}
    } catch (error: any) {
        return {status: false, message: error.message}
    }
}

export default validateForm