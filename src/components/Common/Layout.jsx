import './Layout.css'

function Layout({ children }) {
    return (
        <div className="layout">
            <aside className="sidebar">
                <p className="sidebar-title">MENU PRINCIPAL</p>
            </aside>
            <main className="content">
                {children}
            </main>
        </div>
    )
}

export default Layout