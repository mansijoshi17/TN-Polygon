import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useMoralis, useMoralisFile } from 'react-moralis';

 
export const ProfileView = () => {
  const { Moralis,user } = useMoralis();


  return (
    <Card  sx={{border:'1px solid #eee'}}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user && user?.attributes?.Avatar?._url ? user?.attributes?.Avatar?._url : '' }
            alt={user && user?.attributes?.username}
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            @{user && user?.attributes?.username}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user && user.attributes.email}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user && user.attributes.bio}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user && user.attributes.skills}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user && user.attributes.purpose }
          </Typography>
        </Box>
      </CardContent>
      <Divider /> 
    </Card>
  );
} 