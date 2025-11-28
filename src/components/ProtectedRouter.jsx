import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase";

export function ProtectedRoute({ children }) {
  
  const [setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  auth.onAuthStateChanged((user) => {
    if (!user) {
      navigate("/login");
    } else {
      setIsLoading(false);
      
      if (user && user.email === 'admin@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        navigate("/");
      }
    }
  });

  if (isLoading) {
    return (
      <div>Cargando...</div>
    );
  }

  return children;
}
export default ProtectedRoute;