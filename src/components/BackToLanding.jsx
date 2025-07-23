import { Link } from 'react-router-dom'

const BackToLanding = _ => {
    return (
        <div className="absolute top-4 left-4">
            <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition border border-zinc-700 px-3 py-1 rounded hover:bg-zinc-800"
            >
                ← Back to Home
            </Link>
        </div>
    )
}

export default BackToLanding
