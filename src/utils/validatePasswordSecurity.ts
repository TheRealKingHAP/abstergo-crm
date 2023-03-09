import validator from 'validator';
function validatePasswordSecurity(password: string){
    return validator.isStrongPassword( password, {
        minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 
    })
}

export default validatePasswordSecurity