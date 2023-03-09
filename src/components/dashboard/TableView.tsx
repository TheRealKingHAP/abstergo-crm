import useData, { Query } from '@/hooks/useData';
import { Snackbar } from '@/models/SnackBar';
import { UserInput } from '@/models/UserInput'
import ExportTable from '@/utils/ExportTable';
import React, { Key, useEffect, useRef, useState } from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import {TfiReload} from 'react-icons/tfi';
import CustomInput from '../forms/CustomInput';
import FormModal from '../modals/FormModal';
import SnackBar from '../Notifications/Snackbar';
import {BiEdit} from 'react-icons/bi';
import UpdateEmployeeForm from '../forms/UpdateEmployeeForm';
import { FormCallback } from '@/models/FormCallback';
import { Employee } from '@/models/Employee';

type TableData = {
    title?: string
    api: string,
    headers: string[],
    exportable?: boolean,
    reload?: boolean,
    isEditable?: boolean    
    children?: React.ReactNode
}

function TableView({api, headers, children, exportable,isEditable ,title, reload,}: TableData) {
    const [page, setPage] = useState<number>(0);
    const [currentElement, setCurrentElement] = useState<number>(0);
    const [tablefunctionLoading, setTableFunctionLoading] = useState<boolean>(false);
    const [isModalActive, setIsModalActive] = useState<boolean> (false);
    const [isExportModalActive, setIsExportModalActive] = useState<boolean>(false);
    const [exportFunctionLoading, setExportFunctionLoading] = useState<boolean>(false);
    const [exportName, setExportName] = useState<string>('');
    const [isUpdateModalActive, setIsUpdateModalActive] = useState<boolean>(false);
    const [snackBarStatus, setSnackbarStatus] = useState<Snackbar>({
        isVisible: false,
        message: '',
        status: 'Error',
    });
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchByref = useRef<HTMLSelectElement>(null);
    const [query, setQuery] = useState<Query>({
        apiUrl: api,
        page: 0,
        search_by: headers[0],
        search: '',
        sort_by: headers[0],
        sort_order: 'asc'
    })
    const searchData = () => {
        setPage((prev) => 0);
        setQuery((prev) => ({...prev, search: searchInputRef.current?.value as string, search_by: searchByref.current?.value as string, page: 0}))
    }
    const handleExport = async () => {
        setExportFunctionLoading((prev) => true);
        const result = await ExportTable({query, name: exportName});
        if(!result.status){
            setExportFunctionLoading((prev) => false)
            setSnackbarStatus((prev) => ({
                isVisible: true,
                message: result.message,
                status: 'Error'
            }))
            return
        }
        setExportFunctionLoading((prev) => false);
        setIsExportModalActive((prev) => false);
        setSnackbarStatus((prev) => ({
            isVisible: true,
            message: 'Se ha creado el archivo exitosamente',
            status: 'Success'
        }))
        
    }
    const {data: usersData, error, lastPage, isLoading ,setData, apiUrl, getData} = useData({
        apiUrl: api,
        page: query.page,
        sort_by: query.sort_by,
        sort_order: query.sort_order,
        search: query.search,
        search_by: query.search_by
    })
    if(error){
        setSnackbarStatus((prev) => ({
            isVisible: true,
            message: error,
            status: 'Error'
        }));
    }
    const handleDeleteModal = (element: number) => {
        setIsModalActive((prev) => true);
        setCurrentElement((prev) => element);
        return
    }
    const deleteUser = async (idx: number) => {
        setTableFunctionLoading((prev) => true)
        const res = await fetch(apiUrl, {
            method: 'DELETE',
            body: JSON.stringify({_id: usersData[idx]._id})
        })
        const result = await res.json();
        if(!res.ok){
            setSnackbarStatus((prev) => ({
                isVisible: true,
                message: result.message,
                status: 'Error'
            }));
            setTableFunctionLoading((prev) => false);
            setIsModalActive((prev) => false);
            return
        }
        setTableFunctionLoading((prev) => false);
        setIsModalActive((prev) => false);
        setCurrentElement((prev) => 0)
        setSnackbarStatus((prev) => ({
            isVisible: true,
            message: result.message,
            status: 'Success'
        }));
        getData()
    }

    //Function for updating employee information
    const handleEditEmployee = (element: number) => {
        setIsUpdateModalActive((prev) => true)
        setCurrentElement((prev) => element);
        return
    }

    if(snackBarStatus.isVisible) {
        setTimeout(() => {
            setSnackbarStatus((prev) => ({...prev, isVisible: false}))
        }, 4000)
    }
    const handleUpdateFinished = (value: FormCallback) => {
        setSnackbarStatus((prev) => ({
            isVisible: true,
            message: value.message,
            status: value.status
        }))
        setCurrentElement((prev) => 0)
        setIsUpdateModalActive((prev) => false)
        getData()
        return
    }
    useEffect(() => {
        getData()
        return () => {}
    }, [reload])
    const renderTable = () => {
        if(isLoading){
            return (
                <div className='h-[45rem] border-t mt-2 flex justify-center items-center text-gray-700'>
                    <AiOutlineLoading3Quarters className='animate-spin h-7 w-7'/>
                </div>
            )
        }
        if(!usersData || usersData.length <= 0){
            return (
                <div className='h-[45rem] border-t mt-2 flex justify-center items-center text-xl font-medium text-gray-700'>
                    No hay resultados
                </div>
            )
        }
        return(
        <div className='h-[45rem] border-t mt-2 overflow-hidden overflow-y-scroll'>
            <table className='w-full text-left'>
                <thead className='text-gray-700 sticky z-[2] top-0 bg-[#fdfdfd]'>
                    <tr>
                        {headers.map((value, index) => (
                            <th key={index} className='p-5'>{value.toUpperCase()}</th>
                        ))}
                        <th className='p-5'></th>
                    </tr>
                </thead>
                <tbody className='text-gray-600 font-medium'>
                    {usersData.map((value, index) => (
                        <tr key={index} className='even:bg-slate-200 bg-[#fdfdfd] '>
                            {headers.map((header, idx) => (
                                <td key={header} className='px-5 py-5'>{value[header as keyof UserInput]}</td>
                            ))}
                            {isEditable ?
                                <td className='px-5'>
                                    <div className='flex space-x-5'>
                                        <BiEdit className='h-6 w-6 cursor-pointer' onClick={(e) => handleEditEmployee(index)} />
                                        <BsTrash className='h-6 w-6 text-red-300 cursor-pointer' onClick={(e) => handleDeleteModal(index)} />
                                    </div>
                                </td>
                                :
                                <td className='px-5'>
                                    <button onClick={(e) => handleDeleteModal(index)} className='bg-red-200 p-2 rounded-lg text-red-400 font-medium cursor-pointer hover:scale-95 transition-all ease-in-out duration-150'>Eliminar</button>
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <FormModal title='Eliminar usuario' className='h-max py-5' isActive={isModalActive} outsideCloseFunction={(value: boolean) => {setIsModalActive((prev) => value), setTableFunctionLoading((prev) => false), setCurrentElement((prev) => 0)}}>
                <div className='flex flex-col items-center space-y-12 text-center'>
                    <p className='mt-12'>Estas seguro de querer eliminar el usuario de <strong>{usersData[currentElement].email}</strong>?</p>
                        {tablefunctionLoading ? 
                            <AiOutlineLoading3Quarters className=' animate-spin w-5 h-5 text-gray-600'/> 
                            :
                            <div className='flex space-x-12'> 
                                <button className='bg-red-300 text-white font-medium px-2 rounded-md' type='button' onClick={() => deleteUser(currentElement)}>Confirmar</button>
                                <button className='bg-gray-300 text-white font-medium px-2 rounded-md' type='button' onClick={() => {setIsModalActive((prev) => false), setTableFunctionLoading((prev) => false), setCurrentElement((prev) => 0)}}>Cancelar</button>                        
                            </div>
                        }
                </div>
            </FormModal>
        </div>
        )
    }
    return (
        <div className='flex flex-col  justify-between max-h-[calc(100vh-6.5rem)]'>
            <div id='Options' className='flex items-center justify-end px-24 space-x-16 text-gray-600'>
                {title ? <h4 className='font-medium text-gray-700 mr-20 text-lg'>{title}</h4> : null }
                <TfiReload className='cursor-pointer text-blue-500 ' onClick={getData}/>
                <div id='search' className='text-gray-600 font-medium'>
                    <label>Buscar por:</label>
                    <select ref={searchByref} className='ml-5 border border-gray-200 w-24 rounded-md' defaultValue={query.search_by}>
                        {headers.map((value, index) => {
                            if(value == 'id' || value == '_id') {
                                return
                            }else{
                                return <option key={index} value={value}>{value}</option>
                                
                            }
                        })}
                    </select>
                    <input ref={searchInputRef} type={'text'} placeholder={'Buscar'} className={`ml-2 border px-2 border-gray-200 rounded-md`}></input>
                    <button onClick={searchData} className='ml-5 bg-blue-500 text-white font-medium rounded-md px-2'>Buscar</button>
                </div>
                <div id='sortBy' className='text-gray-600 font-medium'>
                    <label>Ordenar por:</label>
                    <select className='ml-5 border border-gray-200 w-24 rounded-md' defaultValue={query.sort_by} onChange={(e) => setQuery((prev) => ({...prev, sort_by: e.target.value}))}>
                       {headers.map((value, index) => (
                        <option key={index} value={value}>{value}</option>
                       ))}
                    </select>
                </div>
                <div id='sortOrder' className='text-gray-600 font-medium' >
                    <label>Orden:</label>
                    <select className='ml-5 border border-gray-200 w-24 rounded-md' onChange={(e) => setQuery((prev) => ({...prev, sort_order: e.target.value}))}>
                        <option value={'asc'}>Asc</option>
                        <option value={'desc'}>Desc</option>
                    </select>
                </div>
                {exportable ? <button onClick={() => setIsExportModalActive((prev) => true)} className=' text-gray-600 px-2 rounded-md border-2 font-medium border-blue-500 '>Exportar tabla</button> : null}
                {children}
            </div>
            {renderTable()}
            <div id={'pagination'} className='text-gray-600 font-medium flex items-center justify-center space-x-16 mt-12'>
                <button onClick={() => setQuery((prev) => prev.page <= 0 ? ({...prev}) : ({...prev, page: prev.page-1}))} disabled={query.page <= 0} className='bg-blue-500 font-medium text-white p-2 rounded-lg hover:scale-95 transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed'>Anterior</button>
                <p className='font-medium text-gray-700'>{query.page+1}</p>
                <button onClick={() => setQuery((prev) => prev.page >= 0 ? ({...prev, page: prev.page+1}) : ({...prev}))} disabled={lastPage} className='bg-blue-500 font-medium text-white p-2 rounded-lg hover:scale-95 transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed'>Siguiente</button>
            </div>
            {exportable ? 
                <FormModal className='h-max py-5' isActive={isExportModalActive} outsideCloseFunction={(value: boolean) => setIsExportModalActive((prev) => value)}  title='Exportar tabla' >
                    <div className='flex flex-col items-center space-y-12 text-center'>
                        <p className='mt-12'>Porfavor ingresa el nombre del archivo a exportar</p>
                        <CustomInput title='Nombre' inputValue={exportName}  inputType={'text'} handleChange={(value: string) => setExportName((prev) => value)} />
                            {exportFunctionLoading ? 
                                <AiOutlineLoading3Quarters className=' animate-spin w-5 h-5 text-gray-600'/> 
                                :
                                <div className='flex space-x-12'> 
                                    <button className='bg-red-300 text-white font-medium px-2 rounded-md' type='button' onClick={() => handleExport()}>Confirmar</button>
                                    <button className='bg-gray-300 text-white font-medium px-2 rounded-md' type='button' onClick={() => {setIsExportModalActive((prev) => false), setExportFunctionLoading((prev) => false)}}>Cancelar</button>                        
                                </div>
                            }
                    </div>   
                </FormModal>
                :
                null
            }
            {isEditable && usersData.length > 0 ? 
                <FormModal className='h-max w-max py-5' isActive={isUpdateModalActive} outsideCloseFunction={(value: boolean) => {setIsUpdateModalActive((prev) => value), setCurrentElement((prev) => 0)}}  title='Editar empleado' >
                    <UpdateEmployeeForm intialData={usersData[currentElement]} finishedSubmitFunction={(value: FormCallback) => handleUpdateFinished(value)} /> 
                </FormModal>
                :
                null
            }
            <SnackBar isVisible={snackBarStatus.isVisible} message={snackBarStatus.message} status={snackBarStatus.status} />
        </div>
    )
}

export default TableView