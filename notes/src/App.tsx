import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap";
import { Route, Routes, Navigate } from "react-router"
import { NewNote } from "./NewNote";

function App(){
  return (
  <Container className="mx-2">
    <Routes>
      <Route path="/" element={<h1>Hello World!</h1>} />
      <Route path="/new" element={<NewNote />} />
      <Route path="/:id">
        <Route index element={<h1>Show</h1>} />
        <Route path="edit" element={<h1>Edit</h1>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Container>
  );
}

export default App

