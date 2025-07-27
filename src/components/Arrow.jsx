const Arrow = ({ direction, onClick }) => {
    const baseClasses = "w-8 h-8 border-t-2 border-r-2 border-white/20 inline-block cursor-pointer"
    const rotation = direction == 'left' ? '-135deg' : '45deg';

    return (
        <span
            onClick={onClick}
            className={baseClasses}
            style={{ transform: `rotate(${rotation})` }}
        />
    )
}

export default Arrow