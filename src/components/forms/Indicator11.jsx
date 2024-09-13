import React, { useState } from 'react'
import Table from '../table/Table'
import Modal from '../modal/Modal'
import InputText from '../inputs/InputText'
import Select from '../selected/Select'


export default function Indicator11() {

    const [modalOpen, setModalOpen] = useState(false)
    

    const columns = useMemo(
        () =>
          [
            { header: "Asistencia", accessor: "name" },
            { header: "Faltas", accessor: "last_name" },
            { header: "Usuario", accessor: "username" },
            { header: "Correo Electrónico", accessor: "email" },
            { header: "Tipo de Usuario", accessor: "roles" },
          ]
      );

  return (
    <>
        <div>
            <Table columns={columns} className = "" />
        </div>

    </>
  )
}
