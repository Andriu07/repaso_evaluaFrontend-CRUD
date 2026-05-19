import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import nav from '../components/nav'
import productForm from '../components/productForm'
import confirmModal from '../components/confirmModal'
 
const Products = () => {
 
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const navigate = useNavigate()
    const token = localStorage.getItem('fakestore_token') || sessionStorage.getItem('fakestore_token')
 
    const filteredProducts = products.filter(product => {
        const query = searchTerm.trim().toLowerCase()
        if(!query) return true
        return [ product.title, product.category].join('').toLowerCase().includes(query)
    })
 
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProduct = filteredProducts.slice(startIndex, startIndex + itemsPerPage)
 
    useEffect(() => {
            if(!token){
                navigate('/')
                return
            }
       
 
        const fetchProducts = async () => {
            try {
                const response = await fetch('htpp://fakestoreapi.com/products')
                if(!response.ok) {
                    throw new Error('Error al cargar los productos')
                }
 
                const data = await response.json()
                setProducts(data.map((product) => ({...product, source: 'api'})))
            } catch (err) {
                setError(err.message || 'No se pudieron cargar las categorias')
            } finally {
                setLoading(false)
            }
        }
 
        const fetchCategories =async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products/categories')
                if(!response.ok){
                    throw new Error('Error al cargar las categorias')
                }
                const data = await response.json()
                setCategories(data)
            } catch (error) {
                console.warn(err)
            }
        }
 
        fetchProducts()
        fetchCategories()
    }, [token, navigate])
 
    const handlePageChange = (page) => {
        setCurrentPage(page)
      }
     
      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
      }
     
      const handleEditProduct = async (productId) => {
        setProductError('')
        setLoadingProductDetail(true)
     
        const localProduct = products.find((product) => product.id === productId)
        // Si el producto ya está en el estado local, no vuelve a pedirlo a la API.
        if (localProduct) {
          setEditingProduct(localProduct)
          setShowProductForm(true)
          setLoadingProductDetail(false)
          return
        }
     
        try {
          const response = await fetch(`https://fakestoreapi.com/products/${productId}`)
          if (!response.ok) {
            throw new Error('Error al cargar el producto')
          }
     
          const data = await response.json()
          setEditingProduct({ ...data, source: 'api' })
          setShowProductForm(true)
        } catch (err) {
          setProductError(err.message || 'No se pudo cargar el producto')
        } finally {c
          setLoadingProductDetail(false)
        }
      }
     
      const handleUpdateProduct = async (formData) => {
        setProductError('')
        setProductSuccess('')
        setProductSubmitting(true)
     
        const isLocalProduct = editingProduct?.source !== 'api'
     
        try {
          if (isLocalProduct) {
            // Actualiza directamente el producto local sin llamar a la API.
            setProducts((prev) =>
              prev.map((p) =>
                p.id === editingProduct.id ? { ...p, ...formData, source: p.source || 'local' } : p
              )
            )
            setProductSuccess('Producto actualizado correctamente.')
            setShowProductForm(false)
            setEditingProduct(null)
            return
          }
     
          const response = await fetch(`https://fakestoreapi.com/products/${editingProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
     
          if (!response.ok) {
            const text = await response.text()
            throw new Error(text || 'Error actualizando producto')
          }
     
          const data = await response.json()
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? { ...data, source: 'api' } : p))
          )
          setProductSuccess('Producto actualizado correctamente.')
          setShowProductForm(false)
          setEditingProduct(null)
          console.log('fakestore updated product:', data)
        } catch (err) {
          setProductError(err.message || 'No se pudo actualizar el producto')
        } finally {
          setProductSubmitting(false)
        }
      }
     
      const handleDeleteProduct = async (productId) => {
        setProductToDelete(productId)
        setShowDeleteConfirm(true)
      }
     
      const confirmDeleteProduct = async () => {
        if (!productToDelete) return
     
        setProductError('')
        setProductSuccess('')
        setShowDeleteConfirm(false)
     
        try {
          const product = products.find((p) => p.id === productToDelete)
          if (product?.source !== 'api') {
            // Si el producto es local, simplemente lo eliminamos del estado.
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete))
            setProductSuccess('Producto eliminado correctamente.')
            setProductToDelete(null)
            return
          }
     
          const response = await fetch(`https://fakestoreapi.com/products/${productToDelete}`, {
            method: 'DELETE'
          })
     
          if (!response.ok) {
            const text = await response.text()
            throw new Error(text || 'Error eliminando producto')
          }
     
          setProducts((prev) => prev.filter((p) => p.id !== productToDelete))
          setProductSuccess('Producto eliminado correctamente.')
          setProductToDelete(null)
        } catch (err) {
          setProductError(err.message || 'No se pudo eliminar el producto')
          setProductToDelete(null)
        }
      }
     
      const cancelDeleteProduct = () => {
        setShowDeleteConfirm(false)
        setProductToDelete(null)
      }
     
      const [showProductForm, setShowProductForm] = useState(false)
      const [productSubmitting, setProductSubmitting] = useState(false)
      const [productError, setProductError] = useState('')
      const [productSuccess, setProductSuccess] = useState('')
      const [editingProduct, setEditingProduct] = useState(null)
      const [loadingProductDetail, setLoadingProductDetail] = useState(false)
      const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
      const [productToDelete, setProductToDelete] = useState(null)
     
      const handleCreateProduct = async (formData) => {
        setProductError('')
        setProductSuccess('')
        setProductSubmitting(true)
     
        try {
          const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
     
          if (!response.ok) {
            const text = await response.text()
            throw new Error(text || 'Error creando producto')
          }
     
          const data = await response.json()
          const newProduct = { ...data, source: 'local' }
          setProducts((prev) => [newProduct, ...(prev || [])])
          setProductSuccess('Producto creado correctamente. ID: ' + (newProduct.id || '—'))
          setShowProductForm(false)
          setEditingProduct(null)
          setCurrentPage(1)
        } catch (err) {
          setProductError(err.message || 'No se pudo crear el producto')
        } finally {
          setProductSubmitting(false)
        }
      }
 
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <p className="text-gray-700">This is the products page. Here you can display your products.</p>
        </div>
    )
}
 
export default Products
 