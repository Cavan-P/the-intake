import { React, useEffect, useState } from 'react'
import supabase from '../utils/supabase'
import { useParams, useNavigate } from 'react-router-dom'

//Components
import BackToHome from '../components/BackToHome'
import AvatarPicker from '../components/AvatarPicker'
import { titleDefinitions } from '../utils/titles'

const Profile = _ => {

    const param = useParams()
    const slug = param.id

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [numPublic, setNumPublic] = useState(0)
    const [titles, setTitles] = useState([])

    const navigate = useNavigate()

    const fetchUser = async slug => {
        if(slug.startsWith('tiid_')){
            const uuid = slug.replace('tiid_', '')

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uuid)
                .single()

                if(error){
                    console.error("Error fetching user from TIID:", error)
                    setError('User not found or error loading profile')
                }

            return data
        }
        else {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', slug)
                .single()

            if(error){
                console.error("Error fetching user from username:", error)
                setError('User not found or error loading profile')
            }

            return data
        }
    }

    useEffect(_ => {
        const fetchData = async _ => {
            const data = await fetchUser(slug)

            if(data){
                setUser(data)

                const { data: numIngredients } = await supabase
                    .from('ingredients')
                    .select('name')
                    .eq('user_id', data.id)
                    .eq('shared', 'TRUE')

                setNumPublic(numIngredients?.length || 0)
                const titleArray = data.titles.split(',')
                setTitles(titleArray)
            }
            setLoading(false)

        }

        fetchData()
    }, [slug])

    if(loading){
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-thin tracking-wide">
                Loading profile...
            </div>
        )
    }

    if(error){
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-thin tracking-wide px-4">
            <BackToHome />
            <p className="text-red-500 text-lg-mt-4">{error}</p>
        </div>
    }

    return (
        <div className="min-h-screen bg-black text-white font-thin tracking-wide px-6 py-12 mx-auto">
            <BackToHome />
        
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <AvatarPicker user={user} setUser={setUser} />
                </div>
        
                {/* User Info */}
                <div className="mt-6 md:mt-0 flex flex-col space-y-4">
                    <h1 className="text-5xl bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        {user.username}
                    </h1>
        
                    {/* Titles */}
                    <div className="flex flex-wrap gap-2">
                        {
                            titles.map((title, index) => {

                                const def = titleDefinitions.find(d => d.name == title)

                                return (
                                    <span title={def?.description || title} key={index} className="hover:cursor-help px-4 py-1 border border-indigo-500 rounded-full text-indigo-400 uppercase text-xs tracking-wide font-semibold">
                                        {title}
                                    </span>
                                )
                            })
                        }
                    </div>
            
                    {/* Bio */}
                    {user.bio && (
                        <p className="text-gray-300 max-w-2xl whitespace-pre-wrap">{user.bio}</p>
                    )}
                </div>
            </div>
        
            {/* Content Sections */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fun Facts */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Public Information</h2>
                    {/* Join Date */}
                    <p className="text-gray-400 text-sm uppercase tracking-wide">
                        {
                            user.id === '17cb1ca8-6854-4cf0-acc1-7c7dc53a70cc'
                                ? "Date Joined: The Beginning"
                                : `Date Joined: ${new Date(user.created_at).toLocaleDateString()}`
                        }
                    </p>
                    <p className="text-indigo-400 font-light">
                        Favorite Macro: {user.favorite_macro}
                    </p>
                    <p className="text-indigo-400 font-light">
                        Public Ingredients: {numPublic}
                    </p>
                    </div>
            
                    {/* Maybe Future Stuff */}
                    <div>
                    <h2 className="text-xl font-semibold mb-3">More Coming Soon</h2>
                    <p className="text-gray-400">Placeholder content.</p>
                </div>
            </div>
        </div>
    )
}

export default Profile