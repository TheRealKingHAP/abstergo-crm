import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TableView from '@/components/dashboard/TableView';
import AddEmployeeForm from '@/components/forms/AddEmployeeForm';
import FormModal from '@/components/modals/FormModal';
import SnackBar from '@/components/Notifications/Snackbar';
import { FormCallback } from '@/models/FormCallback';
import { Snackbar } from '@/models/SnackBar';
import Head from 'next/head'
import React, { useState } from 'react'
type Props = {}

function Admin({}: Props) {
  const [reloadTable, setReloadTable] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<Snackbar>({
    isVisible: false,
    message: '',
    status: 'Error',
  });
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const handleFormFinished = (data: FormCallback) => {
    setReloadTable((prev) => !reloadTable)
    setIsModalActive((prev) => false)
    setSnackbarStatus((prev) => ({
      isVisible: true,
      message: data.message,
      status: data.status
    }))
    return
  }
  //Hide Snackbar after 4 seconds
  if(snackbarStatus.isVisible) {
    setTimeout(() => {
      setSnackbarStatus((prev) => ({
        ...prev, isVisible: false
      }))
    }, 4000)
  }
  return (
    <div>
        <Head>
            <title>Panel de control - administrador</title>
            <meta name="description" content="Este es el panel de control para administrador" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <DashboardLayout>
          <TableView isEditable reload={reloadTable} title='Empleados' exportable={true} api='/api/users' headers={['num_empleado', 'nombre', 'apellido', 'email', 'telefono', 'area', 'puesto']}>
            <button className='bg-blue-500 text-white font-medium px-2 rounded-md' onClick={() => setIsModalActive((prev) => !isModalActive)}>Añadir</button>
          </TableView>
          <FormModal title='Añadir nuevo empleado' className={`h-max w-max`} isActive={isModalActive} outsideCloseFunction={(value: boolean) => setIsModalActive((prev) => value)}>
            <AddEmployeeForm userCancelFunction={() => setIsModalActive((prev) => false)} finishedSubmitFunction={(data: FormCallback) => handleFormFinished(data)} />
          </FormModal>
          { snackbarStatus.isVisible ?
                <SnackBar isVisible={snackbarStatus.isVisible} message={snackbarStatus.message} status={snackbarStatus.status} />
            :
            null
          }
        </DashboardLayout>
    </div>
  )
}

export default Admin