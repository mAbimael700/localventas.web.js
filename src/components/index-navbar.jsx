export default function Navbar({children, style}){

    return (
        <nav style={style} className="place-items-center grid grid-cols-3 p-4" >
            {children}
        </nav>
    )
}