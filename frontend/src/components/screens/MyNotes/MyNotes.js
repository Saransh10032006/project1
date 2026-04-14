import { useEffect, useState } from "react";
import { Accordion, Badge, Button, Card, Form, Modal } from "react-bootstrap";
import MainScreen from "../../../components/MainScreen";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create Note states
  const [showCreate, setShowCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createCategory, setCreateCategory] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Edit Note states
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const navigate = useNavigate();

  const getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return null;
    }
    return userInfo;
  };

  const getConfig = () => {
    const userInfo = getUserInfo();
    if (!userInfo) return null;
    return {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
  };

  const fetchNotes = async () => {
    try {
      const config = getConfig();
      if (!config) return;

      setLoading(true);
      const { data } = await axios.get('/api/notes', config);
      setNotes(data);
      setLoading(false);
    } catch (error) {
      setError(error.response && error.response.data.message ? error.response.data.message : error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchNotes();
    // eslint-disable-next-line
  }, [navigate]);

  // DELETE handler
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const config = getConfig();
        if (!config) return;

        await axios.delete(`/api/notes/${id}`, config);
        setNotes(notes.filter((note) => note._id !== id));
      } catch (error) {
        console.error(error);
        alert("Error deleting note");
      }
    }
  };

  // CREATE handler
  const createHandler = async (e) => {
    e.preventDefault();
    try {
      const config = getConfig();
      if (!config) return;

      config.headers["Content-type"] = "application/json";

      setCreateLoading(true);
      const { data } = await axios.post(
        '/api/notes/create',
        { title: createTitle, content: createContent, category: createCategory },
        config
      );
      setCreateLoading(false);
      setNotes([data, ...notes]);
      setShowCreate(false);
      setCreateTitle("");
      setCreateContent("");
      setCreateCategory("");
      setCreateError(null);
    } catch (error) {
      setCreateError(error.response && error.response.data.message ? error.response.data.message : error.message);
      setCreateLoading(false);
    }
  };

  // EDIT handler
  const openEditModal = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category || "");
    setEditError(null);
    setShowEdit(true);
  };

  const editHandler = async (e) => {
    e.preventDefault();
    try {
      const config = getConfig();
      if (!config) return;

      config.headers["Content-type"] = "application/json";

      setEditLoading(true);
      const { data } = await axios.put(
        `/api/notes/${editId}`,
        { title: editTitle, content: editContent, category: editCategory },
        config
      );
      setEditLoading(false);
      setNotes(notes.map((n) => (n._id === editId ? data : n)));
      setShowEdit(false);
      setEditError(null);
    } catch (error) {
      setEditError(error.response && error.response.data.message ? error.response.data.message : error.message);
      setEditLoading(false);
    }
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <MainScreen title={`Welcome ${userInfo?.name || "User"}...`}>
      <Button
        style={{ marginLeft: 10, marginBottom: 6 }}
        size="lg"
        onClick={() => {
          setCreateError(null);
          setCreateTitle("");
          setCreateContent("");
          setCreateCategory("");
          setShowCreate(true);
        }}
      >
        Create New Note
      </Button>

      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {!loading && notes.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 40, fontSize: 20, color: "#888" }}>
          No notes available
        </div>
      )}

      {notes.map((note) => (
        <Accordion key={note._id}>
          <Card style={{ margin: 10 }}>
            <Card.Header style={{ display: "flex" }}>
              <span
                style={{
                  color: "black",
                  textDecoration: "none",
                  flex: 1,
                  cursor: "pointer",
                  alignSelf: "center",
                  fontSize: 18,
                }}
              >
                <Accordion.Header>{note.title}</Accordion.Header>
              </span>

              <div>
                <Button onClick={() => openEditModal(note)}>Edit</Button>
                <Button
                  variant="danger"
                  className="mx-2"
                  onClick={() => deleteHandler(note._id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Header>

            <Accordion.Body>
              <h4>
                <Badge bg="success">Category - {note.category}</Badge>
              </h4>

              <blockquote className="blockquote mb-0">
                <p>{note.content}</p>
                <footer className="blockquote-footer">
                  Created on{" "}
                  <cite>
                    {note?.createdAt?.substring(0, 10) || "No Date"}
                  </cite>
                </footer>
              </blockquote>
            </Accordion.Body>
          </Card>
        </Accordion>
      ))}

      {/* CREATE NOTE MODAL */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && <ErrorMessage variant="danger">{createError}</ErrorMessage>}
          {createLoading && <Loading size={50} />}
          <Form onSubmit={createHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter content"
                value={createContent}
                onChange={(e) => setCreateContent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={createCategory}
                onChange={(e) => setCreateCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create Note
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* EDIT NOTE MODAL */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <ErrorMessage variant="danger">{editError}</ErrorMessage>}
          {editLoading && <Loading size={50} />}
          <Form onSubmit={editHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Note
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </MainScreen>
  );
};

export default MyNotes;
