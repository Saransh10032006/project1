import { Button, Col, Form, Row } from "react-bootstrap";
import MainScreen from "../../MainScreen";
import { Link } from "react-router-dom";
import { useState } from "react";
import ErrorMessage from "../../ErrorMessage";
import axios from "axios";
import Loading from "../../Loading";

const Registerscreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [picMessage, setPicMessage] = useState(null);
  const [error,setError] = useState(false);
  const [loading,setloading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if(password !== confirmpassword){
      setMessage('Passwords Do Not Match')
    }else{
      setMessage(null)
      try{
        const config = {
          headers :{
            "Content-type":"application/json",
          },
        };


        setloading(true);

        const{data} = await axios.post(
          "/api/users",
          {name, pic, email, password},
          config
        );

        setloading(false);
        localStorage.setItem("userInfo", JSON.stringify(data));
      }catch(error){
        setError(error.response.data.message)
      }

    }
  }

  const postDetails = (pics) =>{

    if(!pics){
      return setPicMessage("Please Select an Image");
    }
    setPicMessage(null);

    if(pics.type === 'image/jpeg' || pics.type === 'image/png' ){
      const data = new FormData();
      data.append('file',pics)
      data.append('upload_preset','notezz')
      data.append('cloud_name','dh4uuvm63')
      fetch ("https://api.cloudinary.com/v1_1/dh4uuvm63/image/upload",{
        method : "post",
        body: data,
      }).then((res)=>res.json())
        .then((data)=>{
          console.log(data);
          
        setPic(data.url.toString())
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  };

  return <MainScreen title="REGISTER">
    <div className="loginContainer">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
        {loading && <Loading />}
        <Form onSubmit={submitHandler}>
          <Form.Group >
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              value={name}
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmpassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {picMessage && (
            <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
          )}
          <Form.Group >
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              onChange={(e)=> postDetails(e.target.files[0])}
              type="file"
              id="custom-file"
              accept="image/png"
              label="Upload Profile Picture"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Have an Account ? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>;
}

export default Registerscreen;
