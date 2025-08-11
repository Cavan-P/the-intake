import { useState, useEffect } from 'react'
import supabase from '../utils/supabase'

const AvatarPicker = ({ user, setUser }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [avatarOptions, setAvatarOptions] = useState([])

    useEffect(_ => {
        const fetchAvatarUrls = async _ => {
            const { data: files, error } = await supabase
                .storage
                .from('public-avatars')
                .list()

            if(error){
                console.error(error)
                return
            }

            const urls = files.map(file => 
                supabase.storage.from('public-avatars').getPublicUrl(file.name).data.publicUrl
            )

            setAvatarOptions(urls)
        }

        fetchAvatarUrls()
    }, [isOpen])

    const handleAvatarSelect = async url => {

        const { data: { user } } = await supabase.auth.getUser()

        if(!user){
            console.error("Not logged in")
            return
        }

        const { error } = await supabase.from('users').update({ avatar_url: url }).eq('id', user.id)

        if(error){
            console.error("Error updating avatar:", error)
        }

        setUser(prev => ({ ...prev, avatar_url: url }))
        setIsOpen(false)
    }

    return (
        <>
            <img
                src={user.avatar_url || 'https://www.gravatar.com/avatar/?d=mp&s=128'}
                alt={`${user.username}'s avatar`}
                className="w-32 h-32 rounded-full border-2 p-1 cursor-pointer
                           border-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600
                           bg-[length:200%_200%] bg-[position:0%_50%] hover:bg-[position:100%_50%] transition-bg duration-1000"
                onClick={_ => setIsOpen(true)}
            />

            {isOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-black/40 rounded-lg px-6 w-full max-w-xl max-h-[80vh] overflow-y-auto
                                    border-1 border-white/20 py-6 border-gradient-to-r from-blue-400 via-purple-500 to-indigo-600
                                    shadow-lg"
                    >
                        <h2 className="text-2xl font-thin mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                            Choose Your Avatar
                        </h2>
                        <div className="grid grid-cols-5 gap-5">
                            {avatarOptions.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Avatar ${index + 1}`}
                                    className="w-25 h-25 rounded-full border-2 border-transparent cursor-pointer
                                               hover:border-gradient-to-r hover:from-blue-400 hover:via-purple-500 hover:to-indigo-600
                                               hover:scale-110 transition-transform duration-300"
                                    onClick={_ => handleAvatarSelect(url)}
                                />
                            ))}
                        </div>
                        <button
                            onClick={_ => setIsOpen(false)}
                            className="mt-6 px-6 py-2 text-white font-thin rounded border border-indigo-500
                                       hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-500 hover:to-indigo-600
                                       transition-colors duration-300 hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <div className="mt-6 text-center text-xs font-thin text-white/70">
                            Avatars created with{' '}
                            <a href="https://x.com/pablostanley" target="_blank" rel="noopener noreferrer" className="underline font-light hover:text-indigo-400">Pablo Stanley</a>
                            {' '}and{' '}
                            <a href="https://fangpenlin.com" target="_blank" rel="noopener noreferrer" className="underline font-light hover:text-indigo-400">Fang-Pen Lin's</a>
                            {' '}<br />
                            <a href="https://getavataaars.com/" target="_blank" rel="noopener noreferrer" className="underline font-light hover:text-indigo-400"> Avataaars Generator</a>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default AvatarPicker