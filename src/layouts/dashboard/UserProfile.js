 
import { 
  Container,
  Box,
  Typography,
  Grid,
} from "@mui/material"; 
import "./Profile.css";
import Page from "src/components/Page";
import { ProfileView } from "src/components/userprofile/ProfileView";
import { ProfileDetails } from "src/components/userprofile/ProfileDetails"; 

export default function UserProfile() {  
 

  return (
    <Page title="User Profile | TrustifiedNetwork">
      <Box
        component="main"
        sx={{
          flexGrow: 1, 
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{ mb: 3 }}
            variant="h4"
          >
            User Profile
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={4}
              md={4}
              xs={12}
            >
                <ProfileView />
            </Grid>
            <Grid
              item
              lg={8}
              md={8}
              xs={12}
            >
              <ProfileDetails />
            </Grid>
          </Grid>
        </Container>
      </Box>  
    </Page>
  );
}