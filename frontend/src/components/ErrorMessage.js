import React from "react";
import Alert from 'react-bootstrap/Alert';

const ErrorMessage = ({ variant = "info", children }) => {
  return (
<Alert variant={variant} style={{ fontSize: 20, color: 'white', backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
      <strong>{children}</strong>
    </Alert>
  );
};

export default ErrorMessage;