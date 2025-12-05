// material-ui
import Typography from '@mui/material/Typography';
import { GlobalStyles } from '@mui/system';

export default function HomePage() {
  return (
    <>
      {/* load Poppins font */}
      <GlobalStyles
        styles={`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
        `}
      />

      <div
        style={{
          backgroundImage: "url('/home-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",   // <-- move text to top area
          alignItems: "center",
          textAlign: "center",

          paddingTop: "120px",  // now this actually works
          paddingLeft: "180px",
          paddingRight: "20px"
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: "Montserrat",
            color: "#fff",
            fontWeight: 600,
            letterSpacing: "1px",
            textShadow: "0 3px 10px rgba(0,0,0,0.7)",
            mb: 2,
          }}
        >
          Welcome to Group 4 Movies and TV-Shows Website!
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "Montserrat",
            color: "#f0f0f0",
            fontWeight: 300,
            maxWidth: "800px",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Search and explore movies and TV shows easily using the menu on the left.
        </Typography>
      </div>
    </>
  );
}
