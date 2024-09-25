import React, { useState, useEffect } from 'react'
import useUsersStore, { selectUsersCount, selectCats } from '../zustand/useUsersStore'

export default function UserManager() {
    // crear nuevo usuario
    const { usuarios, agregarUsuario, eliminarUsuario, actualizarUsuario } = useUsersStore()
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '' })

    // actualizar usuario
    const [usuarioActualizar, setUsuarioActualizar] = useState(null)
    const [nombreActualizado, setNombreActualizado] = useState('')

    // selectores
    const usersCount = useUsersStore(selectUsersCount)
    const cats = useUsersStore(selectCats)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNuevoUsuario(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        agregarUsuario({ id: Date.now(), ...nuevoUsuario })
        setNuevoUsuario({ nombre: '', email: '' })
    }

    const handleUpdateNombre = (usuario) => {
        setUsuarioActualizar(usuario.id)
        setNombreActualizado(usuario.nombre)
    }

    const handleUpdateSubmit = (id) => {
        actualizarUsuario(id, { nombre: nombreActualizado })
        setUsuarioActualizar(null)
        setNombreActualizado('')
    }

    useEffect(() => {
        console.log('renderizado: Usuarios actualizados')
    }, [usuarios])

    // se ejecuta solo al montar el componente, pues cats no se actualiza
    // asi se puede ver la mejora en renderizado, reduciendo el renderizado de componentes solo cuando sea necesario
    useEffect(() => {
        console.log('renderizado: cats')
    }, [cats])

    return (
        <div>
            <h2>Gestión de Usuarios</h2>

            <p>Total de usuarios: { usersCount }</p>

            <p>Cats: { cats.map(cat => {
                return <span key={cat}>{cat} </span>
            })}</p>

            <form onSubmit={handleSubmit}>
                <input
                    name="nombre"
                    value={nuevoUsuario.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                />
                <input
                    name="email"
                    value={nuevoUsuario.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <button type="submit">Agregar Usuario</button>
            </form>

            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>
                        {usuario.nombre} ({usuario.email})
                        <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                        <button onClick={() => handleUpdateNombre(usuario)}>Actualizar Nombre usuario</button>
                        {usuarioActualizar === usuario.id && (
                            <>
                                <input
                                    type="text"
                                    value={nombreActualizado}
                                    onChange={(e) => setNombreActualizado(e.target.value)}
                                />
                                <button onClick={() => handleUpdateSubmit(usuario.id)}>Guardar</button>
                                <button onClick={() => setUsuarioActualizar(null)}>Cancelar</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
