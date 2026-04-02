import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {Plus, Book} from 'lucide-react'
import BookCard from "../components/cards/BookCard"
import CreateBookModal from '../components/modals/CreateBookModal'

import DashboardLayout from "../components/layout/DashboardLayout"
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths'

//Skeleton loader for book card
const BookCardSkeleton = () => (
  <div className='animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm'>
    <div className='w-full aspect-[16/25] bg-slate-200 rounded-t-lg'></div>
    <div className='p-4'>
      <div className='h-6 bg-slate-200 rounded w-3/4 mb-2'></div>
      <div className='h-4 bg-slate-200 rounded w-1/2'></div>
    </div>
  </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if(!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 text-center'>
        <div className='fixed inset-0 bg-black/50 bg-opacity-25 transition-opacity' onClick={onClose}></div>
        <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative'>
          <h3 className='text-lg font-semibold text-slate-900 mb-4'>{title}</h3>
          <p className='text-slate-600 mb-6'>{message}</p>
          <div className='flex justify-end space-x-3'>
            <Button variant="secondary" onClick={onClose} >Cancel</Button>
            <Button onClick={onConfirm} className='bg-red-500 hover:bg-red-600 text-white'>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
};


const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        const booksData =
        response.data.books ||
        response.data.data ||
        response.data ||
        [];

      setBooks(booksData);
      } catch (error) {
        toast.error('Failed to fetch your books');
      } finally {
        setIsLoading(false);
      }
    };
    
  useEffect(() => {
    fetchBooks();
    }, []);

  const handleDeleteBook = async (bookId) => {
    if(!bookId) return;
    try {
    await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`);
    setBooks(books.filter((book) => book._id !== bookToDelete));
    toast.success("Book deleted successfully!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete book.");
  }finally{
    setBookToDelete(null);
  }
  };

  const handleCreateBook = () => {
    setIsCreateModalOpen(true);
  };

  const handleBookcreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);

      // REFRESH books after creating
    setTimeout(() => {
      fetchBooks();
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className='container mx-auto px-16 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-xl font-bold text-slate-900'>All Books</h1>
            <p className='text-[16px] text-slate-600 mt-1'>Manage your ebooks and create new ones</p>
          </div>
          <Button onClick={handleCreateBook} className='whitespace-nowrap' icon={Plus}>
            Create New Book
          </Button>
        </div> 

        {isLoading ? (    
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({length: 4}).map((_,i)=>(
              <BookCardSkeleton key={i}/>
            ))}
          </div> 
          ) : books.length === 0 ? (
            <div className='flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-slate-200 rounded-xl mt-8'>
              <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4'> 
                <Book className='w-8 h-8 text-slate-400'/>
              </div>
              <h3 className='text-lg font-medium text-slate-900 mb-2'>
                No eBooks found
              </h3>
              <p className='text-slate-600 mb-6 max-w-md'>
                It looks like you haven't created any ebooks yet. Click the button above to create your first ebook and start your writing journey with BookGenie!
              </p>
              <Button onClick={handleCreateBook}>Create Your First Book</Button>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {books.map((book) =>(
                <BookCard 
                key={book._id || book.id}
                book={book} 
                onDelete={()=> setBookToDelete(book._id)}/>
              ))}
              
            </div>
          )}

        <ConfirmationModal 
          isOpen={!!bookToDelete}
          onClose={()=> setBookToDelete(null)}
          onConfirm={handleDeleteBook}
          title="Confirm Delete"
          message="Are you sure you want to delete this book? This action cannot be undone."
        />

        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={()=> setIsCreateModalOpen(false)}
          onBookCreated={handleBookcreated}
        />
        
      </div>
    </DashboardLayout>  
  )
} 

export default DashboardPage
