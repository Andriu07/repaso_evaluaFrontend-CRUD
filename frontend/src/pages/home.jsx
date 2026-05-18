const Home = () => {
return(
    <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center flex-grow">
            <header className="text-center">
                <h1 className="text-4x1 font-bold text-blue-600" >
                    Bienvenido
                </h1>
                <p className="mt-4 text-gray-700">
                 Explora las funcionalidades y disfruta de la experiencia
                </p>
            </header>
            <main className="mt-8">
                <button className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Cerrar sesion
                </button>
            </main>
        </div>
    </div>
)
}

export default Home;