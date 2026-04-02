import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Mail, Lock, User, BookOpen} from 'lucide-react'
import toast from 'react-hot-toast'

import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths'

const SignupPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      const { token} = response.data;

      //fetch profile to get user details
      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`},
      });


      login(profileResponse.data, token);
      toast.success("Account Created successful!");
      navigate('/dashboard');
      
    }catch(error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full mb-4 shadow-md'>
            <BookOpen className='w-8 h-8 text-white'/>
          </div>
          <h1 className='text-3xl font-bold text-slate-900'>Welcome to BookGenie</h1>
          <p className='text-slate-600 mt-2'>Sign up to create and manage your eBooks with ease</p>
        </div>

        <div className='bg-white border border-slate-200 rounded-xl shadow-lg p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <InputField
              icon={User}
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sihara Edirisinghe"
              required
            />
            <InputField
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
            />
            <InputField
              icon={Lock}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
            />
            <Button type="submit" isLoading={isLoading} className='w-full'>
              Create Account
            </Button>
          </form>

          <p className='text-sm text-center text-slate-600 mt-8'>
            Already have an account? {''} <Link to="/login" className='text-violet-600 font-medium hover:text-violet-700'>Sign In</Link>
           </p>
        </div>
        </div>
      </div>
  )
}

export default SignupPage
