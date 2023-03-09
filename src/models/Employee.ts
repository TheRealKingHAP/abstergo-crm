import { ObjectId } from "mongodb"

export type Employee = {
    _id?: ObjectId,
    num_empleado: number,
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    area: string,
    puesto: string
}