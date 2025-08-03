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

function App() {
  const { id } = useParams()

  return (
    <Routes>
      //Landing page (CTA, sign in, sign up)
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
    </Routes>
  )
}

export default App
