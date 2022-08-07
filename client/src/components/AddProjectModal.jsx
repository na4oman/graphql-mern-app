import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PROJECTS } from '../queries/projectQueries'
import { ADD_PROJECT } from '../mutations/projectMutations'
import { FaList } from 'react-icons/fa'
import { GET_CLIENTS } from '../queries/clientQueries'

export default function AddProjectModal() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('new')
  const [clientId, setClientId] = useState('')

  // Get Clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS)

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, status, clientId },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS })

      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
      })
    },
  })

  const submitHandler = e => {
    e.preventDefault()

    if (!name || !description || !status) {
      return alert('Please fill in all fields.')
    }

    addProject(name, description, status, clientId)

    setName('')
    setDescription('')
    setStatus('new')
    setClientId('')
  }

  if (loading) return null
  if (error) return <p>Cannot get clients</p>

  return (
    <>
      {!loading && !error && (
        <>
          <button
            type='button'
            className='btn btn-primary'
            data-bs-toggle='modal'
            data-bs-target='#addProjectModal'
          >
            <div className='d-flex align-items-center'>
              <FaList className='icon' />
              <div>New Project</div>
            </div>
          </button>

          <div
            className='modal fade'
            id='addProjectModal'
            tabIndex='-1'
            aria-labelledby='addProjectModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='addProjectModalLabel'>
                    Add New Project
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={submitHandler}>
                    <div className='mb-3'>
                      <label htmlFor='name' className='form-label'>
                        Name
                      </label>
                      <input
                        id='name'
                        type='text'
                        className='form-control'
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='email' className='form-label'>
                        Description
                      </label>
                      <textarea
                        id='email'
                        type='email'
                        className='form-control'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='status' className='form-label'>
                        Status
                      </label>
                      <select
                        className='form-select'
                        id='status'
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                      >
                        <option value='new'>Not Started</option>
                        <option value='progress'>In Progress</option>
                        <option value='completed'>Completed</option>
                      </select>
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='clientId' className='form-label'>
                        Client
                      </label>
                      <select
                        className='form-select'
                        id='clientId'
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                      >
                        <option>---Select Client---</option>
                        {data.clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type='submit'
                      data-bs-dismiss='modal'
                      className='btn btn-secondary mt-3'
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
