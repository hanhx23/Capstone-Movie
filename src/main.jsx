import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryOnMount: false, //không tự động retry khi component mount lại
      refetchOnWindowFocus: false, // không tự động rềtch khi cửa sổ được focus lại
    }
  }
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
      <Toaster
        position='top-right' // vị trí hiển thị toast
        duration={2000} // thời gian hiển thị toast (ms)
        richColors // sử dụng màu sắc phong phú cho các loại toaat
      />
    </BrowserRouter>
  </QueryClientProvider>,

)
