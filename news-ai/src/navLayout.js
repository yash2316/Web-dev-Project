import { Outlet, NavLink} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  return (
    <>
      
      <div className="container-fluid d-flex flex-wrap justify-content-center align-items-center nav-bar  p-2">
          <NavLink to="/" activeClassName="active" className="nav-link-">HOME</NavLink>
          <NavLink to="/NATIONAL" activeClassName="active" className="nav-link-">NATIONAL</NavLink>
          <NavLink to="/BUSINESS" activeClassName="active" className="nav-link-">BUSINESS</NavLink>
          <NavLink to="/WORLD" activeClassName="active" className="nav-link-">WORLD</NavLink>
          <NavLink to="/TECHNOLOGY" activeClassName="active"  className="nav-link-">TECHNOLOGY</NavLink>
          <NavLink to="/SPORTS" activeClassName="active" className="nav-link-">SPORTS</NavLink>
          <NavLink to="/SCIENCE" activeClassName="active" className="nav-link-">SCIENCE</NavLink>
          <NavLink to="/HEALTH" activeClassName="active" className="nav-link-">HEALTH</NavLink>
          <NavLink to="/ENTERTAINMENT" activeClassName="active" className="nav-link-">ENTERTAINMENT</NavLink>
        </div>

      <Outlet />
    </>
  )
};

export default Layout;