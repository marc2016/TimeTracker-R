import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { CssBaseline, Container, Box, Typography, Button, TextField, Paper } from "@mui/material";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <Container maxWidth="md">
      <CssBaseline />
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          TimeTracker-R
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank">
            <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </Box>
        <Typography variant="body1" gutterBottom>
          Click on the Tauri, Vite, and React logos to learn more.
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4, width: '100%', maxWidth: 500 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <TextField
              id="greet-input"
              label="Enter a name..."
              variant="outlined"
              fullWidth
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <Button variant="contained" type="submit" size="large">
              Greet
            </Button>
          </form>
          {greetMsg && (
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
              {greetMsg}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
