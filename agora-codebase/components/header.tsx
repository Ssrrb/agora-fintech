export const Header =() => {
    return (
        <header className="bg-gradient-to-b  from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36 justify-between p-4 text-white">
        <div className="text-lg font-bold">My App</div>
        <nav>
            <ul className="flex space-x-4">
            <li>
                <a href="/" className="hover:text-gray-400">Home</a>
            </li>
            <li>
                <a href="/about" className="hover:text-gray-400">About</a>
            </li>
            <li>
                <a href="/contact" className="hover:text-gray-400">Contact</a>
            </li>
            </ul>
        </nav>
        </header>
    );
}
