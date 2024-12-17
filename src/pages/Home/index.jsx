import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/trash.svg'
import api from '../../services/api'
function Home() {

  const [users, setUsers] = useState([]) // State dos users
  const [errorMessage, setErrorMessage] = useState('') // State para mensagem de erro

  // Ref para os inputs
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  // Função para consultar os usuários
  async function getUsers() {
    const usersFromAPI = await api.get('/usuarios')

    setUsers(usersFromAPI.data)
    
  }

  // Função para verificar se o email já existe
  async function checkEmailExists(email) {
    const response = await api.get(`/usuarios?email=${email}`)
    return response.data.length > 0 // Se o array tiver itens, o email já existe
  }

  // Função para criar usuário
  async function createUsers() {
    const email = inputEmail.current.value

    // Verifica se o email já existe
    const emailExists = await checkEmailExists(email)
    if (emailExists) {
      // alert('E-mail já cadastrado!')
      setErrorMessage('E-mail já cadastrado!')
      return
    }

    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    })

    getUsers()
    setErrorMessage('')
  }

  // Função para eliminar um usuário 
  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)

    getUsers()
  }

  // Chamada da função getUsers ao iniciar a página ou ao clicar no botão "Cadastrar"
  useEffect(() => {
    getUsers()
  }, [])


  return (
    <div className='container'>
      <form action="">
        {errorMessage && <p className='error'>{errorMessage}</p>}
        <h1>Cadastro de usuário</h1>
        <input ref={inputName} placeholder='Nome' type="text" name='name' /> 
        <input ref={inputAge} placeholder='Idade' type="text" name='age' /> 
        <input ref={inputEmail} placeholder='E-mail' type="email" name='email' /> 
        <button type="button" onClick={createUsers}>Cadastrar</button>
      </form>

      <div>
        {users.map((user) => (
          <div key={user.email} className='user'>
            <div>
              <p>Nome: <span>{user.name}</span></p>
              <p>Idade: <span>{user.age}</span></p>
              <p>Email: <span>{user.email}</span> </p>
            </div>
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Trash} alt="" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
