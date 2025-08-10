import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'

//CSS
import './App.css'

//Components


//Pages
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import GetStarted from "./pages/Get-Started"
import Home from "./pages/Home"
import AddIngredient from './pages/AddIngredient'
import Ingredients from './pages/Ingredients'
import Settings from './pages/Settings'
import Recipes from './pages/Recipes'
import AddRecipe from './pages/AddRecipe'
import RecipeView from './pages/RecipeView'
import EditIngredient from './pages/EditIngredient'
import EditRecipe from './pages/EditRecipe'
import IngredientView from './pages/IngredientView'
import DailyLog from './pages/DailyLog'
import Reports from './pages/Reports'
import Profile from './pages/Profile'

function App() {
  const { id } = useParams()

  return (
    <Routes>
      <Route path='/' element={<Landing /> } />
      <Route path='login' element={<Login /> } />
      <Route path='signup' element={<Signup /> } />
      <Route path='get-started' element={<GetStarted /> } />
      <Route path='/home' element={<Home /> } />
      <Route path='/add-ingredient' element={<AddIngredient /> } />
      <Route path='/ingredients' element={<Ingredients /> } />
      <Route path='/settings' element={<Settings /> } />
      <Route path='/recipes' element={<Recipes /> } />
      <Route path="/add-recipe" element={<AddRecipe /> } />
      <Route path='/recipes/:id' element={<RecipeView /> } />
      <Route path='/ingredients/:id/edit' element={<EditIngredient /> } />
      <Route path="/recipes/:id/edit" element={<EditRecipe /> } />
      <Route path="/ingredients/:id" element={<IngredientView /> } />
      <Route path="/log" element={<DailyLog /> } />
      <Route path="/reports" element={<Reports /> } />
      <Route path="/profile/:id" element={<Profile /> } />
    </Routes>
  )
}

export default App
