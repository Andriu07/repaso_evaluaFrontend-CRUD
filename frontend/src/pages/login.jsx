import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const users = [
    {
      id: 1,
      email: 'john@gmail.com',
      username: 'johnd',
      password: 'm38rmF$'
    },
    {
      id: 2,
      email: 'morrison@gmail.com',
      username: 'mor_2314',
      password: '83r5^_'
    },
    {
      id: 3,
      email: 'kevin@gmail.com',
      username: 'kevinryan',
      password: 'kev02937@'
    }
  ]


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remenberMe, setRemenberMe] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        //si ya existe un token, el usuario ya esta autenticado
        //entonces redirige directamente al apagina de inico
        const token = localStorage.getItem('fakestore_token')|| sessionStorage.getItem('fakestore_token')
        if(token){
            navigate('/home')
        }
    },{navigate})

    const handleSubmit = async (event) => {
      event.preventDefault()
      setError('')
   
      // Validación simple de los campos antes de continuar.
      if (!email.trim() || !password) {
        setError('Por favor completa email y contraseña.')
        return
      }
   
      setLoading(true)
   
      try {
        // Busca en la lista local de usuarios el email y contraseña ingresados.
        const user = users.find(
          (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
        )
   
        if (!user) {
          // Si no existe, se lanza un error y se muestra al usuario.
          throw new Error('Email o contraseña incorrectos.')
        }
   
        // Se genera un token falso para simular autenticación.
        const token = `token-${user.id}-${Date.now()}`
        const storage = localStorage 
        storage.setItem('fakestore_token', token)
        storage.setItem('fakestore_user', user.username)
        storage.setItem('fakestore_email', user.email)
   
        // Redirige a la página de inicio luego de iniciar sesión.
        navigate('/home')
      } catch (error_) {
        setError(error_.message || 'Error al iniciar sesión. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }
   

    return(
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Sign in to your account</h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-blsck-100">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-black-100">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Not a member?{' '}
              <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Start a 14 day free trial
              </a>
            </p>
          </div>
        </div>
    )
  }
  
  export default Login;