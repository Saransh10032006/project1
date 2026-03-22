import {useEffect, useState } from "react";
import { Accordion, Badge, Button, Card } from "react-bootstrap";
import MainScreen from "../../../components/MainScreen";
import { Link } from "react-router-dom";
import axios from 'axios';

const MyNotes = () => {

  const [notes,setNotes] = useState([]);
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")){
    }
  };

  const fetchNotes = async() => {
    const {data} = await axios.get('/api/notes');

    setNotes(data);

    console.log(data);
    
    
  }

  useEffect(() => {
    fetchNotes();
  }, [])

  return (
    <MainScreen title="Saransh">
      <Link to="/createnote">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Create new Note
        </Button>
      </Link>
       {notes.map((note) => (
          <Accordion key={notes._id}>
          <Card style={{ margin: 10 }} key={note._id}>
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
                <Button href={`/note/${note._id}`}>Edit</Button>
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
                <Badge varient="success">Category - {note.category}</Badge>
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

    </MainScreen>
  );
};

export default MyNotes;
